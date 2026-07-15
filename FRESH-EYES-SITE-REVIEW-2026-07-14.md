# Fresh-Eyes Portfolio Review — Implementation Brief

**Date:** 2026-07-14
**Site:** https://dimadimadima.com
**Purpose:** Give the implementation agent a self-contained, prioritized brief for improving the portfolio as a professional hiring surface without removing its personality.
**Status:** Implemented in the `refresh-2026-07` working tree on 2026-07-14; build and desktop browser QA complete. The changes have not been committed or pushed.

## Implementation Update — 2026-07-14

The second-pass review incorporated the live LinkedIn profile, the July Positioning Dossier and role criteria, July 8–14 networking reflections/transcripts, and the June Lahzo reflection material. It also compared the live portfolio with Shawn Jones's site, focusing on its large sans-serif hierarchy, whitespace, tool treatment, and clearly explained expertise cards.

### Positioning decision

The site now leads with this through-line:

> Data & AI leader who leads teams and turns messy data and emerging AI capabilities into revenue-producing systems—from strategy through production.

This is deliberately different from “enterprise AI strategist.” It signals a player-coach operator with people leadership, hands-on credibility, and a revenue/product mandate. The Contact page positively filters for growth-stage SaaS or AI-native companies, a real team, and Atlanta-hybrid work without publishing a negative “avoid” list.

### Changes implemented

- Removed DM Serif Display from the public site. DM Sans now carries all headings and body copy; DM Mono is limited to small metadata, status, and navigation labels.
- Increased the header wordmark and standardized page/section heading sizes.
- Rebuilt Contact around a positioning-led hero, compact fit panel, clean contact rows, and icon-led conversation starters.
- Rebuilt About with one headshot in the hero, a family feature image plus world thumbnails, icon-led values, and a three-stage bucket-list layout.
- Rebuilt Professional Experience around large core-expertise cards with hover/focus descriptions, grouped tools, visible role metrics, a quiet logo marquee, and corrected chronology.
- Removed the “15+ years” and “7 companies” hero counters.
- Removed Intuit from the client set because Mailchimp is already represented; replaced the broken Verizon file and outdated Pfizer logo.
- Reworked AI Side Quests with a stronger premise, larger descriptions, consistent image ratios, more generous spacing, and search/filter controls.
- Rebalanced the homepage bento into equal-height rows and added a verified professional proof band so side projects and executive credibility appear together.
- Updated project-detail typography to the same sans-serif system.

### LinkedIn positioning recommendation

The current headline—“VP, Data & AI | AI Strategy at the Board Level, Deployed Systems at the Team Level…”—is credible, but it still leads with strategy and does not show people leadership or commercial outcomes. Recommended next version:

> VP, Data & AI | Player-Coach Building Revenue Systems from Strategy to Production | Mailchimp, Equifax, Accenture | Duke MBA

The current About section has strong proof. Its opening should match the site more closely:

> I lead teams that turn messy data and emerging AI capabilities into revenue-producing systems—from strategy through production.

Keep the quantified Lahzo, Equifax, Mailchimp, and Accenture paragraphs. Drop “Twenty years in” from the closing; “I still build for fun” makes the same point without introducing another tenure claim.

## Executive Summary

The site is a stronger personal artifact than most executive portfolios. It is memorable, visually coherent, and backed by real working products rather than mock case studies. The problem is not taste. The problem is that the site does not yet function reliably as a hiring funnel.

Three issues dominate:

1. **Professional-history accuracy:** The Professional Experience page conflicts with LinkedIn on dates and titles. This is the highest-priority trust failure.
2. **Positioning:** The site leads with “enterprise AI strategy,” while the desired future is a player-coach Data & AI leadership role with a real team, dedicated technical capacity, rapid feedback, and revenue or product outcomes. The current positioning could attract the exact solo strategy and AI-evangelism roles Dima wants to avoid.
3. **Proof sequencing:** The homepage and project pages make evaluators work too hard to find executive proof, outcomes, and the human stories behind the products.

The goal is not to make the site more corporate. Keep the family tools, Atlanta projects, humor, unusual interests, and Easter eggs. Connect them more explicitly to leadership, judgment, speed, and commercial outcomes.

## Desired Positioning

The current site broadly communicates:

> Enterprise AI strategist who also builds side projects.

The stronger and more accurate target narrative is:

> Player-coach Data & AI leader who leads teams, solves hard problems quickly, and turns new AI capabilities and messy data into revenue-producing systems.

Relevant fit criteria for the public positioning:

- Growth-stage private SaaS or AI-native/product company
- A real management layer and settled operating model
- Solid-line team or dedicated squad, not a solo strategy seat
- Dedicated data/engineering capacity
- Mandate tied to revenue, product adoption, or measurable operating outcomes
- Synchronous collaboration and short feedback loops
- Player-coach work: executive direction plus enough proximity to the work to ship
- Atlanta hybrid is strongest; selective remote environments can work when the culture is genuinely synchronous

Do not publish an exhaustive “avoid” list. Use the Contact page to positively describe the conditions in which Dima performs best.

## Persona Scorecard

| Persona | Score | Summary |
|---|---:|---|
| Startup recruiter | 7/10 | Clear “executive who still builds” story, but little immediate career proof or CTA hierarchy. |
| AI-startup founder/CEO | 7/10 | The shipped work is real and unusually good; generic or inflated AI language creates avoidable doubt. |
| Corporate staffing recruiter | 4/10 | Standard VP signals are present, but résumé-date/title inconsistencies are a serious trust failure. |
| Fortune 500 / SaaS VP | 7/10 | Strong judgment and curiosity; enterprise leadership is less visible than personal building. |
| Curious stranger/friend | 9/10 | Fun, distinctive, human, and memorable. Preserve this. |

## Prioritized Implementation Backlog

### P0 — Correctness and trust

#### 1. Reconcile all professional dates and titles

**Severity:** Critical
**Primary files:**

- `src/components/WorkTimeline.tsx`
- `src/pages/resume.astro`

**Known discrepancies:**

- The site says Accenture `2014 — 2019`; LinkedIn shows two Accenture roles spanning approximately Sep 2017–May 2020.
- The site labels PwC “Strategy Consultant, M&A Advisory”; LinkedIn presents it as a three-month MBA summer internship, approximately Jun–Aug 2016.
- Year-only entries conceal short tenures and create visible overlaps.

**Recommended action:**

- Reconcile every role against the public LinkedIn profile or approved résumé.
- Use exact month/year, not years only.
- Split multi-role employers where appropriate, especially Mailchimp and Accenture.
- Label the PwC position accurately as an MBA summer internship.
- Use `Mar 2026 — Jun 2026` for Lahzo if confirmed.
- Add a concise, neutral Lahzo transition note if desired, such as: “Role concluded during an organizational restructuring toward engineering and sales.” Do not litigate the departure on the public site.
- Verify A&M and Booz Allen dates before editing rather than extrapolating.

**Acceptance criteria:**

- No overlapping employment periods that are not explicitly explained.
- Dates and titles cross-check cleanly with LinkedIn.
- A recruiter can understand the MBA/PwC interval without opening an accordion.

#### 2. Distinguish employers from consulting clients

**Severity:** Major
**Primary file:** `src/pages/resume.astro`

“Companies I’ve Helped Grow” mixes employers and clients. A corporate recruiter may interpret the wall as employment history.

**Recommended action:**

- Rename to `Selected employers and clients`.
- Optionally group or visually label `Employers` and `Selected client work`.
- Do not imply employment at every logo shown.

### P0 — Positioning and hiring funnel

#### 3. Rewrite the homepage positioning around teams, revenue, and shipping

**Severity:** Major
**Primary file:** `src/pages/index.astro`

**Candidate headline:**

> VP, Data & AI. I lead teams that turn new AI capabilities and messy data into revenue-producing systems—from strategy to production, fast.

**Candidate proof strip:**

> 15+ years leading analytics and AI · $120M+ revenue impact · teams scaled from 4 to 20+ · production workflows adopted across organizations

Only publish figures that have been verified against the approved résumé/LinkedIn source.

**Recommended homepage CTA hierarchy:**

1. Primary: `See professional experience`
2. Secondary: `See what I build`
3. Tertiary navigation: About and Contact

The current four equally weighted top links force the recruiter to choose instead of guiding them.

#### 4. Add visible executive proof to the homepage

**Severity:** Major
**Primary file:** `src/pages/index.astro`

The bento contains multiple personal products but no equally tangible enterprise outcome.

Add one compact professional card or proof band with verified examples such as:

- Pricing / retention work producing $120M+ impact
- Team growth from 4 to 20+
- LLM-judge workflow redeploying approximately $200K/year of capacity
- AI training or workflows adopted by hundreds

This should not become a case-study essay. One outcome card is enough to connect the side projects to executive credibility.

#### 5. Rewrite Contact as a fit filter

**Severity:** Major
**Primary file:** `src/pages/contact.astro`

The current “I’m exploring my next role” language is passive and overly broad. “If your company is wrestling with how to make AI real” sounds like a consulting invitation and attracts ambiguous AI-strategy mandates.

**Candidate copy:**

> I’m looking for a Data & AI leadership role at a growth-stage private SaaS or AI-native company—with a real team, dedicated technical capacity, and a mandate tied to revenue or product outcomes.
>
> I do my best work as a player-coach: setting direction with executives, working closely with a team, and shipping production systems on tight feedback loops. Atlanta hybrid is the strongest fit; I’m selective about remote roles with a genuinely synchronous culture.

Reconcile this with the final positioning voice interview before publishing.

### P1 — Résumé evidence and accessibility

#### 6. Surface one quantified outcome per role without interaction

**Severity:** Major
**Primary file:** `src/components/WorkTimeline.tsx`

The page currently hides the strongest evidence inside collapsed cards. A scanner sees logos, titles, dates, and locations but not the business outcomes.

**Recommended action:**

- Show a single verified outcome line under each role while collapsed.
- Keep deeper bullets expandable.
- Prioritize outcome over responsibility in the visible line.

#### 7. Replace clickable `<div>` experience cards with accessible controls

**Severity:** Major
**Primary file:** `src/components/WorkTimeline.tsx`

Current cards are mouse-clickable `<div>` elements without keyboard behavior or expanded-state semantics.

**Recommended action:**

- Prefer native `<details><summary>` or a real `<button>` controlling a region.
- Provide `aria-expanded` and `aria-controls` when using a button.
- Ensure Enter and Space work.
- Preserve a visible focus indicator.
- Respect reduced motion for the expansion transition.

### P1 — Project-page structure

#### 8. Put the story and outcome before the gallery

**Severity:** Major
**Primary file:** `src/pages/projects/[slug].astro`

At 390px, a project page can open with a tall screenshot plus many thumbnails, pushing the title, outcome, and explanation several swipes down.

**Recommended project-page order:**

1. Breadcrumb
2. Title, date/status, and one-line outcome
3. Short “why I built it” opening
4. Key metrics / proof / live link
5. Compact hero image or gallery
6. How it works
7. Hard part / tradeoffs / failures
8. What changed
9. What remains unfinished
10. Stack, if the stack reveals a relevant decision

**Gallery fixes:**

- Do not prepend `d.image` when it already appears in `d.images`; this creates duplicated thumbnails.
- Reduce hero height on mobile.
- Give thumbnails meaningful accessible names and selected state.
- Update the main image’s alt text when the selected screenshot changes.
- Add width/height or aspect-ratio information to reduce layout shift.

#### 9. Add a consistent evidence model to flagship project pages

**Severity:** Major

Each flagship project should answer:

- What specific failure or frustration triggered this?
- Who was it for?
- What did Dima build or decide?
- What evidence shows it worked?
- What was technically or strategically non-obvious?
- What changed after it existed?
- What remains unfinished or unreliable?
- Is it used repeatedly, occasionally, or primarily a successful experiment?

Avoid forcing identical headings on every page. Preserve the natural story while ensuring the evidence exists.

## Project Voice Recommendations

These notes are calibrated against Dima’s spoken project demos. Final copy should incorporate the completed voice-interview transcripts rather than treating the candidates below as final.

### Authenticity ranking

1. ToddlerMaps
2. Dewey
3. Power Analysis
4. On Dima’s Radar
5. AI Ideas Explorer

### On Dima’s Radar

**Primary file:** `src/content/projects/atl-radar.md`

The product is stronger than the write-up. The current page describes an “event intelligence layer” and “social activation.” The spoken product story is about friendship coordination:

- Scrape the whole city widely
- Choose six relevant events plus a few free evenings
- Send one link or plain-text invite to a friend
- Get a yes/maybe response quickly
- Use proposed times and evergreen activities to reduce coordination friction

**Candidate opening:**

> I kept finding out about great Atlanta stuff after it happened. Eventbrite could give me 500 events, but it couldn’t answer the question I actually had: I want to see Dave—what are six things we’d both like, and which three nights am I free? Radar scrapes wide, ranks everything against my taste, and lets me send a short invite that gets a yes or maybe back in one text.

**Additional recommendations:**

- Show the invite-building flow, not only scoring and filters.
- Include one honest coverage miss; admitting that another source found an event the scraper missed increases credibility.
- Explain why the slide-over interaction or proposed-time workflow matters.
- Remove or replace phrases such as `personal event intelligence layer` and `social activation`.
- Do not hard-code counts like 51 events / 110 evergreen activities unless they are date-stamped or generated from current data. The live product and spoken demo already show different totals.

### Dewey

**Primary file:** `src/content/projects/dewey.md`

The page is already specific and credible, particularly the fuzzy-match failures. It omits the best human trigger and strongest validation.

**Candidate opening:**

> ChatGPT kept giving me good reading lists, but the library made me search one title at a time. Eventually I gave up, picked a children’s book by its award-winning cover, and discovered halfway through bedtime that it was about a war-torn country. So I built bulk search: paste the whole list, see what’s physically on the shelf, and walk in with the call numbers.

**Add:**

- Bulk search as the core missing library feature
- Physical verification: books found where Dewey said they would be
- The old card-catalog visual intent
- The joke about reinventing the Dewey Decimal system, if it survives the voice pass
- Clear distinction between recommendation, catalog match, branch availability, and uncertain match

### ToddlerMaps

**Primary file:** `src/content/projects/toddlermaps.md`

The written page captures the hardware economics and the hot-dog insight but underplays the emotional use case.

**Candidate opening:**

> I didn’t want to pay $100 for an AI sticker printer when I already had a Brother label printer on Wi-Fi. I’d tried connecting to it months earlier and given up; AI finally made it possible. Then the useful part stopped being stickers. It became a paper strip Dean could hold that showed what happens next—school, pool, dinner, book—or where we were on a six-hour drive.

**Add:**

- Visual schedules for transitions and time anxiety
- The road-trip strip as tangible progress for a toddler
- Whether the strips have actually been used in the car versus physically printed/tested
- The real road-sign decision and thermal-detail tradeoff
- Honest unfinished edge: automatically choosing meaningful visible landmarks at good intervals

Do not claim repeated use unless the interview confirms it.

### Georgia Power Analysis

**Primary file:** `src/content/projects/power-analysis.md`

This is already one of the clearest write-ups because it contains a surprising finding and a behavior change.

**Improve:**

- Clarify whether the approximately $120/year savings is modeled or measured.
- Add a concise ingestion/cleaning explanation if it reveals a real difficulty.
- State whether the household changed behavior and whether later bills confirmed the model.
- Fix `DAIKON` to `Daikin` in the live dashboard source.

### AI Ideas Explorer

**Primary file:** `src/content/projects/ai-ideas-explorer.md`

The live report is more convincing than the portfolio write-up. Avoid “agentic idea generation at scale” and do not call the ideas validated unless there is external market validation.

**Candidate opening:**

> I had two toddlers, a new VP job, and about six hours to figure out which AI businesses I might actually want to build. So I split the question across dozens of parallel agents and kept changing the scoring whenever the results felt wrong. The surprise wasn’t the flashiest idea. Boring businesses that could run without me kept beating bigger ideas that needed a human in the loop.

**Truth audit required:**

- Resolve 26 industries versus 24 seed themes.
- Resolve 35 agents versus 40 prompts and explain the relationship clearly.
- Use `generated and scored`, not `validated`, unless validation evidence is provided.
- Document model cost, orchestration, duplicate handling, quality control, and what decision the exercise actually changed.

## Homepage and Design Recommendations

### Preserve

- Warm light palette and coherent Serif/Sans/Mono system
- Desktop bento composition
- The hacker theme as an Easter egg
- Radar, ToddlerMaps, Suno, and family/personal evidence
- Humor and hidden grocery-mode interaction
- Reduced-motion support already present for major reveal animations

### Change

#### Radar footprint

The Radar live feed occupies two desktop grid rows and much of the first two mobile screens. Reduce the teaser to approximately three events or a shorter visual summary so professional proof and the first flagship project appear sooner.

#### Microtype

Many labels use approximately 0.55–0.7rem type. Raise the smallest functional text, especially mobile navigation, tags, filter controls, metadata, and buttons.

#### Theme consistency

`src/pages/index.astro` requests a light default while internal pages default to dark via `src/layouts/Layout.astro`. For a first-time visitor without a saved preference, navigation can change themes. Use one default across the site. Retain manual cycling.

## Mobile Requirements

### Global navigation

**Severity:** Major
**Primary files:**

- `src/layouts/Layout.astro`
- `src/styles/global.css`

At a 390px viewport, the document measured approximately 419px wide and could pan horizontally by about 29px. The brand compressed into the Work link, About wrapped, and the left edge could become clipped.

**Recommended action:**

- Replace the six-item bar with a compact menu below an appropriate breakpoint, likely around 520–700px.
- Preserve direct access to Work and Projects; place About, Contact, Resume, and theme selection in the menu.
- Do not rely on `overflow-x: hidden` to conceal an oversized navigation row.

**Acceptance criteria:**

- At 390px, `document.documentElement.scrollWidth === window.innerWidth`.
- No clipped logo or wrapped one-word controls.
- Menu is keyboard accessible and announces expanded state.

### AI Ideas live explorer

The external Galaxy Explorer is visually crowded on mobile: navigation tabs overflow, headings overlap the visualization, and category chips sit on top of the canvas.

If that app is in scope, move controls outside the canvas, use horizontally scrollable tabs, and provide a useful list or reduced-density mode on narrow screens.

## Accessibility Backlog

**Primary files:**

- `src/components/WorkTimeline.tsx`
- `src/components/ProjectsGrid.tsx`
- `src/pages/projects/[slug].astro`
- `src/pages/about.astro`
- `src/layouts/Layout.astro`
- `src/styles/global.css`

Required fixes:

- Add a real `<h1>` to About.
- Give the Projects search input a visible or screen-reader label.
- Remove `outline: none` unless replaced with a clear `:focus-visible` style.
- Add `aria-pressed` to category filters.
- Add semantic expanded state to résumé cards.
- Add semantic selected state to gallery thumbnails.
- Ensure the theme control communicates the current/next theme, not only `Toggle theme`.
- Test every interactive element with keyboard only.
- Preserve reduced-motion behavior for reveals, card animation, and expanding content.

Current theme token combinations pass normal-text WCAG AA in the tested palette. The hacker muted color is the closest to the threshold, approximately 4.64:1.

## Performance Backlog

**Primary files:**

- `src/pages/index.astro`
- `src/pages/projects/[slug].astro`
- Static assets under `public/images/` and `public/atl/`

Observed homepage state referenced roughly 17 images, three fonts, four stylesheets, and two scripts. Sampled site images exceeded 2.1MB, led by an AI Ideas image around 962KB. The Radar data payload was approximately 94KB compressed before event thumbnails.

Recommended actions:

- Convert large PNG/JPEG assets to appropriately sized AVIF/WebP variants.
- Add responsive `srcset`/`sizes` where useful.
- Add `loading="lazy"` to below-fold bento images.
- Keep the first meaningful image eager and give it explicit dimensions.
- Reduce the homepage Radar payload to only the fields/events displayed.
- Do not load the AI Ideas iframe merely because it is within a 200px intersection margin. Prefer an explicit `Try live` action.
- Consider self-hosting or otherwise stabilizing critical icon assets currently fetched from third-party CDNs.

## Runtime and Link Cleanup

- All tested primary routes and live apps returned HTTP 200 during review.
- No console warnings or errors were observed on the core portfolio pages.
- One Radar image attempted a malformed URL shaped like `/atl/https://...` and returned 404 before the emoji fallback. Detect absolute URLs before prefixing `/atl/`.
- Retain the visual fallback, but eliminate the failed request.

## SEO and Indexing

**Primary files:**

- `src/layouts/Layout.astro`
- `src/pages/projects/[slug].astro`
- `src/content/config.ts`
- `astro.config.mjs`

### Unlisted projects are still indexed

The UI lists 12 projects, but approximately 34 project files marked `listed: false` still receive public routes and appear in the sitemap because static paths are generated for the entire collection.

Recommended content-state model:

- `listed`: appears in the Projects grid
- `public`: direct route can be generated/shared
- `indexable`: may appear in sitemap/search results

For private or unfinished items, either omit the route or apply `noindex` and remove it from the sitemap. Do not assume `listed: false` means hidden from search.

### Open Graph

- Fix the homepage OG title currently rendering like `Dima Perkis — Dima Perkis`.
- Use flagship project images for project-specific OG previews rather than the generic brand card everywhere.
- Keep descriptions concise enough for social previews.
- Verify generated preview cards after the change.

## Projects Grid

**Primary file:** `src/components/ProjectsGrid.tsx`

Recommendations:

- Pass `shortDescription` through from `src/pages/projects.astro`; the component type supports it, but the mapped data currently omits it.
- Avoid mechanically truncating a long description at 80 characters when a crafted one-line description exists.
- Keep the curated list of 12; curation is a strength.
- Ensure filter buttons expose selected state and the search input has a label/focus state.

## Implementation Sequence

Recommended order to minimize rework:

1. Reconcile professional-history source of truth.
2. Update homepage and Contact positioning after the voice-positioning interview is complete.
3. Repair global mobile navigation and theme defaults.
4. Rebuild résumé expansion semantics and visible proof lines.
5. Reorder the project-page template and repair gallery behavior.
6. Rewrite Radar, Dewey, and ToddlerMaps from verified interview transcripts.
7. Truth-audit and rewrite AI Ideas; clarify Power estimates.
8. Repair accessibility across filters, gallery, headings, focus, and theme controls.
9. Optimize images, Radar payload, and iframe behavior.
10. Implement indexing/OG cleanup and run the full verification pass.

## Verification Checklist

Before considering the work complete:

### Content and trust

- [ ] Résumé dates/titles match LinkedIn and approved résumé.
- [ ] Employers and clients are clearly distinguished.
- [ ] Homepage clearly communicates team leadership, commercial outcomes, and shipping.
- [ ] Contact describes the desired operating environment, not generic job-search status.
- [ ] Every number is labeled or understood as measured, estimated, projected, or a dated count.
- [ ] No project claims external validation when the evidence is only model scoring.

### Desktop and mobile

- [ ] Homepage, Resume, Projects, About, Contact, and five flagship project pages reviewed at desktop width.
- [ ] Same pages reviewed at exactly 390px width.
- [ ] No horizontal overflow at 390px.
- [ ] Project title/outcome appears before a large mobile gallery.
- [ ] Light, dark, and hacker themes all remain legible.

### Accessibility

- [ ] Full primary flow works by keyboard only.
- [ ] Visible focus exists on every interactive element.
- [ ] Accordion, filters, menus, and galleries expose state semantically.
- [ ] About has one H1; all pages have sensible heading hierarchy.
- [ ] Reduced-motion preference disables nonessential movement.
- [ ] Images have useful alt text or intentionally empty alt text when decorative.

### Technical

- [ ] `npm run build` succeeds.
- [ ] No new console errors or warnings.
- [ ] No malformed `/atl/https://...` image request.
- [ ] Core routes and external live links return successfully.
- [ ] Large images are resized/converted and below-fold media is lazy-loaded.
- [ ] Hidden/unlisted projects are handled intentionally in routes and sitemap.
- [ ] OG title, description, and project images render correctly.

## Preserve Existing User Work

At the time of review, the worktree already contained untracked user material, including the review prompt, transcript-derived content notes, and a `photos/` directory. Treat all existing uncommitted and untracked files as user-owned. Do not delete, overwrite, reset, or clean them.

Follow the project rules:

- Do not read or output `.env` contents.
- Do not push to Git without Dima’s explicit approval.
- Do not modify unrelated projects or Paperclip data.
- Make a brief implementation note before structural/design changes.

## What the Site Already Does Better Than Typical Executive Portfolios

Do not lose these qualities during the rewrite:

1. **It contains real shipped products.** Radar, ToddlerMaps, Power, and AI Ideas are functioning artifacts, not executive theater.
2. **It has a coherent person behind it.** Family, Atlanta, music, adventure, and technical curiosity make Dima memorable.
3. **Its best stories include failure modes and judgment.** Dewey’s catalog matching, Power’s Saturday demand spike, and ToddlerMaps’ printing constraints demonstrate capability better than generic AI-transformation claims.

The finished site should feel just as personal, but become faster to understand, harder to doubt, and more selective about the opportunities it attracts.
