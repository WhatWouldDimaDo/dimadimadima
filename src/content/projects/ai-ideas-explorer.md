---
title: 1,160 AI Business Ideas
date: 2026-04-20
description: One conversation. 40 prompts. 35 AI agents running in parallel. 1,160 ideas generated, scored across 9 dimensions, and deployed as an interactive explorer — in 6 hours.
tags: [ai, claude, multi-agent, data viz, paperclip, vercel, javascript]
status: live
featured: true
order: 0
url: https://ai-ideas-explorer.vercel.app
---

## The Premise

What if you treated business ideation as a data problem?

Start with one idea — an AI agent that detects pool installations from building permits and mails a personalized postcard to the homeowner. That idea contains an entire playbook: public data source, automated pipeline, specific paying customer, delivery mechanism. Everything else is a variant of that pattern.

The question: how many variants exist? Across how many domains?

## What This Is

A systematic, multi-agent ideation experiment run in a single Claude Code session. 24 seed themes. Two scoring frameworks. 1,160 ideas generated, each scored across 9 dimensions by Claude Opus agents running in parallel.

The whole thing ran in approximately 6 hours.

## The Method

### Seed Generation
24 batches of 50 ideas each, seeded across domains: home services, real estate, court filings, neighborhood intelligence, consumer advocacy, commercial SaaS, Atlanta-specific plays, ATL parent use cases, data asymmetry, "oh-shit moment" triggers, and more.

Each batch was written by a fresh Claude Opus agent with the same prompt structure but a different seed theme — producing diverse output without repetition.

### Scoring Framework 1: Autonomy-First
9 dimensions, weighted for solo-founder execution:

| Dimension | Weight |
|---|---|
| Autonomy (runs without human intervention) | 28% |
| Revenue per customer | 12% |
| Market size | 15% |
| Speed to first dollar | 15% |
| Build complexity (inverse) | 13% |
| Defensibility | 4% |
| Execution fit | 5% |
| Ethics | 4% |
| Atlanta geo advantage | 4% |

### Scoring Framework 2: Delight
6 dimensions, weighted for personal motivation:

| Dimension | Weight |
|---|---|
| Fun / Funny | 25% |
| Weird / Surprising | 20% |
| Story / Thought Leadership | 20% |
| Autonomous Output | 15% |
| Learning Value | 10% |
| Life Improvement | 10% |

### The Infrastructure Cluster Insight
The most useful output wasn't the individual scores — it was realizing that many of the highest-scoring ideas share infrastructure. The **Property Data Pipeline** (county assessor + permit scraping) unlocks 13 different products. Build once, deploy many.

## The Finding

The highest-scoring ideas share one pattern: **public data that incumbents don't aggregate**, turned into a service with a clear customer. The AI layer isn't the moat. The data pipeline is.

The compounding advantage comes from connecting multiple trivial public data sources into a single intelligence layer — then automating every step of customer delivery.

**#1 ranked idea:** Property Tax Appeal Automator — 4.63/5.0. Fully automated, Atlanta-specific, $175–700 contingency revenue, builds a proprietary win/loss database with every appeal that makes the next one more accurate.

**Dual-framework winner (scores 4.0+ on BOTH frameworks):** ZoneWatch — automated zoning change alerts for Atlanta's NPU system. High autonomy AND high delight. The rare idea that's worth building AND interesting to talk about.

## What's in the Explorer

- **Galaxy Map** — 500 ideas as a force-directed network, clustered by category, top ideas pulsing
- **Quadrant Chart** — autonomy vs. market size positioning
- **Top 20 Deep Dive** — detailed breakdown of each ranked idea with radar charts and score reasoning
- **Dual-Framework Scatter** — which ideas score high on BOTH frameworks (the gold zone)
- **Infrastructure Map** — 6 data pipelines, each unlocking a cluster of ideas
- **Seed Journey** — how the batches evolved across 24 rounds of generation

## Selected Top Ideas

**Autonomy-First Top 5:**
1. Property Tax Appeal Automator — 4.63
2. Homebrew Recipe + Batch Tracker — 4.40
3. RedditAlerts.pro — 4.38
4. Home Appraisal Appeal Automation (ROV) — 4.36
5. BusinessDeath Alerts — 4.35

**Delight Top 5:**
1. ADHDchrono — 5.00
2. ATL Restaurant Death Clock — 4.85
3. RentalRadar — 4.85
4. RouteKill — 4.75
5. TenantScore — 4.55

## The Meta-Story

The most interesting thing about this project isn't any individual idea. It's that **the entire thing — 1,160 ideas, two frameworks, 30 napkin-math analyses, an interactive site, and a Vercel deployment — happened in a single Claude Code session**.

40 prompts. 35 background agents. 6 hours.

That's the actual demo.
