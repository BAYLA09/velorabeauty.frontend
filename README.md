# Velora Beauty — Frontend (UAE)

Premium Arabic RTL homepage for **VELORA BEAUTY** / **فيلورا بيوتي**.

## Config (single source of truth)

| Area | Path |
|------|------|
| Brand & logo path | `src/config/brand.ts` |
| Products & bundle | `src/config/products.ts` |
| Pricing (AED / COD +20) | `src/config/pricing.ts` |
| Copy, FAQ, nav, footer | `src/config/content.ts` |
| Image paths | `src/config/images.ts` |

Replace assets on GitHub without changing components:

- `/public/images/brand/logo.svg` → your logo (same path or update `brand.ts`)
- `/public/images/hero/hero-main.webp`
- `/public/images/products/hair.webp`, `skin.webp`, `eye.webp`, `bundle.webp`
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

Easypanel expects `Dockerfile` at the repository root. The app listens on port **3000**.

Open [http://localhost:3000](http://localhost:3000).

## Pricing (د.إ)

| Offer | Card | COD |
|-------|------|-----|
| 1 product | 199 | 219 |
| 2 products | 249 | 269 |
| 3 products | 339 | 359 |

COD includes **+20 د.إ** (configured in `src/config/pricing.ts`).
