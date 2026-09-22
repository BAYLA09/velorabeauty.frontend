import {
  cardBundlePrices,
  singleProductPrice,
  type BundleQuantity,
} from "@/config/pricing";

export function getBundleDisplay(quantity: BundleQuantity) {
  const price = cardBundlePrices[quantity];
  const compareAt = singleProductPrice * quantity;
  const savings = compareAt - price;
  const perUnit = quantity === 1 ? price : Math.round(price / quantity);

  return {
    price,
    compareAt,
    savings,
    perUnit,
    showCompare: quantity > 1 && savings > 0,
  };
}
