import { Octokit } from 'octokit';

export interface GitHubConfig {
  username: string;
  repository: string;
  token: string;
  branch?: string;
}

export interface FileUpdate {
  path: string;
  content: string;
  message: string;
}

export class GitHubService {
  private octokit: Octokit | null = null;
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
    if (config.token !== 'local') {
      this.octokit = new Octokit({ auth: config.token });
    }
  }

  async testConnection(): Promise<boolean> {
    if (this.config.token === 'local') return true;
    if (!this.octokit) return false;
    try {
      await this.octokit.rest.repos.get({
        owner: this.config.username,
        repo: this.config.repository,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async validateBranch(): Promise<boolean> {
    if (this.config.token === 'local') return true;
    if (!this.octokit) return false;
    try {
      const branch = this.config.branch || 'main';
      await this.octokit.rest.repos.getBranch({
        owner: this.config.username,
        repo: this.config.repository,
        branch,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async readFile(path: string): Promise<string | null> {
    if (this.config.token === 'local') {
      try {
        const response = await fetch(`/api/admin/content?path=${encodeURIComponent(path)}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.content;
      } catch (error) {
        return null;
      }
    }

    if (!this.octokit) return null;
    try {
      const branch = this.config.branch || 'main';
      const response = await this.octokit.rest.repos.getContent({
        owner: this.config.username,
        repo: this.config.repository,
        path,
        ref: branch,
      });

      if ('content' in response.data && typeof response.data.content === 'string') {
        return Buffer.from(response.data.content, 'base64').toString('utf-8');
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async updateFile(update: FileUpdate): Promise<boolean> {
    if (this.config.token === 'local') {
      try {
        const response = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update', path: update.path, content: update.content }),
        });
        return response.ok;
      } catch (error) {
        return false;
      }
    }

    if (!this.octokit) return false;
    try {
      const branch = this.config.branch || 'main';
      let sha: string | undefined;
      try {
        const currentFile: any = await this.octokit.rest.repos.getContent({
          owner: this.config.username,
          repo: this.config.repository,
          path: update.path,
          ref: branch,
        });
        sha = currentFile.data.sha;
      } catch (e) {}

      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.config.username,
        repo: this.config.repository,
        path: update.path,
        message: update.message,
        content: Buffer.from(update.content).toString('base64'),
        sha,
        branch,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async uploadImage(path: string, content: string, message: string): Promise<boolean> {
    if (this.config.token === 'local') {
      try {
        const response = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'upload', path, content }),
        });
        return response.ok;
      } catch (error) {
        return false;
      }
    }

    if (!this.octokit) return false;
    try {
      const branch = this.config.branch || 'main';
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.config.username,
        repo: this.config.repository,
        path,
        message,
        content, // base64 content
        branch,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteFile(path: string, message: string): Promise<boolean> {
    if (this.config.token === 'local') {
      try {
        const response = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', path }),
        });
        return response.ok;
      } catch (error) {
        return false;
      }
    }

    if (!this.octokit) return false;
    try {
      const branch = this.config.branch || 'main';
      const currentFile: any = await this.octokit.rest.repos.getContent({
        owner: this.config.username,
        repo: this.config.repository,
        path,
        ref: branch,
      });

      if (currentFile.data.sha) {
        await this.octokit.rest.repos.deleteFile({
          owner: this.config.username,
          repo: this.config.repository,
          path,
          message,
          sha: currentFile.data.sha,
          branch,
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async listFiles(path: string): Promise<string[]> {
    if (this.config.token === 'local') {
      try {
        const response = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list', path }),
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.files || [];
      } catch (error) {
        return [];
      }
    }

    if (!this.octokit) return [];
    try {
      const branch = this.config.branch || 'main';
      const response = await this.octokit.rest.repos.getContent({
        owner: this.config.username,
        repo: this.config.repository,
        path,
        ref: branch,
      });

      if (Array.isArray(response.data)) {
        return response.data
          .filter((item: any) => item.type === 'file')
          .map((item: any) => item.path);
      }
      return [];
    } catch (error) {
      return [];
    }
  }
}