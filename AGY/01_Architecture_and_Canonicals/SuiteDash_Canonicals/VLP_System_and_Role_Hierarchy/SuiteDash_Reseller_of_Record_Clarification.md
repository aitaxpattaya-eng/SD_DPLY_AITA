---
title: SuiteDash Reseller of Record Architecture
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [bkk-sync, obsidian-vault, office-sync, reseller, suitedash, synto-knowledge]
type: suitedash-hierarchy
---

# 2026-05-04 — Reseller of record: Jamie holds reseller status; bureaus do not need their own

**Decision:** Jamie is the SuiteDash reseller of record (status held on `virtuallaunch.pro`, transferred from `lentax.co`). Bureau operators (Virginia and future muse customers) do not apply for reseller status, do not maintain a $99/mo Pinnacle license, and do not operate the SU1TE Dashboard.

## Context

Earlier framing of the offer assumed each bureau operator would become a SuiteDash reseller themselves — apply for the program, sign the partner agreement, maintain a $99/mo Pinnacle license, and operate the child-account creation workflow. This added significant operational complexity to what should be a non-technical operator's experience.

Realization 2026-05-04 mid-day: Jamie already holds approved reseller status (transferred to `virtuallaunch.pro`). There is no operational reason to require the bureau to also be a reseller. The bureau's job is to sell memberships and own the member relationship; Jamie's job is to provision the infrastructure.

## Decision rationale

**For the bureau operator (Virginia and future):**
- No SuiteDash reseller application
- No $99/mo Pinnacle license to maintain
- No SU1TE Dashboard to learn or operate
- No child-account creation workflow to run

**For Jamie:**
- One reseller account (`virtuallaunch.pro` parent) hosts all bureaus' members as child accounts
- Provisioning workflow: bureau-branded intake form → form submission lands as task in Jamie's SuiteDash → Jamie (or VA) creates child account, applies template, hands off super-admin → 24-hour SLA to bureau operator
- Existing ClickUp task `00317-TASK [11] Invite Super Admin User` is the documented workflow

**For the bureau's members:**
- Same end experience: a fully provisioned tax prep system in a portal branded as the bureau
- Super-admin role handed to the member, allowing them to add their own staff, etc.

## Downstream impacts

- `docs/project-instruction.md` §3 (The product), Layer 1: rewrite to "provisioning workflow + child account spun up under Jamie's reseller status, 24-hour SLA, branded as the bureau." **Stale framing in source — to be revised in follow-up commit reflecting Tax Prep Pro repositioning.**
- `docs/project-instruction.md` §5 (Virginia), Strategic stakes: add "Virginia does not need to apply for SuiteDash reseller status."
- `docs/project-instruction.md` §6 (Virginia call), The offer segment: simplified pitch — "You sell the membership, I provision the system."
- Tax Prep Setup template replication: parent currently has Tax Monitor Setup as a template; Tax Prep Setup lives only in Virginia's account. Replication into parent required before bureau #2.

## Alternatives considered

- **Each bureau is its own reseller.** Rejected: adds operational complexity, $99/mo overhead per bureau, and a SuiteDash-partner-program learning curve to a non-technical operator's experience.
- **Hybrid — bureau is reseller for "scale" tier, Jamie is reseller for "starter" tier.** Rejected for now: premature complexity. Revisit if a future bureau wants white-label reseller status under their own domain.
