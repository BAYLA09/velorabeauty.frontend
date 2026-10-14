/** Customer support — set in Easypanel / `.env` (no fake numbers in repo). */

function readPublicEnv(name: string): string {
  const v = process.env[name]?.trim();
  return v ?? "";
}

/** E.164 digits only, e.g. 971501234567 for wa.me */
export const supportWhatsAppE164 = readPublicEnv("NEXT_PUBLIC_SUPPORT_WHATSAPP");

/** Display / tel: link, e.g. +971 4 xxx or 800 number */
export const supportPhoneDisplay = readPublicEnv("NEXT_PUBLIC_SUPPORT_PHONE");

export function isSupportWhatsAppConfigured(): boolean {
  return /^\d{8,15}$/.test(supportWhatsAppE164);
}

export function supportWhatsAppUrl(message: string): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${supportWhatsAppE164}?text=${text}`;
}

export function supportTelHref(): string | null {
  const digits = supportPhoneDisplay.replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `tel:+${digits}`;
}
