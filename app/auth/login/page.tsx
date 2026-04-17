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
        setError('Falsches Passwort. Bitte erneut versuchen.');
      }
    } catch {
      setError('Verbindungsfehler. Bitte Seite neu laden.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F1117',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            marginBottom: 20,
            boxShadow: '0 0 40px #3B82F630',
          }}>
            <span style={{ fontSize: 28 }}>🚛</span>
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#E2E8F0',
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
          }}>
            FleetLink
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
            Lead-Analyse · Interner Zugang
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#1A1D27',
          borderRadius: 20,
          border: '1px solid #2D3348',
          padding: '36px 32px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 10,
              }}>
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                autoFocus
                style={{
                  width: '100%',
                  background: '#0F1117',
                  border: '1px solid #2D3348',
                  borderRadius: 12,
                  padding: '14px 16px',
                  fontSize: 16,
                  color: '#E2E8F0',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = '#2D3348'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#2D3348' : 'linear-gradient(135deg, #3B82F6, #6366F1)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '14px',
                fontSize: 15,
                fontWeight: 700,
                fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                opacity: loading ? 0.6 : 1,
                boxShadow: loading ? 'none' : '0 4px 20px #3B82F640',
              }}
            >
              {loading ? 'Wird geprüft...' : 'Zugang öffnen →'}
            </button>
          </form>

          {error && (
            <div style={{
              marginTop: 16,
              padding: '12px 16px',
              background: '#EF444415',
              border: '1px solid #EF444430',
              borderRadius: 10,
              fontSize: 13,
              color: '#EF4444',
            }}>
              {error}
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#334155', marginTop: 24 }}>
          © {new Date().getFullYear()} FleetLink · fleetlink.de
        </p>
      </div>
    </div>
  );
}
