---
title: Dima OS
date: 2026-05-01
description: Personal operating system — 10 launchd jobs, iMessage capture daemon, semantic vault search, social engagement engine, and push-based routine management. An always-on agent architecture that manages daily planning, CRM, email triage, event intelligence, and vault backup without human intervention.
tags: [python, ai, claude, automation, obsidian, personal, infrastructure]
status: active
featured: false
listed: false
order: 1
---

## What It Is

A personal automation layer built on macOS launchd, Obsidian, and Claude Code. It runs 10 scheduled jobs from 2 AM to 11 PM, maintains a semantic search index of 2,780 vault documents, watches iMessage for real-time captures, and pushes social engagement nudges based on a 55-person CRM with cadence targets.

## Architecture

**Morning sequence** (5:00–9:00 AM): Create daily note from template, classify newsletters, generate Gmail digest, surface ATL events for the week, check inbox health.

**Midday** (12:30 PM): Social nudge — surface top 5 overdue contacts matched to upcoming events.

**Evening** (8:00 PM): Review — count completed priorities, flag stale social data, carry unfinished items forward.

**Overnight** (11:07 PM–2:15 AM): Backup vault to external drive, rebuild semantic search index.

**Always-on**: iMessage daemon captures text-to-vault routing via `>>` prefixes — notes, todos, ideas, and agent queries from any conversation.

## Scale

| Component | Count |
|-----------|-------|
| Launchd jobs | 10 |
| Vault documents indexed | 2,780 |
| CRM contacts tracked | 107 |
| SAE cadence contacts | 55 |
| Social groups | 5 |
| Skills installed | 32 |
| Commands available | 7 |
