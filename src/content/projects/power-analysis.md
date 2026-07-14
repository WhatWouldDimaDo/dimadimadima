---
title: Georgia Power Analysis
date: 2026-07-13
description: Pulled 13 months of Georgia Power bills and 10,487 hourly usage readings to find out what actually drives our electric bill. The answer wasn't the peak-hour window everyone optimizes for — it was Saturday evenings.
shortDescription: 13 months of power bills decoded — the demand charge hides off-peak.
tags: [ai, data, energy, home, python]
status: active
featured: false
order: 6
url: https://dimadimadima.com/power
image: /images/power-dashboard.png
---

## What It Is

I pulled 13 months of Georgia Power bills and 10,487 hourly kWh and temperature readings for our house and built an interactive dashboard to answer one question: what actually drives the bill?

We're on the Smart Usage rate plan, which most people read as "avoid 2–7pm on summer weekdays." That's the on-peak energy window, and it's real, but it turned out to be the smaller half of the story.

## What I Found

Smart Usage has a second component: a demand charge, set by the single worst one-hour draw of the month — any hour, any day. Not just the 2–7pm window. Which means pre-cooling the house before 2pm saves on-peak energy costs but does nothing for demand if the worst load lands on a Saturday evening.

And it does. 19 of our top 20 highest single-hour reads were off-peak, mostly evenings and weekends. The June 2026 demand charge was set on a Saturday at 6pm at 92°F. The culprit is almost always the same combination: the HVAC compressor and the dryer running in the same hour on a hot day.

Over 13 billing periods, 90 hours exceeded 4 kW — and only 7 of those were on-peak. Weekends alone accounted for 59% of them.

## What Changed

The analysis produced a concrete Skyport schedule for our Daikin system: pre-cool to 70°F before the 2pm on-peak window, set back to 77°F during it, and let thermal mass carry the house. Weekends get pre-cooling too on any day forecast above 85°F. And the one rule that matters most costs nothing: never run the dryer while the HVAC is actively cooling.

## The Dashboard

The full interactive dashboard — monthly trends, hourly patterns, demand drivers, and the HVAC schedule — is live at [dimadimadima.com/power](https://dimadimadima.com/power).
