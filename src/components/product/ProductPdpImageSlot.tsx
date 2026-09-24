import { ProductPageImage } from "@/components/product/ProductPageImage";

/** مساحة صورة على PDP — تظهر دائماً (خاوية حتى تضيفي المسار في images.ts) */
export function ProductPdpImageSlot({
  src,
  imageAlt,
  placeholderLabel = "مساحة الصورة",
}: {
  src?: string;
  imageAlt: string;
  placeholderLabel?: string;
}) {
  const hasImage = Boolean(src?.trim());

  return (
    <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-dashed border-velora-burgundy/20 bg-velora-cream-dark/40 shadow-sm">
      {hasImage && src ? (
        <ProductPageImage src={src} alt={imageAlt} className="h-auto w-full object-cover" />
      ) : (
        <div
          className="flex aspect-[4/3] flex-col items-center justify-center gap-2 px-4 text-center sm:aspect-[16/10]"
          aria-label={placeholderLabel}
        >
          <span
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-velora-burgundy/15 bg-white/80 text-velora-burgundy/35"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10.5" r="1.5" />
              <path d="M21 16l-5-5-4 4-2-2-5 5" />
            </svg>
          </span>
          <p className="text-xs font-semibold text-velora-burgundy/45">{placeholderLabel}</p>
        </div>
      )}
    </div>
  );
}
