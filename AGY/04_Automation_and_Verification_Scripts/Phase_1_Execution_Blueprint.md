# Phase 1 Execution Blueprint — AI Tax Advisers SuiteDash Build-Out

> **Document Type:** Browser Agent Execution Plan
> **Target Environment:** `https://secure.aitaxadvisers.com` (SuiteDash white-label)
> **Scope:** Phase 1 — "Reception First"
> **Date:** 2026-08-24
> **Author:** Master Systems Architect (synthesized from canonicals)

---

## Table of Contents

| Phase | Mission | Description |
|-------|---------|-------------|
| **0** | 0.1–0.3 | API Audit and Reconciliation |
| **1A** | 1A.1–1A.4 | Foundational Data (Custom Fields, Circles) |
| **1B** | 1B.1–1B.4 | Platform Aesthetics (Branding, CSS/JS Stacks, Dashboard Styling) |
| **1C** | 1C.1–1C.3 | Reception Homepage Dashboard |
| **1D** | 1D.1–1D.3 | Reception Workflows (Forms, Appointments, Call Logging) |

---

## Global Constraints — READ BEFORE EVERY MISSION

> [!CAUTION]
> These constraints are **inviolable**. Violation will corrupt the build.

### C1: The Stack-Triad System
Custom CSS/JS for **Portal Pages and Landing Pages** is organized into exactly **3 Stacks**:

| Stack Name | Role | What Goes Inside |
|---|---|---|
| `AITAX_Stacks_All_Pages_CSS_JS` | **Container Stack** — dropped onto pages | The Styling Options of this Stack reference the two siblings below. **NEVER edit this Stack's content directly.** |
| `AITAX_Stacks_Pages_CSS` | **CSS Stack** | All `:root` custom properties, font imports, and CSS selectors. Source of truth: `29355_Stacks_Pages_CSS.md` |
| `AITAX_Stacks_Pages_JS` | **JS Stack** | All JavaScript (`tppBoot()` and modules). Source of truth: `29355_Stacks_Pages_JS.md` |

**Edit Rule:** CSS changes go ONLY into the CSS Stack. JS changes go ONLY into the JS Stack. The Container Stack is a pass-through.

### C2: Form-Card Pattern
When building custom forms (Update Forms, embedded forms), they **must** be wrapped in:
```html
<div class="aitax-form-card">
  <!-- SD form embed goes here -->
</div>
```
This replicates the branded Next.js aesthetic via the `.tpp-form-card` / `.tpp-form-sd` CSS rules in the CSS Stack.

### C3: Layout Rule — CSS is for Skinning ONLY
**NEVER** use CSS to change the layout or position of widgets. Use the **native SuiteDash CMS drag-and-drop editor** for all layout positioning. CSS is **strictly** for aesthetic skinning:
- `border-radius` on `.reporting__block`
- `box-shadow` on `.dashboard-organize-box.card`
- Typography overrides on `.reporting__block__title__text`
- Color overrides on `.reporting__block__value__current`

### C4: Dashboard CSS Scoping
All admin dashboard CSS rules **must** be scoped under `#dashboard-view`. Example:
```css
/* CORRECT */
#dashboard-view .reporting__block { border-radius: 14px !important; }

/* WRONG — leaks to every page */
.reporting__block { border-radius: 14px !important; }
```

### C5: The `color: undefined` Ghost Fix
Every text-color rule on dashboard widgets **must** include a paired `-webkit-text-fill-color` declaration:
```css
#dashboard-view .reporting__block__value__current {
  color: var(--tpp-noir) !important;
  -webkit-text-fill-color: var(--tpp-noir) !important;
  background: none !important;
}
```

### C6: Brand Identity Tokens
All styling references these CSS custom properties (defined in `tokens.css` and the CSS Stack):
```
--tpp-rose: #E91E63          --tpp-crimson: #8B1538
--tpp-champagne: #F5E6D3     --tpp-ivory: #FFFAF4
--tpp-noir: #1A0B14           --tpp-gold-leaf: #D4A574
--tpp-font-display: "Cormorant Garamond"
--tpp-font-body: "Inter"
```

### C7: API Script Location
```
api_env/sd-api.ps1          — PowerShell helper (dot-source to load)
api_env/.env                — Credentials (copy from .env.example, fill in)
```
**Base URL:** `https://secure.aitaxadvisers.com`
**Usage:** `. .\sd-api.ps1` then `Invoke-SDApi '/secure-api/...'`


### C8: Required External Files & Artifacts
Before beginning any mission, confirm the following files are present and accessible to the executing agent (or human operator). Do not proceed if any required file is missing.

| File / Artifact | Location / Source | Used In | Notes |
|---|---|---|---|
| `29355_Stacks_Pages_CSS.md` | Canonical source (project repo or attached) | Mission 1B.3 | Extract pure CSS between `<style>` … `</style>` (lines ~23–1727). Do **not** paste the tags. |
| `29355_Stacks_Pages_JS.md` | Canonical source | Mission 1B.4 | Extract pure JS between `<script>` … `</script>` (lines ~23–219). Do **not** paste the tags. |
| Logo files (Dashboard + Mobile) | Brand assets folder | Mission 1B.1 | Transparent PNG; Dashboard ≤200×60 px; Mobile ≤60×60 px. |
| `api_env/sd-api.ps1` | Project `api_env/` | Phase 0 | PowerShell helper. |
| `api_env/.env` (or `.env.example`) | Project `api_env/` | Phase 0 | Credentials only. Never commit live secrets. Fix double-`https://` typo if present. |
| Brand tokens / `tokens.css` (if separate) | Canonical source | Reference only | Values already embedded in CSS blocks. |

If any file is unavailable, halt and request the missing artifact before continuing.


### C9: Recovery & Rollback Principles
These rules apply to every mission. Prefer non-destructive recovery first.

1. **Stop on partial failure.** Do not continue to the next mission until the current mission’s Validation checklist is fully green or an explicit recovery path has been completed and re-validated.
2. **Prefer edit over delete+recreate** when the object exists but is incorrect (wrong type, wrong name, missing options, wrong Circle association). SuiteDash rarely allows clean “undo”; recreation can leave orphaned references.
3. **Naming collisions.** If a field, Circle, Stack, Dashboard, or Form already exists with the exact required name, treat it as a candidate for ADAPT rather than CREATE. Document the difference and decide.
4. **Screenshot / evidence.** After any recovery action, capture a screenshot or note the exact final state before marking the mission complete.
5. **No silent skips.** If a step cannot be completed, record the blocker in the mission’s recovery log and escalate; do not mark Validation complete.
6. **Data safety.** Never bulk-delete Contacts, Companies, or existing production Circles. Custom Fields and Circles created in Phase 1 may be edited or (if empty) deleted only after confirming zero production usage.

---



---


## PHASE 0: API AUDIT AND RECONCILIATION

> **Objective:** Before touching the UI, use the SuiteDash Secure API to inventory what already exists. This prevents the browser agent from creating duplicate Custom Fields, Circles, or Tags.

---

### Mission 0.1: Environment Setup and API Connectivity Test

**Goal:** Confirm API access is functional.

#### Steps:

1. **Open a PowerShell terminal** in the `api_env/` directory.

2. **Copy the `.env.example` to `.env`** (if `.env` does not already exist):
   ```powershell
   Copy-Item .env.example .env
   ```

3. **Verify `.env` has correct credentials:**
   ```
   SUITEDASH_PUBLIC_ID=339de287-7d5d-425e-a446-2af69f1de9a6
   SUITEDASH_SECRET_KEY=$2y$13$BjkGgsk86v6F3XzWd7V7G.VV.czKl9QDe7b2Um0BD7KnM.dabGR3S
   SUITEDASH_BASE=https://secure.aitaxadvisers.com
   ```
   > [!WARNING]
   > The `.env.example` has a typo: `https://https://secure.aitaxadvisers.com` — fix to single `https://`.

4. **Dot-source the helper:**
   ```powershell
   . .\sd-api.ps1
   ```
   **Expected output:** `SuiteDash helper loaded. Base: https://secure.aitaxadvisers.com`

5. **Connectivity test:**
   ```powershell
   Invoke-SDApi '/secure-api/company/meta'
   ```
   **Expected:** JSON object with company metadata. If HTTP 401 then credentials are wrong or truncated.

#### Validation:
- [ ] Terminal prints `SuiteDash helper loaded.`
- [ ] `/secure-api/company/meta` returns valid JSON (not `null` or HTTP error)


**Mission 0.1 – Recovery Notes**  
- If `Invoke-SDApi` returns 401: re-check `.env` credentials (no trailing spaces, correct base URL). Re-copy from `.env.example` if needed.  
- If helper fails to load: confirm PowerShell execution policy and that `sd-api.ps1` is in the current directory.  
- Do not proceed to 0.2 until connectivity test returns valid company meta JSON.
---

### Mission 0.2: Audit Existing Custom Fields

**Goal:** Retrieve a full inventory of every Custom Field currently configured, so we know what to create vs. skip.

#### Steps:

1. **Query the company metadata** (contains Custom Field schema):
   ```powershell
   $meta = Invoke-SDApi '/secure-api/company/meta' -Raw
   $meta | ConvertTo-Json -Depth 12 | Out-File -FilePath .\audit_custom_fields.json
   ```

2. **Query contact custom fields** via a sample contact:
   ```powershell
   $contacts = Invoke-SDApi '/secure-api/contacts' -Query @{ page = 1 } -Raw
   $contacts | ConvertTo-Json -Depth 12 | Out-File -FilePath .\audit_contacts_page1.json
   ```

3. **Manually inspect the JSON outputs.** Build a checklist comparing existing fields against the canonical required fields (see Mission 1A.2 for the full list). Fields that already exist and match = SKIP. Fields that exist but differ = ADAPT. Fields that do not exist = CREATE.

4. **Save the reconciliation output** to a file:
   ```powershell
   @"
   RECONCILIATION: Custom Fields
   =============================
   [SKIP]    First Name         - exists, matches
   [SKIP]    Last Name          - exists, matches
   [CREATE]  Tax Filing Status  - does not exist
   [CREATE]  Spouse Full Name   - does not exist
   [CREATE]  Last Return Filed  - does not exist
   [CREATE]  Referral Source    - does not exist
   [CREATE]  TaxYear            - does not exist (Target field)
   [CREATE]  Streamline         - does not exist (Target field)
   [CREATE]  DropboxURL         - does not exist (Target field)
   "@ | Out-File -FilePath .\reconciliation_custom_fields.txt
   ```

#### Validation:
- [ ] `audit_custom_fields.json` exists and contains valid JSON
- [ ] `audit_contacts_page1.json` exists and contains contact records
- [ ] `reconciliation_custom_fields.txt` exists with CREATE/SKIP/ADAPT classifications

**Mission 0.2 – Recovery Notes**  
- If JSON files are empty or malformed: re-run the API calls with `-Raw` and verify network/credentials.  
- If reconciliation cannot be completed because API coverage is incomplete: mark fields as “UI-AUDIT-REQUIRED” and force a visual check in Mission 1A.2 before creating anything.

---

### Mission 0.3: Audit Existing Circles

**Goal:** Inventory existing Circles so the browser agent does not duplicate them.

#### Steps:

1. **The SuiteDash Secure API does not expose a `/circles` endpoint directly.** To audit Circles, the browser agent must navigate the UI:
   - Navigate to `CRM > Circles` in the left sidebar.
   - Screenshot or list all Circle names visible in the table.

2. **Alternatively, infer from contact data:**
   ```powershell
   $page1 = Invoke-SDApi '/secure-api/contacts' -Query @{ page = 1 } -Raw
   $page2 = Invoke-SDApi '/secure-api/contacts' -Query @{ page = 2 } -Raw
   ```

3. **Build the reconciliation:**
   ```powershell
   @"
   RECONCILIATION: Circles
   =======================
   Canonical Required Circles for Phase 1:
   [???]  Staff - Reception       - CHECK IF EXISTS
   [???]  Staff - Tax Preparer    - CHECK IF EXISTS
   [???]  Staff - Manager         - CHECK IF EXISTS
   [???]  All Active Clients      - CHECK IF EXISTS
   [???]  Prospects               - CHECK IF EXISTS

   Future Phase Circles (create stubs now):
   [???]  2024 1040 Completed     - CHECK IF EXISTS
   [???]  2024 Corp Completed     - CHECK IF EXISTS
   "@ | Out-File -FilePath .\reconciliation_circles.txt
   ```

4. **Since the API may not return Circle data**, the browser agent must perform the UI audit in Mission 1A.3 before creating Circles.

#### Validation:
- [ ] `reconciliation_circles.txt` created
- [ ] Browser agent is flagged to perform visual Circle audit in Phase 1A

**Mission 0.3 – Recovery Notes**  
- Circles cannot be reliably audited via API. Always perform the UI audit in Mission 1A.3 before any CREATE.  
- If reconciliation file is incomplete, treat every canonical Circle as “CHECK IF EXISTS” and resolve in 1A.3.


---

## PHASE 1A: FOUNDATIONAL DATA

> **Objective:** Create the CRM Custom Fields, Custom Field Categories, and Circles that all downstream features depend on. This must be completed before dashboards or forms can reference these fields.

---

### Mission 1A.1: Create Custom Field Categories

**Goal:** Create CF Categories that will scope which Custom Fields appear for which Contacts via Circle association.

#### Required CF Categories:

| Category Name | Purpose | Color (hex) |
|---|---|---|
| `Tax Client` | Fields shown for active tax clients | `#E91E63` |
| `Corporate Client` | Fields shown for corporate entity clients | `#8B1538` |
| `Prospect` | Fields shown for prospective clients | `#D4A574` |

#### UI Traversal:

1. **Navigate to:** Click the **profile image** (top-right corner) to open the **Flyout Menu**.
2. **Click:** `Content Settings` in the Flyout Menu.
3. **Click:** The `Custom Field` tab.
4. **Click:** The `+ Add Category - Custom Fields` button.
5. **In the modal that appears:**
   - **Name:** Type `Tax Client`
   - **Color:** Click the color swatch and enter `#E91E63` in the hex input
   - **Click:** `Add`
6. **Repeat step 4-5** for `Corporate Client` (color: `#8B1538`) and `Prospect` (color: `#D4A574`).

#### Validation:
- [ ] Navigate to `Flyout > Content Settings > Custom Field` and confirm all 3 categories appear in the Manage Categories list
- [ ] Each category shows the correct color swatch


**Mission 1A.1 – Recovery Notes**  
- If a category is created with wrong name or color: edit the existing category (do not create a duplicate).  
- If the “+ Add Category” button is missing: confirm you are on the Custom Field tab inside Content Settings and that the logged-in user has admin rights.
---

### Mission 1A.2: Create Custom Fields

**Goal:** Create all CRM Custom Fields required for Reception workflows and future pipeline expansion.

#### Custom Fields to Create:

##### CRM > Contacts Fields:

| # | Field Name | Description (visible to staff) | Type | CF Category | Notes |
|---|---|---|---|---|---|
| 1 | `Tax Filing Status` | Filing status (Single, MFJ, MFS, HOH, QSS) | Dropdown | Tax Client | Options: `Single`, `Married Filing Jointly`, `Married Filing Separately`, `Head of Household`, `Qualifying Surviving Spouse` |
| 2 | `Spouse Full Name` | Full legal name of spouse | Single Line Text | Tax Client | |
| 3 | `Spouse DOB` | Spouse date of birth | Date | Tax Client | |
| 4 | `Last Return Filed` | Most recent tax year filed | Single Line Text | Tax Client | Populated by automation at Stage 7 |
| 5 | `Referral Source` | How the client found us | Dropdown | (none) | Options: `Referral`, `Google`, `Social Media`, `Walk-In`, `Returning Client`, `Other` |
| 6 | `Preferred Language` | Preferred communication language | Dropdown | (none) | Options: `English`, `Thai`, `Other` |
| 7 | `US Taxpayer` | Is this client a US taxpayer? | Yes/No Toggle | Tax Client | |
| 8 | `Thai Taxpayer` | Is this client a Thai taxpayer? | Yes/No Toggle | Tax Client | |

##### CRM > Target Fields (visible on both Company and Contact):

| # | Field Name | Description | Type | Notes |
|---|---|---|---|---|
| 9 | `TaxYear` | Active tax year for current engagement | Single Line Text | Used in Deal/Project naming: `[TaxYear] - [ReturnType] - [Name]` |
| 10 | `DropboxURL` | Link to shared Dropbox folder | URL | |
| 11 | `Streamline` | Streamline filing indicator | Yes/No Toggle | |

#### UI Traversal (repeat for each field):

1. **Navigate to:** Click **profile image** (top-right) to open **Flyout Menu**.
2. **Click:** `Custom Fields` in the Flyout Menu.
3. **Click:** The `Manage Custom Fields` tab.
4. **Click:** The `+ Add Custom Field` button.
5. **In the modal:**
   - **Field Name:** Enter the value from the table above (e.g., `Tax Filing Status`)
   - **Description:** Enter the Description value from the table
   - **Usage:** Select the appropriate type:
     - For fields 1-8: Select `CRM > Contacts`
     - For fields 9-11: Select `CRM > Target`
   - **Type:** Select the type from the table (e.g., `Dropdown`, `Single Line Text`, `Date`, `Yes/No Toggle`, `URL`)
   - **If Dropdown:** After selecting Dropdown type, add each option one by one using the `+ Add Option` control. Enter each option text and press Enter/Add.
   - **CF Categories:** If a category is specified in the table, select it from the dropdown (e.g., `Tax Client`). If no category, leave blank.
   - **Hide Placeholder:** Leave **unchecked** (we want Dynamic Data Placeholders available).
   - **Click:** `Add`
6. **Repeat for each row in the tables above.**

> [!IMPORTANT]
> For `CRM > Contacts` fields, a checkbox will appear: "Allow Contact to update on their profile page." Leave this **UNCHECKED** for Phase 1 (this is an internal-only system with no client portal access yet).

#### Validation:
- [ ] Navigate to `Flyout > Custom Fields > Manage Custom Fields`
- [ ] Confirm all 11 fields appear in the list
- [ ] Confirm fields 1-8 show `CRM > Contacts` in the Usage column
- [ ] Confirm fields 9-11 show `CRM > Target` in the Usage column
- [ ] Click into `Tax Filing Status` and verify all 5 dropdown options exist
- [ ] Click into `Referral Source` and verify all 6 dropdown options exist


**Mission 1A.2 – Recovery Notes**  
- Wrong field type or missing dropdown options: open the existing field → Edit → correct type/options → Save. Do not create a second field with the same name.  
- Field created under wrong Usage (Contacts vs Target): edit if possible; if SuiteDash locks Usage after creation, document the orphan and create the correct one with a temporary suffix, then clean up after validation.  
- “Allow Contact to update…” accidentally checked: re-edit the field and uncheck it immediately.  
- After any edit, re-run the full Validation checklist for all 11 fields.
---

### Mission 1A.3: Audit and Create Circles

**Goal:** Create the Circles required for the Permission Engine. Circles are used to:
1. Scope **Custom Field visibility** (via CF Categories)
2. Assign **Dashboards** (via Medium Priority in Dashboard Settings)
3. Permission **Portal Pages** and **Files** for future phases

#### UI Audit (do this FIRST):

1. **Navigate to:** Left sidebar > `CRM` > `Circles`
2. **Record** every Circle name that already exists in the table.
3. **Compare against the required list below.** Mark each as EXISTS or NEEDS CREATION.

#### Required Circles:

| Circle Name | Description | Color (hex) | Auto-Add New Clients? | CF Categories to Associate |
|---|---|---|---|---|
| `Staff - Reception` | Reception desk staff members | `#E91E63` | No | (none) |
| `Staff - Tax Preparer` | Tax preparation staff | `#8B1538` | No | (none) |
| `Staff - Manager` | Managers (QA reviewers) | `#5C0D24` | No | (none) |
| `All Active Clients` | All clients with active engagements | `#D4A574` | Yes (Clients) | `Tax Client` |
| `Prospects` | Prospective clients not yet engaged | `#F5E6D3` | Yes (Prospects) | `Prospect` |

#### UI Traversal (for each Circle that needs creation):

1. **Navigate to:** Left sidebar > `CRM` > `Circles`
2. **Click:** `+Add Circle` button.
3. **In the modal:**
   - **Circle Name:** Enter value from table (e.g., `Staff - Reception`)
   - **Description:** Enter the Description value from the table
   - **Color:** Click color swatch and enter hex code from table
   - **Auto-add new Clients/Prospects:** If the table says "Yes (Clients)", check the `Automatically add all new Clients` checkbox. If "Yes (Prospects)", check `Automatically add all new Prospects`.
   - **Custom Field Categories:** If CF Categories are specified, select them from the dropdown (e.g., `Tax Client`)
   - **Assign Users:** Leave empty for now (users will be assigned after creation)
   - **Click:** `Save` (or `Add`)
4. **Repeat for each Circle.**

#### Post-Creation: Associate CF Categories with Circles

> [!IMPORTANT]
> This step links CF Categories to Circles so that Custom Fields with category `Tax Client` only appear on Contacts who belong to the `All Active Clients` Circle.

1. **Navigate to:** `Flyout Menu > Content Settings > Custom Field`
2. **Click** the `Manage Categories` tab.
3. **For the `Tax Client` category:** Click its options/edit menu, select Associate with Circle, select `All Active Clients`, then Save.
4. **For the `Prospect` category:** Click its options/edit menu, select Associate with Circle, select `Prospects`, then Save.

#### Validation:
- [ ] Navigate to `CRM > Circles` and confirm all 5 Circles appear
- [ ] Click into `All Active Clients` and verify "Automatically add all new Clients" is checked
- [ ] Click into `Prospects` and verify "Automatically add all new Prospects" is checked
- [ ] Navigate to a test Contact in the `All Active Clients` Circle. Their CRM Dashboard should display the Tax Client custom fields
- [ ] Navigate to a test Contact NOT in any Circle. The Tax Client fields should NOT appear

**Mission 1A.3 – Recovery Notes**  
- Circle created with wrong name: rename if the UI allows; otherwise leave the incorrect Circle unused and create the correctly named one. Never delete a Circle that may already contain Contacts.  
- Auto-add checkboxes wrong: edit the Circle and correct the “Automatically add…” settings.  
- CF Category association missing or wrong: return to Content Settings → Manage Categories → Associate with Circle and fix.  
- Re-validate visibility on a test Contact after any association change.

---

### Mission 1A.4: Configure CRM Default Fields Visibility

**Goal:** Ensure the correct default CRM fields are visible for Reception workflow.

#### UI Traversal:

1. **Navigate to:** Left sidebar > `CRM` > `Settings`
2. **Click:** The `Default Fields` tab.
3. **Ensure the following are CHECKED (visible):**
   - Image (Avatar)
   - First Name
   - Last Name
   - Email
   - Phone
   - Mobile Phone
   - Address
   - City
   - State
   - Zip Code
   - Country
   - Date of Birth
   - Website (optional, leave checked if desired)
4. **Click:** `Save`

#### Validation:
- [ ] Navigate to any Contact's CRM Dashboard. All checked fields are visible in the profile section

---

## PHASE 1B: PLATFORM AESTHETICS

> **Objective:** Apply the AI Tax Advisers brand identity to the SuiteDash platform: logos, colors, fonts, and inject the CSS/JS Stacks for page styling.


**Mission 1A.4 – Recovery Notes**  
- If Save fails or fields do not appear: re-open Default Fields, re-check the required boxes, and Save again. Confirm on a live Contact record.
---

### Mission 1B.1: Platform Branding (Logos and Colors)

**Goal:** Configure the core visual identity at the platform level.

#### UI Traversal:

1. **Navigate to:** Click **profile image** (top-right) > **Flyout Menu** > `Platform Branding`

#### Section 1: Logo and Preset Themes

2. **Dashboard Logo:** Upload the AI Tax Advisers logo.
   - Click the upload area under "Dashboard Logo (Standard Mode)"
   - Upload a logo file: **200px wide, max 60px height**, transparent PNG
   - If a Dark Mode variant exists, upload it under "Dashboard Logo (Dark Mode)"
3. **Mobile Friendly Logo:** Upload a square/compact version.
   - **60px wide, max 60px height**
4. **Force Dark Mode:** Leave **OFF** (staff may prefer light mode).

#### Section 2: Font Themes

5. **Primary Headers:** Select `Cormorant Garamond` from the Google Fonts dropdown.
6. **Secondary Headers:** Select `Inter` from the Google Fonts dropdown.
7. **General Text:** Select `Inter` from the Google Fonts dropdown.

#### Section 3: Primary Elements Styling

8. **Platform Colors (sidebar background):** Set to `#1A0B14` (--tpp-noir)
9. **Primary Nav Text and Icon Colors:** Set to `#F5E6D3` (--tpp-champagne)
10. **Loading Line Color:** Set to `#E91E63` (--tpp-rose)
11. **Highlight Color:** Set to `#E91E63` (--tpp-rose)
12. **Avatar Color:** Set to `#8B1538` (--tpp-crimson)
13. **Modern Mode:** Toggle **ON** (rounds corners, circular avatars)

#### Section 4: Platform Background

14. **Skip for now.** The Liquid Glass effect is optional and can be added later.

15. **Click:** `Save` at the bottom of the page.

#### Validation:
- [ ] Reload the SuiteDash shell. Sidebar should be dark (#1A0B14) with champagne text
- [ ] Loading line should flash rose (#E91E63)
- [ ] Default avatars should be crimson (#8B1538) with white initials
- [ ] Headers should render in Cormorant Garamond
- [ ] Body text should render in Inter


**Mission 1B.1 – Recovery Notes**  
- Logo upload fails or wrong size: re-upload the correct PNG. Clear browser cache if the old logo persists.  
- Color/font settings not applying: re-Save Platform Branding, hard-refresh the shell (Ctrl+Shift+R).  
- If Modern Mode toggle does not stick, re-toggle and Save.
---

### Mission 1B.2: Inject Global Custom CSS (Admin Dashboard Skinning)

**Goal:** Apply aesthetic overrides to the native SuiteDash admin dashboard widgets using the Theme-level Custom CSS slot. This skins the KPI tiles, panels, and activity streams.

> [!IMPORTANT]
> This CSS goes into the **Theme-level Custom CSS** (`Flyout > Platform Branding > Advanced > Custom CSS`), NOT into the Stack-triad. The Stack-triad is for Portal Pages/Landing Pages only. Admin dashboard styling uses the Theme CSS slot.

#### UI Traversal:

1. **Navigate to:** Click **profile image** > **Flyout Menu** > `Platform Branding`
2. **Scroll to** the `Advanced` section.
3. **Toggle** `Enable Advanced Custom CSS` to **ON**.
4. **In the Custom CSS text area**, paste the following CSS block:

```css
/* ============================================================
   AI TAX ADVISERS - Admin Dashboard Skin
   Scoped under #dashboard-view per sd-admin-dashboards.md S1
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

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
  font-weight: 600 !important;
}

#dashboard-view .reporting__block__value__trend--positive {
  color: #2E7D32 !important;
  -webkit-text-fill-color: #2E7D32 !important;
}
#dashboard-view .reporting__block__value__trend--negative {
  color: #C62828 !important;
  -webkit-text-fill-color: #C62828 !important;
}
#dashboard-view .reporting__block__value__trend--none {
  color: #6B5260 !important;
  -webkit-text-fill-color: #6B5260 !important;
}

#dashboard-view .reporting__block__progress__value {
  color: #8B1538 !important;
  -webkit-text-fill-color: #8B1538 !important;
}

#dashboard-view .reporting__block__view-button,
#dashboard-view .reporting__block__view-button span,
#dashboard-view .reporting__block__chart__button a {
  color: #E91E63 !important;
  -webkit-text-fill-color: #E91E63 !important;
  font-weight: 600 !important;
}

#dashboard-view .reporting__block__title__icon {
  border-radius: 10px !important;
  background: linear-gradient(135deg, #E91E63, #8B1538) !important;
}

/* --- Panel Widgets (Projects, Activity Stream, Tasks) --- */
#dashboard-view .dashboard-organize-box.card {
  background-color: #FFFAF4 !important;
  border: 1px solid rgba(139, 21, 56, 0.14) !important;
  border-radius: 14px !important;
  box-shadow: 0 2px 12px rgba(139, 21, 56, 0.08) !important;
  margin: 0 0 12px 0 !important;
  overflow: hidden !important;
}

#dashboard-view .dashboard-organize-box__header {
  border-bottom: 1px solid rgba(139, 21, 56, 0.10) !important;
  padding: 16px 20px !important;
}

#dashboard-view .dashboard-organize-box__header-title.widget-title {
  font-family: "Inter", sans-serif !important;
  font-weight: 700 !important;
  color: #1A0B14 !important;
  font-size: 14px !important;
  letter-spacing: 0.3px !important;
}

#dashboard-view .dashboard-organize-box__footer {
  border-top: 1px solid rgba(139, 21, 56, 0.10) !important;
}

#dashboard-view .dashboard-organize-box__footer-btn {
  color: #E91E63 !important;
  font-weight: 600 !important;
  border-color: #E91E63 !important;
  border-radius: 999px !important;
}
#dashboard-view .dashboard-organize-box__footer-btn:hover {
  background: #E91E63 !important;
  color: #FFFFFF !important;
}

/* --- Project Rows --- */
#dashboard-view .dashboard-item.dashboard-item--project {
  border-bottom: 1px solid rgba(139, 21, 56, 0.08) !important;
}
#dashboard-view .dashboard-item__title {
  font-family: "Inter", sans-serif !important;
  font-weight: 600 !important;
  color: #1A0B14 !important;
}

/* --- Activity Stream Rows --- */
#dashboard-view .dashboard-item.dashboard-item--live-stream .dashboard-item__title {
  white-space: normal !important;
  overflow: visible !important;
}
#dashboard-view .default-user-avatar {
  background: linear-gradient(135deg, #E91E63, #8B1538) !important;
  color: #FFFFFF !important;
  font-family: "Cormorant Garamond", serif !important;
  font-weight: 600 !important;
}

/* --- Hide Stack source code artifact on dashboard --- */
#dashboard-view .cbe-block-embed {
  display: none !important;
}

/* --- Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
  #dashboard-view .reporting__block {
    transition: none !important;
  }
}
```

5. **Click:** `Save` at the bottom of the Platform Branding page.

#### Validation:
- [ ] Navigate to the admin Dashboard (`/dashboard`)
- [ ] KPI tiles should have rounded corners (14px), ivory background, and crimson shadows
- [ ] KPI tile numbers should be visible (not invisible, no `color: undefined` ghost)
- [ ] Panel widgets (Projects, Activity Stream) should have ivory backgrounds with matching borders
- [ ] Hover over a KPI tile. It should lift up with a shadow transition
- [ ] Sidebar, top bar, and modals are visually **unchanged**
- [ ] No Stack source code text is visible on the dashboard

**Mission 1B.2 – Recovery Notes**  
- CSS paste truncated or contains syntax error: clear the Custom CSS box, re-paste the full block in smaller chunks if necessary, then Save.  
- Styles not visible or `color: undefined` ghost remains: confirm the CSS is inside the Theme Advanced slot (not a Stack), that `#dashboard-view` scoping is present, and that `-webkit-text-fill-color` pairs exist. Hard-refresh.  
- Styles leaking outside dashboard: immediately remove any unscoped rules and re-Save.

---

### Mission 1B.3: Create the CSS Stack

**Goal:** Create the CSS Stack for Portal Pages / Landing Pages styling.

#### UI Traversal:

1. **Navigate to:** Left sidebar > `Content` > `Stacks`
2. **Click:** `+ADD STACK`
3. **Select:** `General Stacks` (so it can be used across all page types)
4. **In the Settings modal:**
   - **Stack Title:** `AITAX_Stacks_Pages_CSS`
   - **Click:** `Save`
5. **You are now in the Stack editor.** Click the **Styling icon** (paintbrush/palette) on the right side panel.
6. **Click** the `Custom CSS` section to expand it.
7. **Paste the ENTIRE contents** of `29355_Stacks_Pages_CSS.md` into the Custom CSS text area.
   - This is the block between the opening `<style>` and closing `</style>` tags in that file (lines 23 through 1727).
   - **Strip the `<style>` and `</style>` wrapper tags.** Paste only the CSS rules themselves. The SD Custom CSS slot adds its own `<style>` wrapper.
8. **Click:** `Save`

#### Validation:
- [ ] Navigate to `Content > Stacks`. `AITAX_Stacks_Pages_CSS` appears in the list
- [ ] Click to edit it. The Custom CSS slot should contain the full CSS body
- [ ] Verify the CSS starts with `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond...`
- [ ] Verify the `</style>` tag is NOT present (just pure CSS)


**Mission 1B.3 / 1B.4 – Recovery Notes**  
- Stack created with wrong title: rename if possible; otherwise create the correctly titled Stack and leave the misnamed one unused.  
- CSS/JS paste includes `<style>` / `<script>` tags: delete the tags and re-Save.  
- Content appears truncated: re-open the Stack, verify start and end of the pasted content match the source file, re-paste if needed.  
- After Save, re-open the Stack to confirm the full body is present before proceeding.
---

### Mission 1B.4: Create the JS Stack

**Goal:** Create the JavaScript Stack for Portal Pages / Landing Pages interactivity.

#### UI Traversal:

1. **Navigate to:** Left sidebar > `Content` > `Stacks`
2. **Click:** `+ADD STACK`
3. **Select:** `General Stacks`
4. **In the Settings modal:**
   - **Stack Title:** `AITAX_Stacks_Pages_JS`
   - **Click:** `Save`
5. **Click** the **Styling icon** on the right side panel.
6. **Click** the `Custom JS` section to expand it.
7. **Paste the ENTIRE contents** of `29355_Stacks_Pages_JS.md` into the Custom JS text area.
   - This is the block between the opening `<script>` and closing `</script>` tags (lines 23 through 219).
   - **Strip the `<script>` and `</script>` wrapper tags.**
8. **Click:** `Save`

#### Validation:
- [ ] Navigate to `Content > Stacks`. `AITAX_Stacks_Pages_JS` appears in the list
- [ ] Click to edit. Custom JS slot contains the JS body
- [ ] Verify it starts with `window.TPP = window.TPP || { initialized: false };`
- [ ] Verify it ends with the closing brace of the `tppInitHeaderScrolled` function



**Mission 1B.4 / 1B.3 – Recovery Notes**
- See Revovery Notes from 1B.3
---

## PHASE 1C: RECEPTION HOMEPAGE DASHBOARD

> **Objective:** Build a custom Dashboard specifically for the Reception team. This is the first screen they see when they log in. It must be functional, aesthetic, and focused on their daily tasks: managing contacts, scheduling appointments, and logging calls.

---

### Mission 1C.1: Create the Reception Dashboard

**Goal:** Create a new Dashboard and configure its priority settings so that all staff in the `Staff - Reception` Circle see it as their homepage.

#### UI Traversal:

1. **Navigate to:** Left sidebar > `Content` > `Dashboards`
2. **Click:** `+ ADD NEW`
3. **Dashboard Settings modal:**
   - **Title:** `Reception Homepage`
   - **Highest Priority (assign to specific users):** Leave empty for now (or assign specific Reception staff if known)
   - **Medium Priority (assign to Circles/Teams):** Select `Staff - Reception` from the dropdown
   - **Lowest Priority (assign by Role):** Leave as default
   - **Click:** `Save`

4. **You are now in the Content Block Editor** for the Reception Dashboard.

#### Validation:
- [ ] Dashboard `Reception Homepage` appears in the `Content > Dashboards` list
- [ ] Click its Settings (Options > Settings). Medium Priority shows `Staff - Reception`

**Mission 1C.1 – Recovery Notes**  
- Dashboard created but Medium Priority not set to `Staff - Reception`: open Settings and correct the Circle assignment.  
- Duplicate dashboard title: rename the incorrect one or delete only if it contains no blocks and has never been assigned.
---

### Mission 1C.2: Build the Reception Dashboard Layout (Drag-and-Drop)

**Goal:** Add content blocks to the Reception Dashboard using the native SuiteDash drag-and-drop editor. **DO NOT use CSS for layout. Use the editor's row templates.**

> [!CAUTION]
> Layout is done ENTIRELY via the Content Block Editor's drag-and-drop system. CSS is for skinning only (Constraint C3).

#### UI Traversal:

1. **Open the Reception Dashboard** for editing (Content > Dashboards > click `Reception Homepage` > Edit).

2. **Add Row 1 - Welcome Banner (Full Width):**
   - Click the `+` icon to add a new block
   - Select `Row` then choose the `1 Column (Full Width)` row template
   - Inside this row, click `+` to add a **Text Block**
   - In the Text Block, enter the following HTML:
     ```html
     <div style="text-align: center; padding: 24px 0;">
       <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; color: #1A0B14; margin: 0 0 8px;">
         Welcome to AI Tax Advisers
       </h2>
       <p style="font-family: 'Inter', sans-serif; font-size: 14px; color: #6B5260; margin: 0;">
         Reception Dashboard
       </p>
     </div>
     ```
   - **Click:** `Save` on the block

3. **Add Row 2 - KPI Reporting Widgets (4 columns):**
   - Click `+` then select `Row` and choose the `4 Equal Columns (1-1-1-1)` row template
   - In **Column 1**: Add a **Reporting Block** configured to show `Total Clients`
   - In **Column 2**: Add a **Reporting Block** configured to show `Total Prospects`
   - In **Column 3**: Add a **Reporting Block** configured to show `Total Leads`
   - In **Column 4**: Add a **Reporting Block** configured to show upcoming `Appointments` count (if available; otherwise use another relevant KPI)

4. **Add Row 3 - Main Content (2 columns, wider left):**
   - Click `+` then select `Row` and choose the `2 Columns (2/3 - 1/3)` row template
   - In **Left Column (2/3)**: Add an **Activity Stream Block** (Live Stream). This shows recent CRM activity (new contacts, follow-ups, notes)
   - In **Right Column (1/3)**: Add a **Calendar Block** or **Appointment Block**. This shows today's scheduled appointments

5. **Add Row 4 - Quick Actions (3 columns):**
   - Click `+` then select `Row` and choose `3 Equal Columns (1-1-1)`
   - In **Column 1**: Add a **Button Block**
     - Label: `+ New Contact`
     - Link Action: `Send to [Platform Area]` then select the CRM new contact page
   - In **Column 2**: Add a **Button Block**
     - Label: `+ New Appointment`
     - Link Action: `Send to [Platform Area]` then select the Calendar/My Calendar page
   - In **Column 3**: Add a **Button Block**
     - Label: `Log a Call`
     - Link Action: This will link to the Follow-Up creation page (`CRM > Follow-ups`)

6. **Add the CSS/JS Stack to the Dashboard:**
   - Click `+` then instead of `Row`, select `Stack`
   - Browse the available Stacks and find and add `AITAX_Stacks_Pages_CSS`
   - Click `+` again, then `Stack`, and find and add `AITAX_Stacks_Pages_JS`
   - These Stacks will inject the branded CSS/JS into the dashboard page

   > [!WARNING]
   > The Stack content (CSS/JS source code) may render as visible text on the dashboard due to SD's `ng-bind-html` encoding (see `sd-admin-dashboards.md` S6). This is normal. The CSS rule `#dashboard-view .cbe-block-embed { display: none !important; }` from Mission 1B.2 hides it.

7. **Set Access Options on blocks (optional for Phase 1):**
   - If any block should only be visible to the Reception Circle, click the block's settings then `Access Options` then restrict to `Staff - Reception` Circle
   - For Phase 1, this is optional since the entire Dashboard is already scoped to Reception via Medium Priority

8. **Click:** The `Save` button in the right panel.

#### Validation:
- [ ] Navigate to the Reception Dashboard preview. All rows render in correct layout
- [ ] KPI tiles show data (or placeholder values)
- [ ] Activity Stream shows recent CRM activity
- [ ] Quick Action buttons are clickable and navigate to correct destinations
- [ ] No raw CSS/JS source code is visible (hidden by the embed-block CSS rule)
- [ ] Stack CSS is applying. Text should render in Inter/Cormorant Garamond fonts

**Mission 1C.2 – Recovery Notes**  
- Wrong row template or missing blocks: delete the incorrect row/block inside the editor and re-add the correct one. Do not attempt to fix layout with CSS.  
- Stacks added but source code visible: confirm Mission 1B.2 CSS rule `#dashboard-view .cbe-block-embed { display: none !important; }` is active; hard-refresh.  
- Quick-action buttons point to wrong destinations: edit each Button Block and correct the Link Action.  
- After any structural change, re-run the full layout Validation checklist.
---

### Mission 1C.3: Style the Reception Dashboard via the Editor

**Goal:** Apply per-dashboard styling options for colors and background. This is done via the Dashboard's built-in Styling panel, NOT via CSS layout changes.

#### UI Traversal:

1. **Open the Reception Dashboard** for editing.
2. **Click** the **Styling** icon in the right panel (paintbrush).
3. **Set the following:**
   - **Background Color:** `#F5E6D3` (--tpp-champagne)
   - **Block Background Color:** `#FFFAF4` (--tpp-ivory) if available at dashboard level
4. **Click** the **Fonts** icon in the right panel.
5. **Set:**
   - **Font Family:** `Inter` (this sets the dashboard-level default)
   - **Header Font:** `Cormorant Garamond`
6. **Click:** `Save`

#### Validation:
- [ ] Dashboard background is champagne-colored
- [ ] Text renders in Inter, headers in Cormorant Garamond
- [ ] Overall aesthetic matches the AI Tax Advisers brand (rose/crimson/champagne palette)

**Mission 1C.3 – Recovery Notes**  
- Background or font settings not applying: re-open Styling / Fonts panels, re-set values, Save, and hard-refresh.  
- Conflict with Theme CSS: Theme CSS (1B.2) takes precedence for admin widgets; dashboard-level styling is secondary. Adjust only the dashboard settings if needed.
---

## PHASE 1D: RECEPTION WORKFLOWS

> **Objective:** Configure the workflow tools that Reception staff will use daily: Contact Update Forms (for editing client data), Appointment scheduling, and call/interaction logging.

---

### Mission 1D.1: Create the Contact Update Form

**Goal:** Build an Update Form that Reception staff can use to quickly update a Contact's biographical and tax-relevant data.

#### UI Traversal:

1. **Navigate to:** Left sidebar > `Forms` (or `Content > Forms` depending on menu configuration)
2. **Click:** `+Create Form`
3. **Select:** `Update Forms`
4. **Form Settings:**
   - **Form Usage:** `Contacts` (default, leave as is)
   - **Form Title:** `Reception - Client Info Update`
   - **Allow Save as Draft:** Toggle **ON**
5. **Click:** `Save` (to create the form and enter the form builder)

#### Building the Form Fields:

6. **Add Default Fields** (using the dropdown at the top of the field list):
   - First Name
   - Last Name
   - Email
   - Phone
   - Mobile Phone
   - Address
   - City
   - State/Province
   - Zip/Postal Code
   - Country
   - Date of Birth

7. **Add Custom Fields** (switch the dropdown to "Custom Fields"):
   - Tax Filing Status
   - Spouse Full Name
   - Spouse DOB
   - Referral Source
   - Preferred Language
   - US Taxpayer
   - Thai Taxpayer

8. **Reorder fields** by dragging the grip icon:
   - Order: First Name, Last Name, Email, Phone, Mobile Phone, then Address, City, State, Zip, Country, then Date of Birth, Tax Filing Status, Spouse Full Name, Spouse DOB, Referral Source, Preferred Language, US Taxpayer, Thai Taxpayer

9. **Add a Form Header** (click the Header arrow to expand):
   - In the HTML block, enter:
     ```html
     <div class="aitax-form-card">
       <h3 style="font-family: 'Cormorant Garamond', serif; color: #8B1538; margin: 0 0 8px;">
         Update Client Information
       </h3>
       <p style="font-family: 'Inter', sans-serif; font-size: 14px; color: #6B5260;">
         Use this form to update or correct a client's contact and tax information.
       </p>
     </div>
     ```

10. **Add Form CSS** (click the CSS Class block):
    - In the CSS text area, paste:
      ```css
      .aitax-form-card {
        background: #FFFAF4;
        border: 1px solid rgba(139, 21, 56, 0.14);
        border-radius: 14px;
        padding: 32px;
        box-shadow: 0 2px 12px rgba(139, 21, 56, 0.08);
        margin-bottom: 24px;
      }
      ```

11. **Click:** `Save` on the form.

#### Validation:
- [ ] Navigate to `Forms`. `Reception - Client Info Update` appears in the list
- [ ] Click the form to preview. All Default and Custom fields are present
- [ ] Header renders with Cormorant Garamond heading
- [ ] Form card has rounded corners and ivory background
- [ ] Select a test Contact, fill in a field, Submit, then verify the Contact's CRM Dashboard is updated with the new value

**Mission 1D.1 – Recovery Notes**  
- Form created with missing fields: re-open the form builder, add the missing Default or Custom fields, reorder, and Save.  
- Header HTML or form CSS missing/incorrect: edit the Header and CSS Class blocks and re-paste.  
- “Allow Contact to update” or other permissions wrong: correct in form settings.  
- Test update fails to write to Contact: verify the form is an Update Form (not a Create Form) and that the test Contact is selected correctly.
---

### Mission 1D.2: Configure Appointment Scheduling

**Goal:** Ensure Reception staff can create appointments for clients using the SuiteDash Calendar.

> [!NOTE]
> Appointment Generators must already exist for staff to create appointments. If none exist, one must be created first. This Mission handles the configuration check and basic setup.

#### UI Traversal: Check Existing Generators

1. **Navigate to:** Left sidebar > `Calendar` > `Appointment Generators` (or `Calendar > Settings > Appointment Generators`)
2. **If no generators exist**, create one:
   - **Click:** `+Add Generator` (or equivalent button)
   - **Generator Name:** `Tax Consultation`
   - **Duration:** 60 minutes
   - **Availability:** Set to typical business hours (9:00 AM to 5:00 PM, Mon through Fri)
   - **Assign Staff:** Assign to at least one staff member (e.g., the manager or lead)
   - **Location:** Enter office address or "Virtual / Phone"
   - **Reminder Notifications:** Enable a 30-minute reminder for both Staff and Contact
   - **Click:** `Save`

3. **Create a second generator** (if needed):
   - **Generator Name:** `Quick Check-In`
   - **Duration:** 15 minutes
   - **Availability:** Same business hours
   - **Click:** `Save`

#### Verify Appointment Creation Flow:

4. **Navigate to:** `Calendar > My Calendar`
5. **Click:** `+Add Appointment`
6. **Verify:** The modal appears with the `Tax Consultation` generator in the list
7. **Select** the generator, then select a Contact, then select a time slot, then click `Book It!`
8. **Verify:** The appointment appears on the calendar

#### Validation:
- [ ] At least one Appointment Generator exists (`Tax Consultation`)
- [ ] Clicking `+Add Appointment` on Calendar shows available generators
- [ ] A test appointment can be successfully booked

**Mission 1D.2 – Recovery Notes**  
- No Appointment Generator exists and creation fails: confirm Calendar module is enabled and the user has permission. Create the minimal `Tax Consultation` generator and re-test.  
- Test booking fails: verify staff assignment and availability windows on the generator.
---

### Mission 1D.3: Configure Call Logging via Follow-Ups

**Goal:** Set up a Follow-Up Category and workflow so Reception can log incoming/outgoing calls as Follow-Ups with structured data.

#### Step 1: Create a Follow-Up Category for Call Logs

1. **Navigate to:** `Flyout Menu > Content Settings > Categories`
   (Or navigate to the Categories management page under Content)
2. **Click:** `+ Add Category`
3. **Enter:**
   - **Name:** `Call Log`
   - **Color:** `#E91E63`
   - **Click:** `Add`
4. **Repeat** for additional categories if desired:
   - `Walk-In Visit` (color: `#D4A574`)
   - `Email Correspondence` (color: `#8B1538`)

#### Step 2: Test the Follow-Up Creation Flow

5. **Navigate to:** Left sidebar > `CRM` > `Follow-ups`
6. **Click:** `+ADD FOLLOW-UP`
7. **In the modal:**
   - **Target:** Select a test Contact from the dropdown
   - **Assignee:** Select the Reception staff member
   - **Follow-up Title:** `Phone Call - Tax Documents Inquiry`
   - **Visible:** Select `Public` (visible to all staff)
   - **Date/Time:** Set to current date/time
   - **Duration:** 15 minutes
   - **Category:** Select `Call Log` from the dropdown
   - **Description:** Enter a test description: `Client called to inquire about required documents for 2024 1040 filing.`
   - **Show on Target's Calendar:** Leave **UNCHECKED** (internal call logs should not clutter client calendars)
   - **Click:** `Save` (or `Create`)

#### Validation:
- [ ] Follow-Up appears in `CRM > Follow-ups` list
- [ ] Follow-Up appears on the staff member's Calendar in green
- [ ] Category `Call Log` is visible as a pill/tag on the Follow-Up
- [ ] Clicking the Follow-Up shows the description text
- [ ] Navigate to the Contact's CRM Dashboard, Follow-ups tab. The call log entry is visible

**Mission 1D.3 – Recovery Notes**  
- Category created with wrong name/color: edit the existing category.  
- Follow-Up test entry missing or wrong category: edit the Follow-Up or create a new test entry with correct Category.  
- Entry not visible on Contact’s Follow-ups tab: confirm the Follow-Up Target is the correct Contact and Visibility is Public.
---

## POST-PHASE 1: VALIDATION CHECKLIST

> Run through this entire checklist after all Missions are complete.

### Data Layer (Phase 1A)
- [ ] All 11 Custom Fields exist and are correctly typed
- [ ] CF Categories `Tax Client`, `Corporate Client`, `Prospect` exist
- [ ] CF Categories are correctly associated with their respective Circles
- [ ] All 5 Circles exist with correct auto-add settings
- [ ] CRM Default Fields are configured (all critical fields visible)

### Aesthetics (Phase 1B)
- [ ] Platform Branding reflects AI Tax Advisers identity (dark sidebar, rose accents, Cormorant + Inter fonts)
- [ ] Theme-level Custom CSS is active and skinning the admin dashboard
- [ ] KPI tiles have rounded corners, visible numbers, proper hover effects
- [ ] Panel widgets match the brand palette
- [ ] CSS Stack `AITAX_Stacks_Pages_CSS` exists in Content > Stacks
- [ ] JS Stack `AITAX_Stacks_Pages_JS` exists in Content > Stacks
- [ ] No Stack source code is visible on any dashboard

### Reception Dashboard (Phase 1C)
- [ ] `Reception Homepage` dashboard exists
- [ ] It is assigned to `Staff - Reception` Circle via Medium Priority
- [ ] Welcome banner, KPI row, Activity Stream, Calendar, and Quick Action buttons are present
- [ ] Quick Action buttons navigate correctly (New Contact, New Appointment, Log a Call)
- [ ] Dashboard renders with champagne background and branded fonts

### Workflows (Phase 1D)
- [ ] `Reception - Client Info Update` form exists and includes all required fields
- [ ] Form header renders with aitax-form-card styling
- [ ] At least one Appointment Generator exists and is functional
- [ ] Follow-Up categories `Call Log`, `Walk-In Visit`, `Email Correspondence` exist
- [ ] A Follow-Up can be created, categorized, and viewed on both Calendar and CRM Dashboard

### Cross-Cutting Checks
- [ ] Log into the platform as a Reception staff member. The Reception Homepage dashboard loads as default
- [ ] Navigate to a Contact. Tax Client custom fields are visible (if Contact is in `All Active Clients` Circle)
- [ ] Navigate to a Contact NOT in any Circle. Tax Client fields are NOT visible
- [ ] No CSS rules have leaked outside `#dashboard-view` for admin dashboard
- [ ] The Stacks have NOT been added to the Container Stack yet (future phase: the Container Stack `AITAX_Stacks_All_Pages_CSS_JS` will be created when Portal Pages are built)

---

## FUTURE PHASE NOTES (Do Not Execute - For Context Only)

These items are documented here so Phase 1 does not foreclose them:

### Phase 2: Deal Pipelines
- Create 3 Deal Pipelines: `US Tax Returns (1040)`, `Thai Tax Returns`, `Corporate / Entity Returns`
- Each pipeline has 8 stages per `SuiteDash_Tax_Firm_Architecture.md` section 3
- Configure Deal Generators for each pipeline
- Build automation workflows triggered by stage changes

### Phase 3: Project Templates and Filing Cabinets
- Project Generators that spin up when a Deal moves to Stage 2
- Folder Generators for `[TaxYear] Tax Docs` hierarchy
- Staff task templates within Projects

### Phase 4: Client Portal
- Create the Container Stack `AITAX_Stacks_All_Pages_CSS_JS` referencing the CSS and JS sibling Stacks
- Build Portal Pages for client-facing document access
- Use Circles to scope file visibility (e.g., `2024 1040 Completed` Circle)
- Enable client profile editing via Update Forms with "Allow Contact to update on their profile page"

---

> **End of Phase 1 Execution Blueprint**
