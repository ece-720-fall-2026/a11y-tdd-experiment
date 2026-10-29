import { product } from '../data/product.js'

// Converts a foot length in cm to the nearest half US size on the chart.
// Returns null if the length is outside the chart's range.
export function sizeFromFootLength(cm) {
  const chart = product.sizeChart
  const min = Number(chart[0].footCm)
  const max = Number(chart[chart.length - 1].footCm)
  if (!Number.isFinite(cm) || cm < min || cm > max) return null
  const perSize = (max - min) / (chart[chart.length - 1].us - chart[0].us)
  const raw = chart[0].us + (cm - min) / perSize
  const rounded = Math.round(raw * 2) / 2
  return Math.min(Math.max(rounded, chart[0].us), chart[chart.length - 1].us)
}

export const euFromUs = (us) => us + 33

export const chartRange = () => ({
  min: product.sizeChart[0].footCm,
  max: product.sizeChart[product.sizeChart.length - 1].footCm,
})

export const formatSize = (us) => `${us}`
