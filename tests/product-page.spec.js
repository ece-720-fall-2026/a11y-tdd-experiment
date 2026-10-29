import { expect, test } from '@playwright/test'

const PRODUCT_URL = '/products/trail-runner-2'

test.describe('Trail Runner 2 product page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCT_URL)
  })

  test('shows the store name and how many items are in the cart', async ({ page }) => {
    const header = page.getByRole('banner')
    await expect(header).toContainText('Stride')
    // the cart summary is visible and starts out empty
    await expect(header.getByText(/cart/i)).toBeVisible()
    await expect(header).toContainText(/\b0 items?\b/)
  })

  test('shows the path to the shoe and lets the shopper go back to an earlier step', async ({ page }) => {
    const breadcrumb = page.getByRole('navigation', { name: /breadcrumb/i })
    await expect(breadcrumb).toContainText('Shop')
    await expect(breadcrumb).toContainText('Trail')
    await expect(breadcrumb).toContainText('Trail Runner 2')

    // earlier steps are links, the current step is not
    await expect(breadcrumb.getByRole('link', { name: 'Shop', exact: true })).toBeVisible()
    await expect(breadcrumb.getByRole('link', { name: 'Trail', exact: true })).toBeVisible()
    await expect(breadcrumb.getByRole('link', { name: 'Trail Runner 2' })).toHaveCount(0)

    // clicking an earlier step takes the shopper back
    await breadcrumb.getByRole('link', { name: 'Shop', exact: true }).click()
    await expect(page).not.toHaveURL(/trail-runner-2/)
  })

  test('shows one photo at a time and cycles back to the first after the last', async ({ page }) => {
    const photo = page.getByRole('img', { name: /trail runner 2/i })
    await expect(photo).toHaveCount(1) // only one photo is shown at a time

    const next = page.getByRole('button', { name: /next photo/i })
    const previous = page.getByRole('button', { name: /previous photo/i })
    const firstSrc = await photo.getAttribute('src')

    // next shows another photo, previous comes back to it
    await next.click()
    await expect(photo).not.toHaveAttribute('src', firstSrc)
    await previous.click()
    await expect(photo).toHaveAttribute('src', firstSrc)

    // keep going next until we are back at the first photo
    let clicks = 0
    while (clicks < 10) {
      await next.click()
      clicks++
      if ((await photo.getAttribute('src')) === firstSrc) break
    }
    expect(clicks).toBeGreaterThan(1) // we saw more than one photo and wrapped around
    await expect(photo).toHaveAttribute('src', firstSrc)
  })

  test('shows the price, and pointing at the "i" reveals that taxes are included', async ({ page }) => {
    await expect(page.getByText(/\$\d/)).toBeVisible()

    const priceInfo = page.getByRole('button', { name: /information/i })
    await priceInfo.hover()
    await expect(page.getByText(/tax/i)).toBeVisible()
  })

  test('lets the shopper choose a color, and only the chosen color shows', async ({ page }) => {
    const colors = page.getByRole('radiogroup', { name: /color/i })
    await expect(colors.getByRole('radio', { name: /blue/i })).toBeVisible()
    await expect(colors.getByRole('radio', { name: /black/i })).toBeVisible()
    await expect(colors.getByRole('radio', { name: /grey/i })).toBeVisible()

    const grey = colors.getByRole('radio', { name: /grey/i })
    await grey.check()
    await expect(grey).toBeChecked()
    await expect(page.getByRole('img', { name: /grey/i })).toBeVisible()

    // changing the color replaces the photo: only the new one shows
    await colors.getByRole('radio', { name: /black/i }).check()
    await expect(page.getByRole('img', { name: /black/i })).toBeVisible()
    await expect(page.getByRole('img', { name: /grey/i })).toHaveCount(0)
  })

  test('picks one size from a list that only opens on demand, and sold-out sizes cannot be picked', async ({ page }) => {
    const size = page.getByRole('combobox', { name: /^size$/i })
    await expect(size).toBeVisible()

    // some sizes are sold out and cannot be picked
    const soldOut = size.locator('option[disabled]')
    expect(await soldOut.count()).toBeGreaterThan(0)

    // only the chosen size shows once an available size is picked
    const available = size.locator('option:not([disabled])').filter({ hasText: /\d/ })
    const chosenLabel = (await available.first().textContent()).trim()
    await size.selectOption({ label: chosenLabel })
    const shown = await size.evaluate((el) => el.selectedOptions[0].textContent.trim())
    expect(shown).toBe(chosenLabel)
  })

  test('opens the size guide over the page, gets a size, and must be closed to continue', async ({ page }) => {
    await page.getByRole('button', { name: /size guide/i }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    // the guide sits over the page and blocks it until it is closed
    await expect(dialog).toHaveAttribute('aria-modal', 'true')

    // entering a foot length and a unit gives a size
    await dialog.getByLabel(/foot length/i).fill('27')
    await dialog.getByRole('radio', { name: /^eu$/i }).check()
    await expect(dialog).toContainText(/EU\s?\d+/)

    // closing it lets the shopper continue
    await dialog.getByRole('button', { name: /close/i }).click()
    await expect(dialog).toBeHidden()
  })

  test('changes the quantity by typing or one pair at a time', async ({ page }) => {
    const quantity = page.getByRole('spinbutton', { name: /quantity/i })
    await expect(quantity).toHaveValue('1')

    await page.getByRole('button', { name: /increase quantity/i }).click()
    await expect(quantity).toHaveValue('2')

    await page.getByRole('button', { name: /decrease quantity/i }).click()
    await expect(quantity).toHaveValue('1')

    await quantity.fill('3')
    await expect(quantity).toHaveValue('3')
  })

  test('asks for a size when adding to the cart without one', async ({ page }) => {
    await page.getByRole('button', { name: /add to cart/i }).click()
    await expect(page.getByText(/pick a size|choose a size|select a size/i)).toBeVisible()
  })

  test('adds the shoe to the cart with the chosen quantity and confirms it', async ({ page }) => {
    // pick an available size
    const size = page.getByRole('combobox', { name: /^size$/i })
    const label = (await size.locator('option:not([disabled])').filter({ hasText: /\d/ }).first().textContent()).trim()
    await size.selectOption({ label })

    // two pairs
    await page.getByRole('button', { name: /increase quantity/i }).click()

    await page.getByRole('button', { name: /add to cart/i }).click()
    await expect(page.getByText(/added to (your )?cart/i)).toBeVisible()

    // the cart count in the header reflects the added pairs
    await expect(page.getByRole('banner')).toContainText(/\b2 items?\b/)
  })

  test('saves and unsaves the shoe with the heart', async ({ page }) => {
    const heart = page.getByRole('button', { name: /wishlist/i })
    await expect(heart).toHaveAttribute('aria-pressed', 'false')

    await heart.click()
    await expect(heart).toHaveAttribute('aria-pressed', 'true')

    await heart.click()
    await expect(heart).toHaveAttribute('aria-pressed', 'false')
  })

  test('shows details, reviews and shipping side by side, one section at a time', async ({ page }) => {
    const tabs = page.getByRole('tablist')
    await expect(tabs.getByRole('tab', { name: /details/i })).toBeVisible()
    await expect(tabs.getByRole('tab', { name: /reviews/i })).toBeVisible()
    await expect(tabs.getByRole('tab', { name: /shipping/i })).toBeVisible()

    await page.getByRole('tab', { name: /reviews/i }).click()
    await expect(page.getByRole('tab', { name: /reviews/i })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tab', { name: /details/i })).toHaveAttribute('aria-selected', 'false')
    // only one section is shown at a time
    await expect(page.getByRole('tabpanel')).toHaveCount(1)
  })

  test('reveals the answer to a question only when it is opened', async ({ page }) => {
    const questions = page.getByRole('region', { name: /question/i }).getByRole('button')
    expect(await questions.count()).toBeGreaterThan(1)

    const first = questions.first()
    await expect(first).toHaveAttribute('aria-expanded', 'false')
    await expect(questions.nth(1)).toHaveAttribute('aria-expanded', 'false')

    await first.click()
    await expect(first).toHaveAttribute('aria-expanded', 'true')
    // other questions stay closed
    await expect(questions.nth(1)).toHaveAttribute('aria-expanded', 'false')

    await first.click()
    await expect(first).toHaveAttribute('aria-expanded', 'false')
  })

  test('offers customer help, company and social media links at the bottom', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    await expect(footer).toContainText(/help|support|contact/i)
    await expect(footer).toContainText(/company|about/i)
    await expect(footer.getByRole('link', { name: /instagram|facebook|twitter|youtube|tiktok/i }).first()).toBeVisible()
  })
})
