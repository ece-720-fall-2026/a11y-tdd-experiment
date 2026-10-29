import { test, expect } from '@playwright/test'

const PRODUCT_PATH = '/products/trail-runner-2'

// The size picker button; excludes the "Size guide" button next to it.
const sizeButton = (page) =>
  page.getByRole('button', { name: /^size/i }).filter({ hasNotText: /guide/i })

test.beforeEach(async ({ page }) => {
  await page.goto(PRODUCT_PATH)
})

// Store: store name and cart count
test('shows the store name and the number of items in the cart', async ({ page }) => {
  const header = page.getByRole('banner')
  await expect(header.getByText('Stride', { exact: true })).toBeVisible()
  await expect(header.getByRole('link', { name: /cart/i })).toContainText('0')
})

// Path: breadcrumb with links back to earlier steps
test('shows where the shoe sits in the store and lets the shopper go back', async ({ page }) => {
  const path = page.getByRole('navigation', { name: /breadcrumb/i })
  for (const step of ['Shop', 'Trail', 'Trail Runner 2']) {
    await expect(path.getByText(step, { exact: true })).toBeVisible()
  }

  await path.getByRole('link', { name: 'Trail', exact: true }).click()
  await expect(page).not.toHaveURL(new RegExp(PRODUCT_PATH))
})

// Photos: one at a time, next/previous, wraps from last back to first
test('shows one photo at a time and wraps from the last photo to the first', async ({ page }) => {
  const shown = page.getByRole('img', { name: /Trail Runner 2/ }).filter({ visible: true })
  await expect(shown).toHaveCount(1)

  const first = await shown.getAttribute('src')
  const next = page.getByRole('button', { name: /next/i })
  const previous = page.getByRole('button', { name: /previous/i })

  await next.click()
  await expect(shown).not.toHaveAttribute('src', first)
  await previous.click()
  await expect(shown).toHaveAttribute('src', first)

  // Walk forward until the photo repeats; it must loop back to the first one.
  const seen = new Set()
  for (let i = 0; i < 30; i++) {
    seen.add(await shown.getAttribute('src'))
    await next.click()
    if ((await shown.getAttribute('src')) === first) break
  }
  await expect(shown).toHaveAttribute('src', first)
  expect(seen.size).toBeGreaterThan(1)
})

// Price: price shown, "i" explains that it includes taxes
test('shows the price and explains on hover that it includes taxes', async ({ page }) => {
  await expect(page.getByText(/\$\s?\d+/).first()).toBeVisible()

  await page.getByRole('button', { name: /price information/i }).hover()
  await expect(page.getByText(/includes? (all )?taxes/i)).toBeVisible()
})

// Color: collapsed to the chosen color; opens to round swatches
test('shows only the chosen color until the shopper opens the color choices', async ({ page }) => {
  const swatches = page.getByRole('radiogroup', { name: /color/i })
  await expect(swatches).toBeHidden()

  await page.getByRole('button', { name: /color/i }).click()
  for (const color of ['Blue', 'Black', 'Grey']) {
    const swatch = swatches.getByRole('radio', { name: color, exact: true })
    await expect(swatch).toBeVisible()
    const isRound = await swatch.evaluate((el) => {
      const radius = getComputedStyle(el).borderTopLeftRadius
      return radius === '50%' || parseFloat(radius) >= el.offsetWidth / 2
    })
    expect(isRound, `${color} swatch should be round`).toBe(true)
  }
})

test('choosing a color changes the shown color and closes the choices', async ({ page }) => {
  await page.getByRole('button', { name: /color/i }).click()
  await page.getByRole('radio', { name: 'Black', exact: true }).click()

  await expect(page.getByRole('radiogroup', { name: /color/i })).toBeHidden()
  await expect(page.getByRole('button', { name: /color/i })).toContainText(/black/i)
})

// Size: list opens on demand; chosen size only; sold-out sizes can't be picked
test('opens the size list only when asked and shows only the chosen size', async ({ page }) => {
  const sizes = page.getByRole('listbox', { name: /size/i })
  await expect(sizes).toBeHidden()

  await sizeButton(page).click()
  await expect(sizes).toBeVisible()
  await sizes.getByRole('option', { disabled: false }).first().click()

  await expect(sizes).toBeHidden()
  await expect(sizeButton(page)).not.toContainText(/select/i)
})

test('sold-out sizes cannot be picked', async ({ page }) => {
  await sizeButton(page).click()
  const soldOut = page.getByRole('listbox', { name: /size/i }).getByRole('option', { disabled: true }).first()
  await expect(soldOut).toBeVisible()
  await expect(soldOut).toBeDisabled()

  const before = await sizeButton(page).textContent()
  await soldOut.click({ force: true })
  await expect(sizeButton(page)).toHaveText(before)
})

// Size guide: converts foot length to a size in a modal; must be closed to continue
test('size guide converts foot length to a size in US or EU', async ({ page }) => {
  await page.getByRole('button', { name: /size guide/i }).click()
  const guide = page.getByRole('dialog', { name: /size guide/i })
  await expect(guide).toBeVisible()

  await guide.getByLabel(/foot length/i).fill('27')
  await guide.getByRole('radio', { name: 'EU', exact: true }).check()
  await guide.getByRole('button', { name: /find my size|calculate|get my size/i }).click()
  await expect(guide).toContainText(/EU\s*\d+/)
})

test('size guide is modal and must be closed before continuing', async ({ page }) => {
  await page.getByRole('button', { name: /size guide/i }).click()
  const guide = page.getByRole('dialog', { name: /size guide/i })
  await expect(guide).toHaveAttribute('aria-modal', 'true')

  await guide.getByRole('button', { name: /close/i }).click()
  await expect(guide).toBeHidden()
})

// Quantity: type a number, or step by one
test('lets the shopper type the quantity', async ({ page }) => {
  const quantity = page.getByRole('spinbutton', { name: /quantity/i })
  await quantity.fill('3')
  await expect(quantity).toHaveValue('3')
})

test('changes the quantity by one with the plus and minus buttons', async ({ page }) => {
  const quantity = page.getByRole('spinbutton', { name: /quantity/i })
  await expect(quantity).toHaveValue('1')

  await page.getByRole('button', { name: /increase quantity/i }).click()
  await expect(quantity).toHaveValue('2')
  await page.getByRole('button', { name: /decrease quantity/i }).click()
  await expect(quantity).toHaveValue('1')
})

// Add to cart: needs a size; confirms and updates the cart count
test('adds the shoe to the cart with a size and shows a confirmation', async ({ page }) => {
  await sizeButton(page).click()
  await page.getByRole('listbox', { name: /size/i }).getByRole('option', { disabled: false }).first().click()

  await page.getByRole('button', { name: /add to cart/i }).click()
  await expect(page.getByText(/added to (your )?cart/i)).toBeVisible()
  await expect(page.getByRole('banner').getByRole('link', { name: /cart/i })).toContainText('1')
})

test('asks for a size when adding to cart without one', async ({ page }) => {
  await page.getByRole('button', { name: /add to cart/i }).click()
  await expect(page.getByText(/(select|choose|pick) a size/i)).toBeVisible()
  await expect(page.getByRole('banner').getByRole('link', { name: /cart/i })).toContainText('0')
})

// Wishlist: heart saves and unsaves
test('saves and unsaves the shoe with the heart', async ({ page }) => {
  const heart = page.getByRole('button', { name: /wishlist/i })
  await heart.click()
  await expect(heart).toHaveAttribute('aria-pressed', 'true')
  await heart.click()
  await expect(heart).toHaveAttribute('aria-pressed', 'false')
})

// More information: three tabs side by side below everything; one panel at a time
test('shows details, reviews and shipping side by side below everything else', async ({ page }) => {
  const tabs = ['Details', 'Reviews', 'Shipping'].map((name) => page.getByRole('tab', { name, exact: true }))
  for (const tab of tabs) await expect(tab).toBeVisible()

  const boxes = await Promise.all(tabs.map((tab) => tab.boundingBox()))
  const tops = boxes.map((box) => Math.round(box.y))
  expect(new Set(tops).size, 'tabs should share one row').toBe(1)

  const addToCart = await page.getByRole('button', { name: /add to cart/i }).boundingBox()
  const questions = await page.getByRole('heading', { name: /questions/i }).boundingBox()
  const footer = await page.getByRole('contentinfo').boundingBox()
  expect(boxes[0].y).toBeGreaterThan(addToCart.y + addToCart.height)
  expect(boxes[0].y).toBeGreaterThan(questions.y + questions.height)
  expect(footer.y).toBeGreaterThan(boxes[0].y + boxes[0].height)
})

test('shows one section at a time in more information', async ({ page }) => {
  await page.getByRole('tab', { name: 'Details', exact: true }).click()
  await expect(page.getByRole('tabpanel')).toHaveCount(1)
  await expect(page.getByRole('tabpanel')).toBeVisible()
  const detailsPanel = await page.getByRole('tabpanel').textContent()

  await page.getByRole('tab', { name: 'Reviews', exact: true }).click()
  await expect(page.getByRole('tabpanel').filter({ visible: true })).toHaveCount(1)
  await expect(page.getByRole('tab', { name: 'Reviews', exact: true })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tab', { name: 'Details', exact: true })).toHaveAttribute('aria-selected', 'false')
  expect(await page.getByRole('tabpanel').filter({ visible: true }).textContent()).not.toBe(detailsPanel)
})

// Questions: answers hidden until opened
test('hides each answer until its question is opened', async ({ page }) => {
  const questions = page.getByRole('region', { name: /questions/i }).getByRole('button')
  expect(await questions.count()).toBeGreaterThanOrEqual(3)

  const first = questions.first()
  await expect(first).toHaveAttribute('aria-expanded', 'false')
  const answer = page.locator(`[id="${await first.getAttribute('aria-controls')}"]`)
  await expect(answer).toBeHidden()

  await first.click()
  await expect(first).toHaveAttribute('aria-expanded', 'true')
  await expect(answer).toBeVisible()
})

// Bottom of the page: customer help, company and social media links
test('footer has customer help, company and social media links', async ({ page }) => {
  const footer = page.getByRole('contentinfo')
  await expect(footer.getByText(/customer (care|help)/i)).toBeVisible()
  await expect(footer.getByRole('link', { name: /help center/i })).toBeVisible()
  await expect(footer.getByRole('link', { name: /about us/i })).toBeVisible()

  const social = footer.getByRole('link', { name: /instagram|facebook|youtube|twitter|x$|linkedin|threads|tiktok/i })
  expect(await social.count()).toBeGreaterThanOrEqual(3)
})
