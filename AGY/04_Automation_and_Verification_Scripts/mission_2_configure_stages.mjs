import { createSession, takeScreenshot } from './session.mjs';

const CANONICAL_STAGES = [
  { title: 'Intake / Quotation', probability: '10.00' },
  { title: 'Information Gathering', probability: '25.00' },
  { title: 'Processing Return', probability: '50.00' },
  { title: 'Chetan Review', probability: '70.00' },
  { title: 'Client Review', probability: '85.00' },
  { title: 'Awaiting Payment', probability: '95.00' },
  { title: 'Filed / Completed', probability: '100.00' },
  { title: 'Not Proceeding', probability: '0.00' }
];

const PIPELINES = [
  { name: 'US Tax Returns (1040)', url: 'https://secure.aitaxadvisers.com/crmDealsPipelines/95885' },
  { name: 'Thai Tax Returns', url: 'https://secure.aitaxadvisers.com/crmDealsPipelines/95886' },
  { name: 'Corporate / Entity Returns', url: 'https://secure.aitaxadvisers.com/crmDealsPipelines/95887' }
];

async function configurePipelineStages(page, pipeline) {
  console.log(`\n[Stages] Configuring stages for "${pipeline.name}" (${pipeline.url})...`);
  await page.goto(pipeline.url, { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  const result = await page.evaluate(async (canonicalStages) => {
    const el = document.querySelector('.ng-scope');
    if (!window.angular || !el) return { error: 'No angular' };
    const scope = window.angular.element(el).scope();
    const p = scope.Pipeline;
    if (!p) return { error: 'No pipeline on scope' };

    // Format new stages
    const newStages = canonicalStages.map((s, idx) => ({
      title: s.title,
      probability: s.probability,
      order: idx
    }));

    p.stages = newStages;
    scope.$apply();

    // Call saveStages()
    if (typeof p.saveStages === 'function') {
      await p.saveStages();
      return { success: true, count: newStages.length };
    } else {
      return { error: 'saveStages is not a function' };
    }
  }, CANONICAL_STAGES);

  console.log(`Save result for ${pipeline.name}:`, result);
  await page.waitForTimeout(3000);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // Read back stages to verify
  const verifiedStages = await page.evaluate(() => {
    const el = document.querySelector('.ng-scope');
    const scope = window.angular.element(el).scope();
    const p = scope.Pipeline;
    return p ? p.stages.map(s => ({ title: s.title, prob: s.probability, order: s.order })) : [];
  });

  console.log(`Verified stages for ${pipeline.name}:`, verifiedStages);
}

async function main() {
  console.log('[Phase 2] Configuring 8 Canonical Kanban Stages on all 3 Pipelines...');
  const { browser, page } = await createSession();

  for (const p of PIPELINES) {
    try {
      await configurePipelineStages(page, p);
    } catch (err) {
      console.error(`[ERROR] Failed configuring stages for ${p.name}:`, err.message);
    }
  }

  await page.goto('https://secure.aitaxadvisers.com/crmDealsPipelines/95885', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, 'phase2_us_1040_pipeline_stages_verified');

  await browser.close();
  console.log('[Phase 2] Pipeline Stages Configuration Complete!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
