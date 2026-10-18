import { aedToUsd } from "@/lib/profitAdmin/currency";
import {
  computeCodPanelFromCounts,
  type CodPanelInput,
  type CodPanelResult,
} from "@/lib/profitAdmin/calculations";
import type { FeeConfig } from "@/lib/profitAdmin/feesDefaults";
import { isExcludedTestOrder, orderProductCostUsd } from "@/lib/profitAdmin/productCosts";
import { listOrdersBetween } from "@/lib/ordersRepository";

const CONFIRMED_PIPELINE = new Set([
  "confirmed",
  "preparing",
  "packed",
  "processing",
  "shipped",
  "out_for_delivery",
]);

function bucketCodOrder(status: string): "pending" | "notConfirmed" | "confirmed" | "delivered" | "returned" {
  const s = status.toLowerCase();
  if (s === "pending") return "pending";
  if (s === "no_answer" || s === "cancelled") return "notConfirmed";
  if (s === "delivered" || s === "paid") return "delivered";
  if (s === "returned") return "returned";
  if (CONFIRMED_PIPELINE.has(s)) return "confirmed";
  return "pending";
}

/** Hybrid COD funnel: real statuses where set; manual % only on still-pending orders. */
export function buildCodPanelForPeriodWithLiveStatuses(
  fromIso: string,
  toIso: string,
  fees: FeeConfig,
  confirmationRatePct: number,
  deliveryRatePct: number,
): {
  input: CodPanelInput;
  result: CodPanelResult;
  live: { pendingOrders: number; resolvedOrders: number };
} {
  const orders = listOrdersBetween(fromIso, toIso).filter(
    (o) => !isExcludedTestOrder(o) && o.paymentMethod === "cod",
  );
  const rate = fees.aedPerUsd;

  let pending = 0;
  let notConfirmed = 0;
  let confirmedPipeline = 0;
  let delivered = 0;
  let returned = 0;
  let sellingSum = 0;
  let productCostSum = 0;

  for (const order of orders) {
    sellingSum += aedToUsd(order.totalAed, rate);
    productCostSum += orderProductCostUsd(order, fees);
    const bucket = bucketCodOrder(order.status);
    if (bucket === "pending") pending += 1;
    else if (bucket === "notConfirmed") notConfirmed += 1;
    else if (bucket === "confirmed") confirmedPipeline += 1;
    else if (bucket === "delivered") delivered += 1;
    else if (bucket === "returned") returned += 1;
  }

  const conf = confirmationRatePct / 100;
  const deliv = deliveryRatePct / 100;
  const pendingConfirmed = pending * conf;
  const pendingNotConfirmed = pending - pendingConfirmed;
  const pendingDelivered = pendingConfirmed * deliv;
  const pendingReturned = pendingConfirmed - pendingDelivered;

  const totalOrders = orders.length;
  const finalNotConfirmed = notConfirmed + pendingNotConfirmed;
  const finalDelivered = delivered + pendingDelivered;
  const failedAfterConfirm = returned + confirmedPipeline + pendingReturned;

  const sellingPricePerOrderUsd =
    totalOrders > 0 ? sellingSum / totalOrders : fees.cod.defaultSellingPricePerOrderUsd;
  const productCostPerOrderUsd =
    totalOrders > 0 ? productCostSum / totalOrders : fees.cod.defaultProductCostPerOrderUsd;

  const result = computeCodPanelFromCounts({
    totalOrders,
    notConfirmedOrders: finalNotConfirmed,
    deliveredOrders: finalDelivered,
    failedAfterConfirmOrders: failedAfterConfirm,
    sellingPricePerOrderUsd,
    productCostPerOrderUsd,
    shippingCostPerOrderUsd: fees.cod.shippingDeliveredUsd,
    codFeesPerOrderUsd: fees.cod.codFeesPerOrderUsd,
    returnCostPerOrderUsd: fees.cod.shippingReturnUsd,
    otherFeesPerOrderUsd: fees.cod.otherFeesPerOrderUsd,
  });

  const input: CodPanelInput = {
    totalOrders,
    confirmationRatePct,
    deliveryRatePct,
    sellingPricePerOrderUsd,
    productCostPerOrderUsd,
    shippingCostPerOrderUsd: fees.cod.shippingDeliveredUsd,
    codFeesPerOrderUsd: fees.cod.codFeesPerOrderUsd,
    returnCostPerOrderUsd: fees.cod.shippingReturnUsd,
    otherFeesPerOrderUsd: fees.cod.otherFeesPerOrderUsd,
  };

  return {
    input,
    result,
    live: { pendingOrders: pending, resolvedOrders: totalOrders - pending },
  };
}
