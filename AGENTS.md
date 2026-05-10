# dimadimadima — Agent Operating Instructions

**Project:** Personal portfolio website
**Working Dir:** `/coding/Projects/dimadimadima` (inside Paperclip container)
**Host path:** `/Users/dmitriyperkis/Documents/Coding/Projects/dimadimadima`
**Stack:** Astro 4 + React 18 + Tailwind CSS 3 + TypeScript
**Deployment:** Vercel (auto-deploy on push to main)

---

## Project Overview

Dima's personal portfolio site. Showcases projects, a creative feed, resume, and about page.
Content is managed via Astro content collections (markdown files in `src/content/`).

---

## Key Files

| File / Dir | Purpose |
|---|---|
| `src/pages/index.astro` | Landing page |
| `src/pages/projects.astro` | Projects list page |
| `src/pages/projects/[slug].astro` | Individual project page |
| `src/pages/about.astro` | About page |
| `src/pages/resume.astro` | Resume page |
| `src/pages/feed.astro` | Creative feed (songs, images, notes) |
| `src/content/projects/*.md` | Project markdown files (frontmatter + body) |
| `src/content/posts/*.md` | Feed post markdown files |
| `src/content/config.ts` | Content collection schema definitions |
| `src/components/` | Shared Astro + React components |
| `src/layouts/` | Page layout wrappers |
| `src/styles/` | Global CSS |
| `astro.config.mjs` | Astro config (React + Tailwind integrations) |
| `vercel.json` | Vercel deployment config |
| `public/` | Static assets (images, icons) |

---

## Content Schema

### projects collection
```yaml
title:        string         # required
description:  string         # required
tags:         string[]       # required
date:         date?          # optional
url:          string?        # external link
image:        string?        # relative to public/
featured:     boolean        # default false
order:        number         # sort order, default 99
status:       string?        # e.g. "live", "wip", "archived"
```

### posts collection
```yaml
title:   string
type:    'song' | 'image' | 'project' | 'note'
tags:    string[]
date:    date
youtube: string?   # YouTube embed ID
embed:   string?
image:   string?
caption: string?
draft:   boolean   # default false
```

---

## HARD RULES — READ FIRST

**NO GIT PUSH.** Do not run `git push`. Local commits are fine. Push requires Dima sign-off.

**NO BRAIN ACCESS.** Do not read, list, or reference files under `/brain/`. Portfolio work
does not require access to the personal vault. If you need biographical context about Dima,
ask via a task comment — do not go spelunking.

**NO .ENV READS.** Never read, print, or output any `.env` file contents.

**PLAN BEFORE CODE.** For any structural or design change, write a brief implementation note
as a task comment before touching code. Content-only changes (adding a project, fixing copy)
can proceed without a plan.

**VERCEL DEPLOYS AUTOMATICALLY.** A push to `main` triggers a Vercel build. Do not push
unless Dima has explicitly approved the changes.

---

## Development Setup

```bash
npm install           # install deps
npm run dev           # dev server on :4321
npm run build         # production build → dist/
npm run preview       # preview production build
```

Dev server runs on port `:4321` (Astro default).

---

## Deployed URLs

| Surface | URL |
|---|---|
| Vercel production | TBD — check Vercel dashboard |
| Local dev | http://localhost:4321 |
