import Image from "next/image";

const brands = [
  { src: "/images/payments/visa.png", alt: "Visa" },
  { src: "/images/payments/mastercard.png", alt: "Mastercard" },
  { src: "/images/payments/apple-pay.png", alt: "Apple Pay" },
  { src: "/images/payments/google-pay.png", alt: "Google Pay" },
] as const;

const sizeStyles = {
  xs: { box: "h-5 min-w-[34px] px-1", img: 10 },
  sm: { box: "h-7 min-w-[44px] px-1.5", img: 13 },
  md: { box: "h-9 min-w-[58px] px-2.5", img: 18 },
} as const;

type Size = keyof typeof sizeStyles;

function BrandBadge({ src, alt, size }: { src: string; alt: string; size: Size }) {
  const { box, img } = sizeStyles[size];
  return (
    <span
      className={`inline-flex ${box} shrink-0 items-center justify-center rounded border border-gray-200/90 bg-white`}
      aria-label={alt}
    >
      <Image
        src={src}
        alt={alt}
        width={44}
        height={img}
        className="h-auto max-h-full w-auto max-w-full object-contain"
        unoptimized
      />
    </span>
  );
}

type Props = {
  size?: Size;
  align?: "start" | "center" | "end";
  className?: string;
};

export function PaymentBrandStrip({ size = "md", align = "start", className = "" }: Props) {
  const alignClass =
    align === "center" ? "justify-center" : align === "end" ? "justify-end" : "justify-start";

  return (
    <div
      className={`flex max-w-full flex-wrap items-center gap-1 ${alignClass} ${className}`}
      dir="ltr"
      aria-label="طرق الدفع المقبولة"
    >
      {brands.map((brand) => (
        <BrandBadge key={brand.alt} src={brand.src} alt={brand.alt} size={size} />
      ))}
    </div>
  );
}
