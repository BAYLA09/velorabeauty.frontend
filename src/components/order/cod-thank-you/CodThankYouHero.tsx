import { codThankYouCopy } from "@/config/codThankYouCopy";
import { IconCheck } from "./CodThankYouIcons";

type Props = {
  customerName: string;
};

export function CodThankYouHero({ customerName }: Props) {
  const firstName = customerName.split(/\s+/)[0] ?? customerName;
  const { hero } = codThankYouCopy;

  return (
    <header className="relative px-5 pb-2 pt-8 text-center">
      <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center gap-8" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rotate-45 rounded-sm bg-velora-champagne/60 animate-[codConfetti_2.8s_ease-out_infinite]"
            style={{ animationDelay: `${i * 0.25}s`, marginTop: `${(i % 3) * 4}px` }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full bg-velora-burgundy text-velora-cream shadow-[0_10px_32px_rgba(92,42,50,0.35)]">
        <IconCheck className="h-10 w-10" />
      </div>

      <h1 className="mt-6 text-[1.45rem] font-bold leading-snug text-velora-burgundy-dark sm:text-[1.6rem]">
        {hero.title} 🎉
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-velora-burgundy/75">
        <span className="font-semibold text-velora-burgundy-dark">{firstName}</span>، {hero.lead}
      </p>
    </header>
  );
}
