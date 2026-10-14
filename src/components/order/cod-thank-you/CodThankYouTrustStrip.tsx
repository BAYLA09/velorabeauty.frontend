import { codThankYouCopy } from "@/config/codThankYouCopy";

export function CodThankYouTrustStrip() {
  return (
    <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {codThankYouCopy.trust.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-velora-burgundy/8 bg-white/90 px-3 py-3 text-right shadow-sm"
        >
          <p className="text-[11px] font-bold text-velora-burgundy-dark">{item.label}</p>
          <p className="mt-0.5 text-[9px] leading-snug text-velora-burgundy/55">{item.sub}</p>
        </div>
      ))}
    </section>
  );
}
