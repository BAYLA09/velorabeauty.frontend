"use client";

import { useState } from "react";

type Item = { question: string; answer: string };

export function ProductFaq({
  items,
  title,
  subtitle,
}: {
  items: Item[];
  title: string;
  subtitle?: string;
}) {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-velora-cream px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-lg sm:max-w-3xl">
        <p className="text-center text-[11px] font-bold tracking-[0.2em] text-velora-champagne-dark">
          {title}
        </p>
        {subtitle ? (
          <h2 className="mt-2 text-center text-2xl font-extrabold text-velora-burgundy-dark md:text-3xl">
            {subtitle}
          </h2>
        ) : null}
        <ul className="mt-8 divide-y divide-velora-burgundy/10 rounded-[1.5rem] border border-velora-burgundy/10 bg-white shadow-sm">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.question}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-velora-burgundy-dark">{item.question}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-velora-burgundy/15 text-velora-burgundy/60 transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  >
                    ⌄
                  </span>
                </button>
                {isOpen ? (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-velora-burgundy/70">{item.answer}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
