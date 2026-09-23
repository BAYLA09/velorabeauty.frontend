import type { BundleQuantity, PaymentMethod } from "@/config/pricing";

export type OrderDraft = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  method: PaymentMethod;
  totalAed: number;
  customerName: string;
  phone: string;
  emirate: string;
  address: string;
  createdAt: string;
};

const KEY = "velora_last_order";

export function saveOrderDraft(order: OrderDraft): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(order));
}

export function readOrderDraft(): OrderDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OrderDraft;
  } catch {
    return null;
  }
}

export function clearOrderDraft(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
