# Stripe — Velora (Checkout + Easypanel)

## متغيرات Easypanel (Environment)

| Variable | Required | Notes |
|----------|----------|--------|
| `STRIPE_SECRET_KEY` | ✅ | `sk_live_...` أو `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | ✅ | `whsec_...` من Stripe Dashboard |
| `CARD_PAYMENT_ENABLED` | ✅ | `true` (Easypanel — **بدون rebuild**) |
| `NEXT_PUBLIC_CARD_PAYMENT_ENABLED` | بديل | فقط إلا كتبني image من جديد |
| `STRIPE_PUBLISHABLE_KEY` | ✅ | `pk_live_...` — حقول البطاقة (Payment Element) ما غاديش تبان بدونو |
| `SITE_URL` | ✅ | `https://www.velorabeauty.world` (بدون `/` أخير) |
| `DATABASE_PATH` | ✅ | `/app/data/velora.sqlite` |

بعد التعديل: **Redeploy** الخدمة.

## Webhook Stripe

1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks) → **Add endpoint**
2. URL:

   ```text
   https://www.velorabeauty.world/api/stripe/webhook
   ```

3. Events: **`payment_intent.succeeded`** (و **`checkout.session.completed`** إذا بقيت redirect قديم)
4. انسخ **Signing secret** → `STRIPE_WEBHOOK_SECRET` f Easypanel

> حتى بدون webhook، بعد الدفع كيتأكد الطلب عبر `/api/checkout/stripe/confirm` فـ صفحة الشكر — webhook أفضل للإنتاج.

## Flow

1. العميل `/checkout/card` → يملأ العنوان + **Stripe Payment Element** (رقم البطاقة، CVC، …)
2. السيرفر ينشئ طلب + **PaymentIntent**
3. تأكيد الدفع داخل الصفحة (أو redirect قصير لـ 3DS)
4. Success → `/order/thank-you?id=...` → status **`paid`**

## أمان

- **لا تضع المفاتيح في GitHub.** Easypanel env فقط.
- إذا تسرّب `sk_live_` → **Roll keys** f Stripe فوراً.
