---
title: Tarantino Influence Graph
date: 2025-09-13
description: Predecessor to All Roads to Kill Bill. Python pipeline that fetched metadata for 37 films from TMDB, scraped relationships via Firecrawl, and generated a fully-linked Obsidian vault with YAML frontmatter and WikiLink connections. The foundation that became the live 3D visualization.
tags: [python, tmdb, firecrawl, obsidian, data-pipeline]
status: built
featured: false
listed: false
order: 21
---

## Origin

The question was simple: *what movies did Tarantino actually steal from to make Kill Bill?*

The answer, it turned out, was 37 films — spaghetti westerns, samurai epics, kung fu classics, grindhouse exploitation, anime, blaxploitation. Each one connected to Kill Bill by something specific: a musical cue lifted whole, a shot composition duplicated, a narrative structure lifted directly.

The problem was these connections weren't organized anywhere. They existed scattered across Reddit threads, film blogs, and the tarantino.info wiki. So I built a pipeline to collect, normalize, and visualize them.

## How It Works

**Stage 1: Data Collection**

- Scraped the Kill Bill References Wiki (tarantino.info) via Firecrawl to extract the raw influence list
- Cross-referenced with Reddit's r/movies, r/TrueFilm threads for additional connections
- Validated and normalized film titles against TMDB API

**Stage 2: Metadata Enrichment**

- TMDB API: genres, release year, director, cast, plot synopsis, poster images
- 35/37 films had high-quality poster images (95% success rate)
- Custom YAML schema: `influenced_by`, `influences`, `genre_cloud`, `relationship_type` per connection

**Stage 3: Vault Generation**

- Claude Code wrote the Python script to generate all 37 markdown files
- Each file: YAML frontmatter + embedded poster + WikiLink connections to influenced/influencing films
- WikiLinks bi-directional — navigating from Kill Bill Vol. 1 takes you to Lady Snowblood; navigating from Lady Snowblood shows all films it influenced

**Stage 4: Visualization**

All 37 films live in Obsidian's graph view, color-coded by genre cloud:
- 🟠 Spaghetti Western
- 🔵 Samurai Cinema
- 🟡 Kung Fu / Martial Arts
- 🟣 Anime
- 🔴 Grindhouse

## Why Obsidian

The choice to use Obsidian's native graph view instead of a custom D3/vis.js visualization was deliberate. The WikiLink structure allows exploration that a static graph can't — you click a node, you're *in* the film's note, with its poster and synopsis and all outgoing/incoming connections visible simultaneously.

The experience is qualitatively different from a visualization. It's more like archaeology.

## What It Became

This project was the technical foundation for **All Roads to Kill Bill** — the live 3D force-directed graph that now exists as a deployable web experience. The data pipeline, the YAML schema, and the relationship taxonomy all came from this project first.
