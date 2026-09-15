---
title: SuiteDash Reseller & Member Economics
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [bkk-sync, economics, obsidian-vault, office-sync, pricing, suitedash, synto-knowledge]
type: suitedash-hierarchy
---

# Pricing & delivery economics — Tax Prep Pro

> **Status:** Authoritative as of 2026-05-05
> **Owner:** JLW (Principal Engineer review required for changes)

---

## Tax Prep Pro pricing

| Tier | Includes | Setup | Recurring (per active member) |
|---|---|---|---|
| Tax Prep Pro — Managed | Full 8-phase SuiteDash buildout + member training library + 30-day support + child-account provisioning under Jamie's reseller | $5,000 | $79/mo to Jamie per active member |
| Tax Monitor Pro | Sister product (separate repo: `taxmonitor.pro`) | $5,000 | (separate, see that repo) |
| **Tax Prep Pro + Tax Monitor Pro bundle** | Both products, integrated | **$8,500** | $79/mo to Jamie per active member |
| Ongoing support (after 30-day window) | Retainer or hourly | — | $497/mo or $150/hr |

The bundle saves $1,500 vs. buying both separately.

---

## Delivery model — Managed only

Tax Prep Pro is delivered exclusively via the **Managed** model. Per `docs/decisions/2026-05-05-pitch-strategy-locked-managed.md`, the previously-considered Direct (Path B) option is no longer offered.

### Mechanic

Jamie holds approved SuiteDash reseller status on `virtuallaunch.pro`, with one retail Pinnacle license at $99/mo as the parent account (the SU1TE Dashboard). Each bureau member's portal is provisioned as a child account under Jamie's reseller status, billed at $69/mo wholesale to Jamie.

The bureau pays Jamie a one-time setup fee plus $79/mo per active child account. The bureau owns the member relationship and bills its members directly at whatever price the bureau sets (typically $99/mo to match SuiteDash retail, though the bureau can mark up or discount as it chooses).

### Account architecture

| Account type | Rate | Who pays whom |
|---|---|---|
| Reseller parent (Pinnacle) | $99/mo | Jamie pays SuiteDash |
| Member child account (Pinnacle) | $69/mo | Jamie pays SuiteDash (wholesale) |
| Bureau wholesale fee | $79/mo per active member | Bureau pays Jamie |
| Member retail | Bureau's choice (typically $99/mo) | Member pays bureau |

### Margin breakdown

Per active member account:

- Member pays bureau: $99/mo (typical retail)
- Bureau pays Jamie: $79/mo
- Jamie pays SuiteDash: $69/mo
- **Bureau keeps:** $20/mo recurring per active member
- **Jamie keeps:** $10/mo recurring per active member

At 50 active members across one bureau:
- Bureau gross recurring: $1,000/mo
- Jamie gross recurring: $500/mo (from this bureau)

### Provisioning workflow

Per `docs/decisions/2026-05-04-reseller-of-record-clarification.md`:

1. Bureau member signs up via bureau-branded intake form on the bureau's dashboard
2. Form submission lands as a task in Jamie's SuiteDash task queue
3. Jamie (or VA) creates child account in SU1TE Dashboard, applies the bureau's branded Tax Prep Setup template, hands off super-admin role to the new member
4. 24-hour SLA from form submission to member receiving portal access email

The existing ClickUp task `00317-TASK [11] Invite Super Admin User` documents the operational workflow.

---

## Why Managed-only (not tiered)

See `docs/decisions/2026-05-05-pitch-strategy-locked-managed.md` for full rationale. Summary:

1. Managed is the only model that captures recurring revenue proportional to bureau success
2. Managed substantiates the "Software Reseller Options Available" line on Virginia's existing flyer
3. A single delivery model means a single operational workflow — simpler to document, train, and scale

A future Direct (Path B) tier may be added if a specific bureau prospect explicitly requires it. None do today.

---

## Historical context: Path B (no longer offered)

Path B was the model where each member purchases their own SuiteDash account directly and grants Jamie admin access for setup. It was chosen as the Virginia call pitch on 2026-05-04 because Path A was blocked by SuiteDash support at the time. Path A activated 2026-05-04 evening (see `docs/decisions/2026-05-05-path-a-activation.md`), and Managed-only was locked 2026-05-05.

This documentation is preserved for two reasons:

1. Audit trail of the decision evolution
2. Reference if a future prospect requests Direct delivery

The historical Path B mechanic, for reference: member pays SuiteDash $99/mo retail direct; member grants Jamie admin access; Jamie applies template; no recurring margin for Jamie or bureau on the SuiteDash subscription itself.

---

## Notes for future-self

- The $69/mo wholesale rate, $79/mo bureau wholesale fee, and $99/mo retail rate are current as of 2026-05-05. SuiteDash could change wholesale or retail; the bureau wholesale fee ($79/mo) is Jamie's pricing decision and can be revisited.
- The reseller status is held on `virtuallaunch.pro` (transferred from `lentax.co`).
- A future decision file would be required to add a Direct tier. Until then, Tax Prep Pro is Managed-only.
