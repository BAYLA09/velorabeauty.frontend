import type { Metadata } from "next";
import { El_Messiri, Tajawal } from "next/font/google";
import { Suspense } from "react";
import { SnapPixelRoot } from "@/components/analytics/SnapPixelRoot";
import { SnapTestModePersist } from "@/components/analytics/SnapTestModePersist";
import { snapPixelBootstrapScriptForApp } from "@/lib/analytics/snapBootstrap";
import { buildSnapTestModeCaptureScript } from "@/lib/analytics/snapTestMode";
import { CartRoot } from "@/components/cart/CartRoot";
import { FloatingWhatsAppButton } from "@/components/support/FloatingWhatsAppButton";
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
  const snapBootstrap = snapPixelBootstrapScriptForApp();
  const snapTestCapture = buildSnapTestModeCaptureScript();
  return (
    <html lang="ar" dir="rtl" className={`${display.variable} ${sansArabic.variable}`}>
      <head>
        <link rel="preconnect" href="https://js.stripe.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.stripe.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="preconnect" href="https://sc-static.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tr.snapchat.com" crossOrigin="anonymous" />
        {snapTestCapture ? (
          <script dangerouslySetInnerHTML={{ __html: snapTestCapture }} />
        ) : null}
        {snapBootstrap ? (
          <script dangerouslySetInnerHTML={{ __html: snapBootstrap }} />
        ) : null}
      </head>
      <body className="antialiased">
        <Suspense fallback={null}>
          <SnapTestModePersist />
        </Suspense>
        <SnapPixelRoot />
        <CartRoot>
          {children}
          <FloatingWhatsAppButton />
        </CartRoot>
      </body>
    </html>
  );
}
