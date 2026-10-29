import { product } from '../data/product.js'

// Returns a whole number from 1 to the maximum, or null if the text is not valid.
export function parseQuantity(text) {
  const trimmed = String(text).trim()
  if (!/^\d+$/.test(trimmed)) return null
  const n = Number(trimmed)
  return n >= 1 && n <= product.maxQuantity ? n : null
}
