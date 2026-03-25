export async function GET() {
  try {
    const cronJobs = [
      {
        id: 'cami-briefing',
        name: 'Cami Agent - Weekly Calendar Briefing',
        schedule: '0 18 * * 0',
        timezone: 'Europe/Berlin',
        enabled: true,
        next_execution: new Date('2026-03-29T18:00:00Z').toISOString(),
        last_execution: new Date('2026-03-22T18:00:00Z').toISOString(),
        last_execution_status: 'success',
        last_execution_duration_ms: 15230,
        execution_history: [
          {
            executed_at: '2026-03-22T18:00:15Z',
            status: 'success',
            duration_ms: 15230,
            output_lines: 2847
          },
          {
            executed_at: '2026-03-15T18:00:12Z',
            status: 'success',
            duration_ms: 14892,
            output_lines: 2801
          }
        ]
      },
      {
        id: 'heartbeat-check',
        name: 'Heartbeat Check',
        schedule: 'every 30 minutes',
        timezone: 'Europe/Berlin',
        enabled: true,
        next_execution: new Date(Date.now() + 1200000).toISOString(),
        last_execution: new Date(Date.now() - 1200000).toISOString(),
        last_execution_status: 'success',
        last_execution_duration_ms: 3420,
        execution_history: [
          {
            executed_at: new Date(Date.now() - 1200000).toISOString(),
            status: 'success',
            duration_ms: 3420,
            output_lines: 12
          },
          {
            executed_at: new Date(Date.now() - 3600000).toISOString(),
            status: 'success',
            duration_ms: 3280,
            output_lines: 11
          }
        ]
      },
      {
        id: 'staff-sergeant-reports',
        name: 'Staff Sergeant - Weekly Reports',
        schedule: '0 9 * * 1',
        timezone: 'Europe/Berlin',
        enabled: true,
        next_execution: new Date('2026-03-31T09:00:00Z').toISOString(),
        last_execution: new Date('2026-03-24T09:00:00Z').toISOString(),
        last_execution_status: 'success',
        last_execution_duration_ms: 8540,
        execution_history: [
          {
            executed_at: '2026-03-24T09:00:08Z',
            status: 'success',
            duration_ms: 8540,
            output_lines: 1523
          },
          {
            executed_at: '2026-03-17T09:00:05Z',
            status: 'success',
            duration_ms: 8290,
            output_lines: 1487
          }
        ]
      },
      {
        id: 'consolidate-memory',
        name: 'Consolidate Memory',
        schedule: '0 3 * * *',
        timezone: 'Europe/Berlin',
        enabled: true,
        next_execution: new Date('2026-03-26T03:00:00Z').toISOString(),
        last_execution: new Date('2026-03-25T03:00:00Z').toISOString(),
        last_execution_status: 'success',
        last_execution_duration_ms: 12450,
        execution_history: [
          {
            executed_at: '2026-03-25T03:00:12Z',
            status: 'success',
            duration_ms: 12450,
            output_lines: 342
          }
        ]
      },
      {
        id: 'duckduckgo-search-api-test',
        name: 'DuckDuckGo Search API Test',
        schedule: 'every 2 hours',
        timezone: 'Europe/Berlin',
        enabled: true,
        next_execution: new Date(Date.now() + 3600000).toISOString(),
        last_execution: new Date(Date.now() - 3600000).toISOString(),
        last_execution_status: 'success',
        last_execution_duration_ms: 2100,
        execution_history: [
          {
            executed_at: new Date(Date.now() - 3600000).toISOString(),
            status: 'success',
            duration_ms: 2100,
            output_lines: 45
          }
        ]
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