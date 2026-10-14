"use client";

import Link from "next/link";
import { codThankYouCopy, codWhatsAppSupportMessage } from "@/config/codThankYouCopy";
import { isSupportWhatsAppConfigured, supportWhatsAppUrl } from "@/config/storeContact";
import { trackStoreEvent } from "@/lib/analytics/trackStoreEvent";
import { CodThankYouIconFrame } from "./CodThankYouIconFrame";
import {
  CodThankYouButtonIconBadge,
  IconChevronEnd,
  IconLuxuryMessage,
  IconSupport,
} from "./CodThankYouIcons";

type Props = {
  orderRef: string;
  onHome?: () => void;
};

export function CodThankYouFooterBar({ orderRef, onHome }: Props) {
  const { footer } = codThankYouCopy;
  const waReady = isSupportWhatsAppConfigured();

  return (
    <footer className="mt-2 border-t border-velora-burgundy/10 bg-velora-cream-dark/50 px-5 py-5">
      <div className="flex items-start gap-3 text-right text-xs text-velora-burgundy/75">
        <CodThankYouIconFrame variant="luxury" size="md" className="mt-0.5">
          <IconSupport />
        </CodThankYouIconFrame>
        <p className="pt-2 font-medium">{footer.help}</p>
      </div>

      {waReady ? (
        <a
          href={supportWhatsAppUrl(codWhatsAppSupportMessage(orderRef))}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackStoreEvent({ event: "whatsapp_click", placement: "support" })}
          className="mt-4 flex w-full items-center justify-between gap-2 rounded-2xl bg-gradient-to-r from-velora-burgundy to-velora-burgundy-dark py-3.5 pe-5 ps-4 text-sm font-bold text-velora-cream shadow-lg shadow-velora-burgundy/25 transition hover:brightness-105"
        >
          <span className="flex items-center gap-3">
            <CodThankYouButtonIconBadge>
              <IconLuxuryMessage className="h-[18px] w-[18px] text-velora-cream" />
            </CodThankYouButtonIconBadge>
            {footer.whatsapp}
          </span>
          <IconChevronEnd className="opacity-85" />
        </a>
      ) : (
        <p className="mt-3 text-center text-[10px] text-velora-burgundy/45">{footer.whatsappMissing}</p>
      )}

      <Link
        href="/"
        onClick={onHome}
        className="mt-3 block text-center text-xs font-semibold text-velora-burgundy/55 underline-offset-2 hover:underline"
      >
        {footer.homeCta}
      </Link>
    </footer>
  );
}
