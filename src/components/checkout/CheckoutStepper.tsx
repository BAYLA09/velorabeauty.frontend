type Step = 1 | 2 | 3;

const steps: { id: Step; label: string }[] = [
  { id: 1, label: "معلومات الطلب" },
  { id: 2, label: "طريقة الدفع" },
  { id: 3, label: "تأكيد الطلب" },
];

function StepCheckIcon({ className }: { className?: string }) {
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

export function CheckoutStepper({ current }: { current: Step }) {
  return (
    <nav aria-label="خطوات إتمام الطلب" className="w-full rounded-xl border border-neutral-200/80 bg-white px-3 py-4 shadow-sm sm:px-6">
      <ol className="flex items-center justify-between gap-1 sm:justify-center sm:gap-0">
        {steps.map((step, index) => {
          const done = step.id < current;
          const active = step.id === current;
          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 px-0.5 sm:flex-row sm:justify-center sm:gap-2.5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                    done
                      ? "bg-emerald-800 text-white"
                      : active
                        ? "bg-neutral-900 text-white ring-4 ring-neutral-900/10"
                        : "border border-neutral-200 bg-neutral-50 text-neutral-400"
                  }`}
                >
                  {done ? <StepCheckIcon className="h-4 w-4" /> : step.id}
                </span>
                <span
                  className={`max-w-[4.75rem] text-center text-[10px] font-semibold leading-tight sm:max-w-none sm:text-xs ${
                    active ? "text-neutral-900" : done ? "text-neutral-600" : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <span
                  className={`mx-1 hidden h-px min-w-[1rem] flex-1 sm:block ${
                    step.id < current ? "bg-emerald-700/40" : "bg-neutral-200"
                  }`}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
