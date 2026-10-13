export type BackendCheckoutConfig =
  | { enabled: false; reason: string }
  | {
      enabled: true;
      baseUrl: string;
      apiKey: string;
      timeoutMs: number;
    };

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

  return {
    enabled: true,
    baseUrl: parsed.origin,
    apiKey,
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
  action: "recover",
): string {
  return `${baseUrl}/api/checkouts/${encodeURIComponent(checkoutId)}/${action}`;
}
