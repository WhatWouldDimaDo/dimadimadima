---
title: All Roads to Kill Bill
description: An interactive 3D influence network mapping every film that fed into Kill Bill — and every film it spawned. 200+ nodes, live force simulation. Built with React, Three.js, and TMDB.
tags: [data viz, cinema, react, three.js]
date: 2025-12-20
url: https://allroadstokillbill.vercel.app
image: /images/kill-bill.jpg
featured: true
order: 3
---

## What It Is

A live, interactive 3D force-directed graph of Tarantino's cinematic DNA. Every film that influenced Kill Bill is a node. Every film Kill Bill influenced is a node. The edges between them are labeled with the *specific* thing borrowed — a shot, a score cue, a narrative structure, a character archetype.

Drag nodes. Spin the graph. Click a film to see its poster, its genre cloud, and its full connection list.

## Explore It

<div class="live-embed-wrap">
  <div class="live-embed-header">
    <span>↗ Live — allroadstokillbill.vercel.app</span>
    <button class="live-embed-btn" onclick="this.parentElement.nextElementSibling.style.display='block';this.parentElement.style.display='none'">Launch 3D graph</button>
  </div>
  <div style="display:none;">
    <iframe
      src="https://allroadstokillbill.vercel.app"
      style="width:100%;height:620px;border:1px solid var(--border);border-radius:2px;"
      loading="lazy"
      title="All Roads to Kill Bill"
      allow="fullscreen"
    ></iframe>
  </div>
</div>

## How It Was Built

The data pipeline started as the [Tarantino Influence Graph](/projects/tarantino-graph) — a Python scraper that pulled 37 films from TMDB, extracted relationships via Firecrawl, and built a fully-linked Obsidian vault.

The visualization layer is React + Three.js using a 3D force simulation. Each node is positioned by the physics engine; genre clusters naturally emerge from the graph structure. The film poster images are loaded directly from TMDB's CDN.

## The Obsession Layer

Kill Bill samples more aggressively and more specifically than almost any other film. It's not just "influenced by" — it's shot-for-shot homage, score lifted wholesale, character types duplicated. The graph makes that visible in a way a Wikipedia list never could.
