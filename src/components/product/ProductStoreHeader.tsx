"use client";

import Link from "next/link";
import { useState } from "react";
import { VeloraLogo } from "@/components/ui/VeloraLogo";

const links = [
  { label: "الرئيسية", href: "/" },
  { label: "المنتجات", href: "/#products" },
  { label: "الأسئلة", href: "/#faq" },
];

export function ProductStoreHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-velora-burgundy/10 bg-white shadow-sm">
      <div className="mx-auto flex min-h-[4.75rem] max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <VeloraLogo />
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-bold text-velora-burgundy hover:text-velora-burgundy-dark"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/#checkout"
            className="rounded-full p-2 hover:bg-velora-cream-dark"
            aria-label="السلة"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-velora-burgundy" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 7h15l-1.5 9h-12z" />
              <path d="M6 7L5 4H2" />
              <circle cx="9" cy="19" r="1" fill="currentColor" />
              <circle cx="17" cy="19" r="1" fill="currentColor" />
            </svg>
          </Link>
          <button
            type="button"
            className="rounded-full p-2 md:hidden"
            aria-label="القائمة"
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-velora-burgundy" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 12h16M4 18h16M4 6h16" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-velora-burgundy/10 bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block py-2 text-velora-burgundy" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
