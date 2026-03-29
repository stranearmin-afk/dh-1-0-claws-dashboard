// app/api/calendar/route.ts
// Fetch upcoming Google Calendar events via Composio.

import { NextResponse } from 'next/server';
import { executeComposioTool } from '@/lib/composio';

export async function GET() {
  try {
    const now = new Date().toISOString();

    const data = await executeComposioTool(
      'googlecalendar',
      'GOOGLECALENDAR_LIST_EVENTS',
      {
        calendar_id: 'primary',
        time_min: now,
        max_results: 20,
        single_events: true,
        order_by: 'startTime',
      }
    );

    const items: any[] = data?.data?.items || data?.items || [];

    const events = items.map((item: any) => ({
      id: item.id || '',
      summary: item.summary || '(no title)',
      start: item.start?.dateTime || item.start?.date || '',
      end: item.end?.dateTime || item.end?.date || '',
      location: item.location || '',
      description: item.description || '',
      attendees_count: item.attendees?.length ?? 0,
      html_link: item.htmlLink || '',
      status: item.status || '',
    }));

    return NextResponse.json({
      success: true,
      total: events.length,
      events,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[CALENDAR] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
