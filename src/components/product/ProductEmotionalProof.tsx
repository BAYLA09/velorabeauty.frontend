/** بديل التقييمات الفارغة — رسائل عاطفية من البراند (ليست آراء عميلات وهمية) */
export function ProductEmotionalProof({
  title,
  subtitle,
  lines,
}: {
  title: string;
  subtitle: string;
  lines: string[];
}) {
  return (
    <section className="bg-velora-cream px-4 py-12 md:px-6 md:py-14">
      <div className="mx-auto max-w-lg sm:max-w-3xl">
        <h2 className="text-right text-2xl font-extrabold text-velora-burgundy-dark sm:text-3xl">{title}</h2>
        <p className="mt-2 text-right text-sm text-velora-burgundy/60">{subtitle}</p>
        <ul className="mt-8 space-y-4">
          {lines.map((line) => (
            <li
              key={line}
              className="rounded-[1.25rem] border border-velora-burgundy/10 bg-white px-5 py-4 text-right text-[15px] font-medium leading-[1.75] text-velora-burgundy-dark shadow-sm"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
