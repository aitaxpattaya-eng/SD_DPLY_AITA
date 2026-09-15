---
title: SuiteDash Architecture & Naming Conventions for Tax Firm
source: local:root_suite_dash_arch
tags: [architecture, crm, migration, suitedash, tax-practice]
type: suitedash-architecture
---

<!--
Status: Authoritative
Scope: SuiteDash Internal CRM Setup
Purpose: To define the taxonomy, structure, and naming conventions for mapping the firm's Asana workflows into SuiteDash primitives. This document serves as the prompt/guide for LLM assistants building out the SuiteDash UI.
-->

# SuiteDash Tax Firm Architecture

## 1. Core Entity Mapping (Asana vs. SuiteDash)

When translating our processes from Asana into SuiteDash, we must strictly adhere to how SuiteDash handles entities. We utilize a **Hybrid Concurrent Model**, leveraging Deal Pipelines for high-level Kanban visualization (like Asana) and Projects for granular task and file management.

| Asana Primitive | SuiteDash Primitive | Tax Firm Usage |
| :--- | :--- | :--- |
| Project (used for clients) | **Company / Contact (CRM)** | The Taxpayer Entity (Individual, Corp) containing static biographical data. |
| Board / High-level view | **Deal Pipeline** | The visual Kanban board tracking active tax returns through 8 stages. |
| Workflow / Files | **Project** | Concurrently generated "Filing Cabinet" containing staff task lists and folders. |
| Tasks / Subtasks | **Project Tasks** | Action items assigned to specific staff (e.g., QA Review). |
| Custom Fields | **CRM & Target Fields** | CRM fields for static data; Target Custom Fields for Deal/Project transient data. |
| Task Comments | **Contact Notes** | Historical workflow audit trails (prepended with Author/Date). |

> [!IMPORTANT]
> This SuiteDash instance is **strictly internal (not customer-facing)**. We will not utilize Client Portals for communication, but we will use Circles to permission finalized files for a future portal rollout.

---

## 2. Naming Conventions & Placeholders

Standardized naming ensures clean data, easy searchability, and allows automation.

### 2.1 Deals & Projects
Format: `[TaxYear] - [Return Type] - [clientFullName]`
*   *Example:* `2024 - US 1040 - Doe, John`
*   *Example:* `2024 - 1120S - Acme Corp`

### 2.2 Automation Placeholders Used
When automating Deal/Project generation, use the following:
*   **Target Data:** `[TaxYear]`, `[Referral]`, `[Streamline]`, `[DropboxURL]`
*   **Contact Data:** `[clientFullName]`, `[SpouseFullName]`, `[TaxFilingStatus]`
*   **Staff Assignment:** `[salespersonFullName]` (Maps to Intake Coordinator / Preparer)

---

## 3. Workflow Pipelines & Kanban Stages

The core visual tracker for the firm is the Deal Pipeline. We have three main pipelines:
1. `US Tax Returns (1040)`
2. `Thai Tax Returns`
3. `Corporate / Entity Returns`

All pipelines share these 8 standardized stages (Kanban Columns):
1. **Intake / Quotation**
2. **Information Gathering** (Awaiting Documents)
3. **Processing Return** (Preparation)
4. **Chetan Review** (Manager QA Review)
5. **Client Review**
6. **Awaiting Payment**
7. **Filed / Completed** (WON)
8. **Not Proceeding** (LOST)

---

## 4. Master Automation Workflow

To eliminate manual data entry, we heavily utilize SuiteDash's No-Code Automations triggered by stage changes in the Deal Pipeline.

### Stage 1: Intake / Quotation
*   **Trigger:** Manual application of a Deal Generator (e.g., `2024 US 1040 Gen`) at the start of the year.
*   **Action:** Creates the Deal. Populates Target Custom Fields: `[TaxYear]` and `[DropboxURL]`.

### Stage 2: Information Gathering
*   **Trigger:** Deal moved to Stage 2.
*   **Action 1 (Project):** Apply **Project Generator** to spin up the concurrent Filing Cabinet (creates Task templates for staff).
*   **Action 2 (Files):** Apply **Folder Generator** to establish the `[TaxYear] Tax Docs` folder hierarchy.
*   **Action 3 (Client Comms):** Email External(s) sending the Tax Organizer/Information request.

### Stage 3: Processing Return
*   **Trigger:** Deal moved to Stage 3.
*   **Action 1 (Staffing):** Assign `[salespersonFullName]` as the active Preparer.
*   **Action 2 (Notification):** Email Internal(s) notifying the Preparer that documents are ready for processing.

### Stage 4: Chetan Review
*   **Trigger:** Deal moved to Stage 4.
*   **Action:** Email Internal(s) notifying Chetan/Manager that the draft return is uploaded in the Project.

### Stage 7: Filed / Completed
*   **Trigger:** Deal moved to Stage 7 (Marked as WON).
*   **Action 1 (Security):** Add Contact to Circle (e.g., `[TaxYear] 1040 Completed`). This ensures they can access final PDFs in a future client portal.
*   **Action 2 (CRM):** Set Contact Custom Field "Last Return Filed" to `[TaxYear]`.
*   **Action 3 (Cleanup):** Archive the concurrent Project.
