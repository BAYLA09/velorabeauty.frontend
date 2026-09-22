"use client";

import { useState } from "react";

type Item = { question: string; answer: string };

export function ProductFaq({ items, title }: { items: Item[]; title: string }) {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-velora-cream px-4 py-16 md:px-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-bold text-velora-burgundy md:text-3xl">{title}</h2>
        <ul className="mt-8 divide-y divide-velora-burgundy/10 rounded-3xl border border-velora-burgundy/8 bg-white">
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
                  <span className="font-semibold text-velora-burgundy">{item.question}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-velora-burgundy/15 transition ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-velora-burgundy/70">
                    {item.answer}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
