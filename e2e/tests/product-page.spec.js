import { test, expect } from '@playwright/test'
import { PRODUCT_URL, expectNoAxeViolations } from './helpers.js'

test.beforeEach(async ({ page }) => {
  await page.goto(PRODUCT_URL)
})

// Store
test('shows the store name and the number of items in the cart', async ({ page }) => {
  await expect(page.getByRole('banner').getByText('Stride')).toBeVisible()
  await expect(page.getByRole('link', { name: /cart/i })).toContainText(/\d+/)
})

// Path (breadcrumb, APG: links within a nav labelled "Breadcrumb", current item has aria-current)
test('shows the path and lets the shopper go back to an earlier step', async ({ page }) => {
  const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' })
  await expect(crumbs.getByRole('link', { name: 'Shop' })).toBeVisible()
  await expect(crumbs.getByRole('link', { name: 'Trail' })).toBeVisible()
  await expect(crumbs.getByText('Trail Runner 2', { exact: true })).toHaveAttribute('aria-current', 'page')
  await crumbs.getByRole('link', { name: 'Trail' }).click()
  await expect(page).not.toHaveURL(PRODUCT_URL)
})

// Photos (APG: a carousel shows one slide at a time; wraps from last to first)
test('shows one photo at a time and cycles through them with next and previous', async ({ page }) => {
  const gallery = page.getByRole('region', { name: /photos|gallery/i })
  const images = gallery.getByRole('img')
  await expect(images).toHaveCount(1)
  const first = await images.getAttribute('alt')
  await gallery.getByRole('button', { name: /previous/i }).click()
  await expect(images).toHaveCount(1)
  expect(await images.getAttribute('alt')).not.toBe(first)
  await gallery.getByRole('button', { name: /next/i }).click()
  await expect(images).toHaveAttribute('alt', first)
})

// Price (APG tooltip: "i" button described by a tooltip that is revealed on hover/focus)
test('shows the price with an info tooltip saying it includes taxes', async ({ page }) => {
  await expect(page.getByText(/\$\s?\d+/).first()).toBeVisible()
  const info = page.getByRole('button', { name: /more info|info|about price/i })
  await info.hover()
  await expect(page.getByRole('tooltip')).toContainText(/includes? taxes/i)
})

// Color (APG radio group: exactly one of blue/black/grey is selected, only the chosen one is shown)
test('offers blue, black and grey swatches and shows only the chosen color', async ({ page }) => {
  const colors = page.getByRole('radiogroup', { name: /color/i })
  for (const name of ['Blue', 'Black', 'Grey']) {
    await expect(colors.getByRole('radio', { name })).toBeVisible()
  }
  await colors.getByRole('radio', { name: 'Black' }).check()
  await expect(page.getByText('Black', { exact: true })).toBeVisible()
  await expect(page.getByText(/^(Blue|Grey)$/)).toHaveCount(0)
})

// Size (APG select-only combobox: listbox opens on demand, sold-out options aria-disabled)
test('opens the size list only on demand and does not allow sold-out sizes', async ({ page }) => {
  const size = page.getByRole('combobox', { name: /size/i })
  await expect(page.getByRole('listbox', { name: /size/i })).toBeHidden()
  await size.click()
  const list = page.getByRole('listbox', { name: /size/i })
  await expect(list).toBeVisible()
  const soldOut = list.getByRole('option', { name: /sold out/i }).first()
  await expect(soldOut).toHaveAttribute('aria-disabled', 'true')
})

// Size guide (APG modal dialog: focus moves in, Escape/close returns focus, page is inert behind it)
test('opens a size guide dialog that converts a foot length to US or EU and must be closed', async ({ page }) => {
  await page.getByRole('button', { name: /size guide/i }).click()
  const dialog = page.getByRole('dialog', { name: /size guide/i })
  await expect(dialog).toBeVisible()
  await dialog.getByLabel(/foot length/i).fill('27')
  await dialog.getByRole('radio', { name: 'US' }).check()
  await expect(dialog.getByText(/your size.*US\s?\d/i)).toBeVisible()
  await expectNoAxeViolations(page)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

// Quantity (APG spinbutton: typed value and +/- steps)
test('lets the shopper type a quantity or change it by one', async ({ page }) => {
  const qty = page.getByRole('spinbutton', { name: /quantity/i })
  await qty.fill('3')
  await expect(qty).toHaveValue('3')
  await page.getByRole('button', { name: /increase/i }).click()
  await expect(qty).toHaveValue('4')
  await page.getByRole('button', { name: /decrease/i }).click()
  await expect(qty).toHaveValue('3')
})

// Add to cart
test('asks for a size when none is chosen, and confirms when added with a size', async ({ page }) => {
  const add = page.getByRole('button', { name: /add to cart/i })
  await add.click()
  await expect(page.getByRole('alert')).toContainText(/size/i)
  await page.getByRole('combobox', { name: /size/i }).click()
  await page.getByRole('option').filter({ hasNotText: /sold out/i }).first().click()
  await add.click()
  await expect(page.getByRole('status')).toContainText(/added to (your )?cart/i)
})

// Wishlist (APG toggle button: aria-pressed reflects saved state)
test('saves and unsaves the shoe with a heart toggle', async ({ page }) => {
  const heart = page.getByRole('button', { name: /wishlist/i })
  await expect(heart).toHaveAttribute('aria-pressed', 'false')
  await heart.click()
  await expect(heart).toHaveAttribute('aria-pressed', 'true')
  await heart.click()
  await expect(heart).toHaveAttribute('aria-pressed', 'false')
})

// More information (APG tabs: one tab panel visible; arrow keys move between tabs)
test('shows details, reviews and shipping as tabs with one section visible at a time', async ({ page }) => {
  const tabs = page.getByRole('tablist')
  const details = tabs.getByRole('tab', { name: 'Details' })
  const reviews = tabs.getByRole('tab', { name: 'Reviews' })
  await expect(tabs.getByRole('tab', { name: 'Shipping' })).toBeVisible()
  await expect(details).toHaveAttribute('aria-selected', 'true')
  await details.focus()
  await page.keyboard.press('ArrowRight')
  await expect(reviews).toBeFocused()
  await expect(reviews).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel')).toHaveCount(1)
  await expectNoAxeViolations(page)
})

// Questions (APG accordion: button with aria-expanded controls a hidden answer region)
test('shows common questions with answers hidden until opened', async ({ page }) => {
  const questions = page.getByRole('button', { expanded: false }).filter({ hasText: /\?$/ })
  await expect(questions.first()).toBeVisible()
  expect(await questions.count()).toBeGreaterThanOrEqual(3)
  const first = questions.first()
  const answer = page.locator(`#${(await first.getAttribute('aria-controls'))}`)
  await expect(answer).toBeHidden()
  await first.click()
  await expect(first).toHaveAttribute('aria-expanded', 'true')
  await expect(answer).toBeVisible()
})

// Footer
test('shows customer help, company and social media links at the bottom', async ({ page }) => {
  const footer = page.getByRole('contentinfo')
  await expect(footer.getByRole('heading', { name: /customer help/i })).toBeVisible()
  await expect(footer.getByRole('heading', { name: /company/i })).toBeVisible()
  await expect(footer.getByRole('link', { name: /instagram|facebook|twitter|x|youtube/i }).first()).toBeVisible()
})

// Whole-page accessibility (WCAG 2.2 AA)
test('the page has no WCAG 2.2 AA violations', async ({ page }) => {
  await expectNoAxeViolations(page)
})
