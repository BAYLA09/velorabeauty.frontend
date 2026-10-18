import type { Metadata } from "next";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: `${brand.nameEn} — Beauty routines for the UAE`,
  description:
    "Velora Beauty offers thoughtful daily-care routines designed for modern life in the United Arab Emirates. Shop in AED with delivery across the UAE.",
  openGraph: {
    title: `${brand.nameEn} — UAE`,
    description:
      "Thoughtful beauty routines, card and cash-on-delivery options, and delivery within the UAE.",
    url: "https://www.velorabeauty.world/lp",
  },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" dir="ltr" className="font-sans">
      {children}
    </div>
  );
}
