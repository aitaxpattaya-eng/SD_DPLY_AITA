---
title: TaxPrep SuiteDash Platform Overview
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [bkk-sync, obsidian-vault, office-sync, suitedash, synto-knowledge, taxprep]
type: suitedash-hierarchy
---

# taxprep.pro

**Tax Prep Pro** — a SuiteDash-based productized buildout of the 8-phase tax prep client journey, with member training built in.

> Owner: JLW (Jamie L Williams, Virtual Launch Pro)
> Initialized: 2026-05-05
> Status: v1 — pre-launch, pre-Virginia call
> Sister product: [Tax Monitor Pro](https://github.com/JLW-Dev-Coder/taxmonitor.pro) (IRS transcript monitoring, Worker-based)

---

## What this repo contains

Documentation, decision logs, call prep materials, pricing references, and (forthcoming) module scripts and production assets for **Tax Prep Pro**. The audience is service bureaus and credentialed tax practitioners. The first paying-customer target is Virginia Hall (The Big Global Tax Bosses Service Bureau).

This is **not** a code repo. The Tax Prep Pro product is a SuiteDash deployment, not application code; this repo holds the operational artifacts of selling and delivering it.

## Product overview

**Tax Prep Pro** is a complete 8-phase tax prep client journey delivered as a configured SuiteDash deployment:

1. Identify Taxpayer Type
2. Intake Form
3. Engagement & Payment
4. Document Collection
5. Preparation & Review
6. E-Sign & E-File
7. Delivery
8. Offboarding & Review Request

Each deployment ships with member-facing training (avatar-narrated walkthroughs of all 8 phases plus admin onboarding), branded portal pages, custom CSS theming, and a 30-day setup support window.

## Pricing

| Tier | Includes | Price |
|---|---|---|
| Tax Prep Pro — Managed | Full 8-phase SuiteDash buildout + member training library + 30-day support + child-account provisioning under Jamie's reseller | $5,000 setup + $79/mo per active member |
| Tax Monitor Pro | Sister product (separate repo: [taxmonitor.pro](https://github.com/JLW-Dev-Coder/taxmonitor.pro)) | $5,000 |
| **Tax Prep Pro + Tax Monitor Pro bundle** | Both products, integrated | **$8,500** |
| Ongoing support (after 30-day window) | Retainer or hourly | $497/mo or $150/hr |

## Directory structure

    taxprep.pro/
    ├── README.md
    ├── .gitignore
    ├── .claude/
    │   └── CLAUDE.md                   ← RC default behavior rules
    └── docs/
        ├── project-instruction.md      ← campaign brief (stale framing — see note)
        ├── production-plan.md          ← module production schedule (stale framing — see note)
        ├── ROLES.md                    ← Principal / Execution Engineer split
        ├── canonical-rc-prompt.md      ← prompt format spec
        ├── decisions/                  ← dated decision-log entries
        ├── pricing/                    ← pricing references
        ├── call-prep/                  ← Virginia call materials (forthcoming)
        └── production/                 ← module scripts (forthcoming)

## How decisions are recorded

Strategic decisions are logged as dated individual files in `docs/decisions/` using the convention `YYYY-MM-DD-short-decision-slug.md`. Files are immutable — superseding decisions reference the prior file explicitly.

## How RC prompts work

Principal Engineer (Chat Claude) authors prompts following `docs/canonical-rc-prompt.md`. Execution Engineer (Claude Code / RC) executes and reports back. Default RC behavior is documented in `.claude/CLAUDE.md`. See `docs/ROLES.md` for the role split.

## Note on stale framing in source documents

The copied `docs/project-instruction.md` and `docs/production-plan.md` were authored 2026-05-04 under earlier framing ("Service Bureau OS for Tax Pros") that was repositioned 2026-05-05 to **Tax Prep Pro** as the lead product. The source documents will be rewritten in a follow-up commit; decision files in `docs/decisions/` document the corrected framing in the meantime.

Specifically stale: project-instruction.md §3 (Layer 1/2/3 structure), §6 (Virginia call), §8 (production plan summary); production-plan.md §1, §9.

## Current state (2026-05-05)

- Parent SuiteDash account: active on `virtuallaunch.pro` (Pinnacle, $99/mo)
- **Reseller status: ACTIVE** as of 2026-05-04 ~10:12 PM PT
- Templates in parent: Tax Monitor Setup (existing); Tax Prep Setup (pending replication from Virginia's account before bureau #2)
- **Delivery model: Tax Prep Pro — Managed (locked)** — single tier, Path A child-account provisioning under Jamie's reseller, $79/mo per active member to bureau. See `docs/decisions/2026-05-05-pitch-strategy-locked-managed.md`.
- Virginia call window: opens 2026-05-11
- Module 2 (8-phase Tax Prep walkthrough): in production, target completion 2026-05-10
- Module 1 (member onboarding workflow): produced post-deposit

## What this repo is NOT

- Not application code — Tax Prep Pro is a SuiteDash deployment
- Not the marketing site — `virtuallaunch.pro` (TBD) is the public face
- Not the home for Virginia's actual SuiteDash content (lives in SuiteDash)
- Not the Tax Monitor Pro repo (that's [taxmonitor.pro](https://github.com/JLW-Dev-Coder/taxmonitor.pro))
