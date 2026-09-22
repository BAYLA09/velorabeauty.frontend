import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velora Beauty | UAE",
  description: "Velora Beauty — premium beauty, delivered across the UAE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
