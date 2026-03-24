'use client';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    setTime(new Date().toLocaleString());
    const timer = setInterval(() => setTime(new Date().toLocaleString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Agent Command Center</h1>
        <p className="text-gray-500 text-lg">v1.0 System Status Monitor</p>
        <p className="text-gray-400 mono text-sm">{time}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[rgba(20,20,25,0.7)] backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white">Agents</h2>
          </div>
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-sm text-gray-500 mt-2">No agents connected</p>
        </div>

        <div className="bg-[rgba(20,20,25,0.7)] backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white">API Connections</h2>
          </div>
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-sm text-gray-500 mt-2">Add API keys</p>
        </div>

        <div className="bg-[rgba(20,20,25,0.7)] backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="w-2 h-2 bg-green-400 rounded-full status-pulse"></span>
            </div>
            <h2 className="text-lg font-semibold text-white">System Health</h2>
          </div>
          <p className="text-sm">Status: <span className="text-green-400 font-semibold">Online</span></p>
        </div>
      </div>

      <footer className="text-center text-gray-600 text-sm border-t border-gray-800 pt-8">
        <p>Agent Command Center v1.0 Built with Next.js 14, Tailwind CSS, and Supabase</p>
      </footer>
    </div>
  );
}
