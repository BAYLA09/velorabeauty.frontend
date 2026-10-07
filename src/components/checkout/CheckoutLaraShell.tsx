import Link from "next/link";
import type { ReactNode } from "react";
import { VeloraLogo } from "@/components/ui/VeloraLogo";

function IconShieldCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconArrowBack({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

type Props = {
  title: string;
  subtitle?: string;
  backHref: string;
  children: ReactNode;
};

export function CheckoutLaraShell({ title, subtitle, backHref, children }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-200/60 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link
            href={backHref}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="رجوع"
          >
            <IconArrowBack className="h-5 w-5" />
          </Link>
          <Link href="/" className="shrink-0">
            <VeloraLogo layout="row" />
          </Link>
          <div className="hidden flex-1 lg:block" />
          <div className="hidden max-w-[200px] items-center gap-2 text-end sm:flex">
            <IconShieldCheck className="h-4 w-4 shrink-0 text-[#134E3A]" aria-hidden />
            <p className="text-[10px] font-bold leading-tight text-neutral-500">
              دفع آمن 100%
              <span className="block font-normal">بياناتك محمية دائماً</span>
            </p>
          </div>
          <div className="w-10 sm:hidden" aria-hidden />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-extrabold text-neutral-900 sm:text-[1.75rem]">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
