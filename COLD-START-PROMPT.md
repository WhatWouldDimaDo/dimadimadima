# Cold-Start Prompt — dimadimadima Redesign

**Paste this entire file into a new session to resume work. No additional context needed.**

---

## PROJECT CONTEXT

This is **dimadimadima.com** — Dima Perkis's personal portfolio site built with Astro 4 + React 18 + Tailwind 3 + TypeScript. It showcases his projects, a creative feed, resume, and about page.

**Working Directory:** `/Users/dmitriyperkis/Documents/Coding/Projects/2026-04-15_dimadimadima`
**Stack:** Astro 4.16, React 18.3, Tailwind 3.4, TypeScript
**Dev Server:** `npm run dev` on port 4321
**Build:** `npm run build` → `dist/`
**Deploy:** Vercel (auto-deploy on push to main)

---

## WHAT'S BEEN DONE

A comprehensive redesign plan has been created (`REDESIGN-PLAN.md` — 1089 lines) identifying 8 root-cause issues and a 6-phase implementation plan estimated at $29-46.

A **cost-optimized V2 plan** (`REDESIGN-PLAN-V2.md`) has been created, reducing the estimated cost to **~$4.65** through:
- Model matched to task (Haiku/Flash for mechanical work, Sonnet only for logo generation)
- Wave-based parallel execution
- One-shot spec-driven implementation
- Reusing existing assets (27 SVG logos, ~30 screenshots)

**The V2 plan is the one to follow.** The original plan is for reference only.

---

## CURRENT STATE OF THE CODEBASE

### Key Files

| Path | Purpose | Status |
|------|---------|--------|
| `src/pages/index.astro` | Homepage (bento grid) | Needs nav redundancy fix, CTA cell fix |
| `src/pages/projects.astro` | Projects grid page | Needs image/display fixes |
| `src/pages/projects/[slug].astro` | Individual project detail | Needs description handling, gallery fix |
| `src/pages/resume.astro` | Resume page | Needs logo wall, timeline redesign |
| `src/pages/about.astro` | About page | OK |
| `src/pages/feed.astro` | Creative feed | OK |
| `src/pages/v2.astro` | Existing v2 experiment | Exists, may conflict with new layouts |
| `src/layouts/Layout.astro` | Main layout wrapper | Needs nav fix |
| `src/styles/global.css` | Global CSS + theme tokens | Needs typography update |
| `src/content/config.ts` | Content schema | Needs `shortDescription` field |
| `astro.config.mjs` | Astro config | OK |
| `tailwind.config.mjs` | Tailwind config | May need type scale updates |

### Components

| Path | Purpose | Status |
|------|---------|--------|
| `src/components/ProjectCard.astro` | Project card in grids | Needs image handling, shortDescription |
| `src/components/ProjectsGrid.tsx` | Projects page grid (React) | Needs filter UX, image display |
| `src/components/WorkTimeline.tsx` | Resume timeline (React) | Needs redesign, larger filters |
| `src/components/WorkPortfolio.tsx` | Resume portfolio section | Review for conflicts |
| `src/components/AnimatedStats.tsx` | Stats animation | OK |
| `src/components/FeedGrid.tsx` | Feed grid | OK |

### Content

- **43 project markdown files** in `src/content/projects/`
- **~30 screenshot images** in `public/images/` (many projects missing)
- **27 company logo SVGs** in `public/images/logos/` (accenture, equifax, mailchimp, pwc, booz-allen, am, cdc, pfizer, target, walmart, verizon, emory, fuqua, etc.)

### Current Theme Tokens (global.css)

```css
/* Dark mode (default) */
--bg: #0c0c0e; --surface: #131316; --border: #232328;
--ink: #e8e6e0; --muted: #6b6a72; --gold: #d4a853; --violet: #7c6fcd;

/* Light mode */
--bg: #f5f2eb; --muted: #6a6560; --gold: #8a6012;

/* Hacker mode */
--bg: #050a05; --ink: #00e533; --muted: #3a8a3b; --gold: #00ff41;
```

### Current Typography Issues

- Base font: `1rem` (16px) — too small, especially with DM Mono (condensed)
- Nav links: `0.8rem` (12.8px), Category tabs: `0.65rem` (10.4px) — FAIL readability
- Tag pills: `0.58rem` (9.3px), Status labels: `0.52rem` (8.3px) — FAIL
- Muted color `#6b6a72` on `#0c0c0e` = ~3.8:1 contrast — below WCAG AA 4.5:1
- Letter-spacing `0.1em` on small text reduces readability

### Content Schema (current)

```typescript
projects: {
  title: string, description: string, tags: string[], date?: date,
  url?: string, image?: string, images?: string[],
  featured: boolean (default false), listed: boolean (default true),
  order: number (default 99), status?: string
}
posts: {
  title: string, type: 'song'|'image'|'project'|'note',
  tags: string[], date: date, youtube?: string, embed?: string,
  image?: string, caption?: string, draft: boolean (default false)
}
```

---

## THE REDESIGN PLAN (V2) — WHAT TO DO

Follow `REDESIGN-PLAN-V2.md` exactly. Here's the summary:

### Wave 1: Explore ($0.15)
- **Agent A:** Image audit — scan all project .md files, compare to public/images/, report gaps
- **Agent B:** Screenshot recovery — search `/Volumes/dima/Documents/Screenshots/` and `/Users/dmitriyperkis/Documents/Screenshots/` for missing files

### Wave 2: Fix Foundation ($0.80)
- **Agent C:** Typography + Nav fix — base 18px, all UI ≥13.5px, fix muted colors, remove intro cell nav, add active nav state
- **Agent D:** Image display fix — object-fit per type, fallback gradients, lazy loading
- **Agent E:** Description fix — add shortDescription to schema, truncate cards at 80 chars

### Wave 3: Resume Redesign ($0.50)
- **Agent F:** ClientLogoWall component, WorkTimeline redesign, resume page restructure

### Wave 4: Logo Generation — CREATIVE ($1.50)
- **Agent G:** Generate 10 logo SVGs using a capable model. All inline SVG code.

### Wave 5: Layout Variants ($1.50)
- **Agent H:** Editorial layout at `/v2-editorial`
- **Agent I:** Dashboard layout at `/v3-dashboard`
- **Agent J:** Terminal layout at `/v4-terminal`

### Wave 6: QA + Deploy ($0.20)
- **Agent K:** Playwright screenshots + rubric check
- **Agent L:** Commit, build, deploy (ONLY if Dima approves)

---

## WHAT TO DO FIRST

1. **Read `REDESIGN-PLAN-V2.md`** for full specifications
2. **Start with Wave 1** — run the image audit and screenshot recovery
3. **Produce audit reports** before moving to Wave 2
4. **Wait for Dima's decisions** on DP1-DP5 (listed below) before Waves 4-5

### Immediate First Actions:
```bash
# 1. Verify the project builds
npm run build

# 2. List all project files and their image fields
# Use a script or grep to extract image: from src/content/projects/*.md

# 3. Compare against public/images/ to find gaps
ls public/images/ | sort

# 4. Search screenshot sources for missing files
ls /Volumes/dima/Documents/Screenshots/ 2>/dev/null
ls /Users/dmitriyperkis/Documents/Screenshots/ 2>/dev/null
```

---

## KEY DECISIONS REQUIRING DIMA'S INPUT

| ID | Decision | Options | Recommendation |
|----|----------|---------|----------------|
| DP1 | Layout direction | Editorial, Dashboard, Terminal, or all three | Build all three at /v2-*, /v3-*, /v4-* |
| DP2 | Logo selection | Pick 1 of 10 generated concepts | 1 (Triple D), 2 (Build Block), or 6 (Bracket Builder) |
| DP3 | Screenshot fallback | Gradient+badge vs AI illustrations | Gradient fallback + status badge |
| DP4 | Content trimming | Light, medium, aggressive | Medium — shortDescription + collapsible details |
| DP5 | Deploy strategy | Big deploy, incremental, or preview URLs | Preview URLs per wave, single production deploy |

**Do NOT proceed with Waves 4-5 without Dima's decisions on DP1-DP2.** Waves 1-3 can proceed independently.

---

## HARD RULES

1. **NO GIT PUSH** without explicit Dima approval. Local commits are fine.
2. **NO .env reads** — never read, print, or output API keys.
3. **NO Brain vault access** — do not read/list files under any `brain/` directory.
4. **PLAN BEFORE CODE** — for structural changes, write implementation notes first.
5. **VERCEL DEPLOYS AUTOMATICALLY** on push to main — do not push without sign-off.
6. **Use Haiku/Flash for mechanical tasks**, Sonnet only for logo generation (Wave 4).
7. **One-shot execution** — write complete specs upfront, agents deliver in one pass.

---

## COMMON MISTAKES TO AVOID

1. **Don't use Sonnet for everything** — the whole point of V2 is cost optimization. Use cheaper models for Waves 1, 2, 3, 5, 6.
2. **Don't iterate on CSS** — give agents the exact pixel values and color codes upfront. The specs in REDESIGN-PLAN-V2.md are precise.
3. **Don't generate logos with image APIs** — generate them as inline SVG code. This is cheaper, editable, and scales perfectly.
4. **Don't delete existing layouts** — new layouts go to `/v2-*`, `/v3-*`, `/v4-*` routes. Current bento stays as default.
5. **Don't assume image paths** — always verify files exist before referencing them in frontmatter.
6. **Don't break the content schema** — adding `shortDescription` is additive. Don't remove `description`.
7. **Don't change font families** — the site uses DM Mono. Don't swap to Inter or system fonts without Dima approval.
8. **Don't push during Wave 6** — Agent L should commit and build, but ONLY push if Dima explicitly approves.

---

## RELEVANT SCREENSHOT SOURCES

| Location | Format | Notes |
|----------|--------|-------|
| `/Volumes/dima/Documents/Screenshots/` | Subfolders | Organized by project |
| `/Users/dmitriyperkis/Documents/Screenshots/` | Flat files | SCR-* naming convention |

---

## EXISTING ASSETS TO REUSE

### Company Logos (27 SVGs in public/images/logos/)
accenture.svg, am.svg, apollo.svg, att.svg, bcbs-nc.svg, beechcraft.svg, booz-allen.svg, cdc.svg, emory.svg, equifax.svg, equifax2.svg, fuqua.svg, fuqua.png, lahzo.svg, laura-mercier.svg, mailchimp.svg, multiview.svg, new-york-life.svg, oldcastle.svg, pfizer.svg, pwc.svg, target.svg, verizon.svg, walmart.svg

### Project Screenshots (in public/images/)
atl-radar-home.png, ai-ideas-galaxy.png, concert-history-hero.png, concert-stats-hero.png, dive52-discord.png, fjord-booking.png, fjord-discord.png, fjord-imessage.png, kill-bill.jpg, kill-bill-network.jpeg, sisyphus.png, sisyphus-blueprint.png, spotify-hero.png, spotify-bar-chart.png, spotify-heatmap.png, and ~15 more

---

## FILES THAT WILL BE CREATED

| Wave | New Files |
|------|-----------|
| 1 | `AUDIT-IMAGES.md`, `AUDIT-RECOVERY.md` |
| 2 | None (modifications only) |
| 3 | `src/components/ClientLogoWall.tsx` |
| 4 | `public/images/logos/proposals/logo-{1-10}.svg` |
| 5 | `src/pages/v2-editorial.astro`, `src/pages/v3-dashboard.astro`, `src/pages/v4-terminal.astro`, `src/layouts/LayoutEditorial.astro`, `src/layouts/LayoutDashboard.astro`, `src/layouts/LayoutTerminal.astro` |
| 6 | `QA-REPORT.md`, `tests/` directory |

---

## QUICK REFERENCE: EXACT VALUES TO USE

### Typography (Wave 2, Agent C)
```css
/* New type scale */
html { font-size: 1.125rem; } /* 18px base, was 16px */
/* No UI text below 0.75rem (13.5px computed) */
/* letter-spacing on small text: 0.06em (was 0.1em) */
```

### Muted Colors (Wave 2, Agent C)
```css
/* Dark mode */
--muted: #8a8990; /* was #6b6a72 */
/* Light mode */
--muted: #5a5550; /* was #6a6560 */
/* Hacker mode — keep as-is (#3a8a3b already has good contrast) */
```

### shortDescription (Wave 2, Agent E)
- Max 80 characters
- Auto-truncate from `description` if not provided
- Display on cards, NOT on project detail page (that uses full `description`)

### Logo SVGs (Wave 4, Agent G)
- Must use CSS custom properties for colors: `var(--gold)`, `var(--ink)`, `var(--muted)`
- Must work at 32px, 48px, and 120px
- Save as individual `.svg` files in `public/images/logos/proposals/`

---

## NEXT STEP

Start with **Wave 1, Agent A** — run the image audit. Produce `AUDIT-IMAGES.md` with a clear gap report listing every project and its image status (has file, missing file, no image field).

Then proceed to **Wave 1, Agent B** — screenshot recovery using the gap report.

After Wave 1 completes, proceed sequentially through Waves 2-6, waiting for Dima's input on DP1-DP5 before Waves 4-5.
