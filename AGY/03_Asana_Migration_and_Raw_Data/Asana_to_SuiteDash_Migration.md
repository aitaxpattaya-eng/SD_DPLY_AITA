---
title: Asana to SuiteDash Migration & Architecture
source: local:synto-knowledge
tags: [architecture, asana, cray, crm, migration, suitedash, synto-knowledge, tax-practice]
sources: ['Cray:C:/Users/Cray/Desktop/ASANA_EXTRACT/asana_complete_export.json.json']
confidence: high
status: active
created: 2026-08-19
updated: 2026-08-19
---

# Asana to SuiteDash Migration & Architecture

## Overview
AI Tax Advisers (`aitaxadvisers.com`) migration from Asana Free Tier to SuiteDash CRM and Operations.

## Source Data (`ASANA_EXTRACT` on Cray)
- **Host:** Cray (`100.97.104.18` via Tailscale, SSH user `Cray`).
- **Path:** `C:\Users\Cray\Desktop\ASANA_EXTRACT\`.
- **Dataset:** 4,398 tasks across 19 projects, 20,000+ comment stories, parsed into **2,055 unique client entities**.
- **Data Characteristics:** Due to Asana free-tier restrictions, client metadata was embedded in task titles (`LastName, FirstName (Location/Notes/Referral) email phone`), task descriptions, fee quotes (`$1600 no VAT`), and project sections (11 pipeline stages).

## Phased Migration Strategy
1. **Phase 1 (Current - Immediate Focus):**
   - **Scope:** Internal CRM Contacts & Companies only (non-customer facing).
   - **Goal:** Avoid staff overwhelm while establishing a single, deduplicated source of truth for all 2,055 clients.
   - **Data File:** `suitedash_contacts_import.csv` (47 columns matching `SampleExport.xlsx`).
   - **Rules:** `ID` and `UID` left blank (SuiteDash generates them on import).
   - **Comprehensive Work History:** Complete multi-year engagement history, stages, fee quotes, notes, and activity comments consolidated into `Background Info`.

2. **Phase 2 (Future Scope):**
   - **Deals Module (Commercial - Stages 1–5):** `Lead` -> `Quotation` -> `Engagement Letter` -> `Deposit Invoice`.
   - **Projects Engine (Fulfillment - Stages 6–11):** `Awaiting Docs` -> `Preparation` -> `Senior QA Review` -> `Client Draft / Form 8879` -> `Final Invoice` -> `E-Filing`.
   - **Automation:** Deals marked `WON` automatically trigger SuiteDash Project Generators (templates for 1040, Thai Tax, TIN, Streamlined).

## Files & Artifacts
- **Master Plan:** `C:\Users\Cray\Desktop\ASANA_EXTRACT\SUITEDASH_MIGRATION_MASTER_PLAN.md`
- **Generated Import CSV:** `C:\Users\Cray\Desktop\ASANA_EXTRACT\suitedash_contacts_import.csv` (and `/home/hermes/suitedash_contacts_import.csv`)
- **Generator Script:** `C:\Users\Cray\Desktop\ASANA_EXTRACT\generate_suitedash_csv.py`
- **Sample Export Schema:** `C:\Users\Cray\Desktop\ASANA_EXTRACT\SampleExport.xlsx`
