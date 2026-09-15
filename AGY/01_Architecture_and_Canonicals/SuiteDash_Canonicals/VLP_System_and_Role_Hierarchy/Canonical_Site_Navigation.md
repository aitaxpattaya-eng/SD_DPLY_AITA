---
title: Canonical Site & Portal Navigation Structure
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [bkk-sync, navigation, obsidian-vault, office-sync, portal-nav, synto-knowledge]
type: suitedash-hierarchy
---

# canonical-site-nav.md — VLP Ecosystem Site Navigation

**Status:** Authoritative
**Last updated:** 2026-05-08
**Owner:** JLW (Principal Engineer review required for changes)
**Scope:** All 10 apps in the vlp-platform monorepo
**Parent:** `canonical-app-blueprint.md` (see §1 hierarchy)

This canonical defines navigation patterns. All decisions in the parent blueprint apply here. When this file and the blueprint disagree, the blueprint wins and this file gets corrected.

---

## Purpose

Defines the standard navigation structure for all 10 VLP platform frontends. Every platform uses the same layout skeleton. Platform-specific items are marked with their platform code. Items without a code appear on every platform.

Implementation: shared components in `packages/member-ui` driven by `PlatformConfig`. Each app passes its config (platform name, theme color, nav items, sidebar items). The components render accordingly.

---

## 1. Marketing Site (Public Pages)

### Header

Primary nav (horizontal, left-aligned after logo):

| Item | Path | Notes |
|------|------|-------|
| About | /about | Why [Platform Name] exists |
| Features | /features | Platform-specific feature list |
| Pricing | /pricing | Tiers, token packs, or one-time pricing |
| How It Works | /how-it-works | Step-by-step workflow |
| Contact | /contact | Talk to the team or start intake |
| Reviews | /reviews | Public review cards (powered by unified submissions) |
| Resources | — | Opens mega menu (see below) |

Right-aligned actions:

| Item | Type | Notes |
|------|------|-------|
| Log In | Text link | Routes to /sign-in |
| [CTA] | Primary button | Platform-specific free magnet (e.g., "Free Code Lookup" for TTMP, "Free Site Preview" for WLVLP) |

### Resources Mega Menu

Opens on hover/click of "Resources" nav item. Three content columns plus a CTA column.

**Column 1 — DISCOVER**

| Item | Description | Path |
|------|-------------|------|
| About | Why [Platform Name] exists | /about |
| Contact | Talk to our team or start intake | /contact |
| [Resource Guide] | Platform-specific guide or resource | varies |

**Column 2 — EXPLORE**

| Item | Path |
|------|------|
| Features | /features |
| How It Works | /how-it-works |
| Pricing | /pricing |
| Help Center | /support |
| [Asset] | Platform-specific (e.g., /tools/code-lookup for TTMP) |

**Column 3 — TOOLS & EXTRAS**

Up to 4 platform-specific items. Examples:

| Platform | Items |
|----------|-------|
| TTMP | Free Code Lookup, Sample Report, Transcript Guide, API Docs |
| WLVLP | Template Gallery, Before/After Preview, Site Hosting FAQ, Design Tips |
| TMP | IRS Payment Calculator, Directory Search, Tax Pro Guide, Compliance Checklist |
| TCVLP | Talk to Kennedy, Gala — Claim Guide, Form 843 Explainer, Penalty Calculator, Case Examples |
| TTTMP | Game Demo, IRS Form Guide, Code Quiz, Study Tools |
| DVLP | Portfolio Examples, Hiring Guide, Skill Matcher, Rate Calculator |
| GVLP | Game Previews, Leaderboards, Achievement Guide, Tournament Rules |
| VLP | Platform Overview, Integration Guide, API Docs, Partner Program |
| TAVLP | Avatar Roster, Sample Channel, Kwong Content Pack, Cal.com Intro |
| TPP | Tax Monitor Pro, TPP + TMP Bundle (lives at `/pricing#bundle`), Discovery Call (SuiteDash form), Member Portal (outbound to SuiteDash) |

**Column 4 — CTA**

| Element | Notes |
|---------|-------|
| [Contextual text] | Platform-specific hook (e.g., TTMP: "Need human review before a transcript issue becomes a client fire drill?") |
| Free Guide | Link to the platform's primary free magnet |
| Log In | Button, routes to /sign-in |

### Footer

Four columns:

**Column 1 — Brand**

| Element | Notes |
|---------|-------|
| Logo/Icon | Platform icon |
| Platform Name | e.g., "Transcript Tax Monitor Pro" |
| Tagline | Two-word descriptor on second line (e.g., "Transcript Automation") |
| Summary | One sentence describing the platform |
| CTA link | e.g., "Generate a report" or "View sample report" |

**Column 2 — Links**

| Item | Path |
|------|------|
| About | /about |
| Contact | /contact |
| Features | /features |
| How It Works | /how-it-works |
| Pricing | /pricing |
| Sign In | /sign-in |

**Column 3 — Resources**

| Item | Notes |
|------|-------|
| Free Guide | Platform-specific magnet |
| Affiliate Program | /affiliate |
| [Cross-platform link 1] | e.g., "Tax Monitor Pro" linking to taxmonitor.pro |
| [Cross-platform link 2] | e.g., "Tax Tools Arcade" linking to taxtools.taxmonitor.pro |
| [Cross-platform link 3] | e.g., "Transcript Automation" linking to transcript.taxmonitor.pro |

**Column 4 — Legal**

| Item | Path |
|------|------|
| Privacy | /legal/privacy |
| Refund | /legal/refund |
| Terms | /legal/terms |

---

## 2. App (Authenticated Dashboard)

### Topbar

Fixed at top of authenticated pages. Contains:

| Element | Position | Notes |
|---------|----------|-------|
| Platform logo + name | Left | Links to dashboard home |
| Help | Right (icon) | Opens help center or support page |
| Notifications | Right (icon) | Bell icon with unread count badge |
| Avatar | Right | Dropdown with: Account, Profile, Sign Out |

### Sidebar

Collapsible left sidebar. Three sections with headers.

### Path conventions

The paths in the tables below represent the **canonical pattern for new per-app
authenticated work**: all authenticated sidebar destinations live under
`/dashboard/*`.

**Grandfathered exceptions (do not migrate):**

| App | Pattern | Example |
|-----|---------|---------|
| VLP | `(member)/*` route group | `app/(member)/support/page.tsx` |
| TTMP | `/app/*` | `app/app/support/page.tsx` |
| DVLP | `/operator/*` | `app/operator/page.tsx` |

All other apps (TMP, TTTMP, GVLP, TCVLP, WLVLP, TAVLP) use and will continue
to use `/dashboard/*` for new authenticated pages.

**Authenticated-only rule:**

Support and Affiliate pages are authenticated across all 8 platforms. Public
or marketing-style versions of `/support` and `/affiliate` are not permitted.
Any existing top-level `/support` or `/affiliate` route that currently renders
marketing/FAQ/landing content must be replaced with a client-side redirect
to the authenticated dashboard path, wrapped in `AuthGuard` so unauthenticated
visitors route through `/sign-in?redirect=<dashboard-path>` before landing
on the dashboard page.

Both pages must:
- Sit behind `AuthGuard` (client-side session check for static-export apps)
- Be wrapped by `AppShell` from `@vlp/member-ui` with the app's `platformConfig`
- Call authenticated Worker endpoints (`/v1/support/tickets`,
  `/v1/affiliates/:account_id`, `/v1/affiliates/:account_id/events`) with
  `credentials: 'include'`
- Contain functional UI only: ticket list + create for Support; referral link
  + commissions + Stripe Connect onboard for Affiliate
- Contain zero FAQ content, marketing copy, or "contact us" landing cards

Reference implementations: `apps/vlp/app/(member)/support/page.tsx` and
`apps/vlp/app/(member)/affiliate/page.tsx` (with their co-located `*Client.tsx`
components).

**WORKSPACE** (platform-specific items shown per platform):

| Item | Platforms | Path |
|------|-----------|------|
| Dashboard | ALL | /dashboard |
| Booking Analytics | VLP | /dashboard/bookings |
| Calendar | VLP (includes Scheduling) | /dashboard/calendar |
| Client Pool | VLP | /client-pool |
| Discounts / Entitlements | TMP | /dashboard/discounts |
| Directory Profile | DVLP, VLP | /dashboard/profile/directory |
| Premium Domain Hosting | WLVLP | /dashboard/hosting |
| Game Access JS | GVLP | /dashboard/games |
| Game Analytics | TTTMP | /dashboard/game-analytics |
| Job Matching Access | DVLP | /dashboard/jobs |
| Taxpayer Intake | TMP | /dashboard/intake |
| Messaging (Pro ↔ Taxpayer) | TMP, VLP | /dashboard/messages |
| Parser | TTMP | /dashboard/parser |
| Reports | TTMP | /dashboard/reports |
| Tax Monitoring | TMP | /dashboard/monitoring |
| Voting Analytics | WLVLP | /dashboard/voting |
| White-Labeled Hosted Site | TCVLP, WLVLP | /dashboard/sites |

**EARNINGS**

| Item | Platforms | Path |
|------|-----------|------|
| Affiliate | ALL | /dashboard/affiliate |
| Bidding | ALL | /dashboard/bidding |
| Winning | ALL | /dashboard/winning |

**SETTINGS**

| Item | Platforms | Path |
|------|-----------|------|
| Account | ALL | /dashboard/account |
| Profile | ALL | /dashboard/profile |
| Support | ALL | /dashboard/support |
| Usage | ALL | /dashboard/usage |

---

## 3. PlatformConfig Shape (for member-ui)

Each app provides a config object that drives the shared nav components:

```typescript
interface PlatformConfig {
  platform: string;                    // "ttmp", "vlp", etc.
  platformName: string;                // "Transcript Tax Monitor Pro"
  tagline: string;                     // "Transcript Automation"
  summary: string;                     // One-line platform description
  themeColor: string;                  // "#14b8a6"
  apiBaseUrl: string;                  // "https://api.virtuallaunch.pro"
  ctaLabel: string;                    // "Free Code Lookup"
  ctaPath: string;                     // "/tools/code-lookup"

  megaMenu: {
    discover: Array<{ label: string; description: string; path: string }>;
    explore: Array<{ label: string; path: string }>;
    toolsExtras: Array<{ label: string; path: string }>;
    ctaText: string;
    ctaMagnetLabel: string;
    ctaMagnetPath: string;
  };

  footerResources: Array<{ label: string; href: string }>;

  navSections: NavSection[];
}

interface NavSection {
  title: string;                       // "WORKSPACE" | "EARNINGS" | "SETTINGS"
  items: NavItem[];
}

interface NavItem {
  label: string;
  path: string;
  icon: string;                        // lucide-react icon name
}
```

Components read this config and render. No hardcoded platform values in
shared code. The `navSections` array is ordered — sections render in the
order declared. The conventional section titles are `"WORKSPACE"`,
`"EARNINGS"`, and `"SETTINGS"`, matching the three tables in §2; apps
may include a subset of these sections depending on which features they
expose. The exported type is `PlatformConfig` (not `SiteNavConfig`) to
match the shipped `@vlp/member-ui` export.

---

## 4. Implementation Notes

### 4.1 Component location
Shared components live in `packages/member-ui/src/components/`. Each app imports and wraps with its own `PlatformConfig`. No hardcoded platform values in shared code.

### 4.2 Active state
Active nav item is highlighted using `brand.primary` (per blueprint §4.5). Other brand tokens (`brand.hover`, `brand.dark`) apply for hover and pressed states. Do not use raw hex values — always reference the brand token.

### 4.3 Mobile navigation
At `< md` breakpoint (768px):

**Header collapses to hamburger menu:**
- Primary nav items (About, Features, Pricing, How It Works, Contact, Reviews, Resources) move into a slide-in drawer
- Hamburger button appears left of the logo
- CTA button remains visible in the header; Log In moves into the drawer
- Drawer slides in from the left, overlays content, covers ~85% of viewport width
- **Containment warning:** The header element must not apply
  backdrop-filter, filter, transform, will-change: transform,
  contain: paint, or perspective — any of these creates a CSS
  containing block that breaks position: fixed on the drawer. If the
  header uses backdrop-filter for a frosted-glass effect, neutralize it
  on mobile via the app's globals.css (see canonical-new-app.md 5.5
  for the fix pattern and full explanation).
- Backdrop darkens the uncovered portion; tap-outside closes the drawer
- Close via: X button top-right of drawer, tap backdrop, Escape key, or swipe-left
- Transition: `slide-up` keyframe (per blueprint §4.18), `duration-base` (250ms)

**Sidebar becomes a drawer:**
- Authenticated app sidebar hides at `< md`
- Hamburger on topbar (left of platform logo) toggles the drawer
- Same slide-in behavior as marketing drawer
- State does NOT persist across page loads on mobile (always closed on navigation)

### 4.4 Sidebar collapse behavior (desktop)
At `≥ md`:
- Collapse triggered by icon button at the top of the sidebar (chevron or similar)
- Collapsed state: `w-16` (64px), icons only, labels hidden
- Expanded state: `w-64` (256px), icons + labels
- Tooltips appear on hover when collapsed, showing the full label
- State persists across navigation within the session (localStorage key: `<platform>-sidebar-collapsed`)
- Default state on first load: expanded

### 4.5 Accessibility
- Mega menu is keyboard navigable (Tab/Shift-Tab), closes on Escape
- All nav items have visible focus rings using `shadow-focus` (per blueprint §4.17)
- Hamburger button and drawer have proper ARIA attributes (`aria-expanded`, `aria-controls`, `aria-label`)
- Skip link: "Skip to main content" appears as the first focusable element on every page, visually hidden until focused, routes to `#main`
- Drawer traps focus while open; returns focus to hamburger button on close
- All animations respect `prefers-reduced-motion` per blueprint §4.18 (motion-safe variants only)

### 4.6 Topbar behavior
- **Platform logo + name:** Links to `/dashboard`. Clicking anywhere in the logo+name group navigates.
- **Help icon:** Opens `/support` in the same tab. Tooltip on hover: "Help".
- **Notifications bell:**
  - Unread count badge shown when count > 0; max displayed value is `9+`
  - Click opens dropdown panel (not a full-page route) listing recent notifications
  - Dropdown uses `z-dropdown` (= 10, per blueprint §4.19) and `shadow-md`
  - Mark-as-read on click; "View all" link at bottom routes to `/dashboard/notifications`
- **Avatar dropdown:**
  - Three items: Account (→ `/dashboard/account`), Profile (→ `/dashboard/profile`), Sign Out (triggers sign-out action, then redirects to `/`)
  - Uses `z-dropdown` and `shadow-md`
  - Closes on: item click, Escape, click outside

### 4.7 Footer consistency
Footer structure is identical across all 10 platforms. Only content differs via config. Column 3 ("Resources") contains `footerResources` from `PlatformConfig` — typically 3 cross-platform links plus the affiliate link. Per-app config is the source of truth for which platforms each app links to.

### 4.8 SD-led app exception (TPP)
Tax Prep Pro (`apps/taxprep`) is the first SD-led marketing app and deviates from the §1 / §2 pattern in the following bounded ways:

- **Homepage** (`/`) lives at `app/(marketing)/page.tsx` and uses the shared `MarketingHeader` / `MarketingFooter` chrome like every other marketing route. `LandingPage.tsx` is content-only — the bespoke SD chrome it originally shipped with was removed when the homepage was restructured to canonical-index.html's 8-section layout. (Earlier carveout that put homepage at `app/page.tsx` outside the route group is retired as of 2026-05-09.)
- **`/sign-in` is account-creation + outbound sign-in** — the page renders a two-card layout: "Create your account" (form that POSTs to `/v1/taxprep/onboarding`, see canonical-api.md §8b) on the left and "Already a member — Sign in to portal" (outbound to `https://secure.virtuallaunch.pro/site/login`) on the right. The form requires a CRM-Company-Category selection so SD records the lead's business type at creation. There is still no in-app auth or session management on TPP — successful account creation triggers a SuiteDash welcome email and the user sets their password in SuiteDash.
- **No `/dashboard/*` member area.** TPP has no §2 sidebar items; members live in SuiteDash. The Topbar/Sidebar specs in §2 do not apply.
- **Bookings use SuiteDash form embeds**, not Cal.com — see `canonical-cal-events.md` §7 (SuiteDash form bookings).

Future SD-led apps should mirror this pattern. Apps that ship a member dashboard (the rest of the ecosystem) continue to follow §1 + §2 unchanged.

---

## 5. Layout Standards (Mandatory — All 9 Platforms)

All marketing site pages and app pages must use the same container and spacing system so headers, footers, and content align perfectly across every platform.

### Page container

Three container widths per blueprint §4.14. Pick the one that matches the surface.

| Surface | Token | Width | Tailwind class |
|---------|-------|-------|----------------|
| Marketing pages, landing, pricing | `max-w-marketing` | 1280px | `max-w-[1280px]` or `max-w-7xl` |
| Authenticated app views | `max-w-app` | 1200px | `max-w-[1200px]` |
| Article content, forms, single-column | `max-w-narrow` | 960px | `max-w-[960px]` |

Side padding:  24px mobile (`px-6`), 32px tablet+ (`md:px-8`)
Center:        `mx-auto`

Every top-level page section wraps its content in a container matching the surface. Marketing example:

```html
<div class="max-w-[1280px] mx-auto px-6 md:px-8">
  <!-- section content -->
</div>
```

App dashboard example:

```html
<div class="max-w-[1200px] mx-auto px-6 md:px-8">
  <!-- dashboard content -->
</div>
```

The outer wrapper (full-width background color/gradient) can be 100vw. The inner content container always uses one of the three max-widths above.

### Header layout

```
Container:     max-w-7xl mx-auto px-6 md:px-8
Height:        64px (h-16)
Position:      `sticky top-0 z-sticky` (z-sticky = 20, per blueprint §4.19), `backdrop-blur`
Structure:     [Logo + Platform Name]  [Nav Items]  |  [Log In]  [CTA Button]
```

The `|` divider (visual separator between nav items and auth actions) is a thin vertical line: `border-l border-white/10 h-6 mx-4` or equivalent. It separates the content navigation (About, Features, Pricing, etc.) from the auth actions (Log In, CTA button).

Nav items are spaced with `gap-6` (24px) between them. The CTA button uses the platform's theme color as background.

### Footer layout

```
Container:     max-w-7xl mx-auto px-6 md:px-8
Structure:     4-column grid (responsive: stack on mobile, 2-col tablet, 4-col desktop)
Padding:       py-16 (64px top and bottom)
Border top:    1px solid white/10
```

Footer columns use: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8`

### App layout (authenticated pages)

Sidebar:       w-64 (256px) fixed left, collapsible to w-16 (64px)
Topbar:        h-16 (64px) fixed top, full width minus sidebar
Content area:  `max-w-[1200px] mx-auto px-6 md:px-8` (blueprint §4.14 `max-w-app`)

Authenticated pages use the 1200px app container, not the 1280px marketing container. If a dashboard page is content-heavy and would benefit from the narrower 960px reading width (e.g. a long-form settings page), use `max-w-[960px]`.

### Breakpoints (Tailwind defaults)

| Breakpoint | Width | Usage |
|------------|-------|-------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet — switch to 2-col grids, larger padding |
| lg | 1024px | Desktop — full nav, 4-col footer, sidebar visible |
| xl | 1280px | Container max-width reached |
| 2xl | 1536px | Content centered with increasing margin |

### What this prevents

- Headers that are wider than content sections
- Footers with different padding than the rest of the page
- Inconsistent margin between platforms
- Content that touches the edge on one platform but has padding on another

### Implementation

These values are enforced through the shared layout components in `packages/member-ui`. Each app's root layout wraps pages with the shared container. Individual apps must NOT override the container width or padding unless they have an explicit reason documented in their `.claude/CLAUDE.md`.

---

## 6. Relationship to other canonicals

| Canonical | What lives there |
|-----------|-----------------|
| `canonical-app-blueprint.md` | Parent. Decisions on tokens, color mode, typography, breakpoints, z-index, animations, max-widths. All apply here. |
| `canonical-style.md` | Token rem/hex values, component patterns, utility classes for text/color/spacing. Referenced by this file, not duplicated. |
| `canonical-app-components.md` | *(planned — not yet created)* Component-level specs for dashboard widgets, forms, modals, toasts, empty states. Nav is structural; components are what nav wraps. |
| `canonical-feature-matrix.md` | Per-app feature inventory. Drives which sidebar items a given platform shows. |

When a rule in this file conflicts with the blueprint, the blueprint wins. When this file conflicts with a sub-canonical like `canonical-style.md`, this file wins for nav-scoped concerns (e.g. topbar height) and the sub-canonical wins for its own scope (e.g. button padding).

---

## 7. Decision log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-14 | Initial authoring with §5 layout standards | Enforce container consistency across 8 platforms |
| 2026-04-15 | Added Status/Owner/Parent header | Align with canonical authority convention |
| 2026-04-15 | Replaced single `max-w-7xl` rule with three-tier container system | Blueprint §4.14 requires three max-widths (marketing/app/narrow) |
| 2026-04-15 | Replaced `z-50` with `z-sticky` token | Blueprint §4.19 forbids raw z-index values |
| 2026-04-15 | Expanded §4 from 6 bullets to 7 sub-sections covering mobile, a11y, topbar behavior, sidebar collapse | Existing content was too thin to implement against |
| 2026-04-17 | Reconciled WORKSPACE/EARNINGS items to Owner spec ("Game Access JS", Messaging descriptor added, Bidding/Winning ALL) | Owner restated authoritative structure during Phase 4 Track B prep |
| 2026-05-08 | Added §4.8 SD-led app exception (TPP) and TPP Tools & Extras row | TPP is the first SD-led marketing app — homepage uses bespoke SD chrome at `app/page.tsx`, no `/dashboard/*` member area, `/sign-in` outbound to SuiteDash, bookings via SD form embeds |
| 2026-05-09 | Retired homepage carveout from §4.8 — homepage now uses shared chrome | Bespoke SD `<header>` / `<footer>` removed from `LandingPage.tsx` during canonical 8-section restructure. Homepage moved into `(marketing)` route group. SD-led app exception narrows to: no `/dashboard/*` member area, `/sign-in` outbound, SD form bookings — chrome carveout no longer needed. |
| 2026-05-10 | TPP /sign-in becomes account-creation + outbound; first Worker route (POST /v1/taxprep/onboarding); CRM category required | Owner ruling: replace SD-form-embed friction with a native account-creation flow brokered server-side via SD's POST /secure-api/company. Form requires CRM Company Category radio selection (all 10 SD categories). Narrows Deviation 4 to one route; updates Deviation 3. All other SD-led app exceptions remain. |
| 2026-05-11 | Added containment warning to 4.3 mobile navigation | TPP backdrop-filter on header broke nav drawer position: fixed. Cross-referencing fix pattern in canonical-new-app.md 5.5. |

Append-only. Do not rewrite prior entries.
