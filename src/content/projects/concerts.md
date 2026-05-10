---
title: Concert History
description: 178 shows over 18 years, reconstructed from Spotify scrobbles, Google Calendar, and Ticketmaster records. Venue analytics, genre breakdowns, concert squad cross-referencing, and the gap between what I listen to most and what I've never seen live.
tags: [music, data, python, visualization]
date: 2026-04-13
url: https://dima-spotify.vercel.app/concerts.html
featured: true
order: 4
image: /images/concert-genre-chart.png
images: [/images/concert-history-hero.png, /images/concert-stats-hero.png]
---

## The Idea

Every concert I've been to since 2007 is somewhere in my digital exhaust — Spotify scrobbles, Google Calendar events, Ticketmaster confirmation emails, a few photos. None of it was organized. I wanted the full picture.

## What It Became

**178 confirmed shows** across 18 years (2007–2025), visualized as an interactive timeline with multiple lenses:

- **The Arc** — Show distribution over time: discovery years, the NYC interlude, the explosion despite becoming a parent (29 shows in both 2023 and 2024)
- **Your Venues** — Terminal West leads with 17 shows. Preference for 800–1,100 cap rooms. The Eastern emerged post-2022
- **Electronic. Always.** — 84–91% of Spotify hours fall under the electronic umbrella every single year
- **The Concert Squad** — Cross-referenced with a 71-person CRM. 7 core music friends identified
- **The Gap** — Heaviest Spotify artists (Camo & Krooked: 62 hrs, Tosca: 52 hrs) never seen live
- **Concert Calendar** — Heatmap showing Feb–May and Sep–Nov peak touring windows

## Live

<div class="live-embed-wrap">
  <div class="live-embed-header">
    <span>↗ Live — dima-spotify.vercel.app</span>
    <button class="live-embed-btn" onclick="this.parentElement.nextElementSibling.style.display='block';this.parentElement.style.display='none'">Launch interactive view</button>
  </div>
  <div style="display:none;">
    <iframe
      src="https://dima-spotify.vercel.app/concerts.html"
      style="width:100%;height:600px;border:1px solid var(--border);border-radius:2px;"
      loading="lazy"
      title="Concert History"
    ></iframe>
  </div>
</div>
