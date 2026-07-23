---
title: Brain Ops
date: 2026-07-15
description: "The agentic operating system behind everything else on this site — and the control problem that makes it real: a process being alive tells you nothing about whether it's working."
shortDescription: "18 automated jobs, one dashboard, and the difference between 'alive' and 'actually processing.'"
tags: [ai, automation, agents, infrastructure, python, obsidian]
status: active
featured: false
caseStudy: true
order: 7
image: /images/brain-ops/dashboard-overview.png
proof:
  - "18 launchd job definitions under supervision"
  - "3 real bugs found and fixed during the July 15 dashboard rebuild"
  - "1 silent failure exposed: a daemon alive but not processing for 4 days"
buildTools:
  - name: Claude Sonnet 5
    detail: Ran the July 15 dashboard rebuild sessions.
  - name: Claude Code + agent skills
    detail: The agents themselves — skills and commands are read dynamically, not hard-coded.
  - name: Python + launchd
    detail: Scheduled jobs and always-on daemons, with local watermarks tracking real progress.
  - name: Ollama embeddings
    detail: Local semantic search over the whole vault — no cloud round-trip.
  - name: Obsidian markdown
    detail: The Brain itself — every job reads from or writes to the vault.
  - name: Google Workspace tooling
    detail: Gmail and Calendar feeds for the morning brief and CRM sweeps.
  - name: Research agents
    detail: Studied Glance, Homepage, Grafana, and Linear before the dashboard design pass.
---

## What It Is

Brain Ops is the local automation and agent infrastructure around my Obsidian-based second brain. It runs scheduled and always-on workflows for the morning briefing, CRM and social maintenance, Atlanta events, weekly reflection, vault search indexing, job-search sweeps, voice ingestion, iMessage capture, and backups — 18 launchd job definitions in total, some cron-style, some live daemons.

Most of the other projects on this site are apps. This one is the thing that keeps the apps, and me, running.

## The Control Problem

Delegating work to agents and daemons has a failure mode nobody warns you about: **the process stays alive while the work silently stops.**

> An agentic system is not reliable because its process is running. It's reliable only when I can tell whether it ran, processed new work, produced the expected output, and needs human attention.

A daemon that's been "up" for four days but hasn't successfully processed a file in four days looks identical to a healthy one — unless you measure the right thing.

<figure class="story-image">
  <img src="/images/brain-ops/dashboard-overview.png" alt="The Brain Ops dashboard grouping automation jobs by purpose with health status" />
  <figcaption>The dashboard: jobs grouped by purpose, healthy detail collapsed, unhealthy groups opened.</figcaption>
</figure>

The dashboard is built around that distinction. It groups jobs by purpose, collapses healthy detail and opens unhealthy groups, tracks both scheduled-job runs and daemon liveness, separates "alive" from "last successful processing," shows the freshness of the outputs that matter, detects duplicate daemon instances, and surfaces system and integration health.

## What the Rebuild Surfaced

The July 15 rebuild wasn't cosmetic — building honest monitoring immediately found real problems:

- **A false stale status** on inbox monitoring: the job was fine, the check was wrong
- **A JSON parser failure** silently breaking the weekly reflection
- **Backup timeouts** caused by copying thousands of `.git` objects nobody needed
- And the one that proves the thesis: **voice ingestion was alive but hadn't processed a file successfully in four days.** Liveness checks said green. The processing watermark said otherwise.

Three were fixed that day. The fourth became its own investigation — which is exactly what the dashboard is for: turning silent failures into visible ones.

## A Deliberate Non-Decision

The rebuild also surfaced that all 18 job definitions depend on fixed local paths. The tidy move would have been relocating the infrastructure for cosmetic consistency. I didn't — a working system's paths are load-bearing, and "clean" isn't a reason to risk two days of silent breakage. Judgment call, documented, revisitable.

## What Remains Fragile

Honest ledger: voice ingestion's underlying reliability issue is still open. Speaker identification via voiceprints proved unreliable enough that I don't trust it without spot-checks. And the deeper design question — what belongs in deterministic automation versus an agent judgment loop — gets re-answered every time a job misbehaves.
