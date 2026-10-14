import { codThankYouCopy } from "@/config/codThankYouCopy";

export function CodThankYouBeforeDelivery() {
  const { beforeDelivery } = codThankYouCopy;
  return (
    <section className="rounded-3xl border border-velora-burgundy/10 bg-velora-cream/50 p-5 text-right">
      <h2 className="text-sm font-bold text-velora-burgundy-dark">{beforeDelivery.title}</h2>
      <ul className="mt-3 space-y-2 text-xs leading-relaxed text-velora-burgundy/75">
        {beforeDelivery.items.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="text-velora-champagne-dark">•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
