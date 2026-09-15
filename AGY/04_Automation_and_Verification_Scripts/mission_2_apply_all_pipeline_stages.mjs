import { createSession, takeScreenshot } from './session.mjs';

const CANONICAL_STAGES = [
  { title: 'Intake / Quotation', prob: 10 },
  { title: 'Information Gathering', prob: 25 },
  { title: 'Processing Return', prob: 50 },
  { title: 'Chetan Review', prob: 70 },
  { title: 'Client Review', prob: 85 },
  { title: 'Awaiting Payment', prob: 95 },
  { title: 'Filed / Completed', prob: 100 },
  { title: 'Not Proceeding', prob: 0 }
];

const PIPELINES = [
  { id: 95885, name: 'US Tax Returns (1040)', url: 'https://secure.aitaxadvisers.com/crmDealsPipelines/95885' },
  { id: 95886, name: 'Thai Tax Returns', url: 'https://secure.aitaxadvisers.com/crmDealsPipelines/95886' },
  { id: 95887, name: 'Corporate / Entity Returns', url: 'https://secure.aitaxadvisers.com/crmDealsPipelines/95887' }
];

async function configurePipeline(page, pipeline) {
  console.log(`\n[Pipeline Stages] Configuring "${pipeline.name}" (ID: ${pipeline.id})...`);
  await page.goto(pipeline.url, { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  const res = await page.evaluate(async ({ pipeId, canonical }) => {
    const el = document.querySelector('.ng-scope');
    const scope = window.angular.element(el).scope();
    const p = scope.Pipeline;

    const stages = canonical.map((c, idx) => ({
      id: 'new' + (Date.now() + idx),
      title: c.title,
      probability: c.prob,
      order: idx
    }));

    const response = await p.DealsService.updateStages(pipeId, stages, []);
    return { status: response.status, count: response.data.stages.length, stages: response.data.stages };
  }, { pipeId: pipeline.id, canonical: CANONICAL_STAGES });

  console.log(`[OK] ${pipeline.name} configured with ${res.count} stages!`);
}

async function main() {
  console.log('[Phase 2] Configuring 8 Canonical Stages on all 3 Pipelines...');
  const { browser, page } = await createSession();

  for (const p of PIPELINES) {
    try {
      await configurePipeline(page, p);
    } catch (err) {
      console.error(`[ERROR] Failed configuring ${p.name}:`, err.message);
    }
  }

  // Reload 1040 Pipeline and take screenshot
  await page.goto('https://secure.aitaxadvisers.com/crmDealsPipelines/95885', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  await takeScreenshot(page, 'phase2_us_1040_kanban_complete');

  // Reload Thai Tax Returns and take screenshot
  await page.goto('https://secure.aitaxadvisers.com/crmDealsPipelines/95886', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  await takeScreenshot(page, 'phase2_thai_tax_kanban_complete');

  // Reload Corporate Returns and take screenshot
  await page.goto('https://secure.aitaxadvisers.com/crmDealsPipelines/95887', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  await takeScreenshot(page, 'phase2_corporate_kanban_complete');

  await browser.close();
  console.log('[Phase 2] All Pipelines & 8 Stages Configuration Complete!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
