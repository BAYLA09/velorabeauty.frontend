# Apex SSL (`velorabeauty.world`) — Easypanel

## Symptom

Chrome: **NET::ERR_CERT_AUTHORITY_INVALID** on `https://velorabeauty.world/…`  
`curl` to apex: `SSL certificate problem: self-signed certificate`  
`https://www.velorabeauty.world` uses a valid public certificate.

## Cause (observed)

The app middleware redirects apex → www (308), but the **TLS termination on the apex hostname** is serving a **self-signed** cert (not Let’s Encrypt). Browsers block before the redirect runs.

This is **hosting / reverse-proxy / certificate binding**, not Next.js application code.

## What you should do (Easypanel — requires your login)

1. Open the **Velora** service in Easypanel.
2. **Domains**: ensure both hostnames are attached:
   - `www.velorabeauty.world`
   - `velorabeauty.world`
3. **SSL / Let’s Encrypt**: issue or renew a certificate that includes **both** names (SAN), or use Easypanel’s “Generate certificate” for each domain on the same proxy.
4. Remove any **custom self-signed** cert bound only to apex.
5. Wait 1–2 minutes, then verify:
   - `curl -vI https://velorabeauty.world/` shows issuer **Let’s Encrypt** (or your CA), not self-signed.
   - Browser opens `https://velorabeauty.world/hair-ads` and redirects to `www` without cert errors.

## Until fixed

Use **`https://www.velorabeauty.world`** in all ad links, Snap URLs, and Redirect Killer destinations.

DNS must still point apex and www to the same Easypanel IP (A/AAAA records) — we do **not** change DNS from this repo.
