import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminMutation, requireAdminSession } from "@/lib/profitAdmin/apiHelpers";
import {
  loadProfitDashboardState,
  saveProfitDashboardState,
  type ProfitDashboardState,
} from "@/lib/profitAdmin/settingsRepository";
import { mergeFeeConfig } from "@/lib/profitAdmin/feesDefaults";

export const runtime = "nodejs";

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
    fees: mergeFeeConfig({ ...current.fees, ...incoming.fees }),
    payment: { ...current.payment, ...incoming.payment },
    cod: { ...current.cod, ...incoming.cod },
    scenarioDeliveryRatePct:
      typeof incoming.scenarioDeliveryRatePct === "number"
        ? incoming.scenarioDeliveryRatePct
        : current.scenarioDeliveryRatePct,
  };
  saveProfitDashboardState(next);
  return NextResponse.json({ ok: true, state: next });
}
