---
title: ATL Radar
date: 2026-04-21
description: LLM-scored Atlanta event intelligence. 47 curated events and 116 activities ranked by personal taste profile, with wizard filter, interactive map, and mobile-first UX.
tags: [ai, claude, events, atlanta, data viz, llm, maps]
status: active
featured: true
order: 4
url: https://atlradar.vercel.app
---

## What It Is

An LLM-scored Atlanta event intelligence dashboard. 47 curated events and 116 evergreen activities, each scored against a personal taste profile and surfaced through a guided wizard filter, interactive map, and a mobile-first bottom sheet UX.

## How It Works

Every event is scored 0–100 by an LLM using a structured taste profile built from years of concert history and music listening data. The wizard walks you through a few preference questions and immediately re-ranks the entire list. The map view drops pins with score-color coding so you can see what's clustered near you.

## Stack

- Vanilla HTML/CSS/JS — static, zero framework overhead
- LLM scoring pipeline (Claude) for taste-matched ranking
- Leaflet.js interactive map with clustered pins
- Mobile bottom sheet pattern for touch-first browsing
- Deployed on Vercel
