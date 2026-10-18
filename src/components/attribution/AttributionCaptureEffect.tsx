"use client";

import { useEffect } from "react";
import { captureCheckoutAttribution } from "@/lib/attribution/checkoutAttributionClient";

/** First-touch landing URL + UTMs for order / Google Sheets attribution. */
export function AttributionCaptureEffect() {
  useEffect(() => {
    captureCheckoutAttribution();
  }, []);
  return null;
}
