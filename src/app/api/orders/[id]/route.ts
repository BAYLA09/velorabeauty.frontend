import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/ordersRepository";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "الطلب غير موجود." }, { status: 404 });
  }
  return NextResponse.json({
    order: {
      id: order.id,
      productSlug: order.productSlug,
      productName: order.productName,
      quantity: order.quantity,
      paymentMethod: order.paymentMethod,
      subtotalAed: order.subtotalAed,
      deliveryFeeAed: order.deliveryFeeAed,
      totalAed: order.totalAed,
      customerName: order.customerName,
      phone: order.phone,
      emirate: order.emirate,
      address: order.address,
      status: order.status,
      stripeCheckoutSessionId: order.stripeCheckoutSessionId,
      stripePaymentIntentId: order.stripePaymentIntentId,
      createdAt: order.createdAt,
      cartLines: order.cartLines,
    },
  });
}
