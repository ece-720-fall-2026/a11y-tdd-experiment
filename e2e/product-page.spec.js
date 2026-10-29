import { test, expect } from '@playwright/test'
import { openProductPage, cartCount } from './support/product-page.js'

test.beforeEach(async ({ page }) => {
  await openProductPage(page)
})

test.describe('Store header', () => {
  test('shows the store name and the number of items in the cart', async ({ page }) => {
    const header = page.getByRole('banner')
    await expect(header.getByText('Stride', { exact: true })).toBeVisible()
    await expect(header.getByRole('link', { name: /cart/i })).toContainText(/\d+/)
  })
})

test.describe('Path', () => {
  test('shows where the shoe sits and the current step is marked', async ({ page }) => {
    const path = page.getByRole('navigation', { name: /breadcrumb/i })
    await expect(path.getByRole('link', { name: 'Shop' })).toBeVisible()
    await expect(path.getByRole('link', { name: 'Trail' })).toBeVisible()
    await expect(path.locator('[aria-current="page"]')).toHaveText('Trail Runner 2')
  })

  test('an earlier step takes the shopper back out of the product page', async ({ page }) => {
    const path = page.getByRole('navigation', { name: /breadcrumb/i })
    await Promise.all([
      page.waitForURL((url) => url.pathname !== '/products/trail-runner-2'),
      path.getByRole('link', { name: 'Shop' }).click(),
    ])
  })
})

test.describe('Photos', () => {
  const gallery = (page) => page.getByRole('region', { name: /photos|gallery/i })

  test('shows one photo at a time and cycles forward and back', async ({ page }) => {
    const visiblePhoto = gallery(page).locator('img:visible')
    const srcShown = async () => {
      await expect(visiblePhoto).toHaveCount(1)
      return visiblePhoto.getAttribute('src')
    }

    const first = await srcShown()
    const seen = [first]
    const next = gallery(page).getByRole('button', { name: /next/i })
    for (let i = 0; i < 10; i++) {
      await next.click()
      const src = await srcShown()
      if (src === first) break
      seen.push(src)
    }
    expect(seen.length, 'more than one photo').toBeGreaterThan(1)

    // Going back from the first photo wraps to the last one.
    await gallery(page).getByRole('button', { name: /previous|prev/i }).click()
    expect(await srcShown()).toBe(seen[seen.length - 1])
  })
})

test.describe('Price', () => {
  test('shows the price and an info button that explains it includes taxes', async ({ page }) => {
    await expect(page.getByText(/[$€£]\s?\d+/).first()).toBeVisible()

    const info = page.getByRole('button', { name: /price/i })
    await info.focus()
    const tooltip = page.getByRole('tooltip')
    await expect(tooltip).toContainText(/includes? taxes/i)
    await expect(info).toHaveAttribute('aria-describedby', /.+/)

    // APG tooltip: Escape dismisses the tooltip without moving focus.
    await page.keyboard.press('Escape')
    await expect(tooltip).toBeHidden()
    await expect(info).toBeFocused()
  })
})

test.describe('Color', () => {
  const colorChoice = (page) => page.getByText(/^(Blue|Black|Grey)$/)

  test('shows only the chosen color until the shopper opens the choices', async ({ page }) => {
    await expect(colorChoice(page)).toHaveCount(1)
    await expect(page.getByRole('radio', { name: /blue|black|grey/i })).toHaveCount(0)

    await page.getByRole('button', { name: /color/i }).click()
    const group = page.getByRole('radiogroup', { name: /color/i })
    await expect(group).toBeVisible()
    for (const name of ['Blue', 'Black', 'Grey']) {
      const option = group.getByRole('radio', { name })
      await expect(option).toBeVisible()
      // Each option has a round swatch.
      const swatch = option.locator('[data-testid="swatch"]')
      await expect(swatch).toHaveCSS('border-radius', /50%|9999px/)
    }
  })

  test('picking a color shows it and closes the choices', async ({ page }) => {
    await page.getByRole('button', { name: /color/i }).click()
    await page.getByRole('radiogroup', { name: /color/i }).getByRole('radio', { name: 'Black' }).click()

    await expect(page.getByRole('radiogroup', { name: /color/i })).toBeHidden()
    await expect(colorChoice(page)).toHaveText('Black')
  })
})

test.describe('Size', () => {
  // APG select-only combobox / listbox popup: the trigger has aria-haspopup="listbox".
  const sizeTrigger = (page) => page.locator('[aria-haspopup="listbox"]')

  test('the size list opens from the trigger and picking a size closes it', async ({ page }) => {
    await expect(page.getByRole('option')).toHaveCount(0)

    await sizeTrigger(page).click()
    const list = page.getByRole('listbox')
    await expect(list).toBeVisible()
    await expect(sizeTrigger(page)).toHaveAttribute('aria-expanded', 'true')

    const option = list.getByRole('option').filter({ hasNotText: /sold out/i }).nth(1)
    const picked = (await option.textContent()).trim()
    await option.click()

    await expect(list).toBeHidden()
    await expect(sizeTrigger(page)).toHaveAttribute('aria-expanded', 'false')
    await expect(sizeTrigger(page)).toContainText(picked)
  })

  test('sold-out sizes cannot be picked, and Escape closes the list', async ({ page }) => {
    const before = (await sizeTrigger(page).textContent()).trim()
    await sizeTrigger(page).click()

    const soldOut = page.getByRole('option', { name: /sold out/i }).first()
    await expect(soldOut).toBeDisabled()
    await soldOut.click({ force: true })
    await expect(sizeTrigger(page)).toContainText(before)

    await page.keyboard.press('Escape')
    await expect(page.getByRole('listbox')).toBeHidden()
    await expect(sizeTrigger(page)).toBeFocused()
  })
})

test.describe('Size guide', () => {
  const guideLink = (page) => page.getByRole('button', { name: /size guide/i })
  const dialog = (page) => page.getByRole('dialog', { name: /size guide/i })

  test('converts a foot length to a US or EU size inside a modal dialog', async ({ page }) => {
    await guideLink(page).click()
    const modal = dialog(page)
    await expect(modal).toBeVisible()
    await expect(modal).toHaveAttribute('aria-modal', 'true')

    await modal.getByLabel(/foot length/i).fill('26')
    await modal.getByLabel('EU', { exact: true }).check()
    await expect(modal.getByRole('status')).toContainText(/EU\s*\d+/)

    await modal.getByRole('button', { name: /close/i }).click()
    await expect(modal).toBeHidden()
  })

  test('keeps focus inside the dialog until it is closed with Escape', async ({ page }) => {
    await guideLink(page).click()
    const modal = dialog(page)
    await expect(modal).toBeVisible()

    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab')
      expect(await modal.evaluate((d) => d.contains(document.activeElement))).toBe(true)
    }

    await page.keyboard.press('Escape')
    await expect(modal).toBeHidden()
    await expect(guideLink(page)).toBeFocused()
  })
})

test.describe('Quantity', () => {
  const quantity = (page) => page.getByRole('spinbutton', { name: /quantity/i })

  test('the shopper can type a number of pairs', async ({ page }) => {
    await quantity(page).fill('3')
    await expect(quantity(page)).toHaveValue('3')
  })

  test('the increase and decrease buttons change the number by one', async ({ page }) => {
    const start = Number(await quantity(page).inputValue())
    await page.getByRole('button', { name: /increase quantity/i }).click()
    await expect(quantity(page)).toHaveValue(String(start + 1))
    await page.getByRole('button', { name: /decrease quantity/i }).click()
    await expect(quantity(page)).toHaveValue(String(start))
  })
})

test.describe('Add to cart', () => {
  const addToCart = (page) => page.getByRole('button', { name: /add to cart/i })

  test('asks for a size when none is chosen and does not add the shoe', async ({ page }) => {
    const before = await cartCount(page)
    await addToCart(page).click()

    await expect(page.getByRole('alert')).toContainText(/size/i)
    await expect(page.getByRole('alert')).toContainText(/select|choose|pick/i)
    expect(await cartCount(page)).toBe(before)
  })

  test('adds the chosen quantity to the cart and confirms it', async ({ page }) => {
    const before = await cartCount(page)
    await page.locator('[aria-haspopup="listbox"]').click()
    await page.getByRole('listbox').getByRole('option').filter({ hasNotText: /sold out/i }).nth(1).click()
    await page.getByRole('spinbutton', { name: /quantity/i }).fill('2')

    await addToCart(page).click()

    await expect(page.getByText(/added to (your )?cart/i)).toBeVisible()
    expect(await cartCount(page)).toBe(before + 2)
  })
})

test.describe('Wishlist', () => {
  test('the heart saves and unsaves the shoe, keeping its name', async ({ page }) => {
    const heart = page.getByRole('button', { name: /wishlist/i })
    await expect(heart).toHaveAttribute('aria-pressed', 'false')

    await heart.click()
    await expect(heart).toHaveAttribute('aria-pressed', 'true')
    await expect(heart).toHaveAccessibleName(/wishlist/i)

    await heart.click()
    await expect(heart).toHaveAttribute('aria-pressed', 'false')
  })
})

test.describe('More information', () => {
  const tabs = (page) => page.getByRole('tablist')

  test('details, reviews and shipping sit side by side below everything, one shown at a time', async ({ page }) => {
    const tab = (name) => tabs(page).getByRole('tab', { name })
    await expect(page.getByRole('tab')).toHaveCount(3)
    await expect(tab(/details/i)).toBeVisible()
    await expect(tab(/reviews/i)).toBeVisible()
    await expect(tab(/shipping/i)).toBeVisible()

    // Side by side: all three tabs share a row.
    const tops = await Promise.all(
      [/details/i, /reviews/i, /shipping/i].map(async (n) => (await tab(n).boundingBox()).y),
    )
    expect(new Set(tops.map(Math.round)).size).toBe(1)

    // Below everything: the tab list is under the questions section.
    const questions = await page.getByRole('region', { name: /questions/i }).boundingBox()
    expect((await tabs(page).boundingBox()).y).toBeGreaterThan(questions.y)

    await tab(/reviews/i).click()
    await expect(tab(/reviews/i)).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel')).toHaveCount(1)
    await expect(page.getByRole('tabpanel')).toBeVisible()
  })

  test('arrow keys, Home and End move between tabs as in the APG tabs pattern', async ({ page }) => {
    const details = tabs(page).getByRole('tab', { name: /details/i })
    await details.focus()
    await page.keyboard.press('ArrowRight')
    await expect(tabs(page).getByRole('tab', { name: /reviews/i })).toBeFocused()
    await expect(tabs(page).getByRole('tab', { name: /reviews/i })).toHaveAttribute('aria-selected', 'true')

    await page.keyboard.press('End')
    await expect(tabs(page).getByRole('tab', { name: /shipping/i })).toBeFocused()

    await page.keyboard.press('Home')
    await expect(details).toBeFocused()
    await expect(details).toHaveAttribute('aria-selected', 'true')
  })
})

test.describe('Questions', () => {
  test('each question opens its answer and closes it again', async ({ page }) => {
    const faq = page.getByRole('region', { name: /questions/i })
    const questions = faq.getByRole('button')
    const count = await questions.count()
    expect(count, 'a few questions').toBeGreaterThanOrEqual(3)
    // APG accordion: each trigger is a button inside a heading.
    await expect(faq.getByRole('heading').getByRole('button')).toHaveCount(count)

    const first = questions.first()
    await expect(first).toHaveAttribute('aria-expanded', 'false')
    const answerId = await first.getAttribute('aria-controls')
    await expect(page.locator(`[id="${answerId}"]`)).toBeHidden()

    await first.click()
    await expect(first).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator(`[id="${answerId}"]`)).toBeVisible()

    await first.click()
    await expect(first).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator(`[id="${answerId}"]`)).toBeHidden()
  })
})

test.describe('Footer', () => {
  test('has customer help, company and social media links', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    await expect(footer.getByRole('heading', { name: /customer help/i })).toBeVisible()
    await expect(footer.getByRole('heading', { name: /company/i })).toBeVisible()
    await expect(footer.getByRole('heading', { name: /social/i })).toBeVisible()
    await expect(footer.getByRole('link', { name: /facebook|instagram|x|twitter|youtube|tiktok|linkedin/i }).first()).toBeVisible()
  })
})
