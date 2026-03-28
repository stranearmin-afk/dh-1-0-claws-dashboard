import { NextResponse } from 'next/server';

// Google Apps Script Web App deployment URL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbylFtecUjOb_Frsa4G2pdkBUIeoFwuC260gqTIKpd9kBFgnn9OK7Ymqj-IcBVVv5g36Lg/exec';

let lastSheetData: any = null;
let lastSheetTime: string = '';

// ============================================
// POST - Receive data from Google Apps Script
// ============================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('✅ Sheet data received from Google Apps Script');
    console.log('   Timestamp:', body.timestamp);
    console.log('   Sheets:', body.sheets?.join(', '));
    
    // Store the data for reference
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

// ============================================
// GET - Fetch fresh data from Google Apps Script
// ============================================
export async function GET() {
  console.log('📊 Sheet data GET requested - fetching from Google Apps Script');
  
  try {
    // Call Google Apps Script to get fresh data
    console.log('   Calling:', GAS_URL);
    
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'sendAllDataNow'
      })
    });
    
    console.log('   GAS Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`GAS returned ${response.status}`);
    }
    
    const gasResponse = await response.text();
    console.log('   GAS Response:', gasResponse.substring(0, 200));
    
    // Parse the response (it's HTML from doPost)
    let gasData;
    try {
      // Try to extract JSON from HTML response
      const jsonMatch = gasResponse.match(/\{[^}]*\}/);
      gasData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
      console.error('   Could not parse GAS response as JSON');
      gasData = null;
    }
    
    if (gasData && gasData.data) {
      console.log('✅ Got fresh data from GAS:');
      console.log('   - Agents:', gasData.data.agents?.length || 0, 'rows');
      console.log('   - Jobs:', gasData.data.jobs?.length || 0, 'rows');
      console.log('   - Calendars:', gasData.data.calendars?.length || 0, 'rows');
      
      // Convert raw array format to dashboard format
      return NextResponse.json({
        success: true,
        timestamp: gasData.data.timestamp,
        source: 'google_apps_script_live',
        data: {
          agents: gasData.data.agents || [],
          jobs: gasData.data.jobs || [],
          calendars: gasData.data.calendars || []
        }
      }, { status: 200 });
    } else {
      // Fall back to stored data if GAS response is invalid
      console.log('⚠️  GAS response invalid, using stored data');
      
      if (!lastSheetData) {
        return NextResponse.json({
          success: false,
          message: 'No data available - edit a cell in Google Sheet to trigger data push',
          hint: 'Edit any cell in Agents, Cron Jobs, or Calendars sheet'
        }, { status: 200 });
      }
      
      return NextResponse.json({
        success: true,
        timestamp: lastSheetTime,
        source: 'stored_data',
        data: lastSheetData
      }, { status: 200 });
    }
  } catch (error) {
    console.error('❌ Error fetching from GAS:', error);
    
    // Fall back to stored data
    if (lastSheetData) {
      console.log('   Falling back to stored data');
      return NextResponse.json({
        success: true,
        timestamp: lastSheetTime,
        source: 'stored_data_fallback',
        data: lastSheetData
      }, { status: 200 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Error fetching from Google Apps Script',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 });
  }
}
