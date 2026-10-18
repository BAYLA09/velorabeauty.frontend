# Local dev — `/lp`, `/redirectkiller`, `/ads`

## Do not open `https://0.0.0.0:3000`

`0.0.0.0` is only a **server bind address** (Docker/Easypanel). Browsers show **`ERR_ADDRESS_INVALID`** if you use it in the address bar. Local dev also uses **HTTP**, not HTTPS.

## Start the app

```bash
npm install
export DATABASE_PATH=/tmp/velora-dev.sqlite
export REDIRECTKILLER_ADMIN_PASSWORD=dev
export REDIRECTKILLER_SESSION_SECRET=$(openssl rand -hex 16)
export SITE_URL=http://localhost:3000
npm run dev
```

Default dev server: **`127.0.0.1:3000`** (see `package.json` `dev` script).

## URLs to open locally

| Page | URL |
|------|-----|
| Landing | **http://localhost:3000/lp** |
| Redirect admin | **http://localhost:3000/redirectkiller** |
| Health | **http://localhost:3000/api/health** |

(`http://127.0.0.1:3000/lp` works the same.)

## Test an ad redirect

1. Sign in at `/redirectkiller`.
2. Create slug `lp-test` → destination **Brand landing (EN) — `/lp`**.
3. Open: **http://localhost:3000/ads/lp-test?utm_source=facebook**
4. Expect **302** to **http://localhost:3000/lp?utm_source=facebook**

Quick check:

```bash
curl -sI "http://localhost:3000/ads/lp-test?utm_source=facebook" | grep -i location
```

## Production

After merge/deploy, use **https://www.velorabeauty.world/...** — verify with `/api/health` version and a manual redirect test; do not use `0.0.0.0` on production either.
