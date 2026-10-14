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
    <section className="border-t border-velora-burgundy/8 px-5 py-6">
      <h2 className="flex items-center justify-end gap-2 text-right text-sm font-bold text-velora-burgundy-dark">
        <span aria-hidden>🚚</span>
        {timeline.heading}
      </h2>

      <div className="relative mt-8">
        <div
          className="absolute top-[1.35rem] right-[10%] left-[10%] h-[3px] rounded-full bg-velora-burgundy/12"
          aria-hidden
        />
        <ol className="relative flex justify-between gap-1" aria-label={timeline.heading}>
          {steps.map((step) => {
            const copy = timeline.steps[step.id];
            const Icon = stepIcons[step.id];
            const done = step.state === "done";
            const active = step.state === "active";
            const filled = done || active;

            return (
              <li key={step.id} className="flex w-[23%] flex-col items-center text-center">
                <span
                  className={`relative z-[1] flex h-11 w-11 items-center justify-center rounded-full border-2 transition ${
                    filled
                      ? "border-velora-burgundy bg-velora-burgundy text-velora-cream shadow-md shadow-velora-burgundy/25"
                      : "border-velora-burgundy/20 bg-white text-velora-burgundy/35"
                  } ${active ? "ring-4 ring-velora-champagne/35" : ""}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p
                  className={`mt-2 text-[10px] font-bold leading-tight ${
                    filled ? "text-velora-burgundy-dark" : "text-velora-burgundy/45"
                  }`}
                >
                  {copy.label}
                </p>
                <p className="mt-0.5 hidden text-[8px] leading-tight text-velora-burgundy/50 sm:block">
                  {copy.sub}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
