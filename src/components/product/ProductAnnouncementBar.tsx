import { IconTruck } from "@/components/product/ProductFunnelIcons";

export function ProductAnnouncementBar() {
  return (
    <div className="bg-velora-burgundy text-velora-cream">
      <div className="mx-auto flex min-h-9 max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-extrabold sm:text-sm">
        <IconTruck className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
        <span>الدفع عند الاستلام • شحن سريع لجميع مناطق الإمارات</span>
      </div>
    </div>
  );
}
