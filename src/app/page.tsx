import { BundleSection } from "@/components/BundleSection";
import { CheckoutSection } from "@/components/CheckoutSection";
import { FaqSection } from "@/components/FaqSection";
import { FinalCtaSection } from "@/components/FinalCtaSection";
import { FooterSection } from "@/components/FooterSection";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HowToOrderSection } from "@/components/HowToOrderSection";
import { ProductIntroSection } from "@/components/ProductIntroSection";
import { ProductShowcaseSection } from "@/components/ProductShowcaseSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TrustStripSection } from "@/components/TrustStripSection";
import { WhyVeloraSection } from "@/components/WhyVeloraSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProductIntroSection />
        <ProductShowcaseSection />
        <BundleSection />
        <WhyVeloraSection />
        <TestimonialsSection />
        <HowToOrderSection />
        <TrustStripSection />
        <CheckoutSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <FooterSection />
    </>
  );
}
