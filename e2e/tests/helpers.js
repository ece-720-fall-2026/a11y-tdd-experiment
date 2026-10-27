import AxeBuilder from '@axe-core/playwright'
import { expect } from '@playwright/test'

export const PRODUCT_URL = '/products/trail-runner-2'

// WCAG 2.2 Level A and AA rules, plus the best-practice rules.
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']

export async function expectNoAxeViolations(page, include) {
  let builder = new AxeBuilder({ page }).withTags(WCAG_TAGS)
  if (include) builder = builder.include(include)
  const results = await builder.analyze()
  const summary = results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help} -> ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  )
  expect(summary, 'WCAG 2.2 AA violations').toEqual([])
}
