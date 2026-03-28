// ============================================
// GOOGLE APPS SCRIPT - Dashboard Auto-Update
// Spreadsheet: Agent Dashboard Data
// ID: 1NyQHZXT-QkA7EX8LX3B4CAyWfzrRoAb9nbTMJmStGyk
// Purpose: Monitor ALL 3 sheets and trigger webhook
// SHEET NAMES: Agents, Cron Jobs, Calendars (CORRECT)
// ============================================

// === CONFIGURATION ===
const SPREADSHEET_ID = '1NyQHZXT-QkA7EX8LX3B4CAyWfzrRoAb9nbTMJmStGyk';
const WEBHOOK_URL = 'https://dh-1-0-claws-dashboard.vercel.app/api/webhook'; // ✅ UPDATED
const MONITORED_SHEETS = ['Agents', 'Cron Jobs', 'Calendars']; // ✅ FIXED: Sheet1 -> Agents
const LAST_EDIT_PROPERTY = 'lastSheetUpdate';

// ============================================
// FUNCTION 0: Web App Deployment (doGet)
// Required for web app deployments
// ============================================
function doGet(e) {
  return HtmlService.createHtmlOutput(
    '<h1>Google Apps Script Webhook Active</h1>' +
    '<p>Sheet Monitor: ACTIVE</p>' +
    '<p>Monitored Sheets: ' + MONITORED_SHEETS.join(', ') + '</p>' +
    '<p>Webhook URL: ' + WEBHOOK_URL + '</p>' +
    '<p><strong>Status: ✅ Ready</strong></p>' +
    '<p>Edit any cell in Agents, Cron Jobs, or Calendars to trigger webhook.</p>' +
    '<p><a href="https://script.google.com/home" target="_blank">Go to Apps Script Projects</a></p>'
  );
}

// ============================================
// FUNCTION 1: Send Webhook Trigger
// ============================================
function triggerWebhook() {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      spreadsheetId: SPREADSHEET_ID,
      event: 'sheet_updated',
      sheets: MONITORED_SHEETS,
      data: getSheetDataForWebhook()
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
      timeout: 10
    };

    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    
    Logger.log(`✅ Webhook triggered: ${responseCode}`);
    Logger.log(`   URL: ${WEBHOOK_URL}`);
    Logger.log(`   Payload size: ${JSON.stringify(payload).length} bytes`);
    
    // Store last trigger time
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty(LAST_EDIT_PROPERTY, new Date().toISOString());
    
    return responseCode === 200 || responseCode === 204;
  } catch (error) {
    Logger.log(`❌ Webhook error: ${error.toString()}`);
    return false;
  }
}

// ============================================
// FUNCTION 2: On Sheet Edit Trigger
// (Detects ANY cell change in monitored sheets)
// ============================================
function onEdit(e) {
  if (!e || !e.source) return; // Safety check
  
  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName();
  
  // Only monitor Agents, Cron Jobs, and Calendars
  if (!MONITORED_SHEETS.includes(sheetName)) {
    Logger.log(`↩️  Skipped sheet: ${sheetName} (not monitored)`);
    return;
  }
  
  const editRange = e.range;
  const editor = e.user ? e.user.getEmail() : 'Unknown';
  
  Logger.log(`📝 Sheet edited: ${sheetName}`);
  Logger.log(`   Range: ${editRange.getA1Notation()}`);
  Logger.log(`   Value: ${editRange.getValue()}`);
  Logger.log(`   Editor: ${editor}`);
  Logger.log(`   Time: ${new Date().toISOString()}`);
  
  // Trigger webhook immediately
  triggerWebhook();
}

// ============================================
// FUNCTION 3: Manual Test Webhook
// (Run this from Apps Script Editor to test)
// ============================================
function testWebhook() {
  Logger.log('🧪 Testing webhook...');
  Logger.log(`   Target: ${WEBHOOK_URL}`);
  Logger.log(`   Sheets: ${MONITORED_SHEETS.join(", ")}`);
  const success = triggerWebhook();
  Logger.log(`Test result: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
  Logger.log('Check your webhook endpoint for the request.');
}

// ============================================
// FUNCTION 4: Setup Installable Trigger
// (Run once to set up the onEdit trigger)
// ============================================
function setupTrigger() {
  Logger.log('⚙️ Setting up installable trigger...');
  
  // Remove existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  let removed = 0;
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onEdit') {
      ScriptApp.deleteTrigger(trigger);
      removed++;
    }
  });
  
  Logger.log(`Removed ${removed} existing triggers`);
  
  // Create new onEdit trigger
  ScriptApp.newTrigger('onEdit')
    .forSpreadsheet(SpreadsheetApp.openById(SPREADSHEET_ID))
    .onEdit()
    .create();
  
  Logger.log('✅ Trigger installed successfully');
}

// ============================================
// FUNCTION 5: Get Data from ALL 3 Sheets
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
// FUNCTION 6: Check Configuration
// (Verify webhook URL is set correctly)
// ============================================
function checkConfig() {
  Logger.log('🔍 Configuration Check:');
  Logger.log(`   Spreadsheet ID: ${SPREADSHEET_ID}`);
  Logger.log(`   Webhook URL: ${WEBHOOK_URL}`);
  Logger.log(`   Monitored Sheets: ${MONITORED_SHEETS.join(', ')}`);
  
  if (WEBHOOK_URL === 'https://YOUR_WEBHOOK_ENDPOINT.com/api/dashboard-update') {
    Logger.log(`   ⚠️  WARNING: Webhook URL not configured!`);
    Logger.log(`   📝 Please update WEBHOOK_URL`);
  } else {
    Logger.log(`   ✅ Webhook URL configured`);
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const allSheets = ss.getSheets().map(s => s.getName());
  Logger.log(`   Available sheets: ${allSheets.join(', ')}`);
}

// ============================================
// FUNCTION 7: Manual Trigger (Test All 3 Sheets)
// ============================================
function manualTriggerAll() {
  Logger.log('🚀 Manual trigger - fetching all sheet data...');
  const data = getSheetDataForWebhook();
  Logger.log('📊 Data retrieved:');
  Logger.log(JSON.stringify(data, null, 2));
  
  Logger.log('Sending to webhook...');
  triggerWebhook();
}

// ============================================
// FUNCTION 8: Get Sheet Names (for debugging)
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
// FINAL CHECKLIST
// ============================================
/*

✅ SETUP COMPLETE

1. ✅ Code.gs deployed with all 8 functions
2. ✅ Sheet names configured: Agents, Cron Jobs, Calendars
3. ✅ Webhook URL: https://dh-1-0-claws-dashboard.vercel.app/api/webhook
4. ✅ doGet function added (web app deployment)
5. ✅ onEdit trigger installed (you did this!)

NEXT STEPS:

1. Go back to your Google Sheet
2. Edit ANY cell in Agents, Cron Jobs, or Calendars
3. Go to: https://script.google.com/macros/s/AKfycbzPVerCruxvImtXVwbCiDooUD8VuSh0Qbb7h5E-8htc69gwc940NpBFKa-4QavBtn-h1w/exec
4. Scroll down to LOGS section
5. Look for: "✅ Webhook triggered: 200"

If you see 200 → Dashboard is receiving live data! 🎉

*/
