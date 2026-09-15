---
title: Canonical Cal.com & SuiteDash Booking Integration
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [appointments, bkk-sync, cal-com, obsidian-vault, office-sync, suitedash, synto-knowledge]
type: suitedash-hierarchy
---

<!--
Status: Authoritative
Last updated: 2026-05-08
Owner: JLW (Principal Engineer review required for changes)
Scope: All 10 apps in the vlp-platform monorepo
Parent: canonical-app-blueprint.md
-->

# canonical-cal-events.md

Authoritative registry for Cal.com event types used across the VLP
ecosystem. 9 of 10 apps consume Cal.com via element-click popup embeds
configured through `PlatformConfig`. This canonical is the single
source of truth — do not hardcode Cal slugs or namespaces in
component code.

**SD-led exception (historical):** Tax Prep Pro (TPP / `apps/taxprep`) is SD-led
but DOES use Cal.com for bookings as of 2026-05-09 — see §7.4. The SD-form
booking pipeline (§7.1–§7.3, §7.5) remains documented for future SD-led apps
that may prefer it.

---

## 1. Naming convention

All Cal event slugs follow:

    tax-monitor-pro/{app-abbrev}-{purpose}

Where:
- `tax-monitor-pro` is the Cal.com team handle (fixed)
- `{app-abbrev}` is the lowercase app abbreviation (vlp, tcvlp, tmp,
  ttmp, tttmp, dvlp, gvlp, wlvlp)
- `{purpose}` is one of: `support`, `intro`, `discovery`, `onboarding`

The Cal **namespace** for `Cal("init", namespace, ...)` is the slug's
last path segment: `{app-abbrev}-{purpose}` (e.g., `wlvlp-support`).

When adding a new event type to Cal.com, name it per this convention
and add it to §3 below before consuming it in any app.

---

## 2. PlatformConfig fields

Each app's `lib/platform-config.ts` declares booking events as paired
namespace + slug fields on `PlatformConfig`:

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `calBookingNamespace` | string | yes | Help Center "Book a Call" — support event |
| `calBookingSlug` | string | yes | Help Center "Book a Call" — full slug |
| `calIntroNamespace` | string | yes | Marketing "Book Intro" — intro event |
| `calIntroSlug` | string | yes | Marketing "Book Intro" — full slug |
| `calDiscoveryNamespace` | string | optional | Discovery call (TTMP only currently) |
| `calDiscoverySlug` | string | optional | Discovery call slug |
| `calOnboardingNamespace` | string | optional | Onboarding call (DVLP only currently) |
| `calOnboardingSlug` | string | optional | Onboarding call slug |

The existing `calcomReferralLink?: string` field is unrelated — it is
the Cal.com partner referral URL, not a booking event.

---

## 3. Event-type registry

All event types currently configured in Cal.com, mapped to their
PlatformConfig fields.

| App | Purpose | Slug | Namespace | Duration | PlatformConfig field |
|-----|---------|------|-----------|----------|----------------------|
| VLP | support | tax-monitor-pro/vlp-support | vlp-support | 15m | calBookingSlug / calBookingNamespace |
| VLP | intro | tax-monitor-pro/vlp-intro | vlp-intro | 15m | calIntroSlug / calIntroNamespace |
| TCVLP | support | tax-monitor-pro/tcvlp-support | tcvlp-support | 15m | calBookingSlug / calBookingNamespace |
| TCVLP | intro | tax-monitor-pro/tcvlp-intro | tcvlp-intro | 15m | calIntroSlug / calIntroNamespace |
| TMP | support | tax-monitor-pro/tmp-support | tmp-support | 15m | calBookingSlug / calBookingNamespace |
| TMP | intro | tax-monitor-pro/tmp-intro | tmp-intro | 15m | calIntroSlug / calIntroNamespace |
| TTMP | support | tax-monitor-pro/ttmp-support | ttmp-support | 10m | calBookingSlug / calBookingNamespace |
| TTMP | intro | tax-monitor-pro/ttmp-intro | ttmp-intro | 15m | calIntroSlug / calIntroNamespace |
| TTMP | discovery | tax-monitor-pro/ttmp-discovery | ttmp-discovery | 15m | calDiscoverySlug / calDiscoveryNamespace |
| TTTMP | support | tax-monitor-pro/tttmp-support | tttmp-support | 15m | calBookingSlug / calBookingNamespace |
| TTTMP | intro | tax-monitor-pro/tttmp-intro | tttmp-intro | 15m | calIntroSlug / calIntroNamespace |
| DVLP | support | tax-monitor-pro/dvlp-support | dvlp-support | 15m | calBookingSlug / calBookingNamespace |
| DVLP | intro | tax-monitor-pro/dvlp-intro | dvlp-intro | 15m | calIntroSlug / calIntroNamespace |
| DVLP | onboarding | tax-monitor-pro/dvlp-onboarding | dvlp-onboarding | 10m | calOnboardingSlug / calOnboardingNamespace |
| GVLP | support | tax-monitor-pro/gvlp-support | gvlp-support | 15m | calBookingSlug / calBookingNamespace |
| GVLP | intro | tax-monitor-pro/gvlp-intro | gvlp-intro | 15m | calIntroSlug / calIntroNamespace |
| WLVLP | support | tax-monitor-pro/wlvlp-support | wlvlp-support | 15m | calBookingSlug / calBookingNamespace |
| WLVLP | intro | tax-monitor-pro/wlvlp-intro | wlvlp-intro | 15m | calIntroSlug / calIntroNamespace |
| TAVLP | support | tax-monitor-pro/tavlp-support | tavlp-support | 15m | calBookingSlug / calBookingNamespace |
| TAVLP | intro | tax-monitor-pro/tax-avatar-virtual-launch-pro | tax-avatar-virtual-launch-pro | 15m | calIntroSlug / calIntroNamespace |
| TPP | support | tax-monitor-pro/tpvlp-support | tpvlp-support | 15m | calBookingSlug / calBookingNamespace |
| TPP | intro | tax-monitor-pro/tpvlp-intro | tpvlp-intro | 15m | calIntroSlug / calIntroNamespace |

22 total event types. Every app has support + intro. TTMP has discovery,
DVLP has onboarding. TAVLP's intro slug is the legacy
`tax-avatar-virtual-launch-pro` event predating the §1 naming convention
and is intentionally retained. TPP's slugs use the `tpvlp-` prefix
(Owner-supplied; predates strict §1 abbrev alignment of `tpp-`).

---

## 4. Embed pattern (element-click popup)

All Cal embeds across the monorepo use the **element-click popup**
pattern. Inline iframes and standalone embed pages are deprecated;
do not introduce new instances.

The shared `HelpCenter` component in `@vlp/member-ui` encapsulates the
script load and click-handler wiring for the support event. Other
contexts (marketing CTAs for intro, post-onboarding CTAs, etc.) follow
the same pattern, parameterized by the corresponding PlatformConfig
fields.

The element-click pattern requires three things on the trigger element:

    data-cal-link="{slug}"
    data-cal-namespace="{namespace}"
    data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'

And one-time script init per namespace:

    Cal("init", namespace, { origin: "https://app.cal.com" });
    Cal.ns[namespace]("ui", {
      cssVarsPerTheme: {
        light: { "cal-brand": "#292929" },
        dark:  { "cal-brand": platformConfig.themeColor }
      },
      hideEventTypeDetails: false,
      layout: "month_view"
    });

The dark `cal-brand` value comes from the consuming app's
`platformConfig.themeColor`. The light value is fixed at `#292929`
across all apps for legibility.

Script load: load https://app.cal.com/embed/embed.js once per page
mount, idempotently (check `window.Cal` before re-loading).

---

## 5. Adding a new event type

1. Create the event in Cal.com following the §1 naming convention.
2. Add a row to §3's registry table.
3. Add the corresponding `cal{Purpose}Namespace` + `cal{Purpose}Slug`
   field to `PlatformConfig` in `packages/member-ui/src/types/config.ts`.
4. Set the values in the relevant app's `lib/platform-config.ts`.
5. Wire the consuming component to read from PlatformConfig (never
   hardcode the slug).

---

## 6. Drift audit

Existing inline Cal hardcodes that pre-date this canonical (per Phase 3
recon):

- apps/vlp: components/cal/, components/marketing/ContactPage.tsx,
  app/scale/components/DailyWorkflowPlanner.tsx,
  app/scale/calendar/page.tsx,
  app/(member)/client-pool/[clientId]/page.tsx
- apps/tcvlp: app/calendar/page.tsx, components/marketing/ContactPage.tsx
- apps/tmp: app/contact/page.tsx, app/calendar/page.tsx,
  components/SupportModal.tsx
- apps/tttmp: components/SupportModal.tsx
- apps/dvlp: app/support/BookCallCard.tsx, app/success/page.tsx
- apps/gvlp: app/calendar/page.tsx
- apps/wlvlp: none

These will migrate to PlatformConfig consumption as each app's Phase 3
pass touches them. New code MUST consume from PlatformConfig — adding
new hardcoded Cal slugs anywhere is drift.

---

## 7. SuiteDash form bookings (SD-led apps)

SD-led marketing apps (currently TPP only) bypass Cal.com entirely and
embed SuiteDash form scripts that POST directly to SuiteDash. Bookings
land in the SuiteDash workspace assigned to the form, not on a Cal.com
calendar. There is no Worker route involved (Deviation 4 — TPP has no
backend endpoints).

### 7.1 PlatformConfig fields

When `bookingProvider === 'suitedash'`, the app populates these fields on
`PlatformConfig` (defined in `packages/member-ui/src/types/config.ts`):

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `bookingProvider` | `'cal' \| 'suitedash'` | optional (default `'cal'` when undefined) | Selects the booking pipeline |
| `suitedashDiscoveryFormId` | string | yes for SD-led | SD form ID for the Discovery Call (e.g. `21EGX5mk16QA6qVGj`) |
| `suitedashDemoFormId` | string | optional | SD form ID for the Demo (e.g. `2rU9ohwhCx3rsijrC`) |
| `suitedashEmbedBaseUrl` | string | yes for SD-led | Origin + path for SD form scripts (`https://secure.virtuallaunch.pro/frm`) |

The full embed URL is constructed as `${suitedashEmbedBaseUrl}/${formId}.js`.

The Cal.com fields (`calBookingNamespace`, `calBookingSlug`, etc.) remain
required on `PlatformConfig` for consumer ergonomics in `LeadChatbot` and
`HelpCenter`. SD-led apps pass empty strings — those consumers do not
render for SD-led apps.

### 7.2 SD form registry

| App | Purpose | SD Form ID | PlatformConfig field | Embed URL |
|-----|---------|------------|----------------------|-----------|
| TPP | Discovery Call | `21EGX5mk16QA6qVGj` | `suitedashDiscoveryFormId` | `https://secure.virtuallaunch.pro/frm/21EGX5mk16QA6qVGj.js` |
| TPP | Demo | `2rU9ohwhCx3rsijrC` | `suitedashDemoFormId` | `https://secure.virtuallaunch.pro/frm/2rU9ohwhCx3rsijrC.js` |

When adding a new SD form, set the value in the app's `lib/platform-config.ts`
and add a row here before consuming the embed in any component.

### 7.3 Embed pattern (Pattern A — `next/script`)

SD form embeds are JS injection scripts (NOT iframes). Reference implementation
ships in `apps/taxprep/components/marketing/SuiteDashFormEmbed.tsx` and uses
`next/script` with `strategy="afterInteractive"` plus a placeholder div:

```tsx
'use client'
import Script from 'next/script'

export function SuiteDashFormEmbed({ formId, embedBaseUrl }: Props) {
  return (
    <>
      <div id={`sd-form-${formId}`} className="tpp-form-sd" />
      <Script
        src={`${embedBaseUrl}/${formId}.js`}
        strategy="afterInteractive"
        id={`sd-form-script-${formId}`}
      />
    </>
  )
}
```

The SD script appends form DOM into the document at its insertion point.
The `.tpp-form-sd` (or per-app equivalent) wrapper class scopes the
brand-aware styling overrides (input padding, button gradient, label
case) onto the SD-injected fields — see `apps/taxprep/scratch/sd-landing.css`
for the full override block.

**Fallback (Pattern B — `useEffect` injection):** if Pattern A's script
hoisting moves the `<script>` element away from its placeholder so the
form fails to render, fall back to a `useEffect` that does
`document.createElement('script')` + `containerRef.current.appendChild(...)`
inside a ref'd div. Document the fallback in the consuming app's
`.claude/CLAUDE.md` if used.

### 7.4 SD-led apps and Cal coexistence

SD-led apps MAY use Cal.com for booking flows where Cal's UX is preferable
to a SuiteDash form embed. TPP adopted this hybrid pattern on 2026-05-09:
Discovery Call and Support bookings happen via Cal.com (per §3 registry),
while the SD workspace remains the post-conversion home for clients.

When an SD-led app uses Cal, it MUST populate the four required Cal fields
on PlatformConfig (`calBookingNamespace`, `calBookingSlug`,
`calIntroNamespace`, `calIntroSlug`) and SHOULD set
`bookingProvider: 'cal'` (or omit the field — `cal` is the default per §7.1).

Other SD-led app exceptions (no `/dashboard/*` member area, `/sign-in`
outbound to SD, no Worker routes) remain unchanged.

### 7.5 Adding a new SD-led app

1. Set `bookingProvider: 'suitedash'` in the app's `lib/platform-config.ts`.
2. Add the SD Discovery (and optional Demo) form IDs.
3. Set `suitedashEmbedBaseUrl` to the SD origin (`https://secure.virtuallaunch.pro/frm`).
4. Pass empty strings for the four required Cal.* fields.
5. Use the shared `SuiteDashFormEmbed` Pattern A in homepage and `/contact`.
6. Add a row to §7.2 above for each form consumed.

---

## 8. Decision log

| Date | Change | Rationale |
|------|--------|-----------|
| 2026-05-09 | TPP adopts Cal.com for /contact bookings; §7.4 rewritten to allow Cal/SD coexistence for SD-led apps | Owner ruling: SD form embeds rendered poorly on TPP's component pages. Cal.com is the canonical pattern across 9 of 10 apps. TPP becomes the first SD-led app with Cal bookings; Owner created tpvlp-support + tpvlp-intro event types. |
