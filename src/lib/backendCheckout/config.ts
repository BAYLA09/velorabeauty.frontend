import type { AbandonMode } from "@/lib/backendCheckout/contract";

export type BackendCheckoutConfig =
  | { enabled: false; reason: string }
  | {
      enabled: true;
      baseUrl: string;
      apiKey: string;
      abandonMode: AbandonMode;
      abandonDelayMinutes: number;
      timeoutMs: number;
    };

function readAbandonMode(value: string | undefined): AbandonMode {
  if (value === "delayed" || value === "none" || value === "immediate") return value;
  return "none";
}

export function readBackendCheckoutConfig(
  env: Record<string, string | undefined> = process.env,
): BackendCheckoutConfig {
  const baseUrl = env.BACKEND_API_BASE_URL?.trim().replace(/\/+$/, "") ?? "";
  const apiKey = env.STORE_API_KEY?.trim() ?? "";
  if (!baseUrl || !apiKey) {
    return { enabled: false, reason: "BACKEND_API_BASE_URL or STORE_API_KEY is unset" };
  }
  let parsed: URL;
  try {
    parsed = new URL(baseUrl);
  } catch {
    return { enabled: false, reason: "BACKEND_API_BASE_URL is not a valid URL" };
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { enabled: false, reason: "BACKEND_API_BASE_URL must be http or https" };
  }
  if (apiKey.length < 16) {
    return { enabled: false, reason: "STORE_API_KEY must be at least 16 characters" };
  }

  const delayRaw = Number(env.BACKEND_ABANDON_DELAY_MINUTES ?? "30");
  const abandonDelayMinutes =
    Number.isFinite(delayRaw) && delayRaw >= 1 ? Math.floor(delayRaw) : 30;

  return {
    enabled: true,
    baseUrl: parsed.origin,
    apiKey,
    abandonMode: readAbandonMode(env.BACKEND_CHECKOUT_ABANDON_MODE?.trim()),
    abandonDelayMinutes,
    timeoutMs: 4000,
  };
}

export function checkoutCollectionUrl(baseUrl: string): string {
  return `${baseUrl}/api/checkouts`;
}

export function orderCollectionUrl(baseUrl: string): string {
  return `${baseUrl}/api/orders`;
}

export function checkoutActionUrl(
  baseUrl: string,
  checkoutId: string,
  action: "abandon" | "recover",
): string {
  return `${baseUrl}/api/checkouts/${encodeURIComponent(checkoutId)}/${action}`;
}
