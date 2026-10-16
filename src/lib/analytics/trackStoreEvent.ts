/** Lightweight storefront events — no PII (no phone/name). */

export type StoreAnalyticsEvent =
  | { event: "cod_thank_you_page_view" }
  | { event: "card_thank_you_page_view" }
  | { event: "order_summary_view" }
  | {
      event: "purchase";
      value_aed: number;
      currency: "AED";
      order_ref: string;
      payment_method: "card" | "cod";
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
}
