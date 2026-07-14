---
title: ToddlerMaps
date: 2026-07-11
description: Coloring maps of my 4-year-old's real world, AI stickers off the kitchen label printer, and trip strips that answer "are we there yet?" with landmarks and minutes.
shortDescription: Real maps of a toddler's world + AI stickers, printed on a $100 label printer.
tags: [ai, kids, maps, printing, gemini, openstreetmap, python]
status: active
featured: true
order: 3
url: https://dimadimadima.com/toddlermaps
image: /images/toddlermaps/toddlermaps-trip-strip.png
images:
  - /images/toddlermaps/toddlermaps-trip-strip.png
  - /images/toddlermaps/toddlermaps-logo.png
  - /images/toddlermaps/toddlermaps-overview-map.png
  - /images/toddlermaps/toddlermaps-place-sheet-zoo.png
  - /images/toddlermaps/toddlermaps-sticker-fernbank.png
  - /images/toddlermaps/toddlermaps-carkit-zoo.png
---

## What It Is

Paper for a 4-year-old, generated from his actual world:

- **Coloring map sheets** — real OpenStreetMap roads, one dashed route to trace, sticker circles at each end
- **Trip strips** — a drive as landmarks with minutes between them, real road signs included. Dean holds the answer to "are we there yet?"
- **Sticker Studio** — say anything out loud, a colorable sticker prints in ~15 seconds
- **Car kits** — songs, games, and talk topics per destination
- **Calendar labels** — the wall calendar prints its own event stickers

## Why

StickerBox — the $99 kids' AI sticker printer that went semi-viral — is a mono thermal printer, same hardware as the ~$100 Brother label printer already on our kitchen counter. The clone took an afternoon. The rest is what the product doesn't do: Dean's streets, his zoo, the hot dog place on the way.

## Notes

- Thermal printing eats detail. Simpler icons won every time — road-sign pictograms beat cute illustrations
- US road signs (MUTCD) are public domain. That's the real I-85 shield
- Dean cares more about the hot dog place on the way than the aquarium at the end. The milestones are the product

## Stack

Brother QL-810W + open-source `brother_ql` · OpenStreetMap / OSRM for roads and drive times · Gemini image gen for the line art · ~600 lines of Python · vanilla JS site, serverless sticker API on Vercel
