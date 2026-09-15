---
title: SuiteDash Reseller Delivery Model (Path A vs Path B)
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [bkk-sync, delivery-model, obsidian-vault, office-sync, reseller, suitedash,
  synto-knowledge]
type: suitedash-hierarchy
---

# 2026-05-04 — Path A vs. Path B delivery model: Path B chosen as Virginia call pitch

**Decision (as of 2026-05-04):** Two delivery paths exist for getting a SuiteDash-based tax prep system into the hands of a bureau's members. Path A (Jamie as reseller of record, child accounts under his parent) was preferred but blocked at decision time because the SU1TE Dashboard was not enabled on the reactivated parent account. Path B (member purchases their own SuiteDash account, grants Jamie access for setup) was chosen as the active delivery model and Virginia call pitch.

**Status update 2026-05-05:** Path A was unblocked the evening of 2026-05-04 (~10:12 PM PT). The pitch-strategy implications of that activation are pending — see `2026-05-05-path-a-activation.md`. This file remains the authoritative record of the 2026-05-04 reasoning.

## Context

The original campaign plan assumed reseller status would be active by the time the Virginia call window opened. SuiteDash reactivated billing went through 2026-05-04 evening, but at the time of this decision, the SU1TE Dashboard (the interface for creating child accounts) was not yet visible in the parent account.

## The two paths

### Path A — Reseller-of-record

- Jamie creates child accounts for each of Virginia's members under his reseller status
- 24-hour SLA on provisioning
- Wholesale rate: $69/mo per child account
- Virginia's members never deal with SuiteDash directly
- Bureau pitch: "You sell the membership, I provision the system. Members never touch SuiteDash billing."

### Path B — Member-purchased account + access handoff

- Each of Virginia's members purchases their own SuiteDash Pinnacle account direct from SuiteDash ($99/mo, billed by SuiteDash to the member)
- Member grants Jamie (or VA) admin access
- Jamie applies the Tax Prep Setup template within 24 hours, branded as the bureau
- Jamie hands setup back to member with super-admin role intact
- Same end product as Path A from the member's perspective
- No wholesale margin (member pays SuiteDash retail direct)
- Bureau pitch: "Your member buys SuiteDash, gives my team access, we build out their tax prep system in 24 hours."

## Decision rationale (as of 2026-05-04)

Three reasons Path B was chosen for Virginia even though Path A would be ideal:

1. **Path A was a SuiteDash support-dependency at decision time.** Gating the most important conversation in the campaign on a third-party support ticket was unacceptable risk.

2. **Path B is honest about current state.** Pitching Path A's wholesale economics when the mechanic isn't actually live would be writing checks the infrastructure can't cash.

3. **Path A can be added later as an upgrade.** Once SuiteDash enables the SU1TE Dashboard, existing Path B members can stay on their direct accounts (no forced migration) or migrate to child accounts.

## What Virginia hears (Path B pitch)

> "Here's how this works. Your members purchase a SuiteDash Pinnacle account — that's their software, in their name, billed direct by SuiteDash. They give my team admin access. Within 24 hours, we install the full Tax Prep Setup template branded as Big Global Tax Bosses, plus the member training library. They never have to figure out SuiteDash on their own."

## Downstream impacts

- `docs/project-instruction.md` §3 (The product), Layer 1: should describe the Path B workflow. **Stale framing in source — to be revised in follow-up commit.**
- `docs/project-instruction.md` §6 (Virginia call), The offer segment: uses Path B language only.
- `docs/call-prep/` (forthcoming): Virginia call materials use Path B exclusively pending pitch-strategy decision.
- Module 1 framing: workflow demo of Path B (intake form → access grant → 24h setup), not Path A child-account mechanics.
- `docs/pricing/reseller-economics.md`: documents both paths' economics so the wholesale model is on the shelf when Path A activates.

## Alternatives considered

- **Delay Virginia call until Path A is live.** Rejected: Virginia's window is May 11+, calendar-driven by her vacation return.
- **Pitch both paths to Virginia and let her choose.** Rejected: adds complexity to the call, requires explaining a feature that doesn't exist yet, and risks confusing the offer.
- **Pitch Path A and use Path B as silent fallback if SuiteDash support is slow.** Rejected: dishonest. The delivery model is part of the offer.
