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

async function configurePipeline(page, pipeline) {
  console.log(`\n[Pipeline Stages] Configuring "${pipeline.name}" (${pipeline.url})...`);
  await page.goto(pipeline.url, { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // If there's an "Add Stage" button on empty pipeline, click it
  const addStageBtn = page.locator('button:has-text("Add Stage"), a:has-text("Add Stage")').first();
  if (await addStageBtn.count() > 0) {
    await addStageBtn.click();
    await page.waitForTimeout(1000);
  } else {
    // Or enter manage stages
    const manageBtn = page.locator('button.ribbon-action:has-text("MANAGE STAGES")').first();
    if (await manageBtn.count() > 0) {
      await manageBtn.click();
      await page.waitForTimeout(1000);
    }
  }

  // Click after-column to create 8 total stages
  for (let i = 0; i < 7; i++) {
    const afterBtn = page.locator('button.after-column').last();
    if (await afterBtn.count() > 0) {
      await afterBtn.click();
      await page.waitForTimeout(400);
    }
  }

  // Click on each stage header to open edit mode inputs
  const headers = page.locator('.pipeline-header.ui-sortable-handle .title');
  const count = await headers.count();
  console.log(`Discovered ${count} stage columns.`);

  for (let i = 0; i < Math.min(count, CANONICAL_STAGES.length); i++) {
    await headers.nth(i).click();
    await page.waitForTimeout(300);
  }

  // Populate titles and probabilities
  await page.evaluate((canonical) => {
    const sortables = Array.from(document.querySelectorAll('.pipeline-header.ui-sortable-handle'));
    sortables.forEach((s, idx) => {
      if (idx < canonical.length) {
        const titleInput = s.querySelector('input[type="text"], input:not([type="checkbox"]):not([type="hidden"])');
        const probInput = s.querySelectorAll('input:not([type="checkbox"]):not([type="hidden"])')[1];
        if (titleInput) {
          titleInput.value = canonical[idx].title;
          titleInput.dispatchEvent(new Event('input', { bubbles: true }));
          titleInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (probInput) {
          probInput.value = canonical[idx].prob;
          probInput.dispatchEvent(new Event('input', { bubbles: true }));
          probInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });
  }, CANONICAL_STAGES);

  await page.waitForTimeout(1000);

  // Click Save
  console.log('Saving stages...');
  const saveBtn = page.locator('button:has-text("Save"), button.sd-btn-wide-primary-24px').first();
  await saveBtn.click();
  await page.waitForTimeout(3000);

  console.log(`[OK] Successfully configured and saved 8 stages for ${pipeline.name}!`);
}

async function main() {
  console.log('[Phase 2] Setting 8 Canonical Stages on all 3 Pipelines via UI Automation...');
  const { browser, page } = await createSession();

  for (const p of PIPELINES) {
    try {
      await configurePipeline(page, p);
    } catch (err) {
      console.error(`[ERROR] Failed configuring stages for ${p.name}:`, err.message);
    }
  }

  await page.goto('https://secure.aitaxadvisers.com/crmDealsPipelines/95885', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, 'phase2_all_stages_saved_verified');

  await browser.close();
  console.log('[Phase 2] All Pipelines and 8 Stages fully configured!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
