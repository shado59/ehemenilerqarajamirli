import { Octokit } from 'octokit';

export interface GitHubConfig {
  username: string;
  repository: string;
  token: string;
  branch?: string;
}

export class GitHubService {
  private octokit: Octokit;
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
    this.octokit = new Octokit({ auth: config.token });
  }

  // 1. Faylı oxumaq (JSON)
  async readFile(path: string): Promise<string | null> {
    try {
      const branch = this.config.branch || 'main';
      const response = await this.octokit.rest.repos.getContent({
        owner: this.config.username,
        repo: this.config.repository,
        path,
        ref: branch,
      });

      if ('content' in response.data && typeof response.data.content === 'string') {
        const base64 = response.data.content.replace(/\s/g, '');
        return decodeURIComponent(escape(atob(base64)));
      }
      return null;
    } catch (error) {
      console.error('GitHub Read Error:', error);
      return null;
    }
  }

  // 2. Faylı yeniləmək (JSON)
  async updateFile({ path, content, message }: { path: string, content: string, message: string }): Promise<boolean> {
    try {
      const branch = this.config.branch || 'main';
      let sha: string | undefined;
      
      try {
        const currentFile: any = await this.octokit.rest.repos.getContent({
          owner: this.config.username,
          repo: this.config.repository,
          path,
          ref: branch,
        });
        sha = currentFile.data.sha;
      } catch (e) {}

      const encodedContent = btoa(unescape(encodeURIComponent(content)));

      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.config.username,
        repo: this.config.repository,
        path,
        message,
        content: encodedContent,
        sha,
        branch,
      });

      // Vercel Cache yenilənməsi
      await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revalidate' })
      });

      return true;
    } catch (error) {
      console.error('GitHub Update Error:', error);
      return false;
    }
  }

  // 3. Şəkil yükləmək (Base64)
  async uploadImage(path: string, content: string, message: string): Promise<boolean> {
    try {
      const branch = this.config.branch || 'main';
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.config.username,
        repo: this.config.repository,
        path,
        message,
        content, // Artıq base64 formatındadır
        branch,
      });
      return true;
    } catch (error) {
      console.error('Image Upload Error:', error);
      return false;
    }
  }

  // 4. Bağlantını yoxlamaq
  async testConnection(): Promise<boolean> {
    try {
      await this.octokit.rest.repos.get({
        owner: this.config.username,
        repo: this.config.repository,
      });
      return true;
    } catch { return false; }
  }

  // 5. Branch-ı yoxlamaq
  async validateBranch(): Promise<boolean> {
    try {
      await this.octokit.rest.repos.getBranch({
        owner: this.config.username,
        repo: this.config.repository,
        branch: this.config.branch || 'main',
      });
      return true;
    } catch { return false; }
  }

  // 6. Faylları listələmək
  async listFiles(path: string): Promise<string[]> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.config.username,
        repo: this.config.repository,
        path,
        ref: this.config.branch || 'main',
      });

      if (Array.isArray(response.data)) {
        return response.data
          .filter((item: any) => item.type === 'file')
          .map((item: any) => item.path);
      }
      return [];
    } catch { return []; }
  }
}