import { createSession, takeScreenshot } from './session.mjs';

async function main() {
  console.log('[Mission 1D.1] Creating Contact Update Form: Reception - Client Info Update...');
  const { browser, page } = await createSession();
  
  await page.goto('https://secure.aitaxadvisers.com/frm/c/up', { waitUntil: 'networkidle' });
  await takeScreenshot(page, 'update_form_create_modal');

  // Fill Form Title
  const titleInput = page.locator('input[name*="title"], input[placeholder*="Title"], input[ng-model*="title"], input.form-control').first();
  if (await titleInput.count() > 0) {
    await titleInput.fill('Reception - Client Info Update');
  }

  // Allow Save as Draft toggle
  await page.evaluate(() => {
    const toggles = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    toggles.forEach(t => {
      const p = t.closest('.form-group') || t.parentElement;
      if (p && p.innerText.toLowerCase().includes('draft')) {
        if (!t.checked) t.click();
      }
    });
  });

  // Click Save / Create
  const saveBtn = page.locator('button.btn-primary:has-text("Save"), button:has-text("Save"), button:has-text("Create"), button[type="submit"]').first();
  if (await saveBtn.count() > 0) {
    await saveBtn.click();
    await page.waitForTimeout(3000);
  }

  await takeScreenshot(page, 'update_form_builder_loaded');
  console.log('Update Form Created! URL:', page.url());
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
