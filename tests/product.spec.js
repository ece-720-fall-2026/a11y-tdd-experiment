import { test, expect } from '@playwright/test'

const path = '/products/trail-runner-2'

// **Store:** the shopper sees the store name and how many items are in their cart.
test('shows the store name and the number of items in the cart', async ({ page }) => {
  await page.goto(path)
  await expect(page.getByRole('heading', { name: 'Stride' })).toBeVisible()
  await expect(page.getByText(/cart/i)).toBeVisible()
})

// **Path:** the shopper sees where the shoe sits in the store (Shop > Trail > Trail Runner 2)
// and can go back to any earlier step.
test('shows the breadcrumb trail and links back to earlier steps', async ({ page }) => {
  await page.goto(path)
  const breadcrumbs = page.getByRole('navigation', { name: /breadcrumb/i })
  await expect(breadcrumbs).toContainText('Shop')
  await expect(breadcrumbs).toContainText('Trail')
  await expect(breadcrumbs.getByRole('link', { name: 'Shop' })).toBeVisible()
})

// **Photos:** the shopper sees one photo at a time and can move to the next or previous one,
// going back to the first after the last.
test('shows one photo at a time and wraps around after the last one', async ({ page }) => {
  await page.goto(path)
  const photo = page.getByRole('img', { name: /trail runner 2/i }).first()
  const firstAlt = await photo.getAttribute('alt')

  await page.getByRole('button', { name: /next photo/i }).click()
  await expect(photo).not.toHaveAttribute('alt', firstAlt ?? '')

  // Advance until we come back to the first photo.
  for (let i = 0; i < 5; i++) {
    if ((await photo.getAttribute('alt')) === firstAlt) break
    await page.getByRole('button', { name: /next photo/i }).click()
  }
  await expect(photo).toHaveAttribute('alt', firstAlt ?? '')
})

// **Price:** the shopper sees the price and can point at a small "i" next to it
// to learn that it includes taxes.
test('shows the price and reveals that taxes are included on hover', async ({ page }) => {
  await page.goto(path)
  await expect(page.getByText(/\$\d/).first()).toBeVisible()

  const tooltip = page.getByText(/includes taxes|taxes included/i)
  await expect(tooltip).toBeHidden()
  await page.getByLabel(/taxes included|includes taxes/i).hover()
  await expect(tooltip).toBeVisible()
})

// **Color:** the shopper can choose blue, black or grey; only the chosen color shows until
// they change it, each with a round swatch.
test('switches the shown shoe between blue, black and grey swatches', async ({ page }) => {
  await page.goto(path)

  const blue = page.getByRole('radio', { name: /blue/i })
  const black = page.getByRole('radio', { name: /black/i })
  await expect(blue).toBeVisible()
  await expect(black).toBeVisible()
  await expect(page.getByRole('radio', { name: /grey/i })).toBeVisible()

  // Only the chosen color stays selected until the shopper changes it.
  await black.check()
  await expect(black).toBeChecked()
  await expect(blue).not.toBeChecked()

  await blue.check()
  await expect(blue).toBeChecked()
  await expect(black).not.toBeChecked()
})

// **Size:** the shopper picks one size from a list that only opens when they want to change it;
// only the chosen size shows, and sold-out sizes can't be picked.
test('opens the size list on demand, keeps the choice and blocks sold-out sizes', async ({ page }) => {
  await page.goto(path)

  const sizeCombobox = page.getByRole('combobox', { name: /size/i })
  await sizeCombobox.click()
  await page.getByRole('option', { name: /^8$/ }).click()
  await expect(sizeCombobox).toHaveText(/8/)

  await sizeCombobox.click()
  const soldOut = page.getByRole('option', { name: /sold out/i }).first()
  if (await soldOut.count()) {
    await expect(soldOut).toBeDisabled()
  }
})

// **Size guide:** the shopper can open a size chart over the page, enter their foot length and
// choose US or EU to get their size, and must close it to continue.
test('opens the size guide as a modal, recommends a size and can be closed', async ({ page }) => {
  await page.goto(path)
  await page.getByRole('button', { name: /size guide/i }).click()

  const dialog = page.getByRole('dialog', { name: /size guide/i })
  await expect(dialog).toBeVisible()

  await dialog.getByLabel(/foot length/i).fill('26')
  await dialog.getByRole('radio', { name: /us/i }).check()
  await expect(dialog.getByText(/size/i)).toContainText(/\d/)

  await dialog.getByRole('button', { name: /close/i }).click()
  await expect(dialog).not.toBeVisible()
})

// **Quantity:** the shopper can choose how many pairs to buy, typing the number or changing it by one.
test('changes the quantity by one with the stepper and by typing', async ({ page }) => {
  await page.goto(path)
  const quantity = page.getByRole('spinbutton', { name: /quantity/i })
  await quantity.fill('2')
  await page.getByRole('button', { name: /increase quantity/i }).click()
  await expect(quantity).toHaveValue('3')
  await page.getByRole('button', { name: /decrease quantity/i }).click()
  await expect(quantity).toHaveValue('2')
})

// **Add to cart:** the shopper adds the shoe to the cart and sees a confirmation;
// without a size they are asked to pick one.
test('asks for a size before adding to the cart, then confirms the addition', async ({ page }) => {
  await page.goto(path)

  await page.getByRole('button', { name: /add to cart/i }).click()
  await expect(page.getByText(/pick a size|choose a size|select a size/i)).toBeVisible()

  await page.getByRole('combobox', { name: /size/i }).click()
  await page.getByRole('option', { name: /^8$/ }).click()
  await page.getByRole('button', { name: /add to cart/i }).click()
  await expect(page.getByText(/added to cart/i)).toBeVisible()
})

// **Wishlist:** the shopper can save or unsave the shoe with a heart.
test('saves and unsaves the shoe with the heart button', async ({ page }) => {
  await page.goto(path)
  const heart = page.getByRole('button', { name: /wishlist|save/i })
  await expect(heart).toHaveAttribute('aria-pressed', 'false')

  await heart.click()
  await expect(heart).toHaveAttribute('aria-pressed', 'true')

  await heart.click()
  await expect(heart).toHaveAttribute('aria-pressed', 'false')
})

// **More information:** details, reviews and shipping sit side by side below everything,
// with one section shown at a time.
test('shows details, reviews and shipping as sections with one visible at a time', async ({ page }) => {
  await page.goto(path)

  await page.getByRole('tab', { name: /details/i }).click()
  await expect(page.getByRole('tabpanel', { name: /details/i })).toBeVisible()
  await expect(page.getByRole('tabpanel', { name: /reviews/i })).not.toBeVisible()
  await expect(page.getByRole('tabpanel', { name: /shipping/i })).not.toBeVisible()

  await page.getByRole('tab', { name: /reviews/i }).click()
  await expect(page.getByRole('tabpanel', { name: /reviews/i })).toBeVisible()
  await expect(page.getByRole('tabpanel', { name: /details/i })).not.toBeVisible()
})

// **Questions:** a few common questions about the shoe, each with its answer hidden
// until the shopper opens it.
test('reveals each answer only after opening its question', async ({ page }) => {
  await page.goto(path)
  const question = page.getByRole('button', { name: /waterproof|water|question/i }).first()
  await question.click()
  await expect(page.getByRole('region', { name: /waterproof|water|question/i }).first()).toBeVisible()
})

// **Bottom of the page:** the shopper finds customer help, company and social media links.
test('lists customer help, company and social media links in the footer', async ({ page }) => {
  await page.goto(path)
  const footer = page.getByRole('contentinfo')
  await expect(footer).toContainText(/help|support/i)
  await expect(footer).toContainText(/company|about/i)
  await expect(footer).toContainText(/instagram|facebook|twitter|x\.com|youtube/i)
})
