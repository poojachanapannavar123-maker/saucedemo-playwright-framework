/**
 * Get the Random index to handle the calculation.
 * @param count
 * @returns number
 * @author Pooja
 */

export function getRandomIndex(count: number): number {
  if (count <= 0) {
    throw new Error("Count must be greater than zero");
  }
  return Math.floor(Math.random() * count);
}

/**
 * Converts a price text such as "$29.99" or "Item total: $29.99" to cents (2999).
 * SauceDemo sometimes shows floating-point noise (e.g. "$59.980000000000004"),
 * so the whole number is read and then rounded to the nearest cent.
 * @param priceText Text that contains a dollar amount($12.99)
 * @returns The amount in cents (1299)
 * @author Pooja
 */
export function toCents(priceText: string): number {
  const match = priceText.match(/\$(\d+(?:\.\d+)?)/);
  if (!match) {
    throw new Error(`No price found in "${priceText}"`);
  } else {
    return Math.round(parseFloat(match[1]) * 100);
  }
}
