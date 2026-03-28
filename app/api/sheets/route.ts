import { NextResponse } from 'next/server';

// This endpoint fetches data directly from Google Sheets via Composio
// Called when user clicks "Refresh Now" on the dashboard

export async function GET() {
  try {
    console.log('📊 Sheets GET requested - fetching from Google Sheets via Composio');

    // Call Composio API to fetch Google Sheets data
    // We'll use the proxy to call Composio's Google Sheets integration
    const composioResponse = await fetch('https://api.composio.dev/api/v1/client/apps/googlesheets/actions/get_spreadsheet_values', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COMPOSIO_API_KEY}`
      },
      body: JSON.stringify({
        spreadsheetId: '1NyQHZXT-QkA7EX8LX3B4CAyWfzrRoAb9nbTMJmStGyk',
        ranges: ['Agents', 'Cron Jobs', 'Calendars']
      })
    });

    if (!composioResponse.ok) {
      console.error(`❌ Composio error: ${composioResponse.status}`);
      const error = await composioResponse.text();
      console.error('Error details:', error);
      return NextResponse.json({
        success: false,
        error: `Composio API error: ${composioResponse.status}`,
        details: error
      }, { status: 500 });
    }

    const result = await composioResponse.json();
    console.log('✅ Data fetched from Google Sheets via Composio');

    // Parse the Composio response into our expected format
    const data: any = {};
    if (result.data) {
      result.data.forEach((sheet: any) => {
        if (sheet.sheetName === 'Agents') data.agents = sheet.values;
        else if (sheet.sheetName === 'Cron Jobs') data.jobs = sheet.values;
        else if (sheet.sheetName === 'Calendars') data.calendars = sheet.values;
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      source: 'google_sheets_composio',
      data: data,
      rows_fetched: {
        agents: data.agents?.length || 0,
        jobs: data.jobs?.length || 0,
        calendars: data.calendars?.length || 0
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching from Sheets:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Make sure COMPOSIO_API_KEY is configured'
    }, { status: 500 });
  }
}
