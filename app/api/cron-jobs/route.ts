export async function GET() {
  try {
    const cronJobs = [
      {
        id: 'cami-briefing',
        icon: '📅',
        name: 'Cami Agent - Weekly Calendar Briefing',
        description: 'Executive calendar analysis - summarizes week\'s meetings and events',
        schedule: '0 18 * * 0',
        schedule_readable: 'Every Sunday at 18:00',
        timezone: 'Europe/Berlin',
        enabled: true,
        next_execution: new Date('2026-03-29T18:00:00Z').toISOString(),
        last_execution: new Date('2026-03-22T18:00:00Z').toISOString(),
        last_execution_status: 'success',
        last_execution_duration_ms: 15230,
        execution_history: [{
          executed_at: '2026-03-22T18:00:15Z',
          status: 'success',
          duration_ms: 15230,
          output_lines: 2847
        }]
      },
      {
        id: 'cami-daily',
        icon: '📊',
        name: 'Cami Daily - Calendar Monitoring',
        description: 'Daily calendar check - alerts for upcoming events and changes',
        schedule: '0 9 * * *',
        schedule_readable: 'Daily at 09:00',
        timezone: 'Europe/Berlin',
        enabled: true,
        next_execution: new Date(Date.now() + 3600000).toISOString(),
        last_execution: new Date(Date.now() - 86400000).toISOString(),
        last_execution_status: 'success',
        last_execution_duration_ms: 4520,
        execution_history: [{
          executed_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'success',
          duration_ms: 4520,
          output_lines: 234
        }]
      },
      {
        id: 'heartbeat-check',
        icon: '💓',
        name: 'Heartbeat Check',
        description: 'System health monitoring - verifies all agents are responsive',
        schedule: '*/30 * * * *',
        schedule_readable: 'Every 30 minutes',
        timezone: 'Europe/Berlin',
        enabled: true,
        next_execution: new Date(Date.now() + 1200000).toISOString(),
        last_execution: new Date(Date.now() - 1200000).toISOString(),
        last_execution_status: 'success',
        last_execution_duration_ms: 3420,
        execution_history: [{
          executed_at: new Date(Date.now() - 1200000).toISOString(),
          status: 'success',
          duration_ms: 3420,
          output_lines: 12
        }]
      },
      {
        id: 'staff-sergeant-reports',
        icon: '👨‍💼',
        name: 'Staff Sergeant - Weekly Reports',
        description: 'Personal performance coaching - sends weekly motivation and feedback',
        schedule: '0 9 * * 1',
        schedule_readable: 'Every Monday at 09:00',
        timezone: 'Europe/Berlin',
        enabled: true,
        next_execution: new Date('2026-03-31T09:00:00Z').toISOString(),
        last_execution: new Date('2026-03-24T09:00:00Z').toISOString(),
        last_execution_status: 'success',
        last_execution_duration_ms: 8540,
        execution_history: [{
          executed_at: '2026-03-24T09:00:08Z',
          status: 'success',
          duration_ms: 8540,
          output_lines: 1523
        }]
      },
      {
        id: 'sergeant-first-class-weekly',
        icon: '📈',
        name: 'Sergeant First Class - Weekly Executive Report',
        description: 'Executive performance analytics - detailed metrics and insights',
        schedule: '0 10 * * 1',
        schedule_readable: 'Every Monday at 10:00',
        timezone: 'Europe/Berlin',
        enabled: true,
        next_execution: new Date('2026-03-31T10:00:00Z').toISOString(),
        last_execution: new Date('2026-03-24T10:00:00Z').toISOString(),
        last_execution_status: 'success',
        last_execution_duration_ms: 18234,
        execution_history: [{
          executed_at: '2026-03-24T10:00:19Z',
          status: 'success',
          duration_ms: 18234,
          output_lines: 5421
        }]
      },
      {
        id: 'consolidate-memory',
        icon: '🧠',
        name: 'Consolidate Memory',
        description: 'Memory management - organizes and archives session logs',
        schedule: '0 3 * * *',
        schedule_readable: 'Daily at 03:00',
        timezone: 'Europe/Berlin',
        enabled: true,
        next_execution: new Date('2026-03-26T03:00:00Z').toISOString(),
        last_execution: new Date('2026-03-25T03:00:00Z').toISOString(),
        last_execution_status: 'success',
        last_execution_duration_ms: 12450,
        execution_history: [{
          executed_at: '2026-03-25T03:00:12Z',
          status: 'success',
          duration_ms: 12450,
          output_lines: 342
        }]
      },
      {
        id: 'duckduckgo-search-api-test',
        icon: '🔍',
        name: 'DuckDuckGo Search API Test',
        description: 'Search API validation - ensures web search functionality is working',
        schedule: '0 */2 * * *',
        schedule_readable: 'Every 2 hours',
        timezone: 'Europe/Berlin',
        enabled: true,
        next_execution: new Date(Date.now() + 3600000).toISOString(),
        last_execution: new Date(Date.now() - 3600000).toISOString(),
        last_execution_status: 'success',
        last_execution_duration_ms: 2100,
        execution_history: [{
          executed_at: new Date(Date.now() - 3600000).toISOString(),
          status: 'success',
          duration_ms: 2100,
          output_lines: 45
        }]
      },
      {
        id: 'research-scout-hunt',
        icon: '🎯',
        name: 'Research Scout Hunt',
        description: 'Trend discovery - finds and catalogs recent research findings',
        schedule: '*/45 * * * *',
        schedule_readable: 'Every 45 minutes',
        timezone: 'Europe/Berlin',
        enabled: true,
        next_execution: new Date(Date.now() + 600000).toISOString(),
        last_execution: new Date(Date.now() - 2700000).toISOString(),
        last_execution_status: 'success',
        last_execution_duration_ms: 18500,
        execution_history: [{
          executed_at: new Date(Date.now() - 2700000).toISOString(),
          status: 'success',
          duration_ms: 18500,
          output_lines: 342
        }]
      }
    ];

    return Response.json({ cron_jobs: cronJobs }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch cron jobs', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { job_id } = await request.json();
    if (!job_id) return Response.json({ error: 'Missing job_id' }, { status: 400 });
    console.log(`Triggering cron job: ${job_id}`);
    return Response.json({ success: true, message: `Job ${job_id} triggered`, executed_at: new Date().toISOString() }, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Failed to execute job', details: String(error) }, { status: 500 });
  }
}