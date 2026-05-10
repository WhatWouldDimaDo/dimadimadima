# dimadimadima.com — Agent Context

**Owner:** Dima Perkis | **Site:** dimadimadima.com | **Stack:** Astro 4.16 + React islands + Tailwind + CSS custom properties

---

## Site Thesis

Personal portfolio. Professional + personal blended — comics and cat art live alongside AI projects. Project pages serve as open-source playbooks: "GitHub for non-technical people."

**Audience:** Anyone googling "Dima Perkis" · curious/interesting people · co-workers in mixed mode

**First 5 seconds:** "Builds cool stuff · knows AI · sense of humor · diverse interests · prolific"

**Primary use case:** Share specific project URLs in conversation ("check out dimadimadima.com/projects/atl-radar"). When someone asks "how did you do that?" — the project page has the playbook.

**Not:** A vlog. Not for friends catching up. Not a traditional job-hunting portfolio.

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
    projects.astro   — All projects grid (uses ProjectsGrid.tsx React island)
    resume.astro     — Work timeline (uses WorkTimeline.tsx React island)
    about.astro      — Three-section: Professional / Side Quests / Personal
    feed.astro       — All feed posts
    [slug] pages     — Dynamic routes for projects and posts
  components/
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

## Content Discovery Patterns

### Finding project backstories
Launch haiku subagents to search BOTH locations for the same project:
- `~/Documents/Coding/Projects/` — code repos, READMEs, CLAUDE.md files (the "how")
- `~/Documents/Brain/01_Projects/` — planning docs, PRDs, conversation logs (the "why")

Cross-referencing both gives the full narrative. The Brain vault often has context the code repo doesn't.

**Key Brain vault project folders:**
- `Brain/01_Projects/2026-04-19_OpenClaw-AI-Business-Ideation/` — AI Ideas scoring rounds, synthesis docs
- `Brain/01_Projects/2026-01-17_Suno-Songs/` — 85 markdown files, 5,500 lines, full song catalog
- ATL Radar planning: PRD.md (15 sections), VENUE-REFRESH-GUIDE.md, taste profile docs
- Kill Bill: `2025-09-13_Tarantino-Graph/` — 8 planning files, ~10,000 words

### Finding screenshots
User drops screenshots in two locations:
- **External volume:** `/Volumes/dima/Documents/Screenshots/` — organized into subfolders (Art - Cat, Art - Dad Squad, Projects ATL Radar, etc.)
- **Local MBP:** `/Users/dmitriyperkis/Documents/Screenshots/` — flat files with SCR-* naming convention

Read each image file to identify what it shows, then copy to `public/images/` with descriptive filenames.

### Finding personal context
- Suno skill at `~/.claude/skills/suno-songwriter/`
- Concert/Spotify data lives in `~/Documents/Coding/Projects/2026-04-14_Concert-History/`
- iMessage database at `~/Library/Messages/chat.db` is accessible (142K messages) but TCC caveat applies
- Phone contacts: `~/Documents/Coding/Projects/2026-04-18_Personal-CRM/derived/gc_phone_index.json`

---

## SuperWhisper Decoding

Dima dictates via SuperWhisper. Transcription errors are common. Known decodings:
- "HTL Radar" = ATL Radar
- "Diver" = Dive52
- "Demo Percus" / "Dima Percus" = dimaperkis
- Always decode from context when something sounds wrong

---

## Featured Projects (order field → homepage position)

| Order | Project | Status | Image | Notes |
|-------|---------|--------|-------|-------|
| 0 | AI Ideas Explorer | live | ai-ideas-galaxy.png | Hero project. 1,160 ideas |
| 1 | ATL Radar | active | atl-radar-home.png | Personal event intelligence |
| 2 | Dive52 | active | dive52-discord.png | ADHD knowledge retention |
| 3 | Spotify Analysis | active | spotify-hero.png | 14 years, 10,133 hours |
| 4 | Concert History | — | concert-history-hero.png | 178 shows, 18 years |
| 5 | Suno Factory | active | NEEDS SCREENSHOT | 75+ songs, full pipeline |
| 6 | Fjord Sauna Bot | built | fjord-imessage.png | iMessage booking thread |

Kill Bill was unfeatured (`featured: false`). 27 other projects also unfeatured.

---

## Common Mistakes to Avoid

1. **Don't use sed on content files.** Earlier session wiped `ai-ideas-explorer.md` to 0 bytes with a sed command from wrong working directory. Use the Edit tool with explicit file paths.
2. **Read before Edit.** The Edit tool requires the file to have been Read first in the conversation. If Edit fails, Read the file first.
3. **SuperWhisper transcription.** Always decode from context (see above).
4. **Don't use the `$400M+` stat.** User flagged it as inflated. Still on resume highlight strip — revisit.
5. **No finality language.** Don't write "FINAL", "Complete", "Locked" in filenames or headers.
6. **LinkedIn URL is `dima-perkis`** (with hyphen), not `dimaperkis`.
7. **Don't inflate numbers.** Every stat should come from real data (screenshots, database queries, repo file counts). If you can't verify it, don't write it.

---

## Technical Notes

- **Build:** `npm run build` — clean, ~1.8s, 48 pages
- **Deploy:** `npx vercel --prod` then `npx vercel deploy --prod` to promote
- **Git:** Main branch push is blocked by repo policy. Use feature branches.
- **Theme tokens:** `src/styles/global.css` — light mode gold `#8a6012`, muted `#6a6560` (WCAG AA). Hacker mode muted `#3a8a3b`.
- **Grid pattern:** All grids use `gap-4` (1rem) with individual `border border-border` on cards. The old `gap-px bg-border` pattern was removed site-wide.
- **Images:** All in `public/images/`. No image optimization pipeline — just raw files.

---

## Open Items (Priority Order)

1. **Playbook layer** — Project pages should include actual artifacts (prompts, frameworks, markdown files). Needs design thinking about inline vs. downloadable vs. linked.
2. **`listed` field** — Add `listed: z.boolean().default(true)` to `src/content/config.ts`. Filter in `src/pages/projects.astro`.
3. **Suno Factory screenshot** — Only featured project without a card image.
4. **Headshot update** — User will provide new photo.
5. **SEO** — Site should rank for "Dima Perkis" searches. No meta work done yet.
