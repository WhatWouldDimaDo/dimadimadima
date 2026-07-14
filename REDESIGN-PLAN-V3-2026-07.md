# dimadimadima.com — Refresh Plan (Working Plan, drafted 2026-07-14)

Goal: cleaner layout, professional resume section (no tag clouds), right projects told in Dima's voice, live ATL Radar strip on the homepage, favicon, bigger headshot, updated identity post-Lahzo.

## Decisions from Dima (2026-07-14)

- **Dewey confirmed** as the new name for Book Scout.
- **Featured order: On Dima's Radar (hero) → Dewey → ToddlerMaps.** (AI Ideas Explorer no longer hero.)
- **Headshot: keep dima.jpeg** (now rendered large).
- **Jeannie line approved** as drafted — live on About.
- **WiggleWorks blocked on assets**: Dima will capture screenshots + a GIF of himself playing with the stick-figure computer-vision overlay visible. Build the page once those land.
- **Favicon concept**: Dima's silhouette in profile facing right, forming the counter (inside space) of a bold letter D. He has a GPT draft, checking this afternoon — wait for his asset before building.

## Status (2026-07-14 PM)

Phases 1–2 implemented on branch `refresh-2026-07` (identity refresh, resume overhaul, dead v2/v3/v4 pages deleted). Build clean, verified locally. Not yet deployed. Note for Dima: Equifax title on the resume said "VP, Global AI & Data Strategy" — corrected to "Senior Director" to match LinkedIn; confirm.

---

Compound-engineering inputs: `HANDOFF.md` + `CLAUDE.md` (this repo), project handoffs for Book Scout (`2026-07-10_Book-Scout/HANDOFF.md`), ToddlerMaps (`2026-07-11_Kid-Map-World/HANDOFF.md`), WiggleWorks (`2026-05-30_Move-and-Play/HANDOFF.md`), Power Analysis (`2026-07-13_Power-Analysis/HANDOFF.md`), and the Jul 14 LinkedIn-approved copy (`Brain/01_Projects/2026-07-07_Job-Search-OS/30_Materials/2026-07-10_LinkedIn-Draft-Content.md`).

Standing rules that bind this work: feature branches only (main push blocked) · never sed content files · every stat from real data · no $400M+ · no finality language · LinkedIn URL `dima-perkis`.

---

## Phase 1 — Identity & copy refresh (site-wide)

The site still says "VP Strategy & Analytics at Lahzo" in present tense (index intro, resume header, about hero, meta descriptions). Sync everything to the Jul 14 LinkedIn-approved framing.

1. **Headline/tags (index intro cell)** — replace bio + eyebrow. Direction: align with LinkedIn headline "VP, Data & AI | AI Strategy at the Board Level, Deployed Systems at the Team Level." Tags: keep `AI builder / Data systems / Atlanta, GA` or revise per Dima. Remove "30+ projects shipped" from bio AND the `<Layout description>` meta.
2. **About hero paragraph** — rewrite from LinkedIn About (the approved 5-paragraph version, condensed). Ex-Lahzo handled the same way LinkedIn does: factual, no exit explanation.
3. **Jeannie** — About currently names Dean & Ruby but not Jeannie (she appears only in the bucket list). Add a line in the Personal panel + hero. Draft to react to: *"Married to Jeannie, who deserves public credit for her patience with my dad jokes and the endless parade of apps I make her beta-test."* (Dima to dictate his own version.)
4. **Headshot much bigger** — About: 160px circle → large portrait (~320–400px, consider square/rounded-rect instead of circle so it reads as a portrait, not an avatar). Resume: 80px → ~140px. Ask if a newer photo exists (open item since May: "user will provide new photo").
5. **Approved numbers only** (from Job-Search-OS hard rules): $120M+ revenue impact (Mailchimp, broad framing), $2M+ Equifax partnership revenue stream, ~$200K/yr redeployed (LLM judges). Never: $400M+, $250K "saved", $14–22M projection, "30+ projects shipped."

## Phase 2 — Resume section overhaul

Current `/resume`: highlight strip (15+ / 7 / 30+ Projects shipped), ResumeExperience (ClientLogoWall filter + WorkTimeline with industry/function tag-cloud filters), education, skill-pill wall, Outside Work.

1. **Remove the tag clouds** — kill the industry/function filter chips in `WorkTimeline.tsx` and evaluate the ClientLogoWall filter (keep logos as a static wall or drop). Also thin/remove the "Skills & Tools" pill wall — replace with a short prose line or 5–6 named competencies if kept at all.
2. **Remove "30+ Projects shipped"** from the highlight strip. Replace with a real, defensible stat or reduce strip to two cells (15+ years · 7 companies) — Dima to pick.
3. **Sync content to LinkedIn Jul 14** — add Lahzo entry (Mar–Jun 2026, three lanes framing, ~$200K redeployed), fix header title/subtitle ("VP, Data & AI"), rewrite the summary paragraph from the LinkedIn About (drop "versatile player-coach" if Dima wants; verify — he liked player-coach as concept but not as a lead label).
4. **Professional layout** — single-column chronological timeline, company logo + role + dates + 2–3 lines each, in LinkedIn paragraph voice. No filtering UI. Add link to LinkedIn profile prominently.
5. **Fix `<title>`** → "Dima Perkis — Resume" (open item since May).
6. Optional: "Download PDF" button once `Resume_Perkis_AIEnablement_v1` exists (deferred — resume master not built yet).

## Phase 3 — Projects curation

### Removals / renames (content collection)
| Action | File | Note |
|---|---|---|
| Remove | `sisyphus.md` | delete or `listed: false` + unfeature |
| Remove | `ai-enablement-web.md` (AI Enablement Portal) | delete or `listed: false` |
| Remove | `lil-mimic.md` (Mimic Studio) | ToddlerMaps supersedes it; also swap the homepage Lil' Mimic cell |
| Rename | `atl-events.md` "ATL Event Intelligence" → fold into ATL Radar story or retitle **"On Dima's Radar"** | canonical URL dimadimadima.com/atl; decide merge vs. two entries |
| Update | `atl-radar.md` | title → "On Dima's Radar", URL → dimadimadima.com/atl (currently may point at old vercel URL) |

### Additions (new project pages, sourced from handoffs)
| Project | Source | Angle |
|---|---|---|
| **Dewey** (Book Scout — confirm name) | Book-Scout HANDOFF | taste-profile book recs + live Ponce branch availability via undocumented BiblioCommons API; thrift-shelf photo → "worth reading?" |
| **ToddlerMaps** | exists (`toddlermaps.md`) — refresh + likely feature | coloring maps of Dean's real world, label-printer stickers, trip strips answering "are we there yet?" |
| **WiggleWorks** | Move-and-Play HANDOFF | webcam body-movement game hub, 15 games, MediaPipe pose, no backend, wiggleworks.vercel.app |
| **Power Analysis** | Power-Analysis HANDOFF | Georgia Power Smart Usage analysis, 10,487 hourly readings, live dashboard at /power |

### Voice pass (the big one)
Nearly all project copy is AI-generated. Rewrite **featured project pages first** from Dima's dictations (questions queued below), in his LinkedIn-established voice: first-person flowing paragraphs, varied openers, "deploy" not "ship", few em dashes, no AI padding, run through `/de-ai-ify`. Description fields on cards get the same pass.

### Projects page layout
- **Remove the tag-cloud filter row** in `ProjectsGrid.tsx` (the `allTags` pill row). Keep at most the 4–5 category filters, or nothing — Dima to pick.
- Remove per-card tag pills if present; image-first cards stay.

### New featured lineup (proposal — Dima confirms)
1. AI Ideas Explorer (hero — confirm it stays)
2. ToddlerMaps
3. On Dima's Radar
4. WiggleWorks
5. Dewey
6. Power Analysis
7. Spotify Analysis / Concert History (stat cells)
Dropping from featured: Lil' Mimic (removed), Fjord Sauna Bot, Dive52 (confirm).

## Phase 4 — Homepage layout

1. **Rework bento** for the new lineup: intro (updated copy) · bigger presence for ToddlerMaps (has strong imagery) · Dewey · WiggleWorks · Power · keep concert/spotify stat cells.
2. **"Happening in ATL" live strip** — new bento row/cell pulling the next 3–5 top-scored upcoming events from ATL Radar. Same origin: `/atl/data.js` is already served by this site (static passthrough). Implementation options:
   - (a) client-side script that loads `/atl/data.js` and renders top upcoming by score/date — always fresh, zero build coupling; or
   - (b) build-time import — stale between deploys. **Recommend (a).**
   - Each event links to /atl. Respect the data.js block-parser lesson (never regex-patch; read-only here so low risk).
3. **Feed trim** — /feed has 40 posts and reads cluttered. Options: add `listed`/curation flag to posts and cut to the best ~15–20; or default-collapsed by type with filter chips. Remove/unlist the travel-spending post ("26 months of spend analyzed") per Dima. He picks the keep list.
4. **Favicon** — none exists (no favicon file in public/, none linked in Layout head). Create SVG favicon + apple-touch-icon + link tags. Concept candidates: "D³" monogram in the site's gold-on-dark, or the DM Serif "D". Dima to pick.

## Phase 5 — Cleanup & QA

- Delete dead routes/components: `v2.astro`, `v2-editorial.astro`, `v3-dashboard.astro`, `v4-terminal.astro`, `WorkPortfolio.tsx` (all superseded).
- OG/meta: refresh descriptions site-wide (no Lahzo-present-tense, no 30+); project-specific OG images still open — optional this round.
- QA: build clean, check all three themes, mobile single-column order, verify /atl and /power passthroughs untouched, click every homepage cell. Screenshot before/after. Deploy via feature branch → `npx vercel --prod`.
- Known sandbox quirks: preview_start can false-404 this project — verify via `python3 -m http.server` + curl (see memory).

---

## Questions queued for Dima (dictate answers in your own words — these feed the voice pass)

**Positioning**
1. How do you want the site to describe you right now — same as the LinkedIn headline, or looser? Should the site signal you're open to opportunities, or stay silent about the search?
2. Resume highlight strip: what replaces "30+ Projects shipped"? (Or drop to two stats?)

**Projects — origin stories (2–3 min of dictation each is plenty)**
3. **Dewey** — confirm the name (repo says Book Scout). Why did you build it? Favorite moment using it (a thrift-store find? a Dean bedtime win?). What's the one detail you'd brag about?
4. **ToddlerMaps** — the origin in your words (the Jul 6 brain-dump, Dean and "are we there yet?"). Which artifact makes you proudest — trip strips, the calendar labels, the sticker studio? Any Dean reaction worth quoting?
5. **WiggleWorks** — where did it start (Balloon Pop story), what do the kids actually play, which game is the sleeper hit?
6. **Power Analysis** — what triggered pulling 13 months of bills? What did you actually change at home after seeing the data? Any real dollar number you'd stand behind?
7. **AI Ideas Explorer** — still the hero project, or has ToddlerMaps/something else taken its place in your mind?
8. Featured cut list: OK to drop Dive52 and Fjord Sauna Bot from the homepage? Anything else on the site you'd kill entirely?

**Personal**
9. The Jeannie line — react to the draft above or dictate your own (tone check: humorous-grateful).
10. Feed: what earns a spot — family art + songs + a few project launches? Rough cap?
11. Favicon: monogram "D³", serif "D", or something weirder (the map pin? Graybie?)?
12. Do you have a newer headshot you want up, or keep dima.jpeg?

---

## Suggested execution order
1. Phase 1 + 2 (identity + resume) — self-contained, biggest professionalism win, mostly derivable from LinkedIn copy without dictation.
2. Phase 3 removals/renames + Phase 4 favicon + feed trim — mechanical.
3. Dictation session → voice pass + new project pages (Dewey/WiggleWorks/Power, ToddlerMaps refresh).
4. Homepage bento rework + ATL live strip.
5. Cleanup, QA, deploy.
