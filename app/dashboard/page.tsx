'use client';

import { useEffect, useState } from 'react';

interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'error';
  current_job: string | null;
  last_heartbeat: number | null;
}

interface Connection {
  id: string;
  service_name: string;
  service_type: string;
  initial_balance: number;
  estimated_usage: number;
  status: string;
  metadata: any;
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
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
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return '—';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-DE', { 
      dateStyle: 'short', 
      timeStyle: 'short' 
    });
  };

  if (!mounted) return null;

  const activeAgents = agents.filter(a => a.status === 'running').length;
  const healthyConnections = connections.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Chrome Agents Section */}
      <section className="glass-panel rounded-xl overflow-hidden border border-gray-800">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <h2 className="text-lg font-semibold text-white">Chrome Instances</h2>
            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
              {activeAgents} Active
            </span>
          </div>
          <button 
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-gray-700 rounded-lg text-sm transition-all group disabled:opacity-50"
          >
            <svg className={`w-4 h-4 transition-transform duration-500 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{loading ? 'Loading...' : 'Refresh Status'}</span>
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
                <tr className="hover:bg-white/5 transition-colors">
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading agents...' : 'No agents connected yet'}
                  </td>
                </tr>
              ) : (
                agents.map(agent => (
                  <tr key={agent.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{agent.name || agent.id}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs ${getStatusColor(agent.status)}`}>
                        <span className={`w-1.5 h-1.5 ${getStatusDot(agent.status)} rounded-full`}></span>
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{agent.current_job || '—'}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{formatTime(agent.last_heartbeat)}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-300 px-3 py-1 rounded hover:bg-gray-500/10 transition-colors text-xs font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Connections & API Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Balances */}
        <section className="lg:col-span-2 glass-panel rounded-xl overflow-hidden border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h2 className="text-lg font-semibold text-white">API Balances & Connections</h2>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 text-green-400 rounded-lg text-sm transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Check All</span>
            </button>
          </div>

          <div className="p-6 space-y-4">
            {connections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {loading ? 'Loading connections...' : 'No API connections configured'}
              </div>
            ) : (
              connections.map(conn => {
                const balance = conn.initial_balance - (conn.estimated_usage || 0);
                const usage_percent = (conn.estimated_usage / conn.initial_balance) * 100;
                
                return (
                  <div 
                    key={conn.id} 
                    className="group bg-black/30 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all hover:bg-black/40"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                          <span className="text-blue-400 font-bold text-xs text-center">{conn.service_name.slice(0, 3)}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{conn.service_name}</h3>
                          <p className="text-xs text-gray-500">{conn.service_type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 ${conn.status === 'active' ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></span>
                        <span className="text-xs text-gray-400">{conn.status}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Usage</span>
                        <span className="text-white font-mono">${conn.estimated_usage.toFixed(2)} / ${conn.initial_balance.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-gray-800">
                        <div 
                          className={`h-full transition-all ${
                            usage_percent > 80 ? 'bg-red-500' : 
                            usage_percent > 50 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(usage_percent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gray-800">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              System Health
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Daily Check</span>
                <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20">Ready</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Agents Online</span>
                <span className="text-sm text-white font-mono">{activeAgents}/{agents.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">APIs Healthy</span>
                <span className="text-sm text-white font-mono">{healthyConnections}/{connections.length}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-gray-800">
            <button 
              onClick={fetchData}
              disabled={loading}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {loading ? 'Checking...' : 'Run Check Now'}
            </button>
            <p className="text-xs text-gray-600 text-center mt-2">Updates all statuses</p>
          </div>
        </section>
      </div>
    </div>
  );
}
