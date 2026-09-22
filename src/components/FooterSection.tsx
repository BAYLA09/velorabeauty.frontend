import { brand } from "@/config/brand";
import { footer } from "@/config/content";
import { VeloraLogo } from "./ui/VeloraLogo";

export function FooterSection() {
  return (
    <footer id="contact" className="bg-velora-burgundy-dark px-4 pb-10 pt-14 text-velora-cream md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <VeloraLogo variant="footer" />
          <p className="mt-4 text-sm tracking-wide text-velora-champagne/90">{brand.nameEn}</p>
          <p className="mt-2 text-lg text-velora-cream/90">{brand.tagline}</p>
        </div>

        <nav className="mx-auto mt-10 max-w-md">
          <ul className="space-y-3">
            {footer.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center justify-between border-b border-white/10 py-3 text-sm text-velora-cream/85 transition hover:text-velora-champagne"
                >
                  {link.label}
                  <span aria-hidden>←</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {footer.socialPlaceholder && (
          <div className="mt-10 flex justify-center gap-3">
            {["إنستغرام", "تيك توك", "سناب", "يوتيوب"].map((label) => (
              <span
                key={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-white/20 text-[9px] text-velora-cream/50"
                title={label}
              >
                •
              </span>
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-velora-cream/45">
          © {new Date().getFullYear()} {brand.nameAr} · {brand.country}
        </p>
      </div>
    </footer>
  );
}
