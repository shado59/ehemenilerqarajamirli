'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import { GitHubService } from '@/lib/github-service';

export default function MapsManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'az' | 'en'>('az');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [map2d, setMap2d] = useState('');
  const [map3d, setMap3d] = useState('');
  const [description, setDescription] = useState({ az: '', en: '' });

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
      const content = await github.readFile('src/content/maps.json');
      if (content) {
        const data = JSON.parse(content);
        setMap2d(data.map2d || '');
        setMap3d(data.map3d || '');
        setDescription(data.description || { az: '', en: '' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load maps' });
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

      await github.updateFile({
        path: 'src/content/maps.json',
        content: JSON.stringify({ map2d, map3d, description }, null, 2),
        message: 'Update maps',
      });

      setMessage({ type: 'success', text: 'Maps saved successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save maps' });
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
          <h1 className="text-xl font-bold text-amber-100">Maps</h1>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">Maps Section</h2>
            
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
            <div className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-100 mb-4">2D Map</h3>
              
              <div>
                <label className="block text-amber-100 text-sm font-medium mb-2">
                  2D Map Image URL
                </label>
                <input
                  type="text"
                  value={map2d}
                  onChange={(e) => setMap2d(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  placeholder="/images/maps/2d-map.jpg"
                />
              </div>
            </div>

            <div className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-100 mb-4">3D Map</h3>
              
              <div>
                <label className="block text-amber-100 text-sm font-medium mb-2">
                  3D Map Image URL
                </label>
                <input
                  type="text"
                  value={map3d}
                  onChange={(e) => setMap3d(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  placeholder="/images/maps/3d-map.jpg"
                />
              </div>
            </div>

            <div className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-100 mb-4">Description</h3>
              
              <div>
                <label className="block text-amber-100 text-sm font-medium mb-2">
                  Description ({activeTab.toUpperCase()})
                </label>
                <textarea
                  value={description[activeTab]}
                  onChange={(e) =>
                    setDescription({ ...description, [activeTab]: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                />
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
