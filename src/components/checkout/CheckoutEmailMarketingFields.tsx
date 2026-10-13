"use client";

import {
  checkoutFieldLabelClass,
  checkoutInputClass,
} from "@/components/checkout/checkoutFieldStyles";
import { MarketingConsentField } from "@/components/checkout/MarketingConsentField";

/** Email + marketing consent — directly under card payment block. */
export function CheckoutEmailMarketingFields(props: {
  email: string;
  setEmail: (v: string) => void;
  marketingConsent: boolean;
  setMarketingConsent: (v: boolean) => void;
  onEmailBlur?: () => void;
}) {
  const { email, setEmail, marketingConsent, setMarketingConsent, onEmailBlur } = props;

  return (
    <div className="space-y-2.5">
      <div>
        <label htmlFor="checkout-email" className={checkoutFieldLabelClass}>
          البريد الإلكتروني{" "}
          <span className="font-normal text-neutral-400">(اختياري)</span>
        </label>
        <input
          id="checkout-email"
          type="email"
          dir="ltr"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          onBlur={() => onEmailBlur?.()}
          placeholder="name@email.com"
          className={checkoutInputClass}
          autoComplete="email"
        />
      </div>
      <MarketingConsentField
        checked={marketingConsent}
        onChange={setMarketingConsent}
        data-testid="marketing-consent"
      />
    </div>
  );
}
