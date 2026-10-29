// Returns the US or EU size for a foot length in cm, or an error message.
export const FOOT_MIN_CM = 22
export const FOOT_MAX_CM = 28

export function sizeForFoot(footCm, chart, system) {
  if (!Number.isFinite(footCm)) return { error: 'Enter your foot length in centimetres to see your size.' }
  if (footCm < FOOT_MIN_CM || footCm > FOOT_MAX_CM) {
    return { error: `Foot length should be between ${FOOT_MIN_CM} and ${FOOT_MAX_CM} cm.` }
  }
  const row = chart.find((r) => footCm <= r.maxCm) ?? chart[chart.length - 1]
  return { size: `${system} ${system === 'US' ? row.us : row.eu}` }
}
