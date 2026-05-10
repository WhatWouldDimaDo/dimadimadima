---
title: Voice Intelligence
date: 2026-05-06
description: Linguistic analysis of 1,438 recordings — 222 hours of meetings, coaching sessions, and solo notes. mlx-whisper transcription, LLM-powered speaker attribution, hedge rate tracking, acoustic feature extraction, and a RAG search layer across 1.95 million words.
tags: [python, ai, claude, whisper, chromadb, data, nlp, personal]
status: active
featured: false
listed: false
order: 5
---

## What It Is

A quantified self-communication system. Every SuperWhisper dictation, Just Press Record capture, and Voice Memo gets transcribed locally via mlx-whisper, classified by type (meeting, coaching, solo note, interview), enriched with speaker attribution, and analyzed for linguistic markers — hedge rates, filler words, F0 pitch patterns, speaking pace.

## What It Found

The "like" acceleration was the headline: usage climbed from 3.8 per 1,000 words to 27.9 over 16 months. Solo recordings showed half the hedge rate of meetings (7.5 vs 13.8), and conversations with my executive coach showed a consistent +39.6 Hz pitch elevation — measurable engagement.

## The Stack

- **mlx-whisper** for local transcription (no cloud, no API costs)
- **resemblyzer** for voiceprint enrollment (16 speakers identified)
- **ChromaDB** for semantic search across 8,688 transcript chunks
- **Claude** for classification, speaker attribution, and enrichment
- **Chart.js** for a self-contained 10-panel visualization dashboard

## Scale

| Metric | Value |
|--------|-------|
| Total recordings | 1,438 |
| Audio hours | 222 |
| Word count | 1.95M |
| Speakers enrolled | 16 |
| ChromaDB chunks | 8,688 |
| Date range | Dec 2024 — May 2026 |
