import { codThankYouCopy } from "@/config/codThankYouCopy";
import { CodThankYouIconFrame } from "./CodThankYouIconFrame";
import { IconBox, IconClock, IconGem, IconMapPin, IconShield } from "./CodThankYouIcons";

const icons = [IconClock, IconShield, IconBox, IconGem] as const;

export function CodThankYouQuickTrust() {
  return (
    <section className="grid grid-cols-2 gap-4 border-t border-velora-burgundy/8 px-5 py-6 sm:grid-cols-4 sm:gap-3">
      {codThankYouCopy.quickTrust.map((item, index) => {
        const Icon = icons[index] ?? IconShield;
        return (
          <div key={item.id} className="flex flex-col items-center text-center">
            <CodThankYouIconFrame variant="luxury" size="md">
              <Icon />
            </CodThankYouIconFrame>
            <p className="mt-2.5 text-[10px] font-bold text-velora-burgundy-dark">{item.label}</p>
            <p className="mt-0.5 text-[9px] leading-tight text-velora-burgundy/55">{item.value}</p>
            {"badge" in item && item.badge && (
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-velora-champagne/30 px-2 py-0.5 text-[7px] font-semibold text-velora-burgundy-dark ring-1 ring-velora-champagne/40">
                <IconMapPin />
                {item.badge}
              </span>
            )}
          </div>
        );
      })}
    </section>
  );
}
