import { validateUaeMobilePhone } from "@/lib/phone/uaePhone";

/** Canonical match key: +9715XXXXXXXX */
export function uaePhoneMatchKey(raw: string): string | null {
  const r = validateUaeMobilePhone(raw);
  return r.ok ? r.normalized : null;
}

export function phonesMatch(a: string, b: string): boolean {
  const ka = uaePhoneMatchKey(a);
  const kb = uaePhoneMatchKey(b);
  if (!ka || !kb) return false;
  return ka === kb;
}
