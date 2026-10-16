import { cardThankYouCopy } from "@/config/cardThankYouCopy";
import { CodThankYouCelebration } from "@/components/order/cod-thank-you/CodThankYouCelebration";
import { CodThankYouIconFrame } from "@/components/order/cod-thank-you/CodThankYouIconFrame";
import { IconCheck, IconSuccessHalo } from "@/components/order/cod-thank-you/CodThankYouIcons";

type Props = {
  customerName: string;
  isPaid: boolean;
};

export function CardThankYouHero({ customerName, isPaid }: Props) {
  const firstName = customerName.split(/\s+/)[0] ?? customerName;
  const { hero, paidBadge } = cardThankYouCopy;

  return (
    <header className="relative overflow-visible px-5 pb-2 pt-8 text-center">
      <CodThankYouCelebration />

      <p className="relative z-10 mx-auto mb-4 inline-flex rounded-full bg-emerald-600/10 px-3 py-1 text-[10px] font-bold tracking-wide text-emerald-800 ring-1 ring-emerald-600/20">
        {paidBadge}
      </p>

      <div className="relative mx-auto flex h-[6rem] w-[6rem] animate-[codSuccessPop_0.65s_ease-out] items-center justify-center">
        <IconSuccessHalo className="pointer-events-none absolute text-emerald-600/25" />
        <CodThankYouIconFrame
          variant="solid"
          size="hero"
          className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 ring-4 ring-emerald-500/25"
        >
          <IconCheck className="text-white" />
        </CodThankYouIconFrame>
      </div>

      <h1 className="mt-6 font-display text-[1.45rem] font-bold leading-snug text-velora-burgundy-dark sm:text-[1.65rem]">
        {hero.title}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-velora-burgundy/75">
        <span className="font-semibold text-velora-burgundy-dark">{firstName}</span>، {hero.lead}
      </p>
      {!isPaid ? (
        <p className="mt-2 text-xs font-medium text-amber-800/90">{cardThankYouCopy.status.pending}</p>
      ) : null}
    </header>
  );
}
