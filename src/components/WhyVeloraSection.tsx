import { whyVelora } from "@/config/content";

function Icon({ type }: { type: (typeof whyVelora.items)[number]["icon"] }) {
  const common = "h-7 w-7 text-velora-burgundy";
  switch (type) {
    case "diamond":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M12 3 20 9 12 21 4 9z" />
        </svg>
      );
    case "routine":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.3">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M12 2v4M12 18v4M4 12H2M22 12h-2M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
        </svg>
      );
    case "delivery":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M3 7h11v8H3z" />
          <path d="M14 10h4l3 3v2h-7" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="18" cy="17" r="2" />
        </svg>
      );
  }
}

export function WhyVeloraSection() {
  return (
    <section id="why" className="bg-velora-cream px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-velora-burgundy md:text-4xl">
          {whyVelora.title}
        </h2>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyVelora.items.map((item) => (
            <li
              key={item.title}
              className="rounded-3xl border border-velora-burgundy/8 bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-velora-champagne/20">
                <Icon type={item.icon} />
              </div>
              <p className="mt-4 text-base font-semibold leading-relaxed text-velora-burgundy">
                {item.title}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
