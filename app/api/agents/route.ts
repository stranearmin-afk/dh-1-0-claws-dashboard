import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('last_heartbeat', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ agents: data || [] });
  } catch (error) {
    console.error('Fetch agents error:', error);
    return NextResponse.json({ agents: [], error: 'Failed to fetch agents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { agent_id, secret, status, current_job, timestamp, logs } = await request.json();

    if (secret !== process.env.AGENT_SHARED_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('agents')
      .upsert({id: agent_id, status, current_job, last_heartbeat: timestamp || Date.now(), config_json: logs ? { logs } : {}}, {onConflict: 'id'})
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, agent: data?.[0] });
  } catch (error) {
    console.error('Agent webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
