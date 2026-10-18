# Snapchat Pixel — verification (Velora Beauty)

## Pixel ID (do not change without Ads Manager)

Canonical ID is defined in `src/config/snapPixel.ts` (`VELORA_SNAP_PIXEL_ID`) and baked into production Docker images via GitHub Actions (`NEXT_PUBLIC_SNAP_PIXEL_ID`). Health check: `GET /api/health` → `snapPixel.canonicalId` prefix `628f12d8`.

## What is already tracked

| Store event | Snap event | Where |
|-------------|------------|--------|
| Page load | PAGE_VIEW | `SnapPixelRoot` in root layout |
| PDP view | VIEW_CONTENT | catalog slugs only (`hair-gummies`, `skin-gummies`, `eye-serum`) |
| Add to cart | ADD_CART | same slugs |
| Checkout start | START_CHECKOUT | checkout flows |
| Billing step | ADD_BILLING | Stripe / COD paths |
| Paid order | PURCHASE | gated once per order (`trackPurchaseOnce`) |

Legacy pixel `fc3323cd-…` is blocked in code.

## Test before launching ads

1. In **Snap Ads Manager** → your Pixel → **Test Events**.
2. Open the store with test params, e.g.  
   `https://www.velorabeauty.world/products/hair-gummies?ScTestModeId=<your-test-id>`  
   (see `src/lib/analytics/snapTestMode.ts` for `ScTestModeId` / `ScCid` behavior.)
3. Browse → add to cart → start checkout. Confirm events in Test Events (not duplicate PURCHASE on refresh).
4. For a small live test, use the documented Stripe test checkout URL from `/api/health` → `payments.stripeLiveTestShortcut` (only if enabled in production env).

## URLs for ads

Use **`https://www.velorabeauty.world`** (valid TLS). Apex `https://velorabeauty.world` currently presents a **self-signed** certificate in front of the app; see `docs/APEX-SSL-EASYPANEL.md`.

Ad landing redirects:

- Canonical: `/ads/{slug}` (Redirect Killer + SQLite overrides)
- Short root URLs (after deploy): `/hair-ads` → `/ads/hair-ads` → default PDP `/products/hair-gummies`
