"use client";

import { CheckoutFormSection } from "@/components/checkout/CheckoutFormSection";
import {
  checkoutFieldLabelClass,
  checkoutInputClass,
} from "@/components/checkout/checkoutFieldStyles";
import { CheckoutEmailMarketingFields } from "@/components/checkout/CheckoutEmailMarketingFields";
import { checkoutEmirates } from "@/config/productCheckout";
import { uaePhoneHint } from "@/lib/phone/uaePhone";

export type DeliveryFormState = {
  email: string;
  name: string;
  phone: string;
  emirate: string;
  address: string;
  building: string;
  marketingConsent: boolean;
};

export function CheckoutDeliveryFields(props: {
  email: string;
  setEmail: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  emirate: string;
  setEmirate: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  building: string;
  setBuilding: (v: string) => void;
  marketingConsent: boolean;
  setMarketingConsent: (v: boolean) => void;
  onEmailBlur?: () => void;
  /** Card checkout renders email + consent above the payment block. */
  hideEmailMarketing?: boolean;
}) {
  const {
    email,
    setEmail,
    name,
    setName,
    phone,
    setPhone,
    emirate,
    setEmirate,
    address,
    setAddress,
    building,
    setBuilding,
    marketingConsent,
    setMarketingConsent,
    onEmailBlur,
    hideEmailMarketing = false,
  } = props;

  return (
    <>
      <CheckoutFormSection
        title="معلومات التواصل"
        subtitle="لإرسال تأكيد الطلب وتحديثات التوصيل"
      >
        {!hideEmailMarketing ? (
          <CheckoutEmailMarketingFields
            email={email}
            setEmail={setEmail}
            marketingConsent={marketingConsent}
            setMarketingConsent={setMarketingConsent}
            onEmailBlur={onEmailBlur}
          />
        ) : null}
        <div>
          <label htmlFor="name" className={checkoutFieldLabelClass}>
            الاسم الكامل
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="مثال: نورة العتيبي"
            className={checkoutInputClass}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="phone" className={checkoutFieldLabelClass}>
            رقم الهاتف
          </label>
          <input
            id="phone"
            required
            type="tel"
            dir="ltr"
            value={phone}
            onChange={(ev) => setPhone(ev.target.value)}
            placeholder="0501234567 أو +971501234567"
            className={checkoutInputClass}
            autoComplete="tel"
            inputMode="tel"
            maxLength={14}
            aria-describedby="delivery-phone-hint"
          />
          <p id="delivery-phone-hint" className="mt-1.5 text-[11px] text-neutral-500">
            {uaePhoneHint}
          </p>
        </div>
      </CheckoutFormSection>

      <CheckoutFormSection title="عنوان التوصيل">
        <div>
          <label htmlFor="area" className={checkoutFieldLabelClass}>
            المنطقة
          </label>
          <select
            id="area"
            required
            value={emirate}
            onChange={(ev) => setEmirate(ev.target.value)}
            className={checkoutInputClass}
          >
            <option value="">اختاري الإمارة</option>
            {checkoutEmirates.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="address" className={checkoutFieldLabelClass}>
            العنوان / تفاصيل التوصيل
          </label>
          <input
            id="address"
            required
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
            placeholder="مثال: دبي مارينا، برج …"
            className={checkoutInputClass}
            autoComplete="street-address"
          />
        </div>
        <div>
          <label htmlFor="building" className={checkoutFieldLabelClass}>
            رقم المبنى / الشقة{" "}
            <span className="font-normal text-neutral-400">(اختياري)</span>
          </label>
          <input
            id="building"
            value={building}
            onChange={(ev) => setBuilding(ev.target.value)}
            placeholder="مثال: برج 5، شقة 1204"
            className={checkoutInputClass}
          />
        </div>
      </CheckoutFormSection>
    </>
  );
}
