'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import { GitHubService } from '@/lib/github-service';
import { Plus, Trash2, GripVertical, ExternalLink } from 'lucide-react';

interface Publication {
  id: string;
  visible: boolean;
  order: number;
  content: {
    title: { az: string; en: string };
    authors: { az: string; en: string };
    journal: { az: string; en: string };
    year: string;
    abstract: { az: string; en: string };
    url: string;
  };
}

interface ExternalRef {
  id: string;
  visible: boolean;
  order: number;
  content: {
    title: { az: string; en: string };
    url: string;
    description: { az: string; en: string };
  };
}

export default function PublicationsManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'az' | 'en'>('az');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [externalRefs, setExternalRefs] = useState<ExternalRef[]>([]);
  const [rawData, setRawData] = useState<any>({});

  useEffect(() => {
    const load = async () => {
      const session = getSession();
      if (!session) { router.push('/admin/login'); return; }
      try {
        const github = new GitHubService(session);
        const content = await github.readFile('src/content/research.json');
        if (content) {
          const data = JSON.parse(content);
          setRawData(data);
          const pubs = data.publications || data.items || [];
          const refs = data.externalReferences || [];
          setPublications(pubs.sort((a: Publication, b: Publication) => a.order - b.order));
          setExternalRefs(refs.sort((a: ExternalRef, b: ExternalRef) => a.order - b.order));
        }
      } catch {
        setMessage({ type: 'error', text: 'Failed to load publications' });
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
        path: 'src/content/research.json',
        content: JSON.stringify({ ...rawData, publications, externalReferences: externalRefs }, null, 2),
        message: 'Update research & publications',
      });
      setMessage({ type: 'success', text: 'Saved successfully' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  const updatePub = (id: string, path: string, value: any) => {
    setPublications(publications.map(p => {
      if (p.id !== id) return p;
      const parts = path.split('.');
      if (parts.length === 1) return { ...p, [parts[0]]: value };
      if (parts.length === 2) return { ...p, [parts[0]]: { ...(p as any)[parts[0]], [parts[1]]: value } };
      return { ...p, [parts[0]]: { ...(p as any)[parts[0]], [parts[1]]: { ...(p as any)[parts[0]][parts[1]], [parts[2]]: value } } };
    }));
  };

  const updateRef = (id: string, path: string, value: any) => {
    setExternalRefs(externalRefs.map(r => {
      if (r.id !== id) return r;
      const parts = path.split('.');
      if (parts.length === 1) return { ...r, [parts[0]]: value };
      if (parts.length === 2) return { ...r, [parts[0]]: { ...(r as any)[parts[0]], [parts[1]]: value } };
      return { ...r, [parts[0]]: { ...(r as any)[parts[0]], [parts[1]]: { ...(r as any)[parts[0]][parts[1]], [parts[2]]: value } } };
    }));
  };

  const addPub = () => setPublications([...publications, {
    id: `pub-${Date.now()}`, visible: true, order: publications.length + 1,
    content: { title: { az: '', en: '' }, authors: { az: '', en: '' }, journal: { az: '', en: '' }, year: '', abstract: { az: '', en: '' }, url: '' }
  }]);

  const addRef = () => setExternalRefs([...externalRefs, {
    id: `ref-${Date.now()}`, visible: true, order: externalRefs.length + 1,
    content: { title: { az: '', en: '' }, url: '', description: { az: '', en: '' } }
  }]);

  if (loading) return <div className="min-h-screen bg-neutral-900 flex items-center justify-center"><div className="text-amber-100">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="flex">
        <aside className="w-64 bg-neutral-800 border-r border-amber-500/20 p-6 min-h-screen">
          <a href="/admin/dashboard" className="text-amber-100/80 hover:text-amber-100 mb-8 block">← Back to Dashboard</a>
          <h1 className="text-xl font-bold text-amber-100">Publications</h1>
        </aside>
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold text-amber-100 mb-4">Research & Publications</h2>
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

          {/* PUBLICATIONS */}
          <h3 className="text-xl font-bold text-amber-100 mb-4">Publications</h3>
          <div className="space-y-4 mb-8">
            {publications.map(pub => (
              <div key={pub.id} className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <GripVertical size={20} className="mt-2 text-amber-500/50" />
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">Title ({activeTab.toUpperCase()})</label>
                      <input type="text" value={pub.content.title[activeTab]}
                        onChange={e => updatePub(pub.id, `content.title.${activeTab}`, e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-amber-100 text-sm font-medium mb-2">Authors ({activeTab.toUpperCase()})</label>
                        <input type="text" value={pub.content.authors[activeTab]}
                          onChange={e => updatePub(pub.id, `content.authors.${activeTab}`, e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500" />
                      </div>
                      <div>
                        <label className="block text-amber-100 text-sm font-medium mb-2">Year</label>
                        <input type="text" value={pub.content.year}
                          onChange={e => updatePub(pub.id, 'content.year', e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">Journal ({activeTab.toUpperCase()})</label>
                      <input type="text" value={pub.content.journal[activeTab]}
                        onChange={e => updatePub(pub.id, `content.journal.${activeTab}`, e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">Abstract ({activeTab.toUpperCase()})</label>
                      <textarea value={pub.content.abstract[activeTab]}
                        onChange={e => updatePub(pub.id, `content.abstract.${activeTab}`, e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">URL</label>
                      <input type="text" value={pub.content.url}
                        onChange={e => updatePub(pub.id, 'content.url', e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                        placeholder="https://..." />
                    </div>
                    <label className="flex items-center gap-2 text-amber-100">
                      <input type="checkbox" checked={pub.visible}
                        onChange={e => updatePub(pub.id, 'visible', e.target.checked)}
                        className="w-4 h-4 rounded border-amber-500/20 bg-neutral-700 text-amber-500" />
                      Visible
                    </label>
                  </div>
                  <button onClick={() => setPublications(publications.filter(p => p.id !== pub.id))}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={addPub}
              className="w-full py-3 border-2 border-dashed border-amber-500/30 rounded-lg text-amber-100/60 hover:border-amber-500 hover:text-amber-100 transition-colors flex items-center justify-center gap-2">
              <Plus size={20} /> Add Publication
            </button>
          </div>

          {/* EXTERNAL REFERENCES */}
          <h3 className="text-xl font-bold text-amber-100 mb-4 flex items-center gap-2">
            <ExternalLink size={20} className="text-amber-400" /> External References
          </h3>
          <div className="space-y-4 mb-8">
            {externalRefs.map(ref => (
              <div key={ref.id} className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <GripVertical size={20} className="mt-2 text-amber-500/50" />
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">Title ({activeTab.toUpperCase()})</label>
                      <input type="text" value={ref.content.title[activeTab]}
                        onChange={e => updateRef(ref.id, `content.title.${activeTab}`, e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">Description ({activeTab.toUpperCase()})</label>
                      <input type="text" value={ref.content.description[activeTab]}
                        onChange={e => updateRef(ref.id, `content.description.${activeTab}`, e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">URL</label>
                      <input type="text" value={ref.content.url}
                        onChange={e => updateRef(ref.id, 'content.url', e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                        placeholder="https://..." />
                    </div>
                    <label className="flex items-center gap-2 text-amber-100">
                      <input type="checkbox" checked={ref.visible}
                        onChange={e => updateRef(ref.id, 'visible', e.target.checked)}
                        className="w-4 h-4 rounded border-amber-500/20 bg-neutral-700 text-amber-500" />
                      Visible
                    </label>
                  </div>
                  <button onClick={() => setExternalRefs(externalRefs.filter(r => r.id !== ref.id))}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={addRef}
              className="w-full py-3 border-2 border-dashed border-amber-500/30 rounded-lg text-amber-100/60 hover:border-amber-500 hover:text-amber-100 transition-colors flex items-center justify-center gap-2">
              <Plus size={20} /> Add External Reference
            </button>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}