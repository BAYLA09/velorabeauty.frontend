"use client";

import { StoreHeaderShell } from "@/components/StoreHeaderShell";

const links = [
  { label: "الرئيسية", href: "/" },
  { label: "المنتجات", href: "/#products" },
  { label: "الأسئلة", href: "/#faq" },
];

export function ProductStoreHeader() {
  return <StoreHeaderShell theme="light" links={links} />;
}
