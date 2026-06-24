'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import { GitHubService } from '@/lib/github-service';
import { Plus, Trash2, GripVertical, FileText } from 'lucide-react';

interface PublicationItem {
  id: string;
  content: {
    title: { az: string; en: string };
    description: { az: string; en: string };
    author: string;
    year: string;
    link: string;
    category: string;
  };
  visible: boolean;
  order: number;
}

export default function PublicationsManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'az' | 'en'>('az');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [items, setItems] = useState<PublicationItem[]>([]);

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
      const content = await github.readFile('src/content/research.json');
      if (content) {
        const data = JSON.parse(content);
        setItems(data.items.sort((a: PublicationItem, b: PublicationItem) => a.order - b.order));
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load publications' });
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
        path: 'src/content/research.json',
        content: JSON.stringify({ items }, null, 2),
        message: 'Update publications',
      });

      setMessage({ type: 'success', text: 'Publications saved successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save publications' });
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    const newItem: PublicationItem = {
      id: `pub-${Date.now()}`,
      content: {
        title: { az: '', en: '' },
        description: { az: '', en: '' },
        author: '',
        year: '',
        link: '',
        category: '',
      },
      visible: true,
      order: items.length,
    };
    setItems([...items, newItem]);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        if (field.includes('.')) {
          const [parent, child, grandchild] = field.split('.');
          if (grandchild) {
            return {
              ...item,
              [parent]: {
                ...(item[parent as keyof PublicationItem] as any),
                [child]: {
                  ...((item[parent as keyof PublicationItem] as any)[child]),
                  [grandchild]: value
                }
              },
            };
          }
          return {
            ...item,
            [parent]: { ...(item[parent as keyof PublicationItem] as any), [child]: value },
          };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
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
          <h1 className="text-xl font-bold text-amber-100">Publications</h1>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">Research & Publications</h2>
            
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

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-2 text-amber-500/50">
                    <GripVertical size={20} />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-amber-100 text-sm font-medium mb-2">
                          Author
                        </label>
                        <input
                          type="text"
                          value={item.content.author}
                          onChange={(e) => updateItem(item.id, 'content.author', e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-amber-100 text-sm font-medium mb-2">
                          Year
                        </label>
                        <input
                          type="text"
                          value={item.content.year}
                          onChange={(e) => updateItem(item.id, 'content.year', e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-amber-100 text-sm font-medium mb-2">
                          Category
                        </label>
                        <input
                          type="text"
                          value={item.content.category}
                          onChange={(e) => updateItem(item.id, 'content.category', e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">
                        Title ({activeTab.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={item.content.title[activeTab]}
                        onChange={(e) =>
                          updateItem(item.id, `content.title.${activeTab}`, e.target.value)
                        }
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">
                        Description ({activeTab.toUpperCase()})
                      </label>
                      <textarea
                        value={item.content.description[activeTab]}
                        onChange={(e) =>
                          updateItem(item.id, `content.description.${activeTab}`, e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">
                        Link
                      </label>
                      <input
                        type="text"
                        value={item.content.link}
                        onChange={(e) => updateItem(item.id, 'content.link', e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-amber-100">
                        <input
                          type="checkbox"
                          checked={item.visible}
                          onChange={(e) => updateItem(item.id, 'visible', e.target.checked)}
                          className="w-4 h-4 rounded border-amber-500/20 bg-neutral-700 text-amber-500 focus:ring-amber-500"
                        />
                        Visible
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addItem}
              className="w-full py-3 border-2 border-dashed border-amber-500/30 rounded-lg text-amber-100/60 hover:border-amber-500 hover:text-amber-100 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Publication
            </button>

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
