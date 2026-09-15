import { createSession, takeScreenshot } from './session.mjs';

const PROJECT_GENERATORS = [
  {
    name: '1040 Individual Tax Return Generator',
    projectName: '{{Tax Year}} 1040 Tax Return - {{clientFullName}}',
    template: 'Prepare Tax',
    folderGenerator: 'Tax Year Filing Cabinet'
  },
  {
    name: 'Thai Tax Return Generator',
    projectName: '{{Tax Year}} Thai Tax Return - {{clientFullName}}',
    template: 'Prepare Tax',
    folderGenerator: 'Tax Year Filing Cabinet'
  },
  {
    name: 'Corporate Return Generator',
    projectName: '{{Tax Year}} Corporate Tax Return - {{clientFullName}}',
    template: 'Prepare Tax',
    folderGenerator: 'Tax Year Filing Cabinet'
  }
];

async function createGenerator(page, gen) {
  console.log(`\n[Generator] Creating: "${gen.name}"...`);
  await page.goto('https://secure.aitaxadvisers.com/pm/projectProfiles/create', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // Fill Generator Name
  await page.locator('input[name="PmProjectProfiles[name]"]').fill(gen.name);

  // Fill Generated Project Name
  await page.locator('input[name="PmProjectProfiles[projectName]"]').fill(gen.projectName);

  // Select Template if available
  try {
    await page.locator('select[name="PmProjectProfiles[templateID]"]').selectOption({ label: gen.template });
  } catch (e) {
    console.log(`Could not select template ${gen.template}`);
  }

  // Select Folder Generator if available
  try {
    await page.locator('select[name="PmProjectProfiles[folderGeneratorID]"]').selectOption({ label: gen.folderGenerator });
  } catch (e) {
    console.log(`Could not select folder generator ${gen.folderGenerator}`);
  }

  await page.waitForTimeout(1000);

  // Click Save / Create button
  console.log('Submitting Generator...');
  const createBtn = page.locator('button:has-text("Create"), button[name="yt0"], input[type="submit"][value="Create"]').first();
  await createBtn.click();
  await page.waitForTimeout(3000);

  console.log(`[OK] Finished submitting "${gen.name}". Current URL: ${page.url()}`);
}

async function main() {
  console.log('[Phase 3] Direct Creation of Project Generators...');
  const { browser, page } = await createSession();

  for (const g of PROJECT_GENERATORS) {
    try {
      await createGenerator(page, g);
    } catch (err) {
      console.error(`[ERROR] Failed creating generator ${g.name}:`, err.message);
    }
  }

  await page.goto('https://secure.aitaxadvisers.com/pm/projectProfiles/admin', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, 'phase3_project_generators_created_verified');

  await browser.close();
  console.log('[Phase 3] All Project Generators Created & Verified!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
