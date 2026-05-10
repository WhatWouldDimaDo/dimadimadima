# REDesign Plan V2 — dimadimadima.com (Cost-Optimized)

**Date:** 2026-05-10
**Status:** Planning
**Owner:** Dima Perkis
**Stack:** Astro 4 + React 18 + Tailwind 3 + CSS custom properties
**Total Estimated Cost: ~$4.65** (down from $29-46 in V1)

---

## Cost Optimization Principles

1. **Model matched to task** — Use cheaper models for mechanical work, creative models only where design judgment matters
2. **One-shot execution** — Write complete specs upfront; agents deliver in one pass, no iteration
3. **Batch similar changes** — Group typography fixes together, image fixes together, not scattered across agents
4. **No redundant agents** — Don't run separate agents for things that belong together
5. **Use existing assets** — 27 logos already exist in `public/images/logos/`, many screenshots in `public/images/`
6. **Parallel where safe** — Independent waves run simultaneously to reduce wall time
7. **Spec-driven implementation** — Detailed specs before delegating so agents never need to ask questions

---

## Model Assignment by Phase

| Phase | Task Type | Model | Why |
|-------|-----------|-------|-----|
| 1 — Explore | File scanning, auditing | Haiku / Flash | Mechanical pattern matching |
| 2 — Fix Foundation | CSS, component fixes | Haiku / Flash | Well-defined specs, no creative judgment |
| 3 — Resume Redesign | React component building | Haiku / Flash | Component from clear spec |
| 4 — Logo Generation | SVG creation | **Sonnet / Creative** | Requires design intelligence |
| 5 — Layout Variants | Layout building from spec | Haiku / Flash | Mechanical layout work |
| 6 — QA + Deploy | Test running, git ops | Haiku / Flash | Just execution |

---

## Wave Structure

### Wave 1: Explore ($0.15 total)

**Agent A: Image Audit** (~$0.08)
- Scan all `.md` files in `src/content/projects/` for `image:` frontmatter fields
- Cross-reference against files in `public/images/`
- Produce a gap report: missing files, wrong paths, no image field
- Output: `AUDIT-IMAGES.md` with findings

**Agent B: Screenshot Recovery** (~$0.07)
- Search `/Volumes/dima/Documents/Screenshots/` (subfolders) for matching files
- Search `/Users/dmitriyperkis/Documents/Screenshots/` (SCR-* naming) for matches
- Copy found files to `public/images/` with descriptive filenames
- Output: `AUDIT-RECOVERY.md` listing recovered files

**Parallel:** Yes — Agent B can run after Agent A produces the gap list, or both run in parallel if gap list is pre-computed.

---

### Wave 2: Fix Foundation ($0.80 total)

**Agent C: Typography + Nav Fix** (~$0.30)
- Bump base font to `18px` (was 16px) in `global.css`
- Set hard minimums: no UI text below `0.75rem` (13.5px computed)
- Increase muted color brightness: `--muted: #8a8990` (dark), `#5a5550` (light)
- Reduce letter-spacing on small text from `0.1em` to `0.06em`
- Remove inline nav from intro cell in `index.astro` (keep name + bio + tags only)
- Add active state to top nav bar (highlight current page)
- Files: `src/styles/global.css`, `src/layouts/Layout.astro`, `src/pages/index.astro`

**Agent D: Image Display Fix** (~$0.25)
- Fix `object-fit` per project type: `contain` with dark bg for tall images, `cover` for wide
- Add fallback gradient cards with project initials for missing images
- Add `loading="eager"` for above-fold, `loading="lazy"` for below
- Add CSS blur-up placeholder using aspect-ratio containers
- Files: `src/components/ProjectCard.astro`, `src/components/ProjectsGrid.tsx`

**Agent E: Description Fix** (~$0.25)
- Add `shortDescription` field to project schema in `src/content/config.ts`
- Migrate existing descriptions (auto-truncate to 80 chars where needed)
- Update card components to display `shortDescription`
- Keep full `description` for project detail page header
- Files: `src/content/config.ts`, `src/components/ProjectCard.astro`, `src/pages/projects/[slug].astro`

**Parallel:** Yes — all three agents modify different files with no conflicts.

---

### Wave 3: Resume Redesign ($0.50)

**Agent F: Resume Overhaul** (~$0.50)
- **ClientLogoWall.tsx** — New React component
  - Responsive grid of all 27 logos from `public/images/logos/`
  - Hover tooltip shows company name
  - Grayscale by default, color on hover
  - Click to filter timeline to that company
- **WorkTimeline.tsx** — Redesign
  - Larger, readable tag filters (0.875rem minimum, was 0.55-0.6rem)
  - Visual count indicator with animation
  - Company logos visible without expanding
  - Improved expand/collapse UX
- **resume.astro** — Restructure sections
  - New order: Header → Stats → Logo Wall → Timeline → Education → Skills → Outside Work
  - Add downloadable PDF resume link
- Files: `src/components/ClientLogoWall.tsx` (new), `src/components/WorkTimeline.tsx`, `src/pages/resume.astro`

---

### Wave 4: Logo Generation — CREATIVE ($1.50)

**Agent G: Generate 10 Logo SVGs** (~$1.50)
- Uses a capable model (Sonnet or equivalent) — this is the ONLY creative phase
- Generate all 10 as **inline SVG code** (not image generation API calls)
- Each SVG must:
  - Work in dark mode (primary), light mode, and hacker mode
  - Be legible at 32px (favicon), 48px (mobile nav), 120px (footer)
  - Use existing site colors: gold `#d4a853`, ink `#e8e6e0`, muted `#8a8990`
  - Be standalone SVG files saved to `public/images/logos/proposals/`
- All 10 concepts from the redesign plan:
  1. Triple D Interlock — three overlapping Ds in triangular knot
  2. Build Block — 2x2 grid, 3 filled + 1 outlined
  3. Signal Wave — three bars increasing height with antenna tip
  4. Circuit D — D drawn as PCB trace with gold nodes
  5. Concentric Rings — three rings with gold center dot
  6. Bracket Builder — `<dima·dima·dima/>` in monospace
  7. Golden Ratio Spiral — phi curve with "dima" text
  8. Three Pillars — gold/violet/muted pillars on connected base
  9. Paw Print + Circuit — geometric paw print with circuit angles
  10. A·D·A Monogram — combined Atlanta + Dima letterform

---

### Wave 5: Layout Variants ($1.50 total)

**Agent H: Editorial Layout** (~$0.50)
- Route: `/v2-editorial`
- Full-width hero with large typography (DM Serif Display 6-8rem)
- Asymmetric grid: one large feature left, two stacked right
- Stats section with large numbers
- Files: `src/pages/v2-editorial.astro` (new), `src/layouts/LayoutEditorial.astro` (new)

**Agent I: Dashboard Layout** (~$0.50)
- Route: `/v3-dashboard`
- Three-panel layout with sidebar stats
- Searchable/filterable project table
- Live activity feed
- Files: `src/pages/v3-dashboard.astro` (new), `src/layouts/LayoutDashboard.astro` (new)

**Agent J: Terminal Layout** (~$0.50)
- Route: `/v4-terminal`
- Terminal aesthetic (current hacker theme becomes default)
- Command palette (Cmd+K) for search
- Project rows with hover previews
- Grocery mode intact
- Files: `src/pages/v4-terminal.astro` (new), `src/layouts/LayoutTerminal.astro` (new)

**Parallel:** Yes — all three build independent pages with separate layout files.

---

### Wave 6: QA + Deploy ($0.20)

**Agent K: Playwright Screenshots + Rubric Check** (~$0.12)
- Run Playwright test suite against all pages
- Capture screenshots for visual regression baseline
- Run QA rubric checks (typography, images, nav, resume, accessibility)
- Output: `QA-REPORT.md` with pass/fail for each criterion

**Agent L: Commit, Build, Deploy** (~$0.08)
- Git commit all changes with descriptive messages per wave
- Run `npm run build` — must exit 0
- Push to main (triggers Vercel deploy) — ONLY if Dima approves
- Output: Deploy URL

**Sequential:** Agent L runs after Agent K passes all checks.

---

## Cost Summary

| Wave | Agents | Est. Cost | Parallelism |
|------|--------|-----------|-------------|
| 1 — Explore | A, B | $0.15 | Parallel |
| 2 — Fix Foundation | C, D, E | $0.80 | Parallel |
| 3 — Resume | F | $0.50 | Sequential (depends on Wave 2) |
| 4 — Logos (Creative) | G | $1.50 | Sequential (independent) |
| 5 — Layout Variants | H, I, J | $1.50 | Parallel |
| 6 — QA + Deploy | K, L | $0.20 | Sequential |
| **Total** | **12 agents** | **~$4.65** | |

---

## QA Rubrics (Condensed)

### Typography & Readability
| # | Criterion | Pass | Fail |
|---|-----------|------|------|
| T1 | All UI text ≥ 13.5px computed | ✓ | Any < 13.5px |
| T2 | Body text ≥ 18px | ✓ | < 18px |
| T3 | Muted text contrast ≥ 4.5:1 | ✓ | < 4.5:1 |
| T4 | No text overflow on mobile | ✓ | Overflows viewport |

### Images & Screenshots
| # | Criterion | Pass | Fail |
|---|-----------|------|------|
| I1 | All cards have image or fallback | ✓ | Blank cards |
| I2 | Zero 404s in network log | ✓ | Any 404 |
| I3 | No distorted images | ✓ | Stretched/squished |

### Navigation
| # | Criterion | Pass | Fail |
|---|-----------|------|------|
| N1 | Top nav has exactly 4 links | ✓ | More or fewer |
| N2 | No duplicate nav on homepage | ✓ | Any duplicate |
| N3 | All links work correctly | ✓ | Any broken |

### Resume Page
| # | Criterion | Pass | Fail |
|---|-----------|------|------|
| R1 | Logo wall shows 27 logos | ✓ | Missing logos |
| R2 | Grayscale → color on hover | ✓ | No hover effect |
| R3 | Filtering works correctly | ✓ | Filter broken |

### Logo & Branding
| # | Criterion | Pass | Fail |
|---|-----------|------|------|
| L1 | SVG renders in nav | ✓ | Broken/fallback text |
| L2 | Legible at 32px | ✓ | Blurry |
| L3 | Works in all 3 themes | ✓ | Invisible in any theme |

### Performance
| # | Criterion | Pass | Fail |
|---|-----------|------|------|
| P1 | Lighthouse Performance ≥ 80 | ✓ | < 80 |
| P2 | FCP < 1.5s | ✓ | ≥ 1.5s |
| P3 | Build exits 0 | ✓ | Fails or warns |

---

## Remediation Strategy

### Severity Levels
| Level | Definition | Action |
|-------|-----------|--------|
| P0 | Build fails, broken nav | Stop all work, fix immediately |
| P1 | Feature broken, accessibility fail | Fix before next wave |
| P2 | Visual defect, minor UX | Document, fix in remediation |
| P3 | Polish, edge case | Log, fix later |

### Workflow
```
Issue Found → Severity Assigned → Fix Branch → Self-Review → Re-test → Merge
```

### Rollback
- Every wave creates a git commit with descriptive message
- `git revert` any commit that causes regressions
- Keep previous version accessible during transition
- Vercel preview URLs allow comparison before production deploy

---

## Playwright Test Suite

```
tests/
  homepage.spec.ts          — Layout, nav, bento grid
  projects.spec.ts          — Grid, filtering, cards, broken images
  project-detail.spec.ts    — Individual project pages
  resume.spec.ts            — Logo wall, timeline, filtering
  about.spec.ts             — About page
  navigation.spec.ts        — Links, routing, Konami code
  responsive.spec.ts        — Mobile/tablet/desktop breakpoints
  accessibility.spec.ts     — axe-core integration
  visual-regression.spec.ts — Screenshot comparison
```

### Key Tests
```typescript
// No duplicate nav
test('no duplicate nav to Projects', async ({ page }) => {
  await page.goto('/');
  const links = await page.getByRole('link', { name: /projects/i }).all();
  expect(links.length).toBeLessThanOrEqual(2);
});

// All cards have visuals
test('every card has image or fallback', async ({ page }) => {
  await page.goto('/projects');
  const cards = await page.locator('a.card-hover').all();
  for (const card of cards) {
    const hasImage = await card.locator('img').count() > 0;
    const hasFallback = await card.locator('div[style*="gradient"]').count() > 0;
    expect(hasImage || hasFallback).toBe(true);
  }
});

// No broken images
test('no 404 images', async ({ page }) => {
  const errors: string[] = [];
  page.on('response', resp => {
    if (resp.status() === 404 && resp.url().includes('/images/')) {
      errors.push(resp.url());
    }
  });
  await page.goto('/projects');
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
});

// Logo wall
test('client logo wall displays', async ({ page }) => {
  await page.goto('/resume');
  const logos = await page.locator('.logo-wall img').all();
  expect(logos.length).toBeGreaterThanOrEqual(20);
});
```

---

## Decision Points for Dima

### DP1: Layout Direction (Wave 5 entry gate)
Which layout(s) should be built? Options: Editorial, Dashboard, Terminal, or all three as route variants.

**Recommendation:** Build all three at `/v2-*`, `/v3-*`, `/v4-*` routes. Keep current bento as default. Dima picks the winner after previewing all.

### DP2: Logo Selection (Wave 4 output)
Which of the 10 generated logo concepts should be the primary mark?

**Recommendation:** Concepts 1 (Triple D Interlock), 2 (Build Block), and 6 (Bracket Builder) are strongest for technical audiences.

### DP3: Screenshot Strategy (Wave 1)
For projects without screenshots (APIs, CLI tools): gradient fallback + status badge, or generate AI illustrations?

**Recommendation:** Gradient fallback with project initials + status badge (lowest cost, cleanest result).

### DP4: Content Trimming (Wave 2)
How aggressive should description trimming be: light (keep most), medium (collapse sections), or aggressive (short only)?

**Recommendation:** Medium — add `shortDescription` for cards, collapse long body sections into `<details>`.

### DP5: Deploy Strategy
One big deploy, incremental with feature flags, or preview URLs then single production?

**Recommendation:** Preview URLs after each wave, single production deploy after Dima signs off.

---

## File Change Impact Map

| Wave | Files Modified | New Files | Risk |
|------|---------------|-----------|------|
| 1 | None | `AUDIT-IMAGES.md`, `AUDIT-RECOVERY.md` | None |
| 2 | `global.css`, `Layout.astro`, `index.astro`, `ProjectCard.astro`, `ProjectsGrid.tsx`, `config.ts`, `[slug].astro` | None | Medium |
| 3 | `WorkTimeline.tsx`, `resume.astro` | `ClientLogoWall.tsx` | Low |
| 4 | None | 10 SVG files in `public/images/logos/proposals/` | None |
| 5 | None | `v2-editorial.astro`, `v3-dashboard.astro`, `v4-terminal.astro`, 3 new layout files | Medium |
| 6 | None | `QA-REPORT.md`, `tests/` directory | Low |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Missing screenshots can't be sourced | Medium | Medium | Gradient fallbacks + badges |
| Font size increase breaks bento layout | Low | Medium | Test at all breakpoints |
| Logo SVGs don't match taste | Medium | Low | 10 options, Dima picks |
| Wave 2 changes introduce regressions | Medium | High | QA rubric gate before Wave 3 |
| Layout variants too complex | Low | Medium | Each is independent, safe to skip |

---

*End of Redesign Plan V2. Awaiting Dima's decisions on DP1-DP5 to proceed.*
