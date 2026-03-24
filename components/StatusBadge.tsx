import React from 'react';

type Status = 'running' | 'idle' | 'error';

export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const config = { running: { bg: 'bg-green-500/10', text: 'text-green-400' }, idle: { bg: 'bg-gray-500/10', text: 'text-gray-400' }, error: { bg: 'bg-red-500/10', text: 'text-red-400' } };
  const { bg, text } = config[status] || config.idle;
  return <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bg} border border-white/10 text-xs`}><span className={text}>{status}</span></span>;
};
