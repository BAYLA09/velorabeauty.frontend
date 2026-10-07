import { checkoutTrust } from "@/config/checkoutTrust";

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M12.416 4.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.082l-3-3.5a.75.75 0 011.14-.976L6.7 10.88l4.376-6.564a.75.75 0 011.04-.208z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function CheckoutTrustCard() {
  return (
    <div className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-extrabold text-neutral-900">{checkoutTrust.title}</h3>
      <ul className="mt-3 space-y-2.5">
        {checkoutTrust.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-xs font-medium text-neutral-600">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#134E3A]/10 text-[#134E3A]">
              <IconCheck className="h-3 w-3" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
