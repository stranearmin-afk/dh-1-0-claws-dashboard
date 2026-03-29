// app/api/gmail/route.ts
// Fetch recent Gmail messages via Composio.

import { NextResponse } from 'next/server';
import { executeComposioTool } from '@/lib/composio';

export async function GET() {
  try {
    const data = await executeComposioTool('gmail', 'GMAIL_FETCH_EMAILS', {
      max_results: 20,
      label_ids: ['INBOX'],
      include_spam_trash: false,
    });

    const messages: any[] = data?.data?.messages || data?.messages || [];

    const emails = messages.map((msg: any) => ({
      id: msg.id || '',
      thread_id: msg.threadId || '',
      subject: msg.subject || msg.payload?.headers?.find((h: any) => h.name === 'Subject')?.value || '(no subject)',
      from: msg.from || msg.payload?.headers?.find((h: any) => h.name === 'From')?.value || '',
      date: msg.date || msg.internalDate || '',
      snippet: msg.snippet || '',
      is_read: !msg.labelIds?.includes('UNREAD'),
    }));

    const unread_count = emails.filter((e) => !e.is_read).length;

    return NextResponse.json({
      success: true,
      unread_count,
      total: emails.length,
      emails,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[GMAIL] Error:', error);
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
