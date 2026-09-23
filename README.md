# Velora Beauty — Frontend (UAE)

Premium Arabic RTL homepage for **VELORA BEAUTY** / **فيلورا بيوتي**.

## Config (single source of truth)

| Area | Path |
|------|------|
| Brand & logo path | `src/config/brand.ts` |
| Products & bundle | `src/config/products.ts` |
| Pricing (AED / COD +20) | `src/config/pricing.ts` |
| Copy, FAQ, nav, footer | `src/config/content.ts` |
| **Reviews (homepage + PDP)** | `src/config/testimonials.ts` — `published: true` فقط |
| Image paths | `src/config/images.ts` |

Replace assets on GitHub without changing components:

- `/public/images/brand/logo-mark.png` → شعار V (شفاف) + النص فـ `src/config/brand.ts`
- `/public/images/hero/0d992921-89dc-4309-bfeb-4feb78ba2834.png` — صورة الحملة (أو حدّث `src` فـ `images.ts`)
- `/public/images/hero/hero-background.webp` — خلفية الـ hero (ديكور بلا نص)
- `/public/images/products/hair-gummies.png`, … — **الصفحة الرئيسية**
- `/public/images/products/pdp/*.webp` — **صفحات المنتج** (من `images.productPage` فـ `images.ts`)
- `/public/images/testimonials/customer-01.webp`, `customer-02.webp`

Until files exist, the UI shows premium Arabic placeholders.

## Develop

```bash
npm install
npm run dev
```

## Docker (Easypanel)

Build and run locally:

```bash
docker build -t velorabeauty-frontend .
docker run --rm -p 3000:3000 velorabeauty-frontend
```

Easypanel (اختر واحد):

1. **GitHub + Dockerfile** — branch **`main`**, port **3000**.
2. **Docker Registry (GHCR)** — إلا Git فـ Easypanel كيعطي `Git key not found`:  
   `ghcr.io/bayla09/velorabeauty.frontend:latest` (يبنى تلقائياً من Actions على `main`).

**Deploy ma kaymchich?** → **[docs/EASYPANEL-SETUP-AR.md](docs/EASYPANEL-SETUP-AR.md)** (Docker Image بلا Git).  
Also: [docs/EASYPANEL-DEPLOY.md](docs/EASYPANEL-DEPLOY.md).

Open [http://localhost:3000](http://localhost:3000).

## Pricing (د.إ)

| Offer | Card | COD |
|-------|------|-----|
| 1 product | 199 | 219 |
| 2 products | 249 | 269 |
| 3 products | 339 | 359 |

COD includes **+20 د.إ** (configured in `src/config/pricing.ts`).
