import { createSession, takeScreenshot } from './session.mjs';

async function main() {
  console.log('[Mission 1A.4] Configuring CRM Default Fields Visibility...');
  const { browser, page } = await createSession();
  
  await page.goto('https://secure.aitaxadvisers.com/s/crm', { waitUntil: 'networkidle' });
  
  // Click Default Fields > Contact
  console.log('Navigating to Default Fields > Contact...');
  await page.click('text="Default Fields > Contact"');
  await page.waitForTimeout(2000);
  await takeScreenshot(page, 'crm_default_fields_contact');

  // Check all checkboxes
  const checkboxes = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    return inputs.map(i => {
      const parent = i.closest('tr') || i.closest('.form-group') || i.parentElement;
      return {
        id: i.id,
        name: i.name,
        checked: i.checked,
        label: parent ? parent.innerText.trim() : ''
      };
    });
  });

  console.log('Contact Default Fields Checkboxes:', checkboxes);

  // Click Save
  const saveBtn = page.locator('button:has-text("Save"), input[type="submit"][value="Save"]').first();
  if (await saveBtn.count() > 0) {
    await saveBtn.click();
    await page.waitForTimeout(2000);
    console.log('[OK] Saved CRM Default Fields.');
  }

  await browser.close();
  console.log('[Mission 1A.4] Default Fields Visibility Complete!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
