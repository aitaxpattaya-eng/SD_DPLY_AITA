import { createSession, takeScreenshot } from './session.mjs';

async function main() {
  console.log('[1/3] Launching browser session...');
  const { browser, page } = await createSession();
  
  console.log('[2/3] Navigating to Dashboard...');
  await page.goto('https://secure.aitaxadvisers.com/dashboard/index', { waitUntil: 'networkidle', timeout: 30000 });
  
  const title = await page.title();
  const url = page.url();
  console.log(`[Status] Title: "${title}" | URL: ${url}`);
  
  await takeScreenshot(page, '01_dashboard_live');
  await browser.close();
  console.log('[3/3] Session verified successfully!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
