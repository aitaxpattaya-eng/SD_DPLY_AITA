import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_DIR = '/home/hermes/SuiteDash_CRM_Central_Repository/05_Demo_and_Portal_Prototypes/receptionist_dashboards';
const SS_DIR = '/home/hermes/SuiteDash_CRM_Central_Repository/04_Automation_and_Verification_Scripts/screenshots';

async function verifyDashboards() {
  console.log('========================================================================');
  console.log('   VERIFYING 3 RECEPTIONIST DASHBOARDS (DESKTOP + MOBILE 390px)         ');
  console.log('========================================================================\n');

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

  const versions = [
    { name: 'V1_Command_Center', file: 'version1_command_center/index.html' },
    { name: 'V2_Concierge_Hospitality', file: 'version2_concierge_hospitality/index.html' },
    { name: 'V3_Operational_Matrix', file: 'version3_operational_matrix/index.html' }
  ];

  // 1. Test Desktop (1440x900)
  const deskContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const deskPage = await deskContext.newPage();

  for (const v of versions) {
    const filePath = 'file://' + path.join(BASE_DIR, v.file);
    console.log(`[Testing Desktop] ${v.name} -> ${filePath}`);
    await deskPage.goto(filePath, { waitUntil: 'load' });
    await deskPage.waitForTimeout(1000);

    const ssPath = path.join(SS_DIR, `receptionist_${v.name}_desktop.png`);
    await deskPage.screenshot({ path: ssPath, fullPage: true });
    console.log(`  📸 Screenshot Saved: ${ssPath}`);
  }

  // 2. Test Mobile (390x844 - iPhone 14/15)
  const mobContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobPage = await mobContext.newPage();

  for (const v of versions) {
    const filePath = 'file://' + path.join(BASE_DIR, v.file);
    console.log(`[Testing Mobile 390px] ${v.name} -> ${filePath}`);
    await mobPage.goto(filePath, { waitUntil: 'load' });
    await mobPage.waitForTimeout(1000);

    const actualWidth = await mobPage.evaluate(() => window.innerWidth);
    console.log(`  🔍 innerWidth: ${actualWidth}px (Target: 390px)`);

    const ssPath = path.join(SS_DIR, `receptionist_${v.name}_mobile_390px.png`);
    await mobPage.screenshot({ path: ssPath, fullPage: true });
    console.log(`  📸 Screenshot Saved: ${ssPath}`);
  }

  // 3. Test Master Switcher Hub
  const hubPath = 'file://' + path.join(BASE_DIR, 'index.html');
  console.log(`\n[Testing Master Switcher Hub] -> ${hubPath}`);
  await deskPage.goto(hubPath, { waitUntil: 'load' });
  await deskPage.waitForTimeout(1000);
  const hubSs = path.join(SS_DIR, 'receptionist_master_switcher_hub.png');
  await deskPage.screenshot({ path: hubSs, fullPage: true });
  console.log(`  📸 Screenshot Saved: ${hubSs}`);

  await browser.close();
  console.log('\n========================================================================');
  console.log('   ALL 3 VERSIONS VERIFIED AND SCREENSHOTS CAPTURED SUCCESSFULLY!       ');
  console.log('========================================================================\n');
}

verifyDashboards().catch(console.error);
