import { FooterSection } from "@/components/FooterSection";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";

export function OrderChrome({
  children,
  tone = "cream",
}: {
  children: React.ReactNode;
  tone?: "cream" | "warm";
}) {
  return (
    <>
      <ProductStoreHeader />
      <main className={tone === "warm" ? "min-h-[80vh] bg-[#f6efe6]" : "min-h-[80vh] bg-velora-cream"}>
        {children}
      </main>
      <FooterSection />
    </>
  );
}
