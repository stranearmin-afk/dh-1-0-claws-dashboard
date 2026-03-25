export async function GET() {
  try {
    const agents = [
      {
        id: 'main',
        name: 'Main Session',
        status: 'running',
        current_job: 'Interactive',
        last_heartbeat: new Date().toISOString(),
        uptime_seconds: 3600
      },
      {
        id: 'research-scout',
        name: 'Research Scout',
        status: 'idle',
        current_job: null,
        last_heartbeat: new Date(Date.now() - 300000).toISOString(),
        uptime_seconds: 7200
      },
      {
        id: 'cami-agent',
        name: 'Cami Agent (Calendar Briefing)',
        status: 'scheduled',
        current_job: 'Waiting for Sunday 18:00',
        last_heartbeat: new Date(Date.now() - 86400000).toISOString(),
        uptime_seconds: 172800
      }
    ];

    return Response.json({ agents }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch agents', details: String(error) },
      { status: 500 }
    );
  }
}