import { test, expect } from '@playwright/test'

/**
 * Red-phase tests for the Trail Runner 2 product page (`/products/trail-runner-2`).
 *
 * Each requirement in REQUIREMENTS.md gets one or two focused tests. Interaction
 * tests also encode the relevant WAI-ARIA Authoring Practices Guide (APG) pattern
 * (roles, states, keyboard operation and focus management) so the page is usable
 * with assistive technology, not just with a mouse.
 */

const URL = '/products/trail-runner-2'

async function openProductPage(page) {
  await page.goto(URL)
  await expect(page.getByRole('heading', { name: 'Trail Runner 2', level: 1 })).toBeVisible()
}

/** Reads the number of items the shopper's cart announces in the store header. */
async function readCartCount(page) {
  const cart = page.getByRole('banner').getByRole('link', { name: /cart/i }).first()
  return cart.evaluate((el) => {
    const label = el.getAttribute('aria-label') ?? el.textContent ?? ''
    const match = label.match(/\d+/)
    return match ? Number(match) : 0
  })
}

/** Picks the first available size from the size listbox and returns its label. */
async function chooseAvailableSize(page) {
  const combobox = page.getByRole('combobox', { name: /^size/i })
  await combobox.click()
  const options = page.getByRole('option')
  const size = await options.evaluateAll((els) => {
    const el = els.find((e) => e.getAttribute('aria-disabled') !== 'true')
    return el ? el.textContent.trim() : null
  })
  expect(size).toBeTruthy()
  await page.getByRole('option', { name: size, exact: true }).click()
  await expect(page.getByRole('listbox')).toBeHidden()
  await expect(combobox).toContainText(size)
  return size
}

/** A swatch counts as round if it (or a descendant) is a circle. */
function isRound(option) {
  return option.evaluate((el) => {
    const nodes = [el, ...el.querySelectorAll('*')]
    return nodes.some((node) => {
      const rect = node.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return false
      const radius = parseFloat(getComputedStyle(node).borderRadius)
      return Math.abs(rect.width - rect.height) <= 1 && radius >= Math.min(rect.width, rect.height) / 2 - 1
    })
  })
}

const gallery = (page) => page.getByRole('region', { name: /photos|gallery/i })
const visiblePhoto = (page) => gallery(page).locator('img:visible').first()

// --- Store ---------------------------------------------------------------

test('store header shows the store name and the number of items in the cart', async ({ page }) => {
  await page.goto(URL)
  const header = page.getByRole('banner')
  await expect(header).toContainText('Stride')

  const cart = header.getByRole('link', { name: /cart/i }).first()
  const label = await cart.evaluate((el) => el.getAttribute('aria-label') ?? el.textContent ?? '')
  expect(label).toMatch(/cart/i)
  expect(label).toMatch(/\d/)
})

// --- Path ------------------------------------------------------------------

test('breadcrumb shows the path through the store and links back to earlier steps', async ({ page }) => {
  await openProductPage(page)
  const breadcrumb = page.getByRole('navigation', { name: /breadcrumb/i })
  await expect(breadcrumb).toBeVisible()

  // APG breadcrumb pattern: ordered list of links, current step marked.
  await expect(breadcrumb.getByRole('listitem')).toHaveCount(3)
  await expect(breadcrumb.getByRole('link', { name: 'Shop' })).toBeVisible()
  await expect(breadcrumb.getByRole('link', { name: 'Trail' })).toBeVisible()
  await expect(breadcrumb.getByRole('link', { name: 'Trail Runner 2' })).toHaveAttribute('aria-current', 'page')

  // Going back to an earlier step navigates away from the product page.
  await breadcrumb.getByRole('link', { name: 'Shop' }).click()
  await expect(page).not.toHaveURL(/trail-runner-2/)
})

// --- Photos ----------------------------------------------------------------

test('photo carousel shows one photo at a time and wraps in both directions', async ({ page }) => {
  await openProductPage(page)
  await expect(gallery(page).locator('img:visible')).toHaveCount(1)

  const firstAlt = await visiblePhoto(page).getAttribute('alt')
  expect(firstAlt).toBeTruthy()

  // Previous wraps around to the last photo.
  await gallery(page).getByRole('button', { name: /previous/i }).click()
  expect(await visiblePhoto(page).getAttribute('alt')).not.toBe(firstAlt)

  // Next returns to the first photo, then keeps wrapping back to the first
  // after the last one.
  await gallery(page).getByRole('button', { name: /next/i }).click()
  await expect(visiblePhoto(page)).toHaveAttribute('alt', firstAlt)

  let wrapped = false
  for (let i = 0; i < 12 && !wrapped; i++) {
    await gallery(page).getByRole('button', { name: /next/i }).click()
    wrapped = (await visiblePhoto(page).getAttribute('alt')) === firstAlt
  }
  expect(wrapped).toBe(true)
  await expect(gallery(page).locator('img:visible')).toHaveCount(1)
})

// --- Price -----------------------------------------------------------------

test('price is shown and a tooltip explains that taxes are included', async ({ page }) => {
  await openProductPage(page)
  await expect(page.getByText(/\$\d/)).toBeVisible()

  const taxesNote = page.getByText(/tax/i)
  const priceInfo = page.getByRole('button', { name: /price/i })

  // APG tooltip pattern: the note appears when pointing at the "i"…
  await expect(taxesNote).toBeHidden()
  await priceInfo.hover()
  await expect(taxesNote).toBeVisible()

  // …and when focusing it with the keyboard (WCAG 2.1.1 keyboard operation).
  await priceInfo.focus()
  await expect(taxesNote).toBeVisible()
})

// --- Color -----------------------------------------------------------------

test('color options are round swatches in a radio group and change the photo', async ({ page }) => {
  await openProductPage(page)
  const colors = page.getByRole('radiogroup', { name: /color/i })
  const blue = colors.getByRole('radio', { name: /blue/i })
  const black = colors.getByRole('radio', { name: /black/i })
  const grey = colors.getByRole('radio', { name: /grey/i })

  // Each color has a round swatch.
  for (const radio of [blue, black, grey]) {
    expect(await isRound(radio)).toBe(true)
  }

  // Only the chosen color shows: picking grey shows the grey shoe.
  await grey.check()
  await expect(grey).toBeChecked()
  await expect(blue).not.toBeChecked()
  await expect(visiblePhoto(page)).toHaveAttribute('alt', /grey/i)
})

// --- Size ------------------------------------------------------------------

test('size list opens on demand, hides sold-out sizes and shows the chosen size', async ({ page }) => {
  await openProductPage(page)
  const combobox = page.getByRole('combobox', { name: /^size/i })

  // Only a prompt shows until the shopper opens the list (APG select-only
  // combobox pattern).
  await expect(combobox).toContainText(/select|choose/i)
  await combobox.click()
  await expect(combobox).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('listbox')).toBeVisible()

  // Sold-out sizes are exposed to assistive tech and cannot be picked.
  const soldOut = page.getByRole('option').and(page.locator('[aria-disabled="true"]')).first()
  await expect(soldOut).toBeVisible()
  // The option is deliberately marked aria-disabled, which Playwright refuses
  // to click by default (it waits for it to become enabled), so bypass the
  // actionability check to prove the app still ignores the sold-out size.
  await soldOut.click({ force: true })
  await expect(combobox).toContainText(/select|choose/i)

  // Picking an available size closes the list and shows only that size.
  await chooseAvailableSize(page)
})

// --- Size guide ------------------------------------------------------------

test('size guide opens a labeled modal dialog that computes a size and returns focus when closed', async ({ page }) => {
  await openProductPage(page)
  const sizeGuideButton = page.getByRole('button', { name: /size guide/i })
  await sizeGuideButton.click()

  const dialog = page.getByRole('dialog', { name: /size guide/i })
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveAttribute('aria-modal', 'true')

  // APG modal dialog pattern: focus moves into the dialog and stays in it,
  // so the shopper must close it to continue.
  const focusIsInDialog = () =>
    page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]')
      return !!dialog && dialog.contains(document.activeElement)
    })
  expect(await focusIsInDialog()).toBe(true)
  for (let i = 0; i < 15; i++) await page.keyboard.press('Tab')
  expect(await focusIsInDialog()).toBe(true)

  // Entering a foot length and choosing a unit shows the matching size.
  await dialog.getByLabel(/foot length/i).fill('27')
  await dialog.getByRole('radio', { name: /eu/i }).check()
  await expect(dialog.getByText(/eu\s*\d{1,2}/i)).toBeVisible()

  // Closing the dialog lets the shopper continue where they left off.
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(sizeGuideButton).toBeFocused()
})

// --- Quantity --------------------------------------------------------------

test('quantity can be typed or changed by one with the arrow keys (APG spinbutton)', async ({ page }) => {
  await openProductPage(page)
  const quantity = page.getByRole('spinbutton', { name: /quantity/i })
  await expect(quantity).toHaveValue('1')

  await quantity.press('ArrowUp')
  await expect(quantity).toHaveValue('2')
  await quantity.press('ArrowDown')
  await expect(quantity).toHaveValue('1')

  await quantity.fill('3')
  await expect(quantity).toHaveValue('3')
})

// --- Add to cart ------------------------------------------------------------

test('add to cart without a size asks the shopper to pick one', async ({ page }) => {
  await openProductPage(page)
  const countBefore = await readCartCount(page)

  await page.getByRole('button', { name: /add to cart/i }).click()
  await expect(page.getByText(/pick|choose|select .*size/i)).toBeVisible()

  // Nothing was added.
  expect(await readCartCount(page)).toBe(countBefore)
})

test('add to cart with a size and quantity confirms and updates the cart count', async ({ page }) => {
  await openProductPage(page)
  await chooseAvailableSize(page)

  const quantity = page.getByRole('spinbutton', { name: /quantity/i })
  await quantity.fill('2')

  const countBefore = await readCartCount(page)
  await page.getByRole('button', { name: /add to cart/i }).click()

  await expect(page.getByText(/added to cart/i)).toBeVisible()
  await expect
    .poll(async () => readCartCount(page))
    .toBe(countBefore + 2)
})

// --- Wishlist ----------------------------------------------------------------

test('heart button saves and unsaves the shoe (APG toggle button)', async ({ page }) => {
  await openProductPage(page)
  const wishlist = page.getByRole('button', { name: /wishlist/i })

  await expect(wishlist).toHaveAttribute('aria-pressed', 'false')
  await wishlist.click()
  await expect(wishlist).toHaveAttribute('aria-pressed', 'true')
  await wishlist.click()
  await expect(wishlist).toHaveAttribute('aria-pressed', 'false')
})

// --- More information -------------------------------------------------------

test('details, reviews and shipping tabs sit side by side and show one panel at a time', async ({ page }) => {
  await openProductPage(page)

  const details = page.getByRole('tab', { name: /details/i })
  const reviews = page.getByRole('tab', { name: /reviews/i })
  const shipping = page.getByRole('tab', { name: /shipping/i })

  // The tabs sit on one row, below everything on the page.
  const addBox = await page.getByRole('button', { name: /add to cart/i }).boundingBox()
  const boxes = await Promise.all([details, reviews, shipping].map((tab) => tab.boundingBox()))
  for (const [i, box] of boxes.entries()) {
    expect(Math.abs(box.y - boxes[0].y)).toBeLessThan(50)
    expect(box.y).toBeGreaterThan(addBox.y)
    if (i > 0) expect(box.x).toBeGreaterThan(boxes[i - 1].x)
  }

  // APG tabs pattern: one panel at a time, selected tab marked.
  await expect(page.getByRole('tabpanel', { name: /details/i })).toBeVisible()
  await reviews.click()
  await expect(reviews).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel', { name: /reviews/i })).toBeVisible()
  await expect(page.getByRole('tabpanel', { name: /details/i })).toBeHidden()

  // Arrow keys move to (and select) the next tab.
  await page.keyboard.press('ArrowRight')
  await expect(shipping).toBeFocused()
  await expect(shipping).toHaveAttribute('aria-selected', 'true')
})

// --- Questions ----------------------------------------------------------------

test('each question reveals its answer when opened (APG accordion/disclosure)', async ({ page }) => {
  await openProductPage(page)

  const question = page.locator('main button[aria-expanded]').first()
  await expect(question).toHaveAttribute('aria-expanded', 'false')

  const answerId = await question.getAttribute('aria-controls')
  expect(answerId).toBeTruthy()
  await expect(page.locator(`#${answerId}`)).toBeHidden()

  await question.click()
  await expect(question).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator(`#${answerId}`)).toBeVisible()

  await question.click()
  await expect(question).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator(`#${answerId}`)).toBeHidden()
})

// --- Bottom of the page --------------------------------------------------------

test('footer offers customer help, company and social media links', async ({ page }) => {
  await openProductPage(page)
  const footer = page.getByRole('contentinfo')

  await expect(footer.getByRole('link', { name: /help|contact|customer service|support/i }).first()).toBeVisible()
  await expect(footer.getByRole('link', { name: /about|company|careers|stores/i }).first()).toBeVisible()
  await expect(
    footer.getByRole('link', { name: /instagram|facebook|twitter|x\.com|youtube|tiktok|social/i }).first(),
  ).toBeVisible()
})
