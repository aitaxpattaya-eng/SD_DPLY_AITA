import { createSession, takeScreenshot } from './session.mjs';

const REQUIRED_CIRCLES = [
  { name: 'Staff - Reception', color: '#E91E63', autoAdd: false },
  { name: 'Staff - Tax Preparer', color: '#8B1538', autoAdd: false },
  { name: 'Staff - Manager', color: '#5C0D24', autoAdd: false },
  { name: 'All Active Clients', color: '#D4A574', autoAdd: true, target: 'Clients' },
  { name: 'Prospects', color: '#F5E6D3', autoAdd: true, target: 'Prospects' }
];

async function main() {
  console.log('[Mission 1A.3] Starting Circles Audit and Creation...');
  const { browser, page } = await createSession();
  
  await page.goto('https://secure.aitaxadvisers.com/circle/manage', { waitUntil: 'networkidle', timeout: 30000 });
  await takeScreenshot(page, 'circles_page_before');

  // Discover existing circles
  const existingCircles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.circle-row, .circle-name, .item-title, .title, td, .ng-binding'))
      .map(e => e.innerText ? e.innerText.trim() : '')
      .filter(t => t && t.length > 2 && !t.includes('\n'));
  });

  console.log('[Discovered Circles in UI]:', Array.from(new Set(existingCircles)));

  for (const target of REQUIRED_CIRCLES) {
    const exists = existingCircles.some(c => c.toLowerCase() === target.name.toLowerCase());
    if (exists) {
      console.log(`[SKIP] Circle "${target.name}" already exists.`);
      continue;
    }

    console.log(`[CREATE] Creating Circle "${target.name}"...`);
    // Click Add Circle button
    const addBtn = page.locator('button:has-text("ADD CIRCLE"), a:has-text("ADD CIRCLE"), .addButton').first();
    await addBtn.click();
    await page.waitForTimeout(1500);

    // Fill form inside modal
    const nameInput = page.locator('input[name*="name"], input[placeholder*="Name"], input[ng-model*="name"], input.form-control').first();
    await nameInput.fill(target.name);

    // Save
    const saveBtn = page.locator('button:has-text("Save"), button:has-text("Add"), button:has-text("Create"), button[type="submit"]').first();
    await saveBtn.click();
    await page.waitForTimeout(2000);
    console.log(`[OK] Created Circle "${target.name}".`);
  }

  await takeScreenshot(page, 'circles_page_after');
  await browser.close();
  console.log('[Mission 1A.3] Circles task finished successfully.');
}

main().catch(err => {
  console.error('Error in Circles creation:', err);
  process.exit(1);
});
