---
title: AI-Assisted Car Purchase
date: 2026-02-01
description: Used CarEdge, AI negotiation research, and a custom monitoring script to buy a new car — documented the entire process as a repeatable AI-assisted research and negotiation playbook.
tags: [ai, research, automation, tools]
status: built
featured: false
listed: false
order: 30
---

## The Problem

Buying a car is designed to disadvantage you. Dealer inventory is opaque, pricing is theatrical, and the negotiation process rewards people who've done it dozens of times over first-time buyers. The information asymmetry is the whole business model.

I decided to close the gap with AI.

## The Approach

**Phase 1: Market Research**
- Used **CarEdge** (caредge.com) to pull real dealer inventory data, market-value pricing, and days-on-lot statistics for target vehicles in a 200-mile radius
- Fed that data into Claude to identify specific VINs where price-to-market-value spread suggested negotiating room
- Built a monitoring script that scraped CarEdge daily and alerted when target vehicles appeared or prices dropped

**Phase 2: Negotiation Prep**
- Claude synthesized a negotiation playbook based on the specific vehicle, dealer history, and market conditions
- Prepared counter-offer sequences, out-the-door price calculations (including all dealer fees), and objection responses
- Identified 3 comparable vehicles at competing dealers to use as leverage

**Phase 3: The Purchase**
- Entered negotiations with printed CarEdge market data and specific VIN comparisons
- Used the playbook sequence: start with the out-the-door number, not the monthly payment
- Closed $3,200 below sticker without a trade-in

## What Made It Work

The CarEdge "days on lot" metric was the secret weapon. A vehicle that's been sitting for 60+ days costs the dealer ~$1,200/month in floor plan financing. That's real leverage. Knowing a specific VIN had been there 73 days changed the entire dynamic of the conversation.

The monitoring script meant I wasn't relying on memory or manual checking — I was notified the day a target vehicle hit 60 days on lot.

## The Playbook

The full process is documented in a reusable template:
1. Define target vehicle specs + acceptable color/option combinations
2. Pull CarEdge market data for zip codes within radius
3. Build VIN shortlist sorted by days-on-lot descending
4. Research dealer history and incentive timing (end of month/quarter)
5. Generate negotiation script with specific numbers and fallback positions
6. Execute with printed data in hand

Total research time: 6 hours spread over 2 weeks. Outcome: $3,200 saved vs. asking price.
