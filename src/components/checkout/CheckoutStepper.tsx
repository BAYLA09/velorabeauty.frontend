type Step = 1 | 2 | 3;

const steps: { id: Step; label: string }[] = [
  { id: 1, label: "معلومات الطلب" },
  { id: 2, label: "طريقة الدفع" },
  { id: 3, label: "تأكيد الطلب" },
];

export function CheckoutStepper({ current }: { current: Step }) {
  return (
    <nav aria-label="خطوات إتمام الطلب" className="w-full">
      <ol className="flex items-center justify-center gap-0 sm:gap-2">
        {steps.map((step, index) => {
          const done = step.id < current;
          const active = step.id === current;
          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 px-1 sm:flex-row sm:justify-center sm:gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                    done
                      ? "bg-velora-burgundy text-velora-cream"
                      : active
                        ? "bg-velora-burgundy text-velora-cream ring-4 ring-velora-burgundy/15"
                        : "bg-velora-cream-dark text-velora-burgundy/40"
                  }`}
                >
                  {done ? "✓" : step.id}
                </span>
                <span
                  className={`max-w-[5.5rem] text-center text-[10px] font-bold leading-tight sm:max-w-none sm:text-xs ${
                    active ? "text-velora-burgundy-dark" : "text-velora-burgundy/45"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <span
                  className={`hidden h-0.5 flex-1 sm:block ${
                    step.id < current ? "bg-velora-burgundy/50" : "bg-velora-burgundy/10"
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
