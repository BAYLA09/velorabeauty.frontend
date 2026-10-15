import { Suspense } from "react";
import { CheckoutSuccessClient } from "./CheckoutSuccessClient";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[70vh] bg-velora-cream px-4 py-16 text-center text-velora-burgundy/70">
          جاري التحميل…
        </main>
      }
    >
      <CheckoutSuccessClient />
    </Suspense>
  );
}
