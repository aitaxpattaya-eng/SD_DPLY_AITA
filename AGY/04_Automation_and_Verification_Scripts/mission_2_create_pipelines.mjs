import { createSession, takeScreenshot } from './session.mjs';

const PIPELINES_TO_CREATE = [
  {
    name: 'US Tax Returns (1040)',
    description: 'Individual US Tax Returns (Form 1040) Pipeline'
  },
  {
    name: 'Thai Tax Returns',
    description: 'Thai Personal & Corporate Tax Returns Pipeline'
  },
  {
    name: 'Corporate / Entity Returns',
    description: 'US Corporate & Partnership Returns (1120, 1120-S, 1065, 1041) Pipeline'
  }
];

async function createPipeline(page, pipeline) {
  console.log(`\n[Pipeline] Creating: "${pipeline.name}"...`);
  await page.goto('https://secure.aitaxadvisers.com/crmDealsPipelines/admin', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // Check if pipeline already exists
  const existing = await page.evaluate((pName) => {
    return Array.from(document.querySelectorAll('a, span, td, div')).some(e => e.innerText && e.innerText.trim().toLowerCase() === pName.toLowerCase());
  }, pipeline.name);

  if (existing) {
    console.log(`[SKIP] Pipeline "${pipeline.name}" already exists.`);
    return;
  }

  // Click Add Pipeline button
  await page.locator('button.addButton:has-text("ADD PIPELINE")').first().click();
  await page.waitForSelector('input[name="CrmDealsPipelines[title]"]', { state: 'visible', timeout: 10000 });

  // Fill Title & Description
  await page.locator('input[name="CrmDealsPipelines[title]"]').fill(pipeline.name);
  if (pipeline.description) {
    await page.locator('textarea[name="CrmDealsPipelines[description]"]').fill(pipeline.description);
  }

  // Click Add button
  const addBtn = page.locator('button.rightbar-sticky-footer__btn--primary:has-text("Add"), button:has-text("Add")').first();
  await addBtn.click();
  await page.waitForTimeout(3000);

  console.log(`[OK] Created Pipeline "${pipeline.name}"! URL: ${page.url()}`);
}

async function main() {
  console.log('[Phase 2] Starting Batch Pipelines Creation...');
  const { browser, page } = await createSession();

  for (const p of PIPELINES_TO_CREATE) {
    try {
      await createPipeline(page, p);
    } catch (err) {
      console.error(`[ERROR] Failed creating pipeline ${p.name}:`, err.message);
    }
  }

  await page.goto('https://secure.aitaxadvisers.com/crmDealsPipelines/admin', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, 'all_pipelines_created');
  await browser.close();
  console.log('[Phase 2] Pipelines Creation Finished!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
