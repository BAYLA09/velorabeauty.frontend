import { redirect } from "next/navigation";
import {
  isStripeLiveTestCheckoutEnabled,
  stripeLiveTestCardCheckoutPath,
} from "@/config/stripeLiveTestCheckout";

export const dynamic = "force-dynamic";

export default function StripeLiveTestShortcutPage() {
  if (!isStripeLiveTestCheckoutEnabled()) {
    redirect("/");
  }
  redirect(stripeLiveTestCardCheckoutPath());
}
