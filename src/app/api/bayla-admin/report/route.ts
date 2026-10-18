import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/profitAdmin/apiHelpers";
import { aedToUsd } from "@/lib/profitAdmin/currency";
import { isExcludedTestOrder } from "@/lib/profitAdmin/productCosts";
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

  const fees = saved.fees;
  const orders = listOrdersBetween(range.from, range.to).filter((o) => !isExcludedTestOrder(o));

  const header = [
    "order_id",
    "created_at",
    "type",
    "status",
    "customer_name",
    "total_aed",
    "total_usd",
    "product_slug",
  ];
  const lines = [header.join(",")];
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
