import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  computeCodPanel,
  computePaymentPanel,
  netProfitAfterAdSpend,
} from "@/lib/profitAdmin/calculations";
import {
  aggregateOrdersForPeriod,
  buildCodPanelFromState,
  buildPaymentPanelFromLive,
  computeDailyProfitSeries,
  percentChange,
  previousPeriodRange,
} from "@/lib/profitAdmin/orderMetrics";
import { requireAdminSession } from "@/lib/profitAdmin/apiHelpers";
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
  const fees = state.fees;

  const live = aggregateOrdersForPeriod(from, to, fees);
  const paymentInput = buildPaymentPanelFromLive(live.payment, fees, {
    ...state.paymentOverrides,
    otherFeesUsd: state.paymentOtherFeesUsd,
  });
  const paymentResult = computePaymentPanel(paymentInput);

  const codInput = buildCodPanelFromState(
    live.codOrderCount,
    state.cod,
    state.codUseLiveOrderCount,
  );
  const codResult = computeCodPanel(codInput);

  const adSpend = fees.adSpendUsd;
  const totalProfit = netProfitAfterAdSpend(paymentResult.profitUsd, codResult.profitUsd, adSpend);
  const totalOrders = paymentResult.orderCount + codInput.totalOrders;

  const prev = previousPeriodRange(from, to);
  const prevLive = aggregateOrdersForPeriod(prev.from, prev.to, fees);
  const prevPayment = computePaymentPanel(
    buildPaymentPanelFromLive(prevLive.payment, fees, {
      ...state.paymentOverrides,
      otherFeesUsd: state.paymentOtherFeesUsd,
    }),
  );
  const prevCod = computeCodPanel(
    buildCodPanelFromState(prevLive.codOrderCount, state.cod, state.codUseLiveOrderCount),
  );
  const prevTotalProfit = netProfitAfterAdSpend(
    prevPayment.profitUsd,
    prevCod.profitUsd,
    adSpend,
  );
  const prevTotalOrders =
    prevPayment.orderCount +
    buildCodPanelFromState(prevLive.codOrderCount, state.cod, state.codUseLiveOrderCount).totalOrders;

  const chart = computeDailyProfitSeries(
    from,
    to,
    fees,
    codInput,
    state.paymentOtherFeesUsd,
    state.chartDays,
  );

  return NextResponse.json({
    ok: true,
    range: { from, to },
    previousRange: prev,
    state,
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
