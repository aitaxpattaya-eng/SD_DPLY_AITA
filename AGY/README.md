# SuiteDash CRM & Asana Migration Central Repository

> **Single Source of Truth** for AI Tax Advisers (AITA) SuiteDash Architecture, CRM Build-Out, Asana Data Migration, Automated Headless Provisioning Scripts, and Client Portal Prototypes.

---

## 📁 Repository Structure

```
SuiteDash_CRM_Central_Repository/
├── 01_Architecture_and_Canonicals/
│   ├── SuiteDash_Tax_Firm_Architecture.md        # Master architectural specification
│   ├── SuiteDash_Migration_Master.md             # End-to-end migration master blueprint
│   ├── SuiteDash_Migration_Architectural_Review.md # Deep-dive structural review & rationale
│   ├── SuiteDash_AI_Platform_Catalog.md          # Ecosystem catalog & tooling inventory
│   └── SuiteDash_Canonicals/                     # 00_Master_Index, API specs, M/C taxonomies, LMS
│
├── 02_Execution_Blueprints_and_Plans/
│   ├── Phase_1_Execution_Blueprint.md            # Detailed Phase 1 & 2 step-by-step build guide
│   ├── SuiteDash_AI_Execution_Plan.md            # Comprehensive phases 0-4 execution strategy
│   ├── 29355_Stacks_Pages_CSS.md                 # Production Stacks theme & CSS specifications
│   └── 29355_Stacks_Pages_JS.md                  # Stacks JavaScript automation specifications
│
├── 03_Asana_Migration_and_Raw_Data/
│   ├── Asana_to_SuiteDash_Migration.md           # Asana workspace-to-SuiteDash field mapping
│   ├── xasana_complete_export.json               # Full raw export from Asana (65.8 MB)
│   ├── asana_live_tasks.json                     # Live task state snapshot from Asana (2.8 MB)
│   └── suitedash_contacts_import_latest.csv      # Consolidated & verified 1,685 contacts CSV
│
├── 04_Automation_and_Verification_Scripts/
│   ├── run_full_validation_suite.mjs             # 32/32 automated end-to-end test suite
│   ├── mission_1a_all_custom_fields.mjs          # Custom fields provisioning script
│   ├── mission_1a_cf_categories.mjs              # Custom field categories creator
│   ├── mission_1a_circles.mjs                    # Permission circles creator
│   ├── mission_1a_default_fields.mjs             # Default field visibility configurator
│   ├── mission_1b_theme_css.mjs                  # Global platform branding CSS injector
│   ├── mission_1c_dashboard.mjs                  # Reception Operations dashboard builder
│   ├── mission_1d_followup_categories.mjs        # CRM follow-up dropdown creator
│   ├── mission_1d_update_form.mjs                # Client info update form generator
│   ├── mission_2_create_pipelines.mjs            # 3 core deal pipelines creator
│   ├── mission_2_apply_all_pipeline_stages.mjs   # 8-stage canonical stages applicator
│   ├── mission_3_direct_create_generators.mjs    # Project generators creator (1040, Thai, Corp)
│   ├── mission_4_complete_all_deal_generators.mjs# Deal generators creator
│   ├── fetch_sample_contacts.mjs                 # Secure REST API sample query tool
│   ├── session.mjs                               # Headless Playwright authenticated session builder
│   └── screenshots/                              # 32 automated verification audit screenshots
│
├── 05_Demo_and_Portal_Prototypes/
│   ├── DEMO_Folder_Live -> /home/hermes/Desktop/DEMO # Live offline prototype suite
│   ├── data_mapping_and_changes.json             # Data dictionary, SD fields & sanitization rules
│   └── suggested_improvements.json               # Roadmap for API sync, webhooks & e-sign flows
│
└── 06_Session_Notes_and_Audit_Logs/
    ├── INVENTORY_AND_DEPRECATION_GUIDE.md        # Comprehensive file audit & deprecation manifest
    └── MASTER_SESSION_NOTES_CONSOLIDATED.md      # Consolidated history of all build phases
```

---

## 🎯 Architecture Summary

* **Target White-Label Environment:** `https://secure.aitaxadvisers.com`
* **Core Model:** Hybrid Concurrent Architecture:
  1. **Visual Pipeline Tracking (CRM Deals):** High-level 8-stage Kanban monitoring (`Intake / Quotation` &rarr; `Filed / Completed`).
  2. **Granular Execution (Projects & Tasks):** Multi-year tax preparation, checklist proofs, and manager review.
  3. **Document Management (Filing Cabinet):** 5-tier segregated folder hierarchy (`01 Client Provided Docs` &rarr; `05 Final Filed Return`).

---

## 🛡️ Deprecation & Clean-Up Policy

All superfluous, fragmented, and duplicate files (e.g. `suitedash_contacts_FINAL_v4` through `v12` parts, loose root markdown duplicates, and scratch test scripts) are classified in [`06_Session_Notes_and_Audit_Logs/INVENTORY_AND_DEPRECATION_GUIDE.md`](file:///home/hermes/SuiteDash_CRM_Central_Repository/06_Session_Notes_and_Audit_Logs/INVENTORY_AND_DEPRECATION_GUIDE.md).
