"use client";

import Link from "next/link";
import { codThankYouCopy, codWhatsAppSupportMessage } from "@/config/codThankYouCopy";
import { isSupportWhatsAppConfigured, supportWhatsAppUrl } from "@/config/storeContact";
import { trackStoreEvent } from "@/lib/analytics/trackStoreEvent";
import { IconChat, IconWhatsApp } from "./CodThankYouIcons";

type Props = {
  orderRef: string;
  onHome?: () => void;
};

export function CodThankYouFooterBar({ orderRef, onHome }: Props) {
  const { footer } = codThankYouCopy;
  const waReady = isSupportWhatsAppConfigured();

  return (
    <footer className="mt-2 border-t border-velora-burgundy/10 bg-velora-cream-dark/50 px-5 py-5">
      <div className="flex items-start gap-2 text-right text-xs text-velora-burgundy/75">
        <IconChat className="mt-0.5 h-5 w-5 shrink-0 text-velora-burgundy" />
        <p>{footer.help}</p>
      </div>

      {waReady ? (
        <a
          href={supportWhatsAppUrl(codWhatsAppSupportMessage(orderRef))}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackStoreEvent({ event: "whatsapp_click", placement: "support" })}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-velora-burgundy py-3.5 text-sm font-bold text-velora-cream shadow-lg shadow-velora-burgundy/20"
        >
          <IconWhatsApp className="h-5 w-5" />
          {footer.whatsapp}
          <span aria-hidden className="opacity-70">
            ←
          </span>
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
