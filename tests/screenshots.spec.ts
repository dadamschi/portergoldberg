import { test, expect } from '@playwright/test'

const pages = [
  // Main pages
  { path: '/', name: 'home' },
  { path: '/about-us', name: 'about' },
  { path: '/press', name: 'press' },
  // { path: '/contact', name: 'contact' },
  { path: '/testimonials', name: 'testimonials' },

  // Buying
  { path: '/buying', name: 'buying' },
  { path: '/inventory', name: 'inventory' },

  // Selling
  { path: '/selling', name: 'selling' },
  { path: '/selling/our-process', name: 'selling-our-process' },
  { path: '/selling/property-prep', name: 'selling-property-prep' },
  { path: '/selling/staging-services', name: 'selling-staging-services' },

  // Resources
  { path: '/events', name: 'events' },
  { path: '/newsletters', name: 'newsletters' },
  { path: '/vendors', name: 'vendors' },
  { path: '/school-guidance', name: 'school-guidance' },
  { path: '/halcyon-development', name: 'halcyon-development' },
]

test.describe('Page Screenshots', () => {
  for (const page of pages) {
    test(`screenshot: ${page.name}`, async ({ page: browserPage }) => {
      await browserPage.goto(page.path)
      await browserPage.waitForLoadState('networkidle')

      // Wait for animations to settle
      await browserPage.waitForTimeout(1000)

      // Desktop screenshot
      await browserPage.screenshot({
        path: `screenshots/${page.name}-desktop.png`,
        fullPage: true,
      })

      // Basic check that the page loaded
      expect(await browserPage.title()).toBeTruthy()
    })
  }
})

test.describe('Mobile Screenshots', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  for (const page of pages) {
    test(`mobile screenshot: ${page.name}`, async ({ page: browserPage }) => {
      await browserPage.goto(page.path)
      await browserPage.waitForLoadState('networkidle')
      await browserPage.waitForTimeout(1000)

      await browserPage.screenshot({
        path: `screenshots/${page.name}-mobile.png`,
        fullPage: true,
      })

      expect(await browserPage.title()).toBeTruthy()
    })
  }
})
