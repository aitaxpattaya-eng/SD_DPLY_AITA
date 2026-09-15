import { createSession, takeScreenshot } from './session.mjs';

async function createField(page, field) {
  console.log(`[Field] Creating: ${field.name}...`);
  await page.goto('https://secure.aitaxadvisers.com/customFields/admin', { waitUntil: 'networkidle' });
  
  // Open Add modal
  await page.locator('button:has-text("ADD CUSTOM FIELD"), a:has-text("ADD CUSTOM FIELD"), .addButton').first().click();
  await page.waitForSelector('input[name="CustomFields[name]"]', { state: 'visible', timeout: 10000 });
  
  // Reference Title
  await page.locator('input[name="CustomFields[name]"]').fill(field.name);
  
  // Prompt/Description
  await page.locator('textarea[name="CustomFields[label]"]').fill(field.description);
  
  // Usage
  await page.locator('select[name="type"]').selectOption({ label: field.usage });
  await page.waitForTimeout(500);

  // Category if specified
  if (field.category) {
    try {
      // SuiteDash uses select2 for categories
      await page.evaluate((catName) => {
        const sel = document.querySelector('select[name="CustomFields[categories][]"]');
        if (sel) {
          Array.from(sel.options).forEach(opt => {
            if (opt.text.trim().toLowerCase() === catName.toLowerCase()) {
              opt.selected = true;
            }
          });
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, field.category);
      await page.waitForTimeout(500);
    } catch (e) {
      console.log(`Category select warning for ${field.category}:`, e.message);
    }
  }

  // Field Type
  await page.locator('select[name="field_type"]').selectOption({ label: field.fieldType });
  await page.waitForTimeout(1000);

  // If Dropdown options
  if (field.options && field.options.length > 0) {
    console.log(`Setting options for ${field.name}...`);
    for (let i = 0; i < field.options.length; i++) {
      const optVal = field.options[i];
      // Check if option input exists
      const optionInputs = page.locator('input[name*="options"], input[placeholder*="Option"], input[name*="CustomFields[options]"]');
      const count = await optionInputs.count();
      if (i >= count) {
        // click add option button
        const addOptBtn = page.locator('button:has-text("Add Option"), a:has-text("Add Option"), .add-option-btn, [ng-click*="addOption"]').first();
        if (await addOptBtn.count() > 0) {
          await addOptBtn.click();
          await page.waitForTimeout(300);
        }
      }
      const targetInput = page.locator('input[name*="options"], input[placeholder*="Option"], input[name*="CustomFields[options]"]').nth(i);
      if (await targetInput.count() > 0) {
        await targetInput.fill(optVal);
      }
    }
  }

  // Click Save
  const saveBtn = page.locator('button.modal-sticky-footer__btn--primary:has-text("Save"), button:has-text("Save")').first();
  await saveBtn.click();
  await page.waitForTimeout(2500);
  console.log(`[OK] Created field: ${field.name}`);
}

async function main() {
  const { browser, page } = await createSession();
  
  const testField = {
    name: 'Spouse Full Name',
    description: 'Full legal name of spouse',
    usage: 'CRM > Contacts',
    category: 'Tax Client',
    fieldType: 'Single Line Text'
  };

  await createField(page, testField);
  await takeScreenshot(page, 'field_spouse_name_created');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
