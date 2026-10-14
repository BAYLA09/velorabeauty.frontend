import type { ReactNode } from "react";

type Variant = "soft" | "solid" | "accent" | "muted" | "luxury";
type Size = "sm" | "md" | "lg" | "hero" | "button";

const sizeClass: Record<Size, string> = {
  sm: "h-10 w-10 [&_svg]:h-[19px] [&_svg]:w-[19px]",
  md: "h-12 w-12 [&_svg]:h-[22px] [&_svg]:w-[22px]",
  lg: "h-14 w-14 [&_svg]:h-6 [&_svg]:w-6",
  hero: "h-[5.75rem] w-[5.75rem] [&_svg]:h-10 [&_svg]:w-10",
  button: "h-10 w-10 [&_svg]:h-[18px] [&_svg]:w-[18px]",
};

const variantClass: Record<Variant, string> = {
  soft: "bg-white text-velora-burgundy shadow-sm ring-1 ring-velora-burgundy/12",
  solid:
    "bg-gradient-to-br from-velora-burgundy to-velora-burgundy-dark text-velora-cream shadow-[0_6px_22px_rgba(92,42,50,0.28)]",
  accent:
    "bg-gradient-to-br from-velora-champagne/35 to-velora-champagne/15 text-velora-burgundy-dark ring-1 ring-velora-champagne/55 shadow-sm",
  muted: "bg-velora-cream text-velora-burgundy ring-1 ring-velora-burgundy/10",
  luxury:
    "bg-gradient-to-b from-white to-velora-cream/90 text-velora-burgundy shadow-[0_8px_24px_rgba(201,169,98,0.22)] ring-2 ring-velora-champagne/45",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

/** Icon medallion — visible, luxury retail (not emoji). */
export function CodThankYouIconFrame({
  children,
  variant = "luxury",
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
