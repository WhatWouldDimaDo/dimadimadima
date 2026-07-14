# Ask Dima — Chatbot Plan

Working plan for an "Ask Dima" chat widget on dimadimadima.com, inspired by daniel-castro.lovable.app's pattern of career-highlight chips that open a chat. No code written yet — this is architecture + content + rollout.

Audiences: startup recruiters, AI startup founders, corporate recruiters, VP-level hiring managers, plus random googlers.

---

## 1. Architecture

**Pattern:** matches the existing `api/sticker.js` — a Vercel serverless function, API key in Vercel env, never in the client.

```
api/ask.js              — POST handler, streams SSE/chunked text back to client
src/data/site-context.json (generated at build time from src/content/*)
src/components/AskDima.tsx   — chat widget (React island, client:load or client:visible)
scripts/build-context.mjs    — reads src/content/projects/*.md + resume/about copy, writes site-context.json
```

**Model call:** Anthropic API directly (`claude-sonnet-5`), not OpenRouter — this is a conversational agent representing Dima, not an image gen passthrough, and direct Anthropic gives native streaming + prompt caching. Use `ANTHROPIC_API_KEY` in Vercel env (new key, separate from `OPENROUTER_API_KEY`). Streaming via `stream: true` in the Messages API, piped through the serverless function as chunked response — Vercel functions support streaming responses (`export const config = { runtime: 'edge' }` or Node with manual chunk writes; edge runtime is the simpler path for streaming).

**Widget:** vanilla JS/CSS is enough for one floating chat panel — the repo already has React islands (`ProjectsGrid.tsx`, `WorkTimeline.tsx`) so a React island is equally fine and keeps state management (message list, streaming buffer) simpler. Recommend a `AskDima.tsx` React island loaded with `client:visible` on all pages via `Layout.astro`, so it doesn't cost JS on initial paint.

**Rate limiting:** simplest viable option given no existing KV/Redis in this stack — in-memory per-instance counter is unreliable on serverless (cold starts reset it, multiple concurrent instances don't share state). Use **Vercel KV** (Upstash-backed, first-party Vercel integration, free tier covers this volume) keyed by IP + day: cap at ~20 messages/IP/day. Fallback if KV setup is deferred for v1: a coarse cap via a signed cookie + short-lived in-memory guard (good enough to stop trivial abuse, not bulletproof — note this tradeoff if shipped without KV).

**Spend cap:** track token usage per request in Vercel KV (running monthly counter), hard-stop the endpoint (return a friendly "ask me on LinkedIn instead" message) once a monthly ceiling is hit — e.g. $15/mo ceiling as a circuit breaker independent of Anthropic's own billing alerts. Also set an Anthropic console spend limit as the backstop.

**Cost estimate at realistic traffic:** low hundreds of sessions/month, say 300 sessions × ~4 exchanges each × ~800 input tokens (system prompt + context + history) + ~200 output tokens per exchange ≈ 1,200 exchanges/mo. At Sonnet pricing (~$3/MTok in, ~$15/MTok out): input ≈ 1,200 × 800 = 960K tokens ≈ $2.90; output ≈ 1,200 × 200 = 240K tokens ≈ $3.60. **Total: roughly $6–10/month** — trivial, but the spend cap matters because a scraping bot or a shared link on Twitter could spike it 10-50x overnight.

---

## 2. Content Grounding

**Source of truth is generated at build time**, not fetched live — a `scripts/build-context.mjs` step reads:
- `src/content/projects/*.md` (all 47 project files — frontmatter + body, this is the richest source: what it is, why it exists, stack, how Dima actually uses it)
- `src/pages/about.astro` copy (professional/side-quests/personal blurbs, core values, bucket list)
- `src/pages/resume.astro` + `ResumeExperience` component data (companies, titles, dates, education)

...and compiles it into a single `site-context.json` bundled into the function at build time. This keeps the system prompt scoped to exactly what's already public on the site — nothing pulled from Brain vault, iMessage, CRM, or any private source.

**Explicit exclusion:** `~/Documents/Brain/01_Projects/2026-07-07_Job-Search-OS` is off-limits for grounding — not read, not summarized, not referenced in the context build script. That project contains active job-search strategy (target companies, positioning, negotiation posture) that has no business being queryable by a recruiter-facing bot.

**Appropriate to surface** (already public):
- Career history as it appears on `/resume` (companies, titles, dates, MBA/BBA)
- Project details from `/projects/*` pages — what it does, stack, why he built it
- About-page personal facts already public on the site (married to Jeannie, kids Dean & Ruby by first name only, Everesting finisher, born Moldova/raised NJ/lives Atlanta)
- LinkedIn-public framing of the Lahzo role and the general fact of the transition/exit (title, dates, "most recently VP of Strategy & Analytics")

**Hard exclusions — stated explicitly in the system prompt, not left implicit:**
- Lahzo separation details beyond public dates/title (no negotiation terms, no reason-for-exit narrative, no severance, no non-compete specifics)
- Compensation history or salary expectations, current or past, at any company
- Family details beyond what's already on the site — no schedules, no addresses, no health/developmental info about Dean or Ruby
- Private contact info beyond the public LinkedIn/email already listed on `/about`
- Non-compete terms (industries, dates, geography)
- Health or financial data of any kind
- Negative commentary about past employers, managers, or colleagues — even if the model could infer a critical take from tone, it should redirect, not editorialize

When a question hits an exclusion, the bot should say so plainly and redirect to email — not deflect vaguely or pretend not to understand. E.g.: "That's a conversation for email, not a chatbot — dperkis@gmail.com."

---

## 3. System Prompt Draft (~300 words)

```
You are Ask Dima — a chat assistant embedded on Dima Perkis's personal site,
dimadimadima.com. You answer questions about Dima's career, side projects, and
public background, using ONLY the context provided below (compiled from his
resume, about page, and project write-ups). You are not Dima himself — you're
a tool he built to answer questions when he's not around.

Voice: direct, confident, no hedging, no corporate throat-clearing. Dry sense
of humor is welcome but don't force a joke into every answer. Dima says
"deploy," never "ship." Keep answers tight — 2-4 sentences for simple
questions, a short paragraph max for anything meatier. No bullet-point walls
unless the question genuinely calls for a list.

You're talking to a mix of people: startup recruiters, AI founders, corporate
recruiters, VP-level hiring managers, and curious randoms who googled his
name. Read the question and match the register — a recruiter asking about
scope of the Equifax role gets a substantive answer; someone asking about the
cat comics gets a lighter one.

Hard boundaries — redirect to email (dperkis@gmail.com) rather than answer:
- Anything about the Lahzo exit beyond title/dates already public
- Compensation, salary expectations, equity, anything financial
- Non-compete terms or scope
- Family details beyond what's on the site (no schedules, no health info)
- Private contact info beyond what's listed on /about
- Any request to speak badly about a past employer or colleague — decline
  and pivot, don't pretend confusion

If you don't know something because it's not in your context, say so plainly
— don't invent detail, don't hedge with "I believe" or "as far as I know."
Just say it's not something you have and point to email or LinkedIn.

You can suggest a project page or the resume page when relevant ("worth a
look: dimadimadima.com/projects/atl-radar"). End most answers open enough
that the person can ask a natural follow-up.
```

---

## 4. Suggested-Questions UX

Chips shown contextually per page, matching the daniel-castro reference pattern — 3 chips, tapping one opens the chat panel pre-seeded with that question.

**Homepage:**
- "What's the AI Ideas Explorer?"
- "What kind of role are you looking for next?"
- "What's the most interesting thing you've built?"

**Resume page:**
- "What did you actually do at Equifax?"
- "Why'd you leave Lahzo?" → bot answers with public facts only, redirects deeper questions
- "What are you looking for in a next role?"

**Project page (dynamic, per-project):**
- "How does [project] actually work?"
- "What would it take to build something like this for my company?"
- "What other AI projects have you built?"

Chip copy for project pages should be templated off `title` + `tags` from frontmatter so it's not hand-maintained per project — one template, filled at render time.

---

## 5. Build Estimate & Rollout

**Files to create:**
- `api/ask.js` — serverless function, streaming, rate limit + spend cap check
- `scripts/build-context.mjs` — build-time context compiler, runs as part of `npm run build`
- `src/data/site-context.json` — generated artifact (gitignored, or committed for cache — decide based on build reproducibility preference)
- `src/components/AskDima.tsx` — chat widget island (panel, input, streaming render, chip row)
- `src/components/AskChips.astro` or per-page prop — contextual suggested-question chips
- Layout.astro edit to mount the widget globally
- Vercel env additions: `ANTHROPIC_API_KEY`, KV binding for rate limit + spend tracking

**Effort estimate:** roughly 1.5-2 focused sessions for v1 (context compiler + API route + basic widget, no KV yet, in-memory rate limit) plus a half session to wire up Vercel KV properly for rate limiting and spend cap. Widget polish (animation, mobile layout, matching the site's gold/serif design language) is its own pass — maybe another half session.

**Phased rollout:**
1. **v1 — text only, grounded on baked context.** Context compiled at build time from `src/content/*`. No streaming yet (simpler to ship correct first) — request/response round trip is fine at this traffic level. Coarse rate limit (signed cookie + short in-memory window). No chips yet, just a floating "Ask Dima" button.
2. **v2 — streaming + chips.** Switch to edge runtime streaming for responsive feel. Add contextual suggested-question chips per page. Move rate limiting to Vercel KV, add the monthly spend-cap circuit breaker.
3. **v3 — polish.** Design pass to match site aesthetic, analytics on which questions get asked (useful signal for what recruiters actually want to know), maybe a "was this helpful" thumbs signal to catch hallucination drift.

Don't build v2/v3 features into v1 — get the grounding and exclusion boundaries right first, since that's the part that matters if a recruiter actually uses this.
