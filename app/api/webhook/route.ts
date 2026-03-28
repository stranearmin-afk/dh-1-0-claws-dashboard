// app/api/webhook/route.ts
// Webhook endpoint to receive Google Apps Script updates
// Stores data in memory and returns it on GET

import { NextRequest, NextResponse } from "next/server";

// In-memory cache for webhook data (persists during serverless function lifetime)
let cachedWebhookData: any = null;
let lastUpdateTime: string = new Date().toISOString();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log("[WEBHOOK] Received update from Google Apps Script:", {
      timestamp: body.timestamp,
      sheets: body.sheets,
      event: body.event,
      dataKeys: body.data ? Object.keys(body.data) : [],
    });
    
    // Store the complete payload in memory
    cachedWebhookData = {
      success: true,
      timestamp: body.timestamp || new Date().toISOString(),
      event: body.event || 'sheet_updated',
      sheets: body.sheets || [],
      data: body.data || {},
      receivedAt: new Date().toISOString(),
    };
    
    lastUpdateTime = cachedWebhookData.timestamp;
    
    console.log("[WEBHOOK] Data cached in memory:", {
      agents: Array.isArray(cachedWebhookData.data.agents) ? cachedWebhookData.data.agents.length : 0,
      jobs: Array.isArray(cachedWebhookData.data.jobs) ? cachedWebhookData.data.jobs.length : 0,
      calendars: Array.isArray(cachedWebhookData.data.calendars) ? cachedWebhookData.data.calendars.length : 0,
    });
    
    return NextResponse.json(
      {
        success: true,
        message: "Webhook received successfully",
        timestamp: cachedWebhookData.timestamp,
        sheets: cachedWebhookData.sheets,
        dataReceived: {
          agents: Array.isArray(cachedWebhookData.data.agents) ? cachedWebhookData.data.agents.length : 0,
          jobs: Array.isArray(cachedWebhookData.data.jobs) ? cachedWebhookData.data.jobs.length : 0,
          calendars: Array.isArray(cachedWebhookData.data.calendars) ? cachedWebhookData.data.calendars.length : 0,
        },
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("[WEBHOOK] POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch latest cached data
export async function GET(req: NextRequest) {
  try {
    if (!cachedWebhookData) {
      console.log("[WEBHOOK] No cached data available yet");
      return NextResponse.json(
        {
          success: true,
          message: "Webhook endpoint is active but no data received yet",
          data: null,
          timestamp: new Date().toISOString(),
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, max-age=0",
          },
        }
      );
    }
    
    console.log("[WEBHOOK] Returning cached data from GET request");
    
    return NextResponse.json(
      cachedWebhookData,
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("[WEBHOOK] GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
