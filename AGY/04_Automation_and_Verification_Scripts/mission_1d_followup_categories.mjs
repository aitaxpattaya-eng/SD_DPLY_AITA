import { createSession, takeScreenshot } from './session.mjs';

const REQUIRED_FOLLOWUP_CATEGORIES = [
  { name: 'Call Log', color: '#E91E63' },
  { name: 'Walk-In Visit', color: '#D4A574' },
  { name: 'Email Correspondence', color: '#8B1538' }
];

async function main() {
  console.log('[Mission 1D.3] Creating Follow-Up Categories...');
  const { browser, page } = await createSession();
  
  await page.goto('https://secure.aitaxadvisers.com/contentDropdowns/admin?t=CRM-actions-category', { waitUntil: 'networkidle' });
  await takeScreenshot(page, 'followup_categories_admin_before');

  const existingCategories = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('table tbody tr, .category-item, .title, .item-name, td, .ng-binding'))
      .map(e => e.innerText ? e.innerText.trim() : '')
      .filter(t => t && t.length > 2 && !t.includes('\n'));
  });

  console.log('Existing Follow-up Categories:', Array.from(new Set(existingCategories)));

  for (const cat of REQUIRED_FOLLOWUP_CATEGORIES) {
    const exists = existingCategories.some(c => c.toLowerCase() === cat.name.toLowerCase());
    if (exists) {
      console.log(`[SKIP] Follow-up Category "${cat.name}" already exists.`);
      continue;
    }

    console.log(`[CREATE] Adding Follow-up Category "${cat.name}"...`);
    const addBtn = page.locator('button:has-text("ADD CATEGORY"), a:has-text("ADD CATEGORY"), .addButton, button:has-text("Add")').first();
    await addBtn.click();
    await page.waitForTimeout(1500);

    const nameInput = page.locator('input[name*="name"], input[placeholder*="Name"], input[ng-model*="name"], input.form-control').first();
    await nameInput.fill(cat.name);

    const saveBtn = page.locator('button:has-text("Save"), button:has-text("Add"), button:has-text("Create"), button[type="submit"]').first();
    await saveBtn.click();
    await page.waitForTimeout(2000);
    console.log(`[OK] Created Follow-up Category "${cat.name}".`);
  }

  await takeScreenshot(page, 'followup_categories_admin_after');
  await browser.close();
  console.log('[Mission 1D.3] Follow-up Categories complete!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
