import { HAIR_GUMMIES_BACKORDER_NOTICE_AR } from "@/config/hairGummiesBackorder";

type Props = {
  className?: string;
};

/** Hair gummies reservation banner — only when HAIR_GUMMIES_BACKORDER is true. */
export function HairGummiesBackorderNotice({ className = "" }: Props) {
  return (
    <div
      role="status"
      className={`rounded-2xl border border-velora-burgundy/20 bg-gradient-to-b from-[#fdf2f4] to-velora-cream-dark/90 px-4 py-3.5 text-center text-sm font-semibold leading-relaxed text-velora-burgundy-dark shadow-sm ring-1 ring-velora-burgundy/8 ${className}`}
    >
      {HAIR_GUMMIES_BACKORDER_NOTICE_AR}
    </div>
  );
}
