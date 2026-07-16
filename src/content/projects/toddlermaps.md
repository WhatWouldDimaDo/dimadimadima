---
title: ToddlerMaps
date: 2026-07-11
description: "Translating the adult mental model of navigation—GPS, miles, and minutes—into a 4-year-old's language: playgrounds, lunch, buses, and cousins."
shortDescription: "A toddler can't follow the moving dot. He can follow the playground, the Peachoid, and lunch."
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

## The Road Trip

On a drive to North Carolina, Dean kept asking, “Are we there yet?” He wasn't being impatient. He knew where we were going; he just had no way to picture the progress.

I had GPS, a moving dot, miles, and an understanding of time. He had none of those. But he did understand landmarks.

So I designed a printable trip strip that translated the drive into his language:

**Home → playground → lunch → Peachoid → rest area → cousins**

Instead of asking a 4-year-old to track 47 miles or 42 minutes, the strip gives him a sequence of recognizable events. Each trip can be generated for today's destination, landmarks, and stops—not a generic children's map.

## The Larger Idea

ToddlerMaps is the umbrella, not a single product. It shares maps, image generation, schedules, and thermal printing across several related experiments:

- **Trip Maps** — road trips and familiar drives told through landmarks
- **Visual Schedules** — everyday sequences a child can see and anticipate
- **Printable Maps** — real local roads simplified for tracing and coloring
- **Sticker Studio** — custom colorable labels generated from a spoken idea
- **Print Lab** — the shared printing workflow behind the other experiences

This page spotlights Trip Maps. The other experiences deserve their own stories as they develop.

## Building an Internal Map

The idea expanded beyond long drives. I narrate ordinary routes in terms Dean can hold onto: “We're turning onto Lenox Road,” “This is the curvy road,” and “That's where the school buses sleep.”

The goal isn't to teach turn-by-turn navigation. It's to help him construct an internal map of his world.

There are early signs that may be happening. On one drive, he noticed, “This isn't the way to our house.” On another, he predicted, “Next is Morningside Place.” Those are observations, not a measured result, but they're more meaningful than counting generated maps.

## What I Learned

- The trigger was a child's missing mental model—not AI, maps, or the printer
- Adults think in time, distance, GPS, and addresses; young children think in landmarks and events
- Thermal printing eats detail, so simple pictograms and real road signs work better than intricate illustrations
- The most important stop may not be the destination. A familiar lunch spot can mean more than the aquarium at the end

## What Still Needs Testing

I haven't formally measured whether the maps improve spatial reasoning or reduce “Are we there yet?” questions. I still need to document how many trip strips have actually been printed and used, how Dean interacted with them during a drive, and which landmarks are most useful. For now, the evidence is observed route recognition and prediction—not a causal claim.

## Where the Printer Fits

The hardware made the idea immediate. StickerBox, a $99 kids' AI sticker printer, uses the same kind of mono thermal printing as the Brother label printer already on our kitchen counter. Connecting the hardware unlocked an instant, wireless output for one specific child and one specific trip. But the printer is infrastructure; the product insight is translating between adult and child mental models.

## Stack

Brother QL-810W + open-source `brother_ql` · OpenStreetMap / OSRM for roads and drive times · Gemini image gen for the line art · ~600 lines of Python · vanilla JS site, serverless sticker API on Vercel
