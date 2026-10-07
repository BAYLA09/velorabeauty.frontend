import { randomUUID } from "node:crypto";
import {
  cardBundlePrices,
  codFee,
  getCheckoutTotal,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import { getDb } from "@/lib/db";

export type OrderRecord = {
  id: string;
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  paymentMethod: PaymentMethod;
  subtotalAed: number;
  deliveryFeeAed: number;
  totalAed: number;
  customerName: string;
  phone: string;
  emirate: string;
  address: string;
  status: string;
  createdAt: string;
};

export type CreateOrderInput = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  paymentMethod: PaymentMethod;
  customerName: string;
  phone: string;
  emirate: string;
  address: string;
};

type OrderRow = {
  id: string;
  product_slug: string;
  product_name: string;
  quantity: number;
  payment_method: PaymentMethod;
  subtotal_aed: number;
  delivery_fee_aed: number;
  total_aed: number;
  customer_name: string;
  phone: string;
  emirate: string;
  address: string;
  status: string;
  created_at: string;
};

function rowToRecord(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    productSlug: row.product_slug,
    productName: row.product_name,
    quantity: row.quantity as BundleQuantity,
    paymentMethod: row.payment_method,
    subtotalAed: row.subtotal_aed,
    deliveryFeeAed: row.delivery_fee_aed,
    totalAed: row.total_aed,
    customerName: row.customer_name,
    phone: row.phone,
    emirate: row.emirate,
    address: row.address,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function computeOrderAmounts(
  quantity: BundleQuantity,
  paymentMethod: PaymentMethod,
): { subtotalAed: number; deliveryFeeAed: number; totalAed: number } {
  const subtotalAed = cardBundlePrices[quantity];
  const deliveryFeeAed = paymentMethod === "cod" ? codFee : 0;
  const totalAed = getCheckoutTotal(quantity, paymentMethod);
  return { subtotalAed, deliveryFeeAed, totalAed };
}

export function createOrder(input: CreateOrderInput): OrderRecord {
  const { subtotalAed, deliveryFeeAed, totalAed } = computeOrderAmounts(
    input.quantity,
    input.paymentMethod,
  );

  const id = randomUUID();
  const createdAt = new Date().toISOString();

  getDb()
    .prepare(
      `INSERT INTO orders (
        id, product_slug, product_name, quantity, payment_method,
        subtotal_aed, delivery_fee_aed, total_aed,
        customer_name, phone, emirate, address, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    )
    .run(
      id,
      input.productSlug,
      input.productName,
      input.quantity,
      input.paymentMethod,
      subtotalAed,
      deliveryFeeAed,
      totalAed,
      input.customerName.trim(),
      input.phone.trim(),
      input.emirate.trim(),
      input.address.trim(),
      createdAt,
    );

  const row = getDb()
    .prepare(`SELECT * FROM orders WHERE id = ?`)
    .get(id) as OrderRow;

  return rowToRecord(row);
}

export function getOrderById(id: string): OrderRecord | null {
  const row = getDb().prepare(`SELECT * FROM orders WHERE id = ?`).get(id) as
    | OrderRow
    | undefined;
  return row ? rowToRecord(row) : null;
}
