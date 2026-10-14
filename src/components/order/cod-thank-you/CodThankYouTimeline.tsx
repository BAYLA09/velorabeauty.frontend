import { codThankYouCopy } from "@/config/codThankYouCopy";
import type { CodTimelineStep } from "@/lib/order/codThankYouTimeline";
import { IconBox, IconCart, IconPhone, IconTruck } from "./CodThankYouIcons";

const stepIcons = {
  placed: IconCart,
  confirm: IconPhone,
  prepare: IconBox,
  deliver: IconTruck,
} as const;

type Props = {
  steps: CodTimelineStep[];
};

export function CodThankYouTimeline({ steps }: Props) {
  const { timeline } = codThankYouCopy;

  return (
    <section className="rounded-3xl border border-velora-burgundy/10 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-right text-sm font-bold text-velora-burgundy-dark">{timeline.heading}</h2>
      <p className="mt-1 text-right text-[11px] leading-relaxed text-velora-burgundy/55">
        {timeline.deliveryNote}
      </p>

      <ol className="mt-6 grid gap-4 sm:grid-cols-4 sm:gap-2" aria-label={timeline.heading}>
        {steps.map((step) => {
          const copy = timeline.steps[step.id];
          const Icon = stepIcons[step.id];
          const done = step.state === "done";
          const active = step.state === "active";
          return (
            <li
              key={step.id}
              className={`flex flex-col items-center rounded-2xl px-2 py-3 text-center transition ${
                active ? "bg-velora-burgundy/[0.06] ring-1 ring-velora-burgundy/15" : ""
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full ${
                  done
                    ? "bg-velora-burgundy text-velora-cream"
                    : active
                      ? "border-2 border-velora-burgundy bg-white text-velora-burgundy"
                      : "border border-velora-burgundy/15 bg-velora-cream/50 text-velora-burgundy/35"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <p
                className={`mt-2 text-[11px] font-bold leading-tight ${
                  active ? "text-velora-burgundy" : "text-velora-burgundy-dark"
                }`}
              >
                {copy.label}
              </p>
              <p className="mt-0.5 text-[9px] text-velora-burgundy/50">{copy.hint}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
