import { test, expect } from '@playwright/test'

const URL = '/products/trail-runner-2'

test.beforeEach(async ({ page }) => {
  await page.goto(URL)
})

// Reads the number shown on the cart link, e.g. "Cart (2)".
async function cartCount(page) {
  const text = await page.getByRole('link', { name: /cart/i }).textContent()
  return Number(text.match(/\d+/)[0])
}

test.describe('Store', () => {
  test('shows the store name and the number of items in the cart', async ({ page }) => {
    await expect(page.getByRole('banner')).toContainText('Stride')
    await expect(page.getByRole('link', { name: /cart/i })).toHaveAccessibleName(/cart.*\d+/i)
  })
})

test.describe('Path', () => {
  test('shows where the shoe sits in the store with links back to earlier steps', async ({ page }) => {
    const path = page.getByRole('navigation', { name: 'Breadcrumb' })

    await expect(path.getByRole('link', { name: 'Shop' })).toHaveAttribute('href', /.+/)
    await expect(path.getByRole('link', { name: 'Trail' })).toHaveAttribute('href', /.+/)
    await expect(path.getByText('Trail Runner 2')).toBeVisible()
  })
})

test.describe('Photos', () => {
  const photo = (page) => page.getByRole('img', { name: /Trail Runner 2/ })
  const shownSrc = async (page) => photo(page).getAttribute('src')

  test('shows one photo at a time and wraps from the last photo back to the first', async ({ page }) => {
    const next = page.getByRole('button', { name: 'Next photo' })
    await expect(photo(page)).toHaveCount(1)

    const first = await shownSrc(page)
    const seen = new Set([first])
    let wrapped = false

    for (let i = 0; i < 10 && !wrapped; i++) {
      await next.click()
      const src = await shownSrc(page)
      if (src === first) wrapped = true
      else seen.add(src)
    }

    expect(seen.size).toBeGreaterThan(1)
    expect(wrapped).toBe(true)
  })

  test('moves back to the previous photo', async ({ page }) => {
    const first = await shownSrc(page)

    await page.getByRole('button', { name: 'Next photo' }).click()
    await expect.poll(() => shownSrc(page)).not.toBe(first)

    await page.getByRole('button', { name: 'Previous photo' }).click()
    await expect.poll(() => shownSrc(page)).toBe(first)
  })
})

test.describe('Price', () => {
  test('shows the price', async ({ page }) => {
    await expect(page.getByText(/[$€£]\s?\d/).first()).toBeVisible()
  })

  test('explains on hover of the info icon that the price includes taxes', async ({ page }) => {
    await page.getByRole('button', { name: 'Price information' }).hover()

    await expect(page.getByText(/includes taxes/i)).toBeVisible()
  })
})

test.describe('Color', () => {
  test('shows only the chosen color', async ({ page }) => {
    const color = page.getByRole('group', { name: 'Color' })

    await expect(color.getByRole('radio')).toHaveCount(1)
    await expect(color.getByRole('radio')).toBeChecked()
  })

  test('lets the shopper change to blue, black or grey', async ({ page }) => {
    const color = page.getByRole('group', { name: 'Color' })

    await color.getByRole('button', { name: 'Change color' }).click()
    await expect(color.getByRole('radio', { name: 'Blue' })).toBeVisible()
    await expect(color.getByRole('radio', { name: 'Black' })).toBeVisible()
    await expect(color.getByRole('radio', { name: 'Grey' })).toBeVisible()

    await color.getByRole('radio', { name: 'Black' }).click()

    await expect(color.getByRole('radio')).toHaveCount(1)
    await expect(color.getByRole('radio', { name: 'Black' })).toBeChecked()
  })
})

test.describe('Size', () => {
  test('keeps the size list closed until the shopper opens it', async ({ page }) => {
    await expect(page.getByRole('radio', { name: /^\d+/ })).toHaveCount(0)

    await page.getByRole('button', { name: 'Change size' }).click()

    await expect(page.getByRole('radio', { name: /^\d+/ }).first()).toBeVisible()
  })

  test('lets the shopper pick a size, then shows only that size', async ({ page }) => {
    const size = page.getByRole('group', { name: 'Size' })

    await page.getByRole('button', { name: 'Change size' }).click()
    await page.getByRole('radio', { name: '10', exact: true }).click()

    await expect(page.getByRole('radio', { name: /^\d+/ })).toHaveCount(0)
    await expect(size).toContainText('10')
  })

  test('does not allow picking a sold-out size', async ({ page }) => {
    await page.getByRole('button', { name: 'Change size' }).click()

    await expect(page.getByRole('radio', { name: /sold out/i }).first()).toBeDisabled()
  })
})

test.describe('Size guide', () => {
  test('recommends a size from foot length in the chosen unit', async ({ page }) => {
    await page.getByRole('button', { name: 'Size guide' }).click()
    const dialog = page.getByRole('dialog', { name: /size guide/i })

    await dialog.getByLabel(/foot length/i).fill('27')
    await dialog.getByLabel('EU').check()

    await expect(dialog.getByRole('status')).toContainText(/\d/)
  })

  test('closes with the close button so the shopper can continue', async ({ page }) => {
    await page.getByRole('button', { name: 'Size guide' }).click()
    const dialog = page.getByRole('dialog', { name: /size guide/i })
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', { name: 'Close' }).click()

    await expect(dialog).toBeHidden()
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible()
  })
})

test.describe('Quantity', () => {
  test('lets the shopper type a quantity', async ({ page }) => {
    const quantity = page.getByRole('spinbutton', { name: 'Quantity' })

    await quantity.fill('3')

    await expect(quantity).toHaveValue('3')
  })

  test('changes the quantity by one with the plus and minus buttons', async ({ page }) => {
    const quantity = page.getByRole('spinbutton', { name: 'Quantity' })
    const start = await quantity.inputValue()

    await page.getByRole('button', { name: 'Increase quantity' }).click()
    await expect(quantity).toHaveValue(String(Number(start) + 1))

    await page.getByRole('button', { name: 'Decrease quantity' }).click()
    await expect(quantity).toHaveValue(start)
  })
})

test.describe('Add to cart', () => {
  test('asks the shopper to pick a size when none is chosen', async ({ page }) => {
    const before = await cartCount(page)

    await page.getByRole('button', { name: 'Add to cart' }).click()

    await expect(page.getByRole('alert')).toContainText(/size/i)
    expect(await cartCount(page)).toBe(before)
  })

  test('adds the shoe to the cart with a size and confirms it', async ({ page }) => {
    const before = await cartCount(page)

    await page.getByRole('button', { name: 'Change size' }).click()
    await page.getByRole('radio', { name: '10', exact: true }).click()
    await page.getByRole('button', { name: 'Add to cart' }).click()

    await expect(page.getByRole('status')).toContainText(/added to (your )?cart/i)
    await expect.poll(() => cartCount(page)).toBe(before + 1)
  })
})

test.describe('Wishlist', () => {
  test('saves and unsaves the shoe with the heart', async ({ page }) => {
    const heart = page.getByRole('button', { name: 'Wishlist' })
    await expect(heart).toHaveAttribute('aria-pressed', 'false')

    await heart.click()
    await expect(heart).toHaveAttribute('aria-pressed', 'true')

    await heart.click()
    await expect(heart).toHaveAttribute('aria-pressed', 'false')
  })
})

test.describe('More information', () => {
  test('shows one of details, reviews and shipping at a time', async ({ page }) => {
    const tabs = page.getByRole('tablist')

    await expect(tabs.getByRole('tab', { name: 'Details' })).toBeVisible()
    await expect(tabs.getByRole('tab', { name: 'Reviews' })).toBeVisible()
    await expect(tabs.getByRole('tab', { name: 'Shipping' })).toBeVisible()
    await expect(page.getByRole('tabpanel')).toHaveCount(1)

    await tabs.getByRole('tab', { name: 'Reviews' }).click()

    await expect(tabs.getByRole('tab', { name: 'Reviews' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel')).toHaveCount(1)
  })

  test('sits below everything else, with its three sections side by side', async ({ page }) => {
    const tabs = page.getByRole('tablist')
    const addToCart = page.getByRole('button', { name: 'Add to cart' })
    const questions = page.getByRole('region', { name: 'Questions' })

    const tabsBox = await tabs.boundingBox()
    const cartBox = await addToCart.boundingBox()
    const questionsBox = await questions.boundingBox()
    const details = await tabs.getByRole('tab', { name: 'Details' }).boundingBox()
    const shipping = await tabs.getByRole('tab', { name: 'Shipping' }).boundingBox()

    expect(tabsBox.y).toBeGreaterThan(cartBox.y + cartBox.height)
    expect(tabsBox.y).toBeGreaterThan(questionsBox.y + questionsBox.height)
    expect(Math.abs(details.y - shipping.y)).toBeLessThan(2)
  })
})

test.describe('Questions', () => {
  test('hides each answer until the shopper opens its question', async ({ page }) => {
    const questions = page.getByRole('region', { name: 'Questions' })
    const question = questions.getByRole('button').first()

    expect(await questions.getByRole('button').count()).toBeGreaterThanOrEqual(3)
    await expect(question).toHaveAttribute('aria-expanded', 'false')
    const answer = page.locator(`[id="${await question.getAttribute('aria-controls')}"]`)
    await expect(answer).toBeHidden()

    await question.click()

    await expect(question).toHaveAttribute('aria-expanded', 'true')
    await expect(answer).toBeVisible()
  })
})

test.describe('Footer', () => {
  test('shows customer help, company and social media links', async ({ page }) => {
    const footer = page.getByRole('contentinfo')

    for (const heading of ['Customer help', 'Company', 'Social media']) {
      await expect(footer.getByRole('heading', { name: heading })).toBeVisible()
    }
    await expect(footer.getByRole('link')).not.toHaveCount(0)
  })
})
