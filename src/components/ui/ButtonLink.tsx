import Link from "next/link";

type Variant = "gold" | "burgundy" | "outline";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

const variants: Record<Variant, string> = {
  gold:
    "bg-velora-champagne text-velora-burgundy-dark shadow-md shadow-black/10 hover:bg-velora-champagne-light",
  burgundy:
    "bg-velora-burgundy text-velora-cream shadow-md shadow-velora-burgundy-dark/25 hover:bg-velora-burgundy-light",
  outline:
    "border border-velora-champagne/50 bg-transparent text-velora-cream hover:bg-white/10",
};

export function ButtonLink({
  href,
  children,
  variant = "gold",
  className = "",
}: Props) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all ${variants[variant]} ${className}`}
    >
      {children}
      <span aria-hidden className="text-base leading-none">
        ←
      </span>
    </Link>
  );
}
