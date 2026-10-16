import type { CartLine } from "@/lib/cart/cartTypes";
import type { OrderDraft } from "@/lib/orderStorage";

export async function fetchOrderDraftById(
  orderId: string,
  draftFallback?: OrderDraft | null,
): Promise<{ order: OrderDraft | null; status: string | null }> {
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
    if (!res.ok) return { order: draftFallback ?? null, status: null };
    const data = (await res.json()) as {
      order: {
        id: string;
        productSlug: string;
        productName: string;
        quantity: OrderDraft["quantity"];
        paymentMethod: OrderDraft["method"];
        totalAed: number;
        deliveryFeeAed: number;
        customerName: string;
        phone: string;
        emirate: string;
        address: string;
        subtotalAed: number;
        createdAt: string;
        status: string;
        cartLines?: CartLine[];
      };
    };
    const draftCartLines =
      draftFallback?.orderId === data.order.id ? draftFallback.cartLines : undefined;
    const cartLines =
      data.order.cartLines && data.order.cartLines.length > 0
        ? data.order.cartLines
        : draftCartLines;
    return {
      status: data.order.status,
      order: {
        orderId: data.order.id,
        productSlug: data.order.productSlug,
        productName: data.order.productName,
        quantity: data.order.quantity,
        method: data.order.paymentMethod,
        totalAed: data.order.totalAed,
        deliveryFeeAed: data.order.deliveryFeeAed,
        subtotalAed: data.order.subtotalAed,
        status: data.order.status,
        customerName: data.order.customerName,
        phone: data.order.phone,
        emirate: data.order.emirate,
        address: data.order.address,
        createdAt: data.order.createdAt,
        ...(cartLines?.length ? { cartLines } : {}),
      },
    };
  } catch {
    return { order: draftFallback ?? null, status: null };
  }
}

export async function confirmStripePaymentIfNeeded(input: {
  orderId: string | null;
  sessionId: string | null;
  paymentIntentId: string | null;
}): Promise<void> {
  if (!input.orderId) return;
  try {
    await fetch("/api/checkout/stripe/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: input.orderId,
        sessionId: input.sessionId ?? undefined,
        paymentIntentId: input.paymentIntentId ?? undefined,
      }),
    });
  } catch {
    /* webhook may already have marked paid */
  }
}
