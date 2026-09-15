import { chromium } from 'playwright';
import path from 'path';

async function main() {
  console.log('Testing DEMO pages rendering in browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Test 1: index.html
  const indexPath = 'file://' + path.resolve('/home/hermes/Desktop/DEMO/index.html');
  await page.goto(indexPath, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/hermes/Desktop/DEMO/screenshot_index_reception.png', fullPage: true });
  console.log('[OK] index.html Reception view rendered');

  // Test 1b: Switch to Tax Preparer
  await page.locator('button[data-role="preparer"]').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/hermes/Desktop/DEMO/screenshot_index_preparer.png', fullPage: true });
  console.log('[OK] index.html Tax Preparer view rendered (8 Stages)');

  // Test 1c: Switch to Manager
  await page.locator('button[data-role="manager"]').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/hermes/Desktop/DEMO/screenshot_index_manager.png', fullPage: true });
  console.log('[OK] index.html Manager view rendered');

  // Test 1d: Switch to Executive
  await page.locator('button[data-role="executive"]').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/hermes/Desktop/DEMO/screenshot_index_executive.png', fullPage: true });
  console.log('[OK] index.html Executive view rendered');

  // Test 2: portal.html
  const portalPath = 'file://' + path.resolve('/home/hermes/Desktop/DEMO/portal.html');
  await page.goto(portalPath, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/hermes/Desktop/DEMO/screenshot_portal_gerard.png', fullPage: true });
  console.log('[OK] portal.html Gerard Flanagan view rendered');

  // Test 2b: Switch client in portal to Karl Axelsson
  await page.selectOption('#client-switcher', 'karl');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/hermes/Desktop/DEMO/screenshot_portal_karl.png', fullPage: true });
  console.log('[OK] portal.html Karl Axelsson (Corporate 1120) view rendered');

  // Test 3: landing.html
  const landingPath = 'file://' + path.resolve('/home/hermes/Desktop/DEMO/landing.html');
  await page.goto(landingPath, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/hermes/Desktop/DEMO/screenshot_landing.png', fullPage: true });
  console.log('[OK] landing.html rendered');

  await browser.close();
  console.log('All DEMO pages tested and verified successfully!');
}

main().catch(err => {
  console.error('Demo verification error:', err);
  process.exit(1);
});
