'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import { GitHubService } from '@/lib/github-service';

interface SiteContent {
  title: { az: string; en: string };
  description: { az: string; en: string };
  keywords: { az: string; en: string };
}

interface SettingsContent {
  siteName: { az: string; en: string };
  seo: {
    ogTitle: { az: string; en: string };
    ogDescription: { az: string; en: string };
    ogImage: string;
    twitterCard: string;
  };
  contact: {
    email: string;
    address: { az: string; en: string };
    phone: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
}

export default function SiteSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'az' | 'en'>('az');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [siteContent, setSiteContent] = useState<SiteContent>({
    title: { az: '', en: '' },
    description: { az: '', en: '' },
    keywords: { az: '', en: '' },
  });

  const [settingsContent, setSettingsContent] = useState<SettingsContent>({
    siteName: { az: '', en: '' },
    seo: {
      ogTitle: { az: '', en: '' },
      ogDescription: { az: '', en: '' },
      ogImage: '',
      twitterCard: '',
    },
    contact: {
      email: '',
      address: { az: '', en: '' },
      phone: '',
    },
    social: {
      facebook: '',
      twitter: '',
      instagram: '',
    },
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const session = getSession();
    if (!session) {
      router.push('/admin/login');
      return;
    }

    try {
      const github = new GitHubService(session);
      const [site, settings] = await Promise.all([
        github.readFile('src/content/site.json'),
        github.readFile('src/content/settings.json'),
      ]);

      if (site) setSiteContent(JSON.parse(site));
      if (settings) setSettingsContent(JSON.parse(settings));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load content' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const session = getSession();
      if (!session) return;

      const github = new GitHubService(session);

      await Promise.all([
        github.updateFile({
          path: 'src/content/site.json',
          content: JSON.stringify(siteContent, null, 2),
          message: 'Update site content',
        }),
        github.updateFile({
          path: 'src/content/settings.json',
          content: JSON.stringify(settingsContent, null, 2),
          message: 'Update settings content',
        }),
      ]);

      setMessage({ type: 'success', text: 'Settings saved successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-amber-100">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="flex">
        <aside className="w-64 bg-neutral-800 border-r border-amber-500/20 p-6">
          <a href="/admin/dashboard" className="text-xl font-bold text-amber-100 mb-8 block">
            ← Back to Dashboard
          </a>
          <h1 className="text-xl font-bold text-amber-100">Site Settings</h1>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">Site Settings</h2>
            
            {/* Language Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('az')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'az'
                    ? 'bg-amber-500 text-white'
                    : 'bg-neutral-800 text-amber-100/80 hover:bg-neutral-700'
                }`}
              >
                AZ
              </button>
              <button
                onClick={() => setActiveTab('en')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'en'
                    ? 'bg-amber-500 text-white'
                    : 'bg-neutral-800 text-amber-100/80 hover:bg-neutral-700'
                }`}
              >
                EN
              </button>
            </div>

            {message && (
              <div
                className={`px-4 py-3 rounded-lg mb-6 ${
                  message.type === 'success'
                    ? 'bg-green-500/20 text-green-200'
                    : 'bg-red-500/20 text-red-200'
                }`}
              >
                {message.text}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Site Content */}
            <div className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-100 mb-4">Site Content</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">
                    Site Title
                  </label>
                  <input
                    type="text"
                    value={siteContent.title[activeTab]}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        title: { ...siteContent.title, [activeTab]: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={siteContent.description[activeTab]}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        description: { ...siteContent.description, [activeTab]: e.target.value },
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={siteContent.keywords[activeTab]}
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        keywords: { ...siteContent.keywords, [activeTab]: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-100 mb-4">General Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settingsContent.siteName[activeTab]}
                    onChange={(e) =>
                      setSettingsContent({
                        ...settingsContent,
                        siteName: { ...settingsContent.siteName, [activeTab]: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settingsContent.contact.email}
                    onChange={(e) =>
                      setSettingsContent({
                        ...settingsContent,
                        contact: { ...settingsContent.contact, email: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={settingsContent.contact.phone}
                    onChange={(e) =>
                      setSettingsContent({
                        ...settingsContent,
                        contact: { ...settingsContent.contact, phone: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">
                    Address
                  </label>
                  <textarea
                    value={settingsContent.contact.address[activeTab]}
                    onChange={(e) =>
                      setSettingsContent({
                        ...settingsContent,
                        contact: {
                          ...settingsContent.contact,
                          address: { ...settingsContent.contact.address, [activeTab]: e.target.value },
                        },
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-100 mb-4">SEO</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">
                    OG Title
                  </label>
                  <input
                    type="text"
                    value={settingsContent.seo.ogTitle[activeTab]}
                    onChange={(e) =>
                      setSettingsContent({
                        ...settingsContent,
                        seo: {
                          ...settingsContent.seo,
                          ogTitle: { ...settingsContent.seo.ogTitle, [activeTab]: e.target.value },
                        },
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">
                    OG Description
                  </label>
                  <textarea
                    value={settingsContent.seo.ogDescription[activeTab]}
                    onChange={(e) =>
                      setSettingsContent({
                        ...settingsContent,
                        seo: {
                          ...settingsContent.seo,
                          ogDescription: { ...settingsContent.seo.ogDescription, [activeTab]: e.target.value },
                        },
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">
                    OG Image URL
                  </label>
                  <input
                    type="text"
                    value={settingsContent.seo.ogImage}
                    onChange={(e) =>
                      setSettingsContent({
                        ...settingsContent,
                        seo: { ...settingsContent.seo, ogImage: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">
                    Twitter Card Type
                  </label>
                  <input
                    type="text"
                    value={settingsContent.seo.twitterCard}
                    onChange={(e) =>
                      setSettingsContent({
                        ...settingsContent,
                        seo: { ...settingsContent.seo, twitterCard: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-100 mb-4">Social Media</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={settingsContent.social.facebook}
                    onChange={(e) =>
                      setSettingsContent({
                        ...settingsContent,
                        social: { ...settingsContent.social, facebook: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">
                    Twitter
                  </label>
                  <input
                    type="text"
                    value={settingsContent.social.twitter}
                    onChange={(e) =>
                      setSettingsContent({
                        ...settingsContent,
                        social: { ...settingsContent.social, twitter: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={settingsContent.social.instagram}
                    onChange={(e) =>
                      setSettingsContent({
                        ...settingsContent,
                        social: { ...settingsContent.social, instagram: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
