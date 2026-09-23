export function ProductAnnouncementBar({ variant = "velora" }: { variant?: "velora" | "lara" }) {
  const bg = variant === "lara" ? "bg-lara-green" : "bg-velora-burgundy";
  return (
    <div className={`${bg} text-velora-cream`}>
      <div className="mx-auto flex min-h-9 max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-extrabold sm:text-sm">
        <span aria-hidden>🚚</span>
        <span>الدفع عند الاستلام • شحن سريع لجميع مناطق الإمارات</span>
      </div>
    </div>
  );
}
