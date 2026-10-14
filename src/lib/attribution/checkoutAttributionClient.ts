"use client";

import type { OrderAttribution } from "@/lib/attribution/orderAttribution";

const STORAGE_KEY = "velora_checkout_attribution_v1";

function readFromUrl(): OrderAttribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: OrderAttribution = {
    landingUrl: window.location.href.slice(0, 2000),
  };
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ] as const) {
    const v = params.get(key)?.trim();
    if (v) out[key] = v;
  }
  return out;
}

/** Persist first-touch UTMs for checkout (session). */
export function captureCheckoutAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return;
    const attr = readFromUrl();
    const hasUtm = Boolean(
      attr.utm_source || attr.utm_medium || attr.utm_campaign || attr.utm_content || attr.utm_term,
    );
    if (!hasUtm && !attr.landingUrl) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attr));
  } catch {
    /* ignore */
  }
}

export function getCheckoutAttributionForOrder(): OrderAttribution | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as OrderAttribution;
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {
    /* ignore */
  }
  return readFromUrl();
}
