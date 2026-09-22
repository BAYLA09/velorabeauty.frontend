"use client";

import { useState } from "react";
import { faq } from "@/config/content";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-velora-cream px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold text-velora-burgundy md:text-4xl">
          {faq.title}
        </h2>

        <ul className="mt-10 divide-y divide-velora-burgundy/10 rounded-3xl border border-velora-burgundy/8 bg-white">
          {faq.items.map((item, index) => {
            const open = openIndex === index;
            return (
              <li key={item.question}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-right md:px-6"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                >
                  <span className="text-base font-semibold text-velora-burgundy md:text-lg">
                    {item.question}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-velora-burgundy/15 text-lg text-velora-burgundy transition ${
                      open ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {open && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-velora-burgundy/70 md:px-6 md:text-base">
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
