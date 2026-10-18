import { aedToUsd } from "@/lib/profitAdmin/currency";
import {
  computeCodPanel,
  computePaymentPanel,
  type CodPanelInput,
  type PaymentPanelInput,
} from "@/lib/profitAdmin/calculations";
import type { FeeConfig } from "@/lib/profitAdmin/feesDefaults";
import { isExcludedTestOrder, orderProductCostUsd } from "@/lib/profitAdmin/productCosts";
import type { OrderRecord } from "@/lib/ordersRepository";
import { listOrdersBetween, listRecentOrders } from "@/lib/ordersRepository";

export type DashboardOrderRow = {
  id: string;
  type: "Payment" | "COD";
  customerName: string;
  amountUsd: number;
  status: string;
  statusTone: "success" | "warning" | "neutral";
  date: string;
  createdAt: string;
};

export type LivePaymentAggregate = {
  orderCount: number;
  totalRevenueUsd: number;
  productCostUsd: number;
  shippingCostUsd: number;
};

export type PeriodMetrics = {
  payment: LivePaymentAggregate;
  codOrderCount: number;
  totalOrderCount: number;
  recentOrders: DashboardOrderRow[];
};

export type DailyProfitPoint = {
  date: string;
  label: string;
  paymentProfitUsd: number;
  codProfitUsd: number;
  totalProfitUsd: number;
};

function startOfDayUtc(iso: string): string {
  const d = new Date(iso);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString();
}

function formatDisplayDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function mapOrderStatus(order: OrderRecord): { label: string; tone: "success" | "warning" | "neutral" } {
  if (order.paymentMethod === "card") {
    if (order.status === "paid") return { label: "Paid", tone: "success" };
    if (order.status === "awaiting_payment") return { label: "Pending", tone: "warning" };
    return { label: order.status, tone: "neutral" };
  }
  if (order.status === "delivered") return { label: "Delivered", tone: "success" };
  if (order.status === "paid") return { label: "Delivered", tone: "success" };
  return { label: "Pending", tone: "warning" };
}

export function aggregateOrdersForPeriod(
  fromIso: string,
  toIso: string,
  fees: FeeConfig,
): PeriodMetrics {
  const orders = listOrdersBetween(fromIso, toIso).filter((o) => !isExcludedTestOrder(o));
  const rate = fees.aedPerUsd;

  let paymentCount = 0;
  let paymentRevenueUsd = 0;
  let paymentProductCostUsd = 0;
  let paymentShippingUsd = 0;
  let codCount = 0;

  for (const order of orders) {
    if (order.paymentMethod === "card") {
      if (order.status !== "paid") continue;
      paymentCount += 1;
      const rev = aedToUsd(order.totalAed, rate);
      paymentRevenueUsd += rev;
      paymentProductCostUsd += orderProductCostUsd(order, fees);
      paymentShippingUsd += fees.payment.shippingDeliveredUsd;
    } else if (order.paymentMethod === "cod") {
      codCount += 1;
    }
  }

  const recent: DashboardOrderRow[] = listRecentOrders(8)
    .filter((o) => !isExcludedTestOrder(o))
    .map((order) => {
    const st = mapOrderStatus(order);
    return {
      id: order.id,
      type: (order.paymentMethod === "card" ? "Payment" : "COD") as "Payment" | "COD",
      customerName: order.customerName,
      amountUsd: aedToUsd(order.totalAed, rate),
      status: st.label,
      statusTone: st.tone,
      date: formatDisplayDate(order.createdAt),
      createdAt: order.createdAt,
    };
  });

  return {
    payment: {
      orderCount: paymentCount,
      totalRevenueUsd: paymentRevenueUsd,
      productCostUsd: paymentProductCostUsd,
      shippingCostUsd: paymentShippingUsd,
    },
    codOrderCount: codCount,
    totalOrderCount: orders.length,
    recentOrders: recent,
  };
}

export function buildPaymentPanelFromLive(
  live: LivePaymentAggregate,
  fees: FeeConfig,
): PaymentPanelInput {
  return {
    orderCount: live.orderCount,
    totalRevenueUsd: live.totalRevenueUsd,
    productCostUsd: live.productCostUsd,
    shippingCostUsd: live.shippingCostUsd,
    paymentFeePercent: fees.payment.paymentFeePercent,
    otherFeesUsd: fees.payment.otherFeesUsd,
  };
}

export function buildCodPanelForPeriod(
  fromIso: string,
  toIso: string,
  fees: FeeConfig,
  confirmationRatePct: number,
  deliveryRatePct: number,
): CodPanelInput {
  const orders = listOrdersBetween(fromIso, toIso).filter(
    (o) => !isExcludedTestOrder(o) && o.paymentMethod === "cod",
  );
  const rate = fees.aedPerUsd;
  let sellingSum = 0;
  let productCostSum = 0;
  for (const order of orders) {
    sellingSum += aedToUsd(order.totalAed, rate);
    productCostSum += orderProductCostUsd(order, fees);
  }
  const count = orders.length;
  const sellingPricePerOrderUsd =
    count > 0 ? sellingSum / count : fees.cod.defaultSellingPricePerOrderUsd;
  const productCostPerOrderUsd =
    count > 0 ? productCostSum / count : fees.cod.defaultProductCostPerOrderUsd;
  const codFeesPerOrderUsd =
    fees.cod.codFeesPerOrderUsd > 0
      ? fees.cod.codFeesPerOrderUsd
      : (sellingPricePerOrderUsd * fees.cod.platformFeePercent) / 100;

  return {
    totalOrders: count,
    confirmationRatePct,
    deliveryRatePct,
    sellingPricePerOrderUsd,
    productCostPerOrderUsd,
    shippingCostPerOrderUsd: fees.cod.shippingDeliveredUsd,
    codFeesPerOrderUsd,
    returnCostPerOrderUsd: fees.cod.shippingReturnUsd,
    otherFeesPerOrderUsd: fees.cod.otherFeesPerOrderUsd,
  };
}

export function computeDailyProfitSeries(
  fromIso: string,
  toIso: string,
  fees: FeeConfig,
  codPanel: CodPanelInput,
  chartDays: number,
): DailyProfitPoint[] {
  const orders = listOrdersBetween(fromIso, toIso).filter((o) => !isExcludedTestOrder(o));
  const rate = fees.aedPerUsd;

  const codPanelResult = computeCodPanel(codPanel);
  const codProfitPerOrder =
    codPanel.totalOrders > 0 ? codPanelResult.profitUsd / codPanel.totalOrders : 0;

  const dayMap = new Map<
    string,
    { paymentProfit: number; codProfit: number; paymentRevenue: number }
  >();

  for (const order of orders) {
    const day = startOfDayUtc(order.createdAt);
    const bucket = dayMap.get(day) ?? { paymentProfit: 0, codProfit: 0, paymentRevenue: 0 };

    if (order.paymentMethod === "card" && order.status === "paid") {
      const rev = aedToUsd(order.totalAed, rate);
      const product = orderProductCostUsd(order, fees);
      const ship = fees.payment.shippingDeliveredUsd;
      const panel = computePaymentPanel({
        orderCount: 1,
        totalRevenueUsd: rev,
        productCostUsd: product,
        shippingCostUsd: ship,
        paymentFeePercent: fees.payment.paymentFeePercent,
        otherFeesUsd: 0,
      });
      bucket.paymentProfit += panel.profitUsd;
      bucket.paymentRevenue += rev;
    } else if (order.paymentMethod === "cod") {
      bucket.codProfit += codProfitPerOrder;
    }
    dayMap.set(day, bucket);
  }

  const from = new Date(fromIso);
  const to = new Date(toIso);
  const msPerDay = 86400000;
  const totalDays = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / msPerDay) + 1);
  const sliceDays = Math.min(chartDays, totalDays);

  const points: DailyProfitPoint[] = [];
  for (let i = totalDays - sliceDays; i < totalDays; i += 1) {
    const d = new Date(from.getTime() + i * msPerDay);
    const key = startOfDayUtc(d.toISOString());
    const bucket = dayMap.get(key) ?? { paymentProfit: 0, codProfit: 0, paymentRevenue: 0 };
    const paymentProfitUsd = bucket.paymentProfit;
    const codProfitUsd = bucket.codProfit;
    points.push({
      date: key.slice(0, 10),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      paymentProfitUsd,
      codProfitUsd,
      totalProfitUsd: paymentProfitUsd + codProfitUsd,
    });
  }

  const otherPerDay = fees.payment.otherFeesUsd / Math.max(1, points.length);
  return points.map((p) => ({
    ...p,
    paymentProfitUsd: p.paymentProfitUsd - otherPerDay,
    totalProfitUsd: p.paymentProfitUsd + p.codProfitUsd - otherPerDay,
  }));
}

export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

export function previousPeriodRange(fromIso: string, toIso: string): { from: string; to: string } {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  const spanMs = to.getTime() - from.getTime();
  const prevTo = new Date(from.getTime() - 1);
  const prevFrom = new Date(prevTo.getTime() - spanMs);
  return { from: prevFrom.toISOString(), to: prevTo.toISOString() };
}
