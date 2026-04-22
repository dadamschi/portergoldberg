import { test, expect } from '@playwright/test'

const pages = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/buy', name: 'buy' },
  { path: '/selling', name: 'selling' },
  { path: '/inventory', name: 'inventory' },
  { path: '/contact', name: 'contact' },
  { path: '/events', name: 'events' },
  { path: '/newsletters', name: 'newsletters' },
  { path: '/vendors', name: 'vendors' },
  { path: '/client-resources', name: 'client-resources' },
  { path: '/halcyon-development', name: 'halcyon-development' },
  { path: '/testimonials', name: 'testimonials' },
]

test.describe('Page Screenshots', () => {
  for (const page of pages) {
    test(`screenshot: ${page.name}`, async ({ page: browserPage }) => {
      await browserPage.goto(page.path)
      await browserPage.waitForLoadState('networkidle')

      // Wait a bit for any animations to settle
      await browserPage.waitForTimeout(500)

      await browserPage.screenshot({
        path: `screenshots/${page.name}.png`,
        fullPage: true,
      })

      // Basic check that the page loaded
      expect(await browserPage.title()).toBeTruthy()
    })
  }
})
