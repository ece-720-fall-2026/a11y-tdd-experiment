import { test, expect } from '@playwright/test'

const PRODUCT_URL = '/products/trail-runner-2'

test.beforeEach(async ({ page }) => {
  await page.goto(PRODUCT_URL)
})

// Store
test('shows the store name and the number of items in the cart', async ({ page }) => {
  await expect(page.getByRole('banner')).toContainText('Stride')
  await expect(page.getByRole('link', { name: /cart/i })).toContainText('0')
})

// Path
test('shows the path and lets the shopper go back to an earlier step', async ({ page }) => {
  const path = page.getByRole('navigation', { name: /breadcrumb/i })
  await expect(path.getByRole('link', { name: 'Shop' })).toBeVisible()
  await expect(path.getByRole('link', { name: 'Trail' })).toBeVisible()
  await expect(path).toContainText('Trail Runner 2')

  await path.getByRole('link', { name: 'Trail' }).click()
  await expect(page).not.toHaveURL(new RegExp(`${PRODUCT_URL}$`))
})

// Photos
test('shows one photo at a time and moves to the next and previous photo', async ({ page }) => {
  const photo = page.getByRole('img', { name: /trail runner 2/i })
  const first = await photo.getAttribute('src')

  await page.getByRole('button', { name: /next/i }).click()
  await expect(photo).not.toHaveAttribute('src', first)

  await page.getByRole('button', { name: /previous/i }).click()
  await expect(photo).toHaveAttribute('src', first)
})

test('goes back to the first photo after the last one', async ({ page }) => {
  const photo = page.getByRole('img', { name: /trail runner 2/i })
  const first = await photo.getAttribute('src')
  const next = page.getByRole('button', { name: /next/i })

  for (let i = 0; i < 10; i++) {
    await next.click()
    if ((await photo.getAttribute('src')) === first) break
  }
  await expect(photo).toHaveAttribute('src', first)
})

// Price
test('explains that the price includes taxes from the info icon', async ({ page }) => {
  await expect(page.getByText(/[$€£]\s?\d+/).first()).toBeVisible()

  await page.getByRole('button', { name: /price/i }).click()
  await expect(page.getByText(/includes taxes/i)).toBeVisible()
})

// Color
test('shows only the chosen color until the shopper changes it', async ({ page }) => {
  const colorName = /^(blue|black|grey)$/i
  const swatches = page.getByRole('button', { name: colorName })
  await expect(swatches).toHaveCount(1)
  await expect(swatches).toHaveCSS('border-radius', /50%|9999px/)

  await swatches.click()
  await page.getByRole('button', { name: /^black$/i }).click()
  await expect(page.getByRole('button', { name: colorName })).toHaveCount(1)
  await expect(page.getByRole('button', { name: /^black$/i })).toBeVisible()
})

// Size
test('shows only the chosen size, picked from a list that opens on demand', async ({ page }) => {
  const sizeButton = page.getByRole('button', { name: /^size(?! guide)/i })
  await expect(sizeButton).toBeVisible()
  await expect(page.getByRole('option')).toHaveCount(0)

  await sizeButton.click()
  const options = page.getByRole('option')
  expect(await options.count()).toBeGreaterThan(1)

  const chosen = options.locator(':not([disabled]):not([aria-disabled="true"])').first()
  const label = (await chosen.textContent()).trim()
  await chosen.click()

  await expect(page.getByRole('option')).toHaveCount(0)
  await expect(sizeButton).toContainText(label)
})

test('does not let the shopper pick a sold-out size', async ({ page }) => {
  await page.getByRole('button', { name: /^size(?! guide)/i }).click()
  const soldOut = page.getByRole('option', { name: /sold out/i })
  await expect(soldOut.first()).toBeDisabled()
})

// Size guide
test('opens a size chart from the size and returns a size for a foot length', async ({ page }) => {
  await page.getByRole('button', { name: /size guide/i }).click()

  const dialog = page.getByRole('dialog', { name: /size guide/i })
  await expect(dialog).toBeVisible()
  await dialog.getByLabel(/foot length/i).fill('26')
  await dialog.getByLabel('US', { exact: true }).check()
  await expect(dialog).toContainText(/your size/i)

  await dialog.getByRole('button', { name: /close/i }).click()
  await expect(dialog).toBeHidden()
})

test('blocks the rest of the page while the size guide is open', async ({ page }) => {
  await page.getByRole('button', { name: /size guide/i }).click()
  await expect(page.getByRole('dialog', { name: /size guide/i })).toBeVisible()

  const isCoveredByDialog = await page.evaluate(() => {
    const button = [...document.querySelectorAll('button')].find((b) =>
      /add to cart/i.test(b.textContent),
    )
    const r = button.getBoundingClientRect()
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
    return !button.contains(hit)
  })
  expect(isCoveredByDialog).toBe(true)
})

// Quantity
test('lets the shopper type the quantity', async ({ page }) => {
  const quantity = page.getByRole('spinbutton', { name: /quantity/i })
  await expect(quantity).toHaveValue('1')

  await quantity.fill('3')
  await expect(quantity).toHaveValue('3')
})

test('lets the shopper change the quantity by one', async ({ page }) => {
  const quantity = page.getByRole('spinbutton', { name: /quantity/i })

  await page.getByRole('button', { name: /increase quantity/i }).click()
  await expect(quantity).toHaveValue('2')

  await page.getByRole('button', { name: /decrease quantity/i }).click()
  await expect(quantity).toHaveValue('1')
})

// Add to cart
test('adds the chosen size and quantity to the cart and confirms it', async ({ page }) => {
  await page.getByRole('button', { name: /^size(?! guide)/i }).click()
  await page.getByRole('option').locator(':not([disabled])').first().click()
  await page.getByRole('spinbutton', { name: /quantity/i }).fill('2')

  await page.getByRole('button', { name: /add to cart/i }).click()
  await expect(page.getByText(/added to (your )?cart/i)).toBeVisible()
  await expect(page.getByRole('link', { name: /cart/i })).toContainText('2')
})

test('asks the shopper to pick a size before adding to the cart', async ({ page }) => {
  await page.getByRole('button', { name: /add to cart/i }).click()

  await expect(page.getByText(/select a size|choose a size|pick a size/i)).toBeVisible()
  await expect(page.getByText(/added to (your )?cart/i)).toBeHidden()
  await expect(page.getByRole('link', { name: /cart/i })).toContainText('0')
})

// Wishlist
test('saves and unsaves the shoe with the heart', async ({ page }) => {
  const heart = page.getByRole('button', { name: /wishlist/i })
  await expect(heart).toHaveAttribute('aria-pressed', 'false')

  await heart.click()
  await expect(heart).toHaveAttribute('aria-pressed', 'true')

  await heart.click()
  await expect(heart).toHaveAttribute('aria-pressed', 'false')
})

// More information
test('shows details, reviews and shipping side by side below the purchase options', async ({ page }) => {
  const tabs = page.getByRole('tab', { name: /details|reviews|shipping/i })
  await expect(tabs).toHaveCount(3)

  const boxes = await tabs.evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.x, y: r.y }
    }),
  )
  const [first, ...rest] = boxes
  for (const box of rest) {
    expect(Math.abs(box.y - first.y)).toBeLessThan(2)
  }
  const addToCart = await page.getByRole('button', { name: /add to cart/i }).boundingBox()
  expect(first.y).toBeGreaterThan(addToCart.y)
})

test('shows one information section at a time', async ({ page }) => {
  await expect(page.getByRole('tabpanel')).toHaveCount(1)

  await page.getByRole('tab', { name: /reviews/i }).click()
  await expect(page.getByRole('tab', { name: /reviews/i })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel')).toHaveCount(1)
})

// Questions
test('hides each answer until the shopper opens its question', async ({ page }) => {
  const questions = page.getByRole('button', { name: /\?$/ })
  expect(await questions.count()).toBeGreaterThanOrEqual(3)

  const question = questions.first()
  const answerId = await question.getAttribute('aria-controls')
  const answer = page.locator(`[id="${answerId}"]`)

  await expect(question).toHaveAttribute('aria-expanded', 'false')
  await expect(answer).toBeHidden()

  await question.click()
  await expect(question).toHaveAttribute('aria-expanded', 'true')
  await expect(answer).toBeVisible()
})

// Bottom of the page
test('lists customer help, company and social media links in the footer', async ({ page }) => {
  const footer = page.getByRole('contentinfo')
  await expect(footer.getByRole('heading', { name: /customer help/i })).toBeVisible()
  await expect(footer.getByRole('heading', { name: /company/i })).toBeVisible()
  await expect(footer.getByRole('heading', { name: /social media/i })).toBeVisible()
  await expect(
    footer.getByRole('link', { name: /facebook|instagram|x|twitter|youtube|tiktok/i }).first(),
  ).toBeVisible()
})
