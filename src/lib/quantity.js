export const MIN_QTY = 1
export const MAX_QTY = 10

// Returns the quantity as an integer in range, or null if the text is not a valid quantity.
export function parseQty(text) {
  const trimmed = String(text).trim()
  if (!/^\d+$/.test(trimmed)) return null
  const n = Number(trimmed)
  return n >= MIN_QTY && n <= MAX_QTY ? n : null
}
