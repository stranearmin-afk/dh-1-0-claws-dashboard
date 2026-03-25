'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [agentModal, setAgentModal] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDailyCheck, setLastDailyCheck] = useState('Never');

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [agentsRes, connRes] = await Promise.all([
        fetch('/api/agents'),
        fetch('/api/connections')
      ]);
      if (agentsRes.ok) {
        const data = await agentsRes.json();
        setAgents(data.agents || []);
      }
      if (connRes.ok) {
        const data = await connRes.json();
        setConnections(data.connections || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const password = (e.target as any).password.value;
    if (password === 'admin') {
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAgentModal(false);
  };

  const runDailyCheck = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLastDailyCheck(new Date().toLocaleString());
    }, 2000);
  };

  return (
    <div className="text-gray-300 min-h-screen flex flex-col" style={{ 
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#0a0a0a',
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(63, 94, 251, 0.05) 0%, transparent 50%)'
    }}>
      {/* Login Screen */}
      {!isLoggedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="rounded-2xl p-8 w-full max-w-md border border-gray-800" style={{
            background: 'rgba(20, 20, 25, 0.7)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
          }}>
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center mb-2">Agent Command Center</h1>
            <p className="text-sm text-gray-500 text-center mb-6">v1.0 • Secure Access Required [UPDATED]</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Password</label>
                <input 
                  type="password" 
                  name="password"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                Access Dashboard
              </button>
            </form>
            {loginError && <p className="text-red-500 text-sm text-center mt-4">Invalid credentials</p>}
          </div>
        </div>
      )}

      {/* Main Dashboard - only shown after login */}
      {isLoggedIn && (
        <>
          {/* Header */}
          <header className="border-b border-gray-800 sticky top-0 z-40" style={{
            background: 'rgba(20, 20, 25, 0.7)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
          }}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight">Agent Command Center</h1>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full" style={{
                      animation: 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite'
                    }}></span>
                    <span>System Online • v1.0.0</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-gray-500">Last Daily Check</div>
                  <div className="text-sm font-medium text-gray-300">{lastDailyCheck}</div>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full space-y-6">
            
            {/* Chrome Agents Section */}
            <section className="rounded-xl overflow-hidden" style={{
              background: 'rgba(20, 20, 25, 0.7)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                  </svg>
                  <h2 className="text-lg font-semibold text-white">Chrome Instances</h2>
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                    {agents.length} Active
                  </span>
                </div>
                <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-gray-700 rounded-lg text-sm transition-all group">
                  <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <span>Refresh Status</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b border-gray-800 bg-black/20">
                      <th className="px-6 py-3 font-medium uppercase tracking-wider">Agent Name</th>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider">Current Job</th>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider">Last Seen</th>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-800">
                    {agents.length === 0 ? (
                      <tr className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setAgentModal(true)}>
                        <td className="px-6 py-4 text-white font-medium">scraper-main</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            Running
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400">LinkedIn Profile Scrape • 45/100</td>
                        <td className="px-6 py-4 text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>2m ago</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={(e) => { e.stopPropagation(); }} className="text-red-400 hover:text-red-300 px-3 py-1 rounded hover:bg-red-500/10 transition-colors text-xs font-medium">
                            Kill
                          </button>
                        </td>
                      </tr>
                    ) : (
                      agents.map(agent => (
                        <tr key={agent.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setAgentModal(true)}>
                          <td className="px-6 py-4 text-white font-medium">{agent.name || agent.id}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                              agent.status === 'running' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'running' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
                              {agent.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400">{agent.current_job || '—'}</td>
                          <td className="px-6 py-4 text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>—</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={(e) => { e.stopPropagation(); }} className="text-red-400 hover:text-red-300 px-3 py-1 rounded hover:bg-red-500/10 transition-colors text-xs font-medium">
                              Kill
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Agent Detail Modal */}
              {agentModal && (
                <div className="border-t border-gray-800 bg-black/40 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Job Configuration
                      </h3>
                      <div className="bg-black/50 rounded-lg p-4 border border-gray-800 font-mono text-xs text-gray-400 overflow-x-auto">
                        <pre>{JSON.stringify({
                          target: "linkedin.com",
                          actions: ["login", "search", "scrape_profiles"],
                          selectors: {
                            search_box: "input[aria-label='Search']",
                            profile_cards: ".search-result__info"
                          },
                          rate_limit: "2_requests_per_minute"
                        }, null, 2)}</pre>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Recent Logs</h4>
                        <div className="bg-black/50 rounded-lg p-3 border border-gray-800 font-mono text-xs space-y-1 h-32 overflow-y-auto">
                          <div className="text-green-400">[2026-03-24 08:05:12] Successfully logged in</div>
                          <div className="text-blue-400">[2026-03-24 08:05:45] Navigated to search</div>
                          <div className="text-yellow-400">[2026-03-24 08:06:02] Rate limit hit, waiting 30s</div>
                          <div className="text-gray-400">[2026-03-24 08:06:32] Resuming scrape...</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                        </svg>
                        System Info
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white/5 rounded-lg p-3 border border-gray-800">
                          <div className="text-xs text-gray-500 mb-1">Chrome PID</div>
                          <div className="text-sm font-mono text-white">28491</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-gray-800">
                          <div className="text-xs text-gray-500 mb-1">Memory Usage</div>
                          <div className="text-sm font-mono text-white">412 MB</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-gray-800">
                          <div className="text-xs text-gray-500 mb-1">Proxy</div>
                          <div className="text-sm font-mono text-white">192.168.1.45:8080</div>
                        </div>
                      </div>
                      <button onClick={() => setAgentModal(false)} className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
                        Close Details
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Connections & API Balance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* API Balances */}
              <section className="lg:col-span-2 rounded-xl overflow-hidden" style={{
                background: 'rgba(20, 20, 25, 0.7)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                    <h2 className="text-lg font-semibold text-white">API Balances & Connections</h2>
                  </div>
                  <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 text-green-400 rounded-lg text-sm transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Check All</span>
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  {connections.length === 0 ? (
                    <>
                      {/* Sample Anthropic */}
                      <div className="group bg-black/30 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all hover:bg-black/40">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center border border-orange-500/20">
                              <span className="text-orange-400 font-bold text-sm">Cl</span>
                            </div>
                            <div>
                              <h3 className="text-white font-medium">Anthropic Claude</h3>
                              <p className="text-xs text-gray-500">claude-3-5-sonnet-20241022</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="text-xs text-green-400">Active</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">Estimated Balance</span>
                              <span className="text-white font-mono">$12.45 / $20.00</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 w-[62%]"></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex gap-4">
                              <span className="text-gray-500">Today's Usage: <span className="text-gray-300">$2.15</span></span>
                              <span className="text-gray-500">Requests: <span className="text-gray-300">142</span></span>
                            </div>
                            <button onClick={loadData} className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                              </svg>
                              Refresh
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Sample OpenAI */}
                      <div className="group bg-black/30 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all hover:bg-black/40">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-white font-medium">OpenAI</h3>
                              <p className="text-xs text-gray-500">GPT-4 Turbo • gpt-4-0125-preview</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-yellow-400">Check Required</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                            <span className="text-xs text-yellow-200">Balance data stale (24h+)</span>
                            <button onClick={loadData} className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded text-xs transition-colors">
                              Check Now
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Sample Gmail */}
                      <div className="group bg-black/30 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all hover:bg-black/40 opacity-75">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-white font-medium">Gmail API</h3>
                              <p className="text-xs text-gray-500">agent.bot@gmail.com</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span className="text-xs text-red-400">Expired</span>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            Reconnect
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    connections.map(conn => (
                      <div key={conn.id} className="group bg-black/30 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all hover:bg-black/40">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                              <span className="text-blue-400 font-bold text-sm">{conn.service_name.slice(0, 2).toUpperCase()}</span>
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{conn.service_name}</h3>
                              <p className="text-xs text-gray-500">{conn.service_type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${conn.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                            <span className={`text-xs ${conn.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>{conn.status}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">Balance</span>
                              <span className="text-white font-mono">${conn.estimated_usage.toFixed(2)} / ${conn.initial_balance.toFixed(2)}</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${Math.min((conn.estimated_usage / conn.initial_balance) * 100, 100)}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Quick Stats */}
              <section className="space-y-6">
                <div className="rounded-xl p-6 border border-gray-800" style={{
                  background: 'rgba(20, 20, 25, 0.7)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                }}>
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    System Health
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Daily Check</span>
                      <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20">Completed</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Agents Online</span>
                      <span className="text-sm text-white font-mono">{agents.length}/3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">APIs Healthy</span>
                      <span className="text-sm text-white font-mono">{connections.length}/3</span>
                    </div>
                    <div className="pt-4 border-t border-gray-800">
                      <div className="text-xs text-gray-500 mb-2">Next Daily Check</div>
                      <div className="text-sm text-white">24 Mar 2026, 00:00 UTC</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-4 border border-gray-800" style={{
                  background: 'rgba(20, 20, 25, 0.7)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                }}>
                  <button onClick={runDailyCheck} className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors mb-2 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {loading ? 'Running...' : 'Run Daily Check Now'}
                  </button>
                  <p className="text-xs text-gray-600 text-center">Updates all agent statuses and API balances</p>
                </div>
              </section>
            </div>
          </main>
        </>
      )}

      <style>{`
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `}</style>
    </div>
  );
}