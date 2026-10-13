"use client";

import {
  MARKETING_CONSENT_PRIMARY_LABEL,
  MARKETING_CONSENT_SECONDARY_LABEL,
} from "@/components/checkout/marketingConsentCopy";

export function MarketingConsentField({
  checked,
  onChange,
  "data-testid": dataTestId,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  "data-testid"?: string;
}) {
  return (
    <label
      data-testid={dataTestId}
      className="flex cursor-pointer items-start gap-3.5 rounded-lg border border-velora-champagne/50 bg-gradient-to-br from-velora-cream-dark/90 to-white px-3.5 py-3 shadow-sm ring-1 ring-velora-burgundy/10 transition hover:border-velora-champagne/70"
    >
      <input
        type="checkbox"
        name="marketingConsent"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 rounded border-velora-burgundy/30 accent-velora-burgundy"
      />
      <span className="text-sm leading-6 text-velora-burgundy-dark">
        <span className="block font-semibold text-neutral-900">
          {MARKETING_CONSENT_PRIMARY_LABEL}
        </span>
        <span className="mt-1 block text-xs leading-5 text-neutral-600">
          {MARKETING_CONSENT_SECONDARY_LABEL}
        </span>
      </span>
    </label>
  );
}
