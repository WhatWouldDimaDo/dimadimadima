---
title: Fjord Sauna Booking Bot
date: 2025-11-01
description: Built a script to poll the Momence API for sauna availability and fire a Discord webhook the moment a slot opened. Booked immediately. Showed up 3 hours late because the platform had no timezone info. Claude wrote the refund request.
tags: [python, automation, discord, api, tools]
status: built
featured: true
order: 6
image: /images/fjord-imessage.png
images: [/images/fjord-discord.png, /images/fjord-booking.png, /images/fjord-iMessage-booked.png]
---

## The Problem

Fjord is a Nordic spa and sauna in Atlanta that's perpetually sold out. Sessions release sporadically — sometimes days in advance, sometimes 20 minutes before. By the time you find out, they're gone. I'd been trying to book for months.

## The Solution

Momence is the booking platform Fjord uses. It has a REST API. I wrote a Python script that:

1. Polls the Momence API every 5 minutes for Fjord session availability
2. When a slot opens, fires a Discord webhook to a private channel
3. Message includes the date, time, spots available, and a direct booking link

Took about 2 hours to build. Ran it on my laptop, then set it up as a cron job.

## It Worked Immediately

Within 48 hours of running the script, a slot opened. Discord pinged me. I booked it — for me and two friends — before it sold out again. Felt like a genuine technical victory.

## The Timezone Bug

The Momence API returns times without timezone information. The session was listed as `10:00 AM`. I assumed Atlanta (ET). It was UTC.

I showed up at 10:00 AM Eastern with two friends. The session had started at 7:00 AM. It was over. The staff was confused. We were confused. Everyone was disappointed.

## Claude Writes the Refund Request

The situation was genuinely ambiguous — the platform gave no timezone context, which is a legitimate product failure. But "I built a bot to scrape your API and it had a timezone bug" is not the standard refund narrative.

I had Claude write the refund request. Framing: a customer who relied on the platform's time display in good faith, arrived to a session that had already concluded due to a display ambiguity, and is requesting either a refund or rebooking. Professional, specific, not accusatory.

Fjord honored it. Full refund, no pushback.

## What I'd Do Differently

Add timezone normalization to the API response. Momence's API should return ISO 8601 timestamps with timezone offsets — it doesn't. A one-line fix (`datetime.fromisoformat(time_str).astimezone(ZoneInfo('America/New_York'))`) would have prevented the entire situation.

Also: always sanity-check "what timezone does this API use" before booking anything with friends.

## Status

Bot still runs. I've since booked two successful sessions. The Discord notification is now the first way I find out about availability — faster than any human who checks the app manually.
