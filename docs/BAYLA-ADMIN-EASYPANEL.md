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

Only these are editable in the UI (single **Your inputs** panel):

| Field | Purpose |
|-------|---------|
| Confirmation rate (%) | COD Network / call-center confirmation |
| Delivery rate (%) | Share of confirmed orders delivered |
| Snapchat CPA (USD / purchase) | Cost per purchase from Snap — **total ad spend = CPA × orders** in the date range; net profit & ROAS follow |

Saved in `bayla_profit_admin_state`.

**Break Event** (nav or above Costs & Fees): simulator with lead count, **card % / COD %**, same confirmation, delivery, and Snapchat CPA — shows max CPA and net profit per card vs COD channel (USD).

## Unit economics (server env — not on the page)

### Card (Stripe) only — never on COD orders

- Stripe fee: **5.4%** of card order amount + **$0.30** (per paid card order)
- Shipping: **$5.99**
- Product COGS: per SKU (see below)

| Variable | Default |
|----------|---------|
| `BAYLA_STRIPE_FEE_PERCENT` | `5.4` |
| `BAYLA_STRIPE_FEE_FIXED_USD` | `0.30` |
| `BAYLA_CARD_SHIPPING_USD` | `5.99` |
| `BAYLA_PRODUCT_COST_EYE_USD` | `3` (SKU **vitaminamin**) |
| `BAYLA_PRODUCT_COST_SKIN_USD` | `7.47` (SKU **WHITEAMIN**) |
| `BAYLA_PRODUCT_COST_HAIR_USD` | `6.1` |
| `BAYLA_AED_PER_USD` | `3.6725` |

### COD only — never on card orders

(N = total COD orders, conf / deliv = rates)

- `confirmed = N × conf`; `notConfirmed = N − confirmed`
- `delivered = confirmed × deliv`; `returned = confirmed − delivered`
- **Call center:** $0.50 / not confirmed · $1.00 / returned · $2.00 / delivered
- **Shipping:** $4.99 / returned · $5.99 / delivered
- **COD service fee:** 5% of delivered COD revenue (cash collected) — not Stripe
- **Product cost:** COGS × delivered count only (returns come back to stock)

| Variable | Default |
|----------|---------|
| `BAYLA_COD_CALL_NO_ANSWER_USD` | `0.50` |
| `BAYLA_COD_CALL_RETURNED_USD` | `1.00` |
| `BAYLA_COD_CALL_DELIVERED_USD` | `2.00` |
| `BAYLA_COD_SHIPPING_RETURNED_USD` | `4.99` |
| `BAYLA_COD_SHIPPING_DELIVERED_USD` | `5.99` |
| `BAYLA_COD_SERVICE_FEE_PERCENT` | `5` |
| `BAYLA_COD_SELLING_PRICE_USD` | `35` (fallback if no COD orders in range) |
| `BAYLA_COD_PRODUCT_COST_USD` | `12` (fallback avg COGS) |

Card revenue and COGS use **real paid orders** in the date range. COD **N** and average selling price/COGS use **real COD orders** when present.

`netTotalProfit = paymentProfit + codProfit − adSpendUsd`

### Ad performance metrics (computed)

| Metric | Formula |
|--------|---------|
| ROI % | `netProfit / (adSpend + fulfillment costs) × 100` |
| ROAS | `(card revenue + delivered COD revenue) / adSpend` |
| CPA (display) | Same as your CPA input (total spend ÷ orders) |
| Cost / delivered order | `adSpend / (paid orders + delivered COD orders)` |
| Break-even ROAS | `total revenue / gross profit before ad spend` |

Shown as `—` when the divisor is zero.
