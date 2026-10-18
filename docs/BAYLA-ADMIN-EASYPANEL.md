# Bayla profit admin — Easypanel

Private URL: **`/bayla-admin`** (not linked from the storefront).

## Required env

| Variable | Required | Example |
|----------|----------|---------|
| `BAYLA_ADMIN_PASSWORD` | Yes | long random password |
| `BAYLA_ADMIN_SESSION_SECRET` | Yes | `openssl rand -hex 32` |
| `BAYLA_ADMIN_SESSION_MAX_AGE_SECONDS` | No | `86400` |
| `DATABASE_PATH` | Yes (existing) | `/app/data/velora.sqlite` |

Configure in Easypanel → Velora frontend → **Environment** → Save → **Deploy**.

## Dashboard inputs (persisted in SQLite)

Only these are editable in the UI:

| Field | Purpose |
|-------|---------|
| Confirmation rate (%) | COD Network / call-center confirmation |
| Delivery rate (%) | Share of confirmed orders delivered |
| Ad spend (USD) | Snapchat (later Meta/TikTok) — subtracted from net profit |

Saved in `bayla_profit_admin_state`.

## Unit economics (server env — not on the page)

Defaults match the profit mockup; override in Easypanel without redeploying dashboard code:

| Variable | Default | Meaning |
|----------|---------|---------|
| `BAYLA_AED_PER_USD` | `3.6725` | AED peg for order totals → USD |
| `BAYLA_PAYMENT_FEE_PERCENT` | `4.9` | Card payment fees as % of revenue |
| `BAYLA_CARD_SHIPPING_USD` | `5.99` | Shipping cost per paid card order |
| `BAYLA_PAYMENT_OTHER_FEES_USD` | `0` | Fixed other fees on payment panel |
| `BAYLA_PRODUCT_COST_EYE_USD` | `3` | COGS — SKU **vitaminamin** (eye serum) |
| `BAYLA_PRODUCT_COST_SKIN_USD` | `7.47` | COGS — SKU **WHITEAMIN** (skin gummies) |
| `BAYLA_PRODUCT_COST_HAIR_USD` | `6.1` | COGS — hair gummies (legacy orders) |
| `BAYLA_COD_SHIPPING_USD` | `4.5` | COD shipping per delivered order |
| `BAYLA_COD_RETURN_COST_USD` | `3` | Return cost per confirmed-not-delivered order |
| `BAYLA_COD_FEE_PER_ORDER_USD` | `2.5` | COD Network fee per delivered order |
| `BAYLA_COD_OTHER_FEE_PER_ORDER_USD` | `1` | Other COD cost per placed order |
| `BAYLA_COD_SELLING_PRICE_USD` | `35` | Fallback avg selling price when no COD orders in range |
| `BAYLA_COD_PRODUCT_COST_USD` | `12` | Fallback avg product cost when no COD orders in range |
| `BAYLA_COD_PLATFORM_FEE_PERCENT` | `5` | Used only if `BAYLA_COD_FEE_PER_ORDER_USD` is `0` |
| `BAYLA_STRIPE_FEE_PERCENT` | `5.4` | Internal estimate (per-order chart) |
| `BAYLA_STRIPE_FEE_FIXED_USD` | `0.3` | Stripe fixed fee per card order |

Card revenue and COGS use **real paid orders** in the selected date range. COD order count and average selling price/COGS use **real COD orders** when present.

### COD profit formula

- `delivered = totalOrders × (confirmationRate/100) × (deliveryRate/100)`
- `failedAfterConfirm = totalOrders × (confirmationRate/100) − delivered`
- `profit = delivered×price − delivered×(product+shipping+COD fees) − failedAfterConfirm×returnCost − totalOrders×otherFeesPerOrder`
- `netTotalProfit = paymentProfit + codProfit − adSpendUsd`

### Ad performance metrics (computed)

| Metric | Formula |
|--------|---------|
| ROI % | `netProfit / (adSpend + fulfillment costs) × 100` |
| ROAS | `(card revenue + delivered COD revenue) / adSpend` |
| CPA | `adSpend / total orders` |
| Cost / delivered order | `adSpend / (paid orders + delivered COD orders)` |
| Break-even ROAS | `total revenue / gross profit before ad spend` |

Shown as `—` when the divisor is zero. Included in the dashboard API, Profit Summary UI, and CSV report header.
