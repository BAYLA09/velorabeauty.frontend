"use client";

import { useCallback, useRef } from "react";
import { codThankYouCopy, codWhatsAppConfirmMessage } from "@/config/codThankYouCopy";
import {
  isSupportWhatsAppConfigured,
  supportWhatsAppUrl,
} from "@/config/storeContact";
import { trackStoreEvent } from "@/lib/analytics/trackStoreEvent";
import { IconWhatsApp } from "./CodThankYouIcons";

type Props = {
  orderRef: string;
  customerName: string;
  phone: string;
};

export function CodThankYouConfirmSection({ orderRef, customerName, phone }: Props) {
  const { confirmSection, support } = codThankYouCopy;
  const confirmClicked = useRef(false);

  const openWhatsAppConfirm = useCallback(() => {
    if (!isSupportWhatsAppConfigured()) return;
    if (confirmClicked.current) return;
    confirmClicked.current = true;
    trackStoreEvent({ event: "confirmation_click" });
    trackStoreEvent({ event: "whatsapp_click", placement: "confirm" });
    const firstName = customerName.split(/\s+/)[0] ?? customerName;
    const msg = codWhatsAppConfirmMessage(orderRef, firstName);
    window.open(supportWhatsAppUrl(msg), "_blank", "noopener,noreferrer");
    window.setTimeout(() => {
      confirmClicked.current = false;
    }, 4000);
  }, [customerName, orderRef]);

  const waReady = isSupportWhatsAppConfigured();

  return (
    <section className="rounded-3xl border-2 border-velora-champagne/60 bg-gradient-to-b from-velora-champagne/15 to-white p-5 sm:p-6">
      <h2 className="text-right text-base font-bold text-velora-burgundy-dark">
        {confirmSection.title}
      </h2>
      <p className="mt-2 text-right text-sm leading-relaxed text-velora-burgundy/80">
        {confirmSection.body}
      </p>
      <p className="mt-2 text-right text-xs font-medium text-velora-burgundy/60">
        {confirmSection.callWindow}
      </p>

      <div className="mt-5 rounded-2xl bg-white p-4 text-center shadow-inner shadow-velora-burgundy/5">
        <p className="text-[11px] font-semibold text-velora-burgundy/50">{confirmSection.phoneLabel}</p>
        <p className="mt-1 text-xl font-bold tabular-nums text-velora-burgundy-dark" dir="ltr">
          {phone}
        </p>
      </div>

      {waReady ? (
        <>
          <button
            type="button"
            onClick={openWhatsAppConfirm}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-105 active:scale-[0.99]"
          >
            <IconWhatsApp className="h-5 w-5" />
            {confirmSection.whatsappCta}
          </button>
          <p className="mt-2 text-center text-[10px] leading-relaxed text-velora-burgundy/50">
            {confirmSection.whatsappHint}
          </p>
        </>
      ) : (
        <p className="mt-4 text-center text-[11px] leading-relaxed text-velora-burgundy/45">
          {support.whatsappMissing}
        </p>
      )}
    </section>
  );
}
