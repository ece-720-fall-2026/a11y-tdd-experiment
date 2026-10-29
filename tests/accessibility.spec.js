import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility checks for the Trail Runner 2 product page.
 *
 * Runs axe-core against the page (and against the size guide dialog while it
 * is open) using only the WCAG 2.2 A/AA rules, so it reports anything that
 * fails WCAG 2.2 AA. The APG (Authoring Practices Guide) conformance of each
 * interactive widget is covered by the behavioural tests in product-page.spec.js.
 */

const URL = '/products/trail-runner-2'
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']

test('product page has no WCAG 2.2 AA violations', async ({ page }) => {
  await page.goto(URL)
  await expect(page.getByRole('heading', { name: 'Trail Runner 2', level: 1 })).toBeVisible()

  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  expect(results.violations).toEqual([])
})

test('size guide dialog has no WCAG 2.2 AA violations while it is open', async ({ page }) => {
  await page.goto(URL)
  await expect(page.getByRole('heading', { name: 'Trail Runner 2', level: 1 })).toBeVisible()

  await page.getByRole('button', { name: /size guide/i }).click()
  const dialog = page.getByRole('dialog', { name: /size guide/i })
  await expect(dialog).toBeVisible()

  const results = await new AxeBuilder({ page }).include('[role="dialog"]').withTags(WCAG_TAGS).analyze()
  expect(results.violations).toEqual([])
})
