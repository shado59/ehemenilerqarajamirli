'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import { GitHubService } from '@/lib/github-service';
import { Plus, Trash2, GripVertical, ArrowLeft, Save } from 'lucide-react';

interface NavItem {
  id: string;
  content: {
    label: { az: string; en: string };
    href: string;
  };
  visible: boolean;
  order: number;
}

export default function NavigationManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'az' | 'en'>('az');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [items, setItems] = useState<NavItem[]>([]);

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
      const content = await github.readFile('src/content/navigation.json');
      if (content) {
        const data = JSON.parse(content);
        setItems((data.items || []).sort((a: NavItem, b: NavItem) => a.order - b.order));
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load navigation' });
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
        path: 'src/content/navigation.json',
        content: JSON.stringify({ items }, null, 2),
        message: 'Update navigation',
      });

      setMessage({ type: 'success', text: 'Navigation saved successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save navigation' });
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    const newItem: NavItem = {
      id: `nav-${Date.now()}`,
      content: { label: { az: '', en: '' }, href: '' },
      visible: true,
      order: items.length,
    };
    setItems([...items, newItem]);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item };
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          (updatedItem as any)[parent] = {
            ...(updatedItem[parent as keyof NavItem] as object),
            [child]: value
          };
        } else {
          (updatedItem as any)[field] = value;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  if (loading) {
    return <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-amber-100">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-amber-500/20 p-6 min-h-screen">
          <a href="/admin/dashboard" className="flex items-center gap-2 text-neutral-600 dark:text-amber-100/80 hover:text-amber-600 dark:hover:text-amber-100 mb-8 transition-colors">
            <ArrowLeft size={18} />
            <span>Dashboard-a qayıt</span>
          </a>
          <h1 className="text-xl font-bold text-neutral-800 dark:text-amber-100">Naviqasiya</h1>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neutral-800 dark:text-amber-100 mb-4">Menyu Linkləri</h2>
            
            <div className="flex gap-2 mb-6">
              {(['az', 'en'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`px-4 py-2 rounded-lg transition-colors ${activeTab === lang ? 'bg-amber-500 text-white' : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-amber-100 border border-neutral-200 dark:border-amber-500/20'}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {message && (
              <div className={`px-4 py-3 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200'}`}>
                {message.text}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-amber-500/20 rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="mt-2 text-amber-500/50 cursor-grab"><GripVertical size={20} /></div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-700 dark:text-amber-100 text-sm font-medium mb-2">Başlıq ({activeTab.toUpperCase()})</label>
                        <input
                          type="text"
                          value={item.content.label[activeTab]}
                          onChange={(e) => updateItem(item.id, `content.label.${activeTab}`, e.target.value)}
                          className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-amber-500/20 rounded-lg text-neutral-800 dark:text-amber-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-700 dark:text-amber-100 text-sm font-medium mb-2">Link (Href)</label>
                        <input
                          type="text"
                          value={item.content.href}
                          onChange={(e) => updateItem(item.id, 'content.href', e.target.value)}
                          className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-amber-500/20 rounded-lg text-neutral-800 dark:text-amber-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-neutral-600 dark:text-amber-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.visible}
                        onChange={(e) => updateItem(item.id, 'visible', e.target.checked)}
                        className="w-4 h-4 rounded border-amber-500/20 bg-neutral-700 text-amber-500"
                      />
                      Saytda görünsün
                    </label>
                  </div>

                  <button onClick={() => deleteItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}

            <button onClick={addItem} className="w-full py-4 border-2 border-dashed border-amber-300 dark:border-amber-500/30 rounded-lg text-amber-600 dark:text-amber-100/60 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/5 transition-colors flex items-center justify-center gap-2">
              <Plus size={20} />
              Yeni Link Əlavə Et
            </button>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg"
              >
                <Save size={18} />
                {saving ? 'Yadda saxlanılır...' : 'Dəyişiklikləri Saxla'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}