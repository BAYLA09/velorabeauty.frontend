"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FooterSection } from "@/components/FooterSection";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { brand } from "@/config/brand";

type Accent = "gold" | "burgundy";

type Props = {
  accent: Accent;
  eyebrow: string;
  title: string;
  lead: string;
  heroBadge: string;
  perks: readonly string[];
  children: ReactNode;
};

const accentStyles: Record<
  Accent,
  { glow: string; badge: string; ring: string; gradient: string }
> = {
  gold: {
    glow: "from-velora-champagne/25 via-transparent to-velora-cream",
    badge: "border-velora-champagne/40 bg-velora-champagne/15 text-velora-champagne-dark",
    ring: "ring-velora-champagne/30",
    gradient: "from-[#1a0c10] via-[#2c1318] to-[#1f0a12]",
  },
  burgundy: {
    glow: "from-velora-burgundy/30 via-transparent to-velora-cream",
    badge: "border-white/20 bg-white/10 text-velora-cream",
    ring: "ring-white/15",
    gradient: "from-[#1a0c10] via-[#3a1820] to-[#2c1318]",
  },
};

export function CheckoutExperienceLayout({
  accent,
  eyebrow,
  title,
  lead,
  heroBadge,
  perks,
  children,
}: Props) {
  const styles = accentStyles[accent];

  return (
    <>
      <ProductStoreHeader />
      <main className="relative min-h-screen overflow-hidden bg-velora-cream">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${styles.gradient} opacity-[0.92]`}
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-br ${styles.glow} blur-3xl`}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #c9a962 0, #c9a962 1px, transparent 1px, transparent 48px)",
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="text-xs font-bold tracking-[0.2em] text-velora-cream/55 transition hover:text-velora-champagne"
            >
              ← {brand.nameAr}
            </Link>
            <span
              className={`rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-wide ${styles.badge}`}
            >
              {heroBadge}
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start lg:gap-14">
            <header className="text-right text-velora-cream lg:sticky lg:top-28">
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-velora-champagne">
                {eyebrow}
              </p>
              <h1 className="mt-4 text-3xl font-black leading-[1.2] sm:text-4xl lg:text-[2.65rem]">
                {title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-velora-cream/78 sm:text-lg">
                {lead}
              </p>
              <ul className="mt-8 space-y-3">
                {perks.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm font-medium text-velora-cream/85"
                  >
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-velora-champagne/20 text-xs text-velora-champagne"
                      aria-hidden
                    >
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </header>

            <div
              className={`rounded-[2rem] border border-white/10 bg-white/95 p-1 shadow-2xl shadow-black/40 ring-1 ${styles.ring} backdrop-blur-sm`}
            >
              <div className="rounded-[1.85rem] bg-white p-6 sm:p-8">{children}</div>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
