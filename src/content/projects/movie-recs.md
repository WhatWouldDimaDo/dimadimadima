---
title: AI Movie Recommendation System
date: 2024-06-01
description: Used ChatGPT to build a personal film taste profile from 200+ ratings, then created a structured preference model that generates ranked recommendations with explanations. Tracks mood, genre drift, and blind spots.
tags: [ai, chatgpt, movies, data, tools]
status: active
featured: false
listed: false
order: 32
---

## The Problem with Movie Recommendations

Netflix knows what you'll watch next. It doesn't know *why*, and it can't explain the recommendation in a way that helps you discover what you actually want. Algorithms optimize for click — not for the kind of film that stays with you for weeks.

## The Approach

Over several months I fed ChatGPT a structured log of every film I'd watched and rated (200+). The prompt evolved from simple "recommend me something" to a much richer dialogue:

- **Rating** (1–10) + **Why** (2–3 sentences on what worked and didn't)
- **Mood** at time of watching
- **Rewatch factor** — would I watch it again, and in what context?
- **Taste axis** — where does this sit on the slow/fast, cerebral/visceral, dark/hopeful axes?

From this, ChatGPT extracted a personal taste fingerprint: strong preference for morally ambiguous protagonists, slow-burn pacing with earned payoffs, cinematography-first filmmaking, and anything in the noir/neo-noir family.

## Book/Genre Discovery

The same system revealed two blind spots: **hard sci-fi** (I'd been avoiding it; after profiling my taste it identified specific authors who'd bridge the gap) and **Nordic noir** (which led to a reading list that replaced my Netflix habit entirely).

The AI also identified that I respond strongly to audio drama as a format — long-form narrative podcasts and BBC Radio plays. This wasn't something I would have articulated myself; it emerged from pattern analysis across my ratings.

## What I Track Now

- Film ratings + taste notes (ongoing log)
- Book completions + whether I'd recommend and to whom
- Audio drama favorites (BBC Sherlock Holmes, Audible Originals, Wolf 359)
- Genre evolution over time — where my taste is heading

The system has become a genuine personal media intelligence layer. I ask it "what should I watch tonight given I want something like X but haven't seen Y" and get a ranked list with a paragraph of reasoning for each choice.
