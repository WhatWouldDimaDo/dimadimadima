---
title: Concert History
description: Every show I've attended since 2007, reconstructed from Spotify history, Google Calendar, and purchase records. Concerts as data. Data as autobiography.
tags: [music, data, python, visualization]
date: 2026-04-13
url: https://dima-spotify.vercel.app/concerts.html
featured: true
order: 9
---

## The Idea

Every concert I've been to since 2007 is somewhere in my digital exhaust — Spotify scrobbles, Google Calendar events, Ticketmaster confirmation emails, a few photos. None of it was organized. I wanted the full picture.

## What It Became

A visual timeline and database of every show, enriched with:
- **Venue** and city
- **Date** (reconstructed from calendar + purchase records where Spotify wasn't enough)
- **Setlist** (from setlist.fm API where available)
- **Listening intensity** — was this an artist I was deep into, or a one-time show?

The result is a personal music autobiography. You can see exactly when certain artists entered my life, which venues I returned to, and how my taste shifted.

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
