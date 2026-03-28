import { NextResponse } from 'next/server';

// Google Apps Script Web App deployment URL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbylFtecUjOb_Frsa4G2pdkBUIeoFwuC260gqTIKpd9kBFgnn9OK7Ymqj-IcBVVv5g36Lg/exec';

let lastSheetData: any = null;
let lastSheetTime: string = '';

// ============================================
// Convert Google Sheets array format to dashboard format
// GAS returns: {agents: [[...]], jobs: [[...]], calendars: [[...]]}
// Dashboard needs: {agents: [{values: [...]}], ...}
// ============================================
function convertGASDataToDashboardFormat(gasData: any) {
  console.log('🔄 Converting GAS data to dashboard format');
  
  const converted: any = {};
  
  // Convert agents
  if (gasData.agents && Array.isArray(gasData.agents)) {
    converted.agents = gasData.agents.map((row: any[]) => ({
      values: row.map(val => ({
        formattedValue: val === null || val === undefined ? '' : String(val)
      }))
    }));
    console.log(`  ✅ Agents: ${converted.agents.length} rows`);
  }
  
  // Convert jobs
  if (gasData.jobs && Array.isArray(gasData.jobs)) {
    converted.jobs = gasData.jobs.map((row: any[]) => ({
      values: row.map(val => ({
        formattedValue: val === null || val === undefined ? '' : String(val)
      }))
    }));
    console.log(`  ✅ Jobs: ${converted.jobs.length} rows`);
  }
  
  // Convert calendars
  if (gasData.calendars && Array.isArray(gasData.calendars)) {
    converted.calendars = gasData.calendars.map((row: any[]) => ({
      values: row.map(val => ({
        formattedValue: val === null || val === undefined ? '' : String(val)
      }))
    }));
    console.log(`  ✅ Calendars: ${converted.calendars.length} rows`);
  }
  
  return converted;
}

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
  console.log('📋 Sheet data GET requested - fetching from Google Apps Script');
  
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
    console.log('   GAS Response length:', gasResponse.length);
    console.log('   GAS Response preview:', gasResponse.substring(0, 300));
    
    // Parse the response - it should be JSON
    let gasData;
    try {
      // First try direct JSON parse
      gasData = JSON.parse(gasResponse);
      console.log('   ✅ Parsed as JSON');
    } catch (e) {
      console.log('   Trying to extract JSON from HTML...');
      // Try to extract JSON from HTML response
      const jsonMatch = gasResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        gasData = JSON.parse(jsonMatch[0]);
        console.log('   ✅ Extracted JSON from HTML');
      } else {
        throw new Error('Could not find JSON in GAS response');
      }
    }
    
    console.log('   Parsed GAS data keys:', Object.keys(gasData || {}));
    
    if (gasData && gasData.data) {
      console.log('✅ Got fresh data from GAS');
      
      // Convert to dashboard format
      const dashboardFormat = convertGASDataToDashboardFormat(gasData.data);
      
      console.log('✅ Converted to dashboard format:');
      console.log('   - Agents:', dashboardFormat.agents?.length || 0);
      console.log('   - Jobs:', dashboardFormat.jobs?.length || 0);
      console.log('   - Calendars:', dashboardFormat.calendars?.length || 0);
      
      return NextResponse.json({
        success: true,
        timestamp: gasData.data.timestamp || new Date().toISOString(),
        source: 'google_apps_script_live',
        data: dashboardFormat
      }, { status: 200 });
    } else {
      console.log('⚠️  GAS response missing data field, structure:', Object.keys(gasData || {}));
      
      // Maybe the entire response IS the data?
      if (gasData && (gasData.agents || gasData.jobs || gasData.calendars)) {
        console.log('✅ GAS response appears to be data directly');
        const dashboardFormat = convertGASDataToDashboardFormat(gasData);
        
        return NextResponse.json({
          success: true,
          timestamp: new Date().toISOString(),
          source: 'google_apps_script_live',
          data: dashboardFormat
        }, { status: 200 });
      }
      
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
