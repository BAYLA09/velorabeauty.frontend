# Stripe — Velora (Checkout + Easypanel)

## متغيرات Easypanel (Environment)

| Variable | Required | Notes |
|----------|----------|--------|
| `STRIPE_SECRET_KEY` | ✅ | `sk_live_...` أو `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | ✅ | `whsec_...` من Stripe Dashboard |
| `NEXT_PUBLIC_CARD_PAYMENT_ENABLED` | ✅ | `true` لتفعيل الدفع |
| `STRIPE_PUBLISHABLE_KEY` أو `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | اختياري | للـ Checkout Redirect ما محتاجش على العميل |
| `SITE_URL` | ✅ | `https://www.velorabeauty.world` (بدون `/` أخير) |
| `DATABASE_PATH` | ✅ | `/app/data/velora.sqlite` |

بعد التعديل: **Redeploy** الخدمة.

## Webhook Stripe

1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks) → **Add endpoint**
2. URL:

   ```text
   https://www.velorabeauty.world/api/stripe/webhook
   ```

3. Events: **`checkout.session.completed`**
4. انسخ **Signing secret** → `STRIPE_WEBHOOK_SECRET` f Easypanel

> حتى بدون webhook، بعد الدفع كيتأكد الطلب عبر `/api/checkout/stripe/confirm` فـ صفحة الشكر — webhook أفضل للإنتاج.

## Flow

1. العميل `/checkout/card` → يملأ العنوان → **الدفع بالبطاقة**
2. السيرفر ينشئ طلب `awaiting_payment` + **Stripe Checkout Session**
3. Redirect إلى Stripe → دفع
4. Success → `/order/thank-you?id=...&session_id=...` → status **`paid`**

## أمان

- **لا تضع المفاتيح في GitHub.** Easypanel env فقط.
- إذا تسرّب `sk_live_` → **Roll keys** f Stripe فوراً.
