import { createSession, takeScreenshot } from './session.mjs';

const DEAL_GENERATORS = [
  {
    title: 'US 1040 Return Deal Generator',
    dealTitle: '{{Tax Year}} - 1040 - {{clientFullName}}',
    pipeline: 'US Tax Returns (1040)'
  },
  {
    title: 'Thai Tax Return Deal Generator',
    dealTitle: '{{Tax Year}} - Thai Tax - {{clientFullName}}',
    pipeline: 'Thai Tax Returns'
  },
  {
    title: 'Corporate Return Deal Generator',
    dealTitle: '{{Tax Year}} - Corporate - {{clientFullName}}',
    pipeline: 'Corporate / Entity Returns'
  }
];

async function createDealGenerator(page, gen) {
  console.log(`\n[Deal Generator] Creating: "${gen.title}"...`);
  await page.goto('https://secure.aitaxadvisers.com/crmDealGenerator/admin', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // Click Add Deal Generator
  await page.locator('button.addButton:has-text("ADD DEAL GENERATOR")').first().click();
  await page.waitForSelector('input[name="CrmDealGenerator[title]"]', { state: 'visible', timeout: 10000 });

  // Fill Title & Deal Title
  await page.locator('input[name="CrmDealGenerator[title]"]').fill(gen.title);
  await page.locator('input[name="CrmDealGenerator[deal_title]"]').fill(gen.dealTitle);

  // Select Pipeline
  await page.locator('select[name="CrmDealGenerator[pipelineID]"]').selectOption({ label: gen.pipeline });
  await page.waitForTimeout(500);

  // Click Save
  console.log(`Saving Deal Generator "${gen.title}"...`);
  const saveBtn = page.locator('button:has-text("Save"), button[name="yt0"]').first();
  await saveBtn.click();
  await page.waitForTimeout(3000);

  console.log(`[OK] Created Deal Generator: "${gen.title}"!`);
}

async function main() {
  console.log('[Phase 4] Creating Deal Generators for all 3 Pipelines...');
  const { browser, page } = await createSession();

  for (const g of DEAL_GENERATORS) {
    try {
      await createDealGenerator(page, g);
    } catch (err) {
      console.error(`[ERROR] Failed creating Deal Generator ${g.title}:`, err.message);
    }
  }

  await page.goto('https://secure.aitaxadvisers.com/crmDealGenerator/admin', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, 'phase4_deal_generators_complete');

  await browser.close();
  console.log('[Phase 4] Deal Generators Creation Complete!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
