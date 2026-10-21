# COD Network → Velora (webhook status sync)

COD Network’s call center imports leads from your **existing Google Sheets** — do **not** change Sheet layout or add columns. Order statuses flow from COD Network into SQLite via webhooks (one-way). **Outbound** order export to Google Sheets is unchanged.

Official docs: [Getting started](https://developer.cod.network/v2/api-introduction-getting-started) · [Advanced / webhooks](https://developer.cod.network/v2/api-introduction-advanced)

## 1) Seller dashboard — webhook URLs

In **seller.cod.network** → webhooks (or API settings), configure:

| Webhook | URL | Version |
|---------|-----|---------|
| **Webhook lead status** | `https://www.velorabeauty.world/api/cod-network/webhook/lead` | **V2** (preferred) |
| **Webhook order status** | `https://www.velorabeauty.world/api/cod-network/webhook/order` | **V2** (preferred) |

Every request must include header:

```http
seller-secret-key: <your webhook secret>
```

Use the same value as Easypanel `COD_NETWORK_WEBHOOK_SECRET`.

## 2) Easypanel environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `COD_NETWORK_WEBHOOK_SECRET` | **Yes** | Must match COD Network webhook secret (`seller-secret-key` header) |
| `COD_NETWORK_STATUS_CUTOFF_ISO` | No | Only update orders created **on or after** this UTC time (aliases: `ORDERS_STATUS_CUTOFF_ISO`, `ORDERS_SHEETS_SYNC_CUTOFF_ISO`) |
| `COD_NETWORK_MATCH_WINDOW_HOURS` | No | Phone + time matching window (default `72`) |
| `COD_NETWORK_LEAD_STATUS_MAP_JSON` | No | Override lead label → internal status JSON map |
| `COD_NETWORK_ORDER_STATUS_MAP_JSON` | No | Override order label → internal status JSON map |
| `COD_NETWORK_API_TOKEN` | No | Seller API bearer token for **Refresh from COD Network** and outbound lead push |
| `COD_NETWORK_API_BASE` | No | Default `https://api.cod.network` |
| `COD_NETWORK_PUSH_ENABLED` | No | When `true`, new storefront COD orders are POSTed to `/v2/seller/leads` after Google Sheets export |
| `COD_NETWORK_SKU_MAP_JSON` | No | JSON slug→SKU overrides (defaults: `hair-gummies`→`HAIRAMIN`, `eye-serum`→`vitaminamin`, `skin-gummies`→`WHITEAMIN`) |

## 3) Status mapping (default)

**Leads:** No reply / Call later / Wrong / Expired → `no_answer`; Confirmed → `confirmed`; Cancelled / Cancelled price / Black listed → `cancelled`.

**Orders:** Assigned / Shipped / Processing → `shipped`; Delivered → `delivered`; Return / Return on process → `returned`; Cancel → `cancelled`.

Internal detail is stored in `orders.cod_network_status_detail`.

## 4) Matching webhooks to SQLite orders

1. `cod_network_lead_id` / `cod_network_order_ref` if already linked  
2. `orderId=…` inside lead **inputs** (if your form included it)  
3. Normalized UAE phone + closest `created_at` within the match window  

## 5) Bayla admin

- **COD Network status** indicator (last webhook time) in the header  
- Optional **Refresh from COD Network** when `COD_NETWORK_API_TOKEN` is set  
- COD profit uses real statuses; confirmation/delivery % apply only to **pending** orders  

## 6) Disabled features

- `POST /api/bayla-admin/sheets/sync` returns **410** (Sheet inbound sync removed)  
- Google Sheets **export** on new orders is unchanged  
