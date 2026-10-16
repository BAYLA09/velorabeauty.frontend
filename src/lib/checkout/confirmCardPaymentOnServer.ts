/** Marks order paid (via Stripe) and triggers card Google Sheet export — safe to call after inline confirmPayment. */
export async function confirmCardPaymentOnServer(input: {
  orderId: string;
  paymentIntentId?: string;
  sessionId?: string;
}): Promise<{ paid: boolean }> {
  try {
    const res = await fetch("/api/checkout/stripe/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: input.orderId,
        paymentIntentId: input.paymentIntentId,
        sessionId: input.sessionId,
      }),
    });
    if (!res.ok) return { paid: false };
    const data = (await res.json()) as { paid?: boolean };
    return { paid: data.paid === true };
  } catch {
    return { paid: false };
  }
}
