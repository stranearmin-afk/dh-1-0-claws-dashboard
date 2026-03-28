import { NextResponse } from 'next/server';

// This endpoint receives webhook calls from Google Apps Script
// It stores the incoming data so the dashboard can fetch it

let lastWebhookData: any = null;
let lastWebhookTime: string = '';

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
    
    return NextResponse.json({
      success: true,
      message: 'Webhook received',
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
export async function GET() {
  return NextResponse.json({
    last_webhook_time: lastWebhookTime,
    data: lastWebhookData,
    status: lastWebhookData ? 'Data available' : 'No data received yet'
  });
}
