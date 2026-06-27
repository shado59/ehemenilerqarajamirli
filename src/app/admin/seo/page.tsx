'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import { GitHubService } from '@/lib/github-service';
import { ArrowLeft, Save, Search, Globe, Share2 } from 'lucide-react';

export default function SeoSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'az' | 'en'>('az');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [rawSite, setRawSite] = useState<any>({});
  const [rawSettings, setRawSettings] = useState<any>({});

  const [siteContent, setSiteContent] = useState({
    title: { az: '', en: '' },
    description: { az: '', en: '' },
    keywords: { az: '', en: '' },
  });

  const [seoSettings, setSeoSettings] = useState({
    ogTitle: { az: '', en: '' },
    ogDescription: { az: '', en: '' },
    ogImage: '',
    twitterCard: '',
  });

  useEffect(() => {
    const load = async () => {
      const session = getSession();
      if (!session) { router.push('/admin/login'); return; }
      try {
        const github = new GitHubService(session);
        const [site, settings] = await Promise.all([
          github.readFile('src/content/site.json'),
          github.readFile('src/content/settings.json'),
        ]);
        if (site) {
          const siteData = JSON.parse(site);
          setRawSite(siteData);
          const c = siteData.content || siteData;
          setSiteContent({
            title: c.title || { az: '', en: '' },
            description: c.description || { az: '', en: '' },
            keywords: c.keywords || { az: '', en: '' },
          });
        }
        if (settings) {
          const settingsData = JSON.parse(settings);
          setRawSettings(settingsData);
          const seo = settingsData.content?.seo || settingsData.seo || {};
          setSeoSettings({
            ogTitle: seo.ogTitle || { az: '', en: '' },
            ogDescription: seo.ogDescription || { az: '', en: '' },
            ogImage: seo.ogImage || '',
            twitterCard: seo.twitterCard || '',
          });
        }
      } catch {
        setMessage({ type: 'error', text: 'Failed to load SEO settings' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const session = getSession();
      if (!session) return;
      const github = new GitHubService(session);

      const updatedSite = {
        ...rawSite,
        content: { ...(rawSite.content || {}), ...siteContent },
      };

      const updatedSettings = {
        ...rawSettings,
        content: {
          ...(rawSettings.content || {}),
          seo: seoSettings,
        },
      };

      await Promise.all([
        github.updateFile({ path: 'src/content/site.json', content: JSON.stringify(updatedSite, null, 2), message: 'Update SEO site content' }),
        github.updateFile({ path: 'src/content/settings.json', content: JSON.stringify(updatedSettings, null, 2), message: 'Update SEO settings' }),
      ]);

      setMessage({ type: 'success', text: 'SEO settings saved successfully' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save SEO settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-neutral-900 flex items-center justify-center"><div className="text-amber-100">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="flex">
        <aside className="w-64 bg-neutral-800 border-r border-amber-500/20 p-6 min-h-screen">
          <a href="/admin/dashboard" className="flex items-center gap-2 text-amber-100/80 hover:text-amber-100 mb-8 transition-colors">
            <ArrowLeft size={18} /> Back to Dashboard
          </a>
          <h1 className="text-xl font-bold text-amber-100 flex items-center gap-2">
            <Search size={22} className="text-amber-400" /> SEO Editor
          </h1>
        </aside>
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold text-amber-100 mb-4">Search Engine Optimization</h2>
          <div className="flex gap-2 mb-6">
            {(['az', 'en'] as const).map(lang => (
              <button key={lang} onClick={() => setActiveTab(lang)}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === lang ? 'bg-amber-500 text-white' : 'bg-neutral-800 text-amber-100/80 hover:bg-neutral-700'}`}>
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          {message && (
            <div className={`px-4 py-3 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
              {message.text}
            </div>
          )}
          <div className="space-y-6 max-w-4xl">
            <div className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-100 mb-4 flex items-center gap-2">
                <Globe size={20} className="text-amber-400" /> Search Engine Meta Tags
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">Meta Title ({activeTab.toUpperCase()})</label>
                  <input type="text" value={siteContent.title[activeTab]}
                    onChange={e => setSiteContent({ ...siteContent, title: { ...siteContent.title, [activeTab]: e.target.value } })}
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                    placeholder="Enter page title for search engines" />
                </div>
                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">Meta Description ({activeTab.toUpperCase()})</label>
                  <textarea value={siteContent.description[activeTab]}
                    onChange={e => setSiteContent({ ...siteContent, description: { ...siteContent.description, [activeTab]: e.target.value } })}
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                    placeholder="Provide a concise description of the site" />
                </div>
                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">Meta Keywords ({activeTab.toUpperCase()})</label>
                  <input type="text" value={siteContent.keywords[activeTab]}
                    onChange={e => setSiteContent({ ...siteContent, keywords: { ...siteContent.keywords, [activeTab]: e.target.value } })}
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                    placeholder="keywords, separated, by, commas" />
                </div>
              </div>
            </div>
            <div className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-100 mb-4 flex items-center gap-2">
                <Share2 size={20} className="text-amber-400" /> Social Media Open Graph Tags
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">OG Title ({activeTab.toUpperCase()})</label>
                  <input type="text" value={seoSettings.ogTitle[activeTab]}
                    onChange={e => setSeoSettings({ ...seoSettings, ogTitle: { ...seoSettings.ogTitle, [activeTab]: e.target.value } })}
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                    placeholder="Enter social share title" />
                </div>
                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">OG Description ({activeTab.toUpperCase()})</label>
                  <textarea value={seoSettings.ogDescription[activeTab]}
                    onChange={e => setSeoSettings({ ...seoSettings, ogDescription: { ...seoSettings.ogDescription, [activeTab]: e.target.value } })}
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                    placeholder="Enter social share description" />
                </div>
                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">OG Image URL</label>
                  <input type="text" value={seoSettings.ogImage}
                    onChange={e => setSeoSettings({ ...seoSettings, ogImage: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                    placeholder="/images/og-image.jpg" />
                </div>
                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">Twitter Card Type</label>
                  <input type="text" value={seoSettings.twitterCard}
                    onChange={e => setSeoSettings({ ...seoSettings, twitterCard: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                    placeholder="summary_large_image" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
                <Save size={18} /> {saving ? 'Saving...' : 'Save SEO Settings'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}