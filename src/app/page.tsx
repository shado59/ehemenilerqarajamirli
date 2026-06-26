'use client';

import { useState } from 'react';
import { createSession } from '@/lib/session';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ username: '', repository: '', token: '', branch: 'main' });
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

      if (response.ok) {
        // 1. Sessiya yarat
        createSession({ ...formData, createdAt: Date.now() });
        // 2. Dashboard-a məcburi yönləndir və səhifəni tam yenilə
        window.location.href = '/admin/dashboard';
      } else {
        const data = await response.json();
        setError(data.error || 'Giriş uğursuz oldu');
      }
    } catch (err) {
      setError('Bağlantı xətası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-amber-200 shadow-xl">
        <h1 className="text-2xl font-bold text-neutral-800 mb-6 text-center">Admin Girişi</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-xs">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" required placeholder="GitHub User" className="w-full px-4 py-2 border rounded-lg" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
          <input type="text" required placeholder="Repository Name" className="w-full px-4 py-2 border rounded-lg" value={formData.repository} onChange={e => setFormData({...formData, repository: e.target.value})} />
          <input type="text" placeholder="Branch (main)" className="w-full px-4 py-2 border rounded-lg" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} />
          <input type="password" required placeholder="GitHub Token" className="w-full px-4 py-2 border rounded-lg" value={formData.token} onChange={e => setFormData({...formData, token: e.target.value})} />
          <button type="submit" disabled={loading} className="w-full py-3 bg-amber-600 text-white font-bold rounded-lg uppercase tracking-wider">
            {loading ? 'Giriş edilir...' : 'Daxil Ol'}
          </button>
        </form>
      </div>
    </div>
  );
}