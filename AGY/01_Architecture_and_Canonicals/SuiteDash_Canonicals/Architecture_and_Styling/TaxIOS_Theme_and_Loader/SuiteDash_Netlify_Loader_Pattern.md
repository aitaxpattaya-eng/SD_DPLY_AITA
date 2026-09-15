---
title: SuiteDash Netlify CDN Loader & Universal Theme Engine
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [bkk-sync, dark-mode, loader, mutation-observer, netlify-cdn, obsidian-vault,
  office-sync, suitedash, synto-knowledge, theming]
type: architecture-spec
---

# SuiteDash Netlify CDN Loader & Universal Theme Engine (v3.0.0)

This architectural specification documents the **Dynamic Netlify CDN Loader Pattern** and **Universal Theme Engine** for SuiteDash. It provides a method to deploy external, version-controlled CSS/JS assets directly into SuiteDash white-label portals, bypassing platform textarea character caps and managing SPA page transitions automatically.

---

## 🏛️ 1. Architecture Overview

```
┌──────────────────────────────────────────────┐
│            GitHub Repository / Push          │
│  (assets/taxios-theme.css, taxios-theme.js)  │
└──────────────────────┬───────────────────────┘
                       │ Auto-Deploy
┌──────────────────────▼───────────────────────┐
│            Netlify Global Edge CDN           │
│    (https://YOUR-SITE.netlify.app/assets)    │
└──────────────────────┬───────────────────────┘
                       │ Dynamic Fetch
┌──────────────────────▼─────────────────────────────────────────────────────┐
│                    SuiteDash Platform Shell & DOM                          │
│                                                                            │
│  1. Custom JS (Platform Branding > Advanced):                              │
│     • Injects <script id="taxios-netlify-loader">                          │
│                                                                            │
│  2. Loader Script (taxios-loader.js):                                      │
│     • Appends versioned taxios-theme.css?v=3.0.0                           │
│     • Appends taxios-theme.js controller                                  │
│                                                                            │
│  3. Theme Controller (taxios-theme.js):                                    │
│     • Adds html.taxios-theme root scope                                    │
│     • MutationObserver watches SPA route changes & rescans blocks          │
│     • Listens for SuiteDash data-theme and syncs with prefers-color-scheme │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 2. SuiteDash Installation & Injection Instructions

### Step 1: Deploy to Netlify
1. Connect the branding repository to Netlify.
2. Build settings:
   * Build command: *(leave blank / none)*
   * Publish directory: `.`

### Step 2: Inject Loader into SuiteDash
Navigate to:
**Flyout Menu ➔ Platform Branding ➔ Advanced ➔ Custom JS**

Paste the following script (replacing `YOUR-SITE` with your Netlify domain):

```javascript
(function (d) {
  if (d.getElementById("taxios-netlify-loader")) return;

  var s = d.createElement("script");
  s.id = "taxios-netlify-loader";
  s.src = "https://YOUR-SITE.netlify.app/assets/taxios-loader.js?v=3.0.0";
  s.defer = true;
  d.head.appendChild(s);
})(document);
```

---

## 🎨 3. Multi-Surface Separation in SuiteDash

SuiteDash applies branding on separate surfaces. You must configure each surface accordingly:

| Surface | SuiteDash Configuration Path | Styling File | Scope / Notes |
|---|---|---|---|
| **Portal Dashboard & Apps** | `Flyout Menu > Platform Branding > Advanced > Custom JS` | `assets/taxios-theme.css` + `taxios-theme.js` | Loaded via Netlify CDN; scoped under `html.taxios-theme` |
| **Custom Login Page** | `Flyout Menu > Custom URL & Login > Custom CSS` | `assets/taxios-theme.css` (Login section) | Injected statically on the `/login` screen |
| **Intake & Kickoff Forms** | `Form Builder > Embed / Link > Custom CSS` | `assets/taxios-theme.css` (Form section) | Saved as Form Theme |

---

## ⚡ 4. The SPA MutationObserver Engine (`taxios-theme.js`)

SuiteDash renders pages dynamically without full browser reloads. To ensure styles and custom attributes persist across navigation:

```javascript
// Automatically rescans DOM on dynamic route/block updates
if (window.MutationObserver && document.body) {
  var bodyObserver = new MutationObserver(function () {
    markFeaturedCards();
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });
}
```

### Runtime Controls & Debugging:
* **Manual Rescan**: `window.TAXiOSTheme.refresh();`
* **Switch Mode**: `window.TAXiOSTheme.setMode('dark' | 'light' | 'auto');`
* **Disable/Rollback**: Remove the Custom JS block or run `document.documentElement.classList.remove('taxios-theme');`

---

## 📋 5. Core Design Tokens (`taxios-theme.css`)

```css
html.taxios-theme {
  --tx-purple: #a51cff;
  --tx-magenta: #d13cff;
  --tx-orange: #ff6a00;
  
  --tx-radius-sm: 10px;
  --tx-radius-md: 14px;
  --tx-radius-lg: 18px;

  --tx-space-1: 4px;
  --tx-space-2: 8px;
  --tx-space-3: 12px;
  --tx-space-4: 16px;
  --tx-space-5: 20px;
  --tx-space-6: 24px;
  --tx-space-7: 32px;

  --tx-bg: #0b0c10;
  --tx-surface: #15161d;
  --tx-surface-2: #191a22;
  --tx-text: #f8f8fb;
  --tx-border: rgba(255,255,255,.08);
  --tx-shadow: 0 12px 36px rgba(0,0,0,.22);
}
```
