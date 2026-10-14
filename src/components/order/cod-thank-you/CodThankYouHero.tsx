import { codThankYouCopy } from "@/config/codThankYouCopy";
import { CodThankYouIconFrame } from "./CodThankYouIconFrame";
import { IconCheck, IconSuccessHalo } from "./CodThankYouIcons";

type Props = {
  customerName: string;
};

export function CodThankYouHero({ customerName }: Props) {
  const firstName = customerName.split(/\s+/)[0] ?? customerName;
  const { hero } = codThankYouCopy;

  return (
    <header className="relative px-5 pb-2 pt-8 text-center">
      <div className="relative mx-auto flex h-[6rem] w-[6rem] items-center justify-center">
        <IconSuccessHalo className="pointer-events-none absolute text-velora-champagne" />
        <CodThankYouIconFrame variant="solid" size="hero" className="relative ring-4 ring-velora-champagne/30">
          <IconCheck />
        </CodThankYouIconFrame>
      </div>

      <h1 className="mt-6 font-display text-[1.45rem] font-bold leading-snug text-velora-burgundy-dark sm:text-[1.6rem]">
        {hero.title}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-velora-burgundy/75">
        <span className="font-semibold text-velora-burgundy-dark">{firstName}</span>، {hero.lead}
      </p>
    </header>
  );
}
