"use client";

import { codThankYouCopy } from "@/config/codThankYouCopy";
import {
  isSupportWhatsAppConfigured,
  supportPhoneDisplay,
  supportTelHref,
  supportWhatsAppUrl,
} from "@/config/storeContact";
import { trackStoreEvent } from "@/lib/analytics/trackStoreEvent";
import { IconPhone, IconWhatsApp } from "./CodThankYouIcons";

type Props = {
  orderRef: string;
};

export function CodThankYouSupport({ orderRef }: Props) {
  const { support, faq } = codThankYouCopy;
  const waReady = isSupportWhatsAppConfigured();
  const tel = supportTelHref();
  const supportMsg = `السلام عليكم، عندي استفسار عن طلب COD مرجع ${orderRef}.`;

  return (
    <section className="rounded-3xl border border-velora-burgundy/10 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-right text-base font-bold text-velora-burgundy-dark">{support.title}</h2>
      <p className="mt-1 text-right text-sm text-velora-burgundy/65">{support.subtitle}</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {waReady && (
          <a
            href={supportWhatsAppUrl(supportMsg)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackStoreEvent({ event: "whatsapp_click", placement: "support" })}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white"
          >
            <IconWhatsApp className="h-5 w-5" />
            {support.whatsapp}
          </a>
        )}
        {tel && supportPhoneDisplay && (
          <a
            href={tel}
            onClick={() => trackStoreEvent({ event: "phone_click" })}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-velora-burgundy/20 bg-velora-cream px-4 py-3 text-sm font-bold text-velora-burgundy"
          >
            <IconPhone className="h-5 w-5" />
            {support.call}
          </a>
        )}
      </div>

      {!waReady && !tel && (
        <p className="mt-3 text-center text-[11px] text-velora-burgundy/45">{support.whatsappMissing}</p>
      )}

      <div className="mt-6 border-t border-velora-burgundy/10 pt-5">
        <h3 className="text-right text-xs font-bold text-velora-burgundy-dark">{support.faqTitle}</h3>
        <dl className="mt-3 space-y-3 text-right">
          {faq.map((item) => (
            <div key={item.q}>
              <dt className="text-xs font-semibold text-velora-burgundy">{item.q}</dt>
              <dd className="mt-1 text-[11px] leading-relaxed text-velora-burgundy/60">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
