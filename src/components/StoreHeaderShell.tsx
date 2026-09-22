"use client";

import Link from "next/link";
import { useState } from "react";
import { VeloraLogo } from "@/components/ui/VeloraLogo";

export type StoreNavLink = { label: string; href: string };

type Props = {
  theme: "light" | "dark";
  links: StoreNavLink[];
};

export function StoreHeaderShell({ theme, links }: Props) {
  const [open, setOpen] = useState(false);
  const isDark = theme === "dark";

  const headerClass = isDark
    ? "border-white/10 bg-velora-burgundy/95 backdrop-blur-md"
    : "border-velora-burgundy/10 bg-white shadow-sm";

  const linkClass = isDark
    ? "text-sm font-medium text-velora-cream/90 transition hover:text-velora-champagne"
    : "text-sm font-bold text-velora-burgundy transition hover:text-velora-burgundy-dark";

  const cartClass = isDark
    ? "rounded-full p-2 text-velora-cream transition hover:text-velora-champagne"
    : "rounded-full p-2 text-velora-burgundy transition hover:bg-velora-cream-dark";

  const menuClass = isDark
    ? "rounded-full p-2 text-velora-cream md:hidden"
    : "rounded-full p-2 text-velora-burgundy md:hidden";

  return (
    <header className={`sticky top-0 z-50 border-b ${headerClass}`}>
      <div className="relative mx-auto flex h-14 max-w-6xl items-center px-4 sm:h-16 sm:px-6">
        {/* RTL: inline-start = يمين — الشعار */}
        <div className="relative z-10 flex min-w-0 flex-1 justify-start">
          <VeloraLogo onDark={isDark} layout="row" />
        </div>

        {/* الوسط — القائمة (Lara-style) */}
        <nav
          className="pointer-events-none absolute inset-x-0 hidden justify-center md:flex"
          aria-label="التنقل الرئيسي"
        >
          <div className="pointer-events-auto flex items-center gap-8 lg:gap-10">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* inline-end = يسار — السلة */}
        <div className="relative z-10 flex flex-1 items-center justify-end gap-0.5">
          <Link href="/#checkout" className={cartClass} aria-label="السلة">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 7h15l-1.5 9h-12z" />
              <path d="M6 7L5 4H2" />
              <circle cx="9" cy="19" r="1" fill="currentColor" />
              <circle cx="17" cy="19" r="1" fill="currentColor" />
            </svg>
          </Link>
          <button type="button" className={menuClass} aria-label="القائمة" onClick={() => setOpen((v) => !v)}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 12h16M4 18h16M4 6h16" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          className={`border-t px-4 py-3 md:hidden ${
            isDark ? "border-white/10 bg-velora-burgundy" : "border-velora-burgundy/10 bg-white"
          }`}
        >
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-2.5 ${isDark ? "text-velora-cream" : "text-velora-burgundy"}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#checkout"
            className={`block py-2.5 font-bold ${isDark ? "text-velora-champagne" : "text-velora-burgundy-dark"}`}
            onClick={() => setOpen(false)}
          >
            السلة / إتمام الطلب
          </Link>
        </nav>
      )}
    </header>
  );
}
