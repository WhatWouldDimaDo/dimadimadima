---
title: AI Distilled & Decoded
date: 2025-09-01
description: Monthly AI intelligence brief distributed to Equifax leadership. Curated 60+ articles per edition, built a Python + Perplexity pipeline to fetch and score content, added ElevenLabs TTS narration. 6 editions produced covering AI in financial services, model governance, agentic commerce.
tags: [ai, newsletter, python, fintech, editorial]
status: active
featured: true
order: 11
---

## Context

By mid-2025, Equifax's leadership team was drowning in AI news but starving for signal. Everyone had seen the ChatGPT announcement. Nobody had a clear view of what mattered for a data-and-decisioning company specifically — model governance, AI in credit risk, synthetic data regulation, agentic systems in financial services.

I built *AI Distilled & Decoded* to solve that.

## What It Was

A monthly intelligence brief — hand-curated and AI-augmented — distributed directly to VP-and-above leadership. Not a link dump. Not a summary bot. A point-of-view document that said: *here's what happened this month, here's what it means for us specifically, here's what you need to know to lead informed conversations.*

**6 editions produced** covering:
- AI in financial services and credit decisioning
- Model governance and EU AI Act implications
- Agentic commerce and autonomous financial workflows
- LLM evaluation frameworks for enterprise deployment
- Synthetic data generation and regulatory posture
- GPT-4o, Claude 3, and Gemini comparative analysis for business use cases

## The Pipeline

<div class="pipeline-flow">
  <div class="pipeline-step">
    <div class="pipeline-num">01</div>
    <div class="pipeline-label">Discover</div>
    <div class="pipeline-desc">60+ articles via Perplexity API, arXiv, Substacks, industry reports</div>
  </div>
  <div class="pipeline-step">
    <div class="pipeline-num">02</div>
    <div class="pipeline-label">Score</div>
    <div class="pipeline-desc">Python ranks by Relevance · Novelty · Signal strength</div>
  </div>
  <div class="pipeline-step">
    <div class="pipeline-num">03</div>
    <div class="pipeline-label">Synthesize</div>
    <div class="pipeline-desc">Claude drafts "so what for us" narrative — not summaries</div>
  </div>
  <div class="pipeline-step">
    <div class="pipeline-num">04</div>
    <div class="pipeline-label">Narrate</div>
    <div class="pipeline-desc">ElevenLabs TTS generates audio edition for commute listening</div>
  </div>
</div>

**Content Discovery**
- 60+ articles reviewed per edition from Substack newsletters, arXiv pre-prints, industry reports, and major tech publications
- Perplexity API for targeted search: `"AI + financial services + [month]"` queries with quality filtering

**Scoring & Selection**
- Python script scores each article on 3 dimensions: Relevance (fintech/credit), Novelty (not already covered), Signal strength (leadership actionability)
- Top 8–12 articles selected for the brief

**Production**
- Claude drafts the narrative analysis — not summaries, but synthesis with explicit "so what for the business" framing
- ElevenLabs TTS generates an audio version for commute listening
- Distributed via email with both PDF and audio attachment

## What I Learned

The hardest problem wasn't content discovery — it was framing. A 300-word explanation of why the EU AI Act matters to a VP who manages 200 people and has 7 minutes to read is a completely different document than a journalist's explainer.

The audio version turned out to be unexpectedly high-engagement. Several leaders mentioned they listened on their morning run. ElevenLabs' quality cleared the bar for professional audio without sounding robotic — which meant the narration got treated as content rather than a gimmick.
