import { cardThankYouCopy } from "@/config/cardThankYouCopy";
import type { CardTimelineStep } from "@/lib/order/cardThankYouTimeline";
import { CodThankYouIconFrame } from "@/components/order/cod-thank-you/CodThankYouIconFrame";
import { IconBox, IconCart, IconShield, IconTruck } from "@/components/order/cod-thank-you/CodThankYouIcons";

const stepIcons = {
  placed: IconCart,
  paid: IconShield,
  prepare: IconBox,
  deliver: IconTruck,
} as const;

type Props = {
  steps: CardTimelineStep[];
};

export function CardThankYouTimeline({ steps }: Props) {
  const { timeline } = cardThankYouCopy;

  return (
    <section className="border-t border-velora-burgundy/8 px-5 py-6">
      <div className="flex items-center justify-end gap-3 text-right">
        <CodThankYouIconFrame variant="luxury" size="md">
          <IconTruck />
        </CodThankYouIconFrame>
        <h2 className="text-sm font-bold text-velora-burgundy-dark">{timeline.heading}</h2>
      </div>

      <div className="relative mt-9">
        <div
          className="absolute top-[1.65rem] right-[8%] left-[8%] h-px bg-gradient-to-l from-transparent via-emerald-600/25 to-transparent"
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
                <CodThankYouIconFrame
                  variant={filled ? "solid" : "luxury"}
                  size="lg"
                  className={
                    active
                      ? "ring-2 ring-emerald-500/40 ring-offset-2 ring-offset-white"
                      : undefined
                  }
                >
                  <Icon />
                </CodThankYouIconFrame>
                <p
                  className={`mt-2.5 text-[10px] font-bold leading-tight ${
                    filled ? "text-velora-burgundy-dark" : "text-velora-burgundy/45"
                  }`}
                >
                  {copy.label}
                </p>
                <p className="mt-0.5 text-[8px] leading-tight text-velora-burgundy/50">{copy.sub}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
