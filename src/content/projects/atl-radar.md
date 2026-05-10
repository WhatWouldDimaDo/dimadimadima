---
title: ATL Radar
date: 2026-04-21
description: Personal event intelligence for Atlanta. LLM-scored events and activities ranked against my actual taste profile, surfaced through a wizard filter, interactive map, and mobile-first UX.
tags: [ai, claude, events, atlanta, data viz, llm, maps]
status: active
featured: true
order: 1
url: https://atlradar.vercel.app
image: /images/atl-radar-home.png
---

## The Problem

I miss things. High appetite for experiences — music, dancing, outdoor adventures, family activities — but real capacity constraints: VP role, toddler plus newborn, and the friction of coordinating a busy schedule. Generic event aggregators (Eventbrite, Bandsintown) surface 500 mediocre options. I needed 50 good ones, ranked by *my* taste, with enough context to decide in seconds.

## What It Is

A personal event intelligence layer for Atlanta. Not a generic aggregator — it's built around one person's taste, social graph, and life constraints. 51 curated events and 110+ evergreen activities, each scored 0–100 by an LLM using a structured taste profile built from years of concert history and Spotify data.

Five scoring axes: genre match, venue quality, format rarity, lineup strength, value for money. The scores are auditable via radar charts — not a black box. The wizard walks through a few preference questions and re-ranks everything live.

## How I Actually Use It

- **Weekend scan** — Friday morning, see what's good in the next 2–3 days
- **Spontaneous Sunday** — Browse 110+ evergreen activities (free hikes, pools, family spots) for impromptu outings
- **Date night** — Filter for "Dima + Jeannie, no kids"
- **Family outing** — Age-gated activities filtered for a 4-year-old
- **Social activation** — Feeds into a weekly script that suggests overdue friends + events as reconnection excuses

## Stack

- Vanilla HTML/CSS/JS — static, zero framework overhead
- LLM scoring pipeline (Claude) for taste-matched ranking
- Leaflet.js interactive map with clustered pins
- Mobile bottom sheet pattern for touch-first browsing
- Deployed on Vercel
