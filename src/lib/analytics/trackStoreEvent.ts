/** Lightweight storefront events — no PII (no phone/name). */

import { forwardStoreEventToSnap } from "@/lib/analytics/mapStoreEventToSnap";

export type StoreAnalyticsEvent =
  | { event: "cod_thank_you_page_view" }
  | { event: "card_thank_you_page_view" }
  | { event: "order_summary_view" }
  | {
      event: "view_content";
      value_aed: number;
      currency: "AED";
      content_ids: string[];
      number_items: number;
    }
  | {
      event: "add_cart";
      value_aed: number;
      currency: "AED";
      content_ids: string[];
      number_items: number;
    }
  | {
      event: "start_checkout";
      value_aed: number;
      currency: "AED";
      content_ids: string[];
      number_items: number;
    }
  | {
      event: "purchase";
      value_aed: number;
      currency: "AED";
      order_id: string;
      order_ref: string;
      payment_method: "card" | "cod";
      content_ids: string[];
      number_items: number;
    }
  | { event: "confirmation_click" }
  | { event: "whatsapp_click"; placement: "confirm" | "support" }
  | { event: "phone_click" };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackStoreEvent(payload: StoreAnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const body = { ...payload, ts: Date.now() };
  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(body);
  } catch {
    /* ignore */
  }
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", payload.event, body);
    }
  } catch {
    /* ignore */
  }
  try {
    forwardStoreEventToSnap(payload);
  } catch {
    /* ignore */
  }
}
