/** Customer support — single source for WhatsApp, email, and default inquiry message. */

export const veloraSupportContact = {
  /** wa.me digits only (no +) */
  whatsappE164: "16592270522",
  email: "beautyvelora038@gmail.com",
  whatsappInquiryMessage: "مرحبا، عندي استفسار عن منتجات فيلورا 🌿",
} as const;

function readPublicEnv(name: string): string {
  const v = process.env[name]?.trim();
  return v ?? "";
}

/** E.164 digits only, e.g. 16592270522 for wa.me — env overrides default */
export const supportWhatsAppE164 =
  readPublicEnv("NEXT_PUBLIC_SUPPORT_WHATSAPP") || veloraSupportContact.whatsappE164;

/** Display / tel: link, e.g. +971 4 xxx or 800 number */
export const supportPhoneDisplay = readPublicEnv("NEXT_PUBLIC_SUPPORT_PHONE");

export const supportEmail =
  readPublicEnv("NEXT_PUBLIC_SUPPORT_EMAIL") || veloraSupportContact.email;

export function isSupportWhatsAppConfigured(): boolean {
  return /^\d{8,15}$/.test(supportWhatsAppE164);
}

export function supportWhatsAppUrl(message?: string): string {
  const text = encodeURIComponent(message ?? veloraSupportContact.whatsappInquiryMessage);
  return `https://wa.me/${supportWhatsAppE164}?text=${text}`;
}

export function supportMailtoHref(subject?: string): string {
  const q = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${supportEmail}${q}`;
}

export function supportTelHref(): string | null {
  const digits = supportPhoneDisplay.replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `tel:+${digits}`;
}
