'use client';

import { useEffect } from 'react';

export default function Dashboard() {
  useEffect(() => {
    window.location.href = '/dashboard.html';
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
      <p>Redirecting to dashboard...</p>
    </div>
  );
}