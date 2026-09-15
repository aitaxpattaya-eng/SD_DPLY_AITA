---
title: SuiteDash Canonicals & Tax Platform Master Index
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [bkk-sync, irs-resolution, master-index, obsidian-vault, office-sync, suitedash,
  synto-knowledge, tax-firm]
type: index
---

# SuiteDash Canonicals & Tax Platform Master Index

This curated knowledge repository contains verified architectural styling specifications, production CSS/JS stacks, 7-phase client lifecycle pipelines, a 40-lesson LMS tax curriculum, and programmatic IRS Form 433-A/433-F PDF automation engines.

---

## 🏛️ 1. Architecture & Styling Specifications
*Deep DOM architecture analysis and runtime CSS overrides for SuiteDash surfaces.*

- [[Architecture_and_Styling/TaxIOS_Theme_and_Loader/SuiteDash_Netlify_Loader_Pattern|Netlify CDN Dynamic Loader & Universal Theme Engine]]: Automated SuiteDash SPA script injection, MutationObserver DOM rescanning, and 979-line responsive dark/light mode stylesheet.
- [[Architecture_and_Styling/sd-admin-dashboards|Admin Dashboards DOM Spec]]: Angular widget canvas selectors (`#dashboard-view`, `Reporting2BlockController`), runtime `<style>` overrides, and responsive widget layout traps.
- [[Architecture_and_Styling/sd-pages|Pages Stack-Triad Spec]]: Custom page editor and Stack-triad conventions (`secure.virtuallaunch.pro/i/{token}`).
- [[Architecture_and_Styling/sd-lms|LMS Lesson Theming Spec]]: Scoped per-lesson CSS (`.lms-lesson-{N-N}`) and course styling.
- [[Architecture_and_Styling/29355_Stacks_Pages_CSS|Production Pages CSS Stack]]: 50 KB of verified production SuiteDash custom stylesheet.
- [[Architecture_and_Styling/29355_Stacks_Pages_JS|Production Pages JS Stack]]: Custom JavaScript logic for SuiteDash pages.

---

## ⚙️ 2. Modules & Core Configurations
*Standardized SuiteDash building block specifications and trigger automations.*

- [[Modules_and_Lifecycle/m004-circles|Circles & Lifecycle Stages]]: Circle-based client stage management and automated transition rules.
- [[Modules_and_Lifecycle/m001-appointments|Appointments & Intake Generators]]: Appointment configuration, buffers, and timezone sync.
- [[Modules_and_Lifecycle/sd-appt-generator-config-tmp-mirror|Appointment Generator Configuration]]: Mirror config for booking engines and kickoff intake forms.
- [[Modules_and_Lifecycle/m014-landing-pages|Landing Pages Module]]: Landing page layout and custom stack triads.

---

## 📊 3. Tax Firm Pipelines & 7-Phase Client Lifecycles
*End-to-end client journey blueprints for Tax Monitoring and Tax Preparation.*

### Tax Monitor Setup (`Tax_Monitor_Setup`)
- **Appointments**: [[Tax_Firm_Pipelines/Tax_Monitor_Setup/Appointments/appt-tax-monitor-setup-discovery-appt|Discovery Call]], [[Tax_Firm_Pipelines/Tax_Monitor_Setup/Appointments/appt-tax-monitor-setup-demo-appt|Demo]], [[Tax_Firm_Pipelines/Tax_Monitor_Setup/Appointments/appt-tax-monitor-setup-onboarding-support|Onboarding]], [[Tax_Firm_Pipelines/Tax_Monitor_Setup/Appointments/appt-tax-monitor-setup-exit-offboarding-support|Offboarding]]
- **7-Phase Circles**:
  1. [[Tax_Firm_Pipelines/Tax_Monitor_Setup/Circles/circle-1-29352-deal-phase-1-lead-capture-and-intake|Phase 1: Lead Capture & Intake]]
  2. [[Tax_Firm_Pipelines/Tax_Monitor_Setup/Circles/circle-2-29352-deal-phase-2-qualify-and-segment|Phase 2: Qualify & Segment]]
  3. [[Tax_Firm_Pipelines/Tax_Monitor_Setup/Circles/circle-3-29352-deal-phase-3-prospect-discovery-call|Phase 3: Prospect Discovery Call]]
  4. [[Tax_Firm_Pipelines/Tax_Monitor_Setup/Circles/circle-4-29352-deal-phase-4-offer-and-close|Phase 4: Offer & Close]]
  5. [[Tax_Firm_Pipelines/Tax_Monitor_Setup/Circles/circle-5-29352-deal-phase-5-client-onboarding-and-setup|Phase 5: Client Onboarding & Setup]]
  6. [[Tax_Firm_Pipelines/Tax_Monitor_Setup/Circles/circle-6-29352-deal-phase-6-early-wins-and-results|Phase 6: Early Wins & Results]]
  7. [[Tax_Firm_Pipelines/Tax_Monitor_Setup/Circles/circle-7-29352-deal-phase-7-upsell-referral-and-testimonial|Phase 7: Upsell & Referral]]

### Tax Prep Setup (`Tax_Prep_Setup`)
- **Appointments**: Discovery, Demo, Onboarding, Offboarding support.
- **7-Phase Circles**: Phases 1 through 7 circle automations, ongoing support plans, and paid member invoice items.
- **Landing Pages**: [[Tax_Firm_Pipelines/Tax_Prep_Setup/Landings/landing-page-1|Tax Prep Landing Page]].

---

## 🎓 4. LMS Tax Curriculum (40 Lessons + Stacks)
*Complete client portal education curriculum for tax preparation & advisory.*

- [[LMS_Tax_Curriculum/lms-1-course|LMS Course Structure & Outline]]
- [[LMS_Tax_Curriculum/29355_Stacks_LMS_Course_CSS|Course Theme CSS Stack]] & [[LMS_Tax_Curriculum/29355_Stacks_LMS_Course_JS|Course JS Stack]]
- **Modules 1-10 (40 Lessons Total)**:
  - *Module 1*: Lessons 1.1 to 1.4
  - *Module 2*: Lessons 2.1 to 2.4
  - *Module 3*: Lessons 3.1 to 3.4
  - *Module 4*: Lessons 4.1 to 4.4
  - *Module 5*: Lessons 5.1 to 5.4
  - *Module 6*: Lessons 6.1 to 6.4
  - *Module 7*: Lessons 7.1 to 7.4
  - *Module 8*: Lessons 8.1 to 8.4
  - *Module 9*: Lessons 9.1 to 9.4
  - *Module 10*: Lessons 10.1 to 10.4

---

## 📑 5. IRS 433-A / 433-F PDF Form Automation Engine
*Direct programmatic bridge connecting SuiteDash CRM client intake JSON to IRS Collection Information Statements.*

- **Execution Engines**:
  - `fill-433a.mjs`: Form 433-A auto-filling engine for individual tax resolution.
  - `fill-433f.mjs`: Form 433-F auto-filling engine for simplified wage-earner resolution.
  - `run-form-gate.mjs` & `render-review.mjs`: Quality control gates, appearance verification, and visual proof rendering.
- **Field Maps & Standards**:
  - `433a.map.json` / `433f.map.json`: Field coordinate and name maps.
  - `irs-standards-2026.json`: Official 2026 IRS National and Local Standards for housing, food, transportation, and healthcare out-of-pocket limits.
- **Blank Form Templates**: `f433a.pdf`, `f433f.pdf`.
- **Sample Intake Records**: `433a.sample.json`, `433f.sample.json`.

---
*Generated: 2026-08-18 17:30:21 | Antigravity Knowledge Engine*

---

## 👥 6. VLP System Architecture & Role Hierarchy
*Definitive "Which Does What" mappings, role hierarchies, and generation guides.*

- [[VLP_System_and_Role_Hierarchy/SuiteDash_Generation_and_Hierarchy_Manual|SuiteDash Generation & Hierarchy Master Manual]]: Comprehensive guide on generating portals, pages, contacts, staff, and API brokering.
- [[VLP_System_and_Role_Hierarchy/Canonical_Roles_Hierarchy|Canonical Roles & Hierarchy]]: Principal Engineer, Execution Engineer, Bureau Operator, and Staff contracts.
- [[VLP_System_and_Role_Hierarchy/Canonical_App_Blueprint|Canonical App Blueprint]]: The 20 locked ecosystem design decisions.
- [[VLP_System_and_Role_Hierarchy/Canonical_API_Master_Registry|Canonical API Master Registry]]: All 408 Worker endpoints, including `/v1/taxprep/onboarding` and SuiteDash Secure API broker.
- [[VLP_System_and_Role_Hierarchy/TaxPrep_SuiteDash_Project_Instruction|TaxPrep OS Project Instruction]]: Complete service bureau delivery blueprint and training plan.
- [[VLP_System_and_Role_Hierarchy/SuiteDash_Reseller_Delivery_Model_Decision|SuiteDash Reseller Delivery Model]]: Path A (Managed SU1TE Reseller) vs Path B (Direct Client Account).
- [[VLP_System_and_Role_Hierarchy/SuiteDash_Reseller_Economics|SuiteDash Reseller Economics]]: Margin, setup fees ($5,000 floor), and recurring member pricing.

---

## ⚡ 7. Official SuiteDash Secure API (OpenAPI 3.0.3)
*Complete interactive endpoints reference, authentication parameters, and raw Swagger schema.*

- [[API_Specification/SuiteDash_OpenAPI_Specification_Reference|SuiteDash OpenAPI 3.0.3 Reference]]: Complete endpoint parameters, methods (`GET`, `POST`, `PUT`), request body schemas, and cURL examples.
- [[API_Specification/SuiteDash_OpenAPI_Swagger_v3.json|Raw SuiteDash Swagger JSON (v3.0.3)]]: Full OpenAPI JSON schema file for automated client SDK generation and Postman/Insomnia imports.
