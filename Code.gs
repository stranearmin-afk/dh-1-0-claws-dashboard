// ============================================
// GOOGLE APPS SCRIPT - Dashboard Auto-Update
// Spreadsheet: Agent Dashboard Data
// ID: 1NyQHZXT-QkA7EX8LX3B4CAyWfzrRoAb9nbTMJmStGyk
// Purpose: Push sheet data to dashboard when edited
// ============================================

// === CONFIGURATION ===
const SPREADSHEET_ID = '1NyQHZXT-QkA7EX8LX3B4CAyWfzrRoAb9nbTMJmStGyk';
const WEBHOOK_URL = 'https://dh-1-0-claws-dashboard.vercel.app/api/sheets';
const MONITORED_SHEETS = ['Agents', 'Cron Jobs', 'Calendars'];

// ============================================
// WEB APP ENDPOINT - doPost for refresh button
// ============================================
function doPost(e) {
  Logger.log('🚀 doPost called - fetching and sending all sheet data');
  return sendAllDataNow();
}

function doGet(e) {
  return HtmlService.createHtmlOutput('Google Apps Script is running');
}

// ============================================
// MAIN FUNCTION: Fetch all data and POST to webhook
// ============================================
function sendAllDataNow() {
  try {
    Logger.log('📊 sendAllDataNow() - gathering sheet data...');
    
    const data = getSheetDataForWebhook();
    
    const payload = {
      timestamp: new Date().toISOString(),
      spreadsheetId: SPREADSHEET_ID,
      event: 'sheet_updated',
      sheets: MONITORED_SHEETS,
      data: data
    };

    Logger.log('📤 Sending payload to webhook...');
    Logger.log(`   URL: ${WEBHOOK_URL}`)
    Logger.log(`   Size: ${JSON.stringify(payload).length} bytes`);
    
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
      timeout: 30
    };

    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log(`✅ Webhook response: ${responseCode}`)
    Logger.log(`   Response text: ${responseText.substring(0, 200)}`);
    
    if (responseCode === 200 || responseCode === 204) {
      Logger.log('✅ Data successfully sent to dashboard');
      return HtmlService.createHtmlOutput(JSON.stringify({
        success: true,
        message: 'Data sent to dashboard',
        status: responseCode,
        timestamp: new Date().toISOString()
      }));
    } else {
      Logger.log(`⚠️  Webhook returned ${responseCode}`);
      return HtmlService.createHtmlOutput(JSON.stringify({
        success: false,
        message: `Webhook error: ${responseCode}`,
        response: responseText
      }));
    }
  } catch (error) {
    Logger.log(`❌ Error in sendAllDataNow: ${error.toString()}`);
    return HtmlService.createHtmlOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }));
  }
}

// ============================================
// ON EDIT TRIGGER - Installable trigger (full permissions)
// ============================================
function onEditHandler(e) {
  if (!e || !e.source) {
    Logger.log('❌ onEditHandler: No event or source');
    return;
  }
  
  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName();
  
  // Only monitor these sheets
  if (!MONITORED_SHEETS.includes(sheetName)) {
    Logger.log(`↩️  Skipped sheet: ${sheetName}`);
    return;
  }
  
  const editRange = e.range;
  const editor = e.user ? e.user.getEmail() : 'Unknown';
  
  Logger.log(`📝 Sheet edited: ${sheetName}`);
  Logger.log(`   Range: ${editRange.getA1Notation()}`);
  Logger.log(`   Value: ${editRange.getValue()}`);
  Logger.log(`   Editor: ${editor}`);
  
  // Get the data directly from sheet (onEdit has sheet permission)
  Logger.log(`📊 Gathering data to send...`);
  const data = getSheetDataForWebhook();
  
  const payload = {
    timestamp: new Date().toISOString(),
    spreadsheetId: SPREADSHEET_ID,
    event: 'sheet_updated',
    sheets: MONITORED_SHEETS,
    data: data
  };

  Logger.log('📤 Posting to webhook...');
  
  try {
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
      timeout: 30
    };

    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    
    Logger.log(`✅ onEdit webhook response: ${responseCode}`);
  } catch (error) {
    Logger.log(`❌ onEdit webhook error: ${error.toString()}`);
  }
}

// ============================================
// GET DATA FROM ALL 3 SHEETS
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
        Logger.log(`✅ Agents: ${data.agents.length} rows`);
      }
    } catch (e) {
      Logger.log(`⚠️  Agents error: ${e.toString()}`);
    }
    
    // Cron Jobs
    try {
      const jobSheet = ss.getSheetByName('Cron Jobs');
      if (jobSheet) {
        data.jobs = jobSheet.getDataRange().getValues();
        Logger.log(`✅ Jobs: ${data.jobs.length} rows`);
      }
    } catch (e) {
      Logger.log(`⚠️  Jobs error: ${e.toString()}`);
    }
    
    // Calendars
    try {
      const calendarSheet = ss.getSheetByName('Calendars');
      if (calendarSheet) {
        data.calendars = calendarSheet.getDataRange().getValues();
        Logger.log(`✅ Calendars: ${data.calendars.length} rows`);
      }
    } catch (e) {
      Logger.log(`⚠️  Calendars error: ${e.toString()}`);
    }
    
    data.timestamp = new Date().toISOString();
    data.spreadsheetId = SPREADSHEET_ID;
    
    return data;
  } catch (error) {
    Logger.log(`❌ Error fetching sheet data: ${error.toString()}`);
    return { error: error.toString() };
  }
}

// ============================================
// SETUP TRIGGER - Run ONCE to install installable trigger
// ============================================
function setupTrigger() {
  Logger.log('⚙️ Setting up installable onEdit trigger...');
  
  // Remove existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  let removed = 0;
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onEditHandler' || trigger.getHandlerFunction() === 'onEdit') {
      ScriptApp.deleteTrigger(trigger);
      removed++;
      Logger.log(`Removed old trigger: ${trigger.getHandlerFunction()}`);
    }
  });
  
  Logger.log(`Removed ${removed} old triggers`);
  
  // Create NEW installable trigger with full permissions
  ScriptApp.newTrigger('onEditHandler')
    .forSpreadsheet(SpreadsheetApp.openById(SPREADSHEET_ID))
    .onEdit()
    .create();
  
  Logger.log('✅ Installable trigger created for onEditHandler - will have full permissions');
  Logger.log('   You can now edit cells and the webhook will be triggered');
  Logger.log('   Check logs for activity');
}

// ============================================
// TEST FUNCTIONS
// ============================================
function testWebhook() {
  Logger.log('🧪 Testing webhook...');
  const data = getSheetDataForWebhook();
  Logger.log(`   Found data for ${Object.keys(data).length} sheets`);
  
  const payload = {
    timestamp: new Date().toISOString(),
    spreadsheetId: SPREADSHEET_ID,
    event: 'test',
    sheets: MONITORED_SHEETS,
    data: data
  };
  
  try {
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log(`✅ Test webhook response: ${response.getResponseCode()}`);
  } catch (error) {
    Logger.log(`❌ Test error: ${error.toString()}`);
  }
}

function checkConfig() {
  Logger.log('🔍 Configuration:');
  Logger.log(`   Spreadsheet: ${SPREADSHEET_ID}`);
  Logger.log(`   Webhook URL: ${WEBHOOK_URL}`);
  Logger.log(`   Monitored sheets: ${MONITORED_SHEETS.join(', ')}`);
}
