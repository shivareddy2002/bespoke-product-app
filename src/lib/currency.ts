const USD_TO_INR = 83;

export function toINR(usd: number): number {
  return usd * USD_TO_INR;
}

export function formatINR(usd: number): string {
  return `₹${toINR(usd).toFixed(2)}`;
}

export function formatOriginalINR(usd: number, discountPercent: number): string {
  const original = usd / (1 - discountPercent / 100);
  return `₹${toINR(original).toFixed(2)}`;
}

export function getDiscountedPrice(usd: number, discountPercent: number): number {
  return usd; // price is already the "discounted" price
}

export function getOriginalPrice(usd: number, discountPercent: number): number {
  return usd / (1 - discountPercent / 100);
}
