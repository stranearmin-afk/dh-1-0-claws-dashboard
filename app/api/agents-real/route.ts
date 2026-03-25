export async function GET() {
  try {
    const agents = [
      {
        id: 'main',
        name: 'Main Session',
        icon: '🎯',
        description: 'Interactive user session and primary control',
        status: 'running',
        current_job: 'Interactive User Session',
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date().toISOString(),
        uptime_seconds: 3600
      },
      {
        id: 'cami-agent',
        name: 'Cami Agent (Calendar Briefing)',
        icon: '📅',
        description: 'Weekly executive calendar analysis and briefing',
        status: 'scheduled',
        current_job: 'Waiting for Sunday 18:00 CET',
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date(Date.now() - 86400000).toISOString(),
        uptime_seconds: 172800
      },
      {
        id: 'cami-daily',
        name: 'Cami Daily Agent',
        icon: '📊',
        description: 'Daily calendar event monitoring and alerts',
        status: 'idle',
        current_job: null,
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date(Date.now() - 3600000).toISOString(),
        uptime_seconds: 86400
      },
      {
        id: 'research-scout',
        name: 'Research Scout',
        icon: '🔍',
        description: 'Web research and trend hunting automation',
        status: 'idle',
        current_job: null,
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date(Date.now() - 300000).toISOString(),
        uptime_seconds: 7200
      },
      {
        id: 'bouncer',
        name: 'Bouncer Agent',
        icon: '🚪',
        description: 'Session management and access control',
        status: 'running',
        current_job: 'Monitoring session activity',
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date(Date.now() - 60000).toISOString(),
        uptime_seconds: 604800
      },
      {
        id: 'staff-sergeant',
        name: 'Staff Sergeant Agent',
        icon: '👨‍💼',
        description: 'Personal performance coaching and feedback',
        status: 'idle',
        current_job: null,
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date(Date.now() - 604800000).toISOString(),
        uptime_seconds: 1209600
      },
      {
        id: 'sergeant-first-class',
        name: 'Sergeant First Class',
        icon: '📈',
        description: 'Executive performance reports and analytics',
        status: 'scheduled',
        current_job: 'Preparing weekly executive report',
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date(Date.now() - 172800000).toISOString(),
        uptime_seconds: 864000
      },
      {
        id: 'job-application-agent',
        name: 'Job Application Agent',
        icon: '💼',
        description: 'Job application management and tracking',
        status: 'idle',
        current_job: null,
        timezone: 'Europe/Berlin',
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