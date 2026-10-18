import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/profitAdmin/apiHelpers";
import { aedToUsd } from "@/lib/profitAdmin/currency";
import { formatMoneyMetric, formatRoiPct, formatRoas } from "@/lib/profitAdmin/marketingMetrics";
import { isExcludedTestOrder } from "@/lib/profitAdmin/productCosts";
import { computePeriodEconomics } from "@/lib/profitAdmin/periodEconomics";
import { readFeeConfigFromEnv } from "@/lib/profitAdmin/feesDefaults";
import {
  defaultDateRange,
  loadProfitDashboardState,
} from "@/lib/profitAdmin/settingsRepository";
import { listOrdersBetween } from "@/lib/ordersRepository";

export const runtime = "nodejs";

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function metricCell(value: number | null, formatter: (v: number | null) => string): string {
  return value === null ? "—" : formatter(value);
}

export async function GET(request: NextRequest) {
  const denied = requireAdminSession(request);
  if (denied) return denied;

  const fromQ = request.nextUrl.searchParams.get("from")?.trim();
  const toQ = request.nextUrl.searchParams.get("to")?.trim();
  const saved = loadProfitDashboardState();
  const range =
    fromQ && toQ
      ? { from: fromQ, to: toQ }
      : saved.dateRangeFrom && saved.dateRangeTo
        ? { from: saved.dateRangeFrom, to: saved.dateRangeTo }
        : defaultDateRange();

  const fees = readFeeConfigFromEnv();
  const economics = computePeriodEconomics(range.from, range.to, fees, saved);
  const m = economics.marketing;

  const summaryRows = [
    ["metric", "value"],
    ["period_from", range.from],
    ["period_to", range.to],
    ["total_revenue_usd", m.totalRevenueUsd.toFixed(2)],
    ["net_profit_usd", m.netProfitUsd.toFixed(2)],
    ["total_spend_usd", m.totalSpendUsd.toFixed(2)],
    ["ad_spend_usd", economics.adSpendUsd.toFixed(2)],
    ["roi_pct", metricCell(m.roiPct, formatRoiPct)],
    ["roas", metricCell(m.roas, formatRoas)],
    ["cpa_usd", metricCell(m.cpaUsd, formatMoneyMetric)],
    ["cost_per_delivered_order_usd", metricCell(m.costPerDeliveredOrderUsd, formatMoneyMetric)],
    ["break_even_roas", metricCell(m.breakEvenRoas, formatRoas)],
    ["total_orders", String(m.totalOrders)],
    ["paid_orders", String(m.paidOrderCount)],
    ["delivered_cod_orders", m.deliveredCodOrders.toFixed(2)],
    [],
    [
      "order_id",
      "created_at",
      "type",
      "status",
      "customer_name",
      "total_aed",
      "total_usd",
      "product_slug",
    ],
  ];

  const lines: string[] = summaryRows.filter((row) => row.length > 0).map((row) => row.join(","));

  const orders = listOrdersBetween(range.from, range.to).filter((o) => !isExcludedTestOrder(o));
  for (const o of orders) {
    lines.push(
      [
        o.id,
        o.createdAt,
        o.paymentMethod === "card" ? "payment" : "cod",
        o.status,
        csvEscape(o.customerName),
        String(o.totalAed),
        aedToUsd(o.totalAed, fees.aedPerUsd).toFixed(2),
        csvEscape(o.productSlug),
      ].join(","),
    );
  }

  const body = lines.join("\n");
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="velora-orders-report.csv"`,
    },
  });
}
