// app/api/dashboard-trigger/route.ts
// Calls Google Apps Script sendAllDataNow() function
// Triggered on dashboard login and refresh button

import { NextRequest, NextResponse } from "next/server";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyBJ7e-7ZsPXd7hELRqugsrqbtqByo_8VUqnxJpaL9B5IDJ5YuUctURfE_Vv5GEZwQ-6w/exec";

export async function POST(req: NextRequest) {
  try {
    console.log("[TRIGGER] Calling Google Apps Script sendAllDataNow()");

    // Call the Apps Script function
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseCode = response.status;
    console.log(`[TRIGGER] Apps Script returned: ${responseCode}`);

    return NextResponse.json(
      {
        success: responseCode === 200,
        message: `Apps Script trigger executed with code ${responseCode}`,
        timestamp: new Date().toISOString(),
        triggered_at: new Date().toISOString(),
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
    console.error("[TRIGGER] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
