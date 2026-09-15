import { createSession, takeScreenshot } from './session.mjs';

const FIELDS_TO_CREATE = [
  {
    name: 'Tax Filing Status',
    description: 'Filing status (Single, MFJ, MFS, HOH, QSS)',
    usage: 'CRM > Contacts',
    category: 'Tax Client',
    fieldType: 'Dropdown Menu',
    options: ['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household', 'Qualifying Surviving Spouse']
  },
  {
    name: 'Last Return Filed',
    description: 'Most recent tax year filed',
    usage: 'CRM > Contacts',
    category: 'Tax Client',
    fieldType: 'Single Line Text'
  },
  {
    name: 'Referral Source',
    description: 'How the client found us',
    usage: 'CRM > Contacts',
    fieldType: 'Dropdown Menu',
    options: ['Referral', 'Google', 'Social Media', 'Walk-In', 'Returning Client', 'Other']
  },
  {
    name: 'Preferred Language',
    description: 'Preferred communication language',
    usage: 'CRM > Contacts',
    fieldType: 'Dropdown Menu',
    options: ['English', 'Thai', 'Other']
  },
  {
    name: 'US Taxpayer',
    description: 'Is this client a US taxpayer?',
    usage: 'CRM > Contacts',
    category: 'Tax Client',
    fieldType: 'Checkbox'
  },
  {
    name: 'Thai Taxpayer',
    description: 'Is this client a Thai taxpayer?',
    usage: 'CRM > Contacts',
    category: 'Tax Client',
    fieldType: 'Checkbox'
  }
];

async function createField(page, field) {
  console.log(`\n[Field] Creating: ${field.name}...`);
  await page.goto('https://secure.aitaxadvisers.com/customFields/admin', { waitUntil: 'networkidle', timeout: 30000 });
  
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
    } catch (e) {}
  }

  // Field Type
  await page.locator('select[name="field_type"]').selectOption({ label: field.fieldType });
  await page.waitForTimeout(1000);

  // If Dropdown options
  if (field.options && field.options.length > 0) {
    for (let i = 0; i < field.options.length; i++) {
      const optVal = field.options[i];
      const optionInputs = page.locator('input[name*="options"], input[placeholder*="Option"], input[name*="CustomFields[options]"]');
      let count = await optionInputs.count();
      while (i >= count) {
        const addOptBtn = page.locator('button:has-text("Add Option"), a:has-text("Add Option"), .add-option-btn, [ng-click*="addOption"]').first();
        if (await addOptBtn.count() > 0) {
          await addOptBtn.click();
          await page.waitForTimeout(300);
        }
        count = await page.locator('input[name*="options"], input[placeholder*="Option"], input[name*="CustomFields[options]"]').count();
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
  console.log(`[OK] Finished field: ${field.name}`);
}

async function main() {
  console.log('[Mission 1A.2] Starting Batch Custom Fields Creation...');
  const { browser, page } = await createSession();
  
  for (const field of FIELDS_TO_CREATE) {
    try {
      await createField(page, field);
    } catch (err) {
      console.error(`[ERROR] Failed to create ${field.name}:`, err.message);
    }
  }

  await takeScreenshot(page, 'all_custom_fields_created');
  await browser.close();
  console.log('[Mission 1A.2] Batch Custom Fields Creation Complete!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
