"use client";

import Link from "next/link";
import { useState } from "react";
import { navigation } from "@/config/content";
import { VeloraLogo } from "./ui/VeloraLogo";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-velora-burgundy/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-velora-cream md:hidden"
          aria-label="القائمة"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex flex-col gap-1">
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
          </span>
        </button>

        <nav className="hidden items-center gap-8 md:flex md:flex-1">
          {navigation.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-velora-cream/85 transition hover:text-velora-champagne"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 justify-center md:flex-none">
          <VeloraLogo onDark />
        </div>

        <div className="flex flex-1 items-center justify-end gap-3 md:flex-none">
          <nav className="hidden items-center gap-8 md:flex">
            {navigation.slice(2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-velora-cream/85 transition hover:text-velora-champagne"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/#checkout"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-velora-cream transition hover:border-velora-champagne/50 hover:text-velora-champagne"
            aria-label="السلة"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 7h15l-1.5 9h-12z" />
              <path d="M6 7L5 4H2" />
              <circle cx="9" cy="19" r="1" fill="currentColor" />
              <circle cx="17" cy="19" r="1" fill="currentColor" />
            </svg>
          </Link>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-velora-burgundy px-4 py-4 md:hidden">
          <ul className="space-y-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-2 text-velora-cream"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#checkout" className="block py-2 text-velora-champagne" onClick={() => setOpen(false)}>
                إتمام الطلب
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
