// app/api/webhook/route.ts
// Webhook endpoint to receive Google Apps Script updates

import { NextRequest, NextResponse } from "next/server";

// Store the latest data from Google Sheets
let cachedSheetData: any = null;
let lastUpdated: string = new Date().toISOString();

// Broadcast channel for real-time updates (in production, use WebSocket)
const connections: Set<ReadableStreamDefaultController> = new Set();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log("[WEBHOOK] Received update from Google Apps Script:", {
      timestamp: body.timestamp,
      sheets: body.sheets,
      event: body.event,
    });
    
    // Store the data
    cachedSheetData = body.data || {};
    lastUpdated = body.timestamp || new Date().toISOString();
    
    // Broadcast to all connected clients (if using SSE)
    broadcastUpdate(body);
    
    return NextResponse.json({
      success: true,
      message: "Webhook received",
      timestamp: lastUpdated,
      sheets: body.sheets || [],
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
    return NextResponse.json({
      success: true,
      data: cachedSheetData,
      lastUpdated: lastUpdated,
    });
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

// Broadcast function for Server-Sent Events
function broadcastUpdate(payload: any) {
  const message = `data: ${JSON.stringify(payload)}\n\n`;
  connections.forEach((connection) => {
    try {
      connection.enqueue(new TextEncoder().encode(message));
    } catch (error) {
      connections.delete(connection);
    }
  });
}

// Optional: SSE endpoint for real-time updates
export async function openSSE(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      connections.add(controller);
      
      // Send initial data
      controller.enqueue(
        new TextEncoder().encode(
          `data: ${JSON.stringify({ type: "connected", data: cachedSheetData })}\n\n`
        )
      );
      
      // Handle client disconnect
      req.signal.addEventListener("abort", () => {
        connections.delete(controller);
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
