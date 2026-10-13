"use client";

import { useEffect, useRef, useState } from "react";
import { isCheckoutEmail, isExternalCheckoutId } from "@/lib/backendCheckout/contract";
import type { CartLine } from "@/lib/cart/cartTypes";
import type { PaymentMethod } from "@/config/pricing";

const STORAGE_KEY = "velora-checkout-external-id";

export type CaptureBackendCheckoutInput = {
  email: string;
  marketingConsent: boolean;
  customerName: string;
  phone: string;
  emirate?: string;
  paymentMethod: PaymentMethod;
  productSlug: string;
  quantity: number;
  cartLines?: CartLine[];
  sendCartLines?: boolean;
  /** Stored in cartData. Not the backend external id — that id is the order UUID. */
  paymentIntentId?: string;
};

function readStableExternalId(explicit?: string): string {
  if (explicit && isExternalCheckoutId(explicit)) return explicit;
  if (typeof window === "undefined") return "";
  try {
    const existing = window.sessionStorage.getItem(STORAGE_KEY);
    if (existing && isExternalCheckoutId(existing)) return existing;
    const created = window.crypto.randomUUID();
    window.sessionStorage.setItem(STORAGE_KEY, created);
    return created;
  } catch {
    return "";
  }
}

export function clearStoredCheckoutExternalId(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* private mode */
  }
}

/**
 * Tells our server about the checkout once an email is present.
 * Abandonment itself is scheduled on the server — this debounce only avoids
 * a request on every keystroke.
 */
export function useCaptureBackendCheckout(input: CaptureBackendCheckoutInput): string {
  const [externalCheckoutId, setExternalCheckoutId] = useState("");

  useEffect(() => {
    setExternalCheckoutId(readStableExternalId());
  }, []);

  const cartKey = input.sendCartLines
    ? (input.cartLines ?? []).map((line) => `${line.slug}:${line.quantity}`).join(",")
    : "";
  const cartLinesRef = useRef(input.cartLines);
  cartLinesRef.current = input.cartLines;
  const detailsRef = useRef({
    customerName: input.customerName,
    phone: input.phone,
    emirate: input.emirate ?? "",
    paymentIntentId: input.paymentIntentId ?? "",
  });
  detailsRef.current = {
    customerName: input.customerName,
    phone: input.phone,
    emirate: input.emirate ?? "",
    paymentIntentId: input.paymentIntentId ?? "",
  };

  useEffect(() => {
    if (!externalCheckoutId || !isCheckoutEmail(input.email)) return;
    const timer = window.setTimeout(() => {
      const details = detailsRef.current;
      void fetch("/api/checkout/backend-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: input.email.trim(),
          marketingConsent: input.marketingConsent === true,
          customerName: details.customerName.trim(),
          phone: details.phone.trim(),
          emirate: details.emirate,
          paymentMethod: input.paymentMethod,
          productSlug: input.productSlug,
          quantity: input.quantity,
          externalCheckoutId,
          paymentIntentId: details.paymentIntentId || undefined,
          ...(input.sendCartLines ? { cartLines: cartLinesRef.current } : {}),
        }),
      }).catch(() => {
        /* checkout must continue if the sync request fails */
      });
    }, 800);
    return () => window.clearTimeout(timer);
  }, [
    cartKey,
    externalCheckoutId,
    input.email,
    input.marketingConsent,
    input.paymentMethod,
    input.productSlug,
    input.quantity,
    input.sendCartLines,
  ]);

  return externalCheckoutId;
}
