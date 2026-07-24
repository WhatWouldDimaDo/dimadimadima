---
title: On Dima's Radar
date: 2026-04-21
description: "Atlanta events scraped wide, ranked against my actual taste, and turned into the thing that matters: a short invite a friend answers with yes or maybe in one text."
shortDescription: "The event finder became useful when it stopped being about events and started helping me see people."
tags: [ai, claude, events, atlanta, data viz, llm, maps]
status: active
featured: true
caseStudy: true
order: 3
url: https://dimadimadima.com/atl
ctaLabel: Open On Dima's Radar
image: /atl/images/brand/dimas-radar-mark.png
proof:
  - "Used to send real invitations and turn reconnections into specific plans"
  - "One invite can combine events, open dates, and evergreen fallbacks"
  - "No formal response-rate or event-coverage measurement yet"
buildTools:
  - name: Claude + taste profiles
    detail: Scores a wide event feed against my actual music, venue, format, and value preferences.
  - name: Scraping + public event feeds
    detail: Pulls from many sources because no single Atlanta calendar covers the city well.
  - name: Vanilla HTML, CSS, and JavaScript
    detail: Keeps the event browser, filters, maps, and invitation flow fast and portable.
  - name: Leaflet
    detail: Maps events and evergreen activities with clustered, mobile-friendly markers.
  - name: Calendar context
    detail: Turns event discovery into a practical choice among nights that could actually work.
  - name: Vercel analytics + PostHog
    detail: Tracks how the live site gets used without pretending usage already proves impact.
---

## The Problem

I kept finding out about great Atlanta stuff after it happened. Eventbrite could give me 500 events, but it couldn't answer the question I actually had: *I want to see Dave — what are six things we'd both like, and which three nights am I free?*

High appetite for experiences — music, dancing, outdoor adventures, family activities — but real capacity constraints: two small kids and the friction of coordinating everyone's calendars. The bottleneck was never finding events. It was turning "we should hang out" into a specific plan someone can say yes to.

## What It Is

Radar scrapes the city wide, then ranks everything against a taste profile built from years of my concert history and Spotify data — each event scored 0–100 by an LLM across five axes: genre match, venue quality, format rarity, lineup strength, value for money. The scores are auditable via radar charts, not a black box. A wizard walks through a few preference questions and re-ranks everything live.

The feed updates continuously; alongside dated events, a deep bench of evergreen activities (free hikes, pools, family spots) covers the "what do we do *today*" case.

<figure class="story-image">
  <img src="/images/atl-radar-home.png" alt="On Dima's Radar showing recommended Atlanta events" />
  <figcaption>The feed is deliberately broad. The useful output is deliberately short.</figcaption>
</figure>

## The Part That Matters: The Invite

Ranking events is table stakes. The point is what happens next: pick a handful of events plus a few free evenings, and send one link or a plain-text invite a friend can answer with a yes or a maybe in a single text. Proposed times and evergreen fallbacks reduce the back-and-forth that usually kills a plan.

## When It Became Real

By July, I was no longer only demoing Radar. I was using it in the part of life it was built for: reconnecting with people.

In one conversation, a friend and I moved from talking generally about getting together to a short invitation with a Shakespeare performance, a storytelling night, live music, and a specific afternoon for coffee. In coaching, I caught myself describing the site not as something I had built, but as something I had been **using to make plans and connections**.

That is the outcome I care about. Not a bigger event database. Not a more sophisticated score. A plan that leaves the group chat.

## How I Use It

- **Weekend scan** — Friday morning, see what's good in the next 2–3 days
- **Spontaneous Sunday** — browse evergreen activities for impromptu outings
- **Date night** — filter for "Dima + Jeannie, no kids"
- **Family outing** — age-gated activities filtered for a 4-year-old
- **Reconnection** — a weekly script pairs overdue friends with upcoming events as a concrete excuse to reach out

## What Is Still Uncertain

- Whether people besides me find the ranking meaningfully better than a normal calendar
- Which sources and neighborhoods the scraper still misses
- Whether an invitation link gets a faster answer than a thoughtful text
- How much calendar context can be useful without making the tool invasive

Those are usage questions, not feature requests. The next version should come from watching people plan.
