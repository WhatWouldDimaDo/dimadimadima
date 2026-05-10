# dimadimadima.com — Cold Start Handoff

*Last updated: 2026-05-09 · Session: ux-audit-bento-plan*

---

## What This Is

Personal portfolio site for Dima Perkis. Astro 4.16 + React islands + Tailwind + CSS custom properties. Three themes (dark/light/hacker). Deployed on Vercel at dimadimadima.com.

**Site thesis:** "This guy builds cool stuff, knows AI, has a sense of humor, and does a lot of it." Professional + personal blended. Project pages serve as open-source playbooks — "GitHub for non-technical people."

---

## Architecture

```
src/
  content/
    projects/*.md    — Zod schema: title, description, tags, date, url, image, featured, order, status
    posts/*.md       — Zod schema: title, type (song|image|project|note), tags, date, youtube, embed, image, caption, draft
    config.ts        — Content collection schemas
  pages/
    index.astro      — Hero + featured projects grid (1 hero + up to 5 grid) + feed + about strip
    v2.astro         — NEW: Bento grid homepage (in development — WIP)
    projects.astro   — All projects grid (uses ProjectsGrid.tsx React island)
    resume.astro     — Work timeline (uses WorkTimeline.tsx React island)
    about.astro      — Three-section: Professional / Side Quests / Personal
    feed.astro       — All feed posts
    [slug] pages     — Dynamic routes for projects and posts
  components/
    BentoGrid.astro        — NEW: Bento grid container (in development)
    BentoCell.astro        — NEW: Cell wrapper with span props + variants (in development)
    ProjectCard.astro      — Reusable card with status dot, gold sweep hover
    ProjectsGrid.tsx       — React island with tag filtering for /projects
    WorkTimeline.tsx       — Resume timeline with industry/function tag cloud
    WorkPortfolio.tsx      — OLD resume component (kept but unused, can delete)
  layouts/
    Layout.astro           — Nav, footer, theme toggle, Konami easter egg
  styles/
    global.css             — Theme tokens (dark/light/hacker), base font 1rem
public/
  images/                  — All project screenshots, feed images, logos
    logos/                 — Company logos for resume (SVGs)
```

---

## Featured Projects (order field determines homepage position)

| Order | Project | Status | Image | Notes |
|-------|---------|--------|-------|-------|
| 0 | AI Ideas Explorer | live | ai-ideas-galaxy.png | Hero project. 1,160 ideas, scoring evolution story |
| 1 | ATL Radar | active | atl-radar-home.png | Personal event intelligence layer |
| 2 | Dive52 | active | dive52-discord.png | ADHD knowledge retention system |
| 3 | Spotify Analysis | active | spotify-hero.png | 14 years, 10,133 hours, 147,594 streams |
| 4 | Concert History | — | concert-history-hero.png | 178 shows, 18 years |
| 5 | Suno Factory | active | **MISSING** | 75+ songs, full pipeline described |
| 6 | Fjord Sauna Bot | built | fjord-imessage.png | iMessage "My bot found an opening!" thread |

Kill Bill was unfeatured (`featured: false`). 27 other projects also unfeatured.

---

## Bento Grid /v2 — In Development

**Goal:** Replace the homepage with a bento grid layout at `/v2`. If it works well, promote to `/`. Deploy stays at dimadimadima.com.

**Reference inspiration:** bentogrid.codedesign.app + neal.fun

**Cell map (desktop, 12-column CSS Grid):**
```
Intro (2×2) | Art cell (1×2) | Stat: 178 shows | Stat: 10,133 hrs
             |                | Stat: 30+ projects | Atlanta GA
──────────────────────────────────────────────────────────────────
AI Ideas Explorer ← hero project (full-width or 3/4)
──────────────────────────────────────────────────────────────────
ATL Radar (2×1) | Dive52 (2×1) | Suno Factory (2×1)
──────────────────────────────────────────────────────────────────
Spotify wide | Concert History | Music cell
```

**Technical approach:**
- New `src/pages/v2.astro` route
- New `src/components/BentoGrid.astro` container
- New `src/components/BentoCell.astro` wrapper (col/row span props, variant types)
- No new color tokens — reuse all existing CSS custom properties
- Mobile: single column, cells in priority order

**Cell types:** `intro | project-hero | project-card | stat | art | music | cta | location`

---

## UX Issues Found (Audit Session 2026-05-09)

### Fixed This Session
- [x] `$400M+` stat on resume → changed to `30+` / "Projects shipped"
- [x] Nav "Work" → "Resume"
- [x] About page contact email → `dperkis@gmail.com` (was work email)

### Still Open
- [ ] Suno Factory has no hero image — only featured project without one
- [ ] Projects page: cards with images vs. text-only walls look inconsistent
- [ ] Mobile projects page: 16,000px text scroll, no visual anchors
- [ ] Project detail pages: body is pure text, no screenshots in body
- [ ] Project page footer: "→ ALL PROJECTS" dead-end, needs next-project CTA
- [ ] Resume page `<title>` says "Work" not "Dima Perkis — Resume"
- [ ] OG image is `dima.jpeg` sitewide — no project-specific OG
- [ ] No favicon beyond default

---

## Content Discovery Patterns (What Worked)

### Finding project backstories
Launch haiku subagents to search both `~/Documents/Coding/Projects/` AND `~/Documents/Brain/01_Projects/` for the same project. The Brain vault often has planning docs, PRDs, and conversation logs that explain the "why" — the code repo has the "how." Cross-referencing both gives the full narrative.

**Key Brain vault project folders found by agents:**
- `Brain/01_Projects/2026-04-19_OpenClaw-AI-Business-Ideation/` — AI Ideas scoring rounds, synthesis docs
- `Brain/01_Projects/2026-01-17_Suno-Songs/` — 85 markdown files, 5,500 lines, full song catalog
- ATL Radar planning: PRD.md (15 sections), VENUE-REFRESH-GUIDE.md, taste profile docs
- Kill Bill: `2025-09-13_Tarantino-Graph/` — 8 planning files, ~10,000 words

### Finding screenshots
User drops screenshots in two locations:
- **External volume:** `/Volumes/dima/Documents/Screenshots/` — organized into subfolders
- **Local MBP:** `/Users/dmitriyperkis/Documents/Screenshots/` — flat files with SCR-* naming

Read each image file to identify what it shows, then copy to `public/images/` with descriptive filenames.

---

## User-Dictated Context (Decode SuperWhisper)

Dima dictates via SuperWhisper. Transcription errors are common. Key decoded context:

- **Morningside Place** = their neighborhood. 75 units, 25 kids under five.
- **Heavy Cave** = weighted blanket game with Dean. He fights his way out.
- **Graybie** = the cat. Curls up like a croissant.
- **Three Owl** = friend David Feldman's company. Logo parody post.
- **Pumpkin Patch Tour** = day trips as concert posters in group texts.
- **Dad Squad** = staying connected with close friends in hectic family stage.
- **Roobubbs** = Ruby's nickname/sticker brand.

---

## Technical Notes

- **Build:** `npm run build` — clean, ~1.8s, 48 pages
- **Deploy:** `npx vercel --prod` then `npx vercel deploy --prod` to promote
- **Git:** Main branch push is blocked by repo policy. Use feature branches.
- **Theme tokens:** `src/styles/global.css` — light mode gold `#8a6012`, muted `#6a6560` (WCAG AA). Hacker mode muted `#3a8a3b`.
- **Grid pattern:** All grids use `gap-4` (1rem) with individual `border border-border` on cards.
- **WorkPortfolio.tsx** is still in the repo but unused. Can be deleted.
- **Images:** All in `public/images/`. No image optimization pipeline — just raw files.

---

## Open Items (Priority Order)

1. **Bento grid /v2 build** — `BentoGrid.astro` + `BentoCell.astro`, route at `/v2`
2. **Suno Factory screenshot** — only featured project without a card image
3. **Project page body** — add at least one screenshot per project detail page
4. **Project page footer** — replace "→ ALL PROJECTS" with next-project CTA
5. **Resume page title** — fix `<title>` to "Dima Perkis — Resume"
6. **SEO** — meta descriptions, project-specific OG images, favicon

---

## Common Mistakes to Avoid

1. **Don't use sed on content files.** Earlier session wiped `ai-ideas-explorer.md` to 0 bytes. Use the Edit tool with explicit file paths.
2. **Read before Edit.** The Edit tool requires the file to have been Read first in the conversation.
3. **SuperWhisper transcription.** "HTL Radar" = ATL Radar. "Diver" = Dive52.
4. **Don't use the `$400M+` stat.** Removed from resume. Do not re-add.
5. **No finality language.** Don't write "FINAL", "Complete", "Locked" in filenames or headers.
6. **LinkedIn URL is `dima-perkis`** (with hyphen), not `dimaperkis`.
7. **Don't inflate numbers.** Every stat should come from real data.
