'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-neutral-800 rounded-2xl p-8 border border-amber-500/20">
          <h1 className="text-3xl font-bold text-amber-100 mb-2">Admin Login</h1>
          <p className="text-amber-100/60 mb-8">Connect to your GitHub repository</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-amber-100 text-sm font-medium mb-2">
                GitHub Username
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500"
                placeholder="your-username"
              />
            </div>

            <div>
              <label className="block text-amber-100 text-sm font-medium mb-2">
                Repository Name
              </label>
              <input
                type="text"
                required
                value={formData.repository}
                onChange={(e) => setFormData({ ...formData, repository: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500"
                placeholder="repository-name"
              />
            </div>

            <div>
              <label className="block text-amber-100 text-sm font-medium mb-2">
                Branch
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500"
                placeholder="main"
              />
            </div>

            <div>
              <label className="block text-amber-100 text-sm font-medium mb-2">
                GitHub Personal Access Token
              </label>
              <input
                type="password"
                required
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-700 border border-amber-500/20 rounded-lg text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500"
                placeholder="ghp_xxxxxxxxxxxx"
              />
              <p className="text-amber-100/40 text-xs mt-2">
                Token requires repo scope permissions
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connecting...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
