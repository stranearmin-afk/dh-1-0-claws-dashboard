'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [agentModal, setAgentModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dashboardLoggedIn');
    if (saved) setIsLoggedIn(true);
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    
    if (password === 'admin') {
      setIsLoggedIn(true);
      localStorage.setItem('dashboardLoggedIn', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('dashboardLoggedIn');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body, #__next {
          height: 100%;
          width: 100%;
        }

        body {
          font-family: 'Inter', sans-serif;
          background-color: #0a0a0a;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(63, 94, 251, 0.05) 0%, transparent 50%);
          color: #d1d5db;
        }

        .glass-panel {
          background: rgba(20, 20, 25, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }

        .status-pulse {
          animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }

        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }

        .mono { font-family: 'JetBrains Mono', monospace; }

        button:hover {
          opacity: 0.9;
        }
      `}} />

      {!isLoggedIn ? (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-panel" style={{
            borderRadius: '1rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '28rem',
            borderColor: '#1f2937'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg className="w-6 h-6" style={{color: 'white'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: '0.5rem'
            }}>Agent Command Center</h1>
            <p style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>v1.0 • Secure Access Required</p>
            
            <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>Password</label>
                <input 
                  type="password" 
                  name="password"
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: 'white',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: 500,
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '1rem'
              }}>
                Access Dashboard
              </button>
            </form>
            {loginError && <p style={{color: '#ef4444', fontSize: '0.875rem', textAlign: 'center', marginTop: '1rem'}}>Invalid credentials</p>}
          </div>
        </div>
      ) : (
        <div style={{
          textColor: '#d1d5db',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(63, 94, 251, 0.05) 0%, transparent 50%)'
        }}>
          {/* HEADER */}
          <header className="glass-panel" style={{
            borderBottom: '1px solid #1f2937',
            position: 'sticky',
            top: 0,
            zIndex: 40
          }}>
            <div style={{
              maxWidth: '80rem',
              marginLeft: 'auto',
              marginRight: 'auto',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.2)'
                }}>
                  <svg className="w-5 h-5" style={{color: 'white'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div>
                  <h1 style={{fontSize: '1.125rem', fontWeight: 'bold', color: 'white', letterSpacing: '-0.025em'}}>Agent Command Center</h1>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280'}}>
                    <span className="status-pulse" style={{width: '0.5rem', height: '0.5rem', backgroundColor: '#22c55e', borderRadius: '9999px'}}></span>
                    <span>System Online • v1.0.0</span>
                  </div>
                </div>
              </div>
              
              <button onClick={handleLogout} style={{
                padding: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                color: '#9ca3af',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
              }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main style={{
            flex: 1,
            maxWidth: '80rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            paddingTop: '2rem',
            paddingBottom: '2rem',
            width: '100%'
          }}>
            
            <section className="glass-panel" style={{borderRadius: '0.75rem', overflow: 'hidden'}}>
              <div style={{
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #1f2937',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                  <svg className="w-5 h-5" style={{color: '#60a5fa'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <h2 style={{fontSize: '1.125rem', fontWeight: 600, color: 'white'}}>Chrome Instances</h2>
                  <span style={{
                    paddingLeft: '0.5rem',
                    paddingRight: '0.5rem',
                    paddingTop: '0.25rem',
                    paddingBottom: '0.25rem',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#60a5fa',
                    fontSize: '0.75rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>0 Active</span>
                </div>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  color: 'white'
                }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh Status</span>
                </button>
              </div>
              
              <p style={{padding: '2rem', color: '#9ca3af', textAlign: 'center'}}>Dashboard content loading...</p>
            </section>
          </main>
        </div>
      )}
    </>
  );
}