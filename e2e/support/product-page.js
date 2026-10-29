import { expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

export const PRODUCT_PATH = '/products/trail-runner-2'

// WCAG 2.2 Level A and AA success criteria as tagged by axe-core.
const WCAG_22_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

export async function openProductPage(page) {
  await page.goto(PRODUCT_PATH)
}

// Guard for accessibility scans: an empty or missing page must not pass a scan.
export async function expectProductPageLoaded(page) {
  await expect(
    page.getByRole('heading', { level: 1, name: /trail runner 2/i }),
  ).toBeVisible()
}

export async function expectNoWcagViolations(page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_22_AA_TAGS).analyze()
  const summary = results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help} -> ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  )
  expect(summary, 'WCAG 2.2 AA violations').toEqual([])
}

// Reads the number of items shown in the header cart control, e.g. "Cart (2)".
export async function cartCount(page) {
  const text = await page.getByRole('banner').getByRole('link', { name: /cart/i }).textContent()
  const match = text.match(/\d+/)
  if (!match) throw new Error(`No item count found in cart control: "${text}"`)
  return Number(match[0])
}
