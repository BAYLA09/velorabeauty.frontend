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

Open **http://localhost:3000** (not `https://0.0.0.0:3000` — browsers reject that host).  
Landing page: **http://localhost:3000/lp** · Redirect admin: **http://localhost:3000/redirectkiller**  
Details: [docs/LOCAL-DEV-REDIRECT-LP.md](docs/LOCAL-DEV-REDIRECT-LP.md)

## Docker / Easypanel (production)

**Easypanel: استعمل Docker Image فقط** — ماشي GitHub + `Dockerfile` (Deploy 1s = ما كيسحبش image جديد).

| Source | Setting |
|--------|---------|
| **Best** | App → **Docker Image** → `ghcr.io/bayla09/velorabeauty.frontend:latest` |
| Git + Dockerfile | Use **`Dockerfile.easypanel`** (pull prebuilt image — no VPS build) |
| Compose | `docker-compose.yml` or `deploy/easypanel-docker-image.compose.yaml` |

Deploy ma kaydozch? → [docs/EASYPANEL-DEPLOY-DARIJA.md](docs/EASYPANEL-DEPLOY-DARIJA.md)

```text
ghcr.io/bayla09/velorabeauty.frontend:latest
```

Port **3000** · volume **`/app/data`** · env **`deploy/easypanel.env.example`**

| دليل | متى |
|------|-----|
| [EASYPANEL-DEPLOY-1-SECONDE-AR.md](docs/EASYPANEL-DEPLOY-1-SECONDE-AR.md) | Deploy كيخلص f 1–2 ثانية |
| [EASYPANEL-AUTO-DEPLOY-AR.md](docs/EASYPANEL-AUTO-DEPLOY-AR.md) | ما تقدرش تضغط Deploy — webhook / SSH |
| [EASYPANEL-DEPLOY-NOW-AR.md](docs/EASYPANEL-DEPLOY-NOW-AR.md) | إعداد أول مرة |

Local build (dev only):

```bash
docker build -t velorabeauty-frontend .
docker run --rm -p 3000:3000 velorabeauty-frontend
```

**Stripe:** [docs/STRIPE-SETUP-AR.md](docs/STRIPE-SETUP-AR.md).

Open [http://localhost:3000](http://localhost:3000).

## Pricing (د.إ)

| Offer | Card | COD |
|-------|------|-----|
| 1 product | 199 | 219 |
| 2 products | 249 | 269 |
| 3 products | 339 | 359 |

COD includes **+20 د.إ** (configured in `src/config/pricing.ts`).

## Orders (SQLite)

Checkout saves orders with **`payment_method`** (`card` | `cod`) in SQLite:

| Env | Default |
|-----|---------|
| `DATABASE_PATH` | `./data/velora.sqlite` |

Dedicated checkout pages:

- `/checkout/card?product=…&quantity=1|2|3` — الدفع بالبطاقة (شحن مجاني)
- `/checkout/cod?product=…&quantity=1|2|3` — الدفع عند الاستلام (+20 د.إ)

API: `POST /api/orders`, `GET /api/orders/[id]`.
