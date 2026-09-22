type Props = {
  rating: number;
  className?: string;
};

export function StarRating({ rating, className = "" }: Props) {
  const safe = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <div
      className={`flex gap-0.5 text-velora-champagne ${className}`}
      role="img"
      aria-label={`${safe} من 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < safe ? "opacity-100" : "opacity-25"} aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}
