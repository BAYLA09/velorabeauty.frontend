import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/profitAdmin/apiHelpers";
import { readFeeConfigFromEnv } from "@/lib/profitAdmin/feesDefaults";
import { buildCodPanelForPeriodWithLiveStatuses } from "@/lib/profitAdmin/codLiveMetrics";
import {
  buildPaymentPanelFromLive,
  computeDailyProfitSeries,
  percentChange,
  previousPeriodRange,
} from "@/lib/profitAdmin/orderMetrics";
import { computePeriodEconomics } from "@/lib/profitAdmin/periodEconomics";
import {
  defaultDateRange,
  loadProfitDashboardState,
} from "@/lib/profitAdmin/settingsRepository";

export const runtime = "nodejs";

function parseRange(request: NextRequest): { from: string; to: string } {
  const fromQ = request.nextUrl.searchParams.get("from")?.trim();
  const toQ = request.nextUrl.searchParams.get("to")?.trim();
  const saved = loadProfitDashboardState();
  if (fromQ && toQ) return { from: fromQ, to: toQ };
  if (saved.dateRangeFrom && saved.dateRangeTo) {
    return { from: saved.dateRangeFrom, to: saved.dateRangeTo };
  }
  return defaultDateRange();
}

export async function GET(request: NextRequest) {
  const denied = requireAdminSession(request);
  if (denied) return denied;

  const { from, to } = parseRange(request);
  const state = loadProfitDashboardState();
  const fees = readFeeConfigFromEnv();

  const period = computePeriodEconomics(from, to, fees, state);
  const { paymentResult, codResult, live, marketing, totalProfitUsd, totalOrders, adSpendUsd } =
    period;

  const { input: codInput, live: codLive } = buildCodPanelForPeriodWithLiveStatuses(
    from,
    to,
    fees,
    state.confirmationRatePct,
    state.deliveryRatePct,
  );

  const prev = previousPeriodRange(from, to);
  const prevPeriod = computePeriodEconomics(prev.from, prev.to, fees, state);

  const chart = computeDailyProfitSeries(from, to, fees, codInput, state.chartDays);

  return NextResponse.json({
    ok: true,
    range: { from, to },
    previousRange: prev,
    state,
    fees,
    live,
    payment: { input: buildPaymentPanelFromLive(live.payment, fees), result: paymentResult },
    cod: { input: codInput, result: codResult, live: codLive },
    kpis: {
      totalProfitUsd,
      paymentProfitUsd: paymentResult.profitUsd,
      codProfitUsd: codResult.profitUsd,
      adSpendUsd,
      totalOrders,
      changes: {
        totalProfitPct: percentChange(totalProfitUsd, prevPeriod.totalProfitUsd),
        paymentProfitPct: percentChange(
          paymentResult.profitUsd,
          prevPeriod.paymentResult.profitUsd,
        ),
        codProfitPct: percentChange(codResult.profitUsd, prevPeriod.codResult.profitUsd),
        totalOrdersPct: percentChange(totalOrders, prevPeriod.totalOrders),
      },
    },
    chart,
    profitSummary: {
      paymentProfitUsd: paymentResult.profitUsd,
      codProfitUsd: codResult.profitUsd,
      totalProfitUsd,
      totalMarginPct:
        marketing.totalRevenueUsd > 0
          ? (totalProfitUsd / marketing.totalRevenueUsd) * 100
          : 0,
      marketing,
    },
    recentOrders: live.recentOrders,
  });
}
