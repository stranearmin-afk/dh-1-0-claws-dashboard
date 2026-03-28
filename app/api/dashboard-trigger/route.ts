import { NextResponse } from 'next/server';

// This endpoint is called by the dashboard refresh button
// It should trigger the Google Apps Script sendAllDataNow() function

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbznwd01Ah-O0cwlB1yiKH_h_lshqH8zlju-tpQVmGI0-eSuU7ZjpxtdrMxRaX5rcCuooQ/exec';

export async function POST(request: Request) {
  try {
    console.log('🚀 Dashboard trigger requested');
    
    // Call the Google Apps Script deployment
    const scriptResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sendAllDataNow',
        timestamp: new Date().toISOString()
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    const scriptResult = await scriptResponse.text();
    
    console.log('✅ Google Apps Script triggered');
    console.log('   Status:', scriptResponse.status);
    console.log('   Response:', scriptResult.substring(0, 200));
    
    return NextResponse.json({
      success: true,
      message: 'Trigger sent to Google Apps Script',
      apps_script_status: scriptResponse.status,
      timestamp: new Date().toISOString(),
      hint: 'Data should arrive via webhook within 2-3 seconds'
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Trigger error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'Dashboard trigger endpoint active',
    usage: 'POST /api/dashboard-trigger to trigger Google Apps Script',
    script_url: GOOGLE_APPS_SCRIPT_URL,
    timestamp: new Date().toISOString()
  });
}
