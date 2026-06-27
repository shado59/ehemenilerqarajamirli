'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import { GitHubService } from '@/lib/github-service';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface TeamMember {
  id: string;
  photo: string;
  visible: boolean;
  order: number;
  content: {
    name: { az: string; en: string };
    role: { az: string; en: string };
    biography: { az: string; en: string };
    specialization: { az: string; en: string };
  };
}

export default function TeamManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'az' | 'en'>('az');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [rawData, setRawData] = useState<any>({});

  useEffect(() => {
    const load = async () => {
      const session = getSession();
      if (!session) { router.push('/admin/login'); return; }
      try {
        const github = new GitHubService(session);
        const content = await github.readFile('src/content/team.json');
        if (content) {
          const data = JSON.parse(content);
          setRawData(data);
          const list = data.members || data.items || [];
          setMembers(list.sort((a: TeamMember, b: TeamMember) => a.order - b.order));
        }
      } catch {
        setMessage({ type: 'error', text: 'Failed to load team' });
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
        path: 'src/content/team.json',
        content: JSON.stringify({ ...rawData, members: members }, null, 2),
        message: 'Update team members',
      });
      setMessage({ type: 'success', text: 'Team saved successfully' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save team' });
    } finally {
      setSaving(false);
    }
  };

  const addMember = () => {
    const m: TeamMember = {
      id: `member-${Date.now()}`,
      photo: '',
      visible: true,
      order: members.length + 1,
      content: {
        name: { az: '', en: '' },
        role: { az: '', en: '' },
        biography: { az: '', en: '' },
        specialization: { az: '', en: '' },
      },
    };
    setMembers([...members, m]);
  };

  const deleteMember = (id: string) => setMembers(members.filter(m => m.id !== id));

  const update = (id: string, path: string, value: any) => {
    setMembers(members.map(m => {
      if (m.id !== id) return m;
      const parts = path.split('.');
      if (parts.length === 1) return { ...m, [parts[0]]: value };
      if (parts.length === 2) return { ...m, [parts[0]]: { ...(m as any)[parts[0]], [parts[1]]: value } };
      if (parts.length === 3) return {
        ...m,
        [parts[0]]: {
          ...(m as any)[parts[0]],
          [parts[1]]: { ...(m as any)[parts[0]][parts[1]], [parts[2]]: value }
        }
      };
      return m;
    }));
  };

  if (loading) return <div className="min-h-screen bg-neutral-900 flex items-center justify-center"><div className="text-amber-100">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="flex">
        <aside className="w-64 bg-neutral-800 border-r border-amber-500/20 p-6 min-h-screen">
          <a href="/admin/dashboard" className="text-amber-100/80 hover:text-amber-100 mb-8 block">← Back to Dashboard</a>
          <h1 className="text-xl font-bold text-amber-100">Team</h1>
        </aside>
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold text-amber-100 mb-4">Team Members</h2>
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
            {members.map(member => (
              <div key={member.id} className="bg-neutral-800 border border-amber-500/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <GripVertical size={20} className="mt-2 text-amber-500/50" />
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">Photo URL</label>
                      <input type="text" value={member.photo}
                        onChange={e => update(member.id, 'photo', e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                        placeholder="/images/team/photo.jpg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-amber-100 text-sm font-medium mb-2">Name ({activeTab.toUpperCase()})</label>
                        <input type="text" value={member.content.name[activeTab]}
                          onChange={e => update(member.id, `content.name.${activeTab}`, e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500" />
                      </div>
                      <div>
                        <label className="block text-amber-100 text-sm font-medium mb-2">Role ({activeTab.toUpperCase()})</label>
                        <input type="text" value={member.content.role[activeTab]}
                          onChange={e => update(member.id, `content.role.${activeTab}`, e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">Specialization ({activeTab.toUpperCase()})</label>
                      <input type="text" value={member.content.specialization[activeTab]}
                        onChange={e => update(member.id, `content.specialization.${activeTab}`, e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="block text-amber-100 text-sm font-medium mb-2">Biography ({activeTab.toUpperCase()})</label>
                      <textarea value={member.content.biography[activeTab]}
                        onChange={e => update(member.id, `content.biography.${activeTab}`, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500" />
                    </div>
                    <label className="flex items-center gap-2 text-amber-100">
                      <input type="checkbox" checked={member.visible}
                        onChange={e => update(member.id, 'visible', e.target.checked)}
                        className="w-4 h-4 rounded border-amber-500/20 bg-neutral-700 text-amber-500" />
                      Visible
                    </label>
                  </div>
                  <button onClick={() => deleteMember(member.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={addMember}
              className="w-full py-3 border-2 border-dashed border-amber-500/30 rounded-lg text-amber-100/60 hover:border-amber-500 hover:text-amber-100 transition-colors flex items-center justify-center gap-2">
              <Plus size={20} /> Add Team Member
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