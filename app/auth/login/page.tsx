'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const params = new URLSearchParams(window.location.search);
        router.push(params.get('from') || '/fleetlink');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-6 shadow-lg shadow-blue-500/20">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Agent Command Center</h1>
          <p className="text-gray-500">v1.0 Secure Access Required</p>
        </div>
        <div className="bg-[rgba(20,20,25,0.7)] backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50" placeholder="••••••••" disabled={loading} autoFocus />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]">
              {loading ? 'Checking...' : 'Access Dashboard'}
            </button>
          </form>
          {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"><p className="text-red-400 text-sm">{error}</p></div>}
        </div>
      </div>
    </div>
  );
}
