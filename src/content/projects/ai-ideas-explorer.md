---
title: 1,160 AI Business Ideas
date: 2026-04-20
description: Dozens of Claude agents ran in parallel to generate and score 1,160 AI business ideas in about 6 hours. Searchable, filterable, deployed.
tags: [ai, claude, automation, multi-agent, business]
status: live
featured: true
order: 4
url: https://ai-ideas-explorer.vercel.app
image: /images/ai-ideas-galaxy.png
---

## The Problem

I had two toddlers, a new VP job, and about six hours to figure out which AI businesses I might actually want to build — given my actual constraints, edges, and available time. How do you think through AI opportunities at scale without getting trapped in hype or execution fantasyland?

## The Experiment

I split the question across dozens of Claude agents running in parallel, each given a single industry vertical and instructions to generate ideas across a spectrum from "obvious and safe" to "weird and ambitious." The run produced 1,160 ideas in about 6 hours.

To be precise about what this is: the ideas were **generated and scored by models** — a structured way to explore a huge space fast. None of them carry external market validation; the scoring is my judgment encoded into a formula, applied consistently at scale.

## What I Actually Learned

The scoring framework went through 4 rounds of recalibration — I kept changing the weights whenever the results felt wrong, which was the actual work. Nine dimensions: Autonomy, Revenue, Market, Speed, Buildability, Defensibility, Execution, Experience, Geography.

The biggest insight: **autonomy matters more than revenue.** When I deprioritized revenue-per-customer (from 20% to 12% of the formula), "boring autonomous" ideas — HVAC seasonal campaigns, internet outage refund bots, permit scrapers — surged past high-revenue plays that needed humans in the loop.

The top-scoring idea was a Property Tax Appeal Automator. It runs on public county data, triggers deterministically, and compounds via a proprietary outcome database. Not sexy. Just correct.

## Live

Explore all 1,160 ideas at [ai-ideas-explorer.vercel.app](https://ai-ideas-explorer.vercel.app).
