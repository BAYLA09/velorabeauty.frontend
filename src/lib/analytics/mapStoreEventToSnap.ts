import type { StoreAnalyticsEvent } from "@/lib/analytics/trackStoreEvent";
import { snapTrack } from "@/lib/analytics/snapTrack";

export function forwardStoreEventToSnap(payload: StoreAnalyticsEvent): void {
  switch (payload.event) {
    case "view_content":
      snapTrack("VIEW_CONTENT", {
        price: payload.value_aed,
        currency: payload.currency,
        item_ids: payload.content_ids,
        number_items: payload.number_items,
      });
      break;
    case "add_cart":
      snapTrack("ADD_CART", {
        price: payload.value_aed,
        currency: payload.currency,
        item_ids: payload.content_ids,
        number_items: payload.number_items,
      });
      break;
    case "start_checkout":
      snapTrack("START_CHECKOUT", {
        price: payload.value_aed,
        currency: payload.currency,
        item_ids: payload.content_ids,
        number_items: payload.number_items,
      });
      break;
    case "purchase":
      snapTrack("PURCHASE", {
        price: payload.value_aed,
        currency: payload.currency,
        transaction_id: payload.order_id,
        item_ids: payload.content_ids,
        number_items: payload.number_items,
      });
      break;
    default:
      break;
  }
}
