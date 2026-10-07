import { Suspense } from "react";
import { ThankYouPageClient } from "./ThankYouPageClient";

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[70vh] bg-velora-cream px-4 py-16 text-center text-velora-burgundy/70">
          جاري التحميل…
        </main>
      }
    >
      <ThankYouPageClient />
    </Suspense>
  );
}
