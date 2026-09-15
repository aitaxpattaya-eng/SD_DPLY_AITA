---
title: Canonical Settings & Member Pages Spec
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [bkk-sync, obsidian-vault, office-sync, pages, settings, spec, synto-knowledge]
type: suitedash-hierarchy
---

# canonical-app-pages.md — VLP Ecosystem SETTINGS Pages Canonical

**Status:** Authoritative
**Last updated:** 2026-04-17
**Owner:** JLW (Principal Engineer review required for changes)
**Scope:** All 8 apps in the vlp-platform monorepo
**Parent:** `canonical-app-blueprint.md` (see §1 hierarchy)

This canonical defines the SETTINGS-sidebar page contract. All decisions in the parent blueprint apply here. When this file and the blueprint disagree, the blueprint wins and this file gets corrected.

---

## 1. Purpose & scope

This canonical defines the contract for the 4 SETTINGS sidebar items — **Account**, **Profile**, **Support**, **Usage** — across all 8 apps in the vlp-platform monorepo. `canonical-site-nav.md` §2 is the source of truth for the sidebar item placement and per-app shell path; this canonical defines what those pages contain, how they wrap auth and the AppShell, which Worker endpoints they call, and the loading/error/D5-redirect rules they must satisfy.

Per-app shell-path conventions (`/(member)/*`, `/app/*`, `/operator/*`, `/dashboard/*`) are defined in `canonical-site-nav.md` §2 and carried here without modification. If this file and `canonical-site-nav.md` diverge on path or placement, `canonical-site-nav.md` wins.

VLP `apps/vlp/app/(member)/{account,profile,support,usage}` is the canonical reference implementation. When Phase 3 per-app sweeps land, each app is brought into compliance with the contract described here by lifting VLP patterns (not VLP JSX verbatim — each app has its own brand tokens and shell path).

---

## 2. Authenticated-page shell contract

Every SETTINGS page — in every app — MUST wrap content in this exact order:

```
AuthGate (or AdminGate for DVLP) → AppShell → Page content
```

No page may skip a layer; no page may implement its own session-check or redirect logic ahead of AuthGate.

### 2.1 AuthGate wrap

- Use `@vlp/member-ui` **AuthGate** for all apps EXCEPT DVLP.
- **DVLP** uses **AdminGate** (operator-only role check) — functionally equivalent wrapper for the operator-only shell.
- AuthGate handles 401 redirect to `/sign-in?redirect={path}` before page mounts.
- Pages MUST NOT implement their own manual redirect-on-session-failure. That anti-pattern caused the TTTMP audit gap fixed in `8947262` (`fix(tttmp): wrap /account in AuthGate per canonical pattern`). Any page that duplicates AuthGate's responsibilities is out of compliance.

### 2.2 AppShell wrap

- Use `@vlp/member-ui` **AppShell** with the app's `PlatformConfig` (e.g. `vlpConfig`, `tcvlpConfig`) imported from `@/lib/platform-config`.
- AppShell renders the sidebar, topbar, and content frame; it also provides session and config via `useAppShell()` context.
- Page content is the direct child of `<AppShell config={...}>`.

### 2.3 Session data access

- Read `account_id`, `email`, `role`, and other session fields from `useAppShell().session`.
- Worker returns a `{ ok, session: {...} }` envelope; AppShell already unwraps it (per A2 hot-fix). Pages consume the flat session object — they do not re-unwrap.
- Do not re-fetch `/v1/auth/session` inside a SETTINGS page. AuthGate + AppShell have already done it.

### 2.4 Authenticated fetches

- Every Worker call made from a SETTINGS page uses `credentials: 'include'`.
- Use `config.apiBaseUrl` from `useAppShell().config` when constructing URLs. Never hardcode the API host (`api.virtuallaunch.pro`, etc.) inside a page.

### 2.5 Loading state pattern

- Match VLP reference: skeleton card grid (animate-pulse rounded cards sized to match the final layout).
- No spinner-only states. No full-screen "Loading…" text.
- Lift the exact skeleton shape from `apps/vlp/app/(member)/account/AccountClient.tsx` (`AccountSkeleton`) for Account, and the per-page equivalent for Profile/Support/Usage.

### 2.6 Error state pattern

- Match VLP reference: inline error message rendered inside a card using amber accent tokens, with a retry affordance where the failure is recoverable (most data fetches).
- Worker errors are caught in the page's fetch effect and surfaced via the error card (see `AccountFallback` in VLP reference).
- Uncaught errors fall through to AppShell's error boundary — do not shadow the boundary with try/catch that swallows unknown errors.

### 2.7 D5 enforcement (no dashboard auto-redirect)

SETTINGS pages MUST NOT redirect authenticated users to onboarding flows, billing-setup flows, or any other gated path based on profile/billing/onboarding completeness.

- Onboarding entry points are **CTAs in Account** (e.g. "Complete Setup" buttons), never auto-redirects out of the SETTINGS area.
- Reference: TCVLP hot-fixes `9a805e0` (remove dashboard onboarding redirect) and `9f2c880` (add Firm Setup card to `/dashboard/account`) established this pattern.
- The Phase 1 audit confirmed no other app currently violates D5. Phase 3 sweeps must preserve compliance.

---

## 3. Account page contract

The canonical reference is `apps/vlp/app/(member)/account/AccountClient.tsx`. Every app's Account page lifts its behavior from this file.

### 3.1 Required UI sections

- **Account Details card** — Required fields: `email`, `account_id` (displayed as monospace code), name, firm (optional — only when operator/account carries a firm), member-since (`created_at` formatted), status badge. Per Principal ruling during the A5 Phase 3 GVLP sweep commit-4a pre-audit: `account_id` is a required displayed field (VLP omits it; GVLP adds it; canonical codifies the GVLP decision).
- **Current Plan / Membership card** — plan label, price, feature bullets, next-renewal date. Apps without tiered plans show a simplified single-plan card.
- **Billing management** — see §3.3.
- **Notifications card** — see §3.1.4.
- **Sign out** — NOT page content. Sign-out lives in the AppShell topbar account menu and is provided by `@vlp/member-ui`. Pages must not render a second sign-out button.

#### 3.1.1 Not required (VLP-specific legacy surface area)

VLP's `AccountClient.tsx` ships three cards that are NOT part of the canonical §3.1 set:

- **Payment Method card** — VLP-specific; canonical apps surface payment method via the Stripe Customer Portal (opened from the "Manage Billing" button — see §3.3).
- **Subscription Summary card** — VLP-specific; canonical apps surface subscription state in the Current Plan card.
- **Account Security card** — VLP-specific AND contains non-functional placeholder buttons (password change, 2FA toggles) in shipped VLP reality. If an app implements Account Security, wire the buttons to real auth flows; **do not ship placeholder UI**. Placeholder UI on a canonical card is a higher bug-risk surface than no card at all.

These three cards are permitted on VLP (existing surface area). They are not required or expected on other apps.

#### 3.1.2 Extensibility: app-specific cards

Required card sets in §3.1 are a **minimum floor, not a ceiling**. Apps may add app-specific cards below the required ones to surface concerns unique to the app's product domain. Precedents:

- **TCVLP Firm Setup card** — surfaces the "subscribed but missing app-row" recovery CTA on `/dashboard/account`.
- **GVLP Client ID rotation card** — surfaces the operator Client ID with a rotate control on `/dashboard/account`.

When adding an app-specific card: place it below the required canonical cards, not interleaved. Keep app-specific concerns visually distinct from canonical ones.

#### 3.1.3 ToggleRow primitive

The Notifications card uses a reusable `ToggleRow` primitive that currently lives inline in `apps/gvlp/app/dashboard/account/AccountClient.tsx`. Extraction to `@vlp/member-ui` is an escalation-level change deferred until at least two more apps (TMP expected) have ported and confirmed the primitive's contract is stable.

#### 3.1.4 Notifications card contract (canonical shipped reality)

Reference implementation: `apps/gvlp/app/dashboard/account/AccountClient.tsx` (established in commit `8cf5598`). This is the canonical Notifications card implementation across the ecosystem. Future app sweeps (TMP, TTTMP, DVLP, WLVLP) port from GVLP, not from TMP's `ProfileContent.tsx` (which has two known bugs — wrong preference key names and data-loss from partial PATCH; see queued reconciliation #17).

Rules:

- **Lives on Account page**, not a separate route.
- **Toggle list uses only preference keys supported by the Worker schema.** Current Worker schema for `/v1/accounts/preferences/:account_id`: `in_app_enabled`, `sms_enabled`. The full preferences row has 6 keys: `appearance`, `timezone`, `default_dashboard`, `accent_color`, `in_app_enabled`, `sms_enabled`. **`email_enabled` is NOT in the Worker schema today.** Do not wire an Email toggle until the Worker is extended. See queued reconciliation #16.
- **Critical Worker integration note — INSERT OR REPLACE full-row semantics.** The `PATCH /v1/accounts/preferences/:account_id` endpoint replaces the entire preferences row on every call. Clients MUST hold the **full 6-key preferences state** and send the complete object on every PATCH, even when only one key is changing. Sending a partial body nullifies omitted keys. This is a silent data-loss footgun — the Worker does not fail on a partial body, it just zeroes the missing fields.
- **GET response envelope:** `{ ok: true, preferences: {...} }`. Frontend reads `body.preferences.{key}`.
- **PATCH on each toggle change** — no Save button. Optimistic UI: flip the toggle immediately, call PATCH.
- **Revert-on-error:** if PATCH fails, revert the UI toggle to its prior state and render an inline error message under the card.
- **Loading state:** skeleton while the initial GET loads. Match the §2.5 skeleton pattern.
- **Error state:** amber inline error card with a Retry button on GET failure. Match the §2.6 error pattern.
- **Concurrent-click guard:** prevent an in-flight toggle from being re-toggled during a pending PATCH (disable or ignore input until the PATCH resolves).

### 3.2 Editable fields *(planned / not yet implemented)*

This section describes aspirational inline-editing behavior. **No shipped app in the VLP ecosystem currently implements inline-editable fields on the Account page.** Edit surfaces are:

- **Profile fields** (display name, bio, photo, etc.): edited on `/dashboard/profile` or via an onboarding flow (see §3.5).
- **Account-level fields** (email, etc.): changed via a support ticket. Inline email editing via `PATCH /v1/accounts/:account_id` is aspirational; Account page email is **read-only in shipped reality** across VLP, TCVLP, TMP, and GVLP.

Retained as aspirational:

- **Email** update via `PATCH /v1/accounts/:account_id`.
- Additional editable fields (display name, timezone, etc.) per VLP reference.
- Form fields are optimistic-save-on-blur only when the VLP reference does so; otherwise use an explicit Save button that's enabled only when the form is dirty.

When a future app implements inline-editable Account fields, this section graduates from aspirational to shipped and the implementing app becomes the reference.

### 3.3 Billing surfaces (canonical split)

Per Owner rulings D1+D2+D3 refined during A5 Phase 3 TCVLP sweep: Stripe-billed apps surface billing across TWO canonical pages with distinct purposes:

#### 3.3.1 Account page: billing management

Account hosts the "Manage Billing" button that opens Stripe Customer Portal via `POST /v1/billing/portal/sessions`. The portal handles:

- Payment method updates
- Invoice downloads
- Subscription cancellation
- Proration / receipt history

Implementation: button `onClick` calls the shared portal helper (see `apps/tcvlp/lib/billing.ts` for the reference pattern — established in TCVLP A5 sub-phase 5, ported to GVLP in commit `084aca7`). `returnUrl` is the current page (`window.location.origin + '/dashboard/account'`).

`customerId` sourcing is flexible. It can come from either:

- **(a)** a dedicated subscription-status endpoint like `/v1/{platform}/subscription/status` (TCVLP pattern), or
- **(b)** directly from an existing app-object context such as `useOperator()` (GVLP pattern — the Operator TypeScript type was extended in commit `6eff2da` to expose `stripe_customer_id`).

The invariant: the component knows `status === 'active'` and `stripe_customer_id` is non-null before rendering the Manage Billing control. Pick whichever source is already available in the page; do not create a new endpoint if app-object context already carries the data.

**"Complete Setup" recovery CTA — scoping note.** The "subscribed but missing app-row" recovery state (State B from the TCVLP Firm Setup card precedent) surfaces on Account with a "Complete Setup" CTA routing to the app's onboarding flow. This pattern applies **only to apps with multi-step onboarding** (e.g. TCVLP firm setup). It is **N/A for apps where the app-row is webhook-created on subscription** (GVLP operator rows, etc.) — those apps have no intermediate "subscribed but missing app-row" state to recover from. **Do not add placeholder recovery CTAs to apps that don't have this state.**

**`openBillingPortal` helper — extraction candidate.** Both TCVLP (`apps/tcvlp/lib/billing.ts`) and GVLP (`apps/gvlp/lib/billing.ts`, commit `6eff2da`) now ship a local `openBillingPortal` helper with the same signature. Current adoption: 2 apps. Extraction to `@vlp/member-ui` is deferred until at least 2 more Stripe-billed apps have ported the same helper and confirmed the contract is stable (4 of 4+ Stripe-billed apps).

#### 3.3.2 Plan page: billing selection

A separate sidebar item under SETTINGS (label: "Plan", path `/dashboard/plan` or `/dashboard/upgrade` — per-app existing path retained when present). Surfaces:

- Plan tier grid with current-plan indicator
- Upgrade/downgrade CTAs routing to Stripe Checkout
- "Manage Your Billing" card below the tier grid, rendered only when user has active subscription AND valid `customerId`; opens the same portal as Account's button

Plan and Account are deliberately separate because:

- Plan selection (Checkout) and plan management (Portal) are distinct Stripe surfaces with distinct user intents
- Keeping Plan separate prevents Account-page bloat
- Users browsing tiers don't need to land on Account first

#### 3.3.3 Non-Stripe apps

Apps without Stripe billing (rare — all 8 currently have checkout) host billing UI directly on Account as a placeholder until first-party receipts ship. No Plan sidebar item required.

#### 3.3.4 Worker endpoint

`POST /v1/billing/portal/sessions` (`apps/worker/src/index.js:3970`)
Request body: `{ accountId, customerId, eventId, returnUrl }`
Response: `{ ok, url, eventId, status }`
All fields required. `eventId` is client-generated UUID.

For `customerId` sourcing: per-app subscription-status endpoints must expose `stripe_customer_id` in their response. Reference implementation: `/v1/tcvlp/subscription/status` (Worker commit `4057154`) — field typed as `string | null`.

### 3.4 Worker endpoints used

- `GET  /v1/auth/session` — called by AppShell; pages consume the result, do not re-call.
- `GET  /v1/accounts/:account_id` — page-specific account row fetch.
- `PATCH /v1/accounts/:account_id` — email and editable-field updates.
- `POST /v1/billing/portal/sessions` — Manage Subscription button on Stripe-billed apps.
- App-specific subscription/status endpoints (e.g. `/v1/tcvlp/subscription/status`) where the app needs to detect the recovery state described in §3.3.

---

## 4. Profile page contract

The canonical reference is `apps/vlp/app/(member)/profile/ProfileClient.tsx`. Every app's Profile page lifts its behavior from this file.

### 4.1 Required UI sections (shipped reality: read-only with editing deferred to onboarding)

Shipped reality across VLP and GVLP: the Profile page is **read-only** — it displays the user's public profile fields but does not edit them inline. Editing is deferred to a separate `/profile/onboarding` flow (VLP) or equivalent wizard. Photo upload via two-step init/complete is also a property of the onboarding flow, not the Profile page.

Required (shipped):

- Read-only display of public-profile fields (display name, photo, bio, and any app-specific public fields) — lift the exact field list from the VLP reference.
- Visibility indicator (public / unlisted) where the app supports a public directory.
- "Edit Profile" CTA routing to the onboarding/wizard flow.

Aspirational / planned (not yet implemented in any app):

- Inline editable form with Save button enabled only when the form is dirty.
- Inline photo upload via the two-step init/complete pattern (see §4.3).

When an app implements inline Profile editing, it becomes the reference and this section graduates from aspirational to shipped.

### 4.2 TCVLP specialization (per Owner ruling D4)

- TCVLP SETTINGS includes **BOTH** "Account" and "Firm Profile" sidebar items.
- "Firm Profile" routes to **`/dashboard/profile`** (per Owner ruling Q7 — no path exception; Firm Profile occupies the canonical Profile slot on TCVLP).
- Firm Profile content is the public-facing pro identity (firm name, bio, services, slug). Billing and firm-setup (setup/recovery CTA) live on **Account**, not on Firm Profile.
- The other 7 apps use a single Profile item per `canonical-site-nav.md` §2.

### 4.3 Worker endpoints used

- `GET   /v1/profiles/:id`
- `PATCH /v1/profiles/:id`
- `POST  /v1/accounts/photo-upload-init`
- `POST  /v1/accounts/photo-upload-complete`

---

## 5. Support page contract

The canonical reference is `apps/vlp/app/(member)/support/page.tsx` + `SupportClient.tsx`. Every app's Support page lifts its behavior from this pair.

### 5.1 Required UI sections

- **Ticket list**, sorted by `updated_at` desc, with status badges on each row.
- **"Create Ticket" CTA** routing to a separate `/support/create` (or `/dashboard/support/create`) route. The create-ticket form lives on that route, NOT inline on the Support page. Shipped reality across VLP, TCVLP, and GVLP: all use a separate route. Reference implementation: `apps/gvlp/app/dashboard/support/create/` (commit `3b42562`) ports the VLP pattern.
- **Ticket detail view** — *planned / not required.* Zero shipped apps currently implement a ticket detail view. Apps may add one, but it is not part of the required contract.

### 5.2 Co-location pattern

`SupportClient.tsx` co-located with `page.tsx` is the canonical separation for every SETTINGS page, not just Support:

- `page.tsx` handles server-side concerns: route metadata, route config, and rendering the Client component.
- `*Client.tsx` is `'use client'` and owns interactivity, state, effects, and fetches.

Lift the exact split from VLP for every page. Do not combine `page.tsx` and the client into a single file.

### 5.3 Status badges

- **Status value set TBD** — queued reconciliation #8 (see Phase 4 plan). Ecosystem divergence: Worker may emit `open | in_progress | resolved | closed`; frontends currently display `active | pending | resolved` (via a `statusLabel` mapping in VLP and GVLP). Canonical does not currently specify which set is authoritative — pending a Worker emission audit + all-apps-frontend coordinated change.
- Until the reconciliation lands: lift the exact status value set, color mapping, and label text from the VLP `StatusBadge` usage in `SupportClient.tsx` (or GVLP `SupportClient.tsx` — both match).

### 5.4 Ticket categories

Ticket category options are **per-app, not canonical**. Each app's support form should offer categories that match its product surface (GVLP uses games, embed, etc.; VLP uses bookings; TMP will have its own set). There is **no canonical cross-app category list** — do not invent one.

### 5.5 Worker endpoints used

- `POST   /v1/support/tickets`
- `GET    /v1/support/tickets/by-account/:id`
- `GET    /v1/support/tickets/:id`
- `PATCH  /v1/support/tickets/:id`

---

## 6. Usage page contract

The canonical reference is `apps/vlp/app/(member)/usage/page.tsx` + `UsageClient.tsx`. Every app's Usage page lifts its behavior from this pair.

### 6.1 Required UI sections

- **Per-tool usage table** — tool name, count, last-used timestamp.
- **Date-range filter**, defaulting to **last 30 days** (match VLP default).
- **Pagination** if the result set exceeds the VLP page-size constant — lift `N` from the VLP reference rather than inventing a new page size.

### 6.2 Worker endpoints used

- `GET /v1/dashboard` (session-authenticated; returns dashboard payload including token usage summary)
- `GET /v1/tokens/usage/{accountId}?limit=25` (per-tool usage detail, fixed 25-item limit)

Note: `canonical-feature-matrix` Shared Features row previously listed `/v1/usage/by-account/:id`. That route may exist in the Worker but is not the one VLP, TCVLP, or GVLP consume. Confirmed correct during GVLP A5 sub-phase 2 (commit `fba2863`). Feature matrix corrected separately.

### 6.3 Tool label rendering

Tool labels come from the Worker response. Frontends render the raw `tool` string verbatim unless the VLP reference implementation defines an explicit mapping. **Do not invent app-specific tool label translations** — label consistency across apps requires the mapping to live in the Worker or a shared location, not in each app's client.

### 6.4 Status note

`canonical-feature-matrix.md` marks Tool Usage History as **"partial — route exists, UI incomplete on most platforms"**. This canonical establishes the UI contract; the Phase 3 sweep brings each app into compliance one at a time.

---

## 7. Per-app shell-path conventions

Reproduced from `canonical-site-nav.md` §2 for at-a-glance reference only. If this table and `canonical-site-nav.md` diverge, **`canonical-site-nav.md` wins**.

| App  | Pattern              | Account path             |
|------|----------------------|--------------------------|
| VLP  | `(member)/*`         | `/(member)/account`      |
| TTMP | `/app/*`             | `/app/account`           |
| DVLP | `/operator/*`        | `/operator/account`      |
| TMP, TTTMP, GVLP, TCVLP, WLVLP | `/dashboard/*` | `/dashboard/account` |

Profile, Support, and Usage follow the same per-app shell pattern as Account — substitute the last segment.

---

## 8. Stub pattern for missing pages

For apps that don't yet ship a SETTINGS page at the moment a Phase 3 sweep begins — though every app is expected to ship all 4 pages once the sweep completes — use this scaffold. It satisfies the shell contract in §2 and renders a "Coming soon" card until the real UI lands.

```tsx
'use client'
import { AuthGate, AppShell } from '@vlp/member-ui'
import { tttmpConfig } from '@/lib/platform-config'

export default function UsagePage() {
  return (
    <AuthGate apiBaseUrl={tttmpConfig.apiBaseUrl}>
      <AppShell config={tttmpConfig}>
        <div className="rounded-xl border border-[var(--member-border)]
                        bg-[var(--member-card-bg)] p-8">
          <h1 className="text-xl font-semibold">Usage</h1>
          <p className="mt-2 text-sm text-[var(--member-text-muted)]">
            Coming soon.
          </p>
        </div>
      </AppShell>
    </AuthGate>
  )
}
```

Use this pattern when scaffolding a page whose backend endpoint is shipped but whose rendering UI hasn't been built. Structurally identical to the Track C-GVLP achievement-guide stubs.

---

## 9. Per-app SETTINGS sidebar items (final state after Phase 3)

Per Owner rulings Q1–Q7 from the A5 Phase 1 audit:

| App   | Account | Profile           | Support | Usage   | Notes |
|-------|---------|-------------------|---------|---------|-------|
| VLP   | ✓       | ✓                 | ✓       | ✓       | canonical reference |
| TMP   | + (P3)  | ✓                 | ✓       | + (P3)  | Q3 — Phase 3 creates Account + Usage |
| TTMP  | ✓       | ✓                 | ✓       | ✓       | token-usage is the Usage variant |
| TTTMP | ✓       | + (P3)            | + (P3)  | + (P3)  | Q1 hot-fix done; Phase 3 creates Profile / Support / Usage |
| DVLP  | + (P3)  | + (P3)            | ✓       | + (P3)  | Q5 — `/operator/*` shell, AdminGate wrap |
| GVLP  | ✓       | ✓                 | ✓       | ✓       | — |
| TCVLP | ✓       | ✓ (Firm Profile)  | ✓       | ✓       | 5-item SETTINGS: Account, Plan, Firm Profile, Support, Usage. Plan retained at `/dashboard/upgrade` per sub-phase 1. Firm Profile at `/dashboard/profile` per sub-phase 3. Usage created faithful VLP lift per sub-phase 4. Stripe Portal wired on Account + Plan per sub-phase 5. Worker commit `4057154` exposes `stripe_customer_id`. See footnote. |
| WLVLP | + (P3)  | + (P3)            | ✓       | + (P3)  | Q6 — Phase 3 creates 3 pages; portal button handles hosting renewals |

**Legend:** ✓ = shipped per audit; **+ (P3)** = Phase 3 creates.

**Footnote (TCVLP Plan item):** TCVLP SETTINGS includes an additional "Plan" item between Account and Firm Profile, routing to `/dashboard/upgrade`. Stripe-billed apps that add a Plan page in their sweep follow this pattern.

---

## 10. Decision log

Append-only. New entries go at the bottom of the table.

| Date       | Decision | Rationale |
|------------|----------|-----------|
| 2026-04-17 | Initial canonical drafted from A5 Phase 1 audit + 7 Owner rulings | A5 Phase 2 deliverable; locks contract for Phase 3 per-app sweep |
| 2026-04-17 | Account is the canonical billing-management home (D1) | Single sidebar item per app; no separate Plan / Billing / Subscription items |
| 2026-04-17 | Stripe Customer Portal endpoint `/v1/billing/portal/sessions` adopted ecosystem-wide (D2, Q4) | Existing shared route resolves customer ID from session; no per-platform billing endpoints needed |
| 2026-04-17 | TCVLP retains Firm Profile as Profile specialization, routed to `/dashboard/profile` (D4, Q7) | Firm Profile is the public-facing pro identity and occupies the canonical Profile slot; no path exception |
| 2026-04-17 | DVLP in scope, AdminGate accepted as auth wrap (Q5) | Operator-only role is the DVLP context; AdminGate is functionally equivalent to AuthGate for canonical purposes |
| 2026-04-17 | D5 codified: SETTINGS pages may not redirect on profile / billing / onboarding state | Established by TCVLP hot-fixes `9a805e0` + `9f2c880`; Phase 1 audit confirmed no other app currently violates |
| 2026-04-18 | Account/Plan split for Stripe-billed apps | Refined D1+D2+D3 per TCVLP sweep pre-flight finding #4 — `/dashboard/upgrade` already shipped as functional Plan page, retained as canonical Plan surface. Account hosts portal for billing-management (payment method, invoices, cancel); Plan hosts tier selection + embedded Manage Billing card. |
| 2026-04-18 | Notifications card on Account | Per TCVLP sweep sub-phase 2 + Owner ruling on Phase 3 finding #2 — notification preferences are account-level (how user is contacted), not profile-level (what clients see). |
| 2026-04-18 | Usage endpoints corrected to match VLP reality | Canonical §6.2 previously listed `/v1/usage/by-account/:id` per feature-matrix; reality is `GET /v1/dashboard` + `GET /v1/tokens/usage/{accountId}?limit=25`. Faithful VLP lift confirmed this during TCVLP sub-phase 4. |
| 2026-04-18 | Worker commit `4057154` exposes `stripe_customer_id` | Subscription-status responses (authed + H_other branches) now include `stripe_customer_id`; unblocks Stripe Portal wiring for all Stripe-billed apps. Per-app subscription-status endpoints following TCVLP pattern must expose this field. |
| 2026-04-18 | Reconciled §3.1/§3.2/§3.3/§4/§5/§6 with shipped reality after GVLP A5 sweep; added Notifications Worker-integration notes | Seven-commit GVLP sweep (3b42562..8cf5598) surfaced consistent canonical-vs-reality drift; documenting shipped patterns as the source of truth with aspirational items explicitly flagged. Queued reconciliations #8 (Support status values) and #17 (TMP ProfileContent preferences data loss) referenced inline but NOT closed — cross-app coordination work. |
