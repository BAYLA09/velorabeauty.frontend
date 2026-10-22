import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminMutation, requireAdminSession } from "@/lib/profitAdmin/apiHelpers";
import {
  loadProfitDashboardState,
  saveProfitDashboardState,
  type ProfitDashboardState,
} from "@/lib/profitAdmin/settingsRepository";

export const runtime = "nodejs";

function clampPct(n: number): number {
  return Math.min(100, Math.max(0, n));
}

export async function GET(request: NextRequest) {
  const denied = requireAdminSession(request);
  if (denied) return denied;
  return NextResponse.json({ ok: true, state: loadProfitDashboardState() });
}

export async function PUT(request: NextRequest) {
  const denied = requireAdminMutation(request);
  if (denied) return denied;

  let body: { state?: Partial<ProfitDashboardState> };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const current = loadProfitDashboardState();
  const incoming = body.state ?? {};
  const next: ProfitDashboardState = {
    confirmationRatePct:
      typeof incoming.confirmationRatePct === "number"
        ? clampPct(incoming.confirmationRatePct)
        : current.confirmationRatePct,
    deliveryRatePct:
      typeof incoming.deliveryRatePct === "number"
        ? clampPct(incoming.deliveryRatePct)
        : current.deliveryRatePct,
    snapCpaUsd:
      typeof incoming.snapCpaUsd === "number"
        ? Math.max(0, incoming.snapCpaUsd)
        : current.snapCpaUsd,
    breakEvenSimLeadCount:
      typeof incoming.breakEvenSimLeadCount === "number"
        ? Math.max(0, Math.round(incoming.breakEvenSimLeadCount))
        : current.breakEvenSimLeadCount,
    breakEvenCardLeadPct:
      typeof incoming.breakEvenCardLeadPct === "number"
        ? clampPct(incoming.breakEvenCardLeadPct)
        : current.breakEvenCardLeadPct,
    chartDays:
      incoming.chartDays === 7 || incoming.chartDays === 30 || incoming.chartDays === 90
        ? incoming.chartDays
        : current.chartDays,
    dateRangeFrom:
      incoming.dateRangeFrom === null || typeof incoming.dateRangeFrom === "string"
        ? incoming.dateRangeFrom ?? current.dateRangeFrom
        : current.dateRangeFrom,
    dateRangeTo:
      incoming.dateRangeTo === null || typeof incoming.dateRangeTo === "string"
        ? incoming.dateRangeTo ?? current.dateRangeTo
        : current.dateRangeTo,
  };
  saveProfitDashboardState(next);
  return NextResponse.json({ ok: true, state: next });
}
