import { codThankYouCopy } from "@/config/codThankYouCopy";
import { CodThankYouIconFrame } from "./CodThankYouIconFrame";
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
    <div className="mx-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-velora-champagne/30 ring-1 ring-velora-champagne/35">
      <div className="flex items-start gap-3 bg-gradient-to-br from-white to-velora-cream/80 p-4 text-right">
        <CodThankYouIconFrame variant="luxury" size="md">
          <IconPackage />
        </CodThankYouIconFrame>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-velora-burgundy/45">
            {meta.orderNumber}
          </p>
          <p className="mt-0.5 truncate text-sm font-bold tabular-nums text-velora-burgundy-dark" dir="ltr">
            #{orderRef}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-gradient-to-br from-white to-velora-cream/80 p-4 text-right">
        <CodThankYouIconFrame variant="luxury" size="md">
          <IconCalendar />
        </CodThankYouIconFrame>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-velora-burgundy/45">
            {meta.orderDate}
          </p>
          <p className="mt-0.5 text-xs font-bold leading-snug text-velora-burgundy-dark">
            {formatOrderDate(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
