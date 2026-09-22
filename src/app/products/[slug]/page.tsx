import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FooterSection } from "@/components/FooterSection";
import { Header } from "@/components/Header";
import { ProductAnnouncementBar } from "@/components/product/ProductAnnouncementBar";
import { ProductFaq } from "@/components/product/ProductFaq";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { productSlugs } from "@/config/productPages";
import { formatPrice, singleProductPrice } from "@/config/pricing";
import {
  getAllProductsWithPages,
  getProductBySlug,
} from "@/lib/productCatalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.page.seoTitle,
    description: product.page.seoDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const all = getAllProductsWithPages();

  return (
    <>
      <ProductAnnouncementBar />
      <Header />
      <main className="bg-velora-cream">
        <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-velora-burgundy/55 md:px-6">
          <Link href="/" className="hover:text-velora-burgundy">
            الرئيسية
          </Link>
          <span className="mx-2">/</span>
          <Link href="/#products" className="hover:text-velora-burgundy">
            المنتجات
          </Link>
          <span className="mx-2">/</span>
          <span className="text-velora-burgundy">{product.name}</span>
        </div>

        <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <ProductGallery
              mainSrc={product.image.src}
              productName={product.name}
              placeholders={product.page.galleryPlaceholders}
            />

            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div>
                <p className="text-xs font-semibold tracking-[0.25em] text-velora-champagne-dark">
                  VELORA BEAUTY · {product.number}
                </p>
                <h1 className="mt-3 text-3xl font-bold leading-snug text-velora-burgundy md:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-2 text-lg text-velora-champagne-dark">{product.ingredient}</p>
                <p className="mt-4 text-base leading-relaxed text-velora-burgundy/75">
                  {product.page.subhook}
                </p>
                <p className="mt-4 text-3xl font-bold text-velora-burgundy">
                  {formatPrice(singleProductPrice)}
                  <span className="mr-2 text-sm font-normal text-velora-burgundy/50">/ منتج</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.page.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-velora-burgundy/15 bg-white px-3 py-1 text-xs font-medium text-velora-burgundy"
                  >
                    {b}
                  </span>
                ))}
              </div>

              <ProductPurchasePanel productName={product.name} />
            </div>
          </div>
        </section>

        <section className="bg-velora-burgundy px-4 py-14 text-velora-cream md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold md:text-3xl">{product.page.hook}</h2>
            <p className="mt-4 leading-relaxed text-velora-cream/85">{product.description}</p>
          </div>
        </section>

        <section className="px-4 py-16 md:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-velora-burgundy">لماذا هذا المنتج؟</h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {product.page.benefits.map((b) => (
                <li
                  key={b.title}
                  className="rounded-3xl border border-velora-burgundy/8 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-velora-burgundy">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-velora-burgundy/70">{b.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-velora-cream-dark px-4 py-16 md:px-6">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-velora-burgundy">{product.page.ingredientTitle}</h2>
              <p className="mt-4 leading-relaxed text-velora-burgundy/75">{product.page.ingredientBody}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-velora-burgundy">{product.page.ritualTitle}</h2>
              <ol className="mt-4 space-y-3">
                {product.page.ritualSteps.map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-2xl border border-velora-burgundy/8 bg-white p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-velora-burgundy text-sm font-bold text-velora-cream">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-velora-burgundy/80">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-6">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-velora-burgundy/10 bg-white p-8">
            <h2 className="text-xl font-bold text-velora-burgundy">{product.page.insideTitle}</h2>
            <ul className="mt-4 space-y-2">
              {product.page.insideItems.map((item) => (
                <li key={item} className="flex items-center gap-2 text-velora-burgundy/75">
                  <span className="h-1.5 w-1.5 rounded-full bg-velora-champagne" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ProductFaq items={product.page.faq} title="أسئلة عن هذا المنتج" />
        <RelatedProducts currentSlug={product.slug} products={all} />
      </main>
      <FooterSection />
    </>
  );
}
