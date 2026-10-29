import { test, expect } from '@playwright/test'

const PRODUCT_URL = '/products/trail-runner-2'

test.beforeEach(async ({ page }) => {
  await page.goto(PRODUCT_URL)
})

test('store: shopper sees the store name and how many items are in the cart', async ({ page }) => {
  const banner = page.getByRole('banner')
  await expect(banner).toContainText('Stride')
  await expect(banner.getByText(/cart/i)).toBeVisible()
  await expect(banner.getByText(/cart/i)).toContainText('0')
})

test('path: shopper sees the breadcrumb trail and can go back to an earlier step', async ({ page }) => {
  const breadcrumb = page.getByRole('navigation', { name: /breadcrumb/i })
  await expect(breadcrumb).toBeVisible()
  await expect(breadcrumb.getByRole('link', { name: /shop/i })).toBeVisible()
  await expect(breadcrumb.getByRole('link', { name: /trail/i })).toBeVisible()
  await expect(breadcrumb.getByText('Trail Runner 2')).toBeVisible()

  await breadcrumb.getByRole('link', { name: /shop/i }).click()
  await expect(page).toHaveURL('/')
})

test('photos: only one photo of the shoe is shown at a time', async ({ page }) => {
  const visibleCount = await page
    .getByAltText(/trail runner 2/i)
    .evaluateAll((imgs) => imgs.filter((img) => img.offsetParent !== null).length)
  expect(visibleCount).toBe(1)
})

test('photos: shopper can move to the next or previous photo, wrapping around', async ({ page }) => {
  const currentAlt = () => page.getByAltText(/trail runner 2/i).first().getAttribute('alt')

  const firstAlt = await currentAlt()
  const next = page.getByRole('button', { name: /next/i }).first()
  const previous = page.getByRole('button', { name: /previous/i }).first()

  // Keep going next until we are back at the first photo (wraps after the last one).
  let wrapped = false
  for (let i = 0; i < 10; i++) {
    await next.click()
    if ((await currentAlt()) === firstAlt) {
      wrapped = true
      break
    }
  }
  expect(wrapped, 'clicking next eventually returns to the first photo').toBe(true)

  // Previous from the first photo wraps back to the last one, then next returns to the first.
  await previous.click()
  expect(await currentAlt()).not.toBe(firstAlt)
  await next.click()
  expect(await currentAlt()).toBe(firstAlt)
})

test('price: shopper sees the price and learns it includes taxes by pointing at the "i"', async ({ page }) => {
  await expect(page.getByText(/\$\d/).first()).toBeVisible()

  const info = page.getByRole('button', { name: /price information/i })
  await info.hover()
  await expect(page.getByText(/includes taxes/i)).toBeVisible()
})

test('color: shopper chooses between round blue, black and grey swatches', async ({ page }) => {
  for (const color of ['blue', 'black', 'grey']) {
    const swatch = page.getByRole('button', { name: new RegExp(color, 'i') }).first()
    await swatch.click()

    // The swatch is round.
    const shape = await swatch.evaluate((el) => {
      const { borderRadius } = getComputedStyle(el)
      return { size: el.offsetWidth, radius: parseFloat(borderRadius) }
    })
    expect(shape.radius).toBeGreaterThanOrEqual(shape.size / 2)

    // Only the chosen color shows in the photo.
    const alt = await page.getByAltText(/trail runner 2/i).first().getAttribute('alt')
    expect(alt.toLowerCase()).toContain(color)
  }
})

test('size: the list opens on demand, sold-out sizes cannot be picked, and only the chosen size shows', async ({ page }) => {
  const sizeButton = page.getByRole('button', { name: /select a size/i })
  await sizeButton.click()

  const listbox = page.getByRole('listbox')
  await expect(listbox).toBeVisible()
  const options = listbox.getByRole('option')
  expect(await options.count()).toBeGreaterThan(1)

  // At least one size is sold out and cannot be picked.
  const count = await options.count()
  const disabled = []
  let chosen = null
  for (let i = 0; i < count; i++) {
    const option = options.nth(i)
    if (await option.isDisabled()) disabled.push(option)
    else if (!chosen) chosen = option
  }
  expect(disabled.length).toBeGreaterThan(0)

  const chosenName = (await chosen.textContent()).trim()
  await chosen.click()

  // The list closes and only the chosen size is shown.
  await expect(listbox).toBeHidden()
  await expect(page.getByText(chosenName).first()).toBeVisible()
})

test('size guide: opens over the page, converts foot length to a US or EU size, and must be closed', async ({ page }) => {
  await page.getByRole('button', { name: /size guide/i }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  await dialog.getByLabel(/foot length/i).fill('27')
  await dialog.getByRole('radio', { name: /US/i }).check()
  await expect(dialog.getByText(/US\s?\d+/)).toBeVisible()

  await dialog.getByRole('radio', { name: /EU/i }).check()
  await expect(dialog.getByText(/EU\s?\d+/)).toBeVisible()

  // The page is blocked by the guide until the shopper closes it.
  await dialog.getByRole('button', { name: /close/i }).click()
  await expect(dialog).toBeHidden()
})

test('quantity: shopper types a number or changes it by one', async ({ page }) => {
  const quantity = page.getByRole('spinbutton', { name: /quantity/i })
  await quantity.fill('3')
  await expect(quantity).toHaveValue('3')

  await page.getByRole('button', { name: /increase quantity/i }).click()
  await expect(quantity).toHaveValue('4')

  await page.getByRole('button', { name: /decrease quantity/i }).click()
  await expect(quantity).toHaveValue('3')
})

test('add to cart: without a size the shopper is asked to pick one', async ({ page }) => {
  await page.getByRole('button', { name: /add to cart/i }).click()

  await expect(page.getByText(/pick a size/i)).toBeVisible()
  await expect(page.getByRole('banner').getByText(/cart/i)).toContainText('0')
})

test('add to cart: with a size the shoe is added and a confirmation appears', async ({ page }) => {
  await page.getByRole('button', { name: /select a size/i }).click()
  const options = page.getByRole('listbox').getByRole('option')
  // Pick the first available size.
  const count = await options.count()
  for (let i = 0; i < count; i++) {
    const option = options.nth(i)
    if (await option.isEnabled()) {
      await option.click()
      break
    }
  }

  const quantity = page.getByRole('spinbutton', { name: /quantity/i })
  await quantity.fill('2')

  await page.getByRole('button', { name: /add to cart/i }).click()

  await expect(page.getByText(/added to cart/i)).toBeVisible()
  await expect(page.getByRole('banner').getByText(/cart/i)).toContainText('2')
})

test('wishlist: shopper saves and unsaves the shoe with a heart', async ({ page }) => {
  const heart = page.getByRole('button', { name: /wishlist/i })
  await expect(heart).toHaveAttribute('aria-pressed', 'false')

  await heart.click()
  await expect(heart).toHaveAttribute('aria-pressed', 'true')

  await heart.click()
  await expect(heart).toHaveAttribute('aria-pressed', 'false')
})

test('more information: details, reviews and shipping show one section at a time', async ({ page }) => {
  const tabs = page.getByRole('tab')
  await expect(page.getByRole('tab', { name: /details/i })).toBeVisible()
  await expect(page.getByRole('tab', { name: /reviews/i })).toBeVisible()
  await expect(page.getByRole('tab', { name: /shipping/i })).toBeVisible()
  expect(await tabs.count()).toBe(3)

  await page.getByRole('tab', { name: /reviews/i }).click()
  await expect(page.getByRole('tabpanel', { name: /reviews/i })).toBeVisible()
  await expect(page.getByRole('tabpanel', { name: /details/i })).toBeHidden()

  await page.getByRole('tab', { name: /shipping/i }).click()
  await expect(page.getByRole('tabpanel', { name: /shipping/i })).toBeVisible()
  await expect(page.getByRole('tabpanel', { name: /reviews/i })).toBeHidden()
})

test('questions: answers stay hidden until the shopper opens a question', async ({ page }) => {
  const section = page.locator('section').filter({
    has: page.getByRole('heading', { name: /questions/i }),
  })
  const questions = section.getByRole('button', { name: /.+\?/ })
  expect(await questions.count()).toBeGreaterThanOrEqual(2)

  const first = questions.first()
  await expect(first).toHaveAttribute('aria-expanded', 'false')
  await expect(section.getByRole('paragraph').first()).toBeHidden()

  await first.click()
  await expect(first).toHaveAttribute('aria-expanded', 'true')
  await expect(section.getByRole('paragraph').first()).toBeVisible()
})

test('bottom of the page: customer help, company and social media links', async ({ page }) => {
  const footer = page.getByRole('contentinfo')
  await expect(footer).toBeVisible()

  await expect(footer.getByRole('link', { name: /help/i }).first()).toBeVisible()
  await expect(footer.getByRole('link', { name: /company|about/i }).first()).toBeVisible()

  const social = footer.getByRole('link', { name: /instagram|facebook|twitter|youtube/i })
  expect(await social.count()).toBeGreaterThanOrEqual(2)
})
