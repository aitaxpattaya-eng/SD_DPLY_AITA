---
title: Canonical API Master Registry (SuiteDash Onboarding Broker)
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [api, bkk-sync, endpoints, obsidian-vault, office-sync, suitedash-broker, synto-knowledge]
type: suitedash-hierarchy
---

<!--
Status: Authoritative
Last updated: 2026-06-12
Owner: JLW (Principal Engineer review required for changes)
Scope: All 10 apps in the vlp-platform monorepo
Parent: canonical-app-blueprint.md
-->

# canonical-api.md

Master API endpoint registry for the VLP Worker (`apps/worker/src/index.js`).

Last updated: 2026-06-12
Total routes: 408 (in the `ROUTES` array) + 4 handled directly in the `fetch()` dispatch (`/unsubscribe`, `/internal/backfill-canspam-footer`, `/internal/backfill-asset-pages`, `/tavlp/*` R2 passthrough)

> **Changelog (2026-06-12):** Synced to Worker source per the validated `worker-inventory-2026-06-12` report — **138 undocumented routes added**, **1 corrected** (`/v1/scale/prospects/:slug` now documents both `GET` and `PATCH`). Drift was one-directional (source ahead of docs); 0 phantom routes. New platform block added for GSVLP (§8c); TAVLP (§8a) expanded from passthrough-only to its full API.

**TPP exception:** Tax Prep Pro (`apps/taxprep`) is SD-led and was originally shipped with no Worker routes (Deviation 4). As of 2026-05-10, one narrowly-scoped exception exists: `POST /v1/taxprep/onboarding` brokers SuiteDash `POST /secure-api/company` for the `/sign-in` create-account flow. All other client-side functionality still runs inside the SuiteDash workspace; the Next.js site remains lead-gen-and-onboarding only. Discovery / Demo bookings now use Cal.com (per canonical-cal-events.md §3); only the SD-API-brokered onboarding route lives in the Worker for TPP. Do not add additional `/v1/taxprep/*` endpoints without Principal review — the narrowness of the exception is load-bearing.

---

## 1. Shared Endpoints (All Platforms)

### Authentication

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/v1/auth/session` | Get current user session | Yes |
| POST | `/v1/auth/logout` | Logout and terminate session | Yes |
| GET | `/v1/auth/google/start` | Initiate Google OAuth flow | No |
| GET | `/v1/auth/google/callback` | Google OAuth callback | No |
| POST | `/v1/auth/magic-link/request` | Request magic link email | No |
| GET | `/v1/auth/magic-link/verify` | Verify magic link token | No |
| GET | `/v1/auth/handoff/exchange` | Exchange handoff token for session | No |
| GET | `/v1/auth/sso/oidc/start` | Initiate OIDC SSO flow | No |
| GET | `/v1/auth/sso/oidc/callback` | OIDC callback handler | No |
| GET | `/v1/auth/sso/saml/start` | Initiate SAML SSO flow | No |
| POST | `/v1/auth/sso/saml/acs` | SAML Assertion Consumer Service | No |
| GET | `/v1/auth/2fa/status/:account_id` | Check 2FA enrollment status | Yes |
| POST | `/v1/auth/2fa/enroll/init` | Start TOTP 2FA enrollment | Yes |
| POST | `/v1/auth/2fa/enroll/verify` | Verify 2FA enrollment | Yes |
| POST | `/v1/auth/2fa/challenge/verify` | Verify 2FA challenge code | Yes |
| POST | `/v1/auth/2fa/disable` | Disable 2FA for account | Yes |

### Accounts & Profiles

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/accounts` | Create new account | No |
| GET | `/v1/accounts/by-email/:email` | Look up account by email | No |
| GET | `/v1/accounts/:account_id` | Get account details | Yes |
| PATCH | `/v1/accounts/:account_id` | Update account information | Yes |
| DELETE | `/v1/accounts/:account_id` | Delete account | Yes |
| GET | `/v1/accounts/preferences/:account_id` | Get user preferences | Yes |
| PATCH | `/v1/accounts/preferences/:account_id` | Update user preferences | Yes |
| POST | `/v1/accounts/photo-upload-init` | Initialize photo upload | Yes |
| POST | `/v1/accounts/photo-upload-complete` | Complete photo upload | Yes |
| GET | `/v1/accounts/:account_id/status` | Get account status | Yes |
| GET | `/v1/profiles` | List professional profiles | No |
| POST | `/v1/profiles` | Create professional profile | Yes |
| GET | `/v1/profiles/public/:professional_id` | Get public profile | No |
| GET | `/v1/profiles/:professional_id` | Get profile details | Yes |
| PATCH | `/v1/profiles/:professional_id` | Update profile | Yes |

### Membership & Billing

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/memberships` | Create membership | Yes |
| GET | `/v1/memberships/by-account/:account_id` | Get account memberships | Yes |
| GET | `/v1/memberships/:membership_id` | Get membership details | Yes |
| PATCH | `/v1/memberships/:membership_id` | Update membership | Yes |
| GET | `/v1/billing/config` | Get billing configuration | No |
| GET | `/v1/pricing` | Get pricing information | No |
| POST | `/v1/billing/customers` | Create billing customer | Yes |
| GET | `/v1/billing/payment-methods/:account_id` | Get payment methods | Yes |
| POST | `/v1/billing/payment-methods/attach` | Attach payment method | Yes |
| POST | `/v1/billing/setup-intents` | Create Stripe setup intent | Yes |
| POST | `/v1/billing/payment-intents` | Create Stripe payment intent | Yes |
| POST | `/v1/billing/subscriptions` | Create subscription | Yes |
| PATCH | `/v1/billing/subscriptions/:membership_id` | Update subscription | Yes |
| POST | `/v1/billing/subscriptions/:membership_id/cancel` | Cancel subscription | Yes |
| POST | `/v1/billing/portal/sessions` | Create billing portal session | Yes |
| POST | `/v1/billing/tokens/purchase` | Purchase tokens via billing | Yes |
| GET | `/v1/billing/receipts/:account_id` | Get billing receipts | Yes |
| POST | `/v1/billing/connect/onboard` | Initiate Stripe Connect onboarding flow | Yes |
| GET | `/v1/billing/connect/status` | Check Stripe Connect account status | Yes |
| GET | `/v1/billing/payouts` | Retrieve professional payout history | Yes |

### Checkout

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/checkout/session` | Create checkout session | Yes |
| POST | `/v1/checkout/sessions` | Create checkout sessions (batch) | Yes |
| GET | `/v1/checkout/status` | Get checkout status | Yes |

### Webhooks

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/webhooks/stripe` | Stripe webhook handler | Signature |
| POST | `/v1/webhooks/twilio` | Twilio webhook handler | No |
| POST | `/v1/webhooks/cal` | Cal.com webhook handler | Signature |
| POST | `/v1/clickup/webhook` | Ingest ClickUp task status changes | Signature |
| POST | `/v1/close/webhook` | Sync Close call results back to ClickUp | Signature |

### Calendar & Bookings

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/v1/cal/oauth/start` | Initiate Cal.com OAuth | Yes |
| GET | `/v1/cal/pro/oauth/start` | Initiate Cal.com Pro OAuth | Yes |
| GET | `/v1/cal/oauth/callback` | Cal.com OAuth callback | No |
| GET | `/cal/app/oauth/callback` | Cal.com app OAuth callback | No |
| GET | `/v1/cal/status` | Get Cal.com connection status | Yes |
| GET | `/v1/calcom/status` | Get Cal.com status | Yes |
| POST | `/v1/calcom/disconnect` | Disconnect Cal.com | Yes |
| GET | `/v1/calcom/bookings` | Get Cal.com bookings | Yes |
| GET | `/v1/calcom/stats` | Get Cal.com statistics | Yes |
| GET | `/v1/google/oauth/start` | Initiate Google Calendar OAuth | Yes |
| GET | `/v1/google/oauth/callback` | Google Calendar OAuth callback | No |
| GET | `/v1/google/status` | Get Google Calendar status | Yes |
| GET | `/v1/google/events` | Get Google Calendar events | Yes |
| GET | `/v1/calendar/events` | Get calendar events | Yes |
| POST | `/v1/bookings` | Create booking | Yes |
| GET | `/v1/bookings/by-account/:account_id` | Get bookings for account | Yes |
| GET | `/v1/bookings/by-professional/:professional_id` | Get professional bookings | Yes |
| GET | `/v1/bookings/:booking_id` | Get booking details | Yes |
| PATCH | `/v1/bookings/:booking_id` | Update booking | Yes |

### Support & Notifications

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/contact/submit` | Submit contact form | No |
| POST | `/v1/leads/chatbot` | Submit chatbot lead (anonymous) | No |
| POST | `/v1/leads/freebie` | Capture freebie lead email and metadata | No |
| GET | `/v1/leads/freebie/unsubscribe` | Unsubscribe from freebie drip emails (HMAC link) | No (link) |
| POST | `/v1/support/tickets` | Create support ticket | Yes |
| GET | `/v1/support/tickets/by-account/:account_id` | Get account tickets | Yes |
| GET | `/v1/support/tickets/:ticket_id` | Get ticket details | Yes |
| PATCH | `/v1/support/tickets/:ticket_id` | Update ticket | Yes |
| POST | `/v1/support/messages` | Post support message | Yes |
| GET | `/v1/support/messages` | Get messages by ticket_id | Yes |
| POST | `/v1/notifications/in-app` | Create in-app notification | Yes |
| GET | `/v1/notifications/in-app` | Get in-app notifications (supports unreadOnly=1; returns unreadCount) | Yes |
| PATCH | `/v1/notifications/in-app/:notification_id` | Mark notification read | Yes |
| POST | `/v1/notifications/in-app/mark-all-read` | Mark all notifications read | Yes |
| GET | `/v1/notifications/preferences/:account_id` | Get notification prefs | Yes |
| PATCH | `/v1/notifications/preferences/:account_id` | Update notification prefs | Yes |
| POST | `/v1/notifications/sms/send` | Send SMS notification | Yes |

### Tokens

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/v1/tokens/balance/:account_id` | Get token balance | Yes |
| POST | `/v1/tokens/spend` | Spend tokens | Yes |
| POST | `/v1/tokens/purchase` | Purchase tokens | Yes |
| GET | `/v1/tokens/pricing` | Get token pricing | No |
| GET | `/v1/tokens/usage/:account_id` | Get token usage history | Yes |
| POST | `/v1/tokens/consume` | Consume tokens | Yes |
| POST | `/v1/tokens/credit` | Credit tokens | Yes |

### Tools & Transcripts

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/tools/form2848` | Process Form 2848 | Yes |
| POST | `/v1/tools/2848/generate` | Generate Form 2848 | Yes |
| POST | `/v1/tools/transcript-parser` | Parse transcript | Yes |
| GET | `/v1/tools/transcript-parser/history/:account_id` | Transcript parser history | Yes |
| POST | `/v1/transcripts/upload` | Upload transcript | Yes |
| POST | `/v1/transcripts/jobs` | Create transcript job | Yes |
| GET | `/v1/transcripts/jobs/:job_id` | Get transcript job status | Yes |
| POST | `/v1/transcripts/preview` | Preview transcript | Yes |
| GET | `/v1/transcripts/reports` | Get transcript reports | Yes |
| GET | `/v1/transcripts/report-data` | Get report data | Yes |
| POST | `/v1/transcripts/report-link` | Create report link | Yes |
| GET | `/v1/transcripts/report` | Get report (public link) | No |
| GET | `/v1/transcripts/report/data` | Get report data (public) | No |
| POST | `/v1/transcripts/report-email` | Email transcript report | Yes |
| GET | `/v1/transcripts/purchases` | Get transcript purchases | Yes |
| GET | `/v1/pricing/transcripts` | Get transcript pricing | No |
| POST | `/v1/compliance/report-generate` | Generate compliance report | Yes |

### Affiliates & Referrals

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/affiliates/connect/onboard` | Onboard affiliate (Stripe Connect) | No |
| GET | `/v1/affiliates/connect/callback` | Affiliate OAuth callback | No |
| GET | `/v1/affiliates/:account_id` | Get affiliate details | Yes |
| GET | `/v1/affiliates/:account_id/events` | Get affiliate events | Yes |
| POST | `/v1/affiliates/payout/request` | Request affiliate payout | Yes |
| GET | `/v1/affiliates/payout/:payout_id` | Get payout details | Yes |
| GET | `/v1/ref/:code` | Get referral details | No |

### Inquiries

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/inquiries` | Create inquiry | Yes |
| GET | `/v1/inquiries` | Get inquiries | Yes |
| GET | `/v1/inquiries/:inquiry_id` | Get inquiry details | Yes |
| PATCH | `/v1/inquiries/:inquiry_id` | Update inquiry | Yes |
| POST | `/v1/inquiries/:inquiry_id/respond` | Respond to inquiry | Yes |

### Dashboard & Games

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/v1/dashboard` | Get dashboard data | Yes |
| GET | `/v1/games/access` | Check game access | Yes |

### R2 Storage

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/v1/r2/*` | Read from R2 storage | Yes |
| PUT | `/v1/r2/*` | Write to R2 storage | Yes |

### Admin (Operator Only)

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/v1/admin/tokens/grant` | Grant tokens to user | Admin |
| GET | `/v1/admin/support/tickets` | List all support tickets | Admin |
| PATCH | `/v1/admin/support/tickets/:ticket_id` | Update ticket (admin) | Admin |
| GET | `/v1/admin/stats` | Get platform statistics | Admin |
| GET | `/v1/admin/accounts/:account_id` | Get account (admin) | Admin |
| GET | `/v1/admin/analytics/all` | Analytics across platforms | Admin |
| GET | `/v1/admin/analytics/:platform` | Platform analytics | Admin |
| GET | `/v1/analytics/posthog/repo/:zone` | PostHog-backed per-zone behavioral analytics (pageviews-by-path, signups, purchases, revenue, 3-step funnel). Requires `POSTHOG_PERSONAL_API_KEY` + `POSTHOG_PROJECT_ID` Worker secrets. Returns `collecting:true` with zeroed counts when PostHog has insufficient data. | Admin |
| GET | `/v1/admin/scale/workflow` | Scale workflow info | Admin |
| GET | `/v1/admin/scale/prospects/search` | Search prospects | Admin |
| GET | `/v1/admin/scale/prospects/:slug` | Get prospect details | Admin |
| GET | `/v1/admin/bookings` | List all bookings | Admin |
| GET | `/v1/admin/session-check` | Lightweight admin session probe | Admin |
| GET | `/v1/analytics/posthog/pages/:platform` | Query PostHog for platform pageviews | Admin |
| GET | `/v1/admin/scale/prospects/:slug/engagement` | List prospect PostHog events per slug | Admin |
| GET | `/v1/admin/scale/prospects/:slug/form-submissions` | Get prospect form submission history | Admin |
| POST | `/v1/admin/scale/build-email-index` | Index email-to-slug mappings in KV | Admin |
| POST | `/v1/admin/scale/check-bounces` | Find bounced emails and update queues | Admin |
| GET | `/v1/admin/crm/contacts/search` | Search CRM contacts with filters | Admin |
| GET | `/v1/admin/crm/contacts/:id` | Retrieve single contact detail | Admin |
| PATCH | `/v1/admin/crm/contacts/:id/status` | Update contact call status and log | Admin |
| POST | `/v1/admin/crm/activities` | Create CRM activity record | Admin |
| POST | `/v1/admin/crm/backfill` | Phased CRM contact projection sync | Admin |
| POST | `/v1/admin/clickup-backfill` | Backfill already-active ClickUp tasks | Admin |
| POST | `/v1/admin/clickup-url-backfill` | Bulk-write record URLs to task fields | Admin |
| POST | `/v1/admin/leadpull-create` | Generate and reconcile EA·CA lead list | Admin |
| GET | `/v1/admin/gsvlp/backfill-status` | Return GSVLP ClickUp backfill cron cursor | Admin |
| GET | `/v1/admin/gsvlp/reconcile-status` | Return GSVLP ClickUp reconcile cron cursor | Admin |
| GET | `/v1/admin/gsvlp/outcome-reconcile-status` | Return GSVLP outcome-reconcile cron cursor | Admin |
| GET | `/v1/admin/gsvlp/address-status` | Return GSVLP ClickUp address-only cron cursor | Admin |
| GET | `/v1/admin/gsvlp/foia-migration-status` | Return GSVLP FOIA master migration cron cursor | Admin |
| GET | `/v1/admin/gsvlp/email-backfill-status` | Return GSVLP Gmail sent-email backfill cron cursor | Admin |
| GET | `/v1/admin/gsvlp/commissions` | Admin list all commissions across all setters | Admin |
| POST | `/v1/admin/gsvlp/commissions/:commissionId/mark-paid` | Admin flip commission status to paid | Admin |

### Internal / Utility

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/unsubscribe` | CAN-SPAM unsubscribe | No |
| POST | `/internal/backfill-canspam-footer` | Backfill CAN-SPAM footer | Internal key |
| POST | `/internal/backfill-asset-pages` | Backfill asset pages | Internal key |
| GET | `/freebies/:filename` | Serve public freebie PDFs from R2 storage | No |
| GET | `/chloe/knowledge` | Public FAQ / Chloe knowledge-source page | No |

---

## 2. VLP-Specific Endpoints

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/v1/vlp/preferences/:account_id` | Get VLP preferences | Yes |
| PATCH | `/v1/vlp/preferences/:account_id` | Update VLP preferences | Yes |

---

## 3. TMP Endpoints (`/v1/tmp/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| GET | `/v1/tmp/directory` | Professional directory | No | TMP |
| GET | `/v1/tmp/pricing` | Pricing info | No | TMP |
| POST | `/v1/tmp/memberships/checkout` | Checkout membership | No | TMP |
| GET | `/v1/tmp/memberships/:account_id` | Membership status | Yes | TMP |
| GET | `/v1/tmp/dashboard` | TMP dashboard | Yes | TMP |
| GET | `/v1/tmp/monitoring/status` | Monitoring status | Yes | TMP |
| GET | `/v1/tmp/client-pool` | Available clients | Yes | TMP |
| POST | `/v1/tmp/inquiries` | Create TMP inquiry | Yes | TMP |
| POST | `/v1/tmp/client-pool/accept` | Accept client | Yes | TMP |
| POST | `/v1/tmp/client-pool/checkout` | Create Client Pool checkout session | No | TMP |
| GET | `/v1/tmp/client-pool/:case_id` | Get case details | Yes | VLP |
| POST | `/v1/tmp/client-pool/:case_id/complete` | Mark case completed, trigger payout | Yes | VLP |
| POST | `/v1/tmp/client-pool/:case_id/refund` | Request refund on a case | Yes | TMP |
| POST | `/v1/tmp/client-pool/:case_id/dispute` | Open dispute on a case | Yes | TMP, VLP |
| POST | `/v1/tmp/client-pool/:case_id/release` | Pro releases uncompleted case back to pool | Yes | VLP |
| POST | `/v1/tmp/compliance-records` | Create compliance record | Yes | TMP |
| GET | `/v1/tmp/compliance-records/:order_id` | Get compliance record | Yes | TMP |
| GET | `/v1/tmp/compliance-records/:order_id/report` | Compliance report | Yes | TMP |
| POST | `/v1/tmp/onboarding` | Register new TMP user (rate-limited) | No | TMP |
| GET | `/v1/tmp/inquiries/by-professional/:professional_id` | Inquiries by professional state/specialties | Yes | TMP |
| GET | `/v1/tmp/monitoring/engagements` | List monitoring engagements (taxpayer/pro) | Yes | TMP |
| POST | `/v1/tmp/monitoring/engagements` | Create new monitoring engagement record | Yes | TMP |
| GET | `/v1/tmp/monitoring/engagements/:engagement_id` | Engagement with uploads and alerts | Yes | TMP |
| POST | `/v1/tmp/monitoring/engagements/:engagement_id/accept` | Professional accepts monitoring engagement | Yes | TMP |
| POST | `/v1/tmp/monitoring/engagements/:engagement_id/upload` | Upload IRS transcript PDF for engagement | Yes | TMP |
| GET | `/v1/tmp/monitoring/engagements/:engagement_id/alerts` | Retrieve monitoring alerts for engagement | Yes | TMP |
| POST | `/v1/tmp/cases` | Create new tax case record with client info | Yes | TMP |
| GET | `/v1/tmp/cases/:case_id` | Fetch case details for Form 2848 prefill | No | TMP |
| PATCH | `/v1/tmp/cases/:case_id` | Update case fields (owner or assigned pro) | Yes | TMP |

---

## 4. TTTMP Endpoints (`/v1/tttmp/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| POST | `/v1/tttmp/auth/magic-link/request` | Request magic link | No | TTTMP |
| GET | `/v1/tttmp/auth/magic-link/verify` | Verify magic link | No | TTTMP |
| GET | `/v1/tttmp/auth/session` | Get session | Yes | TTTMP |
| POST | `/v1/tttmp/auth/logout` | Logout | Yes | TTTMP |
| POST | `/v1/tttmp/checkout/sessions` | Create checkout session | No | TTTMP |
| GET | `/v1/tttmp/checkout/status` | Checkout status + token credit | No | TTTMP |
| POST | `/v1/tttmp/support/tickets` | Create support ticket | Yes | TTTMP |
| GET | `/v1/tttmp/support/tickets/:ticket_id` | Get ticket | Yes | TTTMP |
| GET | `/v1/tttmp/tokens/balance` | Token balance | Yes | TTTMP |
| GET | `/v1/tttmp/health` | Health check | No | TTTMP |
| POST | `/v1/tttmp/vesperi/intake` | Vesperi game guide intake | No | TTTMP |
| GET | `/v1/tttmp/vesperi/clips/:filename` | Serve Vesperi video clips from R2 | No | TTTMP |
| GET | `/v1/tttmp/vesperi/unsubscribe` | Vesperi drip unsubscribe (HMAC-signed email link) | No | TTTMP |
| GET | `/v1/tttmp/game-sessions` | Retrieve user game session history | Yes | TTTMP |

---

## 5. DVLP Endpoints (`/v1/dvlp/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| GET | `/v1/dvlp/developers` | List developers | No | DVLP |
| GET | `/v1/dvlp/pricing` | Pricing info | No | DVLP |
| GET | `/v1/dvlp/onboarding` | Onboarding info | No | DVLP |
| POST | `/v1/dvlp/onboarding` | Submit onboarding | No | DVLP |
| PATCH | `/v1/dvlp/onboarding` | Update onboarding | Yes | DVLP |
| GET | `/v1/dvlp/onboarding/status` | Onboarding status | Yes | DVLP |
| GET | `/v1/dvlp/jobs` | List available jobs | No | DVLP |
| GET | `/v1/dvlp/reviews` | Get reviews | No | DVLP |
| POST | `/v1/dvlp/reviews` | Submit review | Yes | DVLP |
| POST | `/v1/dvlp/developer-match-intake` | Developer match intake | No | DVLP |
| POST | `/v1/dvlp/stripe/checkout` | Stripe checkout | Yes | DVLP |
| GET | `/v1/dvlp/stripe/session-status` | Stripe session status | Yes | DVLP |
| POST | `/v1/dvlp/stripe/webhook` | Stripe webhook | Signature | DVLP |
| POST | `/v1/dvlp/operator/analytics` | Post analytics | Operator | DVLP |
| GET | `/v1/dvlp/operator/submissions` | Get submissions | Operator | DVLP |
| GET | `/v1/dvlp/operator/developer` | Get developer | Operator | DVLP |
| PATCH | `/v1/dvlp/operator/developer` | Update developer | Operator | DVLP |
| GET | `/v1/dvlp/operator/developers` | List developers | Operator | DVLP |
| GET | `/v1/dvlp/operator/jobs` | List jobs | Operator | DVLP |
| POST | `/v1/dvlp/operator/jobs` | Create job | Operator | DVLP |
| PATCH | `/v1/dvlp/operator/jobs/:job_id` | Update job | Operator | DVLP |
| POST | `/v1/dvlp/operator/post` | Post content | Operator | DVLP |
| POST | `/v1/dvlp/operator/messages` | Send message | Operator | DVLP |
| GET | `/v1/dvlp/operator/messages` | Get messages | Operator | DVLP |
| GET | `/v1/dvlp/operator/tickets` | Get tickets | Operator | DVLP |
| POST | `/v1/dvlp/operator/tickets/:ticket_id/reply` | Reply to ticket | Operator | DVLP |
| GET | `/v1/dvlp/operator/canned-responses` | Get canned responses | Operator | DVLP |
| POST | `/v1/dvlp/operator/canned-responses` | Create canned response | Operator | DVLP |
| PATCH | `/v1/dvlp/operator/canned-responses/:template_id` | Update canned response | Operator | DVLP |
| DELETE | `/v1/dvlp/operator/canned-responses/:template_id` | Delete canned response | Operator | DVLP |
| POST | `/v1/dvlp/operator/bulk-email` | Send bulk email | Operator | DVLP |

---

## 6. GVLP Endpoints (`/v1/gvlp/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| GET | `/v1/gvlp/config` | Game config | No | GVLP |
| POST | `/v1/gvlp/tokens/use` | Use game tokens | Yes | GVLP |
| GET | `/v1/gvlp/tokens/balance` | Token balance | Yes | GVLP |
| POST | `/v1/gvlp/stripe/checkout` | Stripe checkout | Yes | GVLP |
| POST | `/v1/gvlp/stripe/webhook` | Stripe webhook | Signature | GVLP |
| GET | `/v1/gvlp/operator/:account_id` | Operator data | Operator | GVLP |
| PATCH | `/v1/gvlp/operator/:account_id` | Update operator data | Operator | GVLP |
| GET | `/v1/gvlp/operator/:account_id/plays` | Game plays | Operator | GVLP |

---

## 7. TCVLP Endpoints (`/v1/tcvlp/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| POST | `/v1/tcvlp/onboarding` | Submit onboarding | No | TCVLP |
| GET | `/v1/tcvlp/pro/:pro_id` | Get pro details | No | TCVLP |
| GET | `/v1/tcvlp/pro/by-slug/:slug` | Get pro by slug | No | TCVLP |
| GET | `/v1/tcvlp/mailing-address` | Get mailing address | No | TCVLP |
| POST | `/v1/tcvlp/transcript/upload` | Upload transcript | Yes | TCVLP |
| POST | `/v1/tcvlp/forms/843/generate` | Generate Form 843 | Yes | TCVLP |
| POST | `/v1/tcvlp/forms/843/submit` | Submit Form 843 | Yes | TCVLP |
| GET | `/v1/tcvlp/forms/843/:submission_id/download` | Download Form 843 | No (link) | TCVLP |
| POST | `/v1/tcvlp/gala/intake` | Submit Gala intake | No | TCVLP |
| GET | `/v1/tcvlp/gala/:filename` | Serve Gala video clip | No | TCVLP |
| GET | `/v1/tcvlp/videos/kennedy/:clipId` | Serve Kennedy sales-video clip from R2 (`tcvlp/videos/kennedy/{clipId}.mp4`) | No | TCVLP |
| POST | `/v1/tcvlp/claim-pages` | Create claim page (professional/firm tier) | Yes | TCVLP |
| GET | `/v1/tcvlp/claim-pages` | List primary and additional claim pages | Yes | TCVLP |
| PATCH | `/v1/tcvlp/claim-pages/:page_id` | Update claim page title/description/active | Yes | TCVLP |
| DELETE | `/v1/tcvlp/claim-pages/:page_id` | Soft-delete claim page (active=0) | Yes | TCVLP |
| GET | `/v1/tcvlp/profile` | Retrieve authenticated pro's full profile | Yes | TCVLP |
| PATCH | `/v1/tcvlp/profile` | Update authenticated pro's profile | Yes | TCVLP |
| POST | `/v1/tcvlp/guide/download` | Capture lead for protective-claim guide | No | TCVLP |
| GET | `/v1/tcvlp/guide/pdf` | Serve protective-claim guide PDF from R2 | No | TCVLP |
| GET | `/v1/tcvlp/forms/843/:submission_id/receipt` | Public taxpayer receipt for Form 843 submission | No | TCVLP |
| GET | `/v1/tcvlp/submissions` | List all Form 843 submissions for the pro | Yes | TCVLP |
| GET | `/v1/tcvlp/submissions/export` | Export Form 843 submissions as CSV | Yes | TCVLP |
| GET | `/v1/tcvlp/submissions/bulk-export` | Download all Form 843 PDFs as ZIP (firm tier) | Yes | TCVLP |
| GET | `/v1/tcvlp/subscription/status` | Subscription status (authenticated or by slug) | No (link) | TCVLP |
| POST | `/v1/tcvlp/checkout/sessions` | Create Stripe checkout for TCVLP subscription tier | Yes | TCVLP |
| — | (cron: Gala drip, 15:00 UTC) | 3-email welcome sequence to Gala intakes via Resend | Internal | TCVLP |

---

## 8. WLVLP Endpoints (`/v1/wlvlp/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| GET | `/v1/wlvlp/asset-pages/:slug` | Get asset page | No | WLVLP |
| POST | `/v1/wlvlp/site-requests` | Create site request | Yes | WLVLP |
| GET | `/v1/wlvlp/site-requests/:slug` | Get site request | Yes | WLVLP |
| GET | `/v1/wlvlp/custom-sites/:slug` | Get custom site | No | WLVLP |
| GET | `/v1/wlvlp/templates` | List templates | No | WLVLP |
| GET | `/v1/wlvlp/templates/:slug` | Get template | No | WLVLP |
| POST | `/v1/wlvlp/templates/:slug/vote` | Vote on template | Yes | WLVLP |
| POST | `/v1/wlvlp/templates/:slug/bid` | Bid on template | Yes | WLVLP |
| GET | `/v1/wlvlp/templates/:slug/bids` | Get template bids | Yes | WLVLP |
| POST | `/v1/wlvlp/checkout` | Create checkout | Yes | WLVLP |
| POST | `/v1/wlvlp/scratch` | Create scratch card | Yes | WLVLP |
| POST | `/v1/wlvlp/scratch/:ticket_id/reveal` | Reveal scratch card | Yes | WLVLP |
| GET | `/v1/wlvlp/scratch/prizes/:account_id` | Get scratch prizes | Yes | WLVLP |
| GET | `/v1/wlvlp/buyer/:account_id` | Get buyer info | Yes | WLVLP |
| GET | `/v1/wlvlp/sites/by-account/:account_id` | Sites by account | Yes | WLVLP |
| PATCH | `/v1/wlvlp/config/:slug` | Update site config | Yes | WLVLP |
| PATCH | `/v1/wlvlp/sites/:slug/data` | Update site data | Yes | WLVLP |
| GET | `/v1/wlvlp/sites/:slug/data` | Get site data | Yes | WLVLP |
| POST | `/v1/wlvlp/sites/:slug/domain` | Setup custom domain | Yes | WLVLP |
| GET | `/v1/wlvlp/sites/expiring` | Get expiring sites | Admin | WLVLP |
| POST | `/v1/wlvlp/upload-logo` | Upload logo | Yes | WLVLP |
| POST | `/v1/wlvlp/stripe/webhook` | Stripe webhook | Signature | WLVLP |
| GET | `/v1/wlvlp/admin/trigger-site-gen` | Trigger site generation | Admin | WLVLP |
| POST | `/v1/wlvlp/admin/upload-prospects` | Upload prospects | Admin | WLVLP |
| GET | `/v1/wlvlp/admin/trigger-batch-gen` | Trigger batch generation | Admin | WLVLP |
| POST | `/v1/wlvlp/leads` | Public email capture for launch landing page | No | WLVLP |
| GET | `/v1/wlvlp/bids/by-account/:account_id` | Account's template bids with winning status | Yes | WLVLP |
| GET | `/v1/wlvlp/votes/by-account/:account_id` | Account's template votes with metadata | Yes | WLVLP |

---

## 8a. TAVLP Endpoints (`/v1/tavlp/*`, `/tavlp/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| GET | `/tavlp/*` | R2 passthrough — serves videos (`tavlp/videos/*`), avatars (`tavlp/avatars/*`), and `tavlp/channel-stats.json` | No | TAVLP |
| POST | `/v1/tavlp/refresh-stats` | Manual trigger for the YouTube channel-stats refresh (`handleTavlpChannelStats`) | Admin | TAVLP |
| Cron | `0 5 * * *` → `handleTavlpChannelStats` | Daily 05:00 UTC refresh of `tavlp/channel-stats.json` (subscribers, views, top performer per channel) | Internal | Cron |
| POST | `/v1/tavlp/checkout/sessions` | Create Stripe checkout for TAVLP subscription | Yes | TAVLP |
| POST | `/v1/tavlp/scripts/generate` | Generate YouTube scripts via Claude, store pending review | Yes | TAVLP |
| GET | `/v1/tavlp/scripts/:account_id` | List generated scripts for account | Yes | TAVLP |
| POST | `/v1/tavlp/scripts/:script_id/approve` | Approve script for rendering | Yes | TAVLP |
| GET | `/v1/tavlp/avatars` | Fetch/rebuild TAVLP avatar registry from HeyGen | Yes | TAVLP |
| POST | `/v1/tavlp/avatar/upload` | Upload photo, create HeyGen custom avatar (Pro tier) | Yes | TAVLP |
| GET | `/v1/tavlp/avatar/status/:account_id` | Poll custom-avatar training status from HeyGen | Yes | TAVLP |
| POST | `/v1/tavlp/render` | Kick off HeyGen avatar video render for approved script | Yes | TAVLP |
| GET | `/v1/tavlp/render/:render_id/status` | Poll HeyGen render, download video to R2 | Yes | TAVLP |
| GET | `/v1/tavlp/renders/:account_id` | List render jobs for account | Yes | TAVLP |
| POST | `/v1/tavlp/admin/render` | Admin render with Kennedy avatar, raw script text | Admin | TAVLP |
| GET | `/v1/tavlp/admin/render/:video_id/status` | Admin poll render, download to R2 | Admin | TAVLP |
| GET | `/v1/tavlp/channels/:account_id` | Read registered YouTube channel for account | Yes | TAVLP |
| PUT | `/v1/tavlp/channels/:account_id` | Register/update YouTube channel config (admin+owner) | Yes | TAVLP |
| POST | `/v1/tavlp/youtube/upload` | Upload completed render to YouTube (admin only) | Admin | TAVLP |
| POST | `/v1/tavlp/transfer/request` | Initiate channel ownership transfer to customer | Yes | TAVLP |
| POST | `/v1/tavlp/transfer/approve` | Admin approve transfer, cancel Stripe, email customer | Admin | TAVLP |
| POST | `/v1/tavlp/transfer/complete` | Admin mark transfer complete after YouTube confirms | Admin | TAVLP |
| GET | `/v1/tavlp/transfers` | Admin list all channel transfer requests | Admin | TAVLP |
| GET | `/v1/tavlp/subscribers` | Admin list all subscribers with channel state | Admin | TAVLP |
| POST | `/__deprecated/tavlp/scripts/generate` | Deprecated inline scripts.generate (superseded by `/v1/tavlp/scripts/generate`) | Yes | TAVLP |

**Intake:** TAVLP channel-interest leads use the shared `POST /v1/tcvlp/gala/intake` endpoint with `penalty_type: tavlp_channel_interest`. See §7 (TCVLP).
**Reviews:** TAVLP reviews use the shared `GET /v1/submissions/public?platform=tavlp&form_type=review` and `POST /v1/submissions` endpoints.

---

## 8b. TPP Endpoints (`/v1/taxprep/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| POST | `/v1/taxprep/onboarding` | Account creation — brokers SD `POST /secure-api/company`, creates Prospect company + primary contact, assigns CRM category, triggers SD welcome email | No | TPP |

Per §1 TPP exception: this is the only Worker route for TPP. Idempotent via `eventId`, rate-limited 10/hr/IP-hash. Receipt at `receipts/taxprep/onboarding/{eventId}.json`, projects to D1 `taxprep_onboarding`. Contract: `contracts/taxprep/taxprep.onboarding.v1.json`.

---

## 8c. GSVLP Endpoints (`/v1/gsvlp/*`)

Growth Setter Pro — the setter call-room CRM (call-list, dispositions, appointments, follow-ups, drips, and Stripe-Connect commission payouts). Setter-facing routes are session-gated; `/v1/admin/gsvlp/*` cron-cursor status and commission-admin routes live in §1 Admin.

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| GET | `/v1/gsvlp/call-list` | Return setter's assigned batch (auto-assigns if none) | Yes | GSVLP |
| POST | `/v1/gsvlp/call-list/:rowNumber/status` | Update row status with optional disposition notes | Yes | GSVLP |
| POST | `/v1/gsvlp/call-list/load-more` | Assign additional prospects to setter's batch | Yes | GSVLP |
| GET | `/v1/gsvlp/leads/:rowNumber/prospect` | Setter-scoped read of prospect's CRM fields | Yes | GSVLP |
| PATCH | `/v1/gsvlp/leads/:rowNumber/prospect` | Update prospect fields (strict whitelist) | Yes | GSVLP |
| GET | `/v1/gsvlp/leads/by-slug/:foiaSlug/resolve` | Find row in setter batch matching FOIA slug | Yes | GSVLP |
| GET | `/v1/gsvlp/leads/by-slug/:foiaSlug/prospect` | Assemble read-only prospect record by slug | Yes | GSVLP |
| POST | `/v1/gsvlp/activity/log` | Log disposition and notes to ClickUp task | Yes | GSVLP |
| GET | `/v1/gsvlp/calls/next` | Next contact in batch (uncalled/follow-up) | Yes | GSVLP |
| GET | `/v1/gsvlp/calls/:rowNumber/activity` | Read contact's logged activity feed (newest-first) | Yes | GSVLP |
| GET | `/v1/gsvlp/calls/by-slug/:foiaSlug/activity` | Slug-addressable read of contact activity feed | Yes | GSVLP |
| GET | `/v1/gsvlp/availability` | JLW's free slots from Google Calendar FreeBusy | Yes | GSVLP |
| POST | `/v1/gsvlp/appointments` | Log appointment, create Google Calendar event | Yes | GSVLP |
| GET | `/v1/gsvlp/appointments` | List setter's appointments with summary stats | Yes | GSVLP |
| GET | `/v1/gsvlp/dashboard` | Setter dashboard stats (calls, booked, earnings) | Yes | GSVLP |
| POST | `/v1/gsvlp/follow-ups` | Create or update a follow-up for a lead | Yes | GSVLP |
| GET | `/v1/gsvlp/follow-ups` | List follow-ups with status/due filtering | Yes | GSVLP |
| POST | `/v1/gsvlp/follow-ups/:id/complete` | Mark a follow-up completed | Yes | GSVLP |
| GET | `/v1/gsvlp/admin/clear-stale-followups` | Admin force-clear stale follow-ups by account | Admin | GSVLP |
| POST | `/v1/gsvlp/tips/subscribe` | Capture email, send welcome PDF link | No | GSVLP |
| GET | `/v1/gsvlp/tips/download` | Serve tips PDF from R2 (public) | No | GSVLP |
| GET | `/v1/gsvlp/tips/unsubscribe` | HMAC-validated unsubscribe from tips emails | No (link) | GSVLP |
| POST | `/v1/gsvlp/nurture/subscribe` | Start tax-pro nurture drip (auth required) | Yes | GSVLP |
| GET | `/v1/gsvlp/nurture/unsubscribe` | HMAC-validated unsubscribe from nurture emails | No (link) | GSVLP |
| POST | `/v1/gsvlp/webhooks/stripe` | Stripe-signed webhook matching tax pros to setters | Signature | GSVLP |
| GET | `/v1/gsvlp/commissions` | Setter's commission ledger with totals | Yes | GSVLP |
| POST | `/v1/gsvlp/stripe-connect/onboard` | Create Connect Express account + onboarding link | Yes | GSVLP |
| GET | `/v1/gsvlp/stripe-connect/status` | Check Connect status, refresh from Stripe | Yes | GSVLP |
| GET | `/v1/gsvlp/account/payout-method` | Current payout preference + Payoneer details | Yes | GSVLP |
| POST | `/v1/gsvlp/account/payout-method` | Save payout preference + Payoneer details | Yes | GSVLP |
| POST | `/v1/gsvlp/commissions/payout-pending` | Cron-driven sweep of pending commissions | Internal key | GSVLP |
| GET | `/v1/gsvlp/videos/:filename` | Serve GSVLP recruitment video from R2 | No | GSVLP |

---

## 9. Scale Endpoints (`/v1/scale/*`)

| Method | Path | Purpose | Auth | Frontend |
|--------|------|---------|------|----------|
| GET | `/v1/scale/dashboard` | Scale dashboard | Yes | VLP |
| GET | `/v1/scale/analytics` | Scale analytics | Yes | VLP |
| GET | `/v1/scale/youtube-analytics` | YouTube Data + Analytics API (public API always, OAuth analytics when connected) | Admin | VLP |
| GET | `/v1/scale/youtube-oauth/start` | Begin YouTube Analytics OAuth flow | Admin | VLP |
| GET | `/v1/scale/youtube-oauth/callback` | YouTube Analytics OAuth callback, persists tokens to KV | Admin (via state) | VLP |
| POST | `/v1/scale/youtube-oauth/disconnect` | Revoke stored YouTube Analytics OAuth tokens | Admin | VLP |
| GET | `/scale/asset-page/:slug` | Asset page (legacy path) | No | Public |
| POST | `/scale/init-send-state` | Initialize send state | Internal | Cron |
| GET | `/v1/scale/prospects/status` | Prospect status | Admin | VLP |
| GET | `/v1/scale/prospects/search` | Search prospects | Admin | VLP |
| GET | `/v1/scale/prospects/:slug` | Prospect details | Admin | VLP |
| PATCH | `/v1/scale/prospects/:slug` | Update prospect CRM overrides + social profile URLs | Admin | VLP |
| POST | `/v1/scale/cron/find-emails` | Find emails (cron) | Internal | Cron |
| POST | `/v1/scale/cron/validate-emails` | Validate emails (cron) | Internal | Cron |
| POST | `/v1/scale/cron/wlvlp-enrich` | Enrich WLVLP data (cron) | Internal | Cron |
| POST | `/v1/wlvlp/cron/auction-settle` | Settle auctions (cron) | Internal | Cron |
| POST | `/v1/scale/cron/backfill-asset-pages` | Backfill asset pages (cron) | Internal | Cron |
| GET | `/v1/scale/asset/:slug` | Get asset page | No | Public |
| PUT | `/v1/scale/prospects/upload-source` | Upload prospect source | Admin | VLP |
| POST | `/v1/scale/cron/ingest-csv` | Process pending CSV uploads for campaign materials | Internal key | Cron |
| POST | `/v1/scale/cron/daily-batch` | Run CSV ingestion + daily batch generation | Internal key | Cron |
| GET | `/v1/scale/social/opportunities` | List Reddit opportunities (last 7 days) | Admin | VLP |
| PATCH | `/v1/scale/social/opportunities/:post_id` | Update Reddit opportunity status (replied/dismissed) | Admin | VLP |
| POST | `/v1/scale/social/scan-now` | Manually trigger Reddit monitor scan | Admin | VLP |
| GET | `/v1/scale/kpi/snapshots` | KPI snapshots index + target thresholds | Admin | VLP |
| POST | `/v1/scale/kpi/snapshot-now` | Manually trigger weekly KPI snapshot | Admin | VLP |
| GET | `/v1/scale/forms/summary` | Platform submission summary by type | Admin | VLP |
| GET | `/v1/scale/forms/:platform/submissions` | Paginated form submissions per platform | Admin | VLP |
| GET | `/v1/scale/forms/:platform/export` | Export platform form submissions as CSV | Admin | VLP |
| POST | `/v1/scale/social/posts` | Create campaign post record (R2 + D1) | Admin | VLP |
| POST | `/v1/scale/social/sync-to-clickup` | Backfill ClickUp tasks for pending posts | Admin | VLP |
| GET | `/v1/scale/social/posts` | List social posts (platform/campaign filters) | Admin | VLP |
| PATCH | `/v1/scale/social/posts/:id` | Update post notes/engagement/campaign fields | Admin | VLP |
| POST | `/v1/scale/campaigns/generate` | Generate 10-day LinkedIn/Facebook campaign | Admin | VLP |
| POST | `/v1/scale/campaigns/craigslist/generate` | Generate Craigslist campaign with ClickUp sync | Admin | VLP |
| POST | `/v1/scale/campaigns/social/trigger` | Trigger weekly schedule / daily LinkedIn post | Admin | VLP |
| GET | `/v1/scale/campaigns/social/debug` | Meta/LinkedIn/Threads/Buffer diagnostics | Admin | VLP |
| GET | `/v1/scale/campaigns/social/manual-posts` | Today's scheduled posts for manual posting | Admin | VLP |
| POST | `/v1/scale/outreach/connections` | Log LinkedIn cold-outreach connection request | Admin | VLP |
| GET | `/v1/scale/outreach/connections` | List outreach records (optional status filter) | Admin | VLP |
| PATCH | `/v1/scale/outreach/connections/:id` | Update outreach status/notes/LinkedIn URL | Admin | VLP |
| GET | `/v1/scale/outreach/templates` | Canned LinkedIn outreach message templates | Admin | VLP |
| POST | `/v1/youtube/access-token` | Short-lived YouTube OAuth access token for upload | Yes | VLP |

---

## 10. Route Statistics

Counts below are exact for the `ROUTES` array (408 entries) per the `worker-inventory-2026-06-12` source audit. OPTIONS/HEAD are handled separately in the `fetch()` CORS preflight, not as `ROUTES` entries.

| Method | Count |
|--------|-------|
| GET | 213 |
| POST | 160 |
| PATCH | 28 |
| PUT | 3 |
| DELETE | 3 |
| OPTIONS / HEAD | 0 (CORS preflight handled in `fetch`) |
| **Total** | **408** |

| Platform / group (by path prefix) | Route Count |
|-----------------------------------|------------|
| `/v1/scale/*` | 39 |
| `/v1/gsvlp/*` | 32 |
| `/v1/admin/*` | 32 |
| `/v1/dvlp/*` | 31 |
| `/v1/wlvlp/*` | 29 |
| `/v1/tmp/*` | 29 |
| `/v1/tcvlp/*` | 25 |
| `/v1/tavlp/*` | 21 |
| `/v1/auth/*` | 16 |
| `/v1/billing/*` | 15 |
| `/v1/tttmp/*` | 14 |
| `/v1/transcripts/*` | 11 |
| `/v1/accounts/*` | 10 |
| `/v1/gvlp/*` | 8 |
| `/v1/tokens/*` | 7 |
| `/v1/notifications/*` | 7 |
| Shared booking stack (`/v1/cal*`, `/v1/google/*`, `/v1/bookings/*`, `/v1/calendar/*`) | 17 |
| Other shared groups (support, affiliates, profiles, inquiries, memberships, tools, checkout, webhooks, r2, pricing, analytics, leads, dashboard, contact, vlp, submissions, singletons, non-`/v1`) | 64 |
| `/v1/taxprep/*` | 1 |

> Per-prefix counts sum to 408. Auth-level distribution is approximate and not maintained in this table — see each route's Auth column.
