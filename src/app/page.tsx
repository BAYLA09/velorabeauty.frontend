import { CheckoutSection } from "@/components/CheckoutSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50/80 via-[#faf8f6] to-white">
      <header className="border-b border-stone-200/80 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <span className="text-xl font-semibold tracking-wide text-stone-900">
            VELORA
            <span className="font-light text-rose-500"> BEAUTY</span>
          </span>
          <a
            href="#checkout"
            className="rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-white hover:bg-rose-600"
          >
            اطلب الآن
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold leading-tight text-stone-900 sm:text-5xl">
          جمال يستحق الثقة
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-stone-600">
          Beauty crafted for the UAE — transparent pricing, card or cash on delivery.
        </p>
      </section>

      <CheckoutSection />

      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500">
        © {new Date().getFullYear()} Velora Beauty · United Arab Emirates
      </footer>
    </main>
  );
}
