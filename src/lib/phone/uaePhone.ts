/** UAE mobile: 05xxxxxxxx (10) or +971 5xxxxxxxx (9 after country code). */

export type UaePhoneResult =
  | { ok: true; normalized: string; display: string }
  | { ok: false; error: string };

const CLIENT_ERROR =
  "أدخلي رقم موبايل إماراتي: ‎05XXXXXXXX (10) أو ‎+9715XXXXXXXX (9 بعد +971).";

/** LTR mark so + stays at the start in RTL Arabic pages. */
const LTR = "\u200E";

export const uaePhonePlaceholder = `${LTR}+971 50 123 4567`;

export const uaePhoneHint = `مثال: ${LTR}+971501234567 · ${LTR}0501234567 (10 أرقام)`;

export function normalizeUaePhoneInput(raw: string): string {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return plus ? `+${digits}` : digits;
}

/** Keeps digits, optional leading +, and spaces while typing. */
export function sanitizeUaePhoneTyping(raw: string): string {
  const trimmed = raw.trimStart();
  if (!trimmed) return "";
  let out = "";
  for (const c of trimmed) {
    if (c >= "0" && c <= "9") out += c;
    else if (c === "+" && out.length === 0) out += c;
    else if (c === " " && out.length > 0 && !out.endsWith(" ")) out += c;
  }
  return out.length > 18 ? out.slice(0, 18) : out;
}

export function validateUaeMobilePhone(raw: string): UaePhoneResult {
  const s = normalizeUaePhoneInput(raw);
  if (!s) {
    return { ok: false, error: "أدخلي رقم الهاتف." };
  }

  let nationalNine: string | null = null;

  if (s.startsWith("+971")) {
    const rest = s.slice(4);
    if (rest.length !== 9 || !/^5[0-9]{8}$/.test(rest)) {
      return { ok: false, error: CLIENT_ERROR };
    }
    nationalNine = rest;
  } else if (s.startsWith("971")) {
    const rest = s.slice(3);
    if (rest.length !== 9 || !/^5[0-9]{8}$/.test(rest)) {
      return { ok: false, error: CLIENT_ERROR };
    }
    nationalNine = rest;
  } else if (s.startsWith("05")) {
    if (s.length !== 10 || !/^05[0-9]{8}$/.test(s)) {
      return { ok: false, error: CLIENT_ERROR };
    }
    nationalNine = s.slice(1);
  } else if (s.startsWith("5")) {
    if (s.length !== 9 || !/^5[0-9]{8}$/.test(s)) {
      return { ok: false, error: CLIENT_ERROR };
    }
    nationalNine = s;
  } else {
    return { ok: false, error: CLIENT_ERROR };
  }

  const normalized = `+971${nationalNine}`;
  const display = `0${nationalNine}`;
  return { ok: true, normalized, display };
}
