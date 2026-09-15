---
title: TaxPrep Training Materials & SuiteDash Production Plan
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [bkk-sync, lms, obsidian-vault, office-sync, production-plan, suitedash, synto-knowledge]
type: suitedash-hierarchy
---

# Training Materials Production Plan — Apex Service Bureau (Virginia Hall, muse customer #1)

> **Built around Virginia Hall (The Big Global Tax Bosses Service Bureau / Taxi Up Tax) as the muse client.**
> **Demo placeholder bureau name:** *Apex Service Bureau* (locked).
> **Audience:** Virginia and service bureau operators like her — credentialed tax pros with two offices' worth of operational reality, running or launching service bureaus for working tax pros.
> **Distribution:** SuiteDash LMS module inside the reseller template. Bureau operator + members consume training in-platform.
> **Production tools:** HeyGen ($29/mo, renews May 8) for AI avatar; OBS Studio (free) for screen-recording; DaVinci Resolve (free) for editing.
> **Repo:** `vlp-service-bureaus` (locked).
> **Vocabulary:** Member (never Mentee). Bureau Operator (never Mentor).
> **Last updated:** 2026-05-04
> **Status:** Locked. Begin execution today.

---

## 0. The strategic frame

You are not building a generic training library. You are building **the specific deliverable that lets Virginia hand SuiteDash-with-training to her members on day one of joining her bureau**. Every module is designed for a tax pro who has clients to onboard *this week* — not aspiring tax pros, not side-hustlers, not generalists.

The shape of every module is: *"Here is one specific task you need to do in your SuiteDash. Here is exactly how to do it. Now go do it."*

**The repair frame.** Virginia's first experience with you ran 2 days late. The next experience she has must be the opposite — **more delivered than promised, on time, framed as a gift she didn't expect.** This production plan is built around that repair.

---

## 1. The "Virginia welcome back" deliverable (Week of May 11)

**Goal:** Have ONE polished, complete, working training module live inside a demo SuiteDash LMS, ready to show Virginia on her post-vacation call. Not the whole library. One module. Real.

**The module: "Onboarding Your First Member in SuiteDash"** (~6 min total)

This is intentionally the most powerful possible single module because:
- It demonstrates the reseller template working end-to-end
- It shows Virginia exactly how she'd use what you're proposing to build for her
- It's the natural opener for a partnership conversation
- It's small enough to ship in 6 days

**Module structure:**

| Segment | Length | Format | Production |
|---|---|---|---|
| Intro: "Welcome — let's onboard your first member" | 0:30 | Avatar full-frame | HeyGen |
| What you'll do today (overview) | 0:45 | Avatar + slide overlay | HeyGen + Canva slide |
| Step 1: Add the member to your parent account | 1:15 | Screen-record + voiceover | OBS + HeyGen voice |
| Step 2: Apply the reseller template | 1:30 | Screen-record + voiceover | OBS + HeyGen voice |
| Step 3: Trigger the welcome flow | 1:00 | Screen-record + voiceover | OBS + HeyGen voice |
| Outro: "Your member just got onboarded. Here's what they see next." | 0:45 | Avatar + screen split | HeyGen + composite |

**Deliverable to Virginia on the call:** A live link to this module inside the *Apex Service Bureau* demo SuiteDash account (skinned in maroon/cream/gold to match her color family) — and the offer to install the full reseller template + LMS in her own SuiteDash for $5,000 (single component) or $8,500 (Service Bureau OS bundle).

---

## 2. Week-by-week production schedule

### Days 1–2 (May 4–5) — Pre-access work, no tools required

You don't have SuiteDash parent account access yet (returns May 6). You don't have HeyGen renewed (May 8). But you can do everything that doesn't require either.

**Tasks:**
- [ ] **Write the script for Module 1** ("Onboarding Your First Member"). Full script, including avatar lines and screen-record voiceover. ~600 words.
- [ ] **Write the master training outline** for the full library (11 modules — see §4). One paragraph per module.
- [ ] **Define the avatar persona.** Decide tone, pacing, wardrobe (HeyGen has presets), background. Match Virginia's energy: professional, warm, plain-spoken. Avatar is *Virginia-adjacent* — not Virginia herself.
- [ ] **Choose the avatar.** HeyGen has free public avatars and instant avatars (you upload 2 min of video, it generates a likeness). For Virginia's call, the public avatar is fine. Long-term, build a custom avatar that's Virginia-adjacent in feel but not her.
- [ ] **Draft the slide assets** for Module 1 in Canva (free). 3 slides max.
- [ ] **Write the LMS course structure** — the names, descriptions, and order of the 11 modules.

**Time budget:** 4–6 hours total across the two days.

### Day 3 (May 6) — Parent account reactivates

**Cash sequence:** Stripe payout $287.49 lands. Pay Carl back his $200. Pay SuiteDash reseller subscription $99. Remaining: ~$53 + your existing $65 = ~$118 buffer.

**Tasks:**
- [ ] **Activate SuiteDash parent account.** Confirm the demo templates are still in State A (ready).
- [ ] **Walk through your own demo as a user.** Onboard a fake member end-to-end. Note every screen, every click, every confusion point. This is the source material for the screen-records.
- [ ] **Set up the LMS module** in the demo account. Create the empty course "Apex Service Bureau Training" with placeholder modules. Skin the demo in maroon/cream/gold (Virginia's color family).
- [ ] **Record screen-records for Module 1.** Three clips: adding member, applying template, triggering flow. Use OBS. Don't add voiceover yet — that's Day 4.

**Time budget:** 3–4 hours.

### Day 4 (May 7) — Voiceovers + first edit

Still no HeyGen avatar yet (renews tomorrow). But HeyGen voice can be generated separately, and you can do voiceover-only edits today.

**Tasks:**
- [ ] **Generate voiceovers in HeyGen** for the three screen-record segments (you may have small remaining credits even pre-renewal — check; if not, defer voiceover generation 1 day).
- [ ] **Edit screen-records with voiceover** in DaVinci Resolve. Tight cuts. No fluff. 1–2 minutes each.
- [ ] **If voiceover blocked:** record the voiceover yourself in OBS or a phone voice memo as a placeholder. You can swap to HeyGen voice on Day 5.

**Time budget:** 2–3 hours.

### Day 5 (May 8) — HeyGen renews, avatar segments produced

**Tasks:**
- [ ] **HeyGen subscription auto-renews.** Confirm access.
- [ ] **Generate the four avatar segments** for Module 1 (intro, overview, outro halves). Each is 30–90 seconds.
- [ ] **Composite the avatar segments + screen-records + slides** into the final 6-minute module.
- [ ] **Upload to SuiteDash LMS** in the demo account.
- [ ] **Watch the full module twice.** Note rough edges. Re-export anything that needs it.

**Time budget:** 4–5 hours. This is the heavy production day.

### Days 6–7 (May 9–10) — Polish + supporting docs

**Tasks:**
- [ ] **Write the one-page module companion doc** (PDF). What the member sees, what to expect, what to do if a step doesn't work. One page. Plain language.
- [ ] **Build the Apex Service Bureau demo SuiteDash account** with maroon/cream/gold skin. The version Virginia sees on the call.
- [ ] **Test the demo as a fake member.** Click everything. Make sure the LMS course actually plays. Fix anything broken.
- [ ] **Prep the Virginia pitch document** — a 1-page summary of what the full Service Bureau OS includes (Layer 1 reseller infrastructure + Layer 2 11-module LMS + Layer 3 setup/training/30-day support), the bundle price ($8,500), the single-component price ($5,000), and what's delivered.

**Time budget:** 4–5 hours across the two days.

### Days 8–10 (May 11–13) — Virginia call window

**Tasks:**
- [ ] **Wait for Virginia's return.** Confirm her availability for the call.
- [ ] **Send a one-line message before the call:** "I built something for you while you were away — wanted to show you on our call. See you [day]."
- [ ] **On the call:** Open by walking her through Module 1 live. Don't pitch yet. Let her experience it. Then transition to the Service Bureau OS offer.
- [ ] **Close or don't close** depending on her response. If enthusiastic → propose installing the full OS in her SuiteDash this week ($8,500). If hesitant → propose Tax Monitor Setup as paid pilot ($5,000). If not interested → thank her, ask for the review, move on without bitterness.

---

## 3. After Virginia (Weeks 3–4 — May 18 onward)

If Virginia commits → you have your prototype customer. Build out the full 11-module library based on her feedback and her members' actual workflow.

If Virginia doesn't commit → the demo and Module 1 still exist, and the production plan still works for the next bureau operator conversation. Nothing wasted.

Either way, the full library production runs Weeks 3–4 with this allocation (hybrid structure — see §4 for full outline):

- **Module 2:** High-level walkthrough of the full 8-phase Tax Prep journey (~8 min)
- **Modules 3–10:** Deep-dive on each of the 8 phases individually (~3–5 min each)
- **Module 11:** Tax Monitor Setup walkthrough (~8 min)

Each module follows the same structure as Module 1: avatar + screen-record + slide overlays, ends with a clear "now go do it" instruction.

**Production rate target:** 3 modules per week in weeks 3–4. Full library shipped by end of May.

---

## 4. The full module library (master outline)

**Course title:** *Apex Service Bureau Training* (placeholder for demo; replaced with bureau's actual brand on customer install)

**Structure:** Hybrid — single high-level walkthrough plus per-phase deep-dives. Members can watch Module 2 once for the big picture, then jump to specific modules when they need help with a specific phase.

### Module 1 — Onboarding (the bureau-operator entry point)

| # | Title | Length | Audience |
|---|---|---|---|
| 1 | Onboarding Your First Member in SuiteDash | 6 min | Bureau Operator (priority — Virginia call) |

### Module 2 — High-level Tax Prep journey walkthrough

| # | Title | Length | Audience |
|---|---|---|---|
| 2 | How To Use Your Apex Service Bureau Setup — The 8-Phase Tax Prep Journey | 8 min | Member |

### Modules 3–10 — Phase-by-phase deep dives (sourced from ClickUp Tax Prep Setup)

| # | Title | Length | Audience |
|---|---|---|---|
| 3 | Phase 1 — Identify Taxpayer Type | 4 min | Member |
| 4 | Phase 2 — Intake Form | 5 min | Member |
| 5 | Phase 3 — Agreement | 4 min | Member |
| 6 | Phase 4 — Payment | 5 min | Member |
| 7 | Phase 5 — Prep + Review | 5 min | Member |
| 8 | Phase 6 — E-Sign | 4 min | Member |
| 9 | Phase 7 — File | 4 min | Member |
| 10 | Phase 8 — Deliver + Close | 4 min | Member |

### Module 11 — Tax Monitor Setup

| # | Title | Length | Audience |
|---|---|---|---|
| 11 | Tax Monitor Setup — 2848 Generator, Compliance Workflow, and Drip Campaigns | 8 min | Member |

**Total runtime:** ~57 minutes across 11 modules.

**Why this structure:** A member watches Module 2 once for the big picture (8 min). When they're stuck on a specific phase, they jump to the corresponding deep-dive (3–5 min, narrow scope). This is dramatically better for completion rates than one long monolithic video. It also lets bureau operators reference specific modules in their own communications: "Watch Module 6 for help with Payment setup."

**Note on script generation:** Modules 3–10 scripts are sourced directly from the ClickUp *Tax Prep Setup* journey (the 8-phase list). Each phase's tasks become the script's instruction sequence. This is not "write 8 new scripts from scratch" — it's "translate 8 already-documented workflows into avatar-narrated walkthroughs."

---

## 5. Production standards (locked)

These are non-negotiable to keep quality consistent across modules.

**Avatar:**
- Same avatar persona across all modules (consistency = trust)
- HeyGen instant avatar built from your own 2-min video → looks and sounds like you
- Wardrobe: professional but not stiff (think: Virginia's choir-on-Sunday-meets-business-Monday energy)
- Background: clean, single-color, no busy logos
- Pacing: deliberate. 145–160 words/minute. Not rushed.

**Voiceover (for screen-records):**
- HeyGen voice matched to the avatar voice (so it sounds like one person throughout)
- No music under voiceover (distracts from instruction)
- 1–2 second pause after each click

**Screen-records:**
- Full 1920x1080
- Cursor highlighted (OBS feature)
- Click sounds enabled
- No personal data visible — use demo accounts and fake names throughout
- 1.0x speed for instructional content. 1.5–2x speed only for "watch me do this thing 12 times" sections, with a clear callout.

**Slides (Canva):**
- Three colors max: SuiteDash maroon (#5D0E0E), salmon (#EF9595), and one neutral
- One concept per slide
- Sans-serif, large type
- No bullet lists with more than 4 items

**Module length:**
- 5–8 minutes target
- Hard stop at 10 minutes — if a module runs longer, split it

**Tone of voice (script-level):**
- Plain language. Tax pros know tax words; they don't know SuiteDash words. Translate.
- Direct address: "you" and "your member" — never "users" or "clients" abstractly
- One instruction per sentence. Never compound steps.
- Match Virginia's professionalism: warm, but not casual. Confident, but not boastful.
- No filler ("um," "so," "basically"). Avatar voice removes most of this naturally.

---

## 6. Tech stack & cost

| Tool | Purpose | Cost | Status |
|---|---|---|---|
| HeyGen | AI avatar + voice generation | $29/mo (renews May 8) | Active |
| OBS Studio | Screen recording | Free | Already installed (assumption) |
| DaVinci Resolve | Video editing | Free | Already installed (assumption) |
| Canva | Slide assets | Free | Standard |
| SuiteDash | Demo account + LMS hosting | $99/mo (resumes May 6) | Resuming |
| Google Drive | File staging | Free | Active |

**Total monthly recurring:** $128 ($29 HeyGen + $99 SuiteDash). Both are operating expenses, not campaign expenses. The first $5K close pays them for ~39 months.

---

## 7. Risk register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| HeyGen avatar quality looks "obviously AI" and breaks trust | Medium | High | Test the avatar with a friend before Virginia's call. If it looks fake, fall back to public avatar or screen-only with HeyGen voice. |
| Module 1 isn't done by Virginia's return | Medium | High | Module 1 is scoped at 6 minutes for a reason. If running late, ship a 4-minute version with only the parent-account demo. Real beats polished. |
| Virginia returns earlier than expected | Low | Medium | Daily check messages on Day 7+. Confirm her timeline. |
| Virginia rejects the partnership idea | Medium | Medium | Module 1 still works for the next bureau operator conversation. Production plan continues regardless. |
| HeyGen credits run out mid-production | Low | High | Generate avatar segments in priority order — Module 1 first, then Module 2 walkthrough, then per-phase deep-dives. Don't burn credits on B-roll. |
| Screen-records reveal personal/client data | Medium | Critical | Use only the Apex Service Bureau demo account with fake names. Pre-flight every recording. Blur if doubt remains. |
| Disappointment from prior late-delivery resurfaces on the call | Medium | Medium | Open the call with a sincere acknowledgment ("I want to be on time and over-deliver this round"), then show the work. Don't dwell. Show, don't apologize repeatedly. |

---

## 8. The first action (today)

**Write the Module 1 script.**

Not the outline. The script. Every line the avatar says, every click in the screen-record, every voiceover line.

This is the single highest-leverage 90 minutes of work in the entire plan. The script is the substrate; everything downstream — recording, editing, compositing — is mechanical execution against the script. Without a tight script, every other step takes longer and produces worse output.

Target length: 600–800 words.
Target time: 90 minutes.
Today.

---

## 9. The Virginia call structure (May 11–13 window)

**Open (2 min):** "I want to be on time and over-deliver this round. Here's what I built while you were away — pull up your phone or laptop, I want to walk you through it."

**Demo (8 min):** Walk her through Module 1 inside the Apex Service Bureau demo SuiteDash. Let her see the avatar, the screen-record, the LMS module structure. Don't narrate over the video — let it play.

**Pitch (5 min):** "If this resonates, here's what I'd propose: I install the same reseller template in your own SuiteDash, plus the full 11-module training library in your LMS. Your members get this exact experience, branded as Big Global Tax Bosses Service Bureau. Setup is $8,500 for the full Service Bureau OS, or $5,000 for one component. I do all of the build. You don't need to be technical."

**Listen (5 min):** Don't fill silence. Let her think. Answer questions plainly.

**Close or de-escalate (5 min):**
- *If she's in:* "Let's pick a date this week to start the install. I'll send you a one-page outline today and an invoice for 50% deposit."
- *If she's hesitant:* "Would the Tax Monitor Setup as a paid pilot be easier? $5,000 for that component — IRS monitoring + 2848 generator + drip campaigns + Module 11 of the LMS. If it works, we extend to the full Service Bureau OS."
- *If she's not in:* "Totally understand. Can I still ask for the review from your launch experience? And if you ever know a service bureau operator who'd want this, I'd love an intro."

**Total call time:** 25 minutes. Ends with a clear next step regardless of direction.

---

## 10. What this plan is NOT

- Not a marketing campaign. The campaign comes later (per yesterday's council).
- Not a generic training library yet — it's specifically scoped around Virginia and bureau operators like her. The asset reuse model in the project instruction (§7) explains how it becomes generic.
- Not a substitute for the next bureau operator conversations. After Virginia, you talk to 2–3 more bureau operators with this same Module 1 demo as the proof asset.
- Not finished after Module 1. Module 1 is the wedge. The full 11-module library is the product.

---

*End of production plan.*
