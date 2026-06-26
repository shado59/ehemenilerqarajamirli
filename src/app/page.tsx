'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSession } from '@/lib/session';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    repository: '',
    token: '',
    branch: 'main',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Sessiyanı brauzerdə yarat
        createSession({
          ...formData,
          createdAt: Date.now(),
        });
        
        // Dashboard-a yönlən
        setTimeout(() => {
          router.push('/admin/dashboard');
          router.refresh();
        }, 100);
      } else {
        setError(data.error || 'Giriş uğursuz oldu');
      }
    } catch (err) {
      setError('Bağlantı xətası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-amber-200 dark:border-amber-500/20 shadow-xl">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-amber-100 mb-2">Admin Girişi</h1>
        <p className="text-neutral-500 dark:text-amber-100/60 mb-8">GitHub məlumatlarını daxil edin</p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" required placeholder="GitHub İstifadəçi Adı"
            className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-amber-100"
            value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="text" required placeholder="Repozitoriya Adı"
            className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-amber-100"
            value={formData.repository} onChange={(e) => setFormData({ ...formData, repository: e.target.value })}
          />
          <input
            type="text" placeholder="Branch (məs: main)"
            className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-amber-100"
            value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
          />
          <input
            type="password" required placeholder="GitHub Personal Access Token"
            className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-amber-100"
            value={formData.token} onChange={(e) => setFormData({ ...formData, token: e.target.value })}
          />
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all shadow-lg active:scale-95"
          >
            {loading ? 'Yoxlanılır...' : 'Daxil Ol'}
          </button>
        </form>
      </div>
    </div>
  );
}