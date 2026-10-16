import type { StoreAnalyticsEvent } from "@/lib/analytics/trackStoreEvent";
import { snapTrack } from "@/lib/analytics/snapTrack";

export function forwardStoreEventToSnap(payload: StoreAnalyticsEvent): boolean {
  switch (payload.event) {
    case "view_content":
      return snapTrack("VIEW_CONTENT", {
        price: payload.value_aed,
        currency: payload.currency,
        item_ids: payload.content_ids,
        number_items: payload.number_items,
      });
    case "add_cart":
      return snapTrack("ADD_CART", {
        price: payload.value_aed,
        currency: payload.currency,
        item_ids: payload.content_ids,
        number_items: payload.number_items,
      });
    case "start_checkout":
      return snapTrack("START_CHECKOUT", {
        price: payload.value_aed,
        currency: payload.currency,
        item_ids: payload.content_ids,
        number_items: payload.number_items,
      });
    case "purchase":
      return snapTrack("PURCHASE", {
        price: payload.value_aed,
        currency: payload.currency,
        transaction_id: payload.order_id,
        item_ids: payload.content_ids,
        number_items: payload.number_items,
      });
    default:
      return false;
  }
}
