# SuiteDash Migration Master State
*Last Updated: 2026-08-21*

## 1. The "Hybrid Concurrent" Architecture
The firm uses a **Hybrid Concurrent Model** that separates the human from the task engine.
*   **Deals (Kanban Board):** The visual tracker for the *entire* 8-Stage lifecycle (from Stage 1: Information Gathering to Stage 8: Filed). Deals do not hold tasks; they are just the visual pipeline.
*   **Projects (Task Engine):** When a Deal hits Stage 2 (Tax Preparation), a Deal Automation triggers a Project Template. The Project serves as the "Filing Cabinet" and private workstation where the preparer completes tasks (2848, compliance, reports).
*   **Contacts (Static CRM):** Holds permanent biological data (Spouse Name, DOB, Historical Tax Years). Transactional data (Current Tax Year) lives on the Deal.

## 2. API Import Success (The V13 Script)
The massive CSV import failed in the SuiteDash web UI because of rigid Date constraints (SuiteDash strictly expects `YYYY-MM-DD`). 
*   **Solution:** We built an automated Python script (`api_importer.py`) that bypassed the UI entirely.
*   **Result:** Successfully ran `POST /secure-api/contact` and created **1,669 valid CRM contacts**.
*   **Notes Push:** The script also ran `PUT /contact/{email}` to inject all legacy Asana descriptions and 8,000+ Asana comment stories directly into the SuiteDash Notes timeline for every client.
*   **Companies:** 12 business entities were filtered into `v13_Companies_Only.csv` to be imported manually via the SuiteDash Company Importer.

## 3. Custom UI / UX Styling (The Blueprint)
Sourced from the custom Next.js `vlp-platform-main` repository, here is how the firm styles SuiteDash:
*   **The Stack-Triad:** Custom CSS for Portal Pages is organized into 3 Stacks (Container, CSS, JS). The CSS stack (e.g., `AITAX_Stacks_Pages_CSS`) is where global styling rules go.
*   **Form-Card Pattern:** Forms are wrapped in `<div class="aitax-form-card">` structures to replicate the custom Next.js aesthetic.
*   **Admin Dashboard Styling:** Native widgets (like `.reporting__block`) are overridden using the SuiteDash Theme CSS slot to add shadows, border-radii, and cohesive typography. *Rule: Never use CSS to change the layout (which widget goes where). Use the native SuiteDash CMS drag-and-drop editor for layout.*
