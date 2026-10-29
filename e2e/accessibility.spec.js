import { test, expect } from '@playwright/test'
import {
  openProductPage,
  expectProductPageLoaded,
  expectNoWcagViolations,
} from './support/product-page.js'

test.beforeEach(async ({ page }) => {
  await openProductPage(page)
  await expectProductPageLoaded(page)
})

test('the page has no WCAG 2.2 AA violations', async ({ page }) => {
  await expectNoWcagViolations(page)
})

test('the size guide dialog has no WCAG 2.2 AA violations', async ({ page }) => {
  await page.getByRole('button', { name: /size guide/i }).click()
  await expect(page.getByRole('dialog', { name: /size guide/i })).toBeVisible()
  await expectNoWcagViolations(page)
})

test('the open size list has no WCAG 2.2 AA violations', async ({ page }) => {
  await page.locator('[aria-haspopup="listbox"]').click()
  await expect(page.getByRole('listbox')).toBeVisible()
  await expectNoWcagViolations(page)
})

test('the add to cart error has no WCAG 2.2 AA violations', async ({ page }) => {
  await page.getByRole('button', { name: /add to cart/i }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  await expectNoWcagViolations(page)
})

test('content reflows at 320 CSS pixels without horizontal scrolling', async ({ page }) => {
  // WCAG 1.4.10 Reflow: 320px wide is 400% zoom of a 1280px layout.
  await page.setViewportSize({ width: 320, height: 800 })
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0)
})

test('keyboard focus is always visibly indicated', async ({ page }) => {
  // WCAG 2.4.7 Focus Visible: walk the first tab stops and check each one has a visible focus style.
  const unindicated = []
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab')
    const info = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      const style = getComputedStyle(el)
      const visible = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0
      const shadowed = style.boxShadow !== 'none'
      return { label: el.outerHTML.slice(0, 80), indicated: visible || shadowed }
    })
    if (info && !info.indicated) unindicated.push(info.label)
  }
  expect(unindicated, 'focused elements without a visible focus indicator').toEqual([])
})
