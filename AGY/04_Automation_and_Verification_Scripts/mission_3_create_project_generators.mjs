import { createSession, takeScreenshot } from './session.mjs';

const PROJECT_GENERATORS = [
  {
    title: '1040 Individual Tax Return Generator',
    projectName: '{{Tax Year}} 1040 Tax Return - {{clientFullName}}',
    template: 'Prepare Tax',
    folderGenerator: 'Tax Year Filing Cabinet',
    team: 'Tax Processing Team Bangkok'
  },
  {
    title: 'Thai Tax Return Generator',
    projectName: '{{Tax Year}} Thai Tax Return - {{clientFullName}}',
    template: 'Prepare Tax',
    folderGenerator: 'Tax Year Filing Cabinet',
    team: 'Thai Tax / External Accounting Team Bangkok'
  },
  {
    title: 'Corporate Return Generator',
    projectName: '{{Tax Year}} Corporate Tax Return - {{clientFullName}}',
    template: 'Prepare Tax',
    folderGenerator: 'Tax Year Filing Cabinet',
    team: 'Tax Processing Team Bangkok'
  }
];

async function createProjectGenerator(page, gen) {
  console.log(`\n[Generator] Creating: "${gen.title}"...`);
  await page.goto('https://secure.aitaxadvisers.com/pm/projectProfiles/admin', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // Check if exists
  const exists = await page.evaluate((title) => {
    return Array.from(document.querySelectorAll('td, a, span')).some(e => e.innerText && e.innerText.trim().toLowerCase() === title.toLowerCase());
  }, gen.title);

  if (exists) {
    console.log(`[SKIP] Generator "${gen.title}" already exists.`);
    return;
  }

  // Click Add Project Generator
  await page.locator('button:has-text("ADD PROJECT GENERATOR"), a:has-text("ADD PROJECT GENERATOR")').first().click();
  await page.waitForSelector('input[name="PmProjectProfiles[title]"]', { state: 'visible', timeout: 10000 });

  // Fill Generator Title
  await page.locator('input[name="PmProjectProfiles[title]"]').fill(gen.title);

  // Fill Generated Project Name
  await page.locator('input[name="PmProjectProfiles[projectName]"]').fill(gen.projectName);

  // Select Template
  await page.locator('select[name="PmProjectProfiles[templateID]"]').selectOption({ label: gen.template });
  await page.waitForTimeout(500);

  // Select Folder Generator
  await page.locator('select[name="PmProjectProfiles[folderGeneratorID]"]').selectOption({ label: gen.folderGenerator });
  await page.waitForTimeout(500);

  // Select Team
  try {
    await page.evaluate((teamName) => {
      const select = document.querySelector('select[name="PmProjectProfiles[assignedTeams][]"]');
      if (select) {
        Array.from(select.options).forEach(opt => {
          if (opt.text.toLowerCase().includes(teamName.toLowerCase())) {
            opt.selected = true;
          }
        });
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, gen.team);
  } catch (e) {}

  await page.waitForTimeout(500);

  // Click Create
  console.log('Submitting Project Generator...');
  const createBtn = page.locator('button:has-text("Create"), button[name="yt0"]').first();
  await createBtn.click();
  await page.waitForTimeout(3000);

  console.log(`[OK] Created Project Generator: "${gen.title}"!`);
}

async function main() {
  console.log('[Phase 3] Starting Batch Project Generators Creation...');
  const { browser, page } = await createSession();

  for (const g of PROJECT_GENERATORS) {
    try {
      await createProjectGenerator(page, g);
    } catch (err) {
      console.error(`[ERROR] Failed creating generator ${g.title}:`, err.message);
    }
  }

  await page.goto('https://secure.aitaxadvisers.com/pm/projectProfiles/admin', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, 'phase3_project_generators_complete');

  await browser.close();
  console.log('[Phase 3] Project Generators Creation Finished!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
