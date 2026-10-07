/** Static placeholder matching Stripe Payment Element layout (no spinner). */
export function PaymentFieldsSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden>
      <div>
        <div className="mb-1.5 h-3.5 w-24 rounded bg-neutral-200" />
        <div className="h-11 w-full rounded-md border border-[#e8e8e8] bg-neutral-50" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1.5 h-3.5 w-20 rounded bg-neutral-200" />
          <div className="h-11 rounded-md border border-[#e8e8e8] bg-neutral-50" />
        </div>
        <div>
          <div className="mb-1.5 h-3.5 w-16 rounded bg-neutral-200" />
          <div className="h-11 rounded-md border border-[#e8e8e8] bg-neutral-50" />
        </div>
      </div>
    </div>
  );
}
