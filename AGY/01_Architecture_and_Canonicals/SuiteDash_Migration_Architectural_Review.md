---
title: SuiteDash Migration Architectural Review
source: local:root_suite_dash_review
tags: [architecture, suitedash]
---

# SuiteDash Migration Architectural Review
## AI Tax Advisers — Asana to SuiteDash Migration Assessment

**Prepared for:** AI Tax Advisers (`aitaxadvisers.com`)  
**Date:** 2026-08-21  
**Data Sources Analyzed:**
- Asana Complete Export: 4,398 tasks, 19 projects, 20,000+ stories (35,986 stories in task metadata)
- Asana Stories Export: 4,043 tasks with comments, 28,832 total stories
- Current Migration Plan: `suitedash_migration_master_plan.md` (Phase 1: CRM, Phase 2: Deals/Pipelines)
- SuiteDash Canonicals: Generation Manual, Circles Config, API Specs, Tax Firm Pipelines

---

## 1. PLAN EVALUATION

### 1.1 Current Architecture Assessment

**What You're Doing Right:**
| Aspect | Assessment |
|--------|------------|
| **Phase 1 = CRM only** | ✅ Correct. Separating static biographical data (Contacts/Companies) from transactional workflow data (Deals/Projects) follows SuiteDash's native architecture and prevents staff overwhelm. |
| **Contact Custom Fields for permanent data** | ✅ Correct. DOB, Spouse Name, Dropbox URLs, Tax Years are truly *contact-level* attributes — they persist across tax years and don't belong on Deals/Projects. |
| **Leaving ID/UID blank on import** | ✅ Correct. SuiteDash auto-assigns; pre-filling causes collisions. |
| **Consolidating history into `Background Info`** | ✅ Correct. SuiteDash cannot bulk-import Projects via CSV; the Notes tab (via API) is the only viable path for historical audit trail. |
| **Circles for permission engine** | ✅ Forward-thinking. Circles are the native SuiteDash mechanism for portal scoping — building this now avoids rework in Phase 2. |

**Where the Plan Needs Refinement:**

| Issue | Current Plan | Recommendation |
|-------|--------------|----------------|
| **Deal Pipelines vs. Work Requests → Projects** | Planning to use Deal Pipelines for active tax returns | **Use Deal Pipelines for Sales (Lead→Quote→Engagement→Deposit)** and **Project Templates + Generators for Fulfillment (Stages 6–11)**. Do NOT try to run the full 11-stage flow inside a single Deal Pipeline. SuiteDash Deals lack subtasks, checklists, and the granular task assignment your preparers need. |
| **Single "Tax Return" Pipeline** | Implied by "Deal Pipelines" plural but not specified | **Create separate Pipelines per Service Line**: `US 1040 Flow`, `Thai Tax Flow`, `Streamlined/FBAR Flow`, `Corporate Flow`, `ITIN/POA Flow`. Each has different stages, assignees, and SLA timelines. |
| **Preparer Assignment Model** | Not explicitly addressed | **Map Asana assignees → SuiteDash Project Task Assignees**, not Deal assignees. Deals have one "Owner"; Projects support task-level assignment to multiple staff. |
| **Multi-Year Client Handling** | "Active Tax Years" as multi-select on Contact | **Add a "Current Tax Year" single-select on Contact** for the active filing season + keep "Historical Tax Years" multi-select. This drives which Pipeline/Deal auto-generates. |
| **Corporate vs. Individual Clients** | Single Contact import | **Use Companies for corporate entities** (AIT Corporate Tax Returns project has 6 tasks with company names). Link individual contacts (preparers, signatories) to the Company. |

### 1.2 Deal Pipeline vs. Work Requests → Projects — Verdict

**Use Deal Pipelines for Stages 1–5 (Sales/Intake)**  
**Use Project Templates + Generators for Stages 6–11 (Fulfillment/QA/Delivery)**

**Rationale from SuiteDash Canonicals:**
- The `Tax_Firm_Pipelines/Tax_Prep_Setup/Circles` architecture shows **7 Phase Circles** (Deal Pipeline) + **6 Invoice/Plan Circles** (Post-sale fulfillment) — a clear two-engine model.
- Deal Generators can create Projects from templates when a Deal hits "Won" (Deposit Paid).
- Projects support: subtasks, checklists, task dependencies, multiple assignees, client-facing portal tasks, time tracking.
- Deals support: pipeline visualization, probability weighting, forecasting, proposal generation, e-signature.

**Your Asana data confirms this split:**
- Projects like "Tax return preparation" (275 tasks) and "2024 US Tax Return" (744 tasks) are *fulfillment* — they have assignees, due dates, subtasks, heavy comment threads.
- Projects like "IRS Letters/POA/ITIN" (15 tasks) and "Thailand Tax Identification" (188 tasks) are *service-line-specific fulfillment*.
- No Asana project maps cleanly to a pure "sales pipeline" — your Asana was doing both in one board per year.

---

## 2. CATEGORY & TAXONOMY STANDARDIZATION

Based on analysis of your 19 Asana projects, 100 tags (mostly numeric stage markers 1–88), 33 users, and 4,398 tasks with 35,986 stories:

### 2.1 Deal Pipelines (Sales Engine — Stages 1–5)

| Pipeline Name | Service Lines Covered | Rationale |
|---------------|----------------------|-----------|
| **US 1040 Flow** | US 1040, 1040X Amended, Streamlined, FBAR, State Returns | 2,000+ tasks across 2020–2025 US Tax Return projects; Warodom/Onanong/Napakan as primary preparers |
| **Thai Tax Flow** | Thai PND90/91, Thailand TIN, Thai Corporate | 277 tasks in 2024/2025 Thai Tax Return + Thailand Tax ID; thaweesak/Pawina/Gate as primary preparers |
| **Corporate & Entity Flow** | 1120/1120-S, Form 5471/5472, BOIR, Corporate Reclaim | 6 tasks in AIT Corporate projects; Robert Bluett as preparer; distinct compliance calendar |
| **IRS Representation Flow** | POA/2848, IRS Letters, ITIN (W-7), Amended Returns | 15+19+1+15 tasks; Chetan/Thomas as primary; shorter cycles, document-heavy |
| **Cross-Border/Expat Flow** | UAE, International, Streamlined Foreign Offshore | Dru Donatelli (13 tasks), Thailand Tax ID (188 tasks); requires multi-jurisdiction coordination |

### 2.2 Pipeline Stages (Per Pipeline — Stages 1–5)

| Stage # | Universal Name | US 1040 Flow | Thai Tax Flow | Corporate Flow | IRS Rep Flow | Cross-Border Flow |
|---------|----------------|--------------|---------------|----------------|--------------|-------------------|
| **1** | **Lead / Intake** | Intake Form Submitted | Intake Form Submitted | Entity Inquiry Received | IRS Notice Received | Multi-Jurisdiction Intake |
| **2** | **Quotation Sent** | Fee Quote Delivered | Fee Quote Delivered | Scope & Fee Delivered | Representation Quote | Multi-Jurisdiction Quote |
| **3** | **Did Not Proceed** | Lost — No Response | Lost — No Response | Lost — No Response | Lost — No Response | Lost — No Response |
| **4** | **Engagement Signed** | Engagement Letter + 8879 Signed | Engagement Letter Signed | Engagement + Board Resolution | POA/2848 Signed | Multi-Jurisdiction Engagement |
| **5** | **Deposit Paid** | 50% Deposit / 1st Invoice Paid | 50% Deposit / 1st Invoice Paid | Retainer Received | Retainer Received | Deposit Received |

> **Note:** Stage 3 is a "Lost" terminal stage. SuiteDash supports "Lost Reason" tracking — use it.

### 2.3 Project Templates & Status Categories (Fulfillment Engine — Stages 6–11)

Each Pipeline above gets **one Project Template** that the Deal Generator spawns when Stage 5 → Won.

| Status # | Universal Status | US 1040 Project | Thai Tax Project | Corporate Project | IRS Rep Project | Cross-Border Project |
|----------|------------------|-----------------|------------------|-------------------|-----------------|---------------------|
| **6** | **Awaiting Client Docs** | Document Checklist Sent | Document Checklist Sent | Entity Docs Requested | IRS Notice Docs Requested | Multi-Jurisdiction Doc Request |
| **7** | **Preparation in Progress** | Return Prep (Preparer) | PND90/91 Prep | 1120/5471 Prep | POA/ITIN Prep | Coordinated Multi-Country Prep |
| **8** | **Senior QA Review** | Thomas/Asa Review | Senior Thai Review | Robert Bluett Review | Chetan/Thomas Review | Multi-Jurisdiction Senior Review |
| **9** | **Client Review & 8879** | Draft to Client → Form 8879 | Draft to Client → Thai e-Filing Auth | Draft to Client → Board Approval | Client Review POA/ITIN | Multi-Jurisdiction Client Review |
| **10** | **Final Invoice & Payment** | Balance Invoice → Payment | Balance Invoice → Payment | Final Invoice → Payment | Final Invoice → Payment | Consolidated Final Invoice |
| **11** | **Filed & Closed** | IRS E-File + State E-File | Thai RD E-File | IRS E-File + State | IRS Submission Confirmation | Multi-Jurisdiction Filing Confirmed |

### 2.4 Project Categories (for Reporting & Dashboards)

| Category | Pipelines Using It | Description |
|----------|-------------------|-------------|
| **US Individual** | US 1040 Flow | 1040, 1040X, Streamlined, FBAR, State |
| **Thai Individual** | Thai Tax Flow | PND90, PND91, TIN |
| **Corporate/Entity** | Corporate Flow | 1120, 1120-S, 5471, 5472, BOIR |
| **IRS Representation** | IRS Rep Flow | POA, ITIN, Letters, Amended |
| **Cross-Border** | Cross-Border Flow | Multi-jurisdiction, Expat, UAE |

### 2.5 Custom Field Taxonomy — Contact vs. Deal vs. Project

| Field | Level | Type | Values / Notes |
|-------|-------|------|----------------|
| **First Name / Last Name / Email / Phone** | Contact | Standard | Core identity |
| **Date of Birth** | Contact | Date | Required for 1040/Thai filings |
| **Spouse Full Name** | Contact | Text | From Asana parsing |
| **Spouse DOB / Email / Phone** | Contact | Date/Email/Phone | For joint returns |
| **Client Region** | Contact | Dropdown | `Thailand - Bangkok`, `Thailand - Chiang Mai`, `USA`, `UAE`, `International` |
| **Referral Source** | Contact | Text | `Referral from KEN`, `Website`, `Client Intro` |
| **Legacy Asana GIDs** | Contact | Text (multi-line) | Comma-separated GIDs for traceability |
| **Historical Asana Projects** | Contact | Text (multi-line) | List of project names client appeared in |
| **Historical Tax Years** | Contact | Multi-select | `2020, 2021, 2022, 2023, 2024, 2025, 2026` |
| **Current Tax Year** | Contact | Single-select | `2025` (drives auto-Deal generation) |
| **Primary Preparer** | Contact | User picker | Default assignee for new Deals |
| **Dropbox URL** | Contact | URL | Client document folder |
| **Streamline Eligible** | Contact | Boolean | `0`/`1` from import |
| **Tax Services Required** | Contact | Multi-select | `US 1040`, `Thai Tax`, `FBAR`, `Streamlined`, `ITIN`, `POA`, `Corporate`, `BOIR` |
| **Deal: Pipeline** | Deal | Dropdown (auto) | Set by Generator based on Contact's "Tax Services Required" |
| **Deal: Current Tax Year** | Deal | Single-select | Copied from Contact's "Current Tax Year" |
| **Deal: Quoted Fee** | Deal | Currency | From Asana fee quotes in stories |
| **Deal: Deposit Amount** | Deal | Currency | 50% of Quoted Fee (configurable) |
| **Deal: Lost Reason** | Deal | Dropdown | `No Response`, `Price`, `Timeline`, `Went Elsewhere`, `Other` |
| **Project: Service Line** | Project | Dropdown (auto) | From parent Deal's Pipeline |
| **Project: Tax Year** | Project | Single-select (auto) | From Deal |
| **Project: Preparer** | Project Task | User picker | Per-task assignment (Warodom, Onanong, Napakan, etc.) |
| **Project: Reviewer** | Project Task | User picker | Senior QA (Thomas, Asa, Robert) |
| **Project: Due Date** | Project Task | Date | Calculated from filing deadline |
| **Project: Filing Status** | Project | Dropdown | `Not Started`, `Preparing`, `Review`, `Client Review`, `Filed`, `Closed` |
| **Project: IRS/Thai Confirmation #** | Project | Text | E-file acknowledgment number |

---

## 3. GAP ANALYSIS

### 3.1 Asana Data Points at Risk of Being Orphaned

| Asana Data Point | Current Plan Coverage | Risk | Mitigation |
|------------------|----------------------|------|------------|
| **Preparer Assignments (33 users)** | Not mapped to Deal/Project tasks | HIGH — 2,005 incomplete tasks have active assignees | Map each Asana user → SuiteDash staff; use Project Task assignees, not Deal owner |
| **Due Dates (57 tasks)** | Not explicitly mapped | MEDIUM — Critical for filing deadlines | Push to Project Task due dates via Generator template |
| **Subtasks (4 total)** | Not mentioned | LOW — Only 4 subtasks found, but Asana free tier hid dependencies | Check if more exist in full export; map to Project checklists |
| **Section Changes (10,145 stories)** | Consolidated to Background Info | MEDIUM — Shows workflow progression | Parse section transitions into "Stage History" custom field on Deal/Project |
| **Tags (71 unique on tasks, mostly numeric 1–88)** | Not mapped | HIGH — These are **stage markers** (your 11-stage pipeline) | Map numeric tags → Pipeline Stages: `1=Lead`, `2=Quote`, `3=Engagement`, `4=Deposit`, `5=Docs`, `6=Prep`, `7=Review`, `8=8879`, `9=Invoice`, `10=Filed`, `11=Closed` |
| **Task Dependencies (Plan Restriction)** | Not accessible in export | MEDIUM — Asana free tier blocked this | Reconstruct from section order + preparer handoffs in stories |
| **Attachments (Plan Restriction)** | Not accessible | HIGH — Client docs, IRS letters, signed 8879s | Note in Background Info: "Attachments in Asana GID: XXXX — migrate manually or via API" |
| **Multi-Year Client History (911 repeat clients)** | "Historical Tax Years" multi-select | MEDIUM — Loses per-year fee/stage detail | Add "Historical Engagements" table in Background Info: `Year | Service | Fee | Preparer | Status` |

### 3.2 SuiteDash Features Not in Current Plan (Should Be)

| Feature | Why It Matters for Your Firm | Implementation |
|---------|------------------------------|----------------|
| **Deal Generators** | Auto-create Project from Template when Deal hits Stage 5 (Deposit Paid) | Configure in SuiteDash: Deals → Generators → Project Generator per Pipeline |
| **Project Templates with Task Lists** | Your 2,005 active tasks need structured checklists per service line | Build templates: `US 1040 Task List`, `Thai Tax Task List`, `Corporate Task List`, etc. |
| **Automations (No-Code)** | Replace manual Asana moves: Stage change → Circle assignment → Email → Task creation | Example: Deal Stage 4→5 → Add to "Client Onboarding" Circle → Fire Form Cannon for Doc Request |
| **Form Cannons** | Send document checklists to clients without portal login | One per service line: `US 1040 Doc Request`, `Thai Tax Doc Request` |
| **Checklists** | Simpler than Projects for "Document Collection" phase | Use for Stage 6 (Awaiting Docs) — client-facing, no staff assignment needed |
| **LMS (Learning Management)** | Client education: "How to upload docs", "What is Form 8879" | Build into Client Onboarding Circle (Phase 5) — SuiteDash native LMS |
| **Invoicing + Subscription Billing** | Recurring: Tax Monitor, Annual Compliance, Quarterly Estimates | Set up Products → Invoices → Recurring; link to Circles for portal access |
| **Worlds (Multi-Entity Isolation)** | If you manage multiple service bureaus or distinct brands | Not needed now; keep in mind for Phase 3+ |
| **Custom Pages (Stack-Triad)** | Branded client portal pages: `/i/{token}` for status, payments, docs | Build after Phase 1; use VLP Worker as API broker |

### 3.3 Phase 1 → Phase 2 Handoff Gaps

| Gap | Impact | Fix Before Phase 2 |
|-----|--------|-------------------|
| **No "Current Tax Year" on Contact** | Can't auto-generate correct Deal for 2025 season | Add field now; populate during import |
| **No "Primary Preparer" on Contact** | Deal Generator won't know who to assign Project tasks | Add field; map from most frequent Asana assignee per client |
| **Circle IDs not reserved** | Phase 2 Circles will need specific IDs for API automation | Pre-create Circles in SuiteDash now (inactive) with known names |
| **Project Templates don't exist** | Deal Generator has nothing to spawn | Build 5 templates (one per Pipeline) in Phase 1 downtime |
| **Staff not provisioned in SuiteDash** | 33 Asana users → need SuiteDash Teammate accounts | Use Flyout → Manage Staff → Bulk Invite now |

---

## 4. IMPLEMENTATION PRIORITIES & SEQUENCE

### Immediate (Phase 1 Completion)
1. **Finalize Contact Import CSV** — Verify 2,055 rows, test import 20, then full batch
2. **Create all Contact Custom Fields** in SuiteDash (47 columns mapped)
3. **Pre-create Circles** (13 total: 7 Phase + 6 Invoice/Plan) — inactive, with known names
4. **Provision all 33 Staff** as Teammates via Bulk Invite
5. **Build 5 Project Templates** with task lists, assignee placeholders, due date logic

### Phase 2A — Deal Pipeline Setup
1. Create 5 Pipelines with Stages 1–5 (per taxonomy above)
2. Configure Deal Generators: Stage 5 (Won) → Spawn Project from Template
3. Map Asana numeric tags (1–88) → Pipeline Stages for historical Deal creation
4. Build "Lost Reason" dropdown and automation for Stage 3

### Phase 2B — Fulfillment Automation
1. Build Automations: Stage changes → Circle assignments → Form Cannons → Notifications
2. Create Checklists for Document Collection (Stage 6)
3. Set up Invoicing Products: `US 1040 Prep`, `Thai Tax Prep`, `Streamlined`, `Corporate`, `IRS Representation`
4. Configure Recurring Billing for Tax Monitor/Annual Compliance

### Phase 2C — Client Portal Rollout
1. Custom Pages (Stack-Triad) for Client Dashboard, Document Upload, Status Tracker
2. LMS Courses: "Welcome to AI Tax Advisers", "Uploading Documents", "Understanding Form 8879"
3. Portal permissions via Circles: Phase 5+ = Client Portal Access

---

## 5. MIGRATION SCRIPT SPECIFICATIONS (For Your Developer)

### 5.1 Contact Import (CSV → SuiteDash API)
```python
# POST /secure-api/contact (one per row)
# Leave ID, UID blank
# Map CSV columns → API payload:
{
  "role": "Client",  # or "Prospect" if Historical Tax Years empty
  "first_name": row["First Name"],
  "last_name": row["Last Name"],
  "email": row["Primary Email"],
  "phone": row["Primary Phone"],
  "send_welcome_email": False,  # Phase 1 is internal only
  "custom_fields": {
    "Date of Birth (Contact)": row["Date of Birth (Contact)"],
    "Spouse Full Name (Contact)": row["Spouse Full Name (Contact)"],
    "Dropbox URL Link (Contact)": row["Dropbox URL Link (Contact)"],
    "Streamline (Contact)": row["Streamline (Contact)"],
    "Tax Year (Contact)": row["Tax Year (Contact)"],
    "Extra Tax Notes (Contact)": row["Extra Tax Notes (Contact)"],
    # ... plus your new fields:
    "Client Region": derive_from_address(row),
    "Referral Source": extract_from_background(row["Background Info"]),
    "Legacy Asana GIDs": extract_gids(row["Background Info"]),
    "Historical Asana Projects": extract_projects(row["Background Info"]),
    "Historical Tax Years": row["Tax Year (Contact)"],  # multi-select
    "Current Tax Year": max(row["Tax Year (Contact)"].split(", ")),
    "Primary Preparer": row["Coordinator"],
    "Tax Services Required": parse_tags_to_services(row["Tags"]),
  }
}
```

### 5.2 Historical Stories → Contact Notes (API)
```python
# For each contact, aggregate stories from all their Asana tasks
# POST to SuiteDash Notes API (or use Contact update with notes append)
# Format chronologically:
"""
=== ASANA HISTORICAL RECORD ===
Task: Jerome Chen (jerome@oakra.com) [GID: 1207311240709736]
Project: Tax return preparation
Assignee: Napakan Boonmak
Tags: [82, 85]

[2024-05-14 07:34] Napakan Boonmak (assigned): Assigned to Napakan Boonmak
[2024-05-14 07:36] Napakan Boonmak (comment): 2021-2023 streamlined filling + 6yr FBAR + 2021-2022 Amended + 2021-2023 CA State = USD $6,000
[2024-05-14 07:36] Napakan Boonmak (section): Moved from "Contact/Lead" to "Untitled section"

---
Task: Johnny Koehn [GID: 1175082451785600]
Project: Tax return preparation
[2020-05-15] Chris Mc Laughlin: no information.
[2020-06-08] Chris Mc Laughlin: Email sent to Koehn on 06/08/20
[2020-06-26] Nathamon Yongsuwankul: Moved from "Contact/Lead" to "Quotation / Not Proceed"
"""
```

### 5.3 Deal + Project Creation (Phase 2 — for active 2024/2025 clients)
```python
# For each contact with "Current Tax Year" = 2025 and incomplete Asana tasks:
# 1. Determine Pipeline from "Tax Services Required"
# 2. Create Deal via API (POST /secure-api/deal or UI bulk)
# 3. Set Deal Stage based on latest Asana section/tag
# 4. When Deal → Stage 5 (Deposit Paid), Generator creates Project
# 5. Project Tasks get assignees from Asana task assignees
# 6. Project Task due dates from Asana due_on/due_at
```

---

## 6. RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Duplicate Contacts on Import** | HIGH | HIGH | Pre-import dedupe by email+name; use `findPriorOnboardingByEmail` pattern from SuiteDash Generation Manual |
| **Staff Not Provisioned in Time** | MEDIUM | HIGH | Invite all 33 users NOW via Flyout → Manage Staff; they can accept before Phase 1 completes |
| **Project Template Complexity** | HIGH | MEDIUM | Start with minimal viable templates (10 tasks each); iterate after staff feedback |
| **Asana Attachment Loss** | HIGH | MEDIUM | Document in Background Info; plan manual migration for critical docs (signed 8879s, POAs) |
| **Numeric Tag Mapping Errors** | MEDIUM | HIGH | Write unit tests for tag→stage mapping; validate against known task histories |
| **Circle Permission Conflicts** | LOW | HIGH | Test Circle assignments with 2-3 pilot clients before full rollout |
| **API Rate Limits** | MEDIUM | MEDIUM | Batch imports; use 200ms delays; implement exponential backoff on 429 |

---

## 7. APPENDIX: KEY DATA STATISTICS

| Metric | Value |
|--------|-------|
| Total Asana Tasks | 4,398 |
| Total Asana Projects | 19 |
| Total Asana Stories (Comments) | 28,832 (stories export) + 35,986 (embedded in tasks) |
| Unique Clients (Deduplicated) | 2,055 |
| Multi-Year Clients | 911 |
| Email Coverage | 89.4% |
| Phone Coverage | 50.7% |
| Active (Incomplete) Tasks | 2,005 |
| Completed Tasks | 2,393 |
| Tasks with Due Dates | 57 |
| Subtasks | 4 |
| Unique Assignees (Staff) | 33 |
| Top Preparers (by task count) | Warodom (500+), Onanong (400+), Napakan (350+), Arnan (250+), Chetan (200+) |

---

## 8. NEXT STEPS FOR YOU

1. **Review this document** — Confirm Pipeline names, Stage names, Custom Field names match your mental model
2. **Approve Contact Custom Fields** — I'll generate the exact SuiteDash admin UI clicks to create them
3. **Run Test Import** — 20 contacts → verify Background Info renders, Custom Fields populate, Circles assignable
4. **Pre-provision Staff** — Send 33 Bulk Invites today
5. **Build Project Templates** — Start with US 1040 (highest volume), then Thai, then Corporate

---

*This review is based on the Asana exports provided and the SuiteDash canonical knowledge base. It reflects SuiteDash's actual API capabilities and native workflow patterns as of 2026-08-21.*
