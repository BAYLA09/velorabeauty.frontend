import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  computeCodPanel,
  computePaymentPanel,
  netProfitAfterAdSpend,
} from "@/lib/profitAdmin/calculations";
import {
  aggregateOrdersForPeriod,
  buildCodPanelForPeriod,
  buildPaymentPanelFromLive,
  computeDailyProfitSeries,
  percentChange,
  previousPeriodRange,
} from "@/lib/profitAdmin/orderMetrics";
import { requireAdminSession } from "@/lib/profitAdmin/apiHelpers";
import { readFeeConfigFromEnv } from "@/lib/profitAdmin/feesDefaults";
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

  const live = aggregateOrdersForPeriod(from, to, fees);
  const paymentInput = buildPaymentPanelFromLive(live.payment, fees);
  const paymentResult = computePaymentPanel(paymentInput);

  const codInput = buildCodPanelForPeriod(
    from,
    to,
    fees,
    state.confirmationRatePct,
    state.deliveryRatePct,
  );
  const codResult = computeCodPanel(codInput);

  const adSpend = state.adSpendUsd;
  const totalProfit = netProfitAfterAdSpend(paymentResult.profitUsd, codResult.profitUsd, adSpend);
  const totalOrders = paymentResult.orderCount + codInput.totalOrders;

  const prev = previousPeriodRange(from, to);
  const prevLive = aggregateOrdersForPeriod(prev.from, prev.to, fees);
  const prevPayment = computePaymentPanel(buildPaymentPanelFromLive(prevLive.payment, fees));
  const prevCod = computeCodPanel(
    buildCodPanelForPeriod(
      prev.from,
      prev.to,
      fees,
      state.confirmationRatePct,
      state.deliveryRatePct,
    ),
  );
  const prevTotalProfit = netProfitAfterAdSpend(
    prevPayment.profitUsd,
    prevCod.profitUsd,
    adSpend,
  );
  const prevTotalOrders = prevPayment.orderCount + prevCod.totalOrders;

  const chart = computeDailyProfitSeries(from, to, fees, codInput, state.chartDays);

  return NextResponse.json({
    ok: true,
    range: { from, to },
    previousRange: prev,
    state,
    fees,
    live,
    payment: { input: paymentInput, result: paymentResult },
    cod: { input: codInput, result: codResult },
    kpis: {
      totalProfitUsd: totalProfit,
      paymentProfitUsd: paymentResult.profitUsd,
      codProfitUsd: codResult.profitUsd,
      adSpendUsd: adSpend,
      totalOrders,
      changes: {
        totalProfitPct: percentChange(totalProfit, prevTotalProfit),
        paymentProfitPct: percentChange(paymentResult.profitUsd, prevPayment.profitUsd),
        codProfitPct: percentChange(codResult.profitUsd, prevCod.profitUsd),
        totalOrdersPct: percentChange(totalOrders, prevTotalOrders),
      },
    },
    chart,
    profitSummary: {
      paymentProfitUsd: paymentResult.profitUsd,
      codProfitUsd: codResult.profitUsd,
      totalProfitUsd: totalProfit,
      totalMarginPct:
        paymentResult.revenueUsd + codResult.revenueUsd > 0
          ? (totalProfit / (paymentResult.revenueUsd + codResult.revenueUsd)) * 100
          : 0,
    },
    recentOrders: live.recentOrders,
  });
}
