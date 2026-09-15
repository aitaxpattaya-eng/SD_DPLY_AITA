import { createSession, takeScreenshot } from './session.mjs';

const THEME_CSS = `/* ============================================================
   AITAX -- Theme-Level Custom CSS (Platform Branding Slot)
   Skins: KPI Blocks, Panels, Activity Streams, Navigation
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

/* --- KPI / Reporting Tiles --- */
#dashboard-view .reporting__block {
  background: #FFFAF4 !important;
  border: 1px solid rgba(139, 21, 56, 0.14) !important;
  border-radius: 14px !important;
  box-shadow: 0 2px 12px rgba(139, 21, 56, 0.08) !important;
  transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 400ms cubic-bezier(0.16, 1, 0.3, 1) !important;
}
#dashboard-view .reporting__block:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 16px 40px rgba(139, 21, 56, 0.14) !important;
}

#dashboard-view .reporting__block__title__text {
  font-family: "Inter", "Helvetica Neue", Arial, sans-serif !important;
  color: #6B5260 !important;
  -webkit-text-fill-color: #6B5260 !important;
  font-size: 11px !important;
  letter-spacing: 1.6px !important;
  text-transform: uppercase !important;
  font-weight: 700 !important;
}

#dashboard-view .reporting__block__value__current {
  font-family: "Cormorant Garamond", Georgia, serif !important;
  color: #1A0B14 !important;
  -webkit-text-fill-color: #1A0B14 !important;
  background: none !important;
  font-size: 32px !important;
  font-weight: 600 !important;
}

/* Hide raw source code if Stacks render as text */
#dashboard-view .cbe-block-embed {
  display: none !important;
}
`;

async function main() {
  console.log('[Mission 1B.2] Injecting Global Custom CSS into Platform Branding...');
  const { browser, page } = await createSession();
  
  await page.goto('https://secure.aitaxadvisers.com/company/customizeTheme', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  // Find Custom CSS textarea and enable toggle
  console.log('Finding Custom CSS section...');
  const cssResult = await page.evaluate((cssText) => {
    // Check toggle
    const toggles = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    const cssToggle = toggles.find(t => {
      const p = t.closest('.form-group') || t.parentElement;
      return p && p.innerText.includes('Custom CSS');
    });
    if (cssToggle && !cssToggle.checked) {
      cssToggle.click();
    }
    
    // Find textarea
    const textareas = Array.from(document.querySelectorAll('textarea'));
    const cssArea = textareas.find(ta => {
      const p = ta.closest('.form-group') || ta.parentElement;
      return (p && p.innerText.includes('Custom CSS')) || (ta.name && ta.name.toLowerCase().includes('css'));
    }) || textareas[0];

    if (cssArea) {
      cssArea.value = cssText;
      cssArea.dispatchEvent(new Event('input', { bubbles: true }));
      cssArea.dispatchEvent(new Event('change', { bubbles: true }));
      return { found: true, name: cssArea.name };
    }
    return { found: false };
  }, THEME_CSS);

  console.log('CSS Injection result:', cssResult);
  await page.waitForTimeout(1000);

  // Click Save at bottom of page
  console.log('Saving Platform Branding...');
  const saveBtn = page.locator('button.btn-primary:has-text("Save"), input[type="submit"][value="Save"], button:has-text("Save")').last();
  await saveBtn.click();
  await page.waitForTimeout(3000);

  await takeScreenshot(page, 'platform_branding_css_saved');
  await browser.close();
  console.log('[Mission 1B.2] Global Custom CSS Injected Successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
