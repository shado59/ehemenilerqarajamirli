'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import { GitHubService } from '@/lib/github-service';
import { Plus, Trash2, GripVertical, Save, ArrowLeft, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ArtifactItem {
  id: string;
  visible: boolean;
  order: number;
  images: string[];
  content: {
    title: { az: string; en: string };
    description: { az: string; en: string };
    period: { az: string; en: string };
    material: { az: string; en: string };
    location: { az: string; en: string };
  };
}

export default function ArtifactsManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'az' | 'en'>('az');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [sectionTitle, setSectionTitle] = useState({ az: '', en: '' });
  const [sectionSubtitle, setSectionSubtitle] = useState({ az: '', en: '' });
  const [items, setItems] = useState<ArtifactItem[]>([]);

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
      const content = await github.readFile('src/content/artifacts.json');
      if (content) {
        const data = JSON.parse(content);
        setSectionTitle(data.title || { az: '', en: '' });
        setSectionSubtitle(data.subtitle || { az: '', en: '' });
        setItems((data.items || []).sort((a: ArtifactItem, b: ArtifactItem) => a.order - b.order));
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load artifacts' });
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
        path: 'src/content/artifacts.json',
        content: JSON.stringify({
          id: 'artifacts',
          visible: true,
          order: 1,
          title: sectionTitle,
          subtitle: sectionSubtitle,
          items: items.map((item, idx) => ({ ...item, order: idx + 1 })),
        }, null, 2),
        message: 'Update artifacts',
      });

      setMessage({ type: 'success', text: 'Artifacts saved successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save artifacts' });
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    const newItem: ArtifactItem = {
      id: `artifact-${Date.now()}`,
      visible: true,
      order: items.length + 1,
      images: [''],
      content: {
        title: { az: '', en: '' },
        description: { az: '', en: '' },
        period: { az: '', en: '' },
        material: { az: '', en: '' },
        location: { az: '', en: '' },
      },
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
                ...(item[parent as keyof ArtifactItem] as any),
                [child]: {
                  ...((item[parent as keyof ArtifactItem] as any)[child]),
                  [grandchild]: value
                }
              },
            };
          }
          return {
            ...item,
            [parent]: { ...(item[parent as keyof ArtifactItem] as any), [child]: value },
          };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleImageChange = (itemId: string, imgIdx: number, val: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const newImages = [...item.images];
        newImages[imgIdx] = val;
        return { ...item, images: newImages };
      }
      return item;
    }));
  };

  const addImageToItem = (itemId: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return { ...item, images: [...item.images, ''] };
      }
      return item;
    }));
  };

  const removeImageFromItem = (itemId: string, imgIdx: number) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const newImages = item.images.filter((_, idx) => idx !== imgIdx);
        return { ...item, images: newImages.length > 0 ? newImages : [''] };
      }
      return item;
    }));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      const temp = newItems[index];
      newItems[index] = newItems[targetIndex];
      newItems[targetIndex] = temp;
      setItems(newItems.map((item, idx) => ({ ...item, order: idx + 1 })));
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
        {/* Sidebar */}
        <aside className="w-64 bg-neutral-800 border-r border-amber-500/20 p-6">
          <a
            href="/admin/dashboard"
            className="flex items-center gap-2 text-amber-100/80 hover:text-amber-100 mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </a>
          <h1 className="text-xl font-bold text-amber-100 flex items-center gap-2">
            <Sparkles size={22} className="text-amber-400" />
            <span>Artifacts</span>
          </h1>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">Archaeological Finds & Artifacts</h2>

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
            {/* Section Settings */}
            <div className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-100 mb-4">Section Header Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">Section Title</label>
                  <input
                    type="text"
                    value={sectionTitle[activeTab]}
                    onChange={(e) => setSectionTitle({ ...sectionTitle, [activeTab]: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-amber-100 text-sm font-medium mb-2">Section Subtitle</label>
                  <input
                    type="text"
                    value={sectionSubtitle[activeTab]}
                    onChange={(e) => setSectionSubtitle({ ...sectionSubtitle, [activeTab]: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Artifact Items */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col gap-1 mt-2 text-amber-500/50">
                      <button
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className="hover:text-amber-100 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <GripVertical size={20} className="mx-auto" />
                      <button
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === items.length - 1}
                        className="hover:text-amber-100 disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>

                    <div className="flex-1 space-y-4">
                      {/* Title */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-amber-100 text-sm font-medium mb-2">
                            Title ({activeTab.toUpperCase()})
                          </label>
                          <input
                            type="text"
                            value={item.content.title[activeTab]}
                            onChange={(e) => updateItem(item.id, `content.title.${activeTab}`, e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                            placeholder="e.g. Keramika Qablar"
                          />
                        </div>
                        <div>
                          <label className="block text-amber-100 text-sm font-medium mb-2">
                            Material ({activeTab.toUpperCase()})
                          </label>
                          <input
                            type="text"
                            value={item.content.material[activeTab]}
                            onChange={(e) => updateItem(item.id, `content.material.${activeTab}`, e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                            placeholder="e.g. Keramika"
                          />
                        </div>
                      </div>

                      {/* Period & Location */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-amber-100 text-sm font-medium mb-2">
                            Period ({activeTab.toUpperCase()})
                          </label>
                          <input
                            type="text"
                            value={item.content.period[activeTab]}
                            onChange={(e) => updateItem(item.id, `content.period.${activeTab}`, e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                            placeholder="e.g. e.ə. VI-V əsrlər"
                          />
                        </div>
                        <div>
                          <label className="block text-amber-100 text-sm font-medium mb-2">
                            Find Location ({activeTab.toUpperCase()})
                          </label>
                          <input
                            type="text"
                            value={item.content.location[activeTab]}
                            onChange={(e) => updateItem(item.id, `content.location.${activeTab}`, e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                            placeholder="e.g. Şimal qanad, Otaq 3"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-amber-100 text-sm font-medium mb-2">
                          Description ({activeTab.toUpperCase()})
                        </label>
                        <textarea
                          value={item.content.description[activeTab]}
                          onChange={(e) => updateItem(item.id, `content.description.${activeTab}`, e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Images List */}
                      <div>
                        <label className="block text-amber-100 text-sm font-medium mb-2">Images (URLs)</label>
                        <div className="space-y-2">
                          {item.images.map((img, imgIdx) => (
                            <div key={imgIdx} className="flex gap-2 items-center">
                              <span className="text-amber-100/55 text-xs">{imgIdx + 1}.</span>
                              <input
                                type="text"
                                value={img}
                                onChange={(e) => handleImageChange(item.id, imgIdx, e.target.value)}
                                className="flex-1 px-4 py-2 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                                placeholder="/images/artifacts/sample.jpg"
                              />
                              <button
                                onClick={() => removeImageFromItem(item.id, imgIdx)}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                                title="Remove Image"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addImageToItem(item.id)}
                            className="mt-2 text-sm text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                          >
                            <Plus size={16} />
                            Add Image URL
                          </button>
                        </div>
                      </div>

                      {/* Visibility */}
                      <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 text-amber-100">
                          <input
                            type="checkbox"
                            checked={item.visible}
                            onChange={(e) => updateItem(item.id, 'visible', e.target.checked)}
                            className="w-4 h-4 rounded border-amber-500/20 bg-neutral-700 text-amber-500 focus:ring-amber-500"
                          />
                          Visible on Site
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Artifact"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="w-full py-3 border-2 border-dashed border-amber-500/30 rounded-lg text-amber-100/60 hover:border-amber-500 hover:text-amber-100 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Artifact
            </button>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save size={18} />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
