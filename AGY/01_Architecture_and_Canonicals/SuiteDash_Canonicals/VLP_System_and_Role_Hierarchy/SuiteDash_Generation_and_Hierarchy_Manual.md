---
title: SuiteDash Generation, Role Hierarchy, & System Architecture Manual
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [api-brokering, bkk-sync, generation-manual, hierarchy, obsidian-vault, office-sync,
  suitedash, synto-knowledge, which-does-what]
type: manual
---

# SuiteDash Generation, Role Hierarchy, & System Architecture Manual

This manual provides the definitive architectural blueprint, hierarchical division of responsibilities ("Which Does What"), and operational recipes for generating SuiteDash portals, pages, contacts, staff, and lifecycle workflows across the ecosystem.

---

## 🏛️ Part 1: Hierarchical Chart & "Which Does What"

### 1.1 Organizational & System Hierarchy
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       1. PRINCIPAL ENGINEER (Strategic)                     │
│    • System architecture, canonicals, contract design, decision escalation  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                       2. EXECUTION ENGINEER (Builder)                       │
│    • Component authoring, Worker endpoints, SuiteDash custom stacks & CSS   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    3. SERVICE BUREAU OPERATOR (Reseller)                    │
│    • Owns parent SuiteDash account (SU1TE Reseller / White-Label Portal)    │
└──────────────────┬──────────────────────────────────────────┬───────────────┘
                   │                                          │
┌──────────────────▼──────────────────┐    ┌──────────────────▼───────────────┐
│     4. FIRM OWNER / STAFF ADMIN     │    │       5. TAX PREPARERS (Staff)   │
│ • Manages client files, invoices,   │    │ • Assigned to contacts & circles │
│   automations, and team permissions │    │ • Executes returns & intake      │
└──────────────────┬──────────────────┘    └──────────────────┬───────────────┘
                   │                                          │
                   └──────────────────┬───────────────────────┘
                                      │
┌─────────────────────────────────────▼───────────────────────────────────────┐
│                      6. MEMBERS / CLIENTS (Contacts)                        │
│    • Log into branded client portal: submit intake, view status, pay LMS    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 System Component Division ("Which Does What")

| System Component | Technology | Primary Responsibilities ("What It Does") | Boundaries ("What It Does NOT Do") |
|---|---|---|---|
| **Marketing Frontends** | Next.js 15, Cloudflare Pages | • Public landing pages (`/about`, `/features`, `/pricing`)<br>• Free magnets (IRS payment calculators, code lookup)<br>• Account creation intake (`/sign-in`) | • No direct database access<br>• No heavy CRM storage<br>• Delegates auth and portal access |
| **VLP Worker / API Gateway** | Cloudflare Workers, D1, KV, R2 | • Auth gating & JWT verification<br>• Rate limiting & IP hashing<br>• **SuiteDash Secure API broker** (`POST /v1/taxprep/onboarding`)<br>• R2 event receipt deduplication & idempotency | • Does not render client portal UI<br>• Does not store long-term client case files |
| **SuiteDash Workspace** | SuiteDash ERP / Angular Canvas | • **Primary CRM & Client Portal** (`/dashboard`, `/i/{token}`)<br>• White-label custom branding (Custom CSS/JS)<br>• 7-Phase Client Lifecycle Circles & automations<br>• Invoicing, billing subscriptions, and LMS training | • Avoids custom backend programming; driven by API triggers, custom fields & tags |
| **Cal.com** | Cal.com Embeds & Webhooks | • Discovery calls, Demo appointments, and support bookings<br>• Dynamic timezone adjustments & booking buffers | • Handled independently of SD native appointment forms where external flexibility is needed |
| **ClickUp / Local Vault** | ClickUp API / Syncthing / Obsidian | • Internal task tracking, team boards, and offline knowledge | • Client-facing interactions never route directly to ClickUp |

---

## 🛠️ Part 2: How to Effectively Generate SuiteDash Assets

### 2.1 Generating Portals & Admin Dashboards
1. **Scoping Requirement**:
   * All portal dashboard custom CSS must be strictly scoped under `#dashboard-view`:
     ```css
     #dashboard-view .reporting__block { /* custom rules */ !important; }
     ```
   * *Why*: SuiteDash injects this stylesheet globally into `<style id="platform-branding-custom-css-anchor">`. Leaving rules unscoped leaks into the admin navigation chrome, modals, and settings editor.
2. **Angular Widget Controller Conventions**:
   * Dashboard widgets are rendered dynamically by Angular controllers after page load.
   * Real runtime classes: `Reporting2BlockController`, `ProjectsBlockController`, `LiveStream2BlockController`.
   * Never rely on static HTML skeleton classes (`#sdReporting`, `.report-card`).

---

### 2.2 Generating Custom Pages & Stacks (Stack-Triad Convention)
SuiteDash Custom Pages (`secure.virtuallaunch.pro/i/{token}`) are generated using the **Stack-Triad Convention**:
1. **HTML Layout**: Structural content composed of standard blocks (hero, features, tables).
2. **Scoped Stack CSS**: Injected into the page custom CSS block, targeting container IDs.
3. **Stack JS**: Client-side logic for DOM interactions, calculator modals, and dynamic filters.
4. **Responsive Breakpoints**:
   * Desktop: `> 1024px`
   * Tablet: `768px - 1024px`
   * Mobile: `< 768px`

---

### 2.3 Generating Contacts (Clients & Prospects via API)
1. **API Broker Pattern**:
   * Client accounts are generated programmatically via `POST /secure-api/company` on `https://app.suitedash.com`.
   * The VLP Worker brokers this request through `POST /v1/taxprep/onboarding` and `POST /v1/tmp/onboarding`.
2. **Payload Structure**:
   ```json
   {
     "company_name": "Acme Tax Firm",
     "first_name": "Jane",
     "last_name": "Doe",
     "email": "jane@acmetax.com",
     "phone": "555-0199",
     "category": "Prospect",
     "custom_fields": {
       "Tax Year": "2026",
       "Product": "Tax Prep Pro"
     }
   }
   ```
3. **Deduplication & Existing Customer Merging**:
   * *Pre-Check*: Before issuing a creation call, query `findPriorOnboardingByEmail(email)`.
   * *Merge*: If the email exists, call `GET /secure-api/company/:uid` and update product tags via `PUT /secure-api/company/:uid` rather than generating a duplicate record.
   * *Idempotency*: Receipts are written to Cloudflare R2 (`receipts/taxprep/onboarding/{eventId}.json`). Replayed event IDs return 200 `status: "deduped"`.

---

### 2.4 Generating Staff (Teammates & Managers)
1. **API Limitation**: The SuiteDash `/contact` API creates *Contacts/Clients*, NOT *Teammates/Staff*.
2. **Provisioning Procedure**:
   * Staff must be created via **Flyout Menu ➔ Manage Staff ➔ Bulk Invite**.
   * Role assignment:
     * **Super Admin**: Complete organization access, billing, and API keys.
     * **Admin**: User management and workspace configurations.
     * **Manager**: Assigned specific company circles and project review rights.
     * **Teammate**: Restricted to assigned tasks, client communication channels, and time tracking.

---

### 2.5 Generating Automated Circles & Lifecycles
Circles govern client visibility, file permissions, and automated drips. The standard tax firm 7-phase circle architecture:
1. **Phase 1: Lead Capture & Intake** (Kickoff form submitted, auto-tagged as Prospect).
2. **Phase 2: Qualify & Segment** (Automated checklist generated, transcript review triggered).
3. **Phase 3: Prospect Discovery Call** (Cal.com / appointment generator sync, notification sent).
4. **Phase 4: Offer & Close** (Proposal & engagement agreement generated for e-signature).
5. **Phase 5: Client Onboarding & Setup** (Converted to Client category, LMS course access unlocked).
6. **Phase 6: Early Wins & Results** (Tax return draft or IRS Form 433 filed).
7. **Phase 7: Upsell & Referral** (Annual monitoring subscription invoice dispatched).

---
*Manual compiled: 2026-08-18 17:36:11 | Antigravity Knowledge Engine*
