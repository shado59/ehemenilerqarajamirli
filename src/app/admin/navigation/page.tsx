'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import { GitHubService } from '@/lib/github-service';
import { Plus, Trash2, GripVertical, Save, ArrowLeft, Navigation as NavIcon } from 'lucide-react';

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
        setItems(data.items.sort((a: NavItem, b: NavItem) => a.order - b.order));
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
        content: JSON.stringify({ id: 'navigation', visible: true, order: 1, items }, null, 2),
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
      content: {
        label: { az: '', en: '' },
        href: '',
      },
      visible: true,
      order: items.length + 1,
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
          const [parent, child] = field.split('.');
          return {
            ...item,
            // XƏTANIN HƏLLİ BURADADIR: (item[parent as keyof NavItem] as any)
            [parent]: { ...(item[parent as keyof NavItem] as any), [child]: value },
          };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-neutral-600 dark:text-amber-100">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-amber-500/20 p-6 min-h-screen">
          <a
            href="/admin/dashboard"
            className="flex items-center gap-2 text-neutral-600 dark:text-amber-100/80 hover:text-amber-600 mb-8 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Dashboard-a qayıt</span>
          </a>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-amber-100 flex items-center gap-2">
            <NavIcon size={22} className="text-amber-600 dark:text-amber-400" />
            <span>Navigation</span>
          </h1>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-amber-100 mb-4">Menyu İdarəetməsi</h2>

            {/* Language Tabs */}
            <div className="flex gap-2 mb-6">
              {(['az', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`px-4 py-2 rounded-lg font-bold uppercase transition-colors ${
                    activeTab === lang
                      ? 'bg-amber-600 text-white'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-amber-100/80 border border-neutral-200 dark:border-amber-500/20'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {message && (
              <div className={`px-4 py-3 rounded-lg mb-6 font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                {message.text}
              </div>
            )}
          </div>

          <div className="space-y-4 max-w-4xl">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-amber-500/20 rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="mt-3 text-neutral-400 dark:text-amber-500/50 cursor-grab">
                    <GripVertical size={20} />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-700 dark:text-amber-100 text-sm font-bold mb-2">
                        Başlıq ({activeTab.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={item.content.label[activeTab]}
                        onChange={(e) => updateItem(item.id, `content.label.${activeTab}`, e.target.value)}
                        className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-amber-500/20 rounded-lg text-neutral-900 dark:text-amber-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-700 dark:text-amber-100 text-sm font-bold mb-2">
                        Keçid Linki (Href)
                      </label>
                      <input
                        type="text"
                        value={item.content.href}
                        onChange={(e) => updateItem(item.id, 'content.href', e.target.value)}
                        className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-amber-500/20 rounded-lg text-neutral-900 dark:text-amber-100 focus:outline-none focus:border-amber-500 font-mono text-sm"
                      />
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <label className="inline-flex items-center gap-2 text-neutral-700 dark:text-amber-100 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.visible}
                          onChange={(e) => updateItem(item.id, 'visible', e.target.checked)}
                          className="w-4 h-4 rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
                        />
                        Saytda Göstər
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <button