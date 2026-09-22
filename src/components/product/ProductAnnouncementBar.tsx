"use client";

import { useEffect, useState } from "react";

const messages = [
  "شحن داخل الإمارات · الدفع بالبطاقة · الدفع عند الاستلام",
  "فيلورا بيوتي — جمالك، بطابعٍ مختلف.",
  "الدفع بالبطاقة — بدون رسوم إضافية",
];

export function ProductAnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden bg-velora-burgundy text-velora-cream">
      <div className="mx-auto flex min-h-10 max-w-6xl items-center justify-center px-4 py-2 text-center text-[11px] font-bold sm:text-sm">
        {messages[index]}
      </div>
    </div>
  );
}
