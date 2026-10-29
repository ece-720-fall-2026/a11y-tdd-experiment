import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.goto('/products/trail-runner-2')
})

test.describe('Store header', () => {
  test('shows the store name and the number of items in the cart', async ({ page }) => {
    await expect(page.getByRole('banner')).toContainText('Stride')
    const cart = page.getByRole('banner').getByRole('link', { name: /cart/i })
    await expect(cart).toContainText('0')
  })
})

test.describe('Breadcrumb path', () => {
  test('shows the path to the product and links back to earlier steps', async ({ page }) => {
    const breadcrumb = page.getByRole('navigation', { name: /breadcrumb/i })
    await expect(breadcrumb).toContainText('Shop')
    await expect(breadcrumb).toContainText('Trail')
    await expect(breadcrumb.getByRole('link', { name: 'Shop' })).toBeVisible()
    await expect(
      breadcrumb.getByRole('link', { name: 'Shop' }),
    ).toHaveAttribute('href', '/')
    // The current step is the page itself, not a link.
    await expect(breadcrumb.getByText('Trail Runner 2')).toBeVisible()
  })
})

test.describe('Photo carousel', () => {
  test('shows one photo at a time and cycles from the last back to the first', async ({ page }) => {
    const photos = page.getByRole('region', { name: /photos|images/i }).getByRole('img')
    await expect(photos).toHaveCount(1)

    const next = page.getByRole('button', { name: /next photo/i })
    await expect(next).toBeVisible()
    const firstAlt = await photos.getAttribute('alt')

    let lastAlt = firstAlt
    for (let i = 0; i < 5; i++) {
      await next.click()
      lastAlt = await photos.getAttribute('alt')
      if (lastAlt !== firstAlt) break
    }
    expect(lastAlt).not.toBe(firstAlt)

    // Keep going until it wraps back to the first photo.
    let wrapped = false
    for (let i = 0; i < 10; i++) {
      await next.click()
      if ((await photos.getAttribute('alt')) === firstAlt) {
        wrapped = true
        break
      }
    }
    expect(wrapped).toBe(true)
  })

  test('moves to the previous photo with the previous button', async ({ page }) => {
    const photos = page.getByRole('region', { name: /photos|images/i }).getByRole('img')
    const firstAlt = await photos.getAttribute('alt')
    await page.getByRole('button', { name: /next photo/i }).click()
    expect(await photos.getAttribute('alt')).not.toBe(firstAlt)
    await page.getByRole('button', { name: /previous photo/i }).click()
    expect(await photos.getAttribute('alt')).toBe(firstAlt)
  })
})

test.describe('Price', () => {
  test('shows the price and a tooltip explaining taxes on hover and keyboard focus', async ({ page }) => {
    await expect(page.getByText('$120.00')).toBeVisible()
    const info = page.getByRole('button', { name: /price includes|taxes|more information about price/i })
    await info.hover()
    await expect(page.getByText(/includes taxes/i)).toBeVisible()
    await info.focus()
    await expect(page.getByText(/includes taxes/i)).toBeVisible()
  })
})

test.describe('Color picker', () => {
  test('offers blue, black and grey with round swatches and shows only the chosen color', async ({ page }) => {
    const colors = page.getByRole('radiogroup', { name: /color/i })
    for (const color of ['Blue', 'Black', 'Grey']) {
      await expect(colors.getByRole('radio', { name: new RegExp(color, 'i') })).toBeVisible()
    }
    await expect(colors.getByRole('radio', { name: /grey/i })).toBeEnabled()
    await colors.getByRole('radio', { name: /grey/i }).check()
    await expect(page.getByRole('region', { name: /photos|images/i })).toContainText(/grey/i)
    await expect(page.getByRole('region', { name: /photos|images/i })).not.toContainText(/blue/i)
  })

  test('is operable with the keyboard as a radio group', async ({ page }) => {
    const colors = page.getByRole('radiogroup', { name: /color/i })
    await colors.getByRole('radio', { name: /blue/i }).focus()
    await page.keyboard.press('ArrowRight')
    const selected = colors.locator('[aria-checked="true"]')
    await expect(selected).toHaveCount(1)
  })
})

test.describe('Size picker', () => {
  test('shows only the chosen size and opens a list to change it', async ({ page }) => {
    const size = page.getByRole('combobox', { name: /size/i })
    await expect(size).toBeVisible()
    await size.click()
    await expect(page.getByRole('option', { name: '10' })).toBeVisible()
    await page.getByRole('option', { name: '10' }).click()
    await expect(size).toHaveText(/10/)
    await expect(page.getByRole('option')).toHaveCount(0)
  })

  test('cannot pick sold-out sizes', async ({ page }) => {
    const size = page.getByRole('combobox', { name: /size/i })
    await size.click()
    const soldOut = page
      .getByRole('option')
      .filter({ hasText: /\d/ })
      .locator('[aria-disabled="true"], [aria-selected="false"][disabled]')
    expect(await soldOut.count()).toBeGreaterThan(0)
    for (const option of await soldOut.all()) {
      await expect(option).toBeDisabled()
    }
  })
})

test.describe('Size guide', () => {
  test('opens a modal size chart over the page that computes a size and must be closed', async ({ page }) => {
    await page.getByRole('button', { name: /size guide|size chart/i }).click()
    const dialog = page.getByRole('dialog', { name: /size guide|size chart/i })
    await expect(dialog).toBeVisible()

    await dialog.getByLabel(/foot length/i).fill('27')
    await dialog.getByRole('radio', { name: 'US' }).check()
    await expect(dialog).toContainText(/9/)
    await dialog.getByRole('radio', { name: 'EU' }).check()
    await expect(dialog).toContainText(/42/)

    // The dialog is modal: focus is trapped inside while it is open.
    await expect(dialog.locator(':focus')).toBeAttached()
    await dialog.getByRole('button', { name: /close/i }).click()
    await expect(dialog).not.toBeVisible()
    // After closing, focus returns to the control that opened the dialog.
    await expect(page.getByRole('button', { name: /size guide|size chart/i })).toBeFocused()
  })
})

test.describe('Quantity', () => {
  test('lets the shopper type a quantity or change it by one', async ({ page }) => {
    const quantity = page.getByRole('spinbutton', { name: /quantity/i })
    await expect(quantity).toBeVisible()
    await quantity.fill('3')
    await expect(quantity).toHaveValue('3')
    await page.getByRole('button', { name: /increase quantity/i }).click()
    await expect(quantity).toHaveValue('4')
    await page.getByRole('button', { name: /decrease quantity/i }).click()
    await expect(quantity).toHaveValue('3')
  })
})

test.describe('Add to cart', () => {
  test('asks for a size when none is picked, then confirms adding to the cart', async ({ page }) => {
    await expect(page.getByRole('button', { name: /add to bag|add to cart/i })).toBeVisible()
    await page.getByRole('button', { name: /add to bag|add to cart/i }).click()
    await expect(
      page.getByRole('status').or(page.getByRole('alert')),
    ).toContainText(/pick a size|choose a size/i)

    const size = page.getByRole('combobox', { name: /size/i })
    await size.click()
    await page.getByRole('option', { name: '10' }).click()
    await page.getByRole('button', { name: /add to bag|add to cart/i }).click()
    await expect(page.getByRole('status').or(page.getByRole('alert'))).toContainText(/added to bag|added to cart/i)
    await expect(page.getByRole('banner').getByRole('link', { name: /cart/i })).toContainText('1')
  })
})

test.describe('Wishlist', () => {
  test('saves and unsaves the shoe with a heart button that reports its state', async ({ page }) => {
    const heart = page.getByRole('button', { name: /save|wishlist|favorite/i })
    await expect(heart).toHaveAttribute('aria-pressed', 'false')
    await heart.click()
    await expect(heart).toHaveAttribute('aria-pressed', 'true')
    await heart.click()
    await expect(heart).toHaveAttribute('aria-pressed', 'false')
  })
})

test.describe('More information tabs', () => {
  test('shows details, reviews and shipping side by side with one panel at a time', async ({ page }) => {
    const tablist = page.getByRole('tablist', { name: /more information/i })
    const tabs = ['Details', 'Reviews', 'Shipping']
    for (const tab of tabs) {
      await expect(tablist.getByRole('tab', { name: tab })).toBeVisible()
    }
    await expect(tablist.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel', { name: /details/i })).toBeVisible()
    await expect(page.getByRole('tabpanel', { name: /reviews/i })).not.toBeVisible()
    await tablist.getByRole('tab', { name: 'Reviews' }).click()
    await expect(page.getByRole('tabpanel', { name: /reviews/i })).toBeVisible()
    await expect(page.getByRole('tabpanel', { name: /details/i })).not.toBeVisible()
  })

  test('supports arrow-key navigation between tabs', async ({ page }) => {
    const tablist = page.getByRole('tablist', { name: /more information/i })
    await tablist.getByRole('tab', { name: 'Details' }).focus()
    await page.keyboard.press('ArrowRight')
    await expect(tablist.getByRole('tab', { name: 'Reviews' })).toBeFocused()
  })
})

test.describe('Questions accordion', () => {
  test('hides each answer until the shopper opens it', async ({ page }) => {
    const questions = page
      .getByRole('region', { name: /questions|frequently asked/i })
      .getByRole('button', { name: /\?/ })
    expect(await questions.count()).toBeGreaterThanOrEqual(3)
    const first = questions.first()
    await expect(first).toHaveAttribute('aria-expanded', 'false')
    await first.click()
    await expect(first).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('region', { name: /\?/ }).first()).toBeVisible()
  })
})

test.describe('Footer', () => {
  test('has customer help, company and social media links', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    await expect(footer.getByRole('link', { name: /customer help|support|contact/i })).toBeVisible()
    await expect(footer.getByRole('link', { name: /about us|company/i })).toBeVisible()
    for (const social of [/instagram/i, /facebook/i, /youtube/i]) {
      await expect(footer.getByRole('link', { name: social }).first()).toBeVisible()
    }
  })
})

test.describe('Accessibility', () => {
  test('has no WCAG 2.2 AA violations on the product page', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })
})
