---
title: HowYaDoin
date: 2026-01-06
description: Chrome extension that helps ADHD brains track energy levels, maintain priority alignment, and break out of hyperfocus spirals — via gentle check-ins from "Future You."
tags: [chrome-extension, adhd, react, tools]
status: built
featured: true
order: 10
---

## The Problem with ADHD Productivity Tools

Every existing ADHD extension is built around *time*, not *energy*. Pomodoro timers. Website blockers. Task managers. All of them assume the problem is discipline — that you just need to be reminded more often or blocked from distractions more aggressively.

That's the wrong model.

**The real problem:** ADHD brains have variable energy output that doesn't map cleanly to a schedule. A 2pm meeting might cost 3x more cognitive load on a Code 3 day than a Code 1 day. You can't plan your day without knowing your current state — and most tracking happens hours after the fact, in evening reviews.

## What HowYaDoin Does

A lightweight Chrome extension that surfaces a 30-second check-in at configurable intervals (default: every 90 minutes):

1. **Energy Level** — 1–5 scale. Not mood. Not stress. Just raw available capacity right now.
2. **Alignment Check** — "Is what you're doing right now what you *planned* to be doing?" Binary.
3. **Spiral Flag** — One tap: "I've been doing this for longer than I intended."
4. **Micro-redirect** — If you flag a spiral, it surfaces your Top 3 from this morning and asks which one you want to return to.

All data syncs to your Obsidian daily note via a local webhook, so weekly reviews have actual energy curves to analyze.

## Why This is Novel

Competitive research across 8 extension categories surfaced zero direct competition. Existing tools:
- Track time, not energy
- Block behavior, don't redirect it
- Require manual activation — no proactive check-ins

The "Future You" framing is intentional: the extension doesn't nag, it prompts curiosity. *"Hey — Future You here. How's it going right now?"* That's a completely different psychological posture than a reminder.

## Architecture

- **React + Manifest V3** — Chrome extension
- **Local storage** — No cloud, no account
- **Obsidian webhook** — Optional integration via local REST plugin
- **Configurable intervals** — 45min, 90min, or custom

## What I Learned

The hardest product decision was the spiral flag mechanic. Early prototypes tried to *detect* spirals automatically (via tab switching frequency, time on social media domains). That felt invasive and got too many false positives.

The final design — a single self-report button — is actually more powerful. The act of *deciding* to flag the spiral is itself a pattern interrupt. You can't flag it without becoming aware of it first.
