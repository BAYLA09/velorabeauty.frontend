/** Surface Stripe / network errors in checkout without hiding long IntegrationError text. */
export function formatCheckoutPayError(err: unknown): string {
  if (err && typeof err === "object") {
    const stripeLike = err as { message?: string; type?: string; code?: string };
    const msg = typeof stripeLike.message === "string" ? stripeLike.message.trim() : "";
    if (msg) {
      if (msg.length <= 240) return msg;
      return `${msg.slice(0, 237)}…`;
    }
  }
  if (err instanceof Error) {
    const msg = err.message.trim();
    if (msg && msg.length <= 240) return msg;
    if (msg.length > 240) return `${msg.slice(0, 237)}…`;
  }
  return "تعذّر إتمام الدفع. تحققي من الاتصال أو أعيدي تحميل الصفحة وحاولي مجدداً.";
}
