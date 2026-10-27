// Converts a foot length in cm to a size using the product's size chart.
export function sizeFromFootLength(cmInput, system, chart) {
  const trimmed = String(cmInput).trim()
  if (trimmed === '') return { status: 'empty' }
  const cm = Number(trimmed)
  const min = chart[0].cm
  const max = chart[chart.length - 1].cm
  if (!Number.isFinite(cm) || cm < min || cm > max) return { status: 'out-of-range', min, max }
  const row = chart.reduce((best, r) => (Math.abs(r.cm - cm) < Math.abs(best.cm - cm) ? r : best))
  return { status: 'ok', size: system === 'EU' ? `EU ${row.eu}` : `US ${row.us}` }
}
