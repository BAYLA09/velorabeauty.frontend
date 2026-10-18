import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bayla Ecom — Profit Admin",
  robots: { index: false, follow: false },
};

export default function BaylaAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" dir="ltr" className="font-sans">
      {children}
    </div>
  );
}
