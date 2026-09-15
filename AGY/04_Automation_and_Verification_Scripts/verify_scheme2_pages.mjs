import { chromium } from 'playwright';
import path from 'path';

async function main() {
  console.log('Testing Scheme 2 rendering in browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Test 1: SCHEME2/index.html
  const indexPath = 'file://' + path.resolve('/home/hermes/Desktop/DEMO/SCHEME2/index.html');
  await page.goto(indexPath, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/hermes/Desktop/DEMO/SCHEME2/screenshot_scheme2_reception.png', fullPage: true });
  console.log('[OK] SCHEME2/index.html Reception view rendered');

  // Test 1b: Switch to Tax Preparer
  await page.locator('button[data-role="preparer"]').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/hermes/Desktop/DEMO/SCHEME2/screenshot_scheme2_preparer.png', fullPage: true });
  console.log('[OK] SCHEME2/index.html Tax Preparer view rendered');

  // Test 2: SCHEME2/portal.html
  const portalPath = 'file://' + path.resolve('/home/hermes/Desktop/DEMO/SCHEME2/portal.html');
  await page.goto(portalPath, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/hermes/Desktop/DEMO/SCHEME2/screenshot_scheme2_portal_gerard.png', fullPage: true });
  console.log('[OK] SCHEME2/portal.html Gerard Flanagan view rendered');

  // Test 2b: Switch client to Karl
  await page.selectOption('#client-switcher', 'karl');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/hermes/Desktop/DEMO/SCHEME2/screenshot_scheme2_portal_karl.png', fullPage: true });
  console.log('[OK] SCHEME2/portal.html Karl Axelsson view rendered');

  await browser.close();
  console.log('All Scheme 2 pages verified successfully!');
}

main().catch(err => {
  console.error('Scheme 2 verification error:', err);
  process.exit(1);
});
