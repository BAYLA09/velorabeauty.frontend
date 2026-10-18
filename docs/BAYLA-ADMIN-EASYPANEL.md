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

## Default fees (editable in UI)

- Payment panel fee line: **4.9% of card revenue** (editable); shipping defaults $5.99 / paid order
- COD: per-order shipping, COD fee, return cost on failed deliveries; confirmation × delivery rates
- Product COGS (USD): eye serum (SKU **vitaminamin**) $3, skin gummies (**WHITEAMIN**) $7.47
- **Ad spend** (Snapchat, etc.): editable; subtracted from net total profit
- AED → USD: peg **3.6725** (editable)

### COD profit formula

- `delivered = totalOrders × (confirmationRate/100) × (deliveryRate/100)`
- `failedAfterConfirm = totalOrders × (confirmationRate/100) − delivered`
- `profit = delivered×price − delivered×(product+shipping+COD fees) − failedAfterConfirm×returnCost − totalOrders×otherFeesPerOrder`

Saved inputs persist in SQLite (`bayla_profit_admin_state`).
