// app/api/drive/route.ts
// Fetch recent Google Drive files via Composio.

import { NextResponse } from 'next/server';
import { executeComposioTool } from '@/lib/composio';

export async function GET() {
  try {
    const data = await executeComposioTool('googledrive', 'GOOGLEDRIVE_FIND_FILE', {
      query: '',
      max_results: 20,
      order_by: 'modifiedTime desc',
    });

    const items: any[] = data?.data?.files || data?.files || [];

    const files = items.map((file: any) => ({
      id: file.id || '',
      name: file.name || '',
      mime_type: file.mimeType || '',
      modified_time: file.modifiedTime || '',
      size: file.size ? Number(file.size) : null,
      web_view_link: file.webViewLink || '',
      owners: file.owners?.map((o: any) => o.displayName || o.emailAddress) || [],
    }));

    return NextResponse.json({
      success: true,
      total: files.length,
      files,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[DRIVE] Error:', error);
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
