---
title: Canonical Authenticated Dashboard Pages Spec
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [authenticated-pages, bkk-sync, dashboards, obsidian-vault, office-sync, synto-knowledge]
type: suitedash-hierarchy
---

<!--
Status: Authoritative
Last updated: 2026-04-23
Owner: JLW (Principal Engineer review required for changes)
Scope: All 8 apps in the vlp-platform monorepo
Parent: canonical-app-blueprint.md
Reference implementation: apps/tttmp/ (Tax Tools Arcade)
-->

# canonical-dashboard-pages.md — Standard Authenticated Page Specifications

Last updated: 2026-04-23

---

## Purpose

Defines the exact structure, content, endpoints, layout, and interaction patterns for the six standard authenticated pages that every app in the VLP ecosystem must implement. When RC audits any app against this canonical, every discrepancy is a drift item.

**Reference implementation:** `apps/tttmp/` — all six pages are shipped and canonical-compliant. When in doubt, read the TTTMP implementation.

**Relationship to other canonicals:**
- `canonical-site-nav.md` — defines sidebar nav structure and topbar (this canonical defines what's ON the pages)
- `canonical-app-components.md` — defines component primitives (this canonical defines how they're composed into pages)
- `canonical-style.md` — defines design tokens (this canonical references them by name)
- `canonical-api.md` — defines endpoints (this canonical specifies which endpoints each page calls)

---

## 1. Universal Page Requirements

Every authenticated page in every app MUST satisfy ALL of the following. These are not optional. An audit that finds any page missing any of these items reports it as "Fix now."

### 1.1 Page Shell

```
AuthGate (or AuthGuard) — redirects to /sign-in if no session
  └─ AppShell config={platformConfig}
       └─ Page content
```

- `AuthGate` is imported from `@vlp/member-ui`
- `AppShell` is imported from `@vlp/member-ui` and receives the app's `PlatformConfig`
- The page component itself is a client component (`'use client'`) for static-export apps
- Session data is accessed via `useAppShell()` — never via direct fetch inside the page

### 1.2 Page Header

Every page begins with a title block. No exceptions.

```tsx
<div className="mb-8">
  <h1 className="font-sora text-3xl font-extrabold text-white">
    {pageTitle}
  </h1>
  <p className="mt-1 text-white/55 text-[0.95rem]">
    {pageSubtitle}
  </p>
</div>
```

The title and subtitle are NOT configurable per-app — they are fixed strings defined in this canonical for each page (see individual page specs below). This ensures consistency when users navigate between apps.

### 1.3 Container Width

All page content uses the app container width:

```tsx
<div className="max-w-[1200px] mx-auto">
  {/* page content */}
</div>
```

Note: The AppShell's `<main>` already provides `px-8 py-8`. Pages do NOT add their own padding — only `max-w-[1200px] mx-auto` for width constraint. If the page has a narrower content area (e.g., a single-column form), use `max-w-[960px]` (`max-w-narrow`) instead, but the outer wrapper is always `max-w-[1200px]`.

### 1.4 Loading States

Every page that fetches data MUST show a loading state. Two patterns:

**KPI cards:** Render card shells with pulsing placeholder values (`animate-pulse bg-white/10 rounded h-8 w-24`)

**Data tables / lists:** Render 3-5 skeleton rows with pulsing bars matching column widths

Never show a blank page while data loads. Never show a full-page spinner. Always show the page structure (title, card outlines) immediately, with content filling in.

### 1.5 Empty States

Every section that could have zero items MUST show an empty state. Use the `EmptyStateCard` pattern from `canonical-app-components.md` §4.4:

```tsx
<div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-12 text-center">
  <Icon className="mx-auto mb-4 h-12 w-12 text-white/20" />
  <h3 className="text-lg font-semibold text-white/70">{emptyTitle}</h3>
  <p className="mt-2 text-sm text-white/40">{emptyDescription}</p>
  {actionButton && (
    <button className="mt-6 ...">{actionLabel}</button>
  )}
</div>
```

### 1.6 Error States

Every fetch that can fail MUST show an error state. Pattern:

```tsx
<div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6 text-center">
  <p className="text-red-400">{errorMessage}</p>
  <button onClick={retry} className="mt-4 text-sm text-white/60 underline">
    Try again
  </button>
</div>
```

Errors are NEVER swallowed silently. If a fetch fails, the user sees a message and a retry action.

### 1.7 API Calls

All authenticated API calls follow this pattern:

```tsx
const res = await fetch(`${config.apiBaseUrl}/v1/endpoint`, {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
})
```

- `config.apiBaseUrl` comes from `useAppShell()` — never hardcoded
- `credentials: 'include'` is mandatory for all authenticated calls
- POST/PATCH bodies use `JSON.stringify()` with `Content-Type: application/json`

### 1.8 Toast Notifications

Mutations (save, submit, delete) show a toast on success or failure. Toasts are positioned top-right, auto-dismiss after 4 seconds for success, 6 seconds for error.

```tsx
// Success
<div className="fixed top-4 right-4 z-50 rounded-lg bg-green-500/20 border border-green-500/30 px-4 py-3 text-sm text-green-300">
  {successMessage}
</div>

// Error
<div className="fixed top-4 right-4 z-50 rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm text-red-300">
  {errorMessage}
</div>
```

### 1.9 Responsive Behavior

- KPI card grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Data tables: horizontal scroll wrapper on mobile (`overflow-x-auto`)
- Forms: single column on mobile, max-width constrained on desktop
- All touch targets: minimum 44px height on mobile

---

## 2. Dashboard Page

### Route

| App Pattern | Path |
|-------------|------|
| Canonical (`/dashboard/*`) | `/dashboard` |
| VLP (grandfathered) | `/(member)/dashboard` |
| TTMP (grandfathered) | `/app/dashboard` |
| DVLP (grandfathered) | `/operator` |

### Page Header

```
Title:    "Dashboard"
Subtitle: "Welcome back. Here's your overview."
```

### Required Sections (in order)

#### 2.1 KPI Cards Row

A grid of 3-4 KPI cards showing the user's key metrics. Cards use `KPICard` from `@vlp/member-ui`.

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  <KPICard label="..." value="..." icon={...} subtitle="..." />
  ...
</div>
```

**Required KPIs (every app):**

| KPI | Label | Endpoint | Value Source |
|-----|-------|----------|-------------|
| Token Balance | "Game Tokens" / "Transcript Tokens" / app-appropriate label | `GET /v1/tokens/balance/${account_id}` | `balance` or app-specific token field |
| Open Tickets | "Open Tickets" | `GET /v1/support/tickets/by-account/${account_id}` | Count where `status !== 'closed'` |
| Notifications | "Unread" | `GET /v1/notifications/in-app?unreadOnly=1` | `unreadCount` |

**App-specific KPIs (in addition to the three above):**

| App | Additional KPI(s) |
|-----|-------------------|
| TTTMP | "Games Played" from game session data |
| TTMP | "Reports Generated" from transcript history |
| TCVLP | "Claims Filed" from form 843 submissions |
| TMP | "Active Listings" from directory profile status |
| VLP | "Active Bookings" from booking data |
| WLVLP | "Active Sites" from site data |
| DVLP | "API Calls" from usage data |
| GVLP | "Active Games" from game data |

If the app-specific data source doesn't exist yet (status = `planned` in feature matrix), show the KPI card with value "—" and subtitle "Coming soon."

#### 2.2 Recent Activity / Quick Actions

Below the KPI cards, a section with one or both of:

**Recent Activity Feed** (if the app has activity data):
```tsx
<div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
  <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
  {/* Last 5 activities: support tickets, token purchases, game sessions, etc. */}
</div>
```

**Quick Action Cards** (always present):
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
  <Link href="/dashboard/support/new" className="...">
    <LifeBuoy /> New Support Ticket
  </Link>
  <Link href="/dashboard/tokens" className="...">
    <Coins /> Buy Tokens
  </Link>
  <Link href="/dashboard/profile" className="...">
    <User /> Edit Profile
  </Link>
</div>
```

Quick action cards are clickable full-width cards with an icon, label, and optional description. They link to the corresponding dashboard page. The set of quick actions is app-specific but MUST include at minimum: "New Support Ticket", "Buy Tokens" (if tokens apply), and "Edit Profile."

---

## 3. Tokens Page

### Route

| App Pattern | Path |
|-------------|------|
| Canonical | `/dashboard/tokens` |
| VLP (grandfathered) | `/(member)/tokens` |
| TTMP (grandfathered) | `/app/tokens` |

### Page Header

```
Title:    "Tokens"
Subtitle: "Manage your token balance and purchase history."
```

### Required Sections (in order)

#### 3.1 Balance Display

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  <KPICard
    label="{App-specific token name}"
    value="{balance}"
    icon={Coins}
    subtitle="Available tokens"
  />
  <KPICard
    label="Tokens Used"
    value="{total_spent}"
    icon={TrendingDown}
    subtitle="All time"
  />
  <KPICard
    label="Tokens Purchased"
    value="{total_purchased}"
    icon={ShoppingCart}
    subtitle="All time"
  />
</div>
```

**Endpoint:** `GET /v1/tokens/balance/${account_id}`

Token field names vary by app:

| App | Token Field | Display Label |
|-----|-------------|---------------|
| TTTMP | `tax_game_tokens` | "Game Tokens" |
| TTMP | `transcript_tokens` | "Transcript Tokens" |
| TCVLP | `claim_tokens` | "Claim Tokens" |
| VLP | `tax_game_tokens` + `transcript_tokens` | Show both separately |
| All others | App-specific or `tokens` | Per app context |

#### 3.2 Purchase Section

```tsx
<div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6 mb-8">
  <h2 className="text-lg font-semibold text-white mb-4">Buy More Tokens</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {tokenPacks.map(pack => (
      <button
        key={pack.id}
        onClick={() => handlePurchase(pack.priceId)}
        className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-6 text-center
                   hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-colors"
      >
        <div className="text-2xl font-bold text-white">{pack.count}</div>
        <div className="text-sm text-white/50 mt-1">tokens</div>
        <div className="text-lg font-semibold text-brand-primary mt-3">${pack.price}</div>
      </button>
    ))}
  </div>
</div>
```

**Endpoint:** `POST /v1/{app}/checkout/sessions` (or `POST /v1/checkout/session`)
- Must include `metadata.type = 'token_purchase'` and `metadata.token_count`
- Must include `allow_promotion_codes: true`
- On success, redirect to Stripe checkout URL

**Token pack data:** Read from PlatformConfig or hardcode per app. Each pack has: `{ id, count, price, priceId (Stripe) }`.

#### 3.3 Purchase History Table

```tsx
<div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
  <h2 className="text-lg font-semibold text-white mb-4">Purchase History</h2>
  <DataTable
    columns={[
      { key: 'date', label: 'Date' },
      { key: 'type', label: 'Type' },
      { key: 'amount', label: 'Amount' },
      { key: 'tokens', label: 'Tokens' },
      { key: 'status', label: 'Status' },
    ]}
    data={purchases}
    emptyMessage="No purchases yet."
  />
</div>
```

**Endpoint:** `GET /v1/billing/receipts/${account_id}` or `GET /v1/tokens/usage/${account_id}`

**Empty state:** "No purchases yet. Buy your first token pack above."

---

## 4. Affiliate Page

### Route

| App Pattern | Path |
|-------------|------|
| Canonical | `/dashboard/affiliate` |
| VLP (grandfathered) | `/(member)/affiliate` |
| TTMP (grandfathered) | `/app/affiliate` |

### Page Header

```
Title:    "Affiliate Program"
Subtitle: "Earn 20% lifetime commission on every referral."
```

### Authentication Requirement

Per `canonical-site-nav.md`: Affiliate pages are authenticated across all 8 platforms. No public/marketing version permitted. Page must sit behind `AuthGate` with session check.

### Required Sections (in order)

#### 4.1 Referral Link

```tsx
<div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6 mb-8">
  <h2 className="text-lg font-semibold text-white mb-2">Your Referral Link</h2>
  <p className="text-sm text-white/40 mb-4">Share this link to earn 20% on every purchase your referrals make — for life.</p>
  <div className="flex items-center gap-3">
    <input
      type="text"
      readOnly
      value={referralLink}
      className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/70 font-mono"
    />
    <button
      onClick={copyToClipboard}
      className="rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  </div>
</div>
```

**Referral link format:** `https://{app-domain}/?ref={account_id}` or as returned by `GET /v1/affiliates/${account_id}`

**Endpoint:** `GET /v1/affiliates/${account_id}` — returns affiliate data including referral link. If 404, the user is not yet registered as an affiliate.

#### 4.2 Stripe Connect Onboarding

If the user is NOT yet onboarded to Stripe Connect:

```tsx
<div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-6 mb-8">
  <h2 className="text-lg font-semibold text-amber-300 mb-2">Complete Your Payout Setup</h2>
  <p className="text-sm text-white/50 mb-4">Connect your Stripe account to receive commission payouts.</p>
  <button
    onClick={handleStripeConnect}
    className="rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-400 transition-colors"
  >
    Connect Stripe Account
  </button>
</div>
```

**Endpoint:** `POST /v1/affiliates/connect/onboard` — returns Stripe Connect onboarding URL. Redirect user to it.

If the user IS onboarded, show a green confirmation:

```tsx
<div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4 mb-8 flex items-center gap-3">
  <CheckCircle className="h-5 w-5 text-green-400" />
  <span className="text-sm text-green-300">Stripe payouts connected</span>
</div>
```

#### 4.3 Commission KPIs

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <KPICard label="Total Earned" value="${totalEarned}" icon={DollarSign} />
  <KPICard label="Total Referrals" value="{referralCount}" icon={Users} />
  <KPICard label="Pending Payout" value="${pendingPayout}" icon={Clock} />
</div>
```

**Endpoint:** `GET /v1/affiliates/${account_id}` — returns `total_earned`, `referral_count`, `pending_payout`

#### 4.4 Referral Events Table

```tsx
<DataTable
  columns={[
    { key: 'date', label: 'Date' },
    { key: 'referral', label: 'Referral' },
    { key: 'event', label: 'Event' },
    { key: 'commission', label: 'Commission' },
    { key: 'status', label: 'Status' },
  ]}
  data={events}
  emptyMessage="No referral activity yet. Share your link to get started."
/>
```

**Endpoint:** `GET /v1/affiliates/${account_id}/events`

**Status badges:** `pending` = amber, `paid` = green, `cancelled` = gray

---

## 5. Profile Page

### Route

| App Pattern | Path |
|-------------|------|
| Canonical | `/dashboard/profile` |
| VLP (grandfathered) | `/(member)/profile` |
| TTMP (grandfathered) | `/app/profile` |

### Page Header

```
Title:    "Profile"
Subtitle: "Manage your professional information."
```

### Required Sections (in order)

#### 5.1 Profile Completeness Indicator

```tsx
<div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 mb-8 flex items-center justify-between">
  <div>
    <span className="text-sm text-white/60">Profile completeness</span>
    <span className="ml-2 text-lg font-bold text-white">{completeness}%</span>
  </div>
  <div className="w-48 h-2 rounded-full bg-white/[0.06] overflow-hidden">
    <div
      className="h-full rounded-full bg-brand-primary transition-all duration-500"
      style={{ width: `${completeness}%` }}
    />
  </div>
</div>
```

**Completeness calculation (client-side):** Count non-empty fields out of total profile fields. Fields: `name`, `email`, `phone`, `firm`, `credentials`, `bio`, `avatar`. Formula: `Math.round((filledFields / totalFields) * 100)`.

#### 5.2 Avatar Section

```tsx
<div className="flex items-center gap-6 mb-8">
  <div className="relative">
    {avatar ? (
      <img src={avatar} className="h-20 w-20 rounded-full object-cover" />
    ) : (
      <div className="h-20 w-20 rounded-full bg-brand-primary/20 flex items-center justify-center">
        <User className="h-8 w-8 text-brand-primary" />
      </div>
    )}
    <button className="absolute bottom-0 right-0 rounded-full bg-brand-primary p-1.5 text-white">
      <Camera className="h-3.5 w-3.5" />
    </button>
  </div>
  <div>
    <h2 className="text-lg font-semibold text-white">{name || 'Add your name'}</h2>
    <p className="text-sm text-white/40">{email}</p>
  </div>
</div>
```

**Upload flow:**
1. Click camera icon → file input opens
2. `POST /v1/accounts/photo-upload-init` with `{ account_id, content_type }` → returns `upload_url`
3. `PUT {upload_url}` with file body → upload to R2
4. `POST /v1/accounts/photo-upload-complete` with `{ account_id }` → confirms and updates profile

#### 5.3 Profile Form

A form with all editable profile fields. Uses the canonical input styling from `canonical-style.md`.

**Required fields (all apps):**

| Field | Type | Label | Endpoint Field |
|-------|------|-------|----------------|
| Full Name | text | "Full Name" | `name` |
| Phone | tel | "Phone Number" | `phone` |
| Firm / Company | text | "Firm / Company" | `firm` |
| Bio | textarea (4 rows) | "Bio" | `bio` |

**Optional fields (app-specific):**

| App | Additional Fields |
|-----|-------------------|
| TTMP, TCVLP, TMP, VLP | Credentials (select: CPA, EA, Attorney, Other), State (select), License # (text) |
| TTTMP | none additional |
| DVLP | GitHub URL (url), Company Role (text) |
| GVLP | Studio Name (text), Platform (select) |
| WLVLP | Business Type (select), Website URL (url) |

**Phone input:** MUST use the canonical §10 normalization pattern from `canonical-style.md`. Auto-format to `(XXX) XXX-XXXX` on blur, store as `+1XXXXXXXXXX`.

**Save behavior:**
- Button: "Save Changes" — disabled when form is pristine or invalid
- `PATCH /v1/profiles/${professional_id}` with changed fields only
- On success: green toast "Profile updated"
- On error: red toast with error message
- Button shows loading spinner during save

#### 5.4 Notification Preferences

Below the profile form, a section for notification preferences:

```tsx
<div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6 mt-8">
  <h2 className="text-lg font-semibold text-white mb-4">Notification Preferences</h2>
  <div className="space-y-4">
    <label className="flex items-center justify-between">
      <span className="text-sm text-white/70">Email notifications</span>
      <Toggle checked={emailNotifs} onChange={...} />
    </label>
    <label className="flex items-center justify-between">
      <span className="text-sm text-white/70">SMS notifications</span>
      <Toggle checked={smsNotifs} onChange={...} />
    </label>
  </div>
</div>
```

**Endpoint:** `GET /v1/notifications/preferences/${account_id}` to load, `PATCH /v1/notifications/preferences/${account_id}` to save.

---

## 6. Account Page

### Route

| App Pattern | Path |
|-------------|------|
| Canonical | `/dashboard/account` |
| VLP (grandfathered) | `/(member)/account` |
| TTMP (grandfathered) | `/app/account` |

### Page Header

```
Title:    "Account"
Subtitle: "Manage your account settings and subscription."
```

### Required Sections (in order)

#### 6.1 Account Info Card

```tsx
<div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6 mb-8">
  <h2 className="text-lg font-semibold text-white mb-4">Account Information</h2>
  <div className="space-y-3">
    <div className="flex justify-between">
      <span className="text-sm text-white/50">Email</span>
      <span className="text-sm text-white">{email}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-sm text-white/50">Account ID</span>
      <span className="text-sm text-white/40 font-mono text-xs">{account_id}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-sm text-white/50">Member since</span>
      <span className="text-sm text-white">{formatDate(created_at)}</span>
    </div>
  </div>
</div>
```

**Endpoint:** `GET /v1/accounts/${account_id}`

#### 6.2 Subscription / Plan Card

```tsx
<div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6 mb-8">
  <h2 className="text-lg font-semibold text-white mb-4">Subscription</h2>
  <div className="flex items-center justify-between">
    <div>
      <div className="text-white font-semibold">{planName}</div>
      <div className="text-sm text-white/40">{planDescription}</div>
    </div>
    <button
      onClick={openBillingPortal}
      className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm text-white/70 hover:bg-white/[0.04] transition-colors"
    >
      Manage Billing
    </button>
  </div>
</div>
```

**Endpoint:** `GET /v1/memberships/by-account/${account_id}` for plan data. `POST /v1/billing/portal/sessions` to open Stripe billing portal (redirect to returned URL).

If the user has no subscription, show:

```tsx
<div className="text-sm text-white/40">Free tier — <Link href="/pricing" className="text-brand-primary underline">upgrade your plan</Link></div>
```

#### 6.3 Security Section

```tsx
<div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6 mb-8">
  <h2 className="text-lg font-semibold text-white mb-4">Security</h2>
  <div className="flex items-center justify-between">
    <div>
      <div className="text-sm text-white/70">Two-factor authentication</div>
      <div className="text-xs text-white/40">{twoFAEnabled ? 'Enabled' : 'Not enabled'}</div>
    </div>
    <button className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm text-white/70 hover:bg-white/[0.04] transition-colors">
      {twoFAEnabled ? 'Manage 2FA' : 'Enable 2FA'}
    </button>
  </div>
</div>
```

**Endpoint:** `GET /v1/auth/2fa/status/${account_id}`

2FA setup flow (if enabling):
1. `POST /v1/auth/2fa/enroll/init` → returns QR code / secret
2. User scans QR, enters code
3. `POST /v1/auth/2fa/enroll/verify` with code → confirms enrollment

#### 6.4 Danger Zone

```tsx
<div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
  <h2 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h2>
  <p className="text-sm text-white/40 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
  <button
    onClick={confirmDelete}
    className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
  >
    Delete Account
  </button>
</div>
```

**Delete flow:**
1. Click → confirmation modal: "Type DELETE to confirm"
2. On confirm: `DELETE /v1/accounts/${account_id}`
3. On success: sign out, redirect to homepage
4. Modal uses `z-modal` (z-index 30 per blueprint §4.19)

---

## 7. Support Page

### Route

| App Pattern | Path |
|-------------|------|
| Canonical | `/dashboard/support` |
| VLP (grandfathered) | `/(member)/support` |
| TTMP (grandfathered) | `/app/support` |

### Page Header

```
Title:    "Support"
Subtitle: "View your tickets and get help."
```

### Authentication Requirement

Per `canonical-site-nav.md`: Support pages are authenticated across all 8 platforms. No public version permitted. Page must sit behind `AuthGate`.

### Required Sections (in order)

#### 7.1 Support KPIs

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <KPICard label="Total Tickets" value="{total}" icon={LifeBuoy} />
  <KPICard label="Open" value="{openCount}" icon={AlertCircle} />
  <KPICard label="In Progress" value="{inProgressCount}" icon={Clock} />
  <KPICard label="Resolved" value="{resolvedCount}" icon={CheckCircle} />
</div>
```

**Endpoint:** `GET /v1/support/tickets/by-account/${account_id}` — count by status client-side.

#### 7.2 New Ticket Button

```tsx
<div className="flex justify-end mb-6">
  <Link
    href="/dashboard/support/new"
    className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
  >
    New Ticket
  </Link>
</div>
```

Or, if the app uses an inline form instead of a separate page, a button that opens a modal.

#### 7.3 Ticket List Table

```tsx
<DataTable
  columns={[
    { key: 'id', label: 'Ticket ID' },
    { key: 'subject', label: 'Subject' },
    { key: 'status', label: 'Status' },
    { key: 'category', label: 'Category' },
    { key: 'created_at', label: 'Created' },
    { key: 'updated_at', label: 'Updated' },
  ]}
  data={tickets}
  onRowClick={(ticket) => router.push(`/dashboard/support/ticket?id=${ticket.id}`)}
  emptyMessage="No support tickets yet."
/>
```

**Status badges** use the five-status color scheme:

| Status | Badge Classes |
|--------|--------------|
| `open` | `bg-green-500/20 text-green-400` |
| `in_progress` | `bg-blue-500/20 text-blue-400` |
| `waiting_on_user` | `bg-amber-500/20 text-amber-400` |
| `resolved` | `bg-violet-500/20 text-violet-400` |
| `closed` | `bg-gray-500/20 text-gray-400` |

**Row click behavior:** Navigates to the ticket detail view. For static-export apps, use query-string routing: `/dashboard/support/ticket?id={ticket_id}`. For SSR apps, use dynamic segments: `/dashboard/support/{ticket_id}`.

**Sorting:** Default sort by `updated_at` descending (most recent activity first).

### 7.4 New Ticket Page / Modal

Separate page at `/dashboard/support/new` or inline modal. Contains:

```tsx
<form>
  <Input label="Subject" required maxLength={200} />
  <Select label="Category" options={['General', 'Billing', 'Technical', 'Feature Request']} />
  <Select label="Priority" options={['Low', 'Normal', 'High', 'Urgent']} defaultValue="Normal" />
  <Textarea label="Description" required rows={6} placeholder="Describe your issue..." />
  <Button type="submit" loading={submitting}>Submit Ticket</Button>
</form>
```

**Endpoint:** `POST /v1/support/tickets` with `{ subject, category, priority, message, platform: '{app_abbrev}' }`
- MUST include `platform` field set to the app's abbreviation (lowercase: `tttmp`, `tcvlp`, etc.)
- On success: toast "Ticket submitted" + redirect to ticket list or detail view
- On success: the Worker fires `notifyTicketCreated()` (Resend email + in-app notification) — no frontend action needed

### 7.5 Ticket Detail View

Separate page at `/dashboard/support/ticket?id={ticket_id}` (static export) or `/dashboard/support/{ticket_id}` (SSR).

**Required elements:**

```
← Back to Support (link)

[Subject]                                    [Status Badge]
Ticket #{id} · {category} · {relative_time}

[Original message body]

--- Message Thread ---
[Message 1 - sender indicator, body, timestamp]
[Message 2 - sender indicator, body, timestamp]
...

[Reply form - textarea + submit button]
  (disabled with Lock icon + message when status === 'closed')

[Status actions]
  - "Close Ticket" button when status === 'resolved'
  - "Reopen Ticket" button when status === 'closed'
```

**Endpoints:**
- `GET /v1/support/tickets/${ticket_id}` — ticket data
- `GET /v1/support/messages?ticket_id=${ticket_id}` — message thread
- `POST /v1/support/messages` with `{ ticket_id, message, action: 'reply' }` — post reply
- `PATCH /v1/support/tickets/${ticket_id}` with `{ status }` — close/reopen

**Message styling:**
- User messages (`sender_type === 'user'`): right-aligned or `bg-brand-primary/10` background
- Support messages (`sender_type === 'support'`): left-aligned or `bg-white/[0.04]` background
- Timestamps: relative format ("2 hours ago") with full date on hover via `title` attribute

---

## 8. Notifications Page

### Route

| App Pattern | Path |
|-------------|------|
| Canonical | `/dashboard/notifications` |
| VLP (grandfathered) | `/(member)/notifications` |
| TTMP (grandfathered) | `/app/notifications` |

### Page Header

```
Title:    "Notifications"
Subtitle: "Stay up to date on your activity."
```

### Note

This page is the full-page destination linked from the bell icon dropdown's "View all" link. The bell icon dropdown (in MemberTopbar) is the primary notification surface — this page is the archive.

### Required Sections

#### 8.1 Mark All Read

```tsx
<div className="flex justify-end mb-6">
  <button
    onClick={markAllRead}
    disabled={unreadCount === 0}
    className="text-sm text-white/50 hover:text-white transition-colors disabled:opacity-30"
  >
    Mark all as read
  </button>
</div>
```

**Endpoint:** `POST /v1/notifications/in-app/mark-all-read` with `{ account_id }`

#### 8.2 Notification List

```tsx
<div className="space-y-2">
  {notifications.map(n => (
    <div
      key={n.id}
      onClick={() => handleNotificationClick(n)}
      className={`rounded-lg border p-4 cursor-pointer transition-colors
        ${n.read
          ? 'border-white/[0.04] bg-transparent hover:bg-white/[0.02]'
          : 'border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/10'
        }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">{n.title}</h3>
          <p className="text-xs text-white/40 mt-1">{n.message}</p>
        </div>
        <span className="text-xs text-white/30 whitespace-nowrap ml-4">{relativeTime(n.created_at)}</span>
      </div>
    </div>
  ))}
</div>
```

**Endpoint:** `GET /v1/notifications/in-app?account_id=${account_id}` — returns all notifications, most recent first.

**Click behavior:** Mark as read (`PATCH /v1/notifications/in-app/${notification_id}`) and navigate to `n.link` if present.

**Empty state:** "No notifications yet."

**Pagination:** If > 20 notifications, implement "Load more" button (not infinite scroll).

---

## 9. Audit Checklist

When RC audits any app against this canonical, check each item. Every "No" is a drift item.

### Per-Page Checklist (run for each of the 6 pages)

| # | Check | How to verify |
|---|-------|---------------|
| 1 | Page exists at the correct route | `ls apps/{app}/app/{route}/` |
| 2 | Wrapped in AuthGate + AppShell | `grep -n "AuthGate\|AuthGuard\|AppShell" {page_file}` |
| 3 | Uses `useAppShell()` for session/config (not direct fetch) | `grep -n "useAppShell\|config.apiBaseUrl" {page_file}` |
| 4 | Page title matches canonical (font-sora, text-3xl, font-extrabold, text-white) | Visual or `grep "font-sora\|text-3xl\|font-extrabold"` |
| 5 | Page subtitle matches canonical (text-white/55, text-[0.95rem]) | Visual or grep |
| 6 | Container width is `max-w-[1200px] mx-auto` or `max-w-6xl` | `grep "max-w-" {page_file}` |
| 7 | Loading state exists (skeleton/pulse, not spinner, not blank) | `grep "animate-pulse\|loading\|skeleton" {page_file}` |
| 8 | Empty state exists for data sections | `grep -i "no.*yet\|empty\|emptyMessage" {page_file}` |
| 9 | Error state exists with retry | `grep -i "error\|try again\|retry" {page_file}` |
| 10 | API calls use `credentials: 'include'` | `grep "credentials" {page_file}` |
| 11 | API calls use `config.apiBaseUrl` (not hardcoded URL) | `grep "apiBaseUrl\|apiBase" {page_file}` |
| 12 | Mutations show toast feedback | `grep -i "toast\|success\|saved\|updated" {page_file}` |

### Cross-Page Checklist

| # | Check | How to verify |
|---|-------|---------------|
| 13 | All 6 pages exist | `ls apps/{app}/app/dashboard/` |
| 14 | Sidebar nav has links to all 6 pages | Check `platformConfig.navSections` |
| 15 | KPI cards use `KPICard` from `@vlp/member-ui` (not custom) | `grep "KPICard\|@vlp/member-ui" {page_files}` |
| 16 | Data tables use `DataTable` from `@vlp/member-ui` (not custom) | `grep "DataTable\|@vlp/member-ui" {page_files}` |
| 17 | Status badges use the five-status color scheme from §7.3 | Visual or grep for badge classes |
| 18 | Phone inputs use §10 normalization | `grep "phone\|formatPhone\|normalizePhone" {profile_page}` |
| 19 | All external links open in new tab | `grep "target.*_blank\|rel.*noopener" {page_files}` |
| 20 | No hardcoded API URLs | `grep -rn "api\.virtuallaunch\|api\.taxmonitor\|localhost" apps/{app}/app/dashboard/` |

### Drift Classification

| Category | Criteria |
|----------|----------|
| **Fix now** | Page missing entirely, no AuthGate, hardcoded API URLs, no loading state |
| **Fix with next feature** | Wrong container width, missing empty state, custom KPI card instead of shared, missing toast |
| **Fix later** | Subtitle wording differs, badge colors slightly off, missing retry on error |

---

## 10. Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-23 | Created canonical with TTTMP as reference implementation | TTTMP has all 6 pages shipped and canonicalized; other apps have partial or divergent implementations |
| 2026-04-23 | Five-status ticket lifecycle (open, in_progress, waiting_on_user, resolved, closed) | Shipped in Worker + TTTMP + SCALE admin; replaces prior 3-status model |
| 2026-04-23 | Query-string routing for ticket detail on static-export apps | Static export cannot use dynamic segments without `generateStaticParams`; ticket IDs are unknown at build time |
| 2026-04-23 | Phone normalization mandatory on Profile page | Per canonical-style.md §10; prevents inconsistent phone storage across platforms |
| 2026-04-23 | Notifications page is archive, bell dropdown is primary surface | Users interact with notifications via topbar; full page is for history and "View all" |

Append-only. Do not rewrite prior entries.
