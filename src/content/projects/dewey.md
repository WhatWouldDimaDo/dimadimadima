---
title: Dewey
date: 2026-07-10
description: A library scout for my family. Matches books to taste profiles for me and my two kids, then checks in real time whether they're sitting on the shelf at our Atlanta branch. We walk in with call numbers.
shortDescription: Book recs + live shelf availability at our library branch.
tags: [ai, books, library, api, python, kids]
status: active
featured: true
order: 2
image: /images/dewey/dewey-check-list.png
images:
  - /images/dewey/dewey-check-list.png
  - /images/dewey/dewey-get-recs.png
  - /images/dewey/dewey-wishlist.png
  - /images/dewey/dewey-terminal.png
---

## What It Is

Dewey answers two questions every library trip used to leave to chance: *what should we read next*, and *is it actually on the shelf right now*.

It knows the readers in the house — me (cyberpunk, espionage, satirical sci-fi), a 4-year-old with strong opinions about misbehaving pigeons, and a toddler in her board-book era. Ask it for recommendations in plain language ("silly bedtime books for a four year old boy"), or paste in any list of titles, and it checks every one against the Fulton County Library catalog for our home branch — live. The output is a list of books we already know we'll like, each stamped **ON SHELF** or **CHECKED OUT**, with the call number. We walk in and go straight to the shelf.

## How It Works

- **Check a List** — paste up to 25 titles (or start from a built-in age-based list) and get per-book shelf status, call numbers, and catalog record links for placing holds. Export to CSV or copy for the group chat.
- **Get Recs** — describe what you're in the mood for in a sentence; recommendations come back scored against the family taste profiles, one click from an availability check.
- **Wishlist** — books worth remembering accumulate here; check the whole list against the branch in one shot, or price it out if the library strikes out.

Behind the UI, a Python engine does the catalog work, and taste profiles live as markdown files — one per reader, capturing authors, formats, and what's landed before.

## The Nerdy Part

The library's catalog runs on BiblioCommons, which has no public API — but its own front end talks to an undocumented JSON gateway that answers without auth. Finding a reliable path through it took some scar tissue:

- The format filter that's supposed to restrict results to books is simply broken on this catalog — it returns zero for everything. Books get filtered client-side instead.
- Title search is fuzzy and quietly "broadens" when it finds nothing, so a miss can come back looking like a hit ("Press Here" cheerfully returned "All the Devils Are Here"). Dewey guards with title-similarity tiers and flags anything uncertain with a **VERIFY MATCH** stamp instead of pretending.
- The precision lever turned out to be the **author, not the ISBN**. Editions share a work-level record, so ISBN search misses real holdings — but a title + author pair rejects wrong matches and confirms borderline ones.

## Why "Dewey"

He finds things in libraries.
