---
title: ATL Event Intelligence
date: 2026-04-21
description: LLM-scored Atlanta event discovery — every show, festival, and family pick ranked against a personal taste profile. S-tier electronic shows get bought immediately. B-tier waits for the right group. Built as a living dashboard, not a static list.
tags: [ai, claude, events, atlanta, data viz, llm]
status: active
featured: true
order: 4
url: https://atl-events.vercel.app
---

## What It Is

A scored event intelligence system for Atlanta, built around a personal taste profile. Every event in the calendar gets a 0–100 score based on genre match, venue quality, format rarity, and how it fits available social slots.

## The Problem

Atlanta has a lot happening — but sifting through Eventbrite, RA, and random group texts to figure out what's actually worth a babysitter, a group text, or a ticket buy is tedious. I wanted a system that does the reasoning, not just the listing.

## How It Works

Each event is scored against a taste profile built from years of concert history and music listening data. The tiers:

- **S-Tier (90+):** Buy immediately. Disclosure at The Eastern, Sub Focus 360° at The Gallery.
- **A-Tier (75–89):** Strong interest — coordinate group, act within 1–2 weeks.
- **B-Tier (60–74):** Situational. Right company makes it worth it.
- **C-Tier:** Pass unless there's a strong social hook.

## The Site

The dashboard shows 13 scored events (Apr–Sep 2026) with:
- Filterable event grid (Music / Family / Date Night / Group / Free)
- Score visualization chart with tier annotations
- Urgency flags for time-sensitive tickets
- Venue rankings by sound quality and capacity
- Evergreen activity guide (Kids / Date Night / Social / Solo)
- May 1 conflict resolution (Disclosure vs. alternatives)

## Stack

- Vanilla HTML/CSS/JS — static, fast, no framework overhead
- Chart.js for score distribution visualization
- Embedded event data as structured JSON
- Deployed on Vercel via GitHub

