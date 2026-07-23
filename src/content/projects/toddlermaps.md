---
title: ToddlerMaps
date: 2026-07-11
description: "Translating the adult mental model of navigation—GPS, miles, and minutes—into a 4-year-old's language: playgrounds, lunch, buses, and cousins."
shortDescription: "A toddler can't follow the moving dot. He can follow the playground, the Peachoid, and lunch."
tags: [ai, kids, maps, printing, gemini, openstreetmap, python]
status: active
featured: true
caseStudy: true
order: 3
url: https://dimadimadima.com/toddlermaps
ctaLabel: Open ToddlerMaps
image: /images/toddlermaps/toddlermaps-trip-strip.png
images:
  - /images/toddlermaps/toddlermaps-trip-strip.png
  - /images/toddlermaps/toddlermaps-logo.png
  - /images/toddlermaps/toddlermaps-overview-map.png
  - /images/toddlermaps/toddlermaps-place-sheet-zoo.png
  - /images/toddlermaps/toddlermaps-sticker-fernbank.png
  - /images/toddlermaps/toddlermaps-carkit-zoo.png
proof:
  - "Observed: Dean recognized a wrong turn home and predicted the next street"
  - "Physically print-tested on thermal hardware"
  - "Not yet measured: whether in-car strips reduce \"Are we there yet?\""
buildTools:
  - name: Claude Fable 5
    detail: The main July 11 build sessions — trip-strip engine, site, and print pipeline.
  - name: Gemini 2.5 Flash Image
    detail: Icon and sticker line art, run through OpenRouter.
  - name: Python + Pillow
    detail: Composes each strip and renders it for the printer.
  - name: OSRM · Overpass · Nominatim
    detail: Routing, drive times, and the landmark data along each route.
  - name: MUTCD road-sign assets
    detail: The real highway signs a kid actually sees out the window.
  - name: Brother QL-810W
    detail: Thermal label printer driving physical output via brother_ql.
  - name: frontend-design agent skill
    detail: Reusable Claude Code skill that shaped the site's UI pass.
---

## The Road Trip

On a drive to North Carolina, Dean kept asking, “Are we there yet?” He wasn't being impatient. He knew where we were going; he just had no way to picture the progress.

I had GPS, a moving dot, miles, and an understanding of time. He had none of those. But he did understand landmarks.

So I designed a printable trip strip that translated the drive into his language:

**Home → playground → lunch → Peachoid → rest area → cousins**

<figure class="story-image">
  <img src="/images/toddlermaps/toddlermaps-trip-strip.png" alt="A printed ToddlerMaps trip strip showing a drive as a sequence of landmark pictograms" />
  <figcaption>A trip strip: the drive as a sequence of events a 4-year-old recognizes, not miles and minutes.</figcaption>
</figure>

Instead of asking a 4-year-old to track 47 miles or 42 minutes, the strip gives him a sequence of recognizable events. Each trip can be generated for today's destination, landmarks, and stops—not a generic children's map.

## The Larger Idea

ToddlerMaps is the umbrella, not a single product. It shares maps, image generation, schedules, and thermal printing across several related experiments:

- **Trip Maps** — road trips and familiar drives told through landmarks
- **Visual Schedules** — everyday sequences a child can see and anticipate
- **Printable Maps** — real local roads simplified for tracing and coloring
- **Sticker Studio** — custom colorable labels generated from a spoken idea
- **Print Lab** — the shared printing workflow behind the other experiences

<figure class="story-image">
  <img src="/images/toddlermaps/toddlermaps-place-sheet-zoo.png" alt="A ToddlerMaps place sheet for the zoo" />
  <figcaption>A place sheet: one destination, told in pictures a child can anticipate.</figcaption>
</figure>

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

## Where the Printer Fits

The hardware entered the story late, and that ordering matters. Seeing StickerBox — a roughly $100 kids' AI sticker printer — triggered the realization that equivalent mono thermal hardware was already sitting on our kitchen counter: the Brother label printer I'd tried and failed to connect months earlier.

<figure class="story-image story-image--contained">
  <img src="/images/toddlermaps/stickerbox-reference.png" alt="The StickerBox AI sticker printer that prompted the kitchen-counter realization" />
  <figcaption>StickerBox: the $100 product that made me look at the printer I already owned.</figcaption>
</figure>

Connecting it unlocked instant, wireless physical output for one specific child and one specific trip. But the printer is infrastructure; the product insight is translating between adult and child mental models.

## What Still Needs Testing

I haven't formally measured whether the maps improve spatial reasoning or reduce “Are we there yet?” questions. I still need to document how many trip strips have actually been printed and used in the car, how Dean interacted with them during a drive, and which landmarks are most useful. For now, the evidence is observed route recognition and prediction—not a causal claim.
