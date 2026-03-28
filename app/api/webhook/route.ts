import { NextResponse } from 'next/server';

// This endpoint receives webhook calls from Google Apps Script
// It stores the incoming data AND can fetch directly from Google Sheets

let lastWebhookData: any = null;
let lastWebhookTime: string = '';

// Google Sheets API helper
async function fetchFromGoogleSheets() {
  try {
    const SPREADSHEET_ID = '1NyQHZXT-QkA7EX8LX3B4CAyWfzrRoAb9nbTMJmStGyk';
    const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
    
    if (!API_KEY) {
      console.warn('⚠️  GOOGLE_SHEETS_API_KEY not configured - will use webhook data only');
      return null;
    }

    console.log('📊 Fetching from Google Sheets API...');

    const ranges = ['Agents', 'Cron Jobs', 'Calendars'];
    const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?key=${API_KEY}&ranges=${ranges.map(r => encodeURIComponent(r)).join('&ranges=')}`;

    const response = await fetch(batchUrl);

    if (!response.ok) {
      console.error(`❌ Google Sheets API error: ${response.status}`);
      return null;
    }

    const result = await response.json();
    const data: any = {};

    // Parse the batch response
    if (result.valueRanges) {
      result.valueRanges.forEach((range: any, index: number) => {
        if (range.values) {
          if (index === 0) data.agents = range.values;
          else if (index === 1) data.jobs = range.values;
          else if (index === 2) data.calendars = range.values;
        }
      });
    }

    console.log('✅ Google Sheets data fetched successfully');
    return {
      timestamp: new Date().toISOString(),
      source: 'google_sheets_api',
      spreadsheetId: SPREADSHEET_ID,
      data: data
    };
  } catch (error) {
    console.error('❌ Error fetching from Google Sheets:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Log the incoming webhook
    console.log('✅ Webhook received from Google Apps Script');
    console.log('   Timestamp:', body.timestamp);
    console.log('   Event:', body.event);
    console.log('   Sheets:', body.sheets?.join(', '));
    
    // Store the data
    lastWebhookData = body.data;
    lastWebhookTime = new Date().toISOString();
    
    console.log('   Data stored in memory');
    console.log('   Agents:', body.data?.agents?.length || 0, 'rows');
    console.log('   Jobs:', body.data?.jobs?.length || 0, 'rows');
    console.log('   Calendars:', body.data?.calendars?.length || 0, 'rows');
    
    return NextResponse.json({
      success: true,
      message: 'Webhook received and stored',
      timestamp: lastWebhookTime,
      data_received: {
        agents: body.data?.agents?.length || 0,
        jobs: body.data?.jobs?.length || 0,
        calendars: body.data?.calendars?.length || 0
      }
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

// GET endpoint to retrieve the last webhook data
// Falls back to Google Sheets API if memory is empty
export async function GET() {
  console.log('📥 Webhook GET requested');
  console.log('   Memory status:', lastWebhookData ? '✅ Data in memory' : '❌ No data in memory');

  // If data is in memory, return it immediately
  if (lastWebhookData) {
    console.log('📤 Returning data from memory');
    return NextResponse.json({
      success: true,
      last_webhook_time: lastWebhookTime,
      data: lastWebhookData,
      status: 'data_from_memory',
      source: 'webhook_post_storage'
    });
  }

  // If no memory data, try to fetch from Google Sheets API
  console.log('🔄 No data in memory - attempting Google Sheets API fetch');
  const sheetsData = await fetchFromGoogleSheets();

  if (sheetsData) {
    return NextResponse.json({
      success: true,
      ...sheetsData,
      status: 'data_from_sheets_api',
      note: 'This data came from Google Sheets API (not webhook)'
    });
  }

  // If all else fails, return mock data indicator
  return NextResponse.json({
    success: false,
    last_webhook_time: lastWebhookTime,
    data: null,
    status: 'no_data_available',
    error: 'No webhook data in memory and Google Sheets API unavailable',
    hint: 'Make sure to: 1) Configure GOOGLE_SHEETS_API_KEY env var, 2) Click refresh button, 3) Check Google Apps Script logs'
  }, { status: 200 });
}
