# Turning on the guide chat assistant

The chat widget (`public/mexico/chat.js` + `chat.css`) talks to
`api/mexico-chat.js`, a Vercel serverless function that calls OpenRouter. It
does nothing until the API key is set in Vercel — with no key, the endpoint
returns a clear "not configured" error instead of crashing, and the widget
shows that in the panel.

## 1. Add the key

You already have `OPENROUTER_API_KEY` in the Paperclip `.env` for
`gen_images.py` — same key works here, but it has to be added to **this**
Vercel project separately; Vercel functions don't read your local `.env`.

```bash
vercel env add OPENROUTER_API_KEY
```

When prompted:
- Paste the same OpenRouter key used for `gen_images.py` (or a fresh one —
  doesn't matter, OpenRouter keys aren't tied to a single use).
- **Scope: Production and Preview** at minimum. Add it to Development too if
  you want to test the chat locally with `vercel dev`.

## 2. Redeploy

Env vars only take effect on the next build — adding the var alone does not
update a running deployment.

```bash
npx vercel --prod
```

(Same deploy flow as the rest of the site — no special step for this
function.)

## 3. Wire it in

This session only created the four files under `api/` and `public/mexico/`.
`index.html` needs, once, near the other `<link>`/`<script>` tags:

```html
<link rel="stylesheet" href="chat.css">
...
<script src="chat.js"></script>
```

`chat.js` must load after `data.js` (and `guides.js` if you want guide
titles searchable in chat) — it reads `window.CDMX` on init and bails with a
console error if it's missing.

## 4. Roughly what it costs

Model is `anthropic/claude-sonnet-4.5` via OpenRouter. Each turn sends the
whole guide (places, current plan, day/slot structure — roughly 8–12k tokens
of context) plus the conversation so far, capped at 30 messages and 900
output tokens. At Sonnet 4.5's OpenRouter pricing that's on the order of
**$0.03–0.06 per message** once a conversation has a few turns in it (input
cost dominates because of the guide context, not the reply). A `search_web`
tool call adds one more full model round-trip, roughly doubling the cost of
that turn. Nothing here is metered or capped in dollars — only in request
count (see below) — so watch actual spend on the OpenRouter dashboard for
the first few days.

## 5. The honest risk: this endpoint is unauthenticated

`api/mexico-chat.js` has no login, no API key check, nothing — it's a public
URL at `dimadimadima.com/api/mexico-chat` that anyone who finds it (browser
devtools, a scraped sitemap, `robots.txt` disallow doesn't stop this) can
POST to and spend your OpenRouter credits on, for anything, not just
guide-related chat. The system prompt tries to keep it on-topic but a system
prompt is not a security boundary — someone who wants to use your key as a
free Claude proxy can.

The in-memory rate limiter (20 requests / 10 minutes / IP) is a speed bump,
not a defence: it resets every time the function cold-starts (which Vercel
does routinely, not just on deploy), and it's trivial to get around with
rotating IPs or just waiting it out. Don't treat it as protection against a
motivated abuser — only against accidental runaway loops and casual poking.

Cheapest ways to actually lock this down, roughly in order of effort:

1. **Set a hard OpenRouter spend cap** on the key itself (OpenRouter supports
   per-key limits) — the single highest-leverage five-minute fix. This
   bounds the worst case to a number you chose, regardless of anything else.
2. **Add a shared secret.** Have `chat.js` send a static header (e.g.
   `X-Chat-Key`), check it in `mexico-chat.js`, reject otherwise. Trivially
   bypassed by anyone reading the JS bundle, but stops the URL being found
   and hit blind by a bot or scraper.
3. **Move rate limiting to Vercel Edge Config or KV** instead of the
   in-memory Map — survives cold starts, so the limit is real per-IP rather
   than reset every few minutes of inactivity.
4. **Put it behind Vercel's built-in password protection** or a Cloudflare
   Turnstile challenge on first load of `/mexico/` if the guide itself
   doesn't need to be public.
5. **Real auth** (even a single shared password checked server-side against
   an env var) if this is ever going to sit on a URL you expect strangers to
   find.

None of this is done yet. Option 1 is the one to actually do before sharing
the link widely — everything else is nice-to-have.
