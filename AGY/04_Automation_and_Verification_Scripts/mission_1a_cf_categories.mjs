import { createSession, takeScreenshot } from './session.mjs';

const REQUIRED_CATEGORIES = [
  { name: 'Tax Client', color: '#E91E63' },
  { name: 'Corporate Client', color: '#8B1538' },
  { name: 'Prospect', color: '#D4A574' }
];

async function main() {
  console.log('[Mission 1A.1] Starting Custom Field Categories creation...');
  const { browser, page } = await createSession();
  
  await page.goto('https://secure.aitaxadvisers.com/customFields/admin', { waitUntil: 'networkidle', timeout: 30000 });
  await takeScreenshot(page, 'cf_admin_before');

  // Click on Manage Categories tab
  console.log('[Step] Navigating to MANAGE CATEGORIES tab...');
  await page.click('a:has-text("MANAGE CATEGORIES"), button:has-text("MANAGE CATEGORIES"), li:has-text("MANAGE CATEGORIES")');
  await page.waitForTimeout(2000);
  await takeScreenshot(page, 'cf_manage_categories_tab');

  // Discover existing categories
  const existingCategories = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.category-item, table tbody tr, .title, .item-name, td, .ng-binding'))
      .map(e => e.innerText ? e.innerText.trim() : '')
      .filter(t => t && t.length > 2 && !t.includes('\n'));
  });

  console.log('[Discovered Categories]:', Array.from(new Set(existingCategories)));

  for (const cat of REQUIRED_CATEGORIES) {
    const exists = existingCategories.some(c => c.toLowerCase() === cat.name.toLowerCase());
    if (exists) {
      console.log(`[SKIP] Category "${cat.name}" already exists.`);
      continue;
    }

    console.log(`[CREATE] Adding Category "${cat.name}"...`);
    // Click Add Category button
    const addBtn = page.locator('button:has-text("ADD CATEGORY"), a:has-text("ADD CATEGORY"), .addButton, button:has-text("Add")').first();
    await addBtn.click();
    await page.waitForTimeout(1500);

    // Fill form inside modal
    const nameInput = page.locator('input[name*="name"], input[placeholder*="Name"], input[ng-model*="name"], input.form-control').first();
    await nameInput.fill(cat.name);

    // Save
    const saveBtn = page.locator('button:has-text("Save"), button:has-text("Add"), button:has-text("Create"), button[type="submit"]').first();
    await saveBtn.click();
    await page.waitForTimeout(2000);
    console.log(`[OK] Created Category "${cat.name}".`);
  }

  await takeScreenshot(page, 'cf_categories_after');
  await browser.close();
  console.log('[Mission 1A.1] Custom Field Categories finished successfully.');
}

main().catch(err => {
  console.error('Error in Categories creation:', err);
  process.exit(1);
});
