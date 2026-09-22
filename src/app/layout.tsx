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
  applicationName: brand.nameEn,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#5c2a32" },
    { media: "(prefers-color-scheme: dark)", color: "#3a1820" },
  ],
  appleWebApp: {
    capable: true,
    title: "Velora",
    statusBarStyle: "black-translucent",
  },
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
