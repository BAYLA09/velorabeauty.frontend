import type { Metadata } from "next";
import { WarmTeeProductPageClient } from "@/components/product/WarmTeeProductPageClient";
import { WARM_TEE_IMAGE_SRC, warmTeePageConfig } from "@/config/warmTeeProduct";

export const metadata: Metadata = {
  title: warmTeePageConfig.seoTitle,
  description: warmTeePageConfig.seoDescription,
  robots: { index: false, follow: false },
};

export default function WarmTeeProductPage() {
  return (
    <>
      <link rel="preload" as="image" href={WARM_TEE_IMAGE_SRC} fetchPriority="high" />
      <WarmTeeProductPageClient />
    </>
  );
}
