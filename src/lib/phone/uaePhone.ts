/** UAE mobile: 05xxxxxxxx (10) or +971 5xxxxxxxx (9 after country code). */

export type UaePhoneResult =
  | { ok: true; normalized: string; display: string }
  | { ok: false; error: string };

const CLIENT_ERROR =
  "أدخلي رقم إماراتي صحيح: 05xxxxxxxx (10 أرقام) أو +9715xxxxxxxx (13 رقم مع +971).";

export function normalizeUaePhoneInput(raw: string): string {
  return raw.replace(/[\s\-().]/g, "").trim();
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

export const uaePhoneHint =
  "10 أرقام (05xxxxxxxx) أو دولي +971 ثم 9 أرقام (5xxxxxxxx)";
