---
title: Dewey
date: 2026-07-10
description: Bulk library search for a family of readers. Paste a whole reading list, see what's physically on the shelf at our Atlanta branch, and walk in with the call numbers.
shortDescription: Book recs + live shelf availability at our library branch.
tags: [ai, books, library, api, python, kids]
status: active
featured: true
caseStudy: true
order: 2
image: /images/dewey/dewey-check-list.png
images:
  - /images/dewey/dewey-check-list.png
  - /images/dewey/dewey-get-recs.png
  - /images/dewey/dewey-wishlist.png
  - /images/dewey/dewey-terminal.png
proof:
  - "Used for two library runs so far; a third list in progress"
  - "One Mexico-books pickup took about four minutes, door to shelf"
  - "No formal time-savings measurement — the real change is confidence"
buildTools:
  - name: Claude Code
    detail: Built the whole thing — catalog engine, matching logic, and UI.
  - name: book-scout agent skill
    detail: The reusable skill version — the same availability check, callable from any session.
  - name: Python
    detail: The catalog engine behind the UI.
  - name: BiblioCommons JSON gateway
    detail: The catalog's own undocumented front-end API — live shelf status without auth.
  - name: Markdown taste profiles
    detail: One file per reader, capturing authors, formats, and what's landed before.
---

## The Failed Trip

Bedtime was getting repetitive, and I realized I wasn't frustrated with reading — I was frustrated that I didn't have the right books. Getting recommendations was easy; ChatGPT would hand me a great list any time. The painful part was checking each title against the library one search at a time.

One night I searched for funny bedtime books, found almost nothing available locally, went to the library anyway, and grabbed a book with an award-winning-looking cover. Halfway through bedtime I discovered it was *The Cat Man of Aleppo* — a worthwhile true story set during the Syrian Civil War, and profoundly different from the silly bedtime experience I thought I was bringing home.

That was the trigger. The missing feature wasn't recommendations. It was **bulk search**: paste the whole list, see what's actually on the shelf, and stop gambling at the checkout desk.

<figure class="story-image">
  <img src="/images/dewey/dewey-check-list.png" alt="Dewey's Check a List view showing per-book shelf status and call numbers" />
  <figcaption>Check a List: paste up to 25 titles, get shelf status and call numbers for our branch.</figcaption>
</figure>

## What It Is

Dewey answers two questions every library trip used to leave to chance: *what should we read next*, and *is it actually on the shelf right now*.

It knows the readers in the house — me (cyberpunk, espionage, satirical sci-fi), a 4-year-old with strong opinions about misbehaving pigeons, and a toddler in her board-book era. Ask it for recommendations in plain language ("silly bedtime books for a four year old boy"), or paste in any list of titles, and it checks every one against the Fulton County Library catalog for our home branch — live. The output is a list of books we already know we'll like, each stamped **ON SHELF** or **CHECKED OUT**, with the call number.

- **Check a List** — paste up to 25 titles (or start from a built-in age-based list) and get per-book shelf status, call numbers, and catalog record links for placing holds. Export to CSV or copy for the group chat.
- **Get Recs** — describe what you're in the mood for in a sentence; recommendations come back scored against the family taste profiles, one click from an availability check.
- **Wishlist** — books worth remembering accumulate here; check the whole list against the branch in one shot, or price it out if the library strikes out.

## The Validation

The first real test came before a trip: I checked availability for a list of Mexico books, walked into the branch with call numbers, and went straight to the shelves. The whole pickup took about four minutes. Jesse joked that I looked like I worked at the library.

The honest version of the outcome so far: Dewey has been used for two library runs, with another list in progress. There's no formal time-savings measurement. What's actually changed is that I'm more likely to stop at the library at all — because I know what's there and where to walk.

## The Nerdy Part

The library's catalog runs on BiblioCommons, which has no public API — but its own front end talks to an undocumented JSON gateway that answers without auth. Finding a reliable path through it took some scar tissue:

- The format filter that's supposed to restrict results to books is simply broken on this catalog — it returns zero for everything. Books get filtered client-side instead.
- Title search is fuzzy and quietly "broadens" when it finds nothing, so a miss can come back looking like a hit ("Press Here" cheerfully returned "All the Devils Are Here"). Dewey guards with title-similarity tiers and flags anything uncertain with a **VERIFY MATCH** stamp instead of pretending.
- The precision lever turned out to be the **author, not the ISBN**. Editions share a work-level record, so ISBN search misses real holdings — but a title + author pair rejects wrong matches and confirms borderline ones.

The design principle underneath all three: when the catalog is uncertain, **label the uncertainty instead of hiding it**. A wrong "on shelf" answer costs a trip; a flagged one costs a click.

## Why "Dewey"

He finds things in libraries.
