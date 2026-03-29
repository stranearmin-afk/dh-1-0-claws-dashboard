// app/api/fetch-sheets/route.ts
// Fetch live data directly from Google Sheets on demand
// Called when dashboard loads or refresh button clicked

import { NextRequest, NextResponse } from "next/server";
import { executeComposioTool } from "@/lib/composio";

const SPREADSHEET_ID = "1NyQHZXT-QkA7EX8LX3B4CAyWfzrRoAb9nbTMJmStGyk";

export async function GET(req: NextRequest) {
  try {
    console.log("[FETCH-SHEETS] Fetching live data from Google Sheets...");

    const composioData = await executeComposioTool(
      "googlesheets",
      "GOOGLESHEETS_BATCH_GET",
      {
        spreadsheet_id: SPREADSHEET_ID,
        ranges: [
          "'Agents'!A1:Z100",
          "'Cron Jobs'!A1:Z100",
          "'Calendars'!A1:Z100",
        ],
      }
    );
    console.log("[FETCH-SHEETS] Composio response received");

    // Parse the response data
    const valueRanges = composioData?.data?.valueRanges || [];

    // Extract agents (first range)
    const agentsData = valueRanges[0]?.values || [];
    const agents = agentsData.slice(1).map((row: any[]) => ({
      id: row[0] || "",
      name: row[1] || "",
      icon: row[2] || "",
      version: row[3] || "",
      status: row[4] || "",
      nextSchedule: row[5] || "",
      lastRun: row[6] || "",
      description: row[7] || "",
    }));

    // Extract jobs (second range)
    const jobsData = valueRanges[1]?.values || [];
    const jobs = jobsData.slice(1).map((row: any[]) => ({
      id: row[0] || "",
      name: row[1] || "",
      icon: row[2] || "",
      schedule: row[3] || "",
      nextRun: row[4] || "",
      lastRun: row[5] || "",
      duration: row[6] || "",
      status: row[7] || "",
    }));

    // Extract calendars (third range)
    const calendarsData = valueRanges[2]?.values || [];
    const calendars = calendarsData.slice(1).map((row: any[]) => ({
      num: row[0] || "",
      name: row[1] || "",
      id: row[2] || "",
      type: row[3] || "",
      access: row[4] || "",
      timezone: row[5] || "",
      status: row[6] || "",
      notes: row[7] || "",
    }));

    console.log("[FETCH-SHEETS] Parsed data:", {
      agents: agents.length,
      jobs: jobs.length,
      calendars: calendars.length,
    });

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        data: {
          agents,
          jobs,
          calendars,
        },
        counts: {
          agents: agents.length,
          jobs: jobs.length,
          calendars: calendars.length,
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
    console.error("[FETCH-SHEETS] Error:", error);
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
