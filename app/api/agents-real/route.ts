export async function GET() {
  try {
    const agents = [
      {
        id: 'main',
        name: 'Main Session',
        status: 'running',
        current_job: 'Interactive User Session',
        last_heartbeat: new Date().toISOString(),
        uptime_seconds: 3600
      },
      {
        id: 'research-scout',
        name: 'Research Scout Agent',
        status: 'idle',
        current_job: null,
        last_heartbeat: new Date(Date.now() - 300000).toISOString(),
        uptime_seconds: 7200
      },
      {
        id: 'cami-agent',
        name: 'Cami Agent (Calendar Briefing)',
        status: 'scheduled',
        current_job: 'Waiting for Sunday 18:00 CET',
        last_heartbeat: new Date(Date.now() - 86400000).toISOString(),
        uptime_seconds: 172800
      },
      {
        id: 'staff-sergeant',
        name: 'Staff Sergeant Agent',
        status: 'idle',
        current_job: null,
        last_heartbeat: new Date(Date.now() - 604800000).toISOString(),
        uptime_seconds: 1209600
      },
      {
        id: 'sergeant-first-class',
        name: 'Sergeant First Class Agent',
        status: 'scheduled',
        current_job: 'Weekly executive report generation',
        last_heartbeat: new Date(Date.now() - 172800000).toISOString(),
        uptime_seconds: 864000
      },
      {
        id: 'job-application-agent',
        name: 'Job Application Agent',
        status: 'idle',
        current_job: null,
        last_heartbeat: new Date(Date.now() - 3600000).toISOString(),
        uptime_seconds: 432000
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