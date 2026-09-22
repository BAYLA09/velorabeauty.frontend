import type { Metadata } from "next";
import { El_Messiri, Noto_Naskh_Arabic } from "next/font/google";
import { brand } from "@/config/brand";
import "./globals.css";

const display = El_Messiri({
  subsets: ["arabic"],
  variable: "--font-el-messiri",
  weight: ["400", "500", "600", "700"],
});

const body = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-naskh",
  weight: ["400", "500", "600", "700"],
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
    <html lang="ar" dir="rtl" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
