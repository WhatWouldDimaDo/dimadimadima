# Voice Interview Kit — Portfolio Rewrite Source Material

> **Current companion brief:** Give the GPT `GPT-VOICE-CONVERSATION-BRIEF-2026-07-16.md` too.
> It expands this kit into portfolio positioning, project taxonomy, `/now`, the July 16 Shubh
> discussion, and a Brain Ops / agentic-systems case study.

Goal: get Dima's real voice — stories, specific scenes, the moment something clicked or broke —
on record for each side project, so the portfolio pages can be rewritten from actual quotes
instead of spec-sheet copy. Interviews are voice-to-voice. Transcripts come back here and Claude
does the mining + rewrite pass.

## Stack Comparison (recommendation: ChatGPT Advanced Voice Mode)

| Option | Voice quality | Setup cost | Verdict |
|---|---|---|---|
| **ChatGPT Advanced Voice Mode + pasted context prompt** | Best available voice UX today — natural turn-taking, low latency, handles interruption well | Zero build. Paste a prompt, tap the voice icon. Already in Dima's toolkit. | **Use this.** |
| Claude mobile voice mode | Good, improving fast, but conversational pacing/interruption handling is a step behind ChatGPT's for this kind of loose, follow-the-thread interview | Zero build, but no equivalent "paste rich context, get a persistent interviewer persona" pattern yet | Backup only if ChatGPT access breaks |
| OpenAI Realtime API custom app | Full control over turn-taking, could pipe straight to a transcript file | Real build — API keys, a small web/voice client, testing | Overkill for a one-off interview series |
| ElevenLabs Conversational AI | Excellent voice cloning/quality, built for branded voice agents | Overkill — pricing and setup aimed at production voice products, not a personal interview | Skip |

**Workflow:**
1. Open a new ChatGPT chat (or a ChatGPT Project if you want all interviews in one place with shared context).
2. Paste the full contents of `INTERVIEW-GPT-PROMPT.md` (Part 2 of this kit) as the first message.
3. Tap the voice icon to enter Advanced Voice Mode. Confirm it acknowledges the persona and project list before you start talking.
4. Say which project you want to start with, or let it pick the first one in the list.
5. Talk through each project (~10 min target). Let it follow tangents — that's the point.
6. When done, ask ChatGPT to export/paste the full transcript (or copy it manually from the chat).
7. Hand the transcript back to Claude (see "Handing Transcripts Back" below).

---

## Per-Project Fact Sheets + Question Banks

Facts below are pulled directly from project HANDOFF.md files and the live site's
`src/content/projects/*.md` pages — nothing invented. Questions are designed to pull
stories and voice, not specs the sheet already covers.

### 1. Dewey (library scout)
**Facts:** Built in one session, 2026-07-10. Home branch = Joan P. Garner at Ponce de Leon
(BiblioCommons `PONCE`). Profiles: Dima (cyberpunk/espionage/satirical sci-fi), Dean (4, strong
opinions about misbehaving-pigeon books), Ruby (17mo, board-book era). The catalog's format
filter is silently broken (returns zero for everything); title search "broadens" a miss into a
fake hit (a search for "Press Here" cheerfully returned "All the Devils Are Here"). The real
precision lever turned out to be author, not ISBN. Thrift-store use is explicitly *not* resale —
Dima ruled that out.

1. What was the actual library trip that made you think "I could build this"?
2. Walk me through the moment you saw "Press Here" come back as "All the Devils Are Here" — what did you think was happening before you figured out the catalog was broadening the search?
3. Tell me about ruling out resale for the thrift-store use case — was there a specific moment that decided that?
4. Dean has strong opinions about misbehaving pigeons — what does that actually sound like coming out of him?
5. Describe the first real trip to Ponce with a Dewey-generated list in hand — did it work?
6. What's the story behind figuring out author-match beats ISBN-match for precision?
7. What would you brag about in this build to another engineer?

### 2. ToddlerMaps (Kid Map World)
**Facts:** Origin was a brain-dump on 2026-07-06. Built off the observation that StickerBox — a
$99 semi-viral kids' AI sticker printer — is the same mono-thermal hardware as the ~$100 Brother
QL-810W already on the kitchen counter; the clone "took an afternoon." Uses real MUTCD road
signs (public domain, fetched from Wikimedia) — Dima rejected drawn fallback signs, always wants
the real ones. A printer bug (`rotate="auto"` shrinking landscape strips) meant every prior
"strip" print had actually been coming out tiny. First verified trip strip: Home → Big Highway
(7 min) → Hot Dog Place (10 min) → Aquarium (13 min), physically printed. Site copy itself notes:
"Dean cares more about the hot dog place on the way than the aquarium at the end."

1. Take me back to the Jul 6 brain-dump — where were you, what set it off?
2. What was the moment you saw StickerBox and thought "I already have that hardware on my counter"?
3. Walk me through printing the aquarium trip strip and actually using it with Dean in the car — what did he say, what happened?
4. Why did the real MUTCD road signs matter enough to reject the easier drawn versions?
5. How long had you been printing shrunken strips before you caught the rotate bug — what was that discovery like?
6. Tell the "hot dog place beats the aquarium" story — what's the actual scene?
7. What's a sticker or print that made Dean light up?

### 3. WiggleWorks (Move & Play)
**Facts:** Webcam body-movement game hub for Dima's kids (4yo + 3yo) — stand in front of the
MacBook, see yourself full-screen on the TV, play with your body. Started as "Balloon Pop," grew
to 13 games as "Move & Play," renamed WiggleWorks 2026-07-08, now 15 games. Real user-facing bug:
the "Slack Laughs" demo preset turned on Demo Play with no toggle to undo it — live feedback came
back as "camera won't open, defaulting to demo mode." Two-player identity used to swap when kids
crossed sides (fixed via sticky nearest-neighbor tracking). All LAHZO-branded assets and Easter
eggs were stripped out post-departure. A "body missing 2.2s" moment shows a 🙈👋 toast instead of
looking broken.

1. Describe the first time you stood in front of the MacBook and saw yourself full-screen on the TV — what was that like?
2. Tell me about the "camera won't open, defaulting to demo mode" feedback — who reported it, what was actually happening?
3. Walk me through the two-player swap bug — what did it look like in practice when the kids crossed sides?
4. What was it like ripping out all the LAHZO branding once the job ended?
5. Describe your kids actually playing one of the 15 games — a specific scene.
6. Which game gets the best reaction, and what does that reaction look like?
7. Any bug that turned out delightful instead of just annoying?

### 4. Georgia Power / Power Analysis
**Facts:** Morningside house, Georgia Power Smart Usage plan, 13 months of billing + 10,487
hourly usage readings analyzed. Key finding: 19 of the top 20 highest single-hour demand reads
are off-peak — the June 2026 bill's 7 kW demand charge was set Saturday June 13 at 6pm, 92°F, a
weekend evening, not the assumed weekday 2–7pm peak window. Primary demand driver: HVAC
compressor + dryer running at once. Overnight "phantom load" runs 200–400W higher than expected
— suspects include a second fridge/freezer, gaming console, or LEAF charging. Full-discipline
scheduling could save an estimated ~$120/yr.

1. What got you looking at the power bill this closely — a specific bill that annoyed you?
2. Tell me about realizing the demand charge was set on a Saturday evening, not the weekday window everyone assumes — what was your reaction?
3. What was it actually like pulling 13 months of PDFs and an hourly export — any funny moment in that grind?
4. What's your best guess on the phantom overnight load, and have you gone to check it yet?
5. How would you actually explain "never run the dryer while the AC's on" to Jeannie?
6. What's the one assumption about your own house that turned out to be wrong?
7. What would you brag about here to another data nerd?

### 5. AI Ideas Explorer (1,160 AI Business Ideas)
**Facts:** 35 Claude agents, one industry vertical each, ran in parallel across 26 industries,
producing 1,160 ideas in 6 hours — while Dima was starting a new VP role with two toddlers at
home. Scoring framework (9 dimensions) went through 4 recalibration rounds. Biggest insight:
dropping revenue-per-customer from 20% to 12% of the score surfaced "boring autonomous" ideas
(HVAC seasonal campaigns, internet-outage refund bots, permit scrapers) over flashier
human-in-the-loop plays. Decisive winner: a Property Tax Appeal Automator — runs on public county
data, deterministic trigger, compounds via a proprietary outcome database.

1. What made you run 35 agents at once instead of doing this the normal, slower way?
2. What was it like watching 1,160 ideas land in 6 hours — where were you, what did that feel like?
3. Tell me about the moment the scoring was clearly wrong and you realized revenue-weighting was the problem.
4. Why did the Property Tax Appeal Automator win — did that surprise you?
5. What's the weirdest or funniest idea in the 1,160 that you still remember?
6. If a friend asked "so what should I actually go build," what would you tell them based on this?
7. What's the thing you'd brag about — the scale, or the insight?

### 6. On Dima's Radar (ATL Radar)
**Facts:** Built because generic aggregators (Eventbrite, Bandsintown) surface 500 mediocre
options; Dima wanted 50 good ones ranked by his own taste. 51 curated events + 110+ evergreen
activities, each LLM-scored 0–100 on five axes (genre match, venue quality, format rarity,
lineup strength, value for money) — auditable via radar charts, not a black box. Real use cases:
Friday-morning weekend scan, spontaneous-Sunday evergreen browsing, date-night filter (Dima +
Jeannie, no kids), age-gated family outings for a 4-year-old, and a weekly script that suggests
overdue friends as reconnection excuses.

1. Tell me about a specific Friday weekend-scan that turned into a plan you wouldn't have found otherwise.
2. What was the fight to get the 5-axis scoring right — any version that scored something absurdly wrong?
3. Describe an actual date night or family outing you found through this tool.
4. Why did "auditable, not a black box" matter enough to build radar charts for it — was there a moment an LLM score felt untrustworthy?
5. Has the reconnection-nudge piece actually gotten you to reach out to someone you'd have let slide?
6. What's something the tool surfaced that surprised a friend you knew about?
7. What would you brag about to another builder here?

### 7. Spotify Listening History Analysis
**Facts:** 14 years of data starting 2012 — 10,133 hours, 147,594 streams, 15,748 unique artists,
422 continuous days of total listening. Top artist all-time: Mac Miller. Insight: songs never
skipped in 500+ plays are a different category of favorite than songs played 1,000 times but
skipped 40% of the time — "the real canon." Clear 6–8 week obsession cycles traceable to
relationships, job changes, life events. Discovery-vs-catalog ratio has dropped steadily since
2021 (site copy calls this "concerning"). Dedup headache: offline/online sync double-logged the
same track/timestamp with different offline_timestamps; the same song re-released across albums
fragmented into multiple URIs.

1. What made you actually go pull 14 years of Spotify data instead of just wondering about it?
2. Walk me through tracing one of the 6–8 week obsession cycles to an actual relationship or job change — tell that story.
3. Mac Miller is your all-time top artist — what's the relationship there, when did that start?
4. Tell me about the "never-skip" list — what's on it, and why does that feel truer than raw play count?
5. The discovery-vs-catalog ratio dropping since 2021 read as "concerning" on the page — what does that actually say about you right now?
6. What was the messiest data bug and what did it feel like debugging your own listening history?
7. What's a specific memory the data jogged loose that you'd genuinely forgotten?

### 8. Concert History
**Facts:** 178 confirmed shows across 18 years (2007–2025). Terminal West leads with 17 shows;
preference for 800–1,100 cap rooms; The Eastern emerged as a venue post-2022. 29 shows in both
2023 and 2024 — despite becoming a parent. Electronic music is 84–91% of Spotify hours every
single year. Cross-referenced against a 71-person CRM surfaced 7 core "Concert Squad" friends.
Heaviest-listened artists never seen live: Camo & Krooked (62 hrs), Tosca (52 hrs). Peak touring
windows: Feb–May and Sep–Nov.

1. Take me back to the earliest show on the list, 2007 — what do you remember?
2. 29 shows in both 2023 and 2024 with a toddler and then a newborn — how did you actually pull that off logistically?
3. Tell me about the Concert Squad — who are the 7 core people, and give me one specific night with them.
4. Camo & Krooked and Tosca are your most-listened artists you've never seen live — why has that never happened?
5. What made Terminal West "your room," and what pulled you toward The Eastern more recently?
6. When did you realize electronic music was just who you are musically, at 84–91% every year?
7. Of all 178 shows, what's the single best live-music memory, no contest?

### 9. Suno Song Factory
**Facts:** Give it three keywords ("dean machine techno") and it outputs a finished song —
lyrics, cover art, metadata, YouTube-ready video. 75+ songs so far, mostly for the kids. The
`suno-songwriter` Claude skill researches reference tracks for BPM, key, and hook *mechanics*
specifically (spelling bridges, call-and-response, mantra loops, stop-time breaks) — mechanics
first, not vibes first. Pipeline: Claude lyrics/style guide → Suno API → DALL-E/Flux 9:16 cover
art → FFmpeg/eyed3 normalize to -14 LUFS + embed scrolling lyrics → YouTube upload (6/day quota
cap, manifest prevents dupes). Catalog includes classroom anthems for Dean's school, a
getting-dressed French-house banger, bedtime reggae for Ruby, friends'-kids birthday tracks
(Jackson 5 to Uptown Funk styles), and mechanics studies of Ofra Haza, Adriano Celentano, and
Daft Punk (adapted into "Waffle Time"). MP3s go to Yoto cards for the kids.

1. What was the very first song you made, and what made you think "this should be a factory"?
2. Walk me through Dean or Ruby hearing a song about themselves for the first time — what was the reaction?
3. Tell me about reverse-engineering Daft Punk's filter sweeps into "Waffle Time" — what was that process like?
4. What's the actual morning scene the getting-dressed French-house banger is trying to fix?
5. What's the most annoying manual step you're proudest of having automated away?
6. Tell me about a birthday track you made for a friend's kid — whose, and how did they react?
7. Of the 75+, is there one you're most attached to, and why?
8. What's the plan for when the kids are old enough to be embarrassed by all this?

### 10. All Roads to Kill Bill
**Facts:** A live 3D force-directed graph (React + Three.js + TMDB) with 200+ nodes mapping every
film that fed into Kill Bill and every film it influenced — edges labeled with the *specific*
borrowed element (a shot, a score cue, a narrative structure, a character archetype), not a
generic "influenced by." Started as the Tarantino Influence Graph: a Python scraper pulling 37
films from TMDB, relationships extracted via Firecrawl, built into a fully-linked Obsidian vault
— before it became the live visualization. Genre clusters emerge naturally from the physics
simulation, not manual layout.

1. What's your history with Kill Bill or Tarantino that made this the film worth building for?
2. Describe the moment the graph first rendered with real data and genre clusters emerged on their own.
3. Walk me through one specific edge in the graph — a shot or score cue borrowed from another film that genuinely delights you.
4. What triggered the jump from the Obsidian vault / scraper version to "let's make this a live 3D thing"?
5. Did Firecrawl ever get a relationship hilariously wrong, or surprisingly right?
6. If you sat a stranger down in front of this graph, what's the first node you'd click to hook them?

---

## Handing Transcripts Back

When an interview session (or all of them) is done:
- Drop the exported transcript file in `~/Downloads/`, **or**
- Paste the raw transcript directly into a Claude chat.

Either way, tell Claude which project(s) the transcript covers. Claude does the voice-pass rewrite
of the matching `src/content/projects/*.md` page — pulling real quotes, scenes, and phrasing from
the transcript rather than paraphrasing the existing spec-sheet copy.
