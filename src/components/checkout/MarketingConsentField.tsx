"use client";

export function MarketingConsentField({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-md border border-[#ece7df] bg-[#faf8f5] px-3 py-3 text-sm leading-6 text-neutral-800">
      <input
        type="checkbox"
        name="marketingConsent"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-neutral-900"
      />
      <span>
        أوافق على تلقّي رسائل وعروض تسويقية من فيلورا للجمال عبر البريد الإلكتروني، ويمكنني
        إلغاء الاشتراك في أي وقت.
        <span className="mt-1 block text-xs leading-5 text-neutral-500">
          اختياري — لا يؤثّر على إتمام الشراء.
        </span>
      </span>
    </label>
  );
}
