import { createSession, takeScreenshot } from './session.mjs';

async function main() {
  const { browser, page } = await createSession();
  await page.goto('https://secure.aitaxadvisers.com/stack/admin', { waitUntil: 'networkidle' });
  
  await page.locator('span:has-text("ADD STACK"), a:has-text("ADD STACK")').first().click();
  await page.waitForTimeout(1500);
  
  // Click General Stack
  console.log('Clicking General Stack option...');
  await page.locator('text="General Stack", :has-text("General Stack")').first().click();
  await page.waitForTimeout(2000);
  await takeScreenshot(page, 'stack_create_settings_modal');

  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea, button')).map(e => ({
      tag: e.tagName,
      name: e.name || e.id || e.className,
      placeholder: e.placeholder,
      text: e.innerText
    }));
  });
  console.log('Inputs in settings modal:', inputs);
  await browser.close();
}

main().catch(err => console.error(err));
