import { test, expect } from '@playwright/test'

// Product page for the Trail Runner 2 shoe.
// The page lives at /products/trail-runner-2 and is reachable from the homepage.

test.beforeEach(async ({ page }) => {
  await page.goto('/products/trail-runner-2')
})

test.describe('Store header', () => {
  test('shows the store name and the number of items in the cart', async ({ page }) => {
    const banner = page.getByRole('banner')
    await expect(banner).toContainText('Stride')
    await expect(banner).toContainText(/cart/i)
    await expect(banner).toContainText(/0/)
  })
})

test.describe('Path to the product', () => {
  test('shows the trail of steps and links back to earlier steps', async ({ page }) => {
    const breadcrumb = page.getByRole('navigation', { name: /breadcrumb/i })
    const shop = breadcrumb.getByRole('link', { name: 'Shop' })
    const trail = breadcrumb.getByRole('link', { name: 'Trail' })
    await expect(shop).toBeVisible()
    await expect(trail).toBeVisible()
    await expect(breadcrumb.getByText('Trail Runner 2')).toBeVisible()
    // Earlier steps are clickable links, not plain text.
    expect(await shop.getAttribute('href')).toMatch(/\//)
    expect(await trail.getAttribute('href')).toMatch(/\//)
  })
})

test.describe('Photos', () => {
  test('shows one photo at a time and moves to the next one', async ({ page }) => {
    const photos = page.getByAltText(/trail runner 2/i)
    const visiblePhoto = photos.filter({ visible: true })
    await expect(visiblePhoto).toHaveCount(1)

    const firstAlt = await visiblePhoto.getAttribute('alt')
    await page.getByRole('button', { name: 'Next photo' }).click()
    await expect(visiblePhoto).toHaveCount(1)
    await expect(visiblePhoto).not.toHaveAttribute('alt', firstAlt)
  })

  test('wraps around from the first photo back to the last', async ({ page }) => {
    const visiblePhoto = page.getByAltText(/trail runner 2/i).filter({ visible: true })
    await expect(visiblePhoto).toHaveCount(1)
    const firstAlt = await visiblePhoto.getAttribute('alt')

    // Going backwards from the first photo shows the last one...
    await page.getByRole('button', { name: 'Previous photo' }).click()
    await expect(visiblePhoto).toHaveCount(1)
    await expect(visiblePhoto).not.toHaveAttribute('alt', firstAlt)

    // ...and going forward from the last one returns to the first.
    await page.getByRole('button', { name: 'Next photo' }).click()
    await expect(visiblePhoto).toHaveAttribute('alt', firstAlt)
  })
})

test.describe('Price', () => {
  test('shows the price and reveals that it includes taxes', async ({ page }) => {
    await expect(page.getByText(/\$\s?\d/).first()).toBeVisible()

    const priceInfo = page.getByRole('button', { name: /price information/i })
    await priceInfo.hover()
    await expect(page.getByText(/includes taxes/i)).toBeVisible()
  })
})

test.describe('Color', () => {
  test('choosing a color shows only that color, with round swatches', async ({ page }) => {
    const colors = page.getByRole('radiogroup', { name: /color/i })
    const blue = colors.getByRole('radio', { name: /blue/i })
    await expect(blue).toBeVisible()
    await expect(colors.getByRole('radio', { name: /black/i })).toBeVisible()
    await expect(colors.getByRole('radio', { name: /grey/i })).toBeVisible()

    // Swatches are round: the border radius covers at least half the swatch.
    const box = await blue.boundingBox()
    const radius = await blue.evaluate((el) =>
      parseFloat(getComputedStyle(el).borderRadius),
    )
    expect(radius).toBeGreaterThanOrEqual(Math.min(box.width, box.height) / 2)

    // Only the chosen color shows.
    await blue.check()
    const visiblePhoto = page.getByAltText(/trail runner 2/i).filter({ visible: true })
    await expect(visiblePhoto).toHaveCount(1)
    await expect(visiblePhoto).toHaveAttribute('alt', /blue/i)

    await colors.getByRole('radio', { name: /grey/i }).check()
    await expect(page.getByAltText(/trail runner 2/i).filter({ visible: true })).toHaveAttribute('alt', /grey/i)
  })
})

test.describe('Size', () => {
  test('the list opens on demand, shows the chosen size, and closes', async ({ page }) => {
    const sizeTrigger = page.getByRole('button', { name: 'Size' })
    await expect(sizeTrigger).toContainText(/select/i)
    await expect(page.getByRole('listbox')).toBeHidden()

    await sizeTrigger.click()
    const listbox = page.getByRole('listbox')
    await expect(listbox).toBeVisible()
    const options = listbox.getByRole('option')
    await expect(options).not.toHaveCount(0)

    await options.filter({ hasText: '9' }).first().click()
    await expect(sizeTrigger).toContainText('9')
    await expect(listbox).toBeHidden()
  })

  test('sold-out sizes cannot be picked', async ({ page }) => {
    const sizeTrigger = page.getByRole('button', { name: 'Size' })
    await sizeTrigger.click()
    const soldOut = page.getByRole('listbox').getByRole('option').filter({ hasText: /sold out/i }).first()
    await expect(soldOut).toBeDisabled()
  })
})

test.describe('Size guide', () => {
  test('recommends a size from foot length and the US or EU unit', async ({ page }) => {
    await page.getByRole('button', { name: 'Size guide' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    await dialog.getByLabel(/foot length/i).fill('27')
    await dialog.getByRole('radio', { name: 'US' }).check()
    await expect(dialog.getByText(/US \d+/)).toBeVisible()

    await dialog.getByRole('button', { name: /close/i }).click()
    await expect(dialog).toBeHidden()
  })

  test('blocks the page until it is closed', async ({ page }) => {
    // Make the shoe otherwise addable to the cart.
    const sizeTrigger = page.getByRole('button', { name: 'Size' })
    await sizeTrigger.click()
    await page.getByRole('listbox').getByRole('option').filter({ hasText: '9' }).first().click()

    await page.getByRole('button', { name: 'Size guide' }).click()
    // Clicking "Add to cart" behind the modal does nothing.
    await page
      .getByRole('button', { name: 'Add to cart' })
      .click({ timeout: 1500 })
      .catch(() => {})
    await expect(page.getByText(/added to cart/i)).toBeHidden()
  })
})

test.describe('Quantity', () => {
  test('accepts a typed number and steps it up and down by one', async ({ page }) => {
    const quantity = page.getByRole('spinbutton', { name: /quantity/i })
    await quantity.fill('3')
    await expect(quantity).toHaveValue('3')

    await page.getByRole('button', { name: 'Increase quantity' }).click()
    await expect(quantity).toHaveValue('4')

    await page.getByRole('button', { name: 'Decrease quantity' }).click()
    await expect(quantity).toHaveValue('3')
  })
})

test.describe('Add to cart', () => {
  test('asks for a size when none is chosen', async ({ page }) => {
    await page.getByRole('button', { name: 'Add to cart' }).click()
    await expect(page.getByText(/pick a size|choose a size|select a size/i)).toBeVisible()
    await expect(page.getByText(/added to cart/i)).toBeHidden()
  })

  test('adds the shoe and confirms, updating the cart count', async ({ page }) => {
    await page.getByRole('button', { name: 'Size' }).click()
    await page.getByRole('listbox').getByRole('option').filter({ hasText: '9' }).first().click()
    await page.getByRole('button', { name: 'Add to cart' }).click()

    await expect(page.getByText(/added to cart/i)).toBeVisible()
    await expect(page.getByRole('banner')).toContainText(/1/)
  })
})

test.describe('Wishlist', () => {
  test('saves and unsaves the shoe with the heart', async ({ page }) => {
    const heart = page.getByRole('button', { name: /wishlist/i })
    await expect(heart).toHaveAttribute('aria-pressed', 'false')

    await heart.click()
    await expect(heart).toHaveAttribute('aria-pressed', 'true')

    await heart.click()
    await expect(heart).toHaveAttribute('aria-pressed', 'false')
  })
})

test.describe('More information', () => {
  test('shows details, reviews and shipping side by side, one section at a time', async ({ page }) => {
    const tablist = page.getByRole('tablist')
    await expect(tablist.getByRole('tab', { name: 'Details' })).toBeVisible()
    await expect(tablist.getByRole('tab', { name: 'Reviews' })).toBeVisible()
    await expect(tablist.getByRole('tab', { name: 'Shipping' })).toBeVisible()

    // Details is the section shown at first.
    await expect(page.getByRole('tabpanel', { name: 'Details' })).toBeVisible()
    await expect(page.getByRole('tabpanel', { name: 'Reviews' })).toBeHidden()

    // Switching shows only the newly chosen section.
    await tablist.getByRole('tab', { name: 'Shipping' }).click()
    await expect(page.getByRole('tabpanel', { name: 'Shipping' })).toBeVisible()
    await expect(page.getByRole('tabpanel', { name: 'Details' })).toBeHidden()
    await expect(page.getByRole('tabpanel', { name: 'Reviews' })).toBeHidden()
  })
})

test.describe('Questions', () => {
  test('answers stay hidden until their question is opened', async ({ page }) => {
    const faq = page.getByRole('region', { name: /questions/i })
    const question = faq.getByRole('button').first()
    const answer = page.locator(`#${await question.getAttribute('aria-controls')}`)

    await expect(question).toHaveAttribute('aria-expanded', 'false')
    await expect(answer).toBeHidden()

    await question.click()
    await expect(question).toHaveAttribute('aria-expanded', 'true')
    await expect(answer).toBeVisible()

    await question.click()
    await expect(answer).toBeHidden()
  })
})

test.describe('Bottom of the page', () => {
  test('offers customer help, company and social media links', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    await expect(footer).toBeVisible()
    await expect(footer.getByRole('link', { name: /help|contact/i }).first()).toBeVisible()
    await expect(footer.getByRole('link', { name: /company|about/i }).first()).toBeVisible()
    await expect(
      footer.getByRole('link', { name: /instagram|facebook|twitter|youtube|tiktok/i }).first(),
    ).toBeVisible()
  })
})
