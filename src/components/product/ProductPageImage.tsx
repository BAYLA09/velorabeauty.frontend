type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  onError?: () => void;
};

/** PDP — PNG كامل بلا Next/Image fill */
export function ProductPageImage({ src, alt, priority = false, className = "", onError }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={1254}
      height={1254}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={onError}
      className={`block h-auto max-w-full ${className}`}
    />
  );
}
