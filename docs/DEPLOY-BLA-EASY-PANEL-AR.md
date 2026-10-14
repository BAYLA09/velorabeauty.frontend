# Deploy bla ma tbeddel Easypanel (SSH men GitHub)

Ila **Deploy f Easypanel = 1 second** + smiya commit (#139), **Easypanel ma kaybeddelch container**.

Ma n9derch nصلّح Easypanel mn l-code. Jouj halat:

## A) (Zero Easypanel) — GitHub Secrets + SSH

1. GitHub → **Settings** → **Secrets** → **Actions** → New:
   - `VPS_HOST` — IP dyal serveur Easypanel
   - `VPS_USER` — `root` wla user SSH
   - `VPS_SSH_KEY` — private key PEM

2. Kol merge f `main` → **Publish container** → **Deploy VPS (SSH)** kaypull image w kayrecreate container.

3. **Ma t7tajch** tklik Deploy f Easypanel.

⚠️ Container kayt run b `docker run` — domain Easypanel khass yb9a mربوط b port 3000 (wla nginx).

## B) (1 click f Easypanel) — Beddel ghir **Source**

Ma khass **delete service** — **Settings → Source → Docker Image** + image `ghcr.io/bayla09/velorabeauty.frontend:latest`.

Hadhi hiya l-hal li 99% kayst3mloha.

---

**S7i7:** bla A w bla B, **code jdid f GitHub ma kaywslch l-site** — ghir image f GHCR kayt update.
