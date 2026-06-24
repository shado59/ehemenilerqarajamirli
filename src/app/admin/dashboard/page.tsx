'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, destroySession } from '@/lib/session';
import { GitHubService } from '@/lib/github-service';
import { 
  LayoutDashboard, 
  Settings, 
  Navigation, 
  Clock, 
  Image, 
  Map, 
  Users, 
  FileText,
  Search,
  LogOut,
  Sparkles,
  Hammer
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    timeline: 0,
    gallery: 0,
    team: 0,
    publications: 0,
    artifacts: 0,
    excavations: 0,
  });
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const session = getSession();
    if (!session) {
      router.push('/admin/login');
      return;
    }

    try {
      const github = new GitHubService(session);
      
      const safeParseLength = (content: string | null) => {
        if (!content) return 0;
        try {
          const parsed = JSON.parse(content);
          return parsed.items ? parsed.items.length : 0;
        } catch {
          return 0;
        }
      };

      const [timeline, gallery, team, publications, artifacts, excavations] = await Promise.all([
        github.readFile('src/content/timeline.json').catch(() => null),
        github.readFile('src/content/gallery.json').catch(() => null),
        github.readFile('src/content/team.json').catch(() => null),
        github.readFile('src/content/research.json').catch(() => null),
        github.readFile('src/content/artifacts.json').catch(() => null),
        github.readFile('src/content/excavations.json').catch(() => null),
      ]);

      setStats({
        timeline: safeParseLength(timeline),
        gallery: safeParseLength(gallery),
        team: safeParseLength(team),
        publications: safeParseLength(publications),
        artifacts: safeParseLength(artifacts),
        excavations: safeParseLength(excavations),
      });
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  };

  const handleLogout = () => {
    destroySession();
    router.push('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Settings, label: 'Site Settings', href: '/admin/settings' },
    { icon: Navigation, label: 'Navigation', href: '/admin/navigation' },
    { icon: Clock, label: 'Timeline', href: '/admin/timeline' },
    { icon: Image, label: 'Gallery', href: '/admin/gallery' },
    { icon: Map, label: 'Maps', href: '/admin/maps' },
    { icon: Sparkles, label: 'Artifacts', href: '/admin/artifacts' },
    { icon: Hammer, label: 'Excavations', href: '/admin/excavations' },
    { icon: Users, label: 'Team', href: '/admin/team' },
    { icon: FileText, label: 'Publications', href: '/admin/publications' },
    { icon: Search, label: 'SEO', href: '/admin/seo' },
  ];

  return (
    // ƏSAS KONTEYNER: Light modda açıq boz (neutral-50), Dark modda qara (neutral-900)
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="flex">
        {/* SIDEBAR: Light modda ağ (white), Dark modda tünd boz (neutral-800) */}
        <aside className="w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-amber-500/20 p-6 min-h-screen">
          <h1 className="text-xl font-bold text-neutral-800 dark:text-amber-100 mb-8">Admin Panel</h1>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  // Linklər: Hover olanda qızılı/amber fon və rəng
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-600 dark:text-amber-100/80 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-100 transition-colors"
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neutral-800 dark:text-amber-100 mb-2">Dashboard</h2>
            <p className="text-neutral-500 dark:text-amber-100/60">
              {connectionStatus === 'connected' ? 'Connected to local filesystem' : 'Connection lost'}
            </p>
          </div>

          {/* STATS GRID: Kartların fonu light modda ağ, dark modda tünd */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {[
              { icon: Clock, val: stats.timeline, label: 'Timeline' },
              { icon: Image, val: stats.gallery, label: 'Gallery' },
              { icon: Sparkles, val: stats.artifacts, label: 'Artifacts' },
              { icon: Hammer, val: stats.excavations, label: 'Excavations' },
              { icon: Users, val: stats.team, label: 'Team' },
              { icon: FileText, val: stats.publications, label: 'Publications' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-amber-500/20 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="text-amber-600 dark:text-amber-400" size={24} />
                  <span className="text-2xl font-bold text-neutral-800 dark:text-amber-100">{stat.val}</span>
                </div>
                <p className="text-neutral-500 dark:text-amber-100/60">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS SECTION */}
          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-amber-500/20 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-neutral-800 dark:text-amber-100 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Manage Timeline', href: '/admin/timeline' },
                { label: 'Manage Artifacts', href: '/admin/artifacts' },
                { label: 'Manage Gallery', href: '/admin/gallery' },
              ].map((action, idx) => (
                <a
                  key={idx}
                  href={action.href}
                  className="px-4 py-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-700 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors text-center font-medium"
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}