---
title: On Dima's Radar
date: 2026-04-21
description: "Atlanta events scraped wide, ranked against my actual taste, and turned into the thing that matters: a short invite a friend answers with yes or maybe in one text."
tags: [ai, claude, events, atlanta, data viz, llm, maps]
status: active
featured: true
order: 1
url: https://dimadimadima.com/atl
image: /images/atl-radar-home.png
---

## The Problem

I kept finding out about great Atlanta stuff after it happened. Eventbrite could give me 500 events, but it couldn't answer the question I actually had: *I want to see Dave — what are six things we'd both like, and which three nights am I free?*

High appetite for experiences — music, dancing, outdoor adventures, family activities — but real capacity constraints: two small kids and the friction of coordinating everyone's calendars. The bottleneck was never finding events. It was turning "we should hang out" into a specific plan someone can say yes to.

## What It Is

Radar scrapes the city wide, then ranks everything against a taste profile built from years of my concert history and Spotify data — each event scored 0–100 by an LLM across five axes: genre match, venue quality, format rarity, lineup strength, value for money. The scores are auditable via radar charts, not a black box. A wizard walks through a few preference questions and re-ranks everything live.

The feed updates continuously; alongside dated events, a deep bench of evergreen activities (free hikes, pools, family spots) covers the "what do we do *today*" case.

## The Part That Matters: The Invite

Ranking events is table stakes. The point is what happens next: pick a handful of events plus a few free evenings, and send one link or a plain-text invite a friend can answer with a yes or a maybe in a single text. Proposed times and evergreen fallbacks reduce the back-and-forth that usually kills a plan.

## How I Actually Use It

- **Weekend scan** — Friday morning, see what's good in the next 2–3 days
- **Spontaneous Sunday** — browse evergreen activities for impromptu outings
- **Date night** — filter for "Dima + Jeannie, no kids"
- **Family outing** — age-gated activities filtered for a 4-year-old
- **Reconnection** — a weekly script pairs overdue friends with upcoming events as a concrete excuse to reach out

## Stack

- Vanilla HTML/CSS/JS — static, zero framework overhead
- LLM scoring pipeline (Claude) for taste-matched ranking
- Leaflet.js interactive map with clustered pins
- Mobile bottom sheet pattern for touch-first browsing
- Deployed on Vercel
