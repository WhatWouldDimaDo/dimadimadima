# Suno Embed Options for dimadimadima.com

**Status**: Research-backed recommendation | **Date**: 2026-07-14

---

## Executive Summary

**Suno has no official embed API, oEmbed, or embeddable player.** YouTube is the only reliable path. Enable YouTube embedding (Studio → Settings), use lite-youtube-embed for performance, and layer learnings via YouTube IFrame API polling for custom overlays.

---

## 1. YouTube Embed Strategy

### Best Approach: lite-youtube-embed Web Component
- **What**: Custom web component that loads YouTube thumbnail + play button initially; defers full iframe until click. ~224x faster than direct embed.
- **How**: 
  - Install: `npm install lite-youtube-embed`
  - Import + register in Astro component
  - Replace `<iframe>` with `<lite-youtube videoid="abc123"></lite-youtube>`
- **Privacy**: Use youtube-nocookie.com domain (YouTube Studio: enable "privacy-enhanced mode" when copying embed code)
  - **Caveat**: Still sends IP + stores tracking identifiers in localStorage; just defers cookies until Play
- **Video playlists**: lite-youtube-embed handles single videos only; for playlists, use standard iframe or create bento-grid of individual lite-youtube-embed components

---

## 2. Suno Embeds (Reality Check)

**Official embed support: NONE.** No oEmbed API, no embeddable player, no embed codes.
- **Current option**: Link to Suno track page + display a custom card with Suno link + screenshot
- **Future watch**: Suno sharing page hints at upcoming share features; check help.suno.com periodically
- **Workaround**: If audio-first playback is desired, self-host MP3 via `<audio>` tag + custom player UI (requires export from Suno)

---

## 3. Custom Overlay Layer: "Learnings"

### Recommended Pattern: YouTube IFrame API Polling + Absolute Positioned Cue Cards

**Implementation**:
1. Load YouTube IFrame API in Astro component
2. Poll `player.getCurrentTime()` every 100–200ms
3. Define learnings array: `[{time: 0.5, label: "Genre: Ambient", fadeInMs: 300}, ...]`
4. On time match, fade in absolutely-positioned `<div class="cue-card">` over video
5. Fade out after duration OR on next cue

**Alternative for static layouts**: Side-by-side "Video + Liner Notes" grid
- Left: video (bento cell size); Right: scrollable markdown card with timecoded sections
- More accessible; no disappearing text; fits magazine aesthetic

**CSS**: Use `@keyframes fadeIn/Out` for 300ms transitions; position cue cards with `inset` (top/bottom/left/right) + z-index

---

## 4. Mini Video Embeds (Shorts)

### Best Approach: Native `<video>` Self-Hosted

**Why not YouTube Shorts?** Embed limitations; player bloat.

**HTML5 recipe**:
```html
<video 
  autoplay muted loop playsinline 
  width="300" height="535" 
  class="mini-reel">
  <source src="/videos/track-promo.mp4" type="video/mp4">
</video>
```

**Optimization**:
- Duration: 5–12 seconds max
- Resolution: 720p (4:1 file-size-to-sharpness ratio)
- Remove audio: `ffmpeg -i input.mp4 -c:v copy -an output.mp4`
- Format: MP4 H.264 (widest browser support); optional: WebM (15–20% smaller)
- Autoplay works on desktop + iOS with `muted playsinline` attributes

---

## 5. Recommended V1 (Priority Order)

### Phase 1: Foundation (Week 1)
1. **YouTube IFrame embed (lite-youtube-embed)**
   - Astro component: `<YoutubeEmbed videoid={id} nocookie />`
   - Integrate into bento grid + dedicated `/projects/suno-factory` page
   - Zero learnings layer initially; measure load time

2. **Mini video component**
   - Astro component: `<MiniReel src="/videos/..." alt="..." />`
   - Auto-mute, loop, playsinline; responsive viewport units

### Phase 2: Overlay Learnings (Week 2)
3. **YouTube API polling overlay**
   - Build reusable `<YoutubeWithLearnings learnings={[{time, label, fadeInMs}, ...]} />` component
   - Load IFrame API async; test polling latency; measure frame drops

### Phase 3: Polish (Week 3)
4. **Side-by-side liner notes layout** (alternative for detailed tracks)
   - Grid: video left (60%) | scrollable markdown card right (40%)
   - Timestamp links jump to cue in video (if time-scrub exposed via API)

---

## Critical Files to Create/Update

- `src/components/YoutubeEmbed.astro` — lite-youtube-embed wrapper
- `src/components/MiniReel.astro` — `<video>` component with accessibility
- `src/components/YoutubeWithLearnings.astro` — polling overlay logic
- `public/videos/` — mini video directory
- `/projects/suno-factory/layout.astro` — dedicated showcase page

---

## Notes & Gotchas

- **lite-youtube-embed**: Load CSS from CDN or vendor in `/public/`; no npm CSS auto-inject in static Astro
- **YouTube API**: Requires async script load + global `onYouTubeIframeAPIReady()` callback; test in production (sandboxed preview may have timing issues)
- **Polling overhead**: 100ms intervals safe; 50ms may cause frame drops on lower-end devices
- **Responsive video**: Use container queries or viewport units for min/max width on mini reels
- **Accessibility**: Add `aria-label` to lite-youtube-embed; provide transcript or learnings as fallback text
