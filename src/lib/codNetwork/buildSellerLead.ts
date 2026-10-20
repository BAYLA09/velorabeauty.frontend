import type { CartLine } from "@/lib/cart/cartTypes";
import { buildCodApiLineItems, lineItemsForCodFulfillment } from "@/lib/codNetwork/codFulfillmentPricing";
import { resolveCodNetworkLeadAddress } from "@/lib/codNetwork/leadAddress";
import {
  orderLinesPushableToCodNetwork,
  resolveCodNetworkSkuForSlug,
} from "@/lib/codNetwork/skuMap";
import type { OrderRecord } from "@/lib/ordersRepository";

export type SellerLeadCreateBody = {
  phone: string;
  name: string;
  country: "AE";
  address: string;
  city: string;
  items: { sku: string; quantity: number; price: number }[];
};

export function buildSellerLeadBodyFromOrder(
  order: OrderRecord,
  cartLines: CartLine[] | null,
): { body: SellerLeadCreateBody } | { skip: string } {
  if (order.paymentMethod !== "cod") {
    return { skip: "not_cod" };
  }

  const fulfillmentLines = lineItemsForCodFulfillment(order, cartLines);
  const pushCheck = orderLinesPushableToCodNetwork(fulfillmentLines.map((l) => l.slug));
  if (!pushCheck.ok) {
    return { skip: pushCheck.reason };
  }

  const apiLines = buildCodApiLineItems(order, cartLines);
  const items = apiLines.map((line) => {
    const sku = resolveCodNetworkSkuForSlug(line.slug);
    if (!sku) {
      throw new Error(`unmapped_sku:${line.slug}`);
    }
    return {
      sku,
      quantity: line.quantity,
      price: line.unitPriceAed,
    };
  });

  const { address, city } = resolveCodNetworkLeadAddress(order);

  return {
    body: {
      phone: order.phone,
      name: order.customerName,
      country: "AE",
      address,
      city,
      items,
    },
  };
}
