// app/api/webhook/route.ts
// Webhook endpoint to receive Google Apps Script updates
// Persists data using Vercel KV or simple storage

import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const CACHE_KEY = "dashboard:latest_data";
const CACHE_TTL = 3600; // 1 hour

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
    
    // Store in Vercel KV (persistent across serverless invocations)
    try {
      await kv.set(CACHE_KEY, JSON.stringify(storageData), {
        ex: CACHE_TTL,
      });
      console.log("[WEBHOOK] Data stored in Vercel KV");
    } catch (kvError) {
      // KV might not be available in all environments
      console.warn("[WEBHOOK] Vercel KV unavailable, data stored in memory only:", kvError);
    }
    
    return NextResponse.json({
      success: true,
      message: "Webhook received and data persisted",
      timestamp: storageData.timestamp,
      sheets: storageData.sheets,
      dataReceived: {
        agents: Array.isArray(storageData.agents) ? storageData.agents.length : 0,
        jobs: Array.isArray(storageData.jobs) ? storageData.jobs.length : 0,
        calendars: Array.isArray(storageData.calendars) ? storageData.calendars.length : 0,
      },
    });
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
    let cachedData = null;
    
    // Try to fetch from Vercel KV first
    try {
      const kvData = await kv.get(CACHE_KEY);
      if (kvData) {
        cachedData = typeof kvData === "string" ? JSON.parse(kvData) : kvData;
        console.log("[WEBHOOK] Retrieved data from Vercel KV");
      }
    } catch (kvError) {
      console.warn("[WEBHOOK] Could not retrieve from KV:", kvError);
    }
    
    // If no KV data, try to parse from request cache header (fallback)
    if (!cachedData) {
      console.log("[WEBHOOK] No cached data available, returning empty");
      cachedData = {
        agents: [],
        jobs: [],
        calendars: [],
        timestamp: new Date().toISOString(),
      };
    }
    
    return NextResponse.json(
      {
        success: true,
        data: cachedData.data || cachedData,
        timestamp: cachedData.timestamp,
        sheets: cachedData.sheets || [],
        message: cachedData.agents ? "Using live data from Google Sheets" : "No data received yet",
      },
      {
        headers: {
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
