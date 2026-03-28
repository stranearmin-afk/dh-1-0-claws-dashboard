import { NextResponse } from 'next/server';

// This endpoint ONLY receives webhook calls from Google Apps Script
// The actual data fetching happens in /api/sheets via Composio

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('✅ Webhook received from Google Apps Script');
    console.log('   Timestamp:', body.timestamp);
    console.log('   Event:', body.event);
    console.log('   Message: Data available - dashboard will fetch via /api/sheets');
    
    return NextResponse.json({
      success: true,
      message: 'Webhook acknowledged. Dashboard will fetch data from /api/sheets.',
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

// GET endpoint deprecated - use /api/sheets instead
export async function GET() {
  return NextResponse.json({
    status: 'deprecated',
    message: 'Use /api/sheets to fetch Google Sheets data',
    hint: 'POST /api/webhook receives webhook acknowledgments only'
  }, { status: 200 });
}
