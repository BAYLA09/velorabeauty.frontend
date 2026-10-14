import { codThankYouCopy } from "@/config/codThankYouCopy";
import { CodThankYouIconFrame } from "./CodThankYouIconFrame";
import { IconCheck, IconHeadset, IconHeart, IconTruck } from "./CodThankYouIcons";

const valueIcons = [IconCheck, IconTruck, IconHeadset, IconHeart] as const;

export function CodThankYouValues() {
  const { values } = codThankYouCopy;

  return (
    <section className="border-t border-velora-burgundy/8 px-5 py-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <CodThankYouIconFrame variant="accent" size="sm">
          <IconHeart />
        </CodThankYouIconFrame>
        <h2 className="text-base font-bold text-velora-burgundy-dark">{values.title}</h2>
      </div>
      <p className="mt-1 text-xs text-velora-burgundy/60">{values.subtitle}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {values.items.map((item, i) => {
          const Icon = valueIcons[i] ?? IconCheck;
          return (
            <div key={item.label} className="rounded-2xl bg-velora-cream/60 px-2 py-3">
              <CodThankYouIconFrame variant="solid" size="sm" className="mx-auto">
                <Icon />
              </CodThankYouIconFrame>
              <p className="mt-2 text-[10px] font-bold text-velora-burgundy-dark">{item.label}</p>
              <p className="mt-0.5 text-[9px] leading-tight text-velora-burgundy/55">{item.sub}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
