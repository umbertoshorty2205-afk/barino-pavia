// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'
const pages = ['/', '/menu', '/eventi', '/gallery', '/prenota', '/contatti']

for (const path of pages) {
  test(`${path} passes axe-core WCAG 2.2 AA`, async ({ page }) => {
    await page.goto(`${BASE_URL}${path}`)
    const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze()
    expect(results.violations).toHaveLength(0)
  })
}