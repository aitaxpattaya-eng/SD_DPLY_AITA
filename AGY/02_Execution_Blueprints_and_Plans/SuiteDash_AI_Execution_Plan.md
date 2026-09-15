# Executive Summary: SuiteDash Build-Out & Browser Agent Execution Plan

**To the AI Assistant / Execution Engineer:**
You are tasked with building out a complex SuiteDash environment for a tax advisory firm ("AI Tax Advisers"). Because SuiteDash's API does not support programmatic configuration of system architecture (e.g., UI/UX styling, dynamic pages, pipelines, project templates), **the core of this build-out must be executed via a browser agent navigating the SuiteDash web UI.**

I am providing you with the **SuiteDash Canonicals**—the architectural blueprint for this environment, as well as selected SuiteDash platform documentation. Your mission is to analyze these canonicals, reconcile them against the current state of the environment, and develop a rigorous, step-by-step browser automation plan to configure the platform.

---

## 1. Strategic Phasing: "Reception First"
Our guiding philosophy is to **start simple and expand without foreclosing future expansion**. 
*   **Phase 1 Goal:** The immediate priority is making SuiteDash functional for the **Reception team**. This means prioritizing Appointments, Contact Management, Call Logging, and creating a highly aesthetic, easy-to-use custom Homepage/Dashboard specifically tailored for the Reception role.
*   **Future Phases:** Once Reception is operational, we will expand into the heavier tax-preparation pipelines (Deals & Projects) without needing to tear down the Phase 1 foundation.

## 2. Core Architecture (The "Hybrid Concurrent" Model)
While Phase 1 focuses on Reception, you must build with our overarching architectural paradigm in mind (detailed in `SuiteDash_Tax_Firm_Architecture.md`):
*   **Contacts & Companies (Static CRM):** Permanent biological/entity data (DOB, Spouse Name, Custom Fields). *This is Reception's primary domain.*
*   **Deals (Kanban Pipeline):** The visual tracker for the 8-stage client lifecycle (Information Gathering → Filed).
*   **Projects (Task Engine):** Triggered automatically when a Deal hits Stage 2 (Tax Preparation). Serves as the private workstation for tax preparers.
*   **Circles:** The core permission engine used to scope visibility and assign specific Dashboards (e.g., the Reception Dashboard) to the right staff.

## 3. The SuiteDash Canonicals vs. Existing State
You have been provided with canonical documents containing our target configurations (Module specs, UI/UX Stack-Triad, Firm Pipelines). **However, this is not a blank-slate environment.** 

You have the freedom to exercise intelligent judgment regarding what already exists in the system:
*   **Adapt:** If a configuration exists but differs slightly from the canonicals, update it to match.
*   **Reuse:** If it already exists and matches the canonicals, make use of it.
*   **Ignore:** If there is legacy data or configurations that do not interfere with our build, safely ignore them.

## 4. Your Mission: Developing the Execution Plan
Your immediate output should not be code or execution, but an **Execution Blueprint**. You must develop a sequential plan to instruct a browser agent to build the system. 

### Overarching Guidance for Your Plan:

**A. Phase 0: API Audit & Reconciliation**
Before sending a browser agent to blindly click through the UI, your plan must start with an audit. Write and execute quick API read scripts (where the SuiteDash API allows) to inventory the current state of the environment (e.g., existing Custom Fields, Circles, Tags). Reconcile this against the Canonicals to determine exactly what the browser agent actually needs to build, adapt, or skip.

**B. Dependency-Aware Sequencing (Reception-First Focus)**
After the audit, sequence the browser agent's tasks strictly:
1.  **Foundational Data:** Create/Update Custom Fields, Tags, and Circles (specifically Reception/Staff Circles).
2.  **UI/UX & The Reception Dashboard:** Inject the Custom CSS/JS Stacks and use the page builder to construct the aesthetic, easy-to-use Reception Homepage. Assign it via Circles.
3.  **Reception Workflows:** Configure Appointment scheduling, Contact Update Forms, and Call Logging mechanisms.
4.  **Future Expansion Foundation:** Map out the Deal Pipeline stages and Project Templates for future phases.

**C. Browser Navigation Strategy**
For each step in your plan, outline the exact UI traversal required by the browser agent (e.g., `Navigate to [Left Menu] > CRM > Settings > Custom Fields > Click [+ Add Custom Field]`). Anticipate pop-up modals, multi-tab settings screens, and strict form validations. Refer to the provided `SuiteDash/` help documents if you are unsure of the navigation paths.

**D. Chunked "Missions"**
Browser agents fail when given instructions that are too broad. Break the build-out into **discrete, verifiable missions** (e.g., "Mission 1: Audit & Reconcile Custom Fields", "Mission 2: Style and Publish the Reception Dashboard"). Include a validation step at the end of each mission before moving on to the next.

## 5. Strict API and Tooling Constraints
Many of the canonical documents and CSS/JS stacks provided contain legacy references to ClickUp, external integrations, or unsupported APIs. **You must strictly ignore these references.**
*   We ONLY have access to the **SuiteDash API** (for basic CRM operations, governed by the Phase 0 audit).
*   We ONLY have access to the **Asana API** (which will eventually be used to import legacy data, but is not needed for the core SuiteDash UI build).
*   We ONLY have access to the **Browser Agent** for SuiteDash (to manually click and configure the UI).
*   **DO NOT** attempt to integrate ClickUp. **DO NOT** attempt to write scripts for Zapier, Make.com, or any other third-party API. All configuration must be done either via the SuiteDash UI (Browser Agent) or the narrow SuiteDash CRM API.

---

**Next Steps for You (The LLM):**
1. Acknowledge receipt of this summary, the "Reception First" strategy, and your mandate to audit existing state.
2. Ingest the SuiteDash Canonicals and Help Docs provided.
3. Output a structured, sequential Execution Plan based on the guidelines above, starting with Phase 0 API Auditing.
