// app/api/workspace/route.ts
// Unified health check — pings all four Google Workspace services via Composio
// and reports connectivity status. Hit GET /api/workspace to verify everything is wired up.

import { NextResponse } from 'next/server';
import { executeComposioTool } from '@/lib/composio';

const SPREADSHEET_ID = '1NyQHZXT-QkA7EX8LX3B4CAyWfzrRoAb9nbTMJmStGyk';

async function checkGmail(): Promise<{ connected: boolean; unread_count?: number; error?: string }> {
  try {
    const data = await executeComposioTool('gmail', 'GMAIL_FETCH_EMAILS', {
      max_results: 1,
      label_ids: ['UNREAD'],
      include_spam_trash: false,
    });
    const messages: any[] = data?.data?.messages || data?.messages || [];
    return { connected: true, unread_count: messages.length };
  } catch (err) {
    return { connected: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function checkCalendar(): Promise<{ connected: boolean; upcoming_events?: number; error?: string }> {
  try {
    const data = await executeComposioTool('googlecalendar', 'GOOGLECALENDAR_LIST_EVENTS', {
      calendar_id: 'primary',
      time_min: new Date().toISOString(),
      max_results: 5,
      single_events: true,
      order_by: 'startTime',
    });
    const items: any[] = data?.data?.items || data?.items || [];
    return { connected: true, upcoming_events: items.length };
  } catch (err) {
    return { connected: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function checkDrive(): Promise<{ connected: boolean; recent_files?: number; error?: string }> {
  try {
    const data = await executeComposioTool('googledrive', 'GOOGLEDRIVE_FIND_FILE', {
      query: '',
      max_results: 5,
      order_by: 'modifiedTime desc',
    });
    const files: any[] = data?.data?.files || data?.files || [];
    return { connected: true, recent_files: files.length };
  } catch (err) {
    return { connected: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function checkSheets(): Promise<{ connected: boolean; spreadsheet_id: string; error?: string }> {
  try {
    await executeComposioTool('googlesheets', 'GOOGLESHEETS_BATCH_GET', {
      spreadsheet_id: SPREADSHEET_ID,
      ranges: ["'Agents'!A1:A2"],
    });
    return { connected: true, spreadsheet_id: SPREADSHEET_ID };
  } catch (err) {
    return { connected: false, spreadsheet_id: SPREADSHEET_ID, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function GET() {
  const [gmail, calendar, drive, sheets] = await Promise.allSettled([
    checkGmail(),
    checkCalendar(),
    checkDrive(),
    checkSheets(),
  ]);

  const services = {
    gmail:    gmail.status    === 'fulfilled' ? gmail.value    : { connected: false, error: String(gmail.reason) },
    calendar: calendar.status === 'fulfilled' ? calendar.value : { connected: false, error: String(calendar.reason) },
    drive:    drive.status    === 'fulfilled' ? drive.value    : { connected: false, error: String(drive.reason) },
    sheets:   sheets.status   === 'fulfilled' ? sheets.value   : { connected: false, spreadsheet_id: SPREADSHEET_ID, error: String(sheets.reason) },
  };

  const allConnected = Object.values(services).every((s) => s.connected);

  return NextResponse.json({
    status: allConnected ? 'ok' : 'partial',
    services,
    timestamp: new Date().toISOString(),
  });
}
