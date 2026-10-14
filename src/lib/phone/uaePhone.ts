/** UAE mobile: 05xxxxxxxx (10) or +971 5xxxxxxxx (9 after country code). */

export type UaePhoneResult =
  | { ok: true; normalized: string; display: string }
  | { ok: false; error: string };

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

/** Max digits per format — user cannot type past required length. */
function capNormalizedUaePhone(compact: string): string {
  if (!compact) return "";
  if (compact.startsWith("+971")) {
    return `+971${compact.slice(4).replace(/\D/g, "").slice(0, 9)}`;
  }
  if (compact.startsWith("+")) {
    const d = compact.slice(1).replace(/\D/g, "");
    if (d.startsWith("971")) {
      return `+971${d.slice(3, 12)}`;
    }
    return `+${d.slice(0, 3)}`;
  }
  const digits = compact.replace(/\D/g, "");
  if (digits.startsWith("971")) {
    return digits.slice(0, 12);
  }
  if (digits.startsWith("05")) {
    return digits.slice(0, 10);
  }
  if (digits.startsWith("5")) {
    return digits.slice(0, 9);
  }
  if (digits.startsWith("0")) {
    return digits.slice(0, 10);
  }
  return digits.slice(0, 10);
}

/** Keeps digits, optional leading +; caps length so validation does not fail on "too long". */
export function sanitizeUaePhoneTyping(raw: string): string {
  const trimmed = raw.trimStart();
  if (!trimmed) return "";
  let out = "";
  for (const c of trimmed) {
    if (c >= "0" && c <= "9") out += c;
    else if (c === "+" && out.length === 0) out += c;
    else if (c === " " && out.length > 0 && !out.endsWith(" ")) out += c;
  }
  return capNormalizedUaePhone(normalizeUaePhoneInput(out));
}

function incompleteError(kind: "local" | "intl"): string {
  return kind === "intl"
    ? `أكملي الرقم — 9 أرقام بعد ${LTR}+971 (تبدأ بـ 5).`
    : `أكملي الرقم — 10 أرقام ${LTR}05XXXXXXXX.`;
}

export function validateUaeMobilePhone(raw: string): UaePhoneResult {
  const s = normalizeUaePhoneInput(raw);
  if (!s) {
    return { ok: false, error: "أدخلي رقم الهاتف." };
  }

  let nationalNine: string | null = null;

  if (s.startsWith("+971")) {
    const rest = s.slice(4);
    if (rest.length < 9) {
      return { ok: false, error: incompleteError("intl") };
    }
    if (!/^5[0-9]{8}$/.test(rest)) {
      return { ok: false, error: `رقم الموبايل بعد ${LTR}+971 يبدأ بـ 5.` };
    }
    nationalNine = rest;
  } else if (s.startsWith("971")) {
    const rest = s.slice(3);
    if (rest.length < 9) {
      return { ok: false, error: incompleteError("intl") };
    }
    if (!/^5[0-9]{8}$/.test(rest)) {
      return { ok: false, error: `رقم الموبايل بعد 971 يبدأ بـ 5.` };
    }
    nationalNine = rest;
  } else if (s.startsWith("05")) {
    if (s.length < 10) {
      return { ok: false, error: incompleteError("local") };
    }
    if (!/^05[0-9]{8}$/.test(s)) {
      return { ok: false, error: `استخدمي ${LTR}05 ثم 8 أرقام.` };
    }
    nationalNine = s.slice(1);
  } else if (s.startsWith("5")) {
    if (s.length < 9) {
      return { ok: false, error: incompleteError("local").replace("05", "5") };
    }
    if (!/^5[0-9]{8}$/.test(s)) {
      return { ok: false, error: "رقم الموبايل الإماراتي يبدأ بـ 5." };
    }
    nationalNine = s;
  } else {
    return { ok: false, error: `استخدمي ${LTR}05XXXXXXXX أو ${LTR}+9715XXXXXXXX.` };
  }

  const normalized = `+971${nationalNine}`;
  const display = `0${nationalNine}`;
  return { ok: true, normalized, display };
}
