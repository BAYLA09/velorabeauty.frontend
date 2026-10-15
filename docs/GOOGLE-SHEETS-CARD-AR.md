# Sheet — orders payées par carte (Stripe)

Même format que COD (**17 colonnes**, une ligne par produit). Export **seulement** quand `status = paid` (webhook Stripe ou confirm checkout).

---

## 1) Google Sheet — nouvel onglet

1. Ouvre  
   `https://docs.google.com/spreadsheets/d/1nasdcXYD5ihxj5QnGMWQ05ug3VqoVfgP8R9ojBnsjXQ`
2. **+** en bas → nouvel onglet (ex. `Card paid`)
3. **Ligne 1** (copie exacte de l’onglet COD) :

```text
OrderDate	country	name	phone	address	url	sku	Product	quantity	price	currency	notes	utm_source	utm_medium	utm_campaign	utm_content	utm_term
```

4. Ouvre l’onglet → URL contient `#gid=XXXXXXXX` → note **`CARD_SHEET_GID`**

---

## 2) Apps Script (même projet que COD)

1. Colle le code à jour : `scripts/google-sheets/VeloraOrdersWebhook.gs`
2. **Script properties** — ajoute / vérifie :

| Property | Exemple |
|----------|---------|
| `WEBHOOK_SECRET` | `VeloraCOD-2026-X7mP9qL2-K8vR` |
| `SPREADSHEET_ID` | `1nasdcXYD5ihxj5QnGMWQ05ug3VqoVfgP8R9ojBnsjXQ` |
| `SHEET_GID` | `469291840` (COD) |
| `CARD_SHEET_GID` | **gid du nouvel onglet** |

3. **Deploy** → **Manage deployments** → **Edit** (ou New) → Web app → **Anyone** → même URL `/exec` qu’avant.

Colonne `notes` contient : `payment=card`, `status=paid`, `stripe=pi_…`

---

## 3) Easypanel

Minimum (même URL que COD) :

```env
ORDERS_SHEETS_COD_WEBHOOK_URL=https://script.google.com/macros/s/…/exec
ORDERS_SHEETS_WEBHOOK_SECRET=VeloraCOD-2026-X7mP9qL2-K8vR
```

Optionnel (explicit) :

```env
ORDERS_SHEETS_CARD_WEBHOOK_URL=https://script.google.com/macros/s/…/exec
```

Si tu utilises **Service Account API** au lieu d’Apps Script :

```env
ORDERS_SHEETS_CARD_SHEET_GID=<gid onglet card>
```

---

## 4) Test

Après deploy frontend + image :

```bash
curl -sS -X POST 'https://www.velorabeauty.world/api/orders/sheets/reconcile' \
  -H 'Content-Type: application/json' \
  -d '{"secret":"YOUR_SECRET","channel":"card","limit":20}'
```

Navigateur :

```text
https://www.velorabeauty.world/api/orders/sheets/reconcile?secret=SECRET&channel=card&run=1
```

Nouvelle commande carte payée → export auto (Stripe webhook).
