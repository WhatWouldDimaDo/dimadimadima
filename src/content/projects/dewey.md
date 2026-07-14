---
title: Dewey
date: 2026-07-10
description: A library scout for my family. Matches books to taste profiles for me and my two kids, then checks in real time whether they're sitting on the shelf at our Atlanta branch. We walk in with call numbers.
shortDescription: Taste-profile book recs + live shelf availability at our library branch.
tags: [ai, books, library, api, python, kids]
status: active
featured: true
order: 2
image: /images/dewey-terminal.png
---

## What It Is

Dewey answers two questions every library trip used to leave to chance: *what should we read next*, and *is it actually on the shelf right now*.

It keeps a taste profile for each reader in the house — me (cyberpunk, espionage, satirical sci-fi), Dean at 4 (Mo Willems, Julia Donaldson, anything with a misbehaving pigeon), and Ruby at 17 months (board books, Boynton, touch-and-feel). Recommendations get scored against those profiles, then every candidate title is checked live against the Fulton County Library catalog for our home branch. The output is a list of books we already know we'll like, with call numbers. We walk in and go straight to the shelf.

## How It Works

1. **Profiles** — one markdown file per reader capturing authors, formats, and what's landed before.
2. **Recommend** — Claude matches a topic, mood, or kid against the profile and produces candidate titles.
3. **Check the shelf** — a Python script hits the library catalog's JSON API for each title and reports on-shelf status, call number, and collection at our branch. Batch mode takes a whole list at once.
4. **Go get the books** — results include the catalog record link for placing holds on anything checked out.

There's also a photo mode: snap a picture of a shelf — at the library or a thrift store — and the spines get OCR'd and scored against the profiles. A verdict on which ones are worth pulling, before you've read a single flap.

## The Nerdy Part

The library's catalog runs on BiblioCommons, which has no public API — but its own front end talks to an undocumented JSON gateway that answers without auth. Finding a reliable path through it took some scar tissue:

- The format filter that's supposed to restrict results to books is simply broken on this catalog — it returns zero for everything. Books get filtered client-side instead.
- Title search is fuzzy and quietly "broadens" when it finds nothing, so a miss can come back looking like a hit ("Press Here" cheerfully returned "All the Devils Are Here"). Dewey guards with title-similarity tiers and flags anything uncertain.
- The precision lever turned out to be the **author, not the ISBN**. Editions share a work-level record, so ISBN search misses real holdings — but a title + author pair rejects wrong matches and confirms borderline ones.

## Why "Dewey"

He finds things in libraries.
