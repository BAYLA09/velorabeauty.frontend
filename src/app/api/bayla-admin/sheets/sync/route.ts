import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/profitAdmin/apiHelpers";
import { listOrderSheetTargetsWithTabTitles } from "@/lib/ordersSheets/sheetTargets";
import { syncOrdersFromGoogleSheets } from "@/lib/ordersSheets/syncFromSheet";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const denied = requireAdminSession(request);
  if (denied) return denied;

  const result = await syncOrdersFromGoogleSheets();
  const sheetTargets = await listOrderSheetTargetsWithTabTitles();
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error, stats: result.stats ?? null, sheetTargets },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    source: result.source,
    stats: result.stats,
    sheetTargets,
  });
}
