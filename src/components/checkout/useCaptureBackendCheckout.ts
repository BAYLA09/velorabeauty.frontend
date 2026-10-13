"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  readStableCheckoutExternalId,
  resolveCheckoutExternalId,
} from "@/lib/backendCheckout/checkoutExternalId";
import { isCheckoutEmail } from "@/lib/backendCheckout/contract";
import type { CartLine } from "@/lib/cart/cartTypes";
import type { PaymentMethod } from "@/config/pricing";

export {
  clearStoredCheckoutExternalId,
  resolveCheckoutExternalId,
} from "@/lib/backendCheckout/checkoutExternalId";

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

/**
 * Posts the checkout once a valid email is known, and again when the cart,
 * consent, or payment method changes. The debounce only batches keystrokes.
 * It does not poll. The backend sweep marks a quiet checkout abandoned.
 */
export function useCaptureBackendCheckout(input: CaptureBackendCheckoutInput): string {
  const [externalCheckoutId, setExternalCheckoutId] = useState("");

  useLayoutEffect(() => {
    setExternalCheckoutId(readStableCheckoutExternalId());
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
    if (!isCheckoutEmail(input.email)) return;
    const timer = window.setTimeout(() => {
      const details = detailsRef.current;
      const syncExternalCheckoutId = resolveCheckoutExternalId(externalCheckoutId);
      if (!syncExternalCheckoutId) return;
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
          externalCheckoutId: syncExternalCheckoutId,
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

  return resolveCheckoutExternalId(externalCheckoutId);
}
