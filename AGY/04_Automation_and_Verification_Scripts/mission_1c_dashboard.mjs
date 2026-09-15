import { createSession, takeScreenshot } from './session.mjs';

async function main() {
  console.log('[Mission 1C.1] Creating Reception Dashboard...');
  const { browser, page } = await createSession();
  
  await page.goto('https://secure.aitaxadvisers.com/dashboard/admin', { waitUntil: 'networkidle' });
  await takeScreenshot(page, 'dashboards_admin_before');

  // Discover existing dashboards
  const existingDashboards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('table tbody tr, .title, .item-name, td, .ng-binding'))
      .map(e => e.innerText ? e.innerText.trim() : '')
      .filter(t => t && t.length > 2 && !t.includes('\n'));
  });

  console.log('Existing Dashboards in UI:', Array.from(new Set(existingDashboards)));

  // Click Add Dashboard
  console.log('Clicking ADD DASHBOARD...');
  const addBtn = page.locator('button:has-text("ADD DASHBOARD"), a:has-text("ADD DASHBOARD"), .addButton, a[href*="/dashboard/create"]').first();
  await addBtn.click();
  await page.waitForTimeout(2000);
  await takeScreenshot(page, 'dashboard_create_modal');

  // Fill Title
  const titleInput = page.locator('input[name*="title"], input[placeholder*="Title"], input[ng-model*="title"], #Dashboard_title, input.form-control').first();
  if (await titleInput.count() > 0) {
    await titleInput.fill('Reception Homepage');
  }

  // Select Medium Priority Circle (Staff - Reception)
  console.log('Assigning to Staff - Reception Circle...');
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    selects.forEach(s => {
      Array.from(s.options).forEach(opt => {
        if (opt.text.toLowerCase().includes('staff - reception') || opt.text.toLowerCase().includes('reception')) {
          opt.selected = true;
          s.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });
  });
  await page.waitForTimeout(1000);

  // Click Save
  const saveBtn = page.locator('button.btn-primary:has-text("Save"), button:has-text("Save"), button[type="submit"]:has-text("Save")').first();
  if (await saveBtn.count() > 0) {
    await saveBtn.click();
    await page.waitForTimeout(3000);
  }

  await takeScreenshot(page, 'reception_dashboard_created');
  console.log('Reception Dashboard Created & Assigned to Staff - Reception!');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
