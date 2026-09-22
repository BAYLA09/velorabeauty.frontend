import type { Metadata } from "next";
import { El_Messiri, Tajawal } from "next/font/google";
import { brand } from "@/config/brand";
import "./globals.css";

const display = El_Messiri({
  subsets: ["arabic"],
  variable: "--font-el-messiri",
  weight: ["400", "500", "600", "700"],
});

const sansArabic = Tajawal({
  subsets: ["arabic"],
  variable: "--font-tajawal",
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: `${brand.nameEn} | ${brand.nameAr}`,
  description: brand.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${display.variable} ${sansArabic.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
