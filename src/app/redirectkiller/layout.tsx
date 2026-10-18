import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redirect Killer | Velora Beauty",
  robots: { index: false, follow: false },
};

export default function RedirectKillerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" dir="ltr" className="font-sans">
      {children}
    </div>
  );
}
