/**
 * Dynamic Weight & Quantity Price Scaling Utility for BIN RIAZ FOODS
 * Automatically scales unit price based on selected weight/variant (50g, 100g, 250g, 500g, 1kg)
 * with volume discount tiers.
 */

export function parseWeightToGrams(weightStr: string): number | null {
  if (!weightStr) return null;
  const clean = weightStr.trim().toLowerCase();

  // Match kg: 1kg, 1.5kg, 2 kg
  const kgMatch = clean.match(/^([0-9.]+)\s*kg$/);
  if (kgMatch) return parseFloat(kgMatch[1]) * 1000;

  // Match g / gm / grams: 50g, 100gm, 250 grams
  const gMatch = clean.match(/^([0-9.]+)\s*(g|gm|gms|gram|grams)$/);
  if (gMatch) return parseFloat(gMatch[1]);

  // Match Litre / L: 1L, 0.5L
  const lMatch = clean.match(/^([0-9.]+)\s*(l|ltr|liter|litre)$/);
  if (lMatch) return parseFloat(lMatch[1]) * 1000;

  // Match ml: 250ml, 500ml
  const mlMatch = clean.match(/^([0-9.]+)\s*(ml)$/);
  if (mlMatch) return parseFloat(mlMatch[1]);

  // Match pack: "Pack of 2", "2 Pack"
  const packMatch = clean.match(/pack of ([0-9]+)/) || clean.match(/^([0-9]+)\s*pack/);
  if (packMatch) return parseFloat(packMatch[1]) * 1000;

  return null;
}

export function calculatePriceForWeight(
  basePrice: number,
  baseWeightStr?: string,
  targetWeightStr?: string
): number {
  if (!baseWeightStr || !targetWeightStr || baseWeightStr === targetWeightStr) {
    return Number(basePrice);
  }

  const baseGrams = parseWeightToGrams(baseWeightStr);
  const targetGrams = parseWeightToGrams(targetWeightStr);

  if (baseGrams && targetGrams && baseGrams > 0) {
    const ratio = targetGrams / baseGrams;
    
    // Volume discount tiers for larger packs
    let discountMultiplier = 1;
    if (ratio >= 3.5) {
      discountMultiplier = 0.90; // 10% bulk discount
    } else if (ratio >= 1.8) {
      discountMultiplier = 0.95; // 5% bulk discount
    }

    const scaledPrice = Math.round((basePrice * ratio * discountMultiplier) / 10) * 10;
    return Math.max(10, scaledPrice);
  }

  // Fallbacks for named sizes
  const lowerTarget = targetWeightStr.toLowerCase();
  const lowerBase = baseWeightStr.toLowerCase();
  if (lowerTarget.includes('large') && lowerBase.includes('medium')) return Math.round(basePrice * 1.5);
  if (lowerTarget.includes('large') && lowerBase.includes('small')) return Math.round(basePrice * 2);
  if (lowerTarget.includes('medium') && lowerBase.includes('small')) return Math.round(basePrice * 1.4);

  return Number(basePrice);
}
