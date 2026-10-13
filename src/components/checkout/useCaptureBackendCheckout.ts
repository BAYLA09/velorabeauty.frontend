"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  beaconBackendCheckoutSync,
  postBackendCheckoutSync,
  type BrowserBackendSyncPayload,
} from "@/lib/backendCheckout/browserSync";
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

const SYNC_DEBOUNCE_MS = 500;

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

export type CaptureBackendCheckoutResult = {
  externalCheckoutId: string;
  /** Call on email blur or before submit so sync is not lost to debounce/tab close. */
  syncNow: () => void;
};

/**
 * Posts the checkout once a valid email is known, and again when the cart,
 * consent, or payment method changes. Debounce batches keystrokes only.
 * pagehide uses sendBeacon when the shopper leaves before the timer fires.
 */
export function useCaptureBackendCheckout(
  input: CaptureBackendCheckoutInput,
): CaptureBackendCheckoutResult {
  const [externalCheckoutId, setExternalCheckoutId] = useState("");

  useLayoutEffect(() => {
    setExternalCheckoutId(readStableCheckoutExternalId());
  }, []);

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

  const buildPayload = useCallback((): BrowserBackendSyncPayload | null => {
    if (!isCheckoutEmail(input.email)) return null;
    const syncExternalCheckoutId = resolveCheckoutExternalId(externalCheckoutId);
    if (!syncExternalCheckoutId) return null;
    const details = detailsRef.current;
    return {
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
    };
  }, [
    externalCheckoutId,
    input.email,
    input.marketingConsent,
    input.paymentMethod,
    input.productSlug,
    input.quantity,
    input.sendCartLines,
  ]);

  const syncNow = useCallback(() => {
    const payload = buildPayload();
    if (!payload) return;
    void postBackendCheckoutSync(payload).catch(() => {
      /* checkout must continue if the sync request fails */
    });
  }, [buildPayload]);

  useEffect(() => {
    if (!isCheckoutEmail(input.email)) return;
    const timer = window.setTimeout(syncNow, SYNC_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [input.email, syncNow]);

  useEffect(() => {
    const onPageHide = () => {
      const payload = buildPayload();
      if (!payload) return;
      beaconBackendCheckoutSync(payload);
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [buildPayload]);

  return {
    externalCheckoutId: resolveCheckoutExternalId(externalCheckoutId),
    syncNow,
  };
}
