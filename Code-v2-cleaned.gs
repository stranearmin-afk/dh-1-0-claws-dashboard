// ============================================
// GOOGLE APPS SCRIPT - Dashboard Data Trigger
// Spreadsheet: Agent Dashboard Data
// ID: 1NyQHZXT-QkA7EX8LX3B4CAyWfzrRoAb9nbTMJmStGyk
// Purpose: Manual trigger only (dashboard fetches via /api/sheets)
// ============================================

// === CONFIGURATION ===
const SPREADSHEET_ID = '1NyQHZXT-QkA7EX8LX3B4CAyWfzrRoAb9nbTMJmStGyk';
const MONITORED_SHEETS = ['Agents', 'Cron Jobs', 'Calendars'];

// ============================================
// FUNCTION 1: Manual Web App Endpoint
// (Called via /exec from Google Apps Script deployment)
// ============================================
function doGet(e) {
  return HtmlService.createHtmlOutput('Google Apps Script is running');
}

function doPost(e) {
  try {
    const action = e.parameter?.action || 'default';
    
    Logger.log(`🔔 doPost called with action: ${action}`);
    
    if (action === 'getSheetData') {
      const data = getSheetDataForWebhook();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        data: data
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log(`❌ doPost error: ${error.toString()}`);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// FUNCTION 2: Get Data from ALL 3 Sheets
// ============================================
function getSheetDataForWebhook() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const data = {};
    
    // Agents sheet
    try {
      const agentSheet = ss.getSheetByName('Agents');
      if (agentSheet) {
        data.agents = agentSheet.getDataRange().getValues();
        Logger.log(`✅ Agents data: ${data.agents.length} rows`);
      }
    } catch (e) {
      Logger.log(`⚠️  Could not fetch Agents: ${e.toString()}`);
    }
    
    // Cron Jobs
    try {
      const jobSheet = ss.getSheetByName('Cron Jobs');
      if (jobSheet) {
        data.jobs = jobSheet.getDataRange().getValues();
        Logger.log(`✅ Cron Jobs data: ${data.jobs.length} rows`);
      }
    } catch (e) {
      Logger.log(`⚠️  Could not fetch Cron Jobs: ${e.toString()}`);
    }
    
    // Calendars
    try {
      const calendarSheet = ss.getSheetByName('Calendars');
      if (calendarSheet) {
        data.calendars = calendarSheet.getDataRange().getValues();
        Logger.log(`✅ Calendars data: ${data.calendars.length} rows`);
      }
    } catch (e) {
      Logger.log(`⚠️  Could not fetch Calendars: ${e.toString()}`);
    }
    
    data.timestamp = new Date().toISOString();
    data.spreadsheetId = SPREADSHEET_ID;
    
    return data;
  } catch (error) {
    Logger.log(`❌ Error fetching sheet data: ${error.toString()}`);
    return { timestamp: new Date().toISOString(), error: error.toString() };
  }
}

// ============================================
// FUNCTION 3: Check Configuration
// (Verify setup is correct)
// ============================================
function checkConfig() {
  Logger.log('🔍 Configuration Check:');
  Logger.log(`   Spreadsheet ID: ${SPREADSHEET_ID}`);
  Logger.log(`   Monitored Sheets: ${MONITORED_SHEETS.join(', ')}`);
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const allSheets = ss.getSheets().map(s => s.getName());
  Logger.log(`   Available sheets: ${allSheets.join(', ')}`);
  Logger.log(`   ✅ Configuration verified`);
}

// ============================================
// FUNCTION 4: Get Sheet Names (for debugging)
// ============================================
function getSheetNames() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheets = ss.getSheets().map(s => s.getName());
  Logger.log('Available sheets:');
  sheets.forEach((name, index) => {
    Logger.log(`  ${index + 1}. ${name}`);
  });
  return sheets;
}

// ============================================
// NOTES
// ============================================
/*
CHANGES FROM v1:
✅ Removed onEdit() trigger (no longer needed)
✅ Removed triggerWebhook() function (not used)
✅ Removed WEBHOOK_URL configuration (not used)
✅ Removed manual trigger functions (redundant)
✅ Simplified to essential functions only
✅ Dashboard now fetches via /api/sheets using Composio

NEW FLOW:
1. User clicks "Refresh Now" on dashboard
2. Dashboard calls /api/sheets (GET)
3. /api/sheets calls Composio API
4. Composio fetches from Google Sheets
5. Dashboard displays live data

NO CHANGES NEEDED:
- Google Apps Script deployment still active
- Can be used for testing via doPost() if needed
- All data access functions still available
*/
