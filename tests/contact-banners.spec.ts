import { test, expect } from '@playwright/test'

// Expected contact triggers - baseline captured 2024-05-16
const expectedTriggers = [
  // Hero "Let's Connect" button
  {
    page: 'home',
    path: '/',
    selector: '.pg-hero-bio-btn',
    label: "Let's Connect button",
    expectedMessage: '',
  },
  // ContactBanner buttons
  {
    page: 'selling-our-process',
    path: '/selling/our-process',
    selector: 'button.pg-contact-banner-link',
    label: 'Connect with us today to build your customized marketing plan.',
    expectedMessage: 'Yes! I would like to get more information about your listing services and discuss a marketing plan.',
  },
  {
    page: 'selling-property-prep',
    path: '/selling/property-prep',
    selector: 'button.pg-contact-banner-link',
    label: 'Find out how Lauren and Samantha can help you get the highest value for your property.',
    expectedMessage: 'Yes! I would like to get more information about your listing services.',
  },
  {
    page: 'selling-staging-services',
    path: '/selling/staging-services',
    selector: 'button.pg-contact-banner-link',
    label: 'We can help you get your property ready with a staging consultation.',
    expectedMessage: 'Yes! I would like to get more information about your property staging services.',
  },
  {
    page: 'inventory',
    path: '/inventory',
    selector: 'button.pg-contact-banner-link',
    label: 'Have questions about our available or upcoming listings?',
    expectedMessage: 'I have questions about your available or upcoming listings.',
  },
  // Testimonials banner
  {
    page: 'testimonials',
    path: '/testimonials',
    selector: 'button.pg-contact-banner-link',
    label: 'Send us a testimonial on you experience!',
    expectedMessage: 'I loved my experience and would love to share my testimonial with you.',
  },
]

// Individual tests for each trigger - enables parallel execution
test.describe('Contact Form Triggers', () => {
  for (const trigger of expectedTriggers) {
    test(`${trigger.page}: contact trigger opens form with expected message`, async ({ page }) => {
      await page.goto(trigger.path)
      await page.waitForLoadState('networkidle')

      const element = page.locator(trigger.selector).first()
      await expect(element).toBeVisible({ timeout: 5000 })

      await element.click()
      await page.waitForSelector('.pg-connect-panel--open', { timeout: 5000 })

      const messageTextarea = page.locator('#connect-message')
      const actualMessage = await messageTextarea.inputValue()

      expect(actualMessage).toBe(trigger.expectedMessage)
    })
  }

  test('verify listing card inquire buttons open form with property message', async ({ page }) => {
    await page.goto('/inventory')
    await page.waitForLoadState('networkidle')

    // Find first listing card inquire button
    const inquireBtn = page.locator('.pg-listing-btn--contact').first()
    const exists = await inquireBtn.count() > 0

    if (!exists) {
      console.log('No listing cards with Inquire buttons found on /inventory')
      return
    }

    // Click the inquire button
    await inquireBtn.click()

    // Wait for the connect panel to open
    await page.waitForSelector('.pg-connect-panel--open', { timeout: 5000 })

    // Get the message from the textarea
    const messageTextarea = page.locator('#connect-message')
    const message = await messageTextarea.inputValue()

    console.log('\n========== LISTING INQUIRE BUTTON ==========')
    console.log(`Message: "${message}"`)
    console.log('=============================================\n')

    // Verify message contains expected pattern
    expect(message).toContain("I'm interested in the property at")

    // Close the panel
    await page.locator('.pg-connect-close').click()
  })

  test('verify message is cleared after closing form', async ({ page }) => {
    await page.goto('/selling/our-process')
    await page.waitForLoadState('networkidle')

    // Click the banner to open form with message
    await page.locator('button.pg-contact-banner-link').first().click()
    await page.waitForSelector('.pg-connect-panel--open', { timeout: 5000 })

    // Verify message is populated
    const messageBefore = await page.locator('#connect-message').inputValue()
    expect(messageBefore.length).toBeGreaterThan(0)

    // Close the panel
    await page.locator('.pg-connect-close').click()
    await page.waitForTimeout(500)

    // Re-open using floating trigger (no message)
    await page.locator('.pg-connect-trigger').click()
    await page.waitForSelector('.pg-connect-panel--open', { timeout: 5000 })

    // Verify message is empty
    const messageAfter = await page.locator('#connect-message').inputValue()
    expect(messageAfter).toBe('')
  })
})
