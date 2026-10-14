import { codThankYouCopy } from "@/config/codThankYouCopy";
import { IconBox, IconClock, IconRefresh, IconShield } from "./CodThankYouIcons";

const icons = [IconClock, IconShield, IconBox, IconRefresh] as const;

export function CodThankYouQuickTrust() {
  return (
    <section className="grid grid-cols-2 gap-3 border-t border-velora-burgundy/8 px-5 py-5 sm:grid-cols-4 sm:gap-2">
      {codThankYouCopy.quickTrust.map((item, index) => {
        const Icon = icons[index] ?? IconShield;
        return (
          <div key={item.id} className="flex flex-col items-center text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-velora-burgundy/8 text-velora-burgundy">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-2 text-[9px] font-bold text-velora-burgundy-dark">{item.label}</p>
            <p className="mt-0.5 text-[9px] leading-tight text-velora-burgundy/55">{item.value}</p>
            {"badge" in item && item.badge && (
              <span className="mt-1 rounded-full bg-velora-champagne/30 px-1.5 py-0.5 text-[7px] font-bold text-velora-burgundy">
                {item.badge}
              </span>
            )}
          </div>
        );
      })}
    </section>
  );
}
