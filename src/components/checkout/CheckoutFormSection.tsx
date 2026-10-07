import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function CheckoutFormSection({ title, subtitle, children }: Props) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-base font-extrabold text-neutral-900">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
