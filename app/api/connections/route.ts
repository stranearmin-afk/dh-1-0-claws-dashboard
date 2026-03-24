import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: connections, error: connError } = await supabase.from('connections').select('*');
    if (connError) throw connError;

    const { data: logs, error: logsError } = await supabase.from('usage_logs').select('connection_id, cost_usd');
    if (logsError) throw logsError;

    const usageByConnection: Record<string, number> = {};
    logs?.forEach((log) => {
      if (log.connection_id) {
        usageByConnection[log.connection_id] = (usageByConnection[log.connection_id] || 0) + (log.cost_usd || 0);
      }
    });

    const enrichedConnections = (connections || []).map((conn) => ({
      ...conn,
      estimated_usage: usageByConnection[conn.id] || 0,
    }));

    return NextResponse.json({ connections: enrichedConnections });
  } catch (error) {
    console.error('Fetch connections error:', error);
    return NextResponse.json({ connections: [], error: 'Failed to fetch connections' }, { status: 500 });
  }
}
