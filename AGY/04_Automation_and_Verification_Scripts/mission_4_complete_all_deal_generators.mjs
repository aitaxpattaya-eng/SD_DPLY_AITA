import { createSession, takeScreenshot } from './session.mjs';

const DEAL_GENERATORS = [
  {
    title: 'Thai Tax Return Deal Generator',
    dealTitle: '{{Tax Year}} - Thai Tax - {{clientFullName}}',
    pipeline: 'Thai Tax Returns',
    amount: '0.00'
  },
  {
    title: 'Corporate Return Deal Generator',
    dealTitle: '{{Tax Year}} - Corporate - {{clientFullName}}',
    pipeline: 'Corporate / Entity Returns',
    amount: '0.00'
  }
];

async function createDealGen(page, gen) {
  console.log(`\n[Deal Generator] Creating "${gen.title}"...`);
  await page.goto('https://secure.aitaxadvisers.com/crmDealGenerator/admin', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // Check if exists
  const exists = await page.evaluate((title) => {
    return Array.from(document.querySelectorAll('td, span, div')).some(e => e.innerText && e.innerText.trim().toLowerCase() === title.toLowerCase());
  }, gen.title);

  if (exists) {
    console.log(`[SKIP] Deal Generator "${gen.title}" already exists.`);
    return;
  }

  // Click Add Deal Generator
  await page.locator('button.addButton:has-text("ADD DEAL GENERATOR")').first().click();
  await page.waitForSelector('input[name="CrmDealGenerator[title]"]', { state: 'visible', timeout: 10000 });

  // Fill Titles & Amount
  await page.locator('input[name="CrmDealGenerator[title]"]').fill(gen.title);
  await page.locator('input[name="CrmDealGenerator[deal_title]"]').fill(gen.dealTitle);
  await page.locator('input[name="CrmDealGenerator[amount]"]').fill(gen.amount);

  // Select Pipeline
  await page.locator('select[name="CrmDealGenerator[pipelineID]"]').selectOption({ label: gen.pipeline });
  await page.waitForTimeout(500);

  // Click visible Save button
  console.log('Submitting Deal Generator...');
  const saveBtn = page.locator('button.rightbar-sticky-footer__btn--primary').first();
  await saveBtn.click();
  await page.waitForTimeout(3000);

  console.log(`[OK] Successfully created Deal Generator "${gen.title}"!`);
}

async function main() {
  console.log('[Phase 4] Creating remaining Deal Generators...');
  const { browser, page } = await createSession();

  for (const g of DEAL_GENERATORS) {
    try {
      await createDealGen(page, g);
    } catch (err) {
      console.error(`[ERROR] Failed creating Deal Generator ${g.title}:`, err.message);
    }
  }

  await page.goto('https://secure.aitaxadvisers.com/crmDealGenerator/admin', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, 'phase4_all_deal_generators_verified');

  await browser.close();
  console.log('[Phase 4] All Deal Generators Complete & Verified!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
