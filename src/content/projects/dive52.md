---
title: Dive52
date: 2026-04-01
description: A weekly learning loop that turns articles, podcast clips, and voice reactions into something I can remember, question, and use.
tags: [ai, claude, discord, automation, obsidian, typescript, productivity, multi-agent]
status: active
featured: true
order: 2
image: /images/dive52-discord.png
---

## Why I Built It

I can read 30 articles in a week, flag the interesting ones, and by Sunday remember almost none of them.

The missing step was not more capture. It was a forcing function between consuming an idea and deciding what I think about it.

## The Loop

Each week gets one topic. Articles, podcast clips, and voice notes land in Discord, where I react to the ideas worth keeping. Claude uses those reactions—not just the raw reading list—to create a structured synthesis in my Obsidian vault.

<div class="pipeline-flow">
  <div class="pipeline-step"><div class="pipeline-num">01</div><div class="pipeline-label">Choose</div><div class="pipeline-desc">One question for the week</div></div>
  <div class="pipeline-step"><div class="pipeline-num">02</div><div class="pipeline-label">Collect</div><div class="pipeline-desc">Articles, clips, voice notes</div></div>
  <div class="pipeline-step"><div class="pipeline-num">03</div><div class="pipeline-label">React</div><div class="pipeline-desc">What matters, surprises, or connects</div></div>
  <div class="pipeline-step"><div class="pipeline-num">04</div><div class="pipeline-label">Synthesize</div><div class="pipeline-desc">A durable point of view</div></div>
</div>

The constraint is the product: not “learn more about AI,” but “this week, what is actually happening with AI data-center buildout?”

## What Makes It Useful

- Discord keeps the input and reactions lightweight
- Heart, star, bookmark, and skip reactions tell the system what I actually care about
- `/ask` lets me question the week’s source material while it is still fresh
- `/synthesize` produces the essay; `/publish` saves it to the vault

## Status

The system has fetched 512 articles and generated 215+ structured cards. It runs continuously for about $3 a month. The useful output is not the volume—it is having a point of view I can find again.
