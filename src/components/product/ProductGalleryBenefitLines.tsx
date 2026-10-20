import { IconCheckCircle } from "@/components/product/ProductFunnelIcons";

export function ProductGalleryBenefitLines({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null;

  return (
    <ul className="mt-3 space-y-2 sm:mt-4">
      {lines.map((line) => (
        <li
          key={line}
          className="flex items-start justify-end gap-2 text-right text-[13px] font-semibold leading-relaxed text-velora-burgundy/90 sm:text-sm"
        >
          <span>{line}</span>
          <IconCheckCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
            aria-hidden
          />
        </li>
      ))}
    </ul>
  );
}
