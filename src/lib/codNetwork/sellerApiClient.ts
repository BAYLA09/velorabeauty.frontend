const DEFAULT_API_BASE = "https://api.cod.network";

export function codNetworkApiBase(): string {
  return process.env.COD_NETWORK_API_BASE?.trim().replace(/\/$/, "") || DEFAULT_API_BASE;
}

export function codNetworkApiToken(): string | null {
  return process.env.COD_NETWORK_API_TOKEN?.trim() || null;
}

export function isCodNetworkApiConfigured(): boolean {
  return Boolean(codNetworkApiToken());
}

export type SellerLeadCreatePayload = {
  phone: string;
  name: string;
  country: "AE";
  address: string;
  city: string;
  items: { sku: string; quantity: number; price: number }[];
};

function parseLeadIdFromCreateResponse(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const root = body as Record<string, unknown>;
  const data = root.data;
  if (data && typeof data === "object") {
    const id = (data as Record<string, unknown>).id;
    if (id !== undefined && id !== null) return String(id);
  }
  const direct = root.id;
  if (direct !== undefined && direct !== null) return String(direct);
  return null;
}

/** POST /v2/seller/leads — never logs the bearer token. */
export async function createSellerLead(
  payload: SellerLeadCreatePayload,
): Promise<{ leadId: string }> {
  const token = codNetworkApiToken();
  if (!token) throw new Error("missing_api_token");
  const res = await fetch(`${codNetworkApiBase()}/v2/seller/leads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(25_000),
  });
  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? (JSON.parse(text) as unknown) : null;
  } catch {
    parsed = null;
  }
  if (!res.ok) {
    throw new Error(`cod_network_api_${res.status}:${text.slice(0, 200)}`);
  }
  const leadId = parseLeadIdFromCreateResponse(parsed);
  if (!leadId) {
    throw new Error("cod_network_api_invalid_response");
  }
  return { leadId };
}

export async function fetchSellerJson(path: string): Promise<unknown> {
  const token = codNetworkApiToken();
  if (!token) throw new Error("missing_api_token");
  const res = await fetch(`${codNetworkApiBase()}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(25_000),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`cod_network_api_${res.status}:${text.slice(0, 200)}`);
  }
  return JSON.parse(text) as unknown;
}
