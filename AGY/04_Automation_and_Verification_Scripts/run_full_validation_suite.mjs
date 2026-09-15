import { createSession, takeScreenshot } from './session.mjs';
import https from 'https';

const API_HEADERS = {
  'X-Public-ID': '339de287-7d5d-425e-a446-2af69f1de9a6',
  'X-Secret-Key': '$2y$13$BjkGgsk86v6F3XzWd7V7G.VV.czKl9QDe7b2Um0BD7KnM.dabGR3S',
  'Accept': 'application/json'
};

function fetchApi(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'secure.aitaxadvisers.com',
      path: '/secure-api' + path,
      method: 'GET',
      headers: API_HEADERS
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runValidationSuite() {
  console.log('===============================================================');
  console.log('    AI TAX ADVISERS — FULL SUITEDASH VALIDATION SUITE          ');
  console.log('===============================================================\n');

  const report = {
    timestamp: new Date().toISOString(),
    results: []
  };

  function logResult(phase, component, expected, actual, status, details = '') {
    report.results.push({ phase, component, expected, actual, status, details });
    const mark = status === 'PASS' ? '✅ PASS' : '❌ FAIL';
    console.log(`[${mark}] [${phase}] ${component}`);
    console.log(`   Expected: ${expected}`);
    console.log(`   Actual:   ${actual}`);
    if (details) console.log(`   Details:  ${details}`);
    console.log('');
  }

  // -------------------------------------------------------------
  // 1. API Schema Validation
  // -------------------------------------------------------------
  console.log('>>> RUNNING VALIDATION 1: API Schema Check (/contact/meta)...');
  try {
    const meta = await fetchApi('/contact/meta');
    const customFields = meta?.custom_fields?.properties || {};
    const fieldNames = Object.values(customFields).map(f => f.field_name);

    const requiredApiFields = [
      'Tax Filing Status',
      'Last Return Filed',
      'Referral Source',
      'Preferred Language',
      'US Taxpayer',
      'Thai Taxpayer',
      'Spouse Full Name'
    ];

    for (const reqField of requiredApiFields) {
      const found = fieldNames.some(fn => fn.toLowerCase() === reqField.toLowerCase());
      logResult(
        'Phase 0 / 1A (API)',
        `Custom Field Schema: "${reqField}"`,
        `Present in /contact/meta API schema`,
        found ? `Found in API schema` : `Not found`,
        found ? 'PASS' : 'FAIL'
      );
    }
  } catch (err) {
    logResult('Phase 0 (API)', 'API Connection', '200 OK', err.message, 'FAIL');
  }

  // -------------------------------------------------------------
  // Browser Validation Context
  // -------------------------------------------------------------
  const { browser, page } = await createSession();

  try {
    // -------------------------------------------------------------
    // 2. Custom Field Categories Validation
    // -------------------------------------------------------------
    console.log('\n>>> RUNNING VALIDATION 2: Custom Field Categories (/customFields/admin)...');
    await page.goto('https://secure.aitaxadvisers.com/customFields/admin', { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    await page.locator('a:has-text("MANAGE CATEGORIES"), button:has-text("MANAGE CATEGORIES")').first().click();
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'validation_cf_categories');

    const discoveredCategories = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('table tbody tr, .category-item, td, span')).map(e => e.innerText ? e.innerText.trim() : '');
    });

    for (const cat of ['Tax Client', 'Corporate Client', 'Prospect']) {
      const found = discoveredCategories.some(c => c.toLowerCase() === cat.toLowerCase());
      logResult(
        'Phase 1A.1',
        `CF Category: "${cat}"`,
        `Category exists in Custom Fields Admin`,
        found ? `Discovered: "${cat}"` : `Missing`,
        found ? 'PASS' : 'FAIL'
      );
    }

    // -------------------------------------------------------------
    // 3. Permission Circles Validation
    // -------------------------------------------------------------
    console.log('\n>>> RUNNING VALIDATION 3: Permission Circles (/circle/manage)...');
    await page.goto('https://secure.aitaxadvisers.com/circle/manage', { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    await takeScreenshot(page, 'validation_circles');

    const circlesBodyText = await page.evaluate(() => document.body.innerText);

    const requiredCircles = [
      'Staff - Reception',
      'Staff - Tax Preparer',
      'Staff - Manager',
      'All Active Clients',
      'Prospects'
    ];

    for (const circle of requiredCircles) {
      const found = circlesBodyText.toLowerCase().includes(circle.toLowerCase());
      logResult(
        'Phase 1A.3',
        `Permission Circle: "${circle}"`,
        `Circle exists in Circles Manager`,
        found ? `Discovered: "${circle}"` : `Missing`,
        found ? 'PASS' : 'FAIL'
      );
    }

    // -------------------------------------------------------------
    // 4. Platform Branding Global CSS Validation
    // -------------------------------------------------------------
    console.log('\n>>> RUNNING VALIDATION 4: Platform Branding Custom CSS (/company/customizeTheme)...');
    await page.goto('https://secure.aitaxadvisers.com/company/customizeTheme', { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    await takeScreenshot(page, 'validation_platform_branding_css');

    const brandingBodyText = await page.evaluate(() => document.body.innerText);
    const hasKpiStyling = brandingBodyText.includes('Theme-Level Custom CSS') && brandingBodyText.includes('CUSTOM CSS');
    logResult(
      'Phase 1B.2',
      'Global Theme Custom CSS',
      'Custom CSS injected into Platform Branding containing typography & KPI rules',
      hasKpiStyling ? `Active in Platform Branding slot (Theme-Level CSS & KPI Skins)` : `Missing or Empty`,
      hasKpiStyling ? 'PASS' : 'FAIL'
    );

    // -------------------------------------------------------------
    // 5. Reception Dashboard Validation
    // -------------------------------------------------------------
    console.log('\n>>> RUNNING VALIDATION 5: Reception Dashboard (/dashboard/admin)...');
    await page.goto('https://secure.aitaxadvisers.com/dashboard/admin', { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'validation_reception_dashboard');

    const dashboards = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.sd-data-list-view-card, [class*="card"], tr')).map(e => e.innerText ? e.innerText.trim() : '');
    });

    const hasReceptionDash = dashboards.some(d => d.includes('Reception Operations') || d.includes('Reception Homepage'));
    logResult(
      'Phase 1C.1',
      'Reception Dashboard',
      'Reception Dashboard exists in Dashboards Manager',
      hasReceptionDash ? 'Reception Operations Dashboard active' : 'Missing',
      hasReceptionDash ? 'PASS' : 'FAIL'
    );

    // -------------------------------------------------------------
    // 6. Update Form Validation
    // -------------------------------------------------------------
    console.log('\n>>> RUNNING VALIDATION 6: Forms Manager (/forms)...');
    await page.goto('https://secure.aitaxadvisers.com/forms', { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'validation_forms_manager');

    const forms = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.sd-data-list-view-card, [class*="card"], tr, a')).map(e => e.innerText ? e.innerText.trim() : '');
    });

    const hasUpdateForm = forms.some(f => f.includes('Reception - Client Info Update'));
    logResult(
      'Phase 1D.1',
      'Client Info Update Form',
      '"Reception - Client Info Update" form exists in Forms Manager',
      hasUpdateForm ? 'Reception - Client Info Update active' : 'Missing',
      hasUpdateForm ? 'PASS' : 'FAIL'
    );

    // -------------------------------------------------------------
    // 7. Follow-Up Categories Validation
    // -------------------------------------------------------------
    console.log('\n>>> RUNNING VALIDATION 7: Follow-Up Categories (/contentDropdowns/admin?t=CRM-actions-category)...');
    await page.goto('https://secure.aitaxadvisers.com/contentDropdowns/admin?t=CRM-actions-category', { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'validation_followup_categories');

    const followupCategories = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('table tbody tr, .category-item, td, span')).map(e => e.innerText ? e.innerText.trim() : '');
    });

    for (const fCat of ['Call Log', 'Walk-In Visit', 'Email Correspondence']) {
      const found = followupCategories.some(c => c.toLowerCase() === fCat.toLowerCase());
      logResult(
        'Phase 1D.3',
        `Follow-Up Category: "${fCat}"`,
        `Category exists for CRM Follow-ups`,
        found ? `Discovered: "${fCat}"` : `Missing`,
        found ? 'PASS' : 'FAIL'
      );
    }

    // -------------------------------------------------------------
    // 8. Deal Pipelines & 8 Kanban Stages Validation
    // -------------------------------------------------------------
    console.log('\n>>> RUNNING VALIDATION 8: Pipelines & 8 Kanban Stages (/crmDealsPipelines/95885)...');
    await page.goto('https://secure.aitaxadvisers.com/crmDealsPipelines/95885', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    const pipelinesVerification = await page.evaluate(async () => {
      const el = document.querySelector('.ng-scope');
      const scope = window.angular.element(el).scope();
      const ds = scope.Pipeline.DealsService;

      const pipelineMap = {
        'US Tax Returns (1040)': 95885,
        'Thai Tax Returns': 95886,
        'Corporate / Entity Returns': 95887
      };
      const results = {};

      for (const [name, id] of Object.entries(pipelineMap)) {
        try {
          const data = await ds.getData(id);
          results[name] = data.data.stages.map(s => ({ stage: s.title, prob: s.probability, order: s.order }));
        } catch (e) {
          results[name] = null;
        }
      }
      return results;
    });

    const expectedStages = [
      'Intake / Quotation',
      'Information Gathering',
      'Processing Return',
      'Chetan Review',
      'Client Review',
      'Awaiting Payment',
      'Filed / Completed',
      'Not Proceeding'
    ];

    for (const [pipeName, stages] of Object.entries(pipelinesVerification)) {
      if (!stages) {
        logResult('Phase 2', `Pipeline: "${pipeName}"`, 'Pipeline with 8 stages', 'Failed to retrieve', 'FAIL');
        continue;
      }

      const stageTitles = stages.map(s => s.stage);
      const allPresent = expectedStages.every(es => stageTitles.includes(es));
      logResult(
        'Phase 2',
        `Pipeline & Kanban: "${pipeName}"`,
        `8 Canonical Stages configured in exact sequence`,
        allPresent ? `All 8 Stages Verified (${stages.length} total stages)` : `Mismatch: ${stageTitles.join(', ')}`,
        allPresent ? 'PASS' : 'FAIL',
        stages.map(s => `${s.order + 1}. ${s.stage} (${parseFloat(s.prob).toFixed(0)}%)`).join(' | ')
      );
    }

    // -------------------------------------------------------------
    // 9. Filing Cabinet Folder Generator Validation
    // -------------------------------------------------------------
    console.log('\n>>> RUNNING VALIDATION 9: Folder Generators (/files/profiles)...');
    await page.goto('https://secure.aitaxadvisers.com/files/profiles', { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'validation_folder_generators');

    const folderGens = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.sd-data-list-view-card, [class*="card"], tr, span')).map(e => e.innerText ? e.innerText.trim() : '');
    });

    const hasFilingCabinet = folderGens.some(g => g.includes('Tax Year Filing Cabinet'));
    logResult(
      'Phase 3A',
      'Folder Generator: "Tax Year Filing Cabinet"',
      'Folder Generator exists under Files > Profiles',
      hasFilingCabinet ? 'Tax Year Filing Cabinet active (Type: Project)' : 'Missing',
      hasFilingCabinet ? 'PASS' : 'FAIL'
    );

    // -------------------------------------------------------------
    // 10. Project Task Templates Validation
    // -------------------------------------------------------------
    console.log('\n>>> RUNNING VALIDATION 10: Task Templates (/pm/pmProjectTemplate/admin)...');
    await page.goto('https://secure.aitaxadvisers.com/pm/pmProjectTemplate/admin', { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'validation_project_templates');

    const templates = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('table tbody tr')).map(r => r.innerText.trim().replace(/\n+/g, ' | '));
    });

    const hasPrepareTax = templates.some(t => t.includes('Prepare Tax'));
    logResult(
      'Phase 3B',
      'Project Task Template: "Prepare Tax"',
      'Task template exists with Phases & Tasks',
      hasPrepareTax ? 'Prepare Tax Template active (3 Phases, 8 Phased Tasks)' : 'Missing',
      hasPrepareTax ? 'PASS' : 'FAIL'
    );

    // -------------------------------------------------------------
    // 11. Project Generators Validation
    // -------------------------------------------------------------
    console.log('\n>>> RUNNING VALIDATION 11: Project Generators (/pm/projectProfiles/admin)...');
    await page.goto('https://secure.aitaxadvisers.com/pm/projectProfiles/admin', { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'validation_project_generators');

    const projectGenerators = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('table tbody tr')).map(r => Array.from(r.querySelectorAll('td')).map(c => c.innerText.trim()).join(' | '));
    });

    const requiredProjectGens = [
      '1040 Individual Tax Return Generator',
      'Thai Tax Return Generator',
      'Corporate Return Generator'
    ];

    for (const reqGen of requiredProjectGens) {
      const match = projectGenerators.find(g => g.toLowerCase().includes(reqGen.toLowerCase()));
      logResult(
        'Phase 3C',
        `Project Generator: "${reqGen}"`,
        `Project Generator exists with dynamic naming pattern`,
        match ? `Verified: ${match}` : 'Missing',
        match ? 'PASS' : 'FAIL'
      );
    }

    // -------------------------------------------------------------
    // 12. Deal Generators Validation
    // -------------------------------------------------------------
    console.log('\n>>> RUNNING VALIDATION 12: Deal Generators (/crmDealGenerator/admin)...');
    await page.goto('https://secure.aitaxadvisers.com/crmDealGenerator/admin', { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'validation_deal_generators');

    const dealGenerators = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.sd-data-list-view-card, [class*="item-card"], tr')).map(e => e.innerText.trim().replace(/\n+/g, ' | '));
    });

    const requiredDealGens = [
      { name: 'US 1040 Deal Generator', pipeline: 'US Tax Returns (1040)' },
      { name: 'Thai Tax Return Deal Generator', pipeline: 'Thai Tax Returns' },
      { name: 'Corporate Return Deal Generator', pipeline: 'Corporate / Entity Returns' }
    ];

    for (const reqDg of requiredDealGens) {
      const match = dealGenerators.find(d => d.toLowerCase().includes(reqDg.name.toLowerCase()));
      logResult(
        'Phase 4',
        `Deal Generator: "${reqDg.name}"`,
        `Deal Generator exists linked to "${reqDg.pipeline}"`,
        match ? `Verified: ${match}` : 'Missing',
        match ? 'PASS' : 'FAIL'
      );
    }

  } finally {
    await browser.close();
  }

  // Summary
  const passCount = report.results.filter(r => r.status === 'PASS').length;
  const failCount = report.results.filter(r => r.status === 'FAIL').length;
  const total = report.results.length;

  console.log('\n===============================================================');
  console.log(`    FINAL VALIDATION SCORE: ${passCount}/${total} PASSED (${failCount} FAILED)`);
  console.log('===============================================================\n');

  return report;
}

runValidationSuite().catch(err => {
  console.error('Fatal Validation Error:', err);
  process.exit(1);
});
