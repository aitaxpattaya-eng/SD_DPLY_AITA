# Original Locations Index & Migration Log

> **Created Date:** September 15, 2026  
> **Purpose:** Detailed manifest mapping every moved SuiteDash and Asana CRM file from its original filepath to its new central home in `SuiteDash_CRM_Central_Repository`.

---

## Master File Movement Manifest

| Original Absolute Path | New Destination in Central Repository | Category / Purpose |
| :--- | :--- | :--- |
| `/home/hermes/xasana_complete_export.json.json` | `03_Asana_Migration_and_Raw_Data/xasana_complete_export.json` | Full Raw Asana Workspace Export (65.8 MB) |
| `/home/hermes/asana_live_tasks.json` | `03_Asana_Migration_and_Raw_Data/asana_live_tasks.json` | Live Asana Task Snapshot (2.8 MB) |
| `/home/hermes/asana_stories.json` | `03_Asana_Migration_and_Raw_Data/asana_stories.json` | Asana Comments & Activity Feed Export (6.3 MB) |
| `/home/hermes/asana_mcp_client.py` | `03_Asana_Migration_and_Raw_Data/asana_mcp_client.py` | Asana MCP Python Client Utility |
| `/home/hermes/suitedash_api_payloads_master.json` | `03_Asana_Migration_and_Raw_Data/suitedash_api_payloads_master.json` | Master REST API Payloads (6.4 MB) |
| `/home/hermes/suitedash_contacts_master.csv` | `03_Asana_Migration_and_Raw_Data/suitedash_contacts_master.csv` | Master Processed Contacts List (717 KB) |
| `/home/hermes/suitedash_crm_blueprint.json` | `02_Execution_Blueprints_and_Plans/suitedash_crm_blueprint.json` | CRM JSON Blueprint Specification (26.9 KB) |
| `/home/hermes/suitedash_staff_roles.json` | `02_Execution_Blueprints_and_Plans/suitedash_staff_roles.json` | Staff Roles & Permission JSON Schema (18.5 KB) |
| `/home/hermes/SuiteDash_Tax_Firm_Architecture.md` | `01_Architecture_and_Canonicals/SuiteDash_Tax_Firm_Architecture.md` | Master Architectural Blueprint |
| `/home/hermes/SuiteDash_Migration_Architectural_Review.md` | `01_Architecture_and_Canonicals/SuiteDash_Migration_Architectural_Review.md` | Deep Structural Architecture Review |
| `/home/hermes/SuiteDash_AI_Execution_Plan.md` | `02_Execution_Blueprints_and_Plans/SuiteDash_AI_Execution_Plan.md` | 5-Phase Execution Plan |
| `/home/hermes/suitedash_automation/*` | `04_Automation_and_Verification_Scripts/` | Headless Playwright automation harness & scripts |
| `/home/hermes/knowledge_vault/raw_exports/deprecated_suitedash/*` | `03_Asana_Migration_and_Raw_Data/deprecated_csv_exports/` | 20 Legacy incremental CSV test import slices (v4–v12) |
| `/home/hermes/TEMP/SuiteDashInfo/` | `01_Architecture_and_Canonicals/legacy_temp_extractions/SuiteDashInfo/` | Legacy Extraction Temp Folder |
| `/home/hermes/TEMP/AI_Platform/` | `01_Architecture_and_Canonicals/legacy_temp_extractions/AI_Platform/` | Legacy Platform Scratch Extractions |

---

## Files Intentionally NOT Moved (Preserved in Place)

1. **Independent Documentation Hubs:**
   * `/home/hermes/suitedash_docs/` &rarr; Created independently for help center scraping and documentation indexing.
2. **Independent Portal/Branding Repositories:**
   * `/home/hermes/suitedash_repos/` &rarr; Contains separate Git repos (e.g., `canonicals-clickup-suitedash`, `lentax-styles`, `TaxIOS-full-branding`, `taxclaim.virtuallaunch.pro`).
3. **Obsidian Knowledge Base Notes:**
   * `/home/hermes/knowledge_vault/wiki/Library/` &rarr; Preserved for Obsidian live linking.
4. **Offline Demo Suites:**
   * `/home/hermes/Desktop/DEMO/` &rarr; Preserved as live preview directory (accessible via symlink in Central Repo).
