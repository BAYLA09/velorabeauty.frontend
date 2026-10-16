import { cardThankYouCopy } from "@/config/cardThankYouCopy";
import { CodThankYouIconFrame } from "@/components/order/cod-thank-you/CodThankYouIconFrame";
import { IconClock, IconMapPin, IconShield, IconTruck } from "@/components/order/cod-thank-you/CodThankYouIcons";

const icons = [IconShield, IconTruck, IconShield, IconClock] as const;

export function CardThankYouQuickTrust() {
  return (
    <section className="grid grid-cols-2 gap-4 border-t border-velora-burgundy/8 px-5 py-6 sm:grid-cols-4 sm:gap-3">
      {cardThankYouCopy.quickTrust.map((item, index) => {
        const Icon = icons[index] ?? IconShield;
        return (
          <div key={item.id} className="flex flex-col items-center text-center">
            <CodThankYouIconFrame variant="luxury" size="md">
              <Icon />
            </CodThankYouIconFrame>
            <p className="mt-2.5 text-[10px] font-bold text-velora-burgundy-dark">{item.label}</p>
            <p className="mt-0.5 text-[9px] leading-tight text-velora-burgundy/55">{item.value}</p>
            {"badge" in item && item.badge ? (
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[7px] font-semibold text-emerald-900 ring-1 ring-emerald-200/80">
                <IconMapPin className="h-3 w-3" />
                {item.badge}
              </span>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
