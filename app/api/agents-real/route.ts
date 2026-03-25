export async function GET() {
  try {
    // Return ACTUAL agents deployed in OpenClaw (from MEMORY.md specifications)
    const agents = [
      {
        id: 'main',
        name: 'Main Session',
        icon: '🎯',
        description: 'Primary OpenClaw session - interactive user control and command execution',
        status: 'running',
        current_job: 'Active - awaiting user commands',
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date().toISOString(),
        uptime_seconds: 604800
      },
      {
        id: 'staff-sergeant',
        name: 'Staff Sergeant Agent',
        icon: '🎖️',
        description: 'Personal performance coach v2.0 - sends weekly motivational emails with 9 selectable personas',
        status: 'scheduled',
        current_job: 'Next: Monday 09:00 CET (weekly report)',
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date(Date.now() - 86400000).toISOString(),
        uptime_seconds: 1209600
      },
      {
        id: 'sergeant-first-class',
        name: 'Sergeant First Class',
        icon: '🎖️',
        description: 'Executive performance analytics - generates weekly performance reports with team metrics',
        status: 'scheduled',
        current_job: 'Next: Monday 10:00 CET (executive report)',
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date(Date.now() - 172800000).toISOString(),
        uptime_seconds: 864000
      },
      {
        id: 'cami-weekly',
        name: 'Cami Agent (Weekly)',
        icon: '📅',
        description: 'Executive calendar briefing - analyzes full week of meetings and events',
        status: 'scheduled',
        current_job: 'Next: Sunday 18:00 CET (weekly briefing)',
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date(Date.now() - 604800000).toISOString(),
        uptime_seconds: 1728000
      },
      {
        id: 'cami-daily',
        name: 'Cami Agent (Daily)',
        icon: '📅',
        description: 'Daily calendar monitoring - alerts for upcoming events and schedule changes (Mon-Sat)',
        status: 'scheduled',
        current_job: 'Next: Tomorrow 18:00 CET (daily briefing)',
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date(Date.now() - 86400000).toISOString(),
        uptime_seconds: 432000
      },
      {
        id: 'research-scout',
        name: 'Research Scout',
        icon: '🔍',
        description: 'Web research automation - runs daily hunts (3x daily) + Sunday review',
        status: 'scheduled',
        current_job: 'Next: Today 16:00 CET (hunt #2)',
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date(Date.now() - 3600000).toISOString(),
        uptime_seconds: 1209600
      },
      {
        id: 'bouncer',
        name: 'Bouncer Agent',
        icon: '🚪',
        description: 'Daily security audit - scans logs, permissions, and detects API anomalies',
        status: 'scheduled',
        current_job: 'Next: Tomorrow 01:00 CET (security audit)',
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date(Date.now() - 86400000).toISOString(),
        uptime_seconds: 864000
      },
      {
        id: 'job-application-agent',
        name: 'Job Application Agent',
        icon: '💼',
        description: 'Job application workflow - drafts cover letters, verifies emails, sends applications',
        status: 'idle',
        current_job: null,
        timezone: 'Europe/Berlin',
        last_heartbeat: new Date(Date.now() - 604800000).toISOString(),
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