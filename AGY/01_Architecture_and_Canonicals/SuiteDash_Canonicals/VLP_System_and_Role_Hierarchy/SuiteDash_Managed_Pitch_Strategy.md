---
title: SuiteDash Managed Service Bureau Pitch Strategy
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [bkk-sync, managed-service, obsidian-vault, office-sync, suitedash, synto-knowledge]
type: suitedash-hierarchy
---

# 2026-05-05 — Pitch strategy locked: Tax Prep Pro is Managed-only (Path A, A3 pricing)

**Decision:** The Tax Prep Pro offer is a single tier: **Managed**. All bureau members are provisioned as child accounts under Jamie's SuiteDash reseller status (Path A). The wholesale-markup pricing model A3 is locked: bureau pays Jamie $79/mo per active child account; bureau retails to its members at any price the bureau chooses (typically $99/mo to match SuiteDash retail). Path B (member-purchased account) is no longer offered.

This file closes the open question from `2026-05-05-path-a-activation.md`.

## Context

Path A activated 2026-05-04 evening. Three delivery options were on the table for the Virginia call: Path A only, Path B only, or a tiered offering with both. Owner chose Managed-only (Path A only) on 2026-05-05.

## What this means in practice

**For the bureau (Virginia and future operators):**
- Bureau pays Jamie a one-time setup fee ($5,000 Tax Prep Pro, $8,500 bundle with Tax Monitor Pro)
- Bureau pays Jamie $79/mo per active child account (member subscription)
- Bureau retails member access at whatever price the bureau chooses
- Bureau owns the member relationship and the bureau-to-member billing
- Bureau does NOT apply for SuiteDash reseller status, does NOT operate the SU1TE Dashboard, does NOT touch SuiteDash partner-program plumbing

**For Jamie:**
- One-time setup revenue per bureau ($5,000 / $8,500)
- $79/mo recurring per active child account across all bureaus (revenue)
- $69/mo recurring per active child account paid to SuiteDash (cost)
- Net: $10/mo recurring margin per active member, scaling with all bureaus' member counts combined
- Operational responsibility: provisioning child accounts within 24h of bureau intake-form submission, applying templates, handing off super-admin role

**For the bureau's members:**
- Receive a fully provisioned tax prep system in a portal branded as the bureau
- Super-admin role on their own child account
- Pay the bureau (not SuiteDash directly, not Jamie directly) for access
- Same end-product experience regardless of internal billing architecture

## Decision rationale

Three reasons Managed-only beats the alternatives:

1. **Recurring revenue alignment.** Managed-only is the only option where Jamie captures recurring margin proportional to bureau success. Path B left all recurring on the table; tiered would have introduced choice complexity into the bureau pitch without materially improving conversion.

2. **Brand consistency with Virginia's flyer.** Virginia's existing marketing says "Software Reseller Options Available." Managed delivers exactly that — her bureau IS a software-reseller benefit, and the wholesale economics are the substance behind the line. Path B would have left her flyer copy unsubstantiated.

3. **Operational simplicity.** A single delivery model means one workflow to document, one onboarding process to train VAs on, one set of materials to maintain. Tiered offerings would have required dual workflows for the foreseeable future.

## What's NOT included in this decision

- Whether to add a Direct (Path B) tier later for bureaus that explicitly request billing simplicity. Open. Revisit if a future bureau prospect declines Managed for billing-architecture reasons.
- The exact retail price the bureau charges its members. That's the bureau's call, not Jamie's. Jamie's price to the bureau is locked at $79/mo per active child.
- How existing Path B prospects (none currently) would be handled. Moot — there are no Path B prospects.

## Downstream impacts

- `docs/pricing/reseller-economics.md`: rewritten in this commit — Path A locked at A3 ($79/mo to bureau), Path B removed from "available offers" but retained as historical context.
- `README.md` "Current state": updated to reflect locked decision.
- `docs/call-prep/README.md`: "pitch strategy pending" caveat removed.
- `docs/production/README.md`: Module 1 framing updated to reflect Managed workflow (intake form → Jamie's task queue → 24h provisioning).
- `docs/project-instruction.md` §3, §6, §8: still stale, will be rewritten in a follow-up commit reflecting Tax Prep Pro + Managed framing.
- `docs/production-plan.md` §1, §9: still stale, follow-up commit.

## Alternatives considered (and rejected)

- **Path B only.** Rejected: leaves all recurring revenue on the table. Setup-fee-only business doesn't scale well.
- **Tiered (Direct + Managed).** Rejected: adds choice complexity to bureau pitch without compensating revenue benefit. Most bureaus would pick the same tier anyway; tiering optimizes for an edge case.
- **Path A with A1 pricing (bureau keeps 100% recurring).** Rejected: zero recurring margin for Jamie. Worst unit economics.
- **Path A with A2 pricing (pass-through at $69).** Rejected: same outcome as A1 from Jamie's perspective, but with extra invoicing complexity for net-zero revenue.

## What Virginia hears (Managed pitch)

> "Here's how Tax Prep Pro works. You sell bureau memberships to your tax-pro members. When a member signs up, you send their info through a form on your bureau dashboard. Within 24 hours, my team provisions a fully branded tax prep system in their own portal — branded as Big Global Tax Bosses, with the 8-phase journey we built for you, and the member training library. They never have to figure out SuiteDash on their own. You bill them through your bureau at whatever price you set; you pay me $79/month per active member. SuiteDash retail for the same product is $99/month, so you have $20/month per member of margin to play with — keep it as bureau revenue, or pass some through as a member discount, your call."
