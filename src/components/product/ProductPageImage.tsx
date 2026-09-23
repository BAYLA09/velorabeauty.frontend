type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  onError?: () => void;
};

/** PDP — PNG كامل (بلا width/height HTML اللي كيقصّو فـ Chrome) */
export function ProductPageImage({ src, alt, priority = false, className = "", onError }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={onError}
      className={`block h-auto w-full max-w-full ${className}`}
    />
  );
}
