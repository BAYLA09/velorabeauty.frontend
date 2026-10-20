import { mapEmirateToCodNetworkCity } from "@/lib/codNetwork/emirateCity";
import type { OrderRecord } from "@/lib/ordersRepository";

/** Shown on COD Network when the customer did not provide an address at checkout. */
export const COD_NETWORK_ADDRESS_CONFIRM_BY_PHONE =
  "To confirm by phone (سيتم التأكيد هاتفياً)";

export const COD_NETWORK_CITY_FALLBACK = "Dubai";

/** Address/city for COD Network API — fallbacks when checkout collected name + phone only. */
export function resolveCodNetworkLeadAddress(order: OrderRecord): {
  address: string;
  city: string;
} {
  const trimmedAddress = order.address.trim();
  const trimmedEmirate = order.emirate.trim();

  const address = trimmedAddress || COD_NETWORK_ADDRESS_CONFIRM_BY_PHONE;
  const city = trimmedEmirate
    ? mapEmirateToCodNetworkCity(trimmedEmirate)
    : COD_NETWORK_CITY_FALLBACK;

  return { address, city };
}
