"use client";

import { StoreHeaderShell } from "@/components/StoreHeaderShell";
import { navigation } from "@/config/content";

const links = navigation.map((item) => ({ label: item.label, href: item.href }));

export function Header() {
  return <StoreHeaderShell theme="dark" links={links} />;
}
