import { chromium } from 'playwright';
import path from 'path';

const BASE_URL = 'https://secure.aitaxadvisers.com';

export const COOKIES = [
  {
    name: 'PHPSESSID',
    value: 'cqf7oitd1t32e4vfaj0uf9led8',
    domain: 'secure.aitaxadvisers.com',
    path: '/'
  },
  {
    name: 'TOKEN',
    value: 'b21bd5abaabede90621621f71924cac9dbc14f01s%3A88%3A%22YUk2ZGhTaUpOU2JGZHhmbFVFYXR1X1JNQ055WVpxVHZ3hH4g9cfC0oWZi8vcRoZ_vcs0cbW_hT_HqEarqBfjKw%3D%3D%22%3B',
    domain: 'secure.aitaxadvisers.com',
    path: '/'
  },
  {
    name: 'sdLastLoginMethod',
    value: 'password',
    domain: 'secure.aitaxadvisers.com',
    path: '/'
  }
];

export async function createSession(viewport = { width: 1440, height: 900 }) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const context = await browser.newContext({
    viewport,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  await context.addCookies(COOKIES);
  const page = await context.newPage();
  return { browser, context, page };
}

export async function takeScreenshot(page, name) {
  const screenshotDir = path.resolve('/home/hermes/SuiteDash_CRM_Central_Repository/04_Automation_and_Verification_Scripts/screenshots');
  const fullPath = path.join(screenshotDir, `${name}.png`);
  await page.screenshot({ path: fullPath, fullPage: true });
  console.log(`[Screenshot Saved] -> ${fullPath}`);
  return fullPath;
}
