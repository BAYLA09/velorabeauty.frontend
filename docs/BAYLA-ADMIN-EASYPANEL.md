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

- Stripe: 5.4% + $0.30 / card order, shipping $5.99
- COD: 5% platform fee; call center $0.50 / $1 / $2; ship $5.99 delivered, $4.99 return
- Product COGS: eye serum $3, skin gummies $7.47, hair gummies $6.10

Saved inputs persist in SQLite (`bayla_profit_admin_state`).
