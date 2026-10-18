import { aedToUsd } from "@/lib/profitAdmin/currency";
import {
  codPanelInputFromFees,
  computeCodPanelFromFunnelCounts,
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

export type CodLiveFunnelCounts = {
  pendingOrders: number;
  noAnswerOrders: number;
  cancelledOrders: number;
  confirmedPipelineOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
  /** Portion of funnel totals projected from pending using manual % inputs. */
  projectedFromPending: {
    notConfirmed: number;
    delivered: number;
    returned: number;
  };
};

function bucketCodOrder(
  status: string,
): "pending" | "no_answer" | "cancelled" | "confirmed" | "delivered" | "returned" {
  const s = status.toLowerCase();
  if (s === "pending") return "pending";
  if (s === "no_answer") return "no_answer";
  if (s === "cancelled") return "cancelled";
  if (s === "delivered" || s === "paid") return "delivered";
  if (s === "returned") return "returned";
  if (CONFIRMED_PIPELINE.has(s)) return "confirmed";
  return "pending";
}

/** Hybrid COD funnel: real Sheet-synced statuses; manual % only on `pending` orders. */
export function buildCodPanelForPeriodWithLiveStatuses(
  fromIso: string,
  toIso: string,
  fees: FeeConfig,
  confirmationRatePct: number,
  deliveryRatePct: number,
): {
  input: CodPanelInput;
  result: CodPanelResult;
  live: CodLiveFunnelCounts;
} {
  const orders = listOrdersBetween(fromIso, toIso).filter(
    (o) => !isExcludedTestOrder(o) && o.paymentMethod === "cod",
  );
  const rate = fees.aedPerUsd;

  let pending = 0;
  let noAnswer = 0;
  let cancelled = 0;
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
    else if (bucket === "no_answer") noAnswer += 1;
    else if (bucket === "cancelled") cancelled += 1;
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
  const notConfirmedOrders = noAnswer + cancelled + pendingNotConfirmed;
  const deliveredOrders = delivered + pendingDelivered;
  const returnedOrders = returned + pendingReturned;

  const sellingPricePerOrderUsd =
    totalOrders > 0 ? sellingSum / totalOrders : fees.cod.defaultSellingPricePerOrderUsd;
  const productCostPerOrderUsd =
    totalOrders > 0 ? productCostSum / totalOrders : fees.cod.defaultProductCostPerOrderUsd;

  const result = computeCodPanelFromFunnelCounts({
    totalOrders,
    notConfirmedOrders,
    deliveredOrders,
    returnedOrders,
    sellingPricePerOrderUsd,
    productCostPerOrderUsd,
    callCenterNoAnswerUsd: fees.cod.callCenterNoAnswerUsd,
    callCenterReturnedUsd: fees.cod.callCenterReturnedUsd,
    callCenterDeliveredUsd: fees.cod.callCenterDeliveredUsd,
    shippingDeliveredUsd: fees.cod.shippingDeliveredUsd,
    shippingReturnedUsd: fees.cod.shippingReturnedUsd,
    serviceFeePercent: fees.cod.serviceFeePercent,
  });

  const input = codPanelInputFromFees(
    {
      totalOrders,
      confirmationRatePct,
      deliveryRatePct,
      sellingPricePerOrderUsd,
      productCostPerOrderUsd,
    },
    fees,
  );

  return {
    input,
    result,
    live: {
      pendingOrders: pending,
      noAnswerOrders: noAnswer,
      cancelledOrders: cancelled,
      confirmedPipelineOrders: confirmedPipeline,
      deliveredOrders: delivered,
      returnedOrders: returned,
      projectedFromPending: {
        notConfirmed: pendingNotConfirmed,
        delivered: pendingDelivered,
        returned: pendingReturned,
      },
    },
  };
}
