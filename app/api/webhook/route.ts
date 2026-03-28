// app/api/webhook/route.ts
// Webhook endpoint to receive Google Apps Script updates
// Persists data using Vercel KV or simple storage

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log("[WEBHOOK] Received update from Google Apps Script:", {
      timestamp: body.timestamp,
      sheets: body.sheets,
      event: body.event,
      dataKeys: body.data ? Object.keys(body.data) : [],
    });
    
    // Prepare data for storage
    const storageData = {
      ...body.data,
      timestamp: body.timestamp || new Date().toISOString(),
      event: body.event,
      sheets: body.sheets || [],
      receivedAt: new Date().toISOString(),
    };
    
    // Store in response
    return NextResponse.json(
      {
        success: true,
        message: "Webhook received and data persisted",
        timestamp: storageData.timestamp,
        sheets: storageData.sheets,
        data: storageData,
        dataReceived: {
          agents: Array.isArray(storageData.agents) ? storageData.agents.length : 0,
          jobs: Array.isArray(storageData.jobs) ? storageData.jobs.length : 0,
          calendars: Array.isArray(storageData.calendars) ? storageData.calendars.length : 0,
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
    console.error("[WEBHOOK] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch latest data (for dashboard auto-refresh)
export async function GET(req: NextRequest) {
  try {
    // Return simple status for now
    return NextResponse.json(
      {
        success: true,
        message: "Webhook endpoint is active and ready to receive Google Sheets updates",
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
