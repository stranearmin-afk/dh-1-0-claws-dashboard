import { NextResponse } from 'next/server';

// This endpoint receives sheet data pushed by Google Apps Script webhook
// Google Apps Script onEdit trigger POSTs data here when cells are edited
// Dashboard GETs data from here to display live updates

let lastSheetData: any = null;
let lastSheetTime: string = '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('✅ Sheet data received from Google Apps Script');
    console.log('   Timestamp:', body.timestamp);
    console.log('   Sheets:', body.sheets?.join(', '));
    
    // Store the data
    lastSheetData = body.data;
    lastSheetTime = body.timestamp || new Date().toISOString();
    
    console.log('   Data stored:');
    console.log('   - Agents:', body.data?.agents?.length || 0, 'rows');
    console.log('   - Jobs:', body.data?.jobs?.length || 0, 'rows');
    console.log('   - Calendars:', body.data?.calendars?.length || 0, 'rows');
    
    return NextResponse.json({
      success: true,
      message: 'Sheet data received and stored',
      timestamp: lastSheetTime
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Error storing sheet data:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

export async function GET() {
  console.log('📥 Sheet data GET requested');
  
  if (!lastSheetData) {
    console.log('❌ No data available');
    return NextResponse.json({
      success: false,
      message: 'No data available - edit a cell in Google Sheet to trigger data push',
      hint: 'Edit any cell in Agents, Cron Jobs, or Calendars sheet'
    }, { status: 200 });
  }
  
  console.log('✅ Returning stored sheet data');
  return NextResponse.json({
    success: true,
    timestamp: lastSheetTime,
    source: 'google_apps_script_webhook',
    data: lastSheetData
  }, { status: 200 });
}
