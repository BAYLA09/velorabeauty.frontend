import Image from "next/image";

const brands = [
  { src: "/images/payments/visa.png", alt: "Visa" },
  { src: "/images/payments/mastercard.png", alt: "Mastercard" },
  { src: "/apple-pay.png", alt: "Apple Pay" },
  { src: "/google-pay.png", alt: "Google Pay", wide: true },
] as const;

const sizeStyles = {
  xs: { box: "h-5 min-w-[34px] px-1", wideMin: "min-w-[46px]", img: 10 },
  sm: { box: "h-7 min-w-[44px] px-1.5", wideMin: "min-w-[56px]", img: 13 },
  md: { box: "h-9 min-w-[58px] px-2.5", wideMin: "min-w-[72px]", img: 18 },
} as const;

type Size = keyof typeof sizeStyles;

function BrandBadge({
  src,
  alt,
  size,
  wide,
}: {
  src: string;
  alt: string;
  size: Size;
  wide?: boolean;
}) {
  const { box, wideMin, img } = sizeStyles[size];
  return (
    <span
      className={`inline-flex ${box} ${wide ? wideMin : ""} shrink-0 items-center justify-center rounded border border-gray-200/90 bg-white px-1`}
      aria-label={alt}
    >
      <Image
        src={src}
        alt={alt}
        width={wide ? 72 : 44}
        height={img}
        className="h-auto max-h-full w-auto max-w-full object-contain object-center"
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
        <BrandBadge
          key={brand.alt}
          src={brand.src}
          alt={brand.alt}
          size={size}
          wide={"wide" in brand ? brand.wide : false}
        />
      ))}
    </div>
  );
}
