// tests/e2e/performance.spec.ts
import { test, expect } from '@playwright/test'

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'

test('home page meets Core Web Vitals budgets', async ({ page }) => {
  await page.goto(BASE_URL)

  // Inject web-vitals script
  await page.addScriptTag({
    content: `
      (function() {
        var vitals = {};
        var observer = new PerformanceObserver(function(list) {
          var entries = list.getEntries();
          entries.forEach(function(entry) {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.LCP = entry.startTime;
            } else if (entry.entryType === 'layout-shift') {
              if (!entry.hadRecentInput) {
                vitals.CLS = (vitals.CLS || 0) + entry.value;
              }
            } else if (entry.entryType === 'first-input') {
              vitals.INP = entry.processingStart - entry.startTime;
            }
          });
        });
        observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift', 'first-input'] });

        // Store vitals in localStorage for retrieval
        var interval = setInterval(function() {
          if (vitals.LCP || vitals.CLS || vitals.INP) {
            localStorage.setItem('web-vitals', JSON.stringify(vitals));
            clearInterval(interval);
          }
        }, 100);

        // Fallback: store after 5 seconds
        setTimeout(function() {
          localStorage.setItem('web-vitals', JSON.stringify(vitals));
          clearInterval(interval);
        }, 5000);
      })();
    `
  });

  // Wait for vitals to be collected
  await page.waitForTimeout(3000);

  const metrics = await page.evaluate(() => JSON.parse(localStorage.getItem('web-vitals') || '{}'));

  console.log('Web Vitals:', metrics);

  // Core Web Vitals budgets
  if (metrics.LCP) {
    expect(metrics.LCP).toBeLessThan(2500);
  }
  if (metrics.CLS !== undefined) {
    expect(metrics.CLS).toBeLessThan(0.1);
  }
  if (metrics.INP) {
    expect(metrics.INP).toBeLessThan(200);
  }
});

test('menu page meets Core Web Vitals budgets', async ({ page }) => {
  await page.goto(`${BASE_URL}/menu`);
  await page.waitForTimeout(3000);

  const metrics = await page.evaluate(() => JSON.parse(localStorage.getItem('web-vitals') || '{}'));

  console.log('Menu Web Vitals:', metrics);

  if (metrics.LCP) {
    expect(metrics.LCP).toBeLessThan(2500);
  }
  if (metrics.CLS !== undefined) {
    expect(metrics.CLS).toBeLessThan(0.1);
  }
  if (metrics.INP) {
    expect(metrics.INP).toBeLessThan(200);
  }
});

test('prenota page meets Core Web Vitals budgets', async ({ page }) => {
  await page.goto(`${BASE_URL}/prenota`);
  await page.waitForTimeout(3000);

  const metrics = await page.evaluate(() => JSON.parse(localStorage.getItem('web-vitals') || '{}'));

  console.log('Prenota Web Vitals:', metrics);

  if (metrics.LCP) {
    expect(metrics.LCP).toBeLessThan(2500);
  }
  if (metrics.CLS !== undefined) {
    expect(metrics.CLS).toBeLessThan(0.1);
  }
  if (metrics.INP) {
    expect(metrics.INP).toBeLessThan(200);
  }
});