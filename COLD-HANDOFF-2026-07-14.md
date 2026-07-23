# Cold Handoff — dimadimadima Portfolio Refresh

**Last updated:** 2026-07-18
**Repository:** `WhatWouldDimaDo/dimadimadima`
**Production:** https://dimadimadima.com
**Vercel project:** `dimas-projects-a8469b81/dimadimadima`
**Latest release branch:** `feat/visual-brand-refresh` → `main`

## Objective

Refresh the portfolio so it works as both a distinctive personal site and a credible hiring surface for Dima's next role. The intended positioning is:

> Player-coach Data & AI leader who leads teams and turns messy data and emerging AI capabilities into revenue-producing systems—from strategy through production.

The design should remain personal, playful, and builder-led without making recruiters hunt for executive scope or commercial outcomes.

## July 18 Brand and Information Architecture Update

The latest release reorganizes the site around five stable destinations: **Work, Projects, Now, About, and Contact**. These labels come from the shared layout and remain the same on every page. `Work` links to the detailed professional-experience page; there is no separate Resume button in the header.

### Brand system

- The homepage identity uses the large teal `D` with Dima's right-facing profile cut into its counter and an orange beard.
- `Dima Perkis` sits on two lines beside the mark, aligned to its top and bottom.
- The small header combines the selected `D` mark with the `dima dima dima` wordmark.
- Current selected mark: `public/images/brand/dima-dima-dima/dima-mark-concept-01-transparent.png`.
- The broader visual system remains warm cream, dark teal, and reddish orange, with dark and hacker theme support.

### Homepage and navigation

- The homepage leads with Dima's name, leadership positioning, and four concise proof points.
- The redundant category-card row under the hero was removed. The persistent global navigation is now the category system.
- The text link to Professional Experience under the hero was removed.
- Selected projects remain directly accessible from the homepage, with screenshots or motion previews where available.
- Homepage proof points currently include `$140M+ delivered value`, `15+ years experience`, `23 AI projects live`, and `2 toddlers`.

### About

- The introduction emphasizes connecting with people, live music and events, and seeking awe, joy, and absurdity.
- The family-photo caption names Jeannie, Dean, Ruby, and Dima; do not call them “the home team.”
- Values were rewritten using Dima's Brain, coaching materials, and personal Codex. The six current themes are family freedom; joy, awe, and absurdity; following the interesting thread; physical vitality; finding calm and continuing forward; and connecting people while leaving things better.
- The page includes a larger family image and six photos of Dima out in the world.

### Contact

- The role thesis now describes systems that give people and teams new superpowers and lead to revenue growth. Avoid the phrase “get used.”
- Conversation starters include practical AI systems, team building, useful side projects, Atlanta live events and music, and toddler tech.
- Toddler tech means using AI to reduce friction and bring more joy to family life—not positioning children as a product category.

### Current operating state

- `npm run build` passes with 53 static pages.
- Local preview used for this release: `http://127.0.0.1:4322/`.
- The primary checkout on `refresh-2026-07` contains unrelated local changes and must not be cleaned or overwritten.
- The release was prepared in `.worktrees/feat/visual-brand-refresh` as a clean fast-forward from `origin/main`.

## Earlier July 14 Update (Historical)

The notes below describe the preceding refresh. Where details conflict, the July 18 update above is authoritative.

### Global design system

- Removed DM Serif Display from public pages.
- DM Sans now carries headings and body copy; DM Mono is limited to navigation, status, and metadata.
- Added reusable page-title, section-title, kicker, and eyebrow styles.
- Enlarged the `dima dima dima` header wordmark.
- Added a keyboard-accessible mobile menu and clearer theme-toggle labels.
- Updated project-detail and dashboard typography to match the main site.

### Homepage

- Repositioned Dima as a Data & AI leader who leads teams and ships revenue-producing systems.
- Added verified proof for $120M+ revenue impact, 6× team growth, and approximately $200K of capacity redeployed with AI.
- Rebalanced the bento into consistent-height rows with more deliberate spacing.
- Kept Radar, Dewey, family tools, data projects, music, and creative work as the personality layer.

### Contact

- Rebuilt the page around a direct role thesis and positive fit filter.
- Target fit: growth-stage SaaS or AI-native company, real team, product/revenue mandate, Atlanta hybrid.
- Replaced awkward Email and LinkedIn cells with compact icon-led contact rows.
- Added icon-led conversation starters with supporting descriptions.

### About

- Hero now uses only Dima's headshot.
- Family photo is the main secondary hero, with four world/adventure thumbnails beside it.
- Added icon-led core-value cards with descriptions.
- Reworked the bucket list into Completed / Next up / Someday lanes.
- Reframed the professional, side-quest, and family identities in three concise panels.

### Professional Experience

- Removed the “15+ years” and “7 companies” counters.
- Added six Core Expertise cards inspired by Shawn Jones, with hover/focus descriptions and touch-safe fallbacks.
- Added visible metric chips to every role so quantified evidence is available without expanding an accordion.
- Corrected the public chronology to match LinkedIn, including Accenture and the PwC MBA internship.
- Reworked tools into a quieter “close enough to the work” section.
- Replaced the static logo wall with a reduced-motion-safe marquee.
- Removed Intuit because Mailchimp is already represented.
- Replaced the broken Verizon asset and outdated Pfizer mark.
- Renamed the logo section “Selected companies and clients” to avoid implying employment at every logo.

### AI Side Quests

- Replaced “things that probably shouldn't exist” with “Built because it should exist.”
- Rebuilt project cards with consistent image ratios, larger descriptions, visible status/date, and more generous spacing.
- Improved filter/search semantics and keyboard focus.
- Passed `shortDescription` through from Astro content when available.

### SEO and accessibility

- Added optional `noindex` support to the shared layout.
- Excluded unlisted project slugs from the sitemap while preserving direct URLs.
- Added semantic buttons, `aria-expanded`, controlled regions, pressed states, search labels, focus styles, touch fallbacks, and reduced-motion behavior.

## Positioning Sources Used

- Live LinkedIn headline, About section, and chronology.
- July Positioning Dossier and Role Criteria.
- July 8–14 networking reflections and transcripts.
- June Lahzo arc reflection.
- Shawn Jones's portfolio for expertise-card hierarchy and whitespace.

The resulting site intentionally leads with team leadership, shipping, revenue, and production—not a solo enterprise-AI-strategy identity.

## LinkedIn Recommendation

Recommended headline:

> VP, Data & AI | Player-Coach Building Revenue Systems from Strategy to Production | Mailchimp, Equifax, Accenture | Duke MBA

Recommended opening for About:

> I lead teams that turn messy data and emerging AI capabilities into revenue-producing systems—from strategy through production.

Keep the quantified company paragraphs. Replace “Twenty years in” with “I still build for fun” to avoid another tenure claim.

## Future Reference Sites and Backlog

These were researched but intentionally not added to this release:

1. **Lee Robinson** — integrate professional thesis, family, music, and current activity naturally.
2. **Brittany Chiang** — add a full project archive and stronger proof on flagship projects.
3. **Maggie Appleton** — categorize Side Quests by intent, not only technology.
4. **Simon Willison** — generate a “Recently shipped” stream from project metadata or GitHub releases.
5. **Derek Sivers** — add a concise, dated `/now` page.
6. **Paco Coursey / Josh Comeau** — one signature interaction such as a command palette; avoid accumulating decorative effects.
7. **Patrick Collison** — consider “Questions I'm chasing” as a stronger intellectual signal than more bucket-list items.

Recommended next sequence:

1. Add one anonymized professional case study: problem → judgment → system → adoption → business outcome.
2. Add `/now` with current professional focus, active builds, learning, and family plans.
3. Generate a small “Recently shipped” feed from existing project frontmatter.
4. Add “Questions I'm chasing.”
5. Add one command-palette interaction only if it improves navigation.

Do **not** add more generic homepage tiles. The next gain should come from deeper proof and stronger content types.

## Verification

- `npm run build` passes.
- 51 static pages generated.
- `git diff --check` passes.
- Desktop browser QA completed for `/`, `/contact`, `/about`, `/resume`, and `/projects`.
- No site-originated console errors were found; the only observed error came from a Chrome extension.
- No desktop horizontal overflow was detected.
- React review covered component structure, semantic controls, hooks, rendering, accessibility, and reduced motion.

## Known Gaps

- Chrome's viewport override did not change its effective width, so a reliable 390px visual screenshot was not obtained. Responsive CSS was reviewed and contains explicit 850px, 760px, 720px, 640px, 620px, 560px, and 480px fallbacks. A real-phone smoke test is still recommended.
- Expertise descriptions intentionally reveal on hover/focus for pointer devices and remain visible on touch devices.
- The hand-authored Verizon and Pfizer SVGs are clean replacements, but official vector assets could be substituted later if brand-perfect marks become important.
- The site still depends on Google Fonts at runtime.

## Files Deliberately Excluded from Release

- `photos/` — 64 MB of raw source photos; optimized copies already live under `public/images/`.
- `REVIEW-PROMPT-CHATGPT.md` — review working material.
- `CONTENT-why-i-built-chris-2026-07-14.md` — unpublished content draft.

These remain local and untracked. Do not add them to a release without an explicit content decision.

## Operational Notes

- Vercel production aliases: `dimadimadima.com`, `www.dimadimadima.com`, and `dimadimadima.vercel.app`.
- The Vercel project is already linked through `.vercel/project.json`; do not relink it.
- Production normally deploys from `main` through Vercel Git integration.
- Rollback can be performed with `vercel rollback` or by promoting a prior Ready production deployment.
- No environment files were read or changed during this work.
