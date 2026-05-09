---
title: Friend Relationship System v2.0
date: 2025-11-14
description: Multi-platform data engineering pipeline that ingests exported data from 6 communication platforms, deduplicates across sources, scores relationship strength via interaction frequency and recency, and generates a tiered priority dashboard. 4,000+ contacts processed.
tags: [python, data-engineering, facebook, imessage, pipeline, personal]
status: built
featured: true
order: 10
---

## The Problem

I had 170+ meaningful relationships scattered across 8 platforms with zero unified view. Who was I actually talking to? Who had I drifted from? Who needed a call?

## The Solution

A Python orchestration pipeline that ingests raw exports from every major platform, deduplicates contacts across sources, scores relationship strength, and outputs a structured tiered database.

## Data Sources (v2.0)

| Source | Records |
|--------|---------|
| Facebook Messenger | 1,763 conversations |
| iMessage | 2,474 contacts |
| Instagram DMs | 95 conversations |
| Gmail | Threading analysis |
| Google Calendar | Event co-attendance |
| LinkedIn | Connection graph |

## Output

- **170+ friends discovered** across all sources
- **Three tiers:** Tier 1 Active (48), Tier 2 Maintain (62), Tier 3 Loose Ties (60)
- **Priority dashboard** — sortable CSV with last contact, message volume, platform mix
- **Auto-tiering** — scoring model weights recency, frequency, and bidirectionality

## What I Found

Running this on myself revealed patterns I couldn't see manually:
- Top 5 relationships = 36% of all message volume
- 4 close contacts went completely silent mid-2025 simultaneously ("late summer dropout")
- My communication style splits cleanly into text-primary and call-primary clusters
