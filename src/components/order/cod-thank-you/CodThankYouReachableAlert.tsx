"use client";

import { useCallback, useRef } from "react";
import { codThankYouCopy, codWhatsAppConfirmMessage } from "@/config/codThankYouCopy";
import { isSupportWhatsAppConfigured, supportWhatsAppUrl } from "@/config/storeContact";
import { trackStoreEvent } from "@/lib/analytics/trackStoreEvent";
import { IconPhone, IconWhatsApp } from "./CodThankYouIcons";

type Props = {
  orderRef: string;
  customerName: string;
  phone: string;
};

export function CodThankYouReachableAlert({ orderRef, customerName, phone }: Props) {
  const { reachable, footer } = codThankYouCopy;
  const clicked = useRef(false);

  const onWhatsApp = useCallback(() => {
    if (!isSupportWhatsAppConfigured() || clicked.current) return;
    clicked.current = true;
    trackStoreEvent({ event: "confirmation_click" });
    trackStoreEvent({ event: "whatsapp_click", placement: "confirm" });
    const name = customerName.split(/\s+/)[0] ?? customerName;
    window.open(supportWhatsAppUrl(codWhatsAppConfirmMessage(orderRef, name)), "_blank", "noopener");
    window.setTimeout(() => {
      clicked.current = false;
    }, 4000);
  }, [customerName, orderRef]);

  return (
    <section className="mx-5 rounded-2xl border border-velora-champagne/50 bg-gradient-to-br from-velora-champagne/30 to-velora-champagne/10 p-4 text-right">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-velora-champagne/50 text-velora-burgundy-dark">
          <IconPhone className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-velora-burgundy-dark">{reachable.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-velora-burgundy/80">{reachable.body}</p>
          <p className="mt-3 text-[10px] font-semibold text-velora-burgundy/55">{reachable.phoneLabel}</p>
          <p className="text-lg font-bold tabular-nums text-velora-burgundy-dark" dir="ltr">
            {phone}
          </p>
        </div>
      </div>
      {isSupportWhatsAppConfigured() ? (
        <>
          <button
            type="button"
            onClick={onWhatsApp}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-velora-burgundy py-3 text-sm font-bold text-velora-cream shadow-md"
          >
            <IconWhatsApp className="h-5 w-5" />
            {reachable.whatsappCta}
          </button>
          <p className="mt-2 text-center text-[9px] text-velora-burgundy/50">{reachable.whatsappHint}</p>
        </>
      ) : (
        <p className="mt-3 text-[10px] text-velora-burgundy/50">{footer.whatsappMissing}</p>
      )}
    </section>
  );
}
