import type { ReactNode } from "react";

type Variant = "soft" | "solid" | "accent" | "muted";
type Size = "sm" | "md" | "lg" | "hero";

const sizeClass: Record<Size, string> = {
  sm: "h-9 w-9 [&_svg]:h-[18px] [&_svg]:w-[18px]",
  md: "h-11 w-11 [&_svg]:h-5 [&_svg]:w-5",
  lg: "h-12 w-12 [&_svg]:h-[22px] [&_svg]:w-[22px]",
  hero: "h-[5.25rem] w-[5.25rem] [&_svg]:h-9 [&_svg]:w-9",
};

const variantClass: Record<Variant, string> = {
  soft: "bg-white text-velora-burgundy shadow-sm ring-1 ring-velora-burgundy/10",
  solid: "bg-velora-burgundy text-velora-cream shadow-md shadow-velora-burgundy/20",
  accent: "bg-velora-champagne/25 text-velora-burgundy-dark ring-1 ring-velora-champagne/50",
  muted: "bg-velora-burgundy/[0.06] text-velora-burgundy ring-1 ring-velora-burgundy/8",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

/** Unified icon circle — luxury retail consistency on thank-you page. */
export function CodThankYouIconFrame({
  children,
  variant = "soft",
  size = "md",
  className = "",
}: Props) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${sizeClass[size]} ${variantClass[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
