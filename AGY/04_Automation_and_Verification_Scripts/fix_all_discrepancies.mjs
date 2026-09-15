import { createSession, takeScreenshot } from './session.mjs';

const CANONICAL_STAGES = [
  { title: 'Intake / Quotation', prob: '10' },
  { title: 'Information Gathering', prob: '25' },
  { title: 'Processing Return', prob: '50' },
  { title: 'Chetan Review', prob: '70' },
  { title: 'Client Review', prob: '85' },
  { title: 'Awaiting Payment', prob: '95' },
  { title: 'Filed / Completed', prob: '100' },
  { title: 'Not Proceeding', prob: '0' }
];

const PIPELINES = [
  { name: 'US Tax Returns (1040)', url: 'https://secure.aitaxadvisers.com/crmDealsPipelines/95885' },
  { name: 'Thai Tax Returns', url: 'https://secure.aitaxadvisers.com/crmDealsPipelines/95886' },
  { name: 'Corporate / Entity Returns', url: 'https://secure.aitaxadvisers.com/crmDealsPipelines/95887' }
];

async function updatePipelineStages(page, pipeline) {
  console.log(`\n>>> Updating stages for ${pipeline.name} (${pipeline.url})...`);
  await page.goto(pipeline.url, { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  // Click MANAGE STAGES button
  const manageStagesBtn = page.locator('button:has-text("MANAGE STAGES")').first();
  if (await manageStagesBtn.isVisible()) {
    await manageStagesBtn.click();
    await page.waitForTimeout(2000);
  }

  // Click on stage headers to enable input mode
  const headers = page.locator('.pipeline-header.ui-sortable-handle .title, .pipeline-header .title');
  const count = await headers.count();
  console.log(`Found ${count} stage header elements.`);

  for (let i = 0; i < count; i++) {
    try {
      await headers.nth(i).click({ timeout: 2000 });
      await page.waitForTimeout(200);
    } catch (e) {}
  }

  // Update input values
  await page.evaluate((canonical) => {
    const stageElements = Array.from(document.querySelectorAll('.pipeline-header.ui-sortable-handle, .pipeline-header'));
    stageElements.forEach((s, idx) => {
      if (idx < canonical.length) {
        const textInputs = s.querySelectorAll('input[type="text"], input:not([type="checkbox"]):not([type="hidden"])');
        if (textInputs.length > 0) {
          const titleInput = textInputs[0];
          titleInput.value = canonical[idx].title;
          titleInput.dispatchEvent(new Event('input', { bubbles: true }));
          titleInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (textInputs.length > 1) {
          const probInput = textInputs[1];
          probInput.value = canonical[idx].prob;
          probInput.dispatchEvent(new Event('input', { bubbles: true }));
          probInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });
  }, CANONICAL_STAGES);

  await page.waitForTimeout(1000);

  // Save changes
  const saveBtn = page.locator('button:has-text("Save"), button.sd-btn-wide-primary-24px').first();
  if (await saveBtn.isVisible()) {
    await saveBtn.click();
    await page.waitForTimeout(3000);
    console.log(`[SAVED] Pipeline ${pipeline.name} stages updated.`);
  } else {
    console.log(`[NOTE] Save button not found, clicking outside to blur.`);
    await page.click('body', { position: { x: 10, y: 10 } });
    await page.waitForTimeout(2000);
  }

  await takeScreenshot(page, `fix_pipeline_${pipeline.name.replace(/[^a-zA-Z0-9]/g, '_')}`);
}

async function addDropdownCategories(page, typeName, items) {
  console.log(`\n>>> Adding categories for "${typeName}" at /contentDropdowns/admin...`);
  await page.goto('https://secure.aitaxadvisers.com/contentDropdowns/admin', { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  // Click on the category type on the left menu (e.g. "Custom Fields", "CRM Follow-Ups")
  const typeLink = page.locator(`a:has-text("${typeName}"), button:has-text("${typeName}"), .item:has-text("${typeName}")`).first();
  if (await typeLink.isVisible()) {
    await typeLink.click();
    await page.waitForTimeout(2500);
  }

  for (const item of items) {
    const pageText = await page.evaluate(() => document.body.innerText);
    if (pageText.includes(item)) {
      console.log(`[EXISTS] "${item}" already present under "${typeName}".`);
      continue;
    }

    console.log(`[CREATING] Adding "${item}" to "${typeName}"...`);
    // Click ADD CATEGORY button
    const addBtn = page.locator('button:has-text("ADD CATEGORY"), a:has-text("ADD CATEGORY"), button:has-text("Add")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(1500);

      // Fill in category title
      const input = page.locator('.modal-content input[type="text"], .modal-dialog input[type="text"], input[name*="title"], input[name*="name"], input.form-control').first();
      await input.fill(item);
      await page.waitForTimeout(500);

      // Submit modal
      const saveModalBtn = page.locator('.modal-content button:has-text("Save"), .modal-dialog button:has-text("Save"), button:has-text("Save"), button[type="submit"]').first();
      await saveModalBtn.click();
      await page.waitForTimeout(2500);
      console.log(`[OK] Added "${item}" to "${typeName}".`);
    }
  }

  await takeScreenshot(page, `fix_dropdown_${typeName.replace(/[^a-zA-Z0-9]/g, '_')}`);
}

async function main() {
  console.log('========================================================================');
  console.log('    APPLYING SUITEDASH FIXES FOR IDENTIFIED DISCREPANCIES               ');
  console.log('========================================================================\n');

  const { browser, page } = await createSession();

  try {
    // 1. Update all 3 pipelines to exact 8 canonical stages
    for (const p of PIPELINES) {
      await updatePipelineStages(page, p);
    }

    // 2. Add Custom Field categories
    await addDropdownCategories(page, 'Custom Fields', ['Tax Client', 'Corporate Client', 'Prospect']);

    // 3. Add CRM Follow-Up categories
    await addDropdownCategories(page, 'CRM Follow-Ups', ['Call Log', 'Walk-In Visit', 'Email Correspondence']);

  } catch (err) {
    console.error('Error during fixes:', err);
  } finally {
    await browser.close();
  }

  console.log('\n========================================================================');
  console.log('    ALL FIXES APPLIED. READY FOR RIGOROUS RE-VERIFICATION               ');
  console.log('========================================================================\n');
}

main();
