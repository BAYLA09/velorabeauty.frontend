import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SnapAdLandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="ar" dir="rtl" className="font-sans">
      {children}
    </div>
  );
}
