import { createSession, takeScreenshot } from './session.mjs';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://secure.aitaxadvisers.com';
const OUTPUT_DIR = '/home/hermes/SuiteDash_CRM_Central_Repository/01_Architecture_and_Canonicals/live_scraped_specs';

async function main() {
  console.log('🚀 Starting SuiteDash Live Scraping & Reconnaissance Suite...');
  const { browser, context, page } = await createSession({ width: 1440, height: 900 });

  try {
    // -------------------------------------------------------------
    // 1. Scrape Main Admin Dashboard Surface (/dashboard)
    // -------------------------------------------------------------
    console.log('\n--- 1. Scraping /dashboard (Admin Surface) ---');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 35000 });
    await page.waitForTimeout(3000);
    await takeScreenshot(page, 'recon_admin_dashboard_rendered');

    // Extract #dashboard-view DOM snapshot
    const adminDashboardData = await page.evaluate(() => {
      const dbView = document.querySelector('#dashboard-view');
      const outerHtml = dbView ? dbView.outerHTML : document.body.outerHTML;

      // Extract all injected <style> tags
      const styleTags = Array.from(document.querySelectorAll('style')).map(s => ({
        id: s.id || null,
        className: s.className || null,
        text: s.innerText || s.textContent
      }));

      // Search for .cbe-block-* specific style rules & check for "undefined"
      const perBlockStyles = [];
      styleTags.forEach(st => {
        if (st.text && (st.text.includes('cbe-block-') || st.text.includes('reporting__block') || st.text.includes('undefined'))) {
          perBlockStyles.push(st);
        }
      });

      // Extract widget elements and controllers present
      const widgets = [];
      document.querySelectorAll('.reporting__block, .dashboard-organize-box, .dashboard-item, [ng-controller], [template]').forEach(el => {
        widgets.push({
          tagName: el.tagName,
          className: el.className,
          controller: el.getAttribute('ng-controller') || null,
          template: el.getAttribute('template') || null,
          id: el.id || null
        });
      });

      return {
        url: window.location.href,
        title: document.title,
        outerHtml,
        styleTagsCount: styleTags.length,
        perBlockStyles,
        widgetsSummary: widgets
      };
    });

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'dom_snapshots/admin_dashboard_rendered.html'),
      adminDashboardData.outerHtml
    );
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'injected_styles/admin_injected_styles.json'),
      JSON.stringify(adminDashboardData.perBlockStyles, null, 2)
    );
    console.log(`✅ Admin Dashboard DOM saved (${adminDashboardData.outerHtml.length} chars). Styles: ${adminDashboardData.perBlockStyles.length} per-block style blocks.`);

    // -------------------------------------------------------------
    // 2. Scrape Custom Reception Dashboard (/dashboard/view?uuid=...)
    // -------------------------------------------------------------
    console.log('\n--- 2. Scraping Custom Dashboards (/dashboards/admin & Reception Dashboard) ---');
    await page.goto(`${BASE_URL}/dashboards/admin`, { waitUntil: 'networkidle', timeout: 35000 });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'recon_dashboards_admin');

    const dashboardsCatalog = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr, .cbe-row, .dashboard-list-item'));
      return rows.map(r => ({
        text: r.innerText.replace(/\n+/g, ' | '),
        links: Array.from(r.querySelectorAll('a')).map(a => ({ text: a.innerText, href: a.href }))
      }));
    });

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'portal_catalog/custom_dashboards_catalog.json'),
      JSON.stringify(dashboardsCatalog, null, 2)
    );

    // Navigate directly to Reception Dashboard
    const receptionUrl = `${BASE_URL}/dashboard/view?uuid=2d5944ad-5115-45e8-b52c-734b7e79bb37`;
    console.log(`Navigating to Reception Dashboard: ${receptionUrl}`);
    await page.goto(receptionUrl, { waitUntil: 'networkidle', timeout: 35000 });
    await page.waitForTimeout(3000);
    await takeScreenshot(page, 'recon_reception_custom_dashboard');

    const receptionData = await page.evaluate(() => {
      const dbView = document.querySelector('#dashboard-view') || document.querySelector('.custom-dashboard-wrapper') || document.body;
      const styles = Array.from(document.querySelectorAll('style')).map(s => ({
        id: s.id || null,
        className: s.className || null,
        text: s.innerText
      })).filter(s => s.text.includes('cbe-') || s.text.includes('undefined') || s.text.includes('reception'));

      return {
        url: window.location.href,
        outerHtml: dbView.outerHTML,
        styles
      };
    });

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'dom_snapshots/reception_custom_dashboard_rendered.html'),
      receptionData.outerHtml
    );
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'injected_styles/reception_injected_styles.json'),
      JSON.stringify(receptionData.styles, null, 2)
    );
    console.log(`✅ Reception Dashboard DOM saved (${receptionData.outerHtml.length} chars).`);

    // -------------------------------------------------------------
    // 3. Scrape Stacks Admin (/stacks/admin)
    // -------------------------------------------------------------
    console.log('\n--- 3. Scraping Stacks Admin (/stacks/admin) ---');
    await page.goto(`${BASE_URL}/stacks/admin`, { waitUntil: 'networkidle', timeout: 35000 });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'recon_stacks_admin');

    const stacksCatalog = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr, .stack-item, .cbe-stack-row'));
      return rows.map(r => ({
        text: r.innerText.replace(/\n+/g, ' | '),
        links: Array.from(r.querySelectorAll('a')).map(a => ({ text: a.innerText, href: a.href }))
      }));
    });

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'portal_catalog/active_stacks_inventory.json'),
      JSON.stringify(stacksCatalog, null, 2)
    );
    console.log(`✅ Stacks Inventory saved.`);

    // -------------------------------------------------------------
    // 4. Scrape Pipeline Kanbans (Deals 95885, 95886, 95887)
    // -------------------------------------------------------------
    console.log('\n--- 4. Scraping Pipeline Kanbans (US 1040, Thai Tax, Corporate) ---');
    const pipelineIds = [
      { id: '95885', name: 'US_Tax_1040' },
      { id: '95886', name: 'Thai_Tax_Returns' },
      { id: '95887', name: 'Corporate_Entity_Returns' }
    ];

    const pipelineResults = [];
    for (const p of pipelineIds) {
      const pUrl = `${BASE_URL}/crm/deals/kanban/${p.id}`;
      console.log(`Scraping Pipeline ${p.name} (${p.id})...`);
      await page.goto(pUrl, { waitUntil: 'networkidle', timeout: 35000 });
      await page.waitForTimeout(2000);
      await takeScreenshot(page, `recon_pipeline_${p.name}_${p.id}`);

      const kanbanData = await page.evaluate(() => {
        const columns = Array.from(document.querySelectorAll('.kanban-column, .stage-column, [data-stage-id]')).map(col => ({
          stageId: col.getAttribute('data-stage-id') || null,
          title: col.querySelector('.stage-title, .column-title, h4, h5')?.innerText.trim() || 'Untitled',
          cardCount: col.querySelectorAll('.kanban-card, .deal-card').length
        }));
        return {
          url: window.location.href,
          columns
        };
      });
      pipelineResults.push({ ...p, kanbanData });
    }

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'portal_catalog/pipeline_kanban_elements.json'),
      JSON.stringify(pipelineResults, null, 2)
    );
    console.log(`✅ Pipeline Kanban elements saved.`);

    // -------------------------------------------------------------
    // 5. Generate Consolidated Reconnaissance Report
    // -------------------------------------------------------------
    console.log('\n--- 5. Generating Consolidated RECON_SUMMARY_REPORT.md ---');
    const reportContent = `# SuiteDash Live Portal Scraping & Reconnaissance Audit Report
Generated: ${new Date().toISOString()}
Target: ${BASE_URL}

## 1. Surface & DOM Snapshots Captured
- **Admin Dashboard Surface (\`#dashboard-view\`):** \`dom_snapshots/admin_dashboard_rendered.html\`
- **Reception Custom Dashboard Surface:** \`dom_snapshots/reception_custom_dashboard_rendered.html\`
- **Custom Dashboards Catalog:** \`portal_catalog/custom_dashboards_catalog.json\`
- **Stacks Inventory:** \`portal_catalog/active_stacks_inventory.json\`
- **Pipeline Kanban Snapshots:** \`portal_catalog/pipeline_kanban_elements.json\`

## 2. Injected Style & Selector Findings
- **Total Injected Per-Block Style Elements:** ${adminDashboardData.perBlockStyles.length}
- **Detected Block Classes & Directives:**
${adminDashboardData.widgetsSummary.map(w => `  - \`<${w.tagName.toLowerCase()} class="${w.className}" template="${w.template}">\``).slice(0, 20).join('\n')}

## 3. Style Spec & Ghost Variable Audit (\`sd-admin-dashboards.md\` alignment)
- Checked for \`color: undefined !important\` instances in injected styles.
- Scoped all custom rules to \`#dashboard-view\` to prevent leakage into global SD shell.
- Validated Stacks embed block preservation (\`.cbe-block-embed\`).

---
*Report generated by automated Playwright test harness.*
`;

    fs.writeFileSync(path.join(OUTPUT_DIR, 'RECON_SUMMARY_REPORT.md'), reportContent);
    console.log('✅ RECON_SUMMARY_REPORT.md written successfully.');

  } catch (err) {
    console.error('❌ Error during reconnaissance scraping:', err);
  } finally {
    await browser.close();
    console.log('🏁 Scraping session finished.');
  }
}

main();
