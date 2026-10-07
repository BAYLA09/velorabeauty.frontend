import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/ordersRepository";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "الطلب غير موجود." }, { status: 404 });
  }
  return NextResponse.json({ order });
}
