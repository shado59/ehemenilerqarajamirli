'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import { GitHubService } from '@/lib/github-service';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface GalleryItem {
  id: string;
  visible: boolean;
  order: number;
  category: string;
  image: string;
  thumbnail: string;
  content: {
    title: { az: string; en: string };
    description: { az: string; en: string };
  };
}

export default function GalleryManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'az' | 'en'>('az');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [rawData, setRawData] = useState<any>({});

  useEffect(() => {
    const load = async () => {
      const session = getSession();
      if (!session) { router.push('/admin/login'); return; }
      try {
        const github = new GitHubService(session);
        const content = await github.readFile('src/content/gallery.json');
        if (content) {
          const data = JSON.parse(content);
          setRawData(data);
          const list = data.items || [];
          setItems(list.sort((a: GalleryItem, b: GalleryItem) => a.order - b.order));
        }
      } catch {
        setMessage({ type: 'error', text: 'Failed to load gallery' });
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
      await github.updateFile({
        path: 'src/content/gallery.json',
        content: JSON.stringify({ ...rawData, items }, null, 2),
        message: 'Update gallery',
      });
      setMessage({ type: 'success', text: 'Gallery saved successfully' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save gallery' });
    } finally {
      setSaving(false);
    }
  };

  const update = (id: string, path: string, value: any) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      const parts = path.split('.');
      if (parts.length === 1) return { ...item, [parts[0]]: value };
      if (parts.length === 2) return { ...item, [parts[0]]: { ...(item as any)[parts[0]], [parts[1]]: value } };
      return { ...item, [parts[0]]: { ...(item as any)[parts[0]], [parts[1]]: { ...(item as any)[parts[0]][parts[1]], [parts[2]]: value } } };
    }));
  };

  const addItem = () => setItems([...items, {
    id: `gallery-${Date.now()}`, visible: true, order: items.length + 1,
    category: '', image: '', thumbnail: '',
    content: { title: { az: '', en: '' }, description: { az: '', en: '' } }
  }]);

  if (loading) return <div className="min-h-screen bg-neutral-900 flex items-center justify-center"><div className="text-amber-100">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="flex">
        <aside className="w-64 bg-neutral-800 border-r border-amber-500/20 p-6 min-h-screen">
          <a href="/admin/dashboard" className="text-amber-100/80 hover:text-amber-100 mb-8 block">← Back to Dashboard</a>
          <h1 className="text-xl font-bold text-amber-100">Gallery</h1>
        </aside>
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold text-amber-100 mb-4">Gallery</h2>
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
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <GripVertical size={20} className="mt-2 text-amber-500/50" />
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-amber-100 text-sm font-medium mb-2">Image URL</label>
                        <input type="text" value={item.image}
                          onChange={e => update(item.id, 'image', e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                          placeholder="/images/gallery/image.jpg" />
                      </div>
                      <div>
                        <label className="block text-amber-100 text-sm font-medium mb-2">Thumbnail URL</label>
                        <input type="text" value={item.thumbnail}
                          onChange={e => update(item.id, 'thumbnail', e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                          placeholder="/images/gallery/thumb.jpg" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">Category</label>
                      <input type="text" value={item.category}
                        onChange={e => update(item.id, 'category', e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                        placeholder="e.g. artifacts, excavation, architecture" />
                    </div>
                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">Title ({activeTab.toUpperCase()})</label>
                      <input type="text" value={item.content.title[activeTab]}
                        onChange={e => update(item.id, `content.title.${activeTab}`, e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">Description ({activeTab.toUpperCase()})</label>
                      <textarea value={item.content.description[activeTab]}
                        onChange={e => update(item.id, `content.description.${activeTab}`, e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500" />
                    </div>
                    <label className="flex items-center gap-2 text-amber-100">
                      <input type="checkbox" checked={item.visible}
                        onChange={e => update(item.id, 'visible', e.target.checked)}
                        className="w-4 h-4 rounded border-amber-500/20 bg-neutral-700 text-amber-500" />
                      Visible
                    </label>
                  </div>
                  <button onClick={() => setItems(items.filter(i => i.id !== item.id))}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={addItem}
              className="w-full py-3 border-2 border-dashed border-amber-500/30 rounded-lg text-amber-100/60 hover:border-amber-500 hover:text-amber-100 transition-colors flex items-center justify-center gap-2">
              <Plus size={20} /> Add Gallery Item
            </button>
            <div className="flex justify-end">
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}