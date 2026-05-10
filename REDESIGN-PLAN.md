# REDesign Plan — dimadimadima.com

**Date:** 2026-05-10
**Status:** Planning
**Owner:** Dima Perkis
**Stack:** Astro 4 + React 18 + Tailwind 3 + CSS custom properties

---

## Part 1: Root Cause Analysis

### Issue 1: Font is too small

**Root Cause:** The site uses `DM Mono` (a condensed monospace) at a `1rem` (16px) base, but nearly every UI element scales far below that:

| Element | Current size | Computed px | WCAG AA minimum |
|---------|-------------|-------------|-----------------|
| Body text | `1rem` | 16px | OK |
| Nav links | `0.8rem` | 12.8px | marginal |
| Category tabs | `0.65rem` | 10.4px | FAIL |
| Tag pills | `0.58rem` | 9.3px | FAIL |
| Status labels | `0.52rem` | 8.3px | FAIL |
| CTA rows | `0.72rem` | 11.5px | FAIL |
| Resume timeline tags | `0.55rem` | 8.8px | FAIL |
| Project desc on cards | `0.7rem` | 11.2px | marginal |

**Problems:**
- DM Mono is 15-20% narrower than system fonts at the same px size, making text feel even smaller
- `letter-spacing: 0.1em` on small text further reduces readability
- `color: var(--muted)` (#6b6a72 on #0c0c0e) gives contrast ratio ~3.8:1 — below WCAG AA's 4.5:1 for body text
- Light mode is slightly better (#6a6560 on #f5f2eb ≈ 4.6:1) but hacker mode (#3a8a3b on #050a05 ≈ 5.2:1) is inconsistent

**Fix direction:**
- Bump base to `1.125rem` (18px)
- Set hard minimums: no UI text below `0.75rem` (13.5px computed)
- Increase muted color brightness: `--muted: #8a8990` (dark), `#5a5550` (light)
- Reduce letter-spacing on small text from `0.1em` to `0.06em`

---

### Issue 2: Screenshots don't load and display correctly

**Root Cause:** Multiple failure modes:

1. **Missing files:** Several projects reference images that don't exist in `public/images/`. Content files list `image: /images/something.png` but the file was never copied from the screenshot source volumes. Notable: Suno Factory has no screenshot despite being featured at order 6.

2. **Aspect ratio mismatch:** Cards use `aspect-ratio: 3/2` with `object-fit: cover; object-position: top`. Screenshots are often 16:9, 4:3, or irregular phone captures. The `top` positioning crops the most important content (usually centered) and keeps only the browser chrome.

3. **No fallback:** When `p.image` is falsy, the card renders a text-only fallback with no visual presence. No placeholder or generated gradient is used.

4. **Project detail page gallery:** The `[slug].astro` template supports `d.images` (plural) array, but only a handful of projects populate it. Most have a single `image` field, so the thumbnail strip never renders.

5. **No loading states:** Images load without blur-up placeholders or skeleton states. On slow connections, cards jump as images load.

**Fix direction:**
- Audit all 43 project files for missing images, collect from `/Volumes/dima/Documents/Screenshots/` and `/Users/dmitriyperkis/Documents/Screenshots/`
- Support multiple aspect ratios: `object-fit: contain` with dark background for tall images, `cover` for wide
- Add `loading="eager"` for above-fold images, `loading="lazy"` for below
- Add blur-up placeholder using Astro's built-in image optimization (upgrade to `@astrojs/image` or use CSS `aspect-ratio` containers with background gradients)
- Generate fallback gradient cards with project initials for projects without screenshots

---

### Issue 3: Project descriptions are too long

**Root Cause:** The `description` field in project frontmatter is an unrestricted string. Current descriptions range from 80 to 300+ characters. Examples:

- AI Ideas Explorer: 178 chars — "Agentic idea generation at scale. 35 Claude agents ran parallel..."
- Dive52: 44 chars — "ADHD knowledge retention · 512 articles"
- ATL Radar: 44 chars — "Personal event intelligence for Atlanta"

On the homepage bento, descriptions are capped by `max-width: 30rem` but still run 2-3 lines. On project cards, only the title shows (no description). On the `/projects` grid, descriptions don't appear at all. On individual project pages, the full description renders as a `<p>` below the title.

The markdown body content of project pages is the real issue — some run 500+ words with multiple sections, tables, and code blocks.

**Fix direction:**
- Add a `short_description` field (max 80 chars) for card/grid display
- Keep `description` for the project detail page header
- Trim markdown body to "case study" format: Problem → Approach → Result → Artifacts (max 300 words)
- Move deep-dive content to collapsible `<details>` sections or link to external docs
- Add "Read more →" truncation on project detail pages with expand/collapse

---

### Issue 4: Resume page lacks client icon wall and isn't filterable/visually pleasing

**Root Cause:** The resume page has:
- A WorkTimeline React component with tag-based filtering (functional but cramped)
- A highlight strip with 3 stats (15+ years, 7 companies, 30+ projects)
- Education cards
- Skills tag cloud
- Outside-work cards

What's missing:
- **No client logo wall.** There are 27 SVG logos in `public/images/logos/` (Accenture, Equifax, Mailchimp, PwC, Booz Allen, A&M, CDC, Pfizer, Target, Walmart, Verizon, etc.) but they're only shown one-at-a-time inside the timeline accordion. No visual "I've worked with these organizations" wall.
- **Filtering is unintuitive.** The tag cloud requires reading 30+ tiny buttons (0.6rem) arranged in two sections (Industries / Functions). No visual feedback on how many roles match beyond a small text count. No way to filter by date, industry, or function simultaneously with clear active state.
- **No visual hierarchy.** Everything is cards on cards. The timeline is a thin vertical line with dots. The education section uses the same card pattern as experience. Skills is just a tag cloud.
- **No scannable overview.** You can't see at a glance the progression, the industries covered, or the scope.

**Fix direction:**
- Add a client logo wall section with 27 logos in a responsive grid with company names on hover
- Redesign filtering: pill-based with visual chips, animated count, clear active states
- Add a visual "career arc" — timeline with company logos, dates, and industry color coding
- Make the tag cloud interactive with hover previews showing which roles match
- Add downloadable PDF resume option

---

### Issue 5: No logo for dimadimadima

**Root Cause:** The site currently uses a text logo in the nav bar: `dima<span style="color:var(--gold);font-style:italic;">·</span>dima<span style="color:var(--gold);font-style:italic;">·</span>dima`. There is no brand identity, no SVG logo, no favicon beyond defaults.

**Requirements for logo:**
- Must work in dark mode (primary), light mode, and hacker mode
- Must be legible at 32px (favicon), 48px (mobile nav), 120px (footer/about)
- Should reflect: builder energy, AI/AI-native, playful but professional, Atlanta roots
- Must work as a standalone mark (for OG images, social cards) and as a wordmark

**See Part 2 below for 10 proposals.**

---

### Issue 6: Missing layout/theme alternatives

**Root Cause:** The site has exactly one layout — the bento grid on homepage, card grid on projects, timeline on resume, three-panel on about. There are no A/B variants, no theme selector beyond dark/light/hacker color swap.

**Fix direction:** See Part 3 for 4 layout directions with pros/cons.

---

### Issue 7: Redundant navigation

**Root Cause:** Navigation to the same 4 pages appears in 3 places on the homepage alone:

1. **Top nav bar:** Feed · Projects · Resume · About (4 links)
2. **Intro cell in bento:** Projects · Resume · Feed · About (4 links, different order)
3. **CTA column in bento:** All projects → · The feed → · Resume → · About → (4 links with arrows)

That's 12 clicks to the same 4 destinations on the primary page. Additionally, the footer repeats dimadimadima.com and LinkedIn URL which are already accessible from the nav and about page.

**Fix direction:**
- Remove inline nav from intro cell (keep name + bio + tags only)
- Keep top nav bar as the primary navigation
- Repurpose CTA column into "latest" or "stats" or "featured project" cell
- Or convert CTA column to a single "View all projects →" with a visual element

---

### Issue 8: Missing screenshots from multiple projects

**Root Cause:** Out of 43 projects in `src/content/projects/`:

| Status | Count | Notes |
|--------|-------|-------|
| Has image in frontmatter + file exists | ~20 | Verified in `public/images/` |
| Has image in frontmatter but file missing | ~5 | Broken references |
| No image field at all | ~18 | Never assigned |

Projects confirmed needing screenshots (from CLAUDE.md notes and file audit):
- Suno Factory (featured, order 6, no image)
- Fjord Sauna Bot (featured, order 7, references fjord images that may exist)
- Kill Bill (unfeatured but notable, references images)
- 27 other unfeatured projects (need assessment)

**Fix direction:**
- Run full audit: check every project's `image` field against `public/images/`
- Source screenshots from `/Volumes/dima/Documents/Screenshots/` subfolders
- Source from `/Users/dmitriyperkis/Documents/Screenshots/` (SCR-* naming)
- Dima to drop new screenshots for projects that don't have any
- Generate placeholder images for projects that are conceptual/API-only

---

## Part 2: Logo Proposals (10)

Each proposal includes a concept description, visual direction, and rationale tied to Dima's personality and site objectives.

### Logo 1: "Triple D Interlock"

**Concept:** Three overlapping "D" characters forming a triangular knot, with the intersection point in gold.

**Visual:** Bold geometric Ds rotated at 0°, 120°, and 240°, overlapping at center. The overlapping region forms a small diamond shape. Primary color: gold (#d4a853). Secondary: ink (#e8e6e0) for the outer strokes.

**Rationale:** Represents the three "dima" repetitions in the domain. The interlock suggests connection of professional + personal + creative identities. The diamond intersection subtly nods to data. Works well at all sizes.

**Variants:** Stacked (D-triangle above "dimadimadima" wordmark), inline (D-triangle left of wordmark), standalone mark (favicon).

---

### Logo 2: "Build Block"

**Concept:** A 2x2 grid of rounded squares, where 3 are filled (forming an L) and the 4th is outlined — suggesting "always building, one block to go."

**Visual:** Four 16px squares with 4px border-radius in a 2x2 grid. Three filled in gold, one outlined in gold. The negative-space pattern reads as a pixel-art "play" button or directional arrow. Below: "dima·dima·dima" in DM Mono at 0.7em.

**Rationale:** Represents the compulsive builder identity. The incomplete grid signals "always in progress" — matching the ADHD multi-project energy. The pixel-art aesthetic nods to tech without being cliché.

**Variants:** With/without wordmark. Gold-on-dark (primary), dark-on-gold (light mode accent), green-on-black (hacker mode).

---

### Logo 3: "Signal Wave"

**Concept:** Three vertical bars of increasing height (like a signal strength indicator or bar chart) with a gold gradient sweep.

**Visual:** Three bars at heights 40%, 70%, 100%, each 8px wide with 4px gaps. Bars have a subtle gradient from muted to gold. The tallest bar has a small circle at its peak (like an antenna tip or data point). Wordmark to the right: "dima" in gold, "·dima·dima" in muted.

**Rationale:** Nods to data analytics (bar charts), signal/reach (strategy), and growth (increasing heights). The antenna tip suggests broadcasting ideas outward. Clean, scalable, professional.

---

### Logo 4: "Circuit D"

**Concept:** The letter "D" drawn as a circuit board trace with gold nodes at connection points.

**Visual:** A D shape where the vertical stem is a straight line and the curved portion is made of orthogonal segments (like PCB traces). Three gold dots mark connection points — one at top, one at the curve's apex, one at bottom. Thin stroke (1.5px). Wordmark below in monospace.

**Rationale:** Directly connects to AI systems, data pipelines, and technical depth. The circuit motif is recognizable but not overused in portfolio logos. Three nodes = three dima repetitions.

---

### Logo 5: "Concentric Rings"

**Concept:** Three concentric circles (like ripples or a target) with the center dot in gold.

**Visual:** Three rings at 24px, 16px, and 8px diameter. Outer ring: thin muted stroke. Middle ring: gold stroke. Inner circle: solid gold fill. The pattern suggests expanding influence, radiating projects outward from a core. Wordmark "dimadimadima" below in a condensed sans-serif.

**Rationale:** Represents the hub-and-spoke nature of Dima's work — Atlanta as the center, projects radiating outward. Also suggests the 29029 challenge (endurance, circles/laps). Minimal, elegant, works beautifully as a favicon.

---

### Logo 6: "Bracket Builder"

**Concept:** The domain name wrapped in angle brackets like a component tag: `<dima·dima·dima/>`

**Visual:** Monospace rendering of `<dima·dima·dima/>` where the brackets are gold and the text is ink. The dots between "dima" repetitions are gold. The closing bracket `/` has a subtle upward flick (like it's launching).

**Rationale:** Speaks directly to the developer/AI builder identity. The component syntax is instantly recognizable to technical audiences visiting the site. The upward flick on the closing bracket adds personality.

**Variants:** Full string for headers, just `<D/>` as a compact mark. Could animate on page load (brackets typing in).

---

### Logo 7: "Golden Ratio Spiral"

**Concept:** A simplified Fibonacci/golden spiral rendered as a single gold stroke, with "dima" integrated into the curve.

**Visual:** A golden spiral (phi curve) drawn as a continuous stroke starting from a small gold dot at the center and expanding outward. The stroke thickens slightly as it expands. The word "dima" follows the inner curve in small caps. Outside the spiral: "·dima·dima" in muted.

**Rationale:** Golden ratio = mathematics, strategy, beauty in patterns. Connects to the data/analytical side while being visually distinctive. The spiral shape is unique in the portfolio space.

---

### Logo 8: "Three Pillars"

**Concept:** Three vertical pillars of different heights representing the three life dimensions: Professional, Side Quests, Personal.

**Visual:** Three vertical bars (width: 12px, gaps: 8px) at heights 100%, 67%, 33%. Tallest is gold (professional), middle is violet (side quests), shortest is muted (personal). Below the bars, a thin horizontal gold line connects them. Wordmark "dimadimadima" beneath in DM Serif Display.

**Rationale:** Directly maps to the about page's three-section structure. The connected base shows these aren't separate lives — they're integrated. Color coding matches the site's existing gold/violet/muted palette.

---

### Logo 9: "Paw Print + Circuit"

**Concept:** A stylized paw print (nod to Atlanta, nature, the kids) rendered with circuit-board geometry.

**Visual:** Four small circles (toe pads) and one larger rounded shape (main pad), but all drawn with orthogonal lines and 45-degree angles instead of curves. Gold color. Clean, geometric, unexpected. Wordmark below: "dima·dima·dima" in lowercase monospace.

**Rationale:** Unexpected juxtaposition of personal (family, nature, Dean & Ruby, Paw Patrol) with technical (circuit geometry). Signals the "professional + personal blended" thesis directly. Memorable and conversation-starting.

---

### Logo 10: "A·D·A"

**Concept:** A geometric monogram combining "A" (Atlanta) and "D" (Dima) into a single mark.

**Visual:** An "A" shape where the left leg extends below the baseline to form a "D" curve. The crossbar of the A is a gold horizontal line. The overall shape reads as both letters simultaneously. Rendered in gold on dark. Wordmark "dimadimadima" below in small caps.

**Rationale:** Rooted in Atlanta, centered on Dima. The dual-reading monogram is sophisticated and distinctive. The gold crossbar connects to the site's accent color. Works at any size.

---

### Logo Generation Plan

After Dima reviews the 10 proposals and selects 2-3 favorites, launch sub-agent to generate images:

1. **Sub-agent task:** Generate 4 variations of each selected logo concept using image generation
2. **Specifications:** SVG-compatible vector style, dark background, gold accent, 1024x1024px
3. **Output:** PNG files to `public/images/logos/proposals/` for review
4. **Final selection:** Dima picks one, convert to SVG for production use

---

## Part 3: Layout/Theme Directions (4 Alternatives)

### Direction A: "Refined Bento" (Evolution of Current)

**Description:** Keep the bento grid as the homepage identity but fix the problems: larger fonts, proper image handling, remove redundant nav, add missing screenshots.

**Changes from current:**
- Increase font scale across the board (base 18px, minimum 13.5px for UI)
- Fix image aspect ratios with `object-fit: contain` fallbacks
- Remove nav links from intro cell and CTA column
- Add a "latest build" cell showing the most recent project
- Add image lazy-loading with blur-up placeholders

**Pros:**
- Preserves the site's distinctive identity
- Lowest risk, highest ROI
- Fixes all user complaints without redesigning
- Keeps the bento grid's visual impact

**Cons:**
- Bento grids are becoming common (Linear, Vercel, etc.)
- Doesn't fundamentally address information architecture issues
- Limited room for growth as project count increases

**Best for:** Dima wants to keep the current feel but polished and functional.

---

### Direction B: "Editorial Magazine" (Content-First)

**Description:** Transform the homepage into an editorial/magazine layout with strong typography, asymmetrical grids, and project stories as the hero content.

**Layout:**
- Full-width hero section with large typography: "Dima Perkis" in DM Serif Display at 6-8rem
- Below: editorial-style project features — one large feature left, two stacked right
- Scroll reveals "latest" section: project cards with descriptions visible (not just titles)
- Stats section: concert count, listening hours, projects shipped — large numbers with context
- "About" strip: short bio with personality

**Typography:**
- Headlines: DM Serif Display at 3-6rem
- Body: DM Mono at 1.125rem
- Labels: System sans-serif (Inter) at 0.875rem for readability
- Gold accent for stats and highlights

**Pros:**
- Highly distinctive — few portfolio sites use editorial layouts
- Scales well as project count grows (pagination, categories)
- Descriptions are visible, not hidden behind clicks
- Natural place for project screenshots at proper sizes
- Strong first impression for "this person thinks and writes"

**Cons:**
- Loses the bento grid's visual punch
- More vertical scrolling
- Requires more content writing (project summaries)

**Best for:** Dima wants the site to feel more like a publication than a dashboard.

---

### Direction C: "Interactive Terminal" (Hacker Mode as Default)

**Description:** Lean into the technical identity. Homepage feels like a well-designed terminal/dashboard with interactive elements.

**Layout:**
- Dark terminal aesthetic by default (current hacker theme becomes the default)
- Hero: ASCII-art-style D or a typing animation introducing Dima
- Project list as a searchable/filterable table (not cards) with status, date, tags, and preview
- Right sidebar: live stats (projects shipped, concerts, songs, commits)
- Bottom panel: "latest activity" feed — recent projects, posts, updates
- Konami code grocery mode stays but is more prominent

**Interactions:**
- Command palette (Cmd+K) to search projects, navigate pages
- Filter by typing tags (like GitHub's search)
- Hover on project rows shows screenshot preview
- Terminal-style typing animations on load

**Pros:**
- Extremely distinctive — matches Dima's technical identity
- Natural fit for the "30+ projects" scale
- Excellent for technical visitors
- Built-in search and filtering
- Fun personality (grocery mode fits this aesthetic)

**Cons:**
- May feel too technical for non-technical visitors (HR, family friends)
- Less visually warm
- Higher implementation complexity
- Might alienate the "anyone googling Dima Perkis" audience

**Best for:** Dima wants to double down on the technical/builder identity and doesn't mind if it's polarizing.

---

### Direction D: "Split Persona" (Professional Left / Personal Right)

**Description:** A two-column layout that visually separates professional identity from side projects and personal life, with the ability to slide between them.

**Layout:**
- Desktop: Two columns with a draggable divider
  - Left (Professional): Resume highlights, work timeline, client logo wall, stats
  - Right (Personal/Side Quests): Project bento, feed highlights, music, family art
- Mobile: Tabs at top to switch between "Work" and "Build" views
- Center overlap zone: things that bridge both (AI Ideas Explorer, ATL Radar)
- Hovering over the divider reveals the site thesis: "This guy builds cool stuff, knows AI, has a sense of humor, and does a lot of it"

**Interactions:**
- Draggable divider to adjust the balance
- "Show all" button that merges both views
- Animated transition when switching between views on mobile
- Color coding: gold for professional, violet for personal, muted for overlap

**Pros:**
- Directly addresses the audience duality (professional visitors vs. curious individuals)
- Cleanly organizes 30+ projects without overwhelming
- Client logo wall has a natural home (professional side)
- Novel interaction (draggable divider) is memorable
- Scales well

**Cons:**
- Complex implementation (two full layouts in one page)
- Might feel fragmented rather than integrated
- Draggable divider is a gimmick if not done well
- More design work required

**Best for:** Dima wants to clearly serve both audiences while keeping the site integrated.

---

## Part 4: 6-Phase Implementation Plan

### Phase 1: Foundation & Audit (Days 1-3)

**Objective:** Fix typography, gather missing assets, establish design tokens.

**Tasks:**
1. [ ] **Typography audit** — Define new type scale with minimums
   - Base: 18px (was 16px)
   - Small: 14px minimum for UI text (was 9-11px)
   - Update all inline styles and CSS classes
   - Fix muted color contrast

2. [ ] **Screenshot audit** — Check all 43 projects for image status
   - Script: compare frontmatter `image` fields against `public/images/`
   - Flag: missing files, wrong paths, no image field
   - Generate missing images report

3. [ ] **Screenshot collection** — Gather from known sources
   - `/Volumes/dima/Documents/Screenshots/` subfolders
   - `/Users/dmitriyperkis/Documents/Screenshots/` flat files
   - Copy to `public/images/` with descriptive filenames

4. [ ] **Design token update** — Update `global.css` with new tokens
   - New type scale CSS custom properties
   - Updated color values for accessibility
   - Image aspect ratio tokens

**Agent:** Main agent (Cat) — heavy file operations, auditing
**Estimated cost:** $2-4 (Claude Sonnet, ~30 min of work)
**Deliverable:** Updated global.css, screenshot inventory report, all images in place

---

### Phase 2: Component Fixes (Days 4-7)

**Objective:** Fix cards, images, navigation redundancy.

**Tasks:**
1. [ ] **ProjectCard.astro** — Fix image handling
   - Support multiple aspect ratios (auto-detect from image dimensions)
   - Add fallback gradient with project initials for missing images
   - Add `short_description` support (truncated from full description)
   - Add blur-up loading state

2. [ ] **ProjectsGrid.tsx** — Fix grid and filtering
   - Update card sizes for new typography
   - Fix image display with proper aspect ratios
   - Add skeleton loading states
   - Improve filter UX (larger buttons, visual count)

3. [ ] **Layout.astro** — Remove nav redundancy
   - Remove nav links from intro cell (keep name + bio + tags)
   - Repurpose CTA column on homepage
   - Keep top nav bar as sole navigation

4. [ ] **index.astro** — Update bento grid
   - New CTA cell content (latest build, or stat, or music)
   - Fix all font sizes
   - Fix image handling

5. [ ] **[slug].astro** — Fix project detail page
   - Support `short_description` + expandable full description
   - Fix image gallery (support missing images gracefully)
   - Add blur-up placeholders
   - Trim prose max-width and add collapsible sections

**Agent:** Main agent (Cat) — component work, CSS, React
**Estimated cost:** $6-10 (Claude Sonnet, ~90 min of work)
**Deliverable:** Fixed components, no nav redundancy, proper image handling

---

### Phase 3: Resume Redesign (Days 8-10)

**Objective:** Client icon wall, better filtering, visual career overview.

**Tasks:**
1. [ ] **ClientLogoWall.tsx** — New React component
   - Responsive grid of all 27 logos from `public/images/logos/`
   - Hover tooltip shows company name and relationship
   - Click to filter timeline to that company
   - Grayscale by default, color on hover

2. [ ] **WorkTimeline.tsx** — Redesign
   - Larger, more readable tag filters (0.875rem minimum)
   - Visual count indicator with animation
   - Company logos always visible (not just on expand)
   - Add career arc visualization (horizontal timeline with milestones)
   - Improve expand/collapse UX

3. [ ] **resume.astro** — Restructure
   - Add client logo wall section (between highlight strip and timeline)
   - Add downloadable PDF resume link
   - Reorder sections for better flow: Header → Stats → Logo Wall → Timeline → Education → Skills → Outside Work

**Agent:** Main agent (Cat) — React component, styling
**Estimated cost:** $4-6 (Claude Sonnet, ~60 min of work)
**Deliverable:** Redesigned resume page with client icon wall, better filtering

---

### Phase 4: Logo & Brand Identity (Days 11-13)

**Objective:** Create and select logo, update site branding.

**Tasks:**
1. [ ] **Present 10 logo proposals** (see Part 2) to Dima for review
2. [ ] **Dima selects 2-3 favorites**
3. [ ] **Launch sub-agent** to generate visual variations of selected concepts
   - 4 variations per selected concept
   - Dark background, gold accent, 1024x1024px
   - Output to `public/images/logos/proposals/`
4. [ ] **Dima final selection**
5. [ ] **Convert to SVG** for production use
6. [ ] **Update site** — Replace text logo with SVG in nav, footer, OG image
7. [ ] **Generate favicon** from logo mark
8. [ ] **Update OG image** with new logo

**Agent:** Main agent for planning + sub-agent for image generation
**Estimated cost:** $3-5 (sub-agent image gen, ~20 min)
**Deliverable:** Production-ready SVG logo, favicon, OG image, updated site

---

### Phase 5: Layout Variant (Days 14-18)

**Objective:** Implement one alternative layout direction (based on Dima's choice from Part 3).

**Tasks:**
1. [ ] **Present 4 layout directions** (see Part 3) to Dima
2. [ ] **Dima selects direction** (or combination)
3. [ ] **Create new page layout** — Separate Astro layout file
   - `src/layouts/LayoutEditorial.astro` or `LayoutTerminal.astro` or `LayoutSplit.astro`
   - New homepage: `src/pages/index-v2.astro` (accessible at `/index-v2` for preview)
   - Keep existing layout intact for comparison
4. [ ] **Implement new components** as needed
5. [ ] **A/B comparison** — Both layouts accessible, Dima can toggle

**Agent:** Main agent (Cat) for code + optional sub-agent for visual mockups
**Estimated cost:** $8-15 (Claude Sonnet, ~2-3 hours depending on direction)
**Deliverable:** Alternative homepage layout accessible at `/index-v2`

---

### Phase 6: QA, Testing & Polish (Days 19-21)

**Objective:** Ensure everything works, passes accessibility, and looks great.

**Tasks:**
1. [ ] **Playwright visual regression tests** (see Part 8)
2. [ ] **Accessibility audit** — Lighthouse, axe-core, manual keyboard nav
3. [ ] **Cross-browser testing** — Chrome, Safari, Firefox, mobile
4. [ ] **Performance audit** — Lighthouse scores, image optimization
5. [ ] **Content review** — Check all descriptions, project pages, resume accuracy
6. [ ] **SEO audit** — Meta tags, OG images, sitemap, structured data
7. [ ] **Dima review session** — Walk through everything, collect feedback
8. [ ] **Bug fixes** — Address any issues found

**Agent:** Main agent (Cat) for test writing + QA sub-agent
**Estimated cost:** $4-8 (Claude Sonnet, ~60-90 min)
**Deliverable:** QA report, passing tests, polished site ready for deploy

---

## Part 5: Sub-Agent Orchestration & Cost Estimates

### Agent Architecture

```
┌─────────────────────────────────────────────────┐
│                    MAIN AGENT (Cat)              │
│  Claude Sonnet — orchestration, code, QA         │
│  Cost: ~$15-25 total                             │
├──────────┬──────────┬──────────┬────────────────┤
│ Sub-A 1  │ Sub-A 2  │ Sub-A 3  │ Sub-A 4        │
│ Screenshot│ Logo     │ QA       │ Playwright     │
│ Audit    │ Gen      │ Audit    │ Visual Test    │
│ Sonnet   │ Haiku/   │ Sonnet   │ Node.js        │
│ $2-4     │ Sonnet   │ $4-8     │ $2-4           │
│          │ $3-5     │          │                │
└──────────┴──────────┴──────────┴────────────────┘
```

### Agent Specifications

#### Main Agent (Cat) — Claude Sonnet
- **Role:** Orchestration, component development, CSS, Astro pages
- **Phases:** 1, 2, 3, 5, 6
- **Estimated tokens:** ~500K input, ~200K output
- **Estimated cost:** $15-25

#### Sub-Agent 1: Screenshot Audit — Claude Sonnet
- **Role:** Scan all 43 project files, cross-reference with `public/images/`, generate gap report
- **Trigger:** Phase 1, after main agent sets up
- **Estimated cost:** $2-4

#### Sub-Agent 2: Logo Image Generation — Claude Haiku or dedicated image gen agent
- **Role:** Generate visual variations of Dima's selected logo concepts
- **Trigger:** Phase 4, after Dima selects 2-3 concepts
- **Output:** 8-12 PNG files at 1024x1024px
- **Estimated cost:** $3-5

#### Sub-Agent 3: QA Audit — Claude Sonnet
- **Role:** Accessibility audit, Lighthouse analysis, cross-browser checks
- **Trigger:** Phase 6, after all code changes
- **Output:** QA report with pass/fail for each criterion
- **Estimated cost:** $4-8

#### Sub-Agent 4: Playwright Visual Testing — Node.js script (not LLM)
- **Role:** Automated screenshot comparison, navigation tests, responsive checks
- **Trigger:** Phase 6
- **Output:** Test report with visual diffs
- **Estimated cost:** $2-4 (compute only, no LLM cost)

### Total Estimated Cost: $29-46

This assumes Claude Sonnet at $3/$15 per M tokens and Haiku at $0.25/$1.25 per M tokens.

### Cost Optimization Strategies

1. **Batch file reads** — Read all project files in one shot, not individually
2. **Use Haiku for audit tasks** — Screenshot audit doesn't need Sonnet reasoning
3. **Cache Playwright screenshots** — Only re-run on changed pages
4. **Sequential, not parallel** — Run sub-agents in order (each builds on previous) to avoid redundant context
5. **Limit image generation** — Only generate for Dima's top 2-3 choices, not all 10

---

## Part 6: QA Rubrics with Pass/Fail Criteria

### Typography & Readability

| # | Criterion | Pass | Fail | Method |
|---|-----------|------|------|--------|
| T1 | All UI text ≥ 13.5px computed | All elements ≥ 13.5px | Any element < 13.5px | DevTools inspection |
| T2 | Body text ≥ 18px computed | Body = 18px or larger | Body < 18px | DevTools inspection |
| T3 | Muted text contrast ≥ 4.5:1 (WCAG AA) | All muted text ≥ 4.5:1 | Any muted text < 4.5:1 | axe-core audit |
| T4 | No text overflow or truncation on mobile | All text fits viewport | Text overflows or breaks | Playwright mobile viewport |
| T5 | Font loading doesn't cause layout shift | CLS < 0.01 | CLS ≥ 0.01 | Lighthouse |

### Images & Screenshots

| # | Criterion | Pass | Fail | Method |
|---|-----------|------|------|--------|
| I1 | All project cards display an image or meaningful fallback | Every card has visual content | Any blank/missing card | Playwright screenshot |
| I2 | No broken image links (404s) | Zero 404s in network log | Any 404 | Playwright network interception |
| I3 | Images load within 2s on 3G simulation | All images loaded in 2s | Any image > 2s | Lighthouse throttling |
| I4 | Aspect ratios are preserved (no distortion) | All images display correctly | Any stretched/squished image | Visual inspection |
| I5 | Lazy-loaded images don't cause layout shift | CLS < 0.05 for below-fold | CLS ≥ 0.05 | Lighthouse |
| I6 | Project detail gallery works (if multiple images) | Thumbnails switch main image | Thumbnails broken or missing | Manual test |

### Navigation & Information Architecture

| # | Criterion | Pass | Fail | Method |
|---|-----------|------|------|--------|
| N1 | Top nav has exactly 4 links (Feed, Projects, Resume, About) | 4 links, no duplicates | More or fewer than 4 | Playwright count |
| N2 | No duplicate navigation to same pages on homepage | 0 duplicate nav sections | Any duplicate section | Playwright + manual |
| N3 | All nav links work and go to correct pages | 100% link accuracy | Any broken link | Playwright click test |
| N4 | Mobile hamburger menu (if implemented) works | Menu opens/closes correctly | Menu broken or missing | Playwright mobile |
| N5 | Konami code still triggers grocery mode | Grocery overlay appears | No response to Konami | Manual test |

### Resume Page

| # | Criterion | Pass | Fail | Method |
|---|-----------|------|------|--------|
| R1 | Client logo wall displays all 27 logos | 27 logos visible (responsive grid) | Missing logos | Playwright count |
| R2 | Logos are grayscale → color on hover | Hover changes color | No hover effect | Playwright hover test |
| R3 | Timeline filtering works (industry/function tags) | Filter reduces roles correctly | Filter broken or no effect | Playwright interaction |
| R4 | Filter count updates dynamically | Count matches filtered roles | Count is wrong or static | Playwright assertion |
| R5 | Education section displays correctly | Both degrees visible with logos | Missing or broken | Visual inspection |
| R6 | Skills section is readable and organized | Skills visible and scannable | Skills cramped or hidden | Visual inspection |

### Logo & Branding

| # | Criterion | Pass | Fail | Method |
|---|-----------|------|------|--------|
| L1 | SVG logo renders in nav bar | SVG visible and correct | Broken image or fallback text | Playwright |
| L2 | Logo is legible at 32px (favicon size) | Mark is recognizable | Mark is blurry or indistinct | Manual inspection |
| L3 | Logo works in all 3 themes (dark, light, hacker) | Visible in all themes | Invisible in any theme | Theme toggle test |
| L4 | OG image includes new logo | OG image renders with logo | OG image unchanged | OG preview tool |
| L5 | Favicon displays correctly | Favicon visible in browser tab | Default or missing favicon | Browser inspection |

### Performance

| # | Criterion | Pass | Fail | Method |
|---|-----------|------|------|--------|
| P1 | Lighthouse Performance score ≥ 80 | Score ≥ 80 | Score < 80 | Lighthouse CI |
| P2 | First Contentful Paint < 1.5s | FCP < 1.5s | FCP ≥ 1.5s | Lighthouse |
| P3 | Time to Interactive < 3s | TTI < 3s | TTI ≥ 3s | Lighthouse |
| P4 | Total page weight < 2MB | Weight < 2MB | Weight ≥ 2MB | Lighthouse |
| P5 | Build completes without errors | `npm run build` exits 0 | Build fails or warns | CI build |

### Accessibility

| # | Criterion | Pass | Fail | Method |
|---|-----------|------|------|--------|
| A1 | All images have alt text | 100% of images have alt | Any image missing alt | axe-core |
| A2 | All interactive elements keyboard-accessible | Tab order is logical | Any element unreachable | Manual keyboard nav |
| A3 | Color contrast meets WCAG AA | All text ≥ 4.5:1 (body), ≥ 3:1 (large) | Any text below threshold | axe-core |
| A4 | No ARIA violations | Zero ARIA errors | Any ARIA error | axe-core |
| A5 | Screen reader can navigate site | Major sections announced | Critical info hidden | Manual NVDA/VoiceOver |

---

## Part 7: Remediation Strategy

### Severity Levels

| Level | Definition | SLA | Example |
|-------|-----------|-----|---------|
| P0 — Blocker | Site doesn't load, build fails, broken navigation | Fix before any review | Build error, nav links broken |
| P1 — Critical | Feature doesn't work as designed, accessibility violation | Fix within 24 hours | Missing screenshots on featured projects, contrast failure |
| P2 — Major | Visual defect, minor UX issue, performance regression | Fix within 48 hours | Font slightly wrong on one page, image cropped oddly |
| P3 — Minor | Polish, edge case, nice-to-have | Fix in next sprint | Hover animation timing, minor spacing |

### Remediation Workflow

```
Issue Found → Severity Assigned → Ticket Created → Fix Branch → PR → QA Re-test → Merge
```

1. **Discover:** QA audit (automated or manual) identifies issue
2. **Triage:** Main agent assigns severity (P0-P3)
3. **Fix:** Create fix branch from `main`, implement fix
4. **Review:** Agent self-reviews changes against QA rubric
5. **Test:** Re-run relevant QA checks on fix branch
6. **Merge:** If all checks pass, merge to `main` (no push without Dima sign-off)
7. **Verify:** Post-deploy check on Vercel preview URL

### Rollback Plan

- Every phase creates a git commit with descriptive message
- If a phase introduces regressions, `git revert` the commit
- Keep the previous version accessible at `/index-old` during Phase 5 transition
- Vercel preview URLs allow comparison before any production deployment

### Escalation

- P0 issues: Stop all work, fix immediately, notify Dima
- P1 issues: Fix before moving to next phase
- P2/P3 issues: Document in issue log, fix in remediation sprint

---

## Part 8: UX Testing Plan with Playwright

### Test Suite Structure

```
tests/
  homepage.spec.ts        — Homepage layout, nav, bento grid
  projects.spec.ts        — Projects grid, filtering, cards
  project-detail.spec.ts  — Individual project pages, galleries
  resume.spec.ts          — Resume page, timeline, logo wall
  about.spec.ts           — About page layout
  navigation.spec.ts      — All nav links, routing, Konami
  responsive.spec.ts      — Mobile, tablet, desktop breakpoints
  accessibility.spec.ts   — axe-core integration
  performance.spec.ts     — Lighthouse integration
  visual-regression.spec.ts — Screenshot comparison
```

### Test Categories

#### 1. Homepage Tests (`homepage.spec.ts`)

```typescript
// Verify bento grid renders with all expected cells
test('homepage bento grid has all cells', async ({ page }) => {
  await page.goto('/');
  const cells = await page.locator('.bc').all();
  expect(cells.length).toBeGreaterThanOrEqual(10);
});

// Verify nav redundancy is removed
test('homepage has no duplicate nav to Projects', async ({ page }) => {
  await page.goto('/');
  const projectLinks = await page.getByRole('link', { name: /projects/i }).all();
  expect(projectLinks.length).toBeLessThanOrEqual(2); // nav + one CTA max
});

// Verify hero image loads
test('hero project image is visible', async ({ page }) => {
  await page.goto('/');
  const heroImg = page.locator('.bc-hero img');
  await expect(heroImg).toBeVisible();
});
```

#### 2. Projects Grid Tests (`projects.spec.ts`)

```typescript
// Verify all cards display images or fallbacks
test('every project card has visual content', async ({ page }) => {
  await page.goto('/projects');
  const cards = await page.locator('a.card-hover').all();
  for (const card of cards) {
    const hasImage = await card.locator('img').count() > 0;
    const hasFallback = await card.locator('div[style*="gradient"]').count() > 0;
    expect(hasImage || hasFallback).toBe(true);
  }
});

// Verify filtering works
test('category filter reduces project count', async ({ page }) => {
  await page.goto('/projects');
  const allCount = await page.locator('a.card-hover').count();
  await page.getByRole('button', { name: /AI/ }).click();
  const filteredCount = await page.locator('a.card-hover').count();
  expect(filteredCount).toBeLessThan(allCount);
});

// Verify no broken images
test('no 404 images on projects page', async ({ page }) => {
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
```

#### 3. Resume Tests (`resume.spec.ts`)

```typescript
// Verify client logo wall
test('client logo wall displays logos', async ({ page }) => {
  await page.goto('/resume');
  const logos = await page.locator('.logo-wall img').all();
  expect(logos.length).toBeGreaterThanOrEqual(20); // At least 20 of 27
});

// Verify filtering
test('industry filter works on timeline', async ({ page }) => {
  await page.goto('/resume');
  const initialRoles = await page.locator('.timeline-role').count();
  await page.getByRole('button', { name: /AI/ }).click();
  const filteredRoles = await page.locator('.timeline-role').count();
  expect(filteredRoles).toBeLessThan(initialRoles);
});
```

#### 4. Responsive Tests (`responsive.spec.ts`)

```typescript
const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const vp of VIEWPORTS) {
  test(`homepage renders at ${vp.name} (${vp.width}px)`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
    // No horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(vp.width);
  });
}
```

#### 5. Visual Regression Tests (`visual-regression.spec.ts`)

```typescript
test('homepage matches baseline (desktop)', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage-desktop.png', {
    fullPage: true,
    threshold: 0.1, // 10% pixel difference tolerance
  });
});

test('projects page matches baseline (desktop)', async ({ page }) => {
  await page.goto('/projects');
  await expect(page).toHaveScreenshot('projects-desktop.png', {
    fullPage: true,
    threshold: 0.1,
  });
});

test('resume page matches baseline (desktop)', async ({ page }) => {
  await page.goto('/resume');
  await expect(page).toHaveScreenshot('resume-desktop.png', {
    fullPage: false, // Above-fold only
    threshold: 0.1,
  });
});
```

#### 6. Accessibility Tests (`accessibility.spec.ts`)

```typescript
import { injectAxe, checkA11y } from 'axe-playwright';

test('homepage has no critical accessibility violations', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  const violations = await checkA11y(page, null, {
    detailedReport: true,
    verbose: false,
  });
  // Fail only on critical/serious violations
  expect(violations.filter(v => v.impact === 'critical' || v.impact === 'serious')).toEqual([]);
});
```

### Test Execution Plan

1. **Baseline capture:** After Phase 2 fixes, capture baseline screenshots for all pages
2. **Per-phase testing:** Run relevant test suite after each phase completes
3. **Visual diff review:** Any visual regression > 10% threshold flagged for Dima review
4. **Pre-deploy gate:** All tests must pass before `npm run build` and deploy

### Automated CI Integration

```yaml
# .github/workflows/qa.yml (optional, if repo has GitHub Actions)
name: QA
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install
      - run: npm run build
      - run: npx playwright install
      - run: npx playwright test
```

---

## Part 9: Decision Points for Dima

### DP1: Layout Direction (Phase 5 entry gate)

**Question:** Which layout direction do you want for the homepage?

| Option | Effort | Risk | Distinctiveness |
|--------|--------|------|-----------------|
| A — Refined Bento | Low | Low | Medium |
| B — Editorial Magazine | Medium | Medium | High |
| C — Interactive Terminal | High | Medium-High | Very High |
| D — Split Persona | High | High | Very High |

**Recommendation:** Start with Direction A (Refined Bento) to fix all user complaints quickly, then explore Direction B or D as a `/v2` variant.

---

### DP2: Logo Selection (Phase 4)

**Question:** Which 2-3 logo concepts from Part 2 resonate most?

**Considerations:**
- Which one would you be comfortable putting on a business card?
- Which one best represents "builds cool stuff, knows AI, has humor"?
- Which one works as a 16x16 favicon?

**Recommendation:** Concepts 1 (Triple D Interlock), 2 (Build Block), and 6 (Bracket Builder) are strongest for technical audience. Concept 5 (Concentric Rings) is strongest for broad audience.

---

### DP3: Screenshot Strategy (Phase 1)

**Question:** For projects that don't have screenshots and can't be screenshotted (APIs, CLI tools, concepts), should we:

- **A.** Use generated gradient cards with project initials (current fallback, improved)
- **B.** Use icon-based cards (tool stack icons in a grid)
- **C.** Generate AI illustrations for each project
- **D.** Mark as "concept" / "CLI" with appropriate badge

**Recommendation:** Option A + D combined. Gradient fallback + status badge for non-visual projects.

---

### DP4: Content Trimming (Phase 2)

**Question:** Project descriptions and markdown bodies — how aggressive should trimming be?

- **A.** Light trim — keep most content, just add `short_description` for cards
- **B.** Medium trim — add `short_description`, collapse body sections into `<details>`
- **C.** Aggressive trim — short descriptions only, full content behind "Read case study →" link

**Recommendation:** Option B. Keep the content available but don't overwhelm on first view.

---

### DP5: Resume Page Scope (Phase 3)

**Question:** Should the resume page include:

- [ ] Client logo wall (27 logos)
- [ ] Downloadable PDF resume
- [ ] Career arc visualization
- [ ] Skills proficiency visualization (not just a list)
- [ ] Testimonial/quote section from past colleagues
- [ ] Link to LinkedIn for full details

**Recommendation:** Logo wall + downloadable PDF + career arc are highest value. Skills proficiency is nice but subjective. Testimonials require external input.

---

### DP6: Deploy Strategy (Phase 6)

**Question:** How should we deploy changes?

- **A.** One big deploy after all 6 phases complete
- **B.** Incremental deploys after each phase (with feature flags)
- **C.** Deploy to preview URL after each phase, single production deploy at end

**Recommendation:** Option C. Preview URLs let Dima review each phase independently. Production deploy only after Dima signs off on the complete package.

---

## Appendix: File Change Impact Map

| Phase | Files Modified | New Files | Risk |
|-------|---------------|-----------|------|
| 1 | `global.css`, `tailwind.config.mjs` | Screenshot inventory report | Low |
| 2 | `ProjectCard.astro`, `ProjectsGrid.tsx`, `Layout.astro`, `index.astro`, `[slug].astro` | None | Medium |
| 3 | `WorkTimeline.tsx`, `resume.astro` | `ClientLogoWall.tsx` | Low |
| 4 | `Layout.astro` (nav logo), OG image, favicon | Logo SVGs, proposal images | Low |
| 5 | New layout file, new homepage variant | New components as needed | Medium-High |
| 6 | Test files, potential minor fixes | `tests/` directory | Low |

---

## Appendix: Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Missing screenshots can't be sourced | Medium | Medium | Use gradient fallbacks + badges |
| Layout direction D (Split Persona) is too complex | Medium | High | Scope to simpler two-column without draggable divider |
| Font size increase breaks bento grid layout | Low | Medium | Test at all breakpoints, adjust grid cell sizes |
| Logo generation doesn't match Dima's taste | Medium | Low | Present 10 text proposals first, only generate after selection |
| Playwright tests flaky on CI | Low | Medium | Use stable selectors, avoid timing-dependent assertions |
| Phase 2 component changes introduce regressions | Medium | High | QA rubric gate before Phase 3 |
| Content trimming loses important context | Low | Medium | Dima reviews all trimmed content before merge |

---

## Appendix: Timeline Summary

| Phase | Duration | Cost | Dependencies |
|-------|----------|------|-------------|
| 1 — Foundation & Audit | 1-3 days | $2-4 | None |
| 2 — Component Fixes | 4-7 days | $6-10 | Phase 1 complete |
| 3 — Resume Redesign | 8-10 days | $4-6 | Phase 2 complete |
| 4 — Logo & Brand | 11-13 days | $3-5 | Can run parallel to Phase 2-3 |
| 5 — Layout Variant | 14-18 days | $8-15 | Dima decision on direction (DP1) |
| 6 — QA & Polish | 19-21 days | $4-8 | All phases complete |
| **Total** | **21 days** | **$29-46** | |

---

*End of Redesign Plan. Awaiting Dima's decisions on DP1-DP6 to proceed.*
