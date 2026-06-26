'use client';

import { useState } from 'react';

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
        // Hər şey hazırdır, kükini API yaratdı. Birbaşa yönləndiririk.
        window.location.href = '/admin/dashboard';
      } else {
        const data = await response.json();
        setError(data.error || 'Giriş alınmadı');
      }
    } catch (err) {
      setError('Bağlantı xətası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 text-neutral-900">
      <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-2xl border border-neutral-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-amber-600">Qaracəmirli Admin</h1>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="GitHub Username" className="w-full p-3 border rounded bg-white text-black" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
          <input type="text" placeholder="Repo Name" className="w-full p-3 border rounded bg-white text-black" value={formData.repository} onChange={e => setFormData({...formData, repository: e.target.value})} required />
          <input type="text" placeholder="Branch (main)" className="w-full p-3 border rounded bg-white text-black" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} />
          <input type="password" placeholder="GitHub Token" className="w-full p-3 border rounded bg-white text-black" value={formData.token} onChange={e => setFormData({...formData, token: e.target.value})} required />
          <button type="submit" disabled={loading} className="w-full py-3 bg-amber-600 text-white font-bold rounded hover:bg-amber-700 transition-colors uppercase">
            {loading ? 'Giriş edilir...' : 'Daxil Ol'}
          </button>
        </form>
      </div>
    </div>
  );
}