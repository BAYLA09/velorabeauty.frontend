import { codThankYouCopy } from "@/config/codThankYouCopy";
import { IconCalendar, IconPackage } from "./CodThankYouIcons";

type Props = {
  orderRef: string;
  createdAt: string;
};

function formatOrderDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ar-AE", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function CodThankYouOrderMetaBar({ orderRef, createdAt }: Props) {
  const { meta } = codThankYouCopy;

  return (
    <div className="mx-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-velora-burgundy/10">
      <div className="flex items-start gap-3 bg-velora-cream-dark/90 p-4 text-right">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-velora-burgundy shadow-sm">
          <IconPackage />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-velora-burgundy/50">{meta.orderNumber}</p>
          <p className="mt-0.5 truncate text-sm font-bold tabular-nums text-velora-burgundy-dark" dir="ltr">
            #{orderRef}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-velora-cream-dark/90 p-4 text-right">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-velora-burgundy shadow-sm">
          <IconCalendar />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-velora-burgundy/50">{meta.orderDate}</p>
          <p className="mt-0.5 text-xs font-bold leading-snug text-velora-burgundy-dark">
            {formatOrderDate(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
