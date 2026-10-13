import {
  checkoutActionUrl,
  checkoutCollectionUrl,
  orderCollectionUrl,
  type BackendCheckoutConfig,
} from "@/lib/backendCheckout/config";
import {
  interpretBackendCall,
  type BackendCallInterpretation,
  type BackendOrderBody,
  type CreateCheckoutBody,
} from "@/lib/backendCheckout/contract";

export type BackendCallResult = BackendCallInterpretation & {
  status: number;
};

async function postBackend(input: {
  config: Extract<BackendCheckoutConfig, { enabled: true }>;
  url: string;
  body?: unknown;
  op: "create" | "abandon" | "recover" | "order";
}): Promise<BackendCallResult> {
  const { config, url, op } = input;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: input.body === undefined ? "{}" : JSON.stringify(input.body),
      signal: AbortSignal.timeout(config.timeoutMs),
      cache: "no-store",
    });
    const text = await response.text();
    let parsed: unknown = null;
    if (text) {
      try {
        parsed = JSON.parse(text) as unknown;
      } catch {
        parsed = { error: text.slice(0, 180) };
      }
    }
    const interpretation = interpretBackendCall({ op, status: response.status, body: parsed });
    return { ...interpretation, status: response.status };
  } catch (err) {
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    return { action: "retry", status: timedOut ? 408 : 0 };
  }
}

export function createBackendCheckout(
  config: Extract<BackendCheckoutConfig, { enabled: true }>,
  body: CreateCheckoutBody,
): Promise<BackendCallResult> {
  return postBackend({
    config,
    url: checkoutCollectionUrl(config.baseUrl),
    body,
    op: "create",
  });
}

export function abandonBackendCheckout(
  config: Extract<BackendCheckoutConfig, { enabled: true }>,
  checkoutId: string,
): Promise<BackendCallResult> {
  return postBackend({
    config,
    url: checkoutActionUrl(config.baseUrl, checkoutId, "abandon"),
    op: "abandon",
  });
}

export function createBackendOrder(
  config: Extract<BackendCheckoutConfig, { enabled: true }>,
  body: BackendOrderBody,
): Promise<BackendCallResult> {
  return postBackend({
    config,
    url: orderCollectionUrl(config.baseUrl),
    body,
    op: "order",
  });
}

export function recoverBackendCheckout(
  config: Extract<BackendCheckoutConfig, { enabled: true }>,
  checkoutId: string,
): Promise<BackendCallResult> {
  return postBackend({
    config,
    url: checkoutActionUrl(config.baseUrl, checkoutId, "recover"),
    op: "recover",
  });
}
