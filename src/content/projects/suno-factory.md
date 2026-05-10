---
title: Suno Song Factory
date: 2026-01-17
description: End-to-end AI music pipeline — Claude writes lyrics and style guides, Suno generates the tracks, DALL-E makes cover art, FFmpeg builds the video, and a script uploads to YouTube. 75+ custom songs for Dean, Ruby, and friends.
tags: [ai, music, suno, automation, python, claude]
status: active
featured: false
order: 5
---

## What It Is

A turnkey music factory. Give it three keywords — `"dean machine techno"` — and it produces a finished song with lyrics, cover art, metadata, and a YouTube-ready video. 75+ songs and counting, mostly for my kids.

## The Pipeline

### 1. Songwriting (Claude)
A custom Claude skill (`suno-songwriter`) drives the creative process. It doesn't just generate lyrics — it researches reference tracks for BPM, key, section structure, and *hook mechanics* specifically (spelling bridges, call-and-response, mantra loops, stop-time breaks). Then it outputs three blocks:
- **Style description** (~700–850 chars) — genre, tempo, instrumentation, production notes
- **Lyrics** — structured with `[Verse]`/`[Chorus]`/`[Bridge]` tags for Suno
- **Three title options**

The approach is mechanics-first: build around the hook structure, not the vibe.

### 2. Music Generation (Suno API)
The style guide and lyrics hit the Suno API (via `gcui-art/suno-api`). The factory polls for completion and downloads the 320kbps MP3.

### 3. Cover Art (DALL-E 3 / Flux)
A parallel API call generates 9:16 portrait cover art (1080x1920) based on a visual prompt derived from the song's theme.

### 4. Post-Processing (FFmpeg + eyed3)
- Audio normalized to -14 LUFS
- Metadata embedded: title, artist, album, cover art, scrolling lyrics (USLT)
- FFmpeg combines MP3 + cover art into an MP4 video for YouTube

### 5. Upload (YouTube Data API)
A Python script uploads to YouTube with proper metadata, organized into playlists by theme. Max 6 uploads/day (API quota). A manifest prevents duplicate uploads.

## The Catalog

**Family songs**: Classroom anthems for Dean's school, getting-dressed French house bangers, bedtime reggae for Ruby, birthday tracks for friends' kids in styles from Jackson 5 to Uptown Funk.

**Reference studies**: Recreating the mechanics of Ofra Haza's electro-traditional sound, Adriano Celentano's gibberish funk, Daft Punk filter sweeps adapted into "Waffle Time."

**Distribution**: MP3s go to Yoto audio cards for the kids. Videos go to YouTube playlists. The mastered collection lives in a versioned local archive.

## Why It Matters

Dean and Ruby will have a soundtrack for every phase of their childhood, made by their dad, before they're old enough to be embarrassed by it.
