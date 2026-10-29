import { test, expect } from '@playwright/test'

// Trail Runner 2 product page, one or two tests per requirement in REQUIREMENTS.md.
//
// Selectors are accessibility-based. The implementation should expose:
//   - Header: "Stride" text, and a cart button whose name includes "Cart" and the count
//   - Breadcrumb: <nav aria-label="Breadcrumb"> with links "Shop" and "Trail";
//     "Trail Runner 2" as the current item (aria-current="page", not a link)
//   - Photos: one <img> whose alt includes "Trail Runner 2"; buttons "Next photo", "Previous photo"
//   - Price: text like "$140"; info button "Price info" that shows "Includes taxes" on hover
//   - Color: <group aria-label="Color"> with a "Change color" button; the Blue/Black/Grey
//     option buttons exist only while the list is open
//   - Size: "Change size" button; <listbox aria-label="Size"> with <option>s rendered only
//     while open; sold-out options have "sold out" in their name and are disabled
//   - Size guide: "Size guide" button opens <dialog aria-label="Size guide"> with a "Close"
//     button; "Foot length" number input; "US"/"EU" radios; result in a role="status" element
//   - Quantity: spinbutton "Quantity"; buttons "Increase quantity" and "Decrease quantity"
//   - Add to cart: "Add to cart" button; missing size is reported in role="alert";
//     success is reported in role="status"
//   - Wishlist: button with "wishlist" in its name and aria-pressed toggling true/false
//   - More information: tablist with tabs "Details", "Reviews", "Shipping" (one tabpanel shown)
//   - Questions: <section aria-label="Questions"> with buttons using aria-expanded and aria-controls
//   - Footer: <footer> (contentinfo) with links "Help Center", "About Us" and social links

const PRODUCT_URL = '/products/trail-runner-2'

async function openProductPage(page) {
  await page.goto(PRODUCT_URL)
}

async function openSizeList(page) {
  await page.getByRole('button', { name: 'Change size' }).click()
  await expect(page.getByRole('listbox', { name: 'Size' })).toBeVisible()
}

async function pickFirstAvailableSize(page) {
  await openSizeList(page)
  const option = page
    .getByRole('listbox', { name: 'Size' })
    .locator('[role="option"]:not([aria-disabled="true"]):not([disabled])')
    .first()
  const size = (await option.textContent()).trim()
  await option.click()
  await expect(page.getByRole('listbox', { name: 'Size' })).toBeHidden()
  return size
}

test.describe('Trail Runner 2 product page', () => {
  test('shows the store name and the number of items in the cart', async ({ page }) => {
    await openProductPage(page)

    await expect(page.getByRole('banner').getByText('Stride', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: /cart/i })).toHaveAccessibleName(/cart.*\b0\b/i)
  })

  test('shows where the shoe sits in the store and lets the shopper go back a step', async ({ page }) => {
    await openProductPage(page)

    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })
    await expect(breadcrumb.getByRole('link')).toHaveText(['Shop', 'Trail'])
    await expect(breadcrumb.getByText('Trail Runner 2', { exact: true })).toHaveAttribute('aria-current', 'page')

    await breadcrumb.getByRole('link', { name: 'Trail' }).click()
    await expect(page).not.toHaveURL(new RegExp(`${PRODUCT_URL}$`))
  })

  test('shows one photo at a time and moves to the next and previous photo', async ({ page }) => {
    await openProductPage(page)

    const photo = page.getByRole('img', { name: /trail runner 2/i })
    await expect(photo).toHaveCount(1)
    const first = await photo.getAttribute('src')

    await page.getByRole('button', { name: 'Next photo' }).click()
    await expect(photo).toHaveCount(1)
    await expect(photo).not.toHaveAttribute('src', first)

    await page.getByRole('button', { name: 'Previous photo' }).click()
    await expect(photo).toHaveAttribute('src', first)
  })

  test('goes back to the first photo after the last one', async ({ page }) => {
    await openProductPage(page)

    const photo = page.getByRole('img', { name: /trail runner 2/i })
    const next = page.getByRole('button', { name: 'Next photo' })
    const first = await photo.getAttribute('src')

    const seen = new Set([first])
    let wrapped = false
    for (let i = 0; i < 20 && !wrapped; i++) {
      await next.click()
      const src = await photo.getAttribute('src')
      if (src === first) wrapped = true
      else seen.add(src)
    }

    expect(seen.size).toBeGreaterThan(1)
    expect(wrapped).toBe(true)
  })

  test('shows the price and explains on the info icon that it includes taxes', async ({ page }) => {
    await openProductPage(page)

    await expect(page.getByText(/^\$\d+/).first()).toBeVisible()
    await expect(page.getByText(/includes taxes/i)).toBeHidden()

    await page.getByRole('button', { name: 'Price info' }).hover()
    await expect(page.getByText(/includes taxes/i)).toBeVisible()
  })

  test('shows only the chosen color until the shopper changes it', async ({ page }) => {
    await openProductPage(page)

    const color = page.getByRole('group', { name: 'Color' })
    await expect(color.getByRole('button', { name: /^(Blue|Black|Grey)$/ })).toHaveCount(0)
    await expect(color.getByRole('button', { name: 'Change color' })).toBeVisible()
  })

  test('lets the shopper pick another color from the swatches', async ({ page }) => {
    await openProductPage(page)

    const color = page.getByRole('group', { name: 'Color' })
    await color.getByRole('button', { name: 'Change color' }).click()
    for (const name of ['Blue', 'Black', 'Grey']) {
      await expect(color.getByRole('button', { name })).toBeVisible()
    }

    await color.getByRole('button', { name: 'Black' }).click()
    await expect(color.getByRole('button', { name: /^(Blue|Black|Grey)$/ })).toHaveCount(0)
    await expect(color.getByText('Black', { exact: true })).toBeVisible()
  })

  test('shows only the chosen size, and the size list opens only when asked', async ({ page }) => {
    await openProductPage(page)

    await expect(page.getByRole('listbox', { name: 'Size' })).toBeHidden()
    await expect(page.getByRole('option')).toHaveCount(0)

    const size = await pickFirstAvailableSize(page)
    await expect(page.getByRole('listbox', { name: 'Size' })).toBeHidden()
    await expect(page.getByRole('button', { name: 'Change size' })).toContainText(size)
  })

  test('does not let the shopper pick a sold-out size', async ({ page }) => {
    await openProductPage(page)
    await openSizeList(page)

    const soldOut = page.getByRole('listbox', { name: 'Size' }).getByRole('option', { name: /sold out/i })
    await expect(soldOut.first()).toBeVisible()
    await expect(soldOut.first()).toBeDisabled()
  })

  test('opens a size chart over the page that must be closed to continue', async ({ page }) => {
    await openProductPage(page)

    await page.getByRole('button', { name: 'Size guide' }).click()
    const dialog = page.getByRole('dialog', { name: 'Size guide' })
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', { name: 'Close' }).click()
    await expect(dialog).toBeHidden()
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeEnabled()
  })

  test('gives the shopper a size from their foot length in US or EU', async ({ page }) => {
    await openProductPage(page)

    await page.getByRole('button', { name: 'Size guide' }).click()
    const dialog = page.getByRole('dialog', { name: 'Size guide' })
    await dialog.getByLabel('Foot length').fill('26')
    await dialog.getByRole('radio', { name: 'EU' }).check()

    await expect(dialog.getByRole('status')).toHaveText(/EU\s*\d+/)
  })

  test('lets the shopper type a quantity or change it by one', async ({ page }) => {
    await openProductPage(page)

    const quantity = page.getByRole('spinbutton', { name: 'Quantity' })
    await expect(quantity).toHaveValue('1')

    await quantity.fill('3')
    await expect(quantity).toHaveValue('3')

    await page.getByRole('button', { name: 'Increase quantity' }).click()
    await expect(quantity).toHaveValue('4')

    await page.getByRole('button', { name: 'Decrease quantity' }).click()
    await expect(quantity).toHaveValue('3')
  })

  test('asks for a size when adding to cart without one', async ({ page }) => {
    await openProductPage(page)

    await page.getByRole('button', { name: 'Add to cart' }).click()

    await expect(page.getByRole('alert')).toContainText(/size/i)
    await expect(page.getByRole('button', { name: /cart/i })).toHaveAccessibleName(/cart.*\b0\b/i)
  })

  test('adds the shoe to the cart with a size and confirms it', async ({ page }) => {
    await openProductPage(page)

    await pickFirstAvailableSize(page)
    await page.getByRole('button', { name: 'Add to cart' }).click()

    await expect(page.getByRole('status')).toContainText(/added to (your )?cart/i)
    await expect(page.getByRole('button', { name: /cart/i })).toHaveAccessibleName(/cart.*\b1\b/i)
  })

  test('saves and unsaves the shoe with the wishlist heart', async ({ page }) => {
    await openProductPage(page)

    const heart = page.getByRole('button', { name: /wishlist/i })
    await expect(heart).toHaveAttribute('aria-pressed', 'false')

    await heart.click()
    await expect(heart).toHaveAttribute('aria-pressed', 'true')

    await heart.click()
    await expect(heart).toHaveAttribute('aria-pressed', 'false')
  })

  test('shows details, reviews and shipping side by side below everything', async ({ page }) => {
    await openProductPage(page)

    const tabs = ['Details', 'Reviews', 'Shipping'].map((name) => page.getByRole('tab', { name }))
    for (const tab of tabs) await expect(tab).toBeVisible()

    const boxes = await Promise.all(tabs.map((tab) => tab.boundingBox()))
    const [top] = boxes.map((box) => box.y)
    for (const box of boxes) expect(Math.abs(box.y - top)).toBeLessThan(2)

    const addToCart = await page.getByRole('button', { name: 'Add to cart' }).boundingBox()
    expect(top).toBeGreaterThan(addToCart.y)
  })

  test('shows one of the information sections at a time', async ({ page }) => {
    await openProductPage(page)

    await page.getByRole('tab', { name: 'Reviews' }).click()

    await expect(page.getByRole('tab', { name: 'Reviews' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel')).toHaveCount(1)
  })

  test('shows common questions with answers hidden until opened', async ({ page }) => {
    await openProductPage(page)

    const questions = page.getByRole('section', { name: 'Questions' }).getByRole('button', { expanded: false })
    await expect.poll(() => questions.count()).toBeGreaterThanOrEqual(3)

    const first = questions.first()
    const panel = page.locator(`[id="${await first.getAttribute('aria-controls')}"]`)
    await expect(panel).toBeHidden()

    await first.click()
    await expect(first).toHaveAttribute('aria-expanded', 'true')
    await expect(panel).toBeVisible()
    await expect(panel).toHaveText(/\S/)
  })

  test('links to customer help and company pages from the footer', async ({ page }) => {
    await openProductPage(page)

    const footer = page.getByRole('contentinfo')
    await expect(footer.getByRole('link', { name: /help center/i })).toBeVisible()
    await expect(footer.getByRole('link', { name: /about us/i })).toBeVisible()
  })

  test('links to social media from the footer', async ({ page }) => {
    await openProductPage(page)

    const footer = page.getByRole('contentinfo')
    for (const name of [/instagram/i, /facebook/i, /youtube/i, /^x$|twitter/i]) {
      await expect(footer.getByRole('link', { name })).toBeVisible()
    }
  })
})
