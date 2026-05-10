---
title: Insight Timer Offline Library
date: 2025-01-01
description: Built a local offline library of meditations and hypnosis tracks from Insight Timer — for travel, dead zones, and getting off the app dependency. Python download pipeline + Obsidian tagging system.
tags: [python, automation, tools, audio, productivity]
status: built
featured: false
listed: false
order: 34
---

## The Problem

Insight Timer has thousands of guided meditations and hypnosis tracks I rely on. The app requires an internet connection for most content, even for tracks I've listened to dozens of times. On planes, in the mountains, or anywhere with spotty signal — nothing.

Also: I hate being dependent on an app for a habit that should be infrastructure.

## What I Built

A Python pipeline that:
1. Identifies my saved/favorite tracks on Insight Timer
2. Downloads audio files to a local directory
3. Tags them with metadata: category (sleep, focus, anxiety, hypnosis), duration, teacher, and personal notes
4. Syncs to my phone via a local folder

The resulting library is organized in Obsidian with a database view that lets me filter by mood, duration, and context (morning routine, travel, deep work prep, sleep).

## The Hypnosis Layer

The more interesting discovery: I started using clinical hypnosis recordings (Michael Sealey, Marisa Peer's Rapid Transformational Therapy sessions) for specific outcomes — sleep, confidence, anxiety management. These are long-form (45–90 min) and need to run reliably without network interruption.

Having them offline meant I could actually commit to consistent use. It's been one of the more quietly impactful personal projects — not flashy, just actually used every day.

## Current Library

- ~60 downloaded tracks
- Organized across 8 categories
- Average listening: 4× per week
- Top use cases: sleep onset, pre-meeting calm, long-haul flights
