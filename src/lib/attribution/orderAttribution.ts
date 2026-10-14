export type OrderAttribution = {
  landingUrl?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export function parseOrderAttributionFromBody(body: Record<string, unknown>): OrderAttribution | null {
  const raw = body.attribution;
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const out: OrderAttribution = {};
  const landing = String(r.landingUrl ?? "").trim();
  if (landing) out.landingUrl = landing.slice(0, 2000);
  for (const key of UTM_KEYS) {
    const v = String(r[key] ?? "").trim();
    if (v) out[key] = v.slice(0, 500);
  }
  return Object.keys(out).length > 0 ? out : null;
}

export function serializeOrderAttribution(attr: OrderAttribution | null): string | null {
  if (!attr || Object.keys(attr).length === 0) return null;
  return JSON.stringify(attr);
}

export function parseStoredOrderAttribution(json: string | null | undefined): OrderAttribution | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parseOrderAttributionFromBody({ attribution: parsed });
  } catch {
    return null;
  }
}
