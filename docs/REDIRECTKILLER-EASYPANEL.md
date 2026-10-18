# Redirect Killer — Easypanel environment

Independent admin dashboard at **`/redirectkiller`** and public ad links at **`/ads/{slug}`**.

## Required environment variables

| Variable | Required | Purpose | Example placeholder |
|----------|----------|---------|---------------------|
| `REDIRECTKILLER_ADMIN_PASSWORD` | **Yes** | Dashboard login password (server-side only) | `generate-a-long-random-password` |
| `REDIRECTKILLER_SESSION_SECRET` | **Yes** | HMAC secret for signed session cookies (min 16 chars) | `openssl rand -hex 32` |
| `REDIRECTKILLER_SESSION_MAX_AGE_SECONDS` | No | Cookie lifetime (900–1,209,600; default 86400) | `86400` |
| `REDIRECTKILLER_EXTRA_DESTINATIONS` | No | Extra allowed internal paths (comma-separated) | `/checkout/cod` |
| `REDIRECTKILLER_BUILTIN_REDIRECTS_JSON` | No | Default `/ads/{slug}` targets when no DB row (JSON object) | `{"hair-ads":"/products/hair-gummies"}` |

Built-in defaults (no env required) include `hair-ads` → `/products/hair-gummies`. Root URLs like **`/hair-ads`** redirect to **`/ads/hair-ads`** via `next.config.ts` (use **`https://www.velorabeauty.world`** in ads — see `docs/APEX-SSL-EASYPANEL.md`).

Also ensure existing **`DATABASE_PATH`** (default `/app/data/velora.sqlite`) points at your persisted volume so redirects survive restarts.

## Where to set them in Easypanel

1. Open your **Velora frontend** service (the Next.js app on port 3000).
2. Go to **Environment** / **Env** (same place as `STRIPE_SECRET_KEY`, `SITE_URL`, etc.).
3. Add the variables above as **runtime** secrets (not build-args unless you mirror them for local builds).
4. **Save** and **Deploy** / **Redeploy** the service so the new env is loaded.

Never commit real passwords to GitHub.

## Database

On first use, the app creates SQLite tables:

- `ad_redirects` — slug, destination path, enabled flag
- `redirectkiller_login_attempts` — login rate limiting

No manual migration script is required if `DATABASE_PATH` is writable (Easypanel volume on `/app/data`).

## Deploy workflow

1. Merge changes to **`main`**.
2. Wait for **GitHub Actions → Publish container** (if you deploy from GHCR), or let Easypanel build from Git.
3. Easypanel → **Deploy** / pull latest image.
4. Visit `https://www.velorabeauty.world/redirectkiller` and sign in.
5. Create a test slug and open `https://www.velorabeauty.world/ads/your-slug?utm_source=test`.

## Order attribution

When shoppers land on a product page (including via `/ads/…` redirects), the store records the **final product URL** and UTMs in session storage and sends them with orders / Google Sheets export when configured.
