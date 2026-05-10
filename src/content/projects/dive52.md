---
title: Dive52
date: 2026-04-01
description: A weekly deep-dive learning sprint system — set a topic, drop articles and podcast clips into Discord, react to what resonates, and let Claude synthesize it all into a structured essay that lands directly in your Obsidian vault.
tags: [ai, claude, discord, automation, obsidian, typescript, productivity, multi-agent]
status: active
featured: true
order: 2
url: https://github.com/WhatWouldDimaDo/dive52
image: /images/dive52-discord.png
---

## The Problem

I read 30 articles in a week, flag them, and by Sunday remember approximately none of it. The insight doesn't stick. The throughput is wasted.

The gap: there's no forcing function between *consuming* and *integrating* knowledge. Reading and understanding are not the same thing. I needed a system that made me take a position on what I was learning — and turned that position into something durable.

Not open-ended "learn more about AI" but "this week: AI data center buildout. Go." The time-box matters as much as the synthesis. Constraints work.

## What Dive52 Is

A **52-week learning curriculum machine**. Each week has one topic. Everything you encounter about that topic gets routed through a Discord bot. By Friday, Claude has synthesized your flagged content into a structured essay — stored in Obsidian and pushed to GitHub.

52 dives a year. Every domain that matters.

## The Architecture

### Input Layer
- **Article URLs** dropped directly into Discord — the bot fetches full text, generates a structured card: key ideas, surprising claims, connections to the week's topic
- **Snipd podcast clips** auto-processed from `vault/inbox/snipd/` — the bot transcribes, extracts, and cards them
- **Voice notes** via Whisper — speak a reaction and it gets processed

### Intelligence Layer
- Claude generates each card with a consistent schema: title, source, key ideas, synthesis potential, relevance score
- The watcher (`chokidar`) monitors the vault inbox and triggers card generation on new files
- Cards live in `vault/cards/` with frontmatter: `topic_week`, `reactions`, `flagged`

### Curation Layer
- Discord reactions drive the synthesis:
  - ❤️ = Important (included in synthesis)
  - ⭐ = Definitely synthesize this
  - 🔖 = Read later (resurfaces late week)
  - 👎 = Not relevant (skip)
- `/ask` lets you interrogate your sprint mid-week — Claude answers from your actual cards

### Output Layer
- `/synthesize` gathers all flagged cards + voice reaction notes → Claude generates a 1,200–1,800 word structured essay
- `/publish` commits the essay to `vault/syntheses/` and pushes to GitHub
- The synthesis lands in your Obsidian Notebook vault, ready for linking and review

## Commands

| Command | What it does |
|---|---|
| `/topic name:...` | Set the week's learning focus |
| `/feed [count:5]` | Post next N unread cards to channel |
| `/ask question:...` | Query Claude on this week's content |
| `/synthesize` | Generate the weekly essay |
| `/publish` | Save synthesis to Obsidian + GitHub |
| `/status` | Cards processed, flagged, daily API spend |
| `/pause` / `/resume` | Kill switch for all automation |

## Tech Stack

- **Discord.js** — bot interface and slash commands
- **Claude API (Anthropic)** — card generation, synthesis, conversational Q&A
- **OpenAI Whisper** — voice note transcription
- **chokidar** — file system watcher for inbox automation
- **simple-git** — vault commits and GitHub sync
- **gray-matter** — YAML frontmatter parsing for vault files
- **Fly.io** — always-on deployment (~$3/month)

## Status

512 articles fetched, 215+ cards generated, running on Fly.io (~$3/month). Active and used weekly.
