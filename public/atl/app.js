/* ============================================================
   On Dima's Radar — app.js
   Wizard · Agenda Calendar · Events Grid + Drawers · Map · Evergreen
============================================================ */

const SITE_TODAY = new Date();
// Local midnight of "today" — the baseline every "is this event upcoming"
// check should compare against, not SITE_TODAY (which carries a time-of-day
// and is always later than local midnight, so comparing against it makes
// today's own events look already-past for the entire day).
const TODAY_MID = new Date(SITE_TODAY.getFullYear(), SITE_TODAY.getMonth(), SITE_TODAY.getDate());

// 'YYYY-MM-DD' strings parse as UTC midnight via `new Date(str)` — during
// EDT (UTC-4) that's 4 hours behind local midnight, so an event dated
// "today" (or, after ~8pm local, "tomorrow") compares as already in the
// past against any locally-constructed "now"/"today" Date. Parsing the
// components directly builds a LOCAL-midnight Date instead, matching
// TODAY_MID's construction so the two are actually comparable.
function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Inverse of parseLocalDate — formats a Date's LOCAL Y/M/D as 'YYYY-MM-DD'.
// `Date#toISOString()` converts to UTC first, which can shift the printed
// date by a day for the same reason parseLocalDate exists.
function toLocalISODate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// View routing owns scroll position on load (each view acts like its own
// page) — disable the browser's automatic scroll restoration so a reload
// doesn't land deep-scrolled on whatever the last view happened to be.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// ─── MODE DETECTION ───────────────────────────────────────────────────────
const INTERNAL = new URLSearchParams(location.search).get('mode') === 'internal';
if (INTERNAL) document.documentElement.classList.add('internal');

// ─── THEME (Golden Hour light default / original purple as dark mode) ─────
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0c0c14' : '#FBF2E3');
}
applyTheme(localStorage.getItem('atlradar_theme') === 'dark' ? 'dark' : 'light');

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('atlradar_theme', next);
  });
}

// ─── VIEW ROUTING (Tonight / Browse / People) ──────────────────────────────
// NOTE: "view" here is unrelated to the ?mode=internal query param above —
// views are the top-level tabs (Tonight/Browse/People); INTERNAL is the
// separate public/internal content gate. Kept as distinct concepts on purpose.
// Plan/Wizard used to be a fourth view here — merged into Browse's Filter &
// sort panel (see the `wizard` filter state below) so there's one filtering
// mental model instead of two coexisting ones.
const VALID_VIEWS = ['tonight', 'browse', 'people'];
let currentView = 'tonight';

const VIEW_LABELS = { tonight: 'Highlights', browse: 'Browse', people: 'People' };

function setView(view, opts = {}) {
  if (!VALID_VIEWS.includes(view)) view = 'tonight';
  if (view === 'people' && !INTERNAL) view = 'tonight';
  currentView = view;
  document.documentElement.setAttribute('data-view', view);
  document.querySelectorAll('.view-tab').forEach(a => a.classList.toggle('active', a.dataset.view === view));
  const label = document.getElementById('nav-current-label');
  if (label) label.textContent = VIEW_LABELS[view] || '';
  if (!opts.skipScroll) window.scrollTo({ top: 0, behavior: 'auto' });
  if (view === 'browse' && atlMap) setTimeout(() => atlMap.invalidateSize(), 80);
  if (!opts.skipHash) {
    history.replaceState(null, '', view === 'tonight' ? location.pathname + location.search : `${location.pathname}${location.search}#${view}`);
  }
}

function closeNavMenu() {
  document.getElementById('nav-menu-panel')?.classList.remove('open');
  document.getElementById('nav-hamburger-btn')?.classList.remove('open');
  document.getElementById('nav-hamburger-btn')?.setAttribute('aria-expanded', 'false');
}

function initViewRouting() {
  document.querySelectorAll('.view-tab').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      setView(a.dataset.view);
      closeNavMenu();
    });
  });

  // Anchor items (Evergreen, Map) live inside Browse — switch there first,
  // then scroll to the section. Map is collapsed by default, so expand it too.
  document.querySelectorAll('.nav-menu-anchor').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      setView('browse', { skipScroll: true });
      closeNavMenu();
      const target = document.getElementById(a.dataset.anchor);
      if (a.dataset.anchor === 'map-section') {
        const mapPanel = document.getElementById('map-panel');
        if (mapPanel && !mapPanel.classList.contains('open')) document.getElementById('map-disclosure-toggle')?.click();
      }
      setTimeout(() => target?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    });
  });

  const hamburgerBtn = document.getElementById('nav-hamburger-btn');
  const menuPanel = document.getElementById('nav-menu-panel');
  if (hamburgerBtn && menuPanel) {
    hamburgerBtn.addEventListener('click', e => {
      e.stopPropagation();
      const open = menuPanel.classList.toggle('open');
      hamburgerBtn.classList.toggle('open', open);
      hamburgerBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => {
      if (!menuPanel.contains(e.target) && !hamburgerBtn.contains(e.target)) closeNavMenu();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNavMenu(); });
  }

  window.scrollTo(0, 0);
  const initial = (location.hash || '').replace('#', '');
  setView(VALID_VIEWS.includes(initial) ? initial : 'tonight', { skipScroll: true, skipHash: true });
}

// ─── TONIGHT — zero-input pick ──────────────────────────────────────────────
function pickTonightCandidates() {
  const upcoming = EVENTS.filter(ev => parseLocalDate(ev.date) >= TODAY_MID);
  const dow = SITE_TODAY.getDay(); // 0 Sun .. 6 Sat
  let windowDays = 3;
  if (dow === 4 || dow === 5) windowDays = 5;      // Thu/Fri — look through the weekend
  else if (dow === 6 || dow === 0) windowDays = 2; // Sat/Sun — today/tomorrow only

  const windowEnd = new Date(TODAY_MID.getTime() + windowDays * 86400000);
  let pool = upcoming.filter(ev => parseLocalDate(ev.date) <= windowEnd);
  if (pool.length < 3) {
    const wideEnd = new Date(TODAY_MID.getTime() + 14 * 86400000);
    pool = upcoming.filter(ev => parseLocalDate(ev.date) <= wideEnd);
  }
  if (!pool.length) pool = upcoming.slice(0, 10);
  pool.sort((a, b) => b.score - a.score || parseLocalDate(a.date) - parseLocalDate(b.date));
  return pool.slice(0, 3);
}

function renderTonight() {
  const wrap = document.getElementById('tonight-pick-wrap');
  const altWrap = document.getElementById('tonight-alternates-wrap');
  const dateLbl = document.getElementById('tonight-date-label');
  if (!wrap) return;

  const dow = SITE_TODAY.getDay();
  // Match pickTonightCandidates' windowDays logic: Thu/Fri look through the
  // weekend, so the label needs to say that instead of "Today" — the earlier
  // version only flipped on Fri/Sat/Sun, leaving Thursday's weekend-inclusive
  // picks mislabeled as happening "Today".
  if (dateLbl) dateLbl.textContent = (dow === 4 || dow === 5 || dow === 6 || dow === 0) ? 'This Weekend' : 'Today';

  const picks = pickTonightCandidates();
  if (!picks.length) {
    wrap.innerHTML = `<div class="tonight-empty">Nothing scored yet for the next couple weeks — check <a href="#" class="view-tab" data-view="browse">Browse</a> for everything on the calendar.</div>`;
    if (altWrap) altWrap.innerHTML = '';
    return;
  }

  const [hero, ...alts] = picks;
  // Hero is above-the-fold and visible immediately on load — lazy-loading it
  // (as the row thumbnails correctly do) just delays the fetch and stretches
  // out the placeholder flash. Fetch eagerly, fade in once it lands.
  const heroImg = hero.imageUrl
    ? `<img src="${hero.imageUrl}" alt="" onload="this.classList.add('loaded')" onerror="iconFallback(this, '${eventIconKey(hero)}', 40, 'tonight-hero-fallback')">`
    : hero.youtubeId
    ? `<img src="https://img.youtube.com/vi/${hero.youtubeId}/mqdefault.jpg" alt="" onload="this.classList.add('loaded')">`
    : `<div class="tonight-hero-fallback">${catGlyphHTML(hero, 40)}</div>`;
  const buyBtn = hero.ticketUrl
    ? `<a href="${hero.ticketUrl}" target="_blank" rel="noopener" class="btn-sm btn-buy" onclick="event.stopPropagation()">${ticketLinkLabel(hero.ticketUrl)}</a>`
    : '';

  wrap.innerHTML = `
    <div class="tonight-hero-card">
      <div class="tonight-hero-img cat-${hero.category}">${heroImg}</div>
      <div class="tonight-hero-body">
        <div class="tonight-hero-badge-row">
          <span class="er-cat-icon cat-${hero.category}" title="${CAT_LABEL[eventIconKey(hero)] || eventIconKey(hero)}">${catGlyphHTML(hero, 15)}</span>
          <span class="tier-badge ${hero.tier}">${hero.tier}</span>
          <span class="tonight-hero-score">${hero.score}</span>
          <span class="ev-date">${hero.dateStr}${hero.time ? ' · ' + hero.time : ''}</span>
        </div>
        <h2 class="tonight-hero-title">${hero.title}</h2>
        <div class="tonight-hero-venue">📍 ${hero.venue}${driveMinutes(hero) ? ` · 🚗 ~${driveMinutes(hero)} min` : ''}</div>
        <p class="tonight-hero-note">${hero.note}</p>
        <div class="tonight-hero-actions">
          ${buyBtn}
          <button class="btn-sm btn-details" onclick="openBottomSheet(${hero.id})">Full Details →</button>
        </div>
      </div>
    </div>`;

  if (altWrap) {
    // Renamed from "Or, also worth it:" — that phrasing read fine right after
    // the hero, but once This Week / Next Week (and the evergreen strip)
    // render further down the same scroll, "also worth it" stopped reading as
    // scoped to just these 1-2 rows. "Right now" ties it explicitly to the
    // same today/this-weekend window as the hero above it, so it can't be
    // misread as continuing into the broader week-by-week lists below.
    altWrap.innerHTML = alts.length ? `
      <div class="tonight-alt-label">Also worth it right now</div>
      <div class="tonight-alt-list">
        ${alts.map(tonightAltRowHTML).join('')}
      </div>` : '';
  }

  renderMyList();
  renderTonightEvergreen();
  renderTonightWeeks(new Set(picks.map(ev => ev.id)));
}

// ─── MY LIST — events you've marked Going (rsvp 'in') or Interested (rsvp
// 'maybe'), surfaced at the top of Highlights. Upcoming only, Going first.
// Reuses the RSVP localStorage signals so there's one source of truth, not a
// parallel state. Re-rendered live by setRSVP() when you mark/unmark. ───────
function myListRowHTML(ev, state) {
  const iconKey = eventIconKey(ev);
  const thumbInner = ev.imageUrl
    ? `<img src="${ev.imageUrl}" alt="" loading="lazy" onerror="iconFallback(this, '${iconKey}', 22)">`
    : ev.youtubeId
    ? `<img src="https://img.youtube.com/vi/${ev.youtubeId}/mqdefault.jpg" alt="" loading="lazy" onerror="this.style.display='none'">`
    : catGlyphHTML(ev, 22);
  const pill = state === 'in'
    ? `<span class="mylist-pill mylist-pill-going">✓ Going</span>`
    : `<span class="mylist-pill mylist-pill-interested">★ Interested</span>`;
  return `
    <div class="tonight-alt-row" onclick="openBottomSheet(${ev.id})">
      <span class="er-cat-icon cat-${ev.category}" title="${CAT_LABEL[iconKey] || iconKey}">${catGlyphHTML(ev, 15)}</span>
      <div class="tonight-alt-thumb er-thumb cat-${ev.category}">${thumbInner}</div>
      <div class="er-main">
        <div class="er-title">${ev.title}</div>
        <div class="er-meta-date">${ev.dateStr}${ev.time ? ' · '+ev.time : ''}</div>
        <div class="er-meta-venue">📍 ${ev.venue}</div>
      </div>
      <div class="er-right">
        ${pill}
        <span class="er-score tier-${ev.tier}">${ev.score}</span>
      </div>
    </div>`;
}

function renderMyList() {
  const wrap = document.getElementById('tonight-mylist-wrap');
  if (!wrap) return;
  if (!INTERNAL) { wrap.innerHTML = ''; return; }
  const upcoming = ev => parseLocalDate(ev.date) >= TODAY_MID;
  const going = EVENTS.filter(e => getRSVP(e.id) === 'in' && upcoming(e))
    .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
  const interested = EVENTS.filter(e => getRSVP(e.id) === 'maybe' && upcoming(e))
    .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
  if (!going.length && !interested.length) { wrap.innerHTML = ''; return; }

  const counts = [];
  if (going.length) counts.push(`${going.length} going`);
  if (interested.length) counts.push(`${interested.length} interested`);
  wrap.innerHTML = `
    <div class="mylist-section">
      <div class="tonight-alt-label mylist-label">★ On your list <span class="mylist-count">${counts.join(' · ')}</span></div>
      <div class="tonight-alt-list">
        ${going.map(e => myListRowHTML(e, 'in')).join('')}
        ${interested.map(e => myListRowHTML(e, 'maybe')).join('')}
      </div>
    </div>`;
}

// ─── SHARED ROW TEMPLATE — compact event row used by the alternates list and
// the This Week / Next Week groups below it. Restructured to match Browse's
// collapsed card layout (er-collapsed): leftmost category icon → thumbnail →
// stacked title/date/venue → right-side badges — reuses the exact same
// .er-cat-icon/.er-thumb/.er-main/.er-title/.er-meta-date/.er-meta-venue/
// .er-right classes Browse uses, so Highlights and Browse read as the same
// visual system instead of two different row formats. Thumbnail still mirrors
// the Browse grid's fallback chain (image → YouTube → category glyph, with
// the dinosaur-emoji override via catGlyphHTML). ──────────────────────────
function tonightAltRowHTML(ev) {
  const iconKey = eventIconKey(ev);
  const thumbInner = ev.imageUrl
    ? `<img src="${ev.imageUrl}" alt="" loading="lazy" onerror="iconFallback(this, '${iconKey}', 22)">`
    : ev.youtubeId
    ? `<img src="https://img.youtube.com/vi/${ev.youtubeId}/mqdefault.jpg" alt="" loading="lazy" onerror="this.style.display='none'">`
    : catGlyphHTML(ev, 22);

  return `
    <div class="tonight-alt-row" onclick="openBottomSheet(${ev.id})">
      <span class="er-cat-icon cat-${ev.category}" title="${CAT_LABEL[iconKey] || iconKey}">${catGlyphHTML(ev, 15)}</span>
      <div class="tonight-alt-thumb er-thumb cat-${ev.category}">${thumbInner}</div>
      <div class="er-main">
        <div class="er-title">${ev.title}</div>
        <div class="er-meta-date">${ev.dateStr}${ev.time ? ' · '+ev.time : ''}</div>
        <div class="er-meta-venue">📍 ${ev.venue}</div>
      </div>
      <div class="er-right">
        ${newBadge(ev)}
        <span class="er-score tier-${ev.tier}">${ev.score}</span>
      </div>
    </div>`;
}

// ─── FRONT PAGE — this week + next week (front page was too sparse: pick
// + 2 alternates only). Groups everything else into two date buckets. ───
// Capped and score-ranked (not dumped in full) — Highlights is meant to be a
// curated skim, not a second Browse grid. Browse already exists for "show me
// everything." 5 keeps each bucket roughly a screenful on mobile without
// requiring scroll-fatigue through a dozen+ mid-tier events; matches the
// alternates list's own scale (2-3 rows) so the whole page stays "a few
// picks," not "an exhaustive listing."
const WEEK_SECTION_LIMIT = 5;

// Flat score bonus for events at a venue Dima already has a membership to —
// "I already have access, worth knowing about" outweighs a few points of
// taste-score. Big enough to pull a membership event up from just outside the
// cap into it, not so big it buries a genuinely much better-scored pick.
const MEMBERSHIP_HIGHLIGHT_BOOST = 15;

function highlightRankScore(ev) {
  return ev.score + (ev.membershipIncluded ? MEMBERSHIP_HIGHLIGHT_BOOST : 0);
}

function renderTonightWeeks(excludeIds) {
  const wrap = document.getElementById('tonight-week-wrap');
  if (!wrap) return;

  const dow = TODAY_MID.getDay(); // 0 Sun .. 6 Sat
  const isoDow = dow === 0 ? 7 : dow; // ISO week: Monday=1..Sunday=7 — weeks run Mon-Sun, not Sun-Sat
  const thisWeekEnd = new Date(TODAY_MID.getTime() + (7 - isoDow) * 86400000); // upcoming Sunday, inclusive
  const nextWeekEnd = new Date(thisWeekEnd.getTime() + 7 * 86400000);

  const upcoming = EVENTS.filter(ev => parseLocalDate(ev.date) >= TODAY_MID && !excludeIds.has(ev.id));

  // Rank each bucket by (membership-boosted) score to pick the LIMIT most
  // worth surfacing, then re-sort that capped subset chronologically so the
  // rendered list still reads as a simple date-ordered rundown.
  const rankAndCap = list => list
    .slice()
    .sort((a, b) => highlightRankScore(b) - highlightRankScore(a) || a.date.localeCompare(b.date))
    .slice(0, WEEK_SECTION_LIMIT)
    .sort((a, b) => a.date.localeCompare(b.date) || b.score - a.score);

  const thisWeek = rankAndCap(upcoming.filter(ev => parseLocalDate(ev.date) <= thisWeekEnd));
  const nextWeek = rankAndCap(upcoming.filter(ev => { const d = parseLocalDate(ev.date); return d > thisWeekEnd && d <= nextWeekEnd; }));

  // The first non-empty section gets a divider + top margin — a visual break
  // between the "right now" zone above (hero + alternates + evergreen strip)
  // and this "rest of the next two weeks, ranked" zone, so scrolling past it
  // doesn't read as one continuous "also worth it" list.
  let isFirstSection = true;
  const section = (label, events) => {
    if (!events.length) return '';
    const cls = isFirstSection ? ' tonight-week-section-start' : '';
    isFirstSection = false;
    return `
    <div class="tonight-alt-label${cls}">${label}</div>
    <div class="tonight-alt-list">${events.map(tonightAltRowHTML).join('')}</div>`;
  };

  wrap.innerHTML = section('This Week', thisWeek) + section('Next Week', nextWeek);
}

// ─── EVERGREEN BLEND — a small "always available" strip between the
// right-now picks and the This Week / Next Week rundown. Not a recommender:
// membership-included activities sort first (already paid for, zero-friction
// yes), then activities whose bestDays matches today's weekday/weekend, then
// higher combined Dean+Adult harvey-ball score as a tiebreaker. Kept tiny on
// purpose — Evergreen's own filterable grid in Browse is where a real
// "find me something" search belongs. ──────────────────────────────────────
const EVERGREEN_HIGHLIGHT_LIMIT = 4;

function pickHighlightEvergreen() {
  const dow = TODAY_MID.getDay(); // 0 Sun .. 6 Sat
  const isWeekend = dow === 0 || dow === 6;
  const dayMatches = eg => eg.bestDays === 'any' || eg.bestDays === (isWeekend ? 'weekend' : 'weekday');

  return EVERGREEN.slice().sort((a, b) => {
    const memA = a.membershipIncluded ? 1 : 0, memB = b.membershipIncluded ? 1 : 0;
    if (memA !== memB) return memB - memA;
    const dayA = dayMatches(a) ? 1 : 0, dayB = dayMatches(b) ? 1 : 0;
    if (dayA !== dayB) return dayB - dayA;
    return (b.deanScore + b.parentScore) - (a.deanScore + a.parentScore);
  }).slice(0, EVERGREEN_HIGHLIGHT_LIMIT);
}

// Adapts the tonight-alt-row template (built for ticketed events) to
// evergreen activities — same leftmost-icon/thumb/stacked-text row shell as
// tonightAltRowHTML above (kept in sync so the evergreen strip doesn't look
// like a different row format from the events above it), but with the
// membership/cost tag as the one meta line (no date) and no right-side score
// badge (evergreen entries don't have one). Clicking jumps into Browse's
// Evergreen grid and opens that exact card instead of the bottom sheet.
function tonightEvergreenRowHTML(eg) {
  const thumbInner = eg.imageUrl
    ? `<img src="${eg.imageUrl}" alt="" loading="lazy" onerror="iconFallback(this, '${eg.category}', 22)">`
    : catIconHTML(eg.category, 22);
  const tag = eg.membershipIncluded ? `🏅 ${eg.membershipVenue}` : eg.free ? '💸 Free' : (eg.cost || '');

  return `
    <div class="tonight-alt-row" onclick="jumpToEvergreenCard('${eg.id}')">
      <span class="er-cat-icon cat-${eg.category}" title="${CAT_LABEL[eg.category] || eg.category}">${catIconHTML(eg.category, 15)}</span>
      <div class="tonight-alt-thumb er-thumb cat-${eg.category}">${thumbInner}</div>
      <div class="er-main">
        <div class="er-title">${eg.name}</div>
        <div class="er-meta-venue">${tag}${tag ? ' · ' : ''}no ticket needed</div>
      </div>
    </div>`;
}

function renderTonightEvergreen() {
  const wrap = document.getElementById('tonight-evergreen-wrap');
  if (!wrap) return;
  const picks = pickHighlightEvergreen();
  wrap.innerHTML = picks.length ? `
    <div class="tonight-alt-label">No ticket needed</div>
    <div class="tonight-alt-list">${picks.map(tonightEvergreenRowHTML).join('')}</div>` : '';
}

// Opens an evergreen activity's card from the Highlights strip — Evergreen
// lives inside the Browse view/section, so this switches views (same pattern
// as the nav's Evergreen anchor link) then expands and scrolls to the card.
function jumpToEvergreenCard(id) {
  setView('browse', { skipScroll: true });
  const card = document.querySelector(`.eg-card[data-id="${id}"]`);
  if (card) card.classList.add('open');
  setTimeout(() => (card || document.getElementById('evergreen'))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
}

// ─── PROGRESSIVE DISCLOSURE (Browse: calendar + filters collapsed by default) ──
function initDisclosure(toggleId, panelId, onOpen) {
  const btn = document.getElementById(toggleId);
  const panel = document.getElementById(panelId);
  if (!btn || !panel) return;
  btn.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open && onOpen) onOpen();
  });
}

// ─── RSVP SIGNALS (localStorage, internal only) ──────────────────────────
function getRSVP(id) {
  if (!INTERNAL) return null;
  return localStorage.getItem(`rsvp_${id}`);
}

function setRSVP(id, signal) {
  if (!INTERNAL) return;
  const current = getRSVP(id);
  if (current === signal) {
    localStorage.removeItem(`rsvp_${id}`);
  } else {
    localStorage.setItem(`rsvp_${id}`, signal);
  }
  // Re-render buttons wherever they appear (peek row + bottom sheet)
  for (const cid of [`rsvp-${id}`, `bs-rsvp-${id}`]) {
    const container = document.getElementById(cid);
    if (container) container.innerHTML = rsvpButtonsHTML(id);
  }
  // Update card badge
  const card = document.querySelector(`.event-card[data-id="${id}"]`);
  if (card) {
    const newSignal = getRSVP(id);
    card.classList.remove('rsvp-in', 'rsvp-maybe', 'rsvp-pass', 'rsvp-attended');
    if (newSignal) card.classList.add(`rsvp-${newSignal}`);
  }
  updateHeroStats();
  renderMyList();
}

function rsvpButtonsHTML(id) {
  const current = getRSVP(id);
  // "Went" (Rec 2): only for past events, or to promote an existing "I'm In"
  const ev = EVENTS.find(e => e.id === id);
  const isPast = ev && parseLocalDate(ev.date) < TODAY_MID;
  const wentBtn = (isPast || current === 'in' || current === 'attended')
    ? `<button class="rsvp-btn rsvp-went${current==='attended'?' active':''}" onclick="setRSVP(${id},'attended');event.stopPropagation()">Went ✓</button>`
    : '';
  return `<div class="rsvp-row">
    <button class="rsvp-btn rsvp-going${current==='in'?' active':''}" onclick="setRSVP(${id},'in');event.stopPropagation()">✓ Going</button>
    <button class="rsvp-btn rsvp-interested${current==='maybe'?' active':''}" onclick="setRSVP(${id},'maybe');event.stopPropagation()">★ Interested</button>
    <button class="rsvp-btn${current==='pass'?' active':''}" onclick="setRSVP(${id},'pass');event.stopPropagation()">Pass</button>
    ${wentBtn}
  </div>`;
}

// ─── INVITE BUILDER — combine a subset of events, evergreen-activity time
// proposals, and bare "just hanging out" time slots into ONE friend-facing
// link. Friend opens share.html?ids=..&eg=..&slots=.., picks Yes/Maybe/Pass
// on each, and copies a summary or reply link back into the same thread —
// no accounts, no backend, no personal contact info baked into this public
// repo. Three item types, one draft, one link. ─────────────────────────────
let shareMode = false;
let shareSelectedIds = new Set();
let inviteEvergreenSlots = []; // [{egId, date, tod}]
let inviteBareSlots = [];      // [{date, tod, label}]

function toggleShareMode() {
  shareMode = !shareMode;
  const grid = document.getElementById('events-grid');
  if (grid) grid.classList.toggle('share-mode', shareMode);
  document.getElementById('share-mode-btn').classList.toggle('active', shareMode);
  document.getElementById('invite-bar-wrap').classList.toggle('visible', shareMode);
  document.getElementById('add-slot-form').style.display = 'none';

  // Starts empty, not pre-checked — defaulting to "everything selected" meant
  // one tap of Copy without manually unchecking ~80 rows sent a friend the
  // entire catalog instead of a curated pick. Select All / Clear cover both
  // "share most of it" and "hand-pick a few" without that footgun.
  shareSelectedIds.clear();
  inviteEvergreenSlots = [];
  inviteBareSlots = [];
  document.querySelectorAll('#events-grid .er-share-check input').forEach(cb => { cb.checked = false; });
  updateShareBar();
}

function selectAllShare() {
  document.querySelectorAll('#events-grid .event-card').forEach(card => {
    shareSelectedIds.add(Number(card.dataset.id));
    const cb = card.querySelector('.er-share-check input');
    if (cb) cb.checked = true;
  });
  updateShareBar();
}

function clearShareSelection() {
  shareSelectedIds.clear();
  inviteEvergreenSlots = [];
  inviteBareSlots = [];
  document.querySelectorAll('#events-grid .er-share-check input').forEach(cb => { cb.checked = false; });
  updateShareBar();
}

function toggleShareSelect(id, checked) {
  if (checked) shareSelectedIds.add(id); else shareSelectedIds.delete(id);
  updateShareBar();
}

function inviteItemCount() {
  return shareSelectedIds.size + inviteEvergreenSlots.length + inviteBareSlots.length;
}

const INVITE_TOD_LABEL = { m: 'Morning', a: 'Afternoon', e: 'Evening', x: 'Any time' };
const INVITE_DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const INVITE_MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function formatInviteDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return `${INVITE_DOW[dt.getDay()]} ${INVITE_MON[dt.getMonth()]} ${d}`;
}

function updateShareBar() {
  const label = document.getElementById('share-selected-count');
  if (label) label.textContent = inviteItemCount();
  const btn = document.getElementById('share-copy-btn');
  if (btn) btn.disabled = inviteItemCount() === 0;
  renderInviteDraft();
}

// The actual "where is my invite" answer — a live, editable list of
// everything added so far. Without this, the only feedback on "Add to
// invite" was a number changing in a corner and a button label flashing
// for 1.8s, which reads as "nothing happened" even when it worked, and
// gives no way to tell what's in the draft or fix a mistake.
function renderInviteDraft() {
  const list = document.getElementById('invite-draft-list');
  if (!list) return;

  const rows = [];
  Array.from(shareSelectedIds).forEach(id => {
    const ev = EVENTS.find(e => e.id === id);
    if (!ev) return;
    rows.push(`<div class="invite-draft-row">
      <span class="invite-draft-icon">🎟</span>
      <span class="invite-draft-text"><span class="invite-draft-label">${ev.title}</span><span class="invite-draft-sub">${ev.dateStr}</span></span>
      <button class="invite-draft-remove" onclick="removeInviteEvent(${id})" aria-label="Remove">✕</button>
    </div>`);
  });
  inviteEvergreenSlots.forEach((s, i) => {
    const eg = EVERGREEN.find(e => e.id === s.egId);
    rows.push(`<div class="invite-draft-row">
      <span class="invite-draft-icon">📅</span>
      <span class="invite-draft-text"><span class="invite-draft-label">${eg ? eg.name : s.egId}</span><span class="invite-draft-sub">${formatInviteDate(s.date)} · ${INVITE_TOD_LABEL[s.tod] || 'Any time'}</span></span>
      <button class="invite-draft-remove" onclick="removeInviteEvergreen(${i})" aria-label="Remove">✕</button>
    </div>`);
  });
  inviteBareSlots.forEach((s, i) => {
    rows.push(`<div class="invite-draft-row">
      <span class="invite-draft-icon">🕐</span>
      <span class="invite-draft-text"><span class="invite-draft-label">${s.label || 'Hang out'}</span><span class="invite-draft-sub">${formatInviteDate(s.date)} · ${INVITE_TOD_LABEL[s.tod] || 'Any time'}</span></span>
      <button class="invite-draft-remove" onclick="removeInviteSlot(${i})" aria-label="Remove">✕</button>
    </div>`);
  });

  list.innerHTML = rows.length
    ? rows.join('')
    : `<div class="invite-draft-empty">Nothing added yet — use "Add to invite" on any event or evergreen card, or "+ Add a time" below.</div>`;
}

function removeInviteEvent(id) {
  shareSelectedIds.delete(id);
  const cb = document.querySelector(`.event-card[data-id="${id}"] .er-share-check input`);
  if (cb) cb.checked = false;
  updateShareBar();
}

function removeInviteEvergreen(idx) {
  inviteEvergreenSlots.splice(idx, 1);
  updateShareBar();
}

function removeInviteSlot(idx) {
  inviteBareSlots.splice(idx, 1);
  updateShareBar();
}

function toggleAddSlotForm() {
  const form = document.getElementById('add-slot-form');
  form.style.display = form.style.display === 'none' ? 'flex' : 'none';
}

function addBareSlot() {
  const date = document.getElementById('add-slot-date').value;
  if (!date) return;
  const tod = document.getElementById('add-slot-tod').value;
  const labelInput = document.getElementById('add-slot-label');
  // Strip ',' and ':' — they're the delimiters used to pack this label into
  // the URL's &slots= value, and URLSearchParams only encodes the value
  // once at the top level, not these inner separators.
  const label = labelInput.value.trim().replace(/[,:]/g, '');
  inviteBareSlots.push({ date, tod, label });
  labelInput.value = '';
  document.getElementById('add-slot-date').value = '';
  updateShareBar();
}

// Called from an evergreen card's propose-builder — pulls whatever slots
// are currently filled in on that card and adds them to the shared invite
// draft (separate from "Copy proposal link", which is the standalone
// single-activity flow via propose.html).
function addEvergreenToInvite(egId) {
  if (!shareMode) toggleShareMode();
  const wrap = document.getElementById(`eg-propose-slots-${egId}`);
  const rows = Array.from(wrap.querySelectorAll('.eg-propose-slot'));
  const added = [];
  rows.forEach(row => {
    const dateEl = row.querySelector('.eg-propose-date');
    const date = dateEl.value;
    const tod = row.querySelector('.eg-propose-tod').value;
    if (date) {
      inviteEvergreenSlots.push({ egId, date, tod });
      added.push(date);
      dateEl.classList.remove('eg-propose-date-error');
    } else {
      // Stays highlighted (and the warning stays put, no auto-vanish) until
      // they actually pick a date — a warning that disappears in 2s reads
      // as "nothing happened" when someone glances back a moment later.
      dateEl.classList.add('eg-propose-date-error');
      dateEl.addEventListener('input', () => dateEl.classList.remove('eg-propose-date-error'), { once: true });
    }
  });
  const warn = document.getElementById(`eg-propose-warn-${egId}`);
  if (!added.length) {
    if (warn) warn.textContent = 'Pick at least one date first (highlighted below)';
    return;
  }
  if (warn) warn.textContent = '';
  const btn = document.getElementById(`eg-propose-invite-${egId}`);
  if (btn) { const original = btn.textContent; btn.textContent = `Added ✓ (${added.length})`; setTimeout(() => { btn.textContent = original; }, 1800); }
  updateShareBar();
}

// Called from an event's peek panel or bottom-sheet "+ Add to invite"
// button — adds that one event straight to the invite draft, same
// auto-enable-share-mode + timed button feedback pattern as
// addEvergreenToInvite() above. btnId lets the two call sites (peek panel,
// bottom sheet) each show their own "Added ✓" feedback independently.
function addEventToInvite(id, btnId) {
  if (!shareMode) toggleShareMode();
  shareSelectedIds.add(id);
  const cb = document.querySelector(`.event-card[data-id="${id}"] .er-share-check input`);
  if (cb) cb.checked = true;
  updateShareBar();
  const btn = document.getElementById(btnId);
  if (btn) { const original = btn.textContent; btn.textContent = 'Added ✓'; setTimeout(() => { btn.textContent = original; }, 1800); }
}

function copyShareLink() {
  if (!inviteItemCount()) return;
  const base = `${location.origin}${location.pathname.replace(/index\.html$/, '').replace(/\/$/, '')}`;
  const url = new URL(`${base}/share.html`);
  if (shareSelectedIds.size) url.searchParams.set('ids', Array.from(shareSelectedIds).join(','));
  if (inviteEvergreenSlots.length) {
    url.searchParams.set('eg', inviteEvergreenSlots.map(s => `${s.egId}_${s.date}_${s.tod}`).join(','));
  }
  if (inviteBareSlots.length) {
    url.searchParams.set('slots', inviteBareSlots.map(s =>
      `${s.date}_${s.tod}${s.label ? ':' + s.label : ''}`
    ).join(','));
  }
  const text = url.toString();
  const btn = document.getElementById('share-copy-btn');
  const restore = () => setTimeout(() => { btn.textContent = 'Copy invite link'; }, 1800);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => { btn.textContent = 'Copied ✓'; restore(); })
      .catch(() => fallbackCopyText(text, btn, restore));
  } else {
    fallbackCopyText(text, btn, restore);
  }
}

// Clipboard API can reject with "Document is not focused" (embedded webviews,
// focus-stealing extensions) even when otherwise available — execCommand via
// a hidden textarea is the last-resort path both here and in share.js.
function fallbackCopyText(text, btn, restore) {
  const ta = document.getElementById('share-copy-fallback');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.top = '0';
  ta.style.left = '0';
  ta.style.opacity = '0.01';
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    btn.textContent = 'Copied ✓';
  } catch (e) {
    btn.textContent = 'Copy failed — long-press to copy';
  }
  ta.style.position = 'fixed';
  ta.style.top = '-9999px';
  ta.style.left = '-9999px';
  restore();
}

// ─── DRIVE TIME (item 9) — estimated minutes from Va-Highland, no API ───────
const HOME = { lat: 33.7885, lng: -84.3565 };

function driveMinutes(ev) {
  if (!ev.lat || !ev.lng) return null;
  const R = 3959, toR = d => d * Math.PI / 180;
  const dLat = toR(ev.lat - HOME.lat), dLng = toR(ev.lng - HOME.lng);
  const a = Math.sin(dLat/2)**2 + Math.cos(toR(HOME.lat)) * Math.cos(toR(ev.lat)) * Math.sin(dLng/2)**2;
  const miles = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  if (miles < 0.9) return null;             // walkable — skip the car icon
  return Math.round(5 + miles * 2.8);       // ~21 mph city avg + parking overhead
}

// ─── URGENCY DECAY (item 7) — ticketed events inside 10 days get a countdown ─
function soonChip(ev) {
  if (ev.urgent || ev.free || !ev.ticketUrl) return '';
  const days = Math.round((parseLocalDate(ev.date) - TODAY_MID) / 86400000);
  if (days < 0 || days > 10) return '';
  if (INTERNAL && ['in', 'pass', 'attended'].includes(getRSVP(ev.id))) return '';
  return `<span class="er-soon">⏳${days === 0 ? 'today' : days + 'd'}</span>`;
}

// ─── "NEW THIS WEEK" — events stamped with addedAt ('YYYY-MM-DD', written by
// the staging-layer promote flow) get a NEW pill for 7 days after being
// added. addedAt is optional — pre-staging events don't carry it. Parsed via
// parseLocalDate, NOT new Date(str): date-only strings read as UTC midnight
// and shift a day against the locally-built TODAY_MID (known bug class #4). ─
const NEW_BADGE_DAYS = 7;
function isNewlyAdded(ev) {
  if (!ev.addedAt) return false;
  const days = Math.round((TODAY_MID - parseLocalDate(ev.addedAt)) / 86400000);
  return days >= 0 && days <= NEW_BADGE_DAYS;
}

function newBadge(ev) {
  return isNewlyAdded(ev) ? `<span class="badge-new">New</span>` : '';
}

// ─── WEATHER (R2-C) — outdoor events within 2 weeks get a forecast badge via
// Open-Meteo (no API key, CORS-open). Cards render first; badges patch in
// once forecasts land, grouped by location so one venue = one API call
// regardless of how many events happen there. ──────────────────────────────
const WMO_WEATHER = {
  0: ['☀️', 'Clear'], 1: ['🌤️', 'Mostly clear'], 2: ['⛅', 'Partly cloudy'], 3: ['☁️', 'Cloudy'],
  45: ['🌫️', 'Fog'], 48: ['🌫️', 'Fog'],
  51: ['🌦️', 'Drizzle'], 53: ['🌦️', 'Drizzle'], 55: ['🌦️', 'Drizzle'],
  61: ['🌧️', 'Rain'], 63: ['🌧️', 'Rain'], 65: ['🌧️', 'Heavy rain'],
  71: ['🌨️', 'Snow'], 73: ['🌨️', 'Snow'], 75: ['🌨️', 'Heavy snow'],
  80: ['🌦️', 'Showers'], 81: ['🌧️', 'Showers'], 82: ['🌧️', 'Heavy showers'],
  95: ['⛈️', 'Storms'], 96: ['⛈️', 'Storms'], 99: ['⛈️', 'Storms'],
};

const weatherForecastCache = new Map(); // group-key -> Open-Meteo daily response, so filter/sort re-renders don't re-fetch

async function loadWeatherBadges() {
  const horizon = new Date(TODAY_MID.getTime() + 14 * 86400000);

  const candidates = EVENTS.filter(ev =>
    ev.environment === 'outdoor' && ev.lat != null && ev.lng != null &&
    parseLocalDate(ev.date) >= TODAY_MID && parseLocalDate(ev.date) <= horizon
  );
  if (!candidates.length) return;

  const injectBadge = (ev, daily) => {
    const days = daily?.time || [];
    const idx = days.indexOf(ev.date);
    if (idx === -1) return;
    const [icon, label] = WMO_WEATHER[daily.weathercode[idx]] || ['', null];
    if (!label) return;
    const target = document.querySelector(`.event-card[data-id="${ev.id}"] .er-right`);
    if (!target || target.querySelector('.er-weather')) return;
    const precip = daily.precipitation_probability_max[idx];
    const badge = document.createElement('span');
    badge.className = 'er-weather';
    badge.title = `${label}${precip >= 40 ? ` · ${precip}% rain` : ''} — ${ev.date}`;
    badge.textContent = icon;
    target.insertBefore(badge, target.firstChild);
  };

  // Group by rounded lat/lng (~1km) so multiple events at the same venue
  // share one forecast fetch instead of one call each.
  const groups = new Map();
  for (const ev of candidates) {
    const key = `${ev.lat.toFixed(2)},${ev.lng.toFixed(2)}`;
    if (!groups.has(key)) groups.set(key, { lat: ev.lat, lng: ev.lng, events: [] });
    groups.get(key).events.push(ev);
  }

  await Promise.all(Array.from(groups.entries()).map(async ([key, group]) => {
    if (weatherForecastCache.has(key)) {
      group.events.forEach(ev => injectBadge(ev, weatherForecastCache.get(key)));
      return;
    }
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${group.lat}&longitude=${group.lng}&daily=weathercode,precipitation_probability_max&timezone=America%2FNew_York&forecast_days=16`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      weatherForecastCache.set(key, data.daily);
      group.events.forEach(ev => injectBadge(ev, data.daily));
    } catch (e) { /* decorative — fail silently, cards already work without it */ }
  }));
}

// ─── SOCIAL LAYER (Track D / Rec 4 — internal mode only) ────────────────────
// First names only: this file ships publicly (repo + site), full identities
// stay in social_scan.py / the CRM. Panel renders only when INTERNAL.
const FRIEND_SLOTS = {
  GROUP_NIGHT: { label: 'Concert Squad',
                 names: ['David', 'Craig', 'Davis', 'Arjun', 'James', 'Jeff', 'Cole'] },
  FAMILY_OUT:  { label: 'Kids Crew',
                 names: ['Davis', 'Craig', 'Liam', 'Josh', 'Chris', 'Ted', 'Ben', 'Shubh'] },
  DATE_NIGHT:  { label: 'Couples',
                 names: ['Arjun+Kirsten', 'Jeff+Liz', 'James+Gray', 'Craig+Shannon'] },
  LAST_MINUTE: { label: 'Close By',
                 names: ['Davis', 'Robert', 'Craig', 'Jon'] },
};

function generateDraftText(ev, slot) {
  const when = ev.dateStr + (ev.time ? ` · ${ev.time}` : '');
  let msg;
  if (slot === 'FAMILY_OUT') {
    msg = `${ev.title} — ${when} at ${ev.venue}. Bringing Dean, want to join with the kids?`;
  } else if (slot === 'DATE_NIGHT') {
    msg = `${ev.title} — ${when} at ${ev.venue}. Want to make it a double date?`;
  } else {
    msg = `${ev.title} — ${when} at ${ev.venue}. You in?`;
  }
  const link = ev.ticketUrl || ev.officialUrl;
  return link ? `${msg}\n${link}` : msg;
}

function inviteSlotFor(ev) {
  return (ev.slots || []).find(s => FRIEND_SLOTS[s]) || null;
}

function copyInviteText(evId) {
  const ev = EVENTS.find(e => e.id === evId);
  if (!ev) return;
  const slot = inviteSlotFor(ev);
  if (!slot) return;
  navigator.clipboard.writeText(generateDraftText(ev, slot));
  const btn = document.querySelector(`.invite-copy-btn[data-id="${evId}"]`);
  if (btn) { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy Text', 1400); }
}

// ─── WIZARD FILTER STATE — When/Who/Vibe chips inside Browse's Filter & sort
// panel. Used to be a standalone "Plan" view that only DIMMED non-matching
// cards via wizardEventFilter() without actually filtering the grid — merged
// into Browse (see applyEventFilters/applyEvergreenFilter below) so these
// three dimensions really narrow the grid like Type/Score already do. ──────
const wizard = { when: null, who: null, vibe: null };

function wizardSlotMap(who) {
  return { solo: ['SOLO_RESET'], dean: ['FAMILY_OUT'], family: ['FAMILY_OUT'],
           date: ['DATE_NIGHT'], friends: ['GROUP_NIGHT'], papa: ['PAPA_DEAN'] }[who] || null;
}

function wizardEventFilter(ev) {
  const evDate = parseLocalDate(ev.date);
  if (wizard.when) {
    if (wizard.when === 'now') {
      const diff = (evDate - TODAY_MID) / 86400000;
      if (diff < 0 || diff > 3) return false;
    } else if (wizard.when === 'weekend') {
      const dow = TODAY_MID.getDay();
      const satOff = dow === 0 ? -1 : 6 - dow;
      const sat = new Date(TODAY_MID); sat.setDate(sat.getDate() + satOff);
      const sun = new Date(sat); sun.setDate(sun.getDate() + 1);
      const satStr = toLocalISODate(sat);
      const sunStr = toLocalISODate(sun);
      if (ev.date < satStr || ev.date > sunStr) return false;
    }
  }
  if (wizard.who) {
    const slots = wizardSlotMap(wizard.who);
    if (slots && !slots.some(s => ev.slots.includes(s))) return false;
  }
  if (wizard.vibe) {
    if (wizard.vibe === 'music'   && ev.category !== 'music') return false;
    if (wizard.vibe === 'outdoor' && ev.environment !== 'outdoor') return false;
    if (wizard.vibe === 'indoor'  && ev.environment !== 'indoor') return false;
    if (wizard.vibe === 'chill'   && ev.score >= 85) return false;
    if (wizard.vibe === 'food'    && ev.category !== 'food') return false;
  }
  return true;
}

function updateWizard() {
  const napBanner = document.getElementById('ruby-nap');
  if (napBanner) napBanner.classList.toggle('hidden', wizard.who !== 'family');

  gridExpanded = false;
  applyEventFilters();
  applyCalendarHighlight();
  egGridExpanded = false;
  applyEvergreenFilter();
}

function wizardEvergreenFilter(eg) {
  if (!wizard.who && !wizard.vibe) return true;
  if (wizard.who) {
    const catMap = { solo: 'solo', dean: 'family', family: 'family',
                     date: 'date', friends: 'group', papa: 'papa' };
    const target = catMap[wizard.who];
    if (target && eg.category !== target) return false;
  }
  return true;
}

// When/Who/Vibe chip rows — same single-select "All" pattern as the Type/Score
// chips above them (data-wizwhen/data-wizwho/data-wizvibe instead of an
// active/inactive toggle-per-button, so behavior matches the rest of the
// filter panel instead of the old wizard's click-again-to-clear pattern).
[['wizwhen', 'when'], ['wizwho', 'who'], ['wizvibe', 'vibe']].forEach(([attr, step]) => {
  document.querySelectorAll(`.chip[data-${attr}]`).forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll(`.chip[data-${attr}]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      wizard[step] = btn.dataset[attr] === 'all' ? null : btn.dataset[attr];
      updateWizard();
    });
  });
});

// ─── SEARCH (inline grid filter state) ────────────────────────────────────
let searchQuery = '';

function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', () => {
    searchQuery = input.value.trim().toLowerCase();
    gridExpanded = false;
    applyEventFilters();
    applyEvergreenSearch();
  });
}

function evMatchesSearch(ev) {
  if (!searchQuery) return true;
  const hay = [ev.title, ev.subtitle, ev.venue, ev.note, ...(ev.genres||[]), ...(ev.lineup||[])].filter(Boolean).join(' ').toLowerCase();
  return hay.includes(searchQuery);
}

function egMatchesSearch(eg) {
  if (!searchQuery) return true;
  const hay = [eg.name, eg.description, eg.category, eg.notes].filter(Boolean).join(' ').toLowerCase();
  return hay.includes(searchQuery);
}

function applyEvergreenSearch() {
  document.querySelectorAll('.eg-card').forEach(card => {
    const egId = card.dataset.id;
    const eg   = EVERGREEN.find(e => e.id === egId);
    if (eg && !egMatchesSearch(eg)) card.classList.add('search-hidden');
    else card.classList.remove('search-hidden');
  });
}

// ─── EVERGREEN FREEFORM FINDER — "just tell us what you're free for" ───────
// Plain keyword matching, not real NLP: split the typed phrase into words,
// drop filler words, show anything matching ANY remaining word. Precise
// enough for "Sat morning, indoors or at home" to surface relevant cards
// without requiring the exact chip combination.
let egFreeformQuery = '';
const EG_STOPWORDS = new Set(['a','an','the','or','and','to','do','for','on','in','at','of','is','im',"i'm",'something','free','with','my','me','be','just']);

function egMatchesFreeform(eg) {
  if (!egFreeformQuery) return true;
  const words = egFreeformQuery.split(/\s+/)
    .map(w => w.replace(/[^a-z0-9]/g, ''))
    .filter(w => w.length > 2 && !EG_STOPWORDS.has(w));
  if (!words.length) return true;
  const hay = [eg.name, eg.description, eg.category, eg.notes, eg.effort, eg.distance, eg.timeOfDay]
    .filter(Boolean).join(' ').toLowerCase();
  return words.some(w => hay.includes(w));
}

function initEgFreeform() {
  const input = document.getElementById('eg-freeform-input');
  if (!input) return;
  input.addEventListener('input', () => {
    egFreeformQuery = input.value.trim().toLowerCase();
    egGridExpanded = false;
    applyEvergreenFilter();
  });
}

// ─── EVENTS GRID ───────────────────────────────────────────────────────────
let activeFilter = 'all';
let activeTier   = 'all';
let activeSort   = 'date';
const renderedRadars = new Set();

// ─── R2-B: SVG icon pack replacing category emoji — emoji glyphs ignore CSS
// `color` (they're full-color pre-rendered), so tier/category tinting never
// actually reached them. These use stroke="currentColor" and inherit the
// existing .cat-* color tokens instead.
const CAT_ICON = {
  // Mic + stand — reused from the old comedy glyph. A mic reads as "live
  // performance" more specifically than a bare note+beam; comedy moved to
  // a laughing-face glyph below so the two no longer overlap visually.
  music:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="17" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>',
  family:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7" r="3"/><path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.2"/><path d="M13.5 20c.3-2.5 2-4.3 4-4.3 2.2 0 4 2 4 4.3"/></svg>',
  // Laughing face — replaces the old mic glyph, which read as generic "live
  // performance" and overlapped with music once music also used a mic.
  comedy:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.3 9.8c.5-1 1.6-1 2.1 0M13.6 9.8c.5-1 1.6-1 2.1 0"/><path d="M7.5 13.3c1 2.3 3 3.7 4.5 3.7s3.5-1.4 4.5-3.7"/></svg>',
  outdoor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-4-1-7-5-7-10a9 9 0 0 1 9-9c5 0 9 4 9 9-5 0-9 4-11 10z"/><path d="M12 21c0-6 3-10 8-13"/></svg>',
  // Film reel — category:'film' events (e.g. Plazadrome screenings) previously
  // had no dedicated glyph and fell through to the generic pin fallback.
  film:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="19" height="16" rx="2"/><circle cx="7.5" cy="9" r="1.2"/><circle cx="16.5" cy="9" r="1.2"/><circle cx="7.5" cy="15" r="1.2"/><circle cx="16.5" cy="15" r="1.2"/><path d="M2.5 12h19"/></svg>',
  social:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="17" r="2.2"/><circle cx="19" cy="17" r="2.2"/><path d="M10.4 6.7 6.6 15.2M13.6 6.7l3.8 8.5M7.4 17h9.2"/></svg>',
  date:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.7-9.8-9.3C.6 7.7 2.4 4 6 4c2.1 0 3.6 1.2 6 3.8C14.4 5.2 15.9 4 18 4c3.6 0 5.4 3.7 3.8 7.2-2.3 4.6-9.8 9.3-9.8 9.3z"/></svg>',
  group:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="8.5" r="2.4"/><path d="M14.5 20c.2-2.7 2.1-4.6 4.5-4.6s4.3 1.9 4.5 4.6"/></svg>',
  solo:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/></svg>',
  // eventType-specific glyphs — checked before category so "what kind of
  // event is this" reads at DJ-set/festival/museum/exhibition/workshop
  // specificity instead of everything in the music/family bucket looking
  // identical. See eventIconKey().
  dj:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="5" height="7" rx="1.5"/><rect x="17" y="14" width="5" height="7" rx="1.5"/></svg>',
  festival:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4"/><path d="M5 4s1.5-1.5 4-1.5S13 4 16 4s4-1.5 4-1.5v9s-1.5 1.5-4 1.5-4.5-1.5-7-1.5-4 1.5-4 1.5"/></svg>',
  museum:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M4 21V10M9 21V10M15 21V10M20 21V10"/><path d="M2 10l10-6 10 6"/></svg>',
  exhibition: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  workshop:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  // category-only glyphs for categories that previously had no icon at all
  // and fell through to the generic pin fallback.
  wellness:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  arts:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17a5 5 0 0 0 5-5c0-4.4-4.5-8.5-10-8.5z"/><circle cx="6.5" cy="11.5" r="1.5"/><circle cx="9.5" cy="7.5" r="1.5"/><circle cx="14.5" cy="7.5" r="1.5"/><circle cx="17.5" cy="11.5" r="1.5"/></svg>',
};
CAT_ICON.papa = CAT_ICON.family; // evergreen-only category (Papa + Dean); no distinct glyph needed
const CAT_ICON_FALLBACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>';
function catIconHTML(category, px) {
  const svg = CAT_ICON[category] || CAT_ICON_FALLBACK;
  return svg.replace('<svg ', `<svg style="width:${px}px;height:${px}px;display:block" `);
}
// Events carry both a broad `category` (music/family/comedy/...) and a more
// specific `eventType` (dj/festival/museum/live/...) — prefer the specific
// one when we actually have a distinct glyph for it, so a DJ set doesn't
// render with the same icon as a museum exhibit just because both happen
// to be tagged category:'music'/'family'.
function eventIconKey(ev) {
  return CAT_ICON[ev.eventType] ? ev.eventType : ev.category;
}
// Nice-to-have: Fernbank's dinosaur-themed kids events (Dinosaur Birthday
// Bash, T. rex Tuesdays, Dinosaur Trick-or-Treat, ...) all render with the
// generic 'museum' glyph — a dinosaur emoji is a fun, specific override.
// Scoped to category:'family' so a title match like "Band of Horses &
// Dinosaur Jr." (a concert, category:'music') doesn't get miscategorized.
function dinoEmojiOverride(ev) {
  return ev.category === 'family' && /dinosaur/i.test(ev.title) ? '🦕' : null;
}
// Wraps catIconHTML with the dinosaur emoji override above — use this
// instead of catIconHTML(eventIconKey(ev), px) wherever an event's own
// leftmost category glyph is rendered.
function catGlyphHTML(ev, px) {
  const dino = dinoEmojiOverride(ev);
  return dino ? `<span style="font-size:${px}px;line-height:1;display:block">${dino}</span>` : catIconHTML(eventIconKey(ev), px);
}
// Real image URLs go stale (moved, hotlink-blocked, deleted) — without this,
// a dead URL renders as a blank/broken-image box instead of falling back to
// the category icon like a genuinely missing image would.
function iconFallback(imgEl, category, px, wrapperClass) {
  const icon = catIconHTML(category, px);
  imgEl.outerHTML = wrapperClass ? `<div class="${wrapperClass}">${icon}</div>` : icon;
}

// Map category filter buttons are static markup — decorate with the same
// icon set used everywhere else instead of duplicating SVGs in index.html.
function decorateMapFilterIcons() {
  document.querySelectorAll('.map-cat-btn[data-cat]').forEach(btn => {
    const cat = btn.dataset.cat;
    if (cat === 'all') return;
    btn.innerHTML = catIconHTML(cat, 13) + `<span>${btn.textContent.trim()}</span>`;
  });
}

// A "ticketUrl" is sometimes just a Facebook event page, not an actual
// purchase flow — "Buy Tickets" is misleading there. Detecting every
// info-only link would need a data audit; this catches the one pattern we
// can reliably tell apart from the URL alone.
function ticketLinkLabel(url) {
  return /facebook\.com/i.test(url) ? 'Event Page →' : 'Buy Tickets →';
}
const CAT_LABEL = {
  music:'Music', family:'Family', comedy:'Comedy', outdoor:'Outdoor', social:'Community', date:'Date', group:'Group',
  dj:'DJ Set', festival:'Festival', museum:'Museum', workshop:'Workshop', exhibition:'Exhibition',
  wellness:'Wellness', arts:'Arts', film:'Film',
};

const AGE_EMOJI = { 'All ages':'👶 All ages', '21+':'🔞 21+', '18+':'🔞 18+' };

// Harvey ball: single pie-fill circle via conic-gradient, proportional to
// score/max. Replaces the old 5-separate-dots rating (scoreDots) — one shape
// to read instead of counting fills.
function harveyBallHTML(n, color = 'currentColor') {
  const pct = Math.max(0, Math.min(1, n / 5));
  const deg = Math.round(pct * 360);
  return `<span class="harvey-ball" style="color:${color};background:conic-gradient(${color} ${deg}deg, transparent ${deg}deg)" title="${n}/5"></span>`;
}

function renderEventCard(ev, idx) {
  const delay    = Math.min(idx * 0.04, 0.30);

  // Thumbnail: local image → YouTube → category icon
  const iconKey = eventIconKey(ev);
  const thumbInner = ev.imageUrl
    ? `<img src="${ev.imageUrl}" alt="" loading="lazy" onerror="iconFallback(this, '${iconKey}', 22)">`
    : ev.youtubeId
    ? `<img src="https://img.youtube.com/vi/${ev.youtubeId}/mqdefault.jpg" alt="" loading="lazy" onerror="this.style.display='none'">`
    : catGlyphHTML(ev, 22);

  // Category icon sits where the score used to (leftmost) — visible even
  // when a real photo covers the fallback icon on the thumb itself, and
  // doesn't overlap the thumbnail like a corner badge did. Prefers the more
  // specific eventType glyph (DJ set vs museum vs festival) over the broad
  // category when one exists — see eventIconKey(). catGlyphHTML additionally
  // swaps in a dinosaur emoji for Fernbank's dinosaur-themed family events.
  const catIcon = `<span class="er-cat-icon cat-${ev.category}" title="${CAT_LABEL[iconKey] || iconKey}">${catGlyphHTML(ev, 15)}</span>`;

  // RSVP badge class
  const rsvpSignal = getRSVP(ev.id);
  const rsvpClass = rsvpSignal ? ` rsvp-${rsvpSignal}` : '';

  const rsvpSection = INTERNAL
    ? `<div id="rsvp-${ev.id}" onclick="event.stopPropagation()">${rsvpButtonsHTML(ev.id)}</div>`
    : '';

  return `
    <div class="event-card tier-${ev.tier}${ev.urgent?' urgent-ev':''}${rsvpClass}"
         style="animation-delay:${delay}s"
         data-id="${ev.id}" data-category="${ev.category}"
         data-slots="${ev.slots.join(',')}" data-tier="${ev.tier}"
         data-free="${ev.free}" data-score="${ev.score}" data-date="${ev.date}">

      <label class="er-share-check" onclick="event.stopPropagation()">
        <input type="checkbox" onchange="toggleShareSelect(${ev.id}, this.checked)">
      </label>

      <div class="er-collapsed" onclick="togglePeek(${ev.id})">
        ${catIcon}
        <div class="er-thumb cat-${ev.category}">${thumbInner}</div>
        <div class="er-main">
          <div class="er-title">${ev.title}${ev.subtitle ? `<span class="er-sub"> — ${ev.subtitle}</span>` : ''}</div>
          <div class="er-meta-date">${ev.dateStr}${ev.time ? ' · '+ev.time : ''}</div>
          <div class="er-meta-venue">📍 ${ev.venue}</div>
        </div>
        <div class="er-right">
          ${newBadge(ev)}
          ${soonChip(ev)}
          ${ev.urgent ? `<span class="er-urgent-dot"></span>` : ''}
          ${topScoreAxis(ev)}
        </div>
      </div>

      <div class="er-peek">
        <div class="er-peek-inner">
          <div class="er-peek-score-row">
            <span class="er-score tier-${ev.tier}">${ev.score}</span>
            <span class="er-tier-label">Tier ${ev.tier}</span>
          </div>
          <div class="er-note">${ev.note}</div>
          ${rsvpSection}
          <div class="er-peek-actions">
            <a class="er-details-link" onclick="openDetails(${ev.id});event.stopPropagation()">Full details →</a>
            <button class="btn-sm btn-details" id="er-add-invite-${ev.id}" onclick="addEventToInvite(${ev.id}, 'er-add-invite-${ev.id}');event.stopPropagation()">+ Add to invite</button>
          </div>
        </div>
      </div>
    </div>`;
}

const GRID_MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Same date-bucket cutoffs as renderTonightWeeks: This Week (through the end
// of the current calendar week), Next Week, then by calendar month. Month/year
// are read straight off the 'YYYY-MM-DD' string (not via Date#getMonth) to
// avoid UTC-parse/local-timezone day-shift bugs — new Date('2026-08-01') is
// UTC midnight, which is still July 31 evening in America/New_York.
function dateGridBucket(ev, todayMid, thisWeekEnd, nextWeekEnd) {
  const d = parseLocalDate(ev.date);
  if (d <= thisWeekEnd) return { key: 'this-week', label: 'This Week' };
  if (d <= nextWeekEnd) return { key: 'next-week', label: 'Next Week' };
  const [year, month] = ev.date.split('-').map(Number);
  const label = GRID_MONTH_NAMES[month - 1] + (year !== todayMid.getFullYear() ? ` ${year}` : '');
  return { key: `${year}-${month}`, label };
}

const GRID_PAGE_SIZE = 24;
let gridExpanded = false;

function renderGrid(allEvents) {
  const grid = document.getElementById('events-grid');
  const showMoreBtn = document.getElementById('show-more-btn');
  if (!allEvents.length) {
    grid.innerHTML = '<div class="no-results">No events match the current filters.</div>';
    if (showMoreBtn) showMoreBtn.style.display = 'none';
    return;
  }

  const truncated = !gridExpanded && allEvents.length > GRID_PAGE_SIZE;
  const events = truncated ? allEvents.slice(0, GRID_PAGE_SIZE) : allEvents;

  if (activeSort === 'date') {
    const dow = TODAY_MID.getDay(); // 0 Sun .. 6 Sat
    const isoDow = dow === 0 ? 7 : dow; // ISO week: Monday=1..Sunday=7 — weeks run Mon-Sun, not Sun-Sat
    const thisWeekEnd = new Date(TODAY_MID.getTime() + (7 - isoDow) * 86400000); // upcoming Sunday, inclusive
    const nextWeekEnd = new Date(thisWeekEnd.getTime() + 7 * 86400000);

    let lastBucketKey = null;
    grid.innerHTML = events.map((ev, i) => {
      const bucket = dateGridBucket(ev, TODAY_MID, thisWeekEnd, nextWeekEnd);
      let dividerHTML = '';
      if (bucket.key !== lastBucketKey) {
        dividerHTML = `<div class="events-section-divider"><span>${bucket.label}</span></div>`;
        lastBucketKey = bucket.key;
      }
      return dividerHTML + renderEventCard(ev, i);
    }).join('');
  } else if (activeSort === 'venue') {
    let lastVenue = null;
    grid.innerHTML = events.map((ev, i) => {
      let dividerHTML = '';
      if (ev.venue !== lastVenue) {
        dividerHTML = `<div class="events-section-divider"><span>${ev.venue}</span></div>`;
        lastVenue = ev.venue;
      }
      return dividerHTML + renderEventCard(ev, i);
    }).join('');
  } else {
    grid.innerHTML = events.map((ev, i) => renderEventCard(ev, i)).join('');
  }

  if (showMoreBtn) {
    if (truncated) {
      showMoreBtn.style.display = 'block';
      showMoreBtn.textContent = `Show all ${allEvents.length} events`;
    } else {
      showMoreBtn.style.display = 'none';
    }
  }
}

function applyEventFilters() {
  let filtered = EVENTS.filter(ev => {
    if (parseLocalDate(ev.date) < TODAY_MID) return false;
    if (activeFilter === 'music'  && ev.category !== 'music') return false;
    if (activeFilter === 'family' && ev.category !== 'family') return false;
    if (activeFilter === 'comedy' && ev.category !== 'comedy') return false;
    if (activeFilter === 'group'  && !ev.slots.includes('GROUP_NIGHT')) return false;
    if (activeFilter === 'date'   && !ev.slots.includes('DATE_NIGHT')) return false;
    if (activeFilter === 'free'   && !ev.free) return false;
    if (activeTier !== 'all' && ev.tier !== activeTier) return false;
    // When/Who/Vibe — formerly the Plan/Wizard view's dim-only overlay, now a
    // real filter predicate like everything else in this function.
    if (!wizardEventFilter(ev)) return false;
    if (!evMatchesSearch(ev)) return false;
    return true;
  });

  if (activeSort === 'score') filtered.sort((a, b) => b.score - a.score);
  else if (activeSort === 'venue') filtered.sort((a, b) => a.venue.localeCompare(b.venue) || a.date.localeCompare(b.date));
  else filtered.sort((a, b) => {
    const dc = a.date.localeCompare(b.date);
    if (dc !== 0) return dc;
    if (a.urgent && !b.urgent) return -1;
    if (!a.urgent && b.urgent) return 1;
    return b.score - a.score;
  });

  renderGrid(filtered);
  renderSurpriseStrip(filtered);
  loadWeatherBadges(); // re-injects into fresh DOM; forecasts are cached, so this is just a DOM patch after the first real fetch
}

document.querySelectorAll('.chip[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.chip[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); activeFilter = btn.dataset.filter; gridExpanded = false; applyEventFilters();
  });
});
document.querySelectorAll('.chip[data-tier]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.chip[data-tier]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); activeTier = btn.dataset.tier; gridExpanded = false; applyEventFilters();
  });
});
document.getElementById('sort-date').addEventListener('click', () => {
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sort-date').classList.add('active');
  activeSort = 'date'; gridExpanded = false; applyEventFilters();
});
document.getElementById('sort-score').addEventListener('click', () => {
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sort-score').classList.add('active');
  activeSort = 'score'; gridExpanded = false; applyEventFilters();
});
document.getElementById('sort-venue').addEventListener('click', () => {
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sort-venue').classList.add('active');
  activeSort = 'venue'; gridExpanded = false; applyEventFilters();
});

// ─── CALENDAR + SHARE HELPERS ────────────────────────────────────────────
function parseEventTime(dateStr, timeStr) {
  const d = dateStr.replace(/-/g, '');
  if (!timeStr || /all day|afternoon|morning|noon/i.test(timeStr)) {
    return { start: d, allDay: true };
  }
  const m = timeStr.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
  if (!m) return { start: d, allDay: true };
  let h = parseInt(m[1]);
  const min = m[2] ? parseInt(m[2]) : 0;
  if (/PM/i.test(m[3]) && h < 12) h += 12;
  if (/AM/i.test(m[3]) && h === 12) h = 0;
  const hh = String(h).padStart(2,'0'), mm = String(min).padStart(2,'0');
  const eh = Math.min(h + 2, 23);
  return { start: `${d}T${hh}${mm}00`, end: `${d}T${String(eh).padStart(2,'0')}${mm}00` };
}

function generateGCalUrl(ev) {
  const { start, end, allDay } = parseEventTime(ev.date, ev.time);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title + (ev.subtitle ? ' — ' + ev.subtitle : ''),
    dates: allDay ? `${start}/${start}` : `${start}/${end}`,
    location: ev.address ? `${ev.venue}, ${ev.address}` : ev.venue,
    details: ev.ticketUrl ? `Tickets: ${ev.ticketUrl}` : ev.note ? ev.note.slice(0,200) : ''
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

// "Share" used to just say "Copied!" with no way to know what actually got
// copied — this echoes the exact text back so it's obvious what a friend
// will see when it's pasted.
function copyEventShare(evId) {
  const ev = EVENTS.find(e => e.id === evId);
  if (!ev) return;
  const parts = [`${ev.title} — ${ev.dateStr} @ ${ev.venue}`];
  if (ev.ticketUrl) parts.push(ev.ticketUrl);
  const text = parts.join('\n');
  navigator.clipboard.writeText(text);
  const btn = document.querySelector(`.share-btn[data-id="${evId}"]`);
  if (btn) { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy Share Text', 1800); }
  const preview = document.getElementById(`bs-share-preview-${evId}`);
  if (preview) {
    preview.textContent = text;
    preview.classList.add('visible');
    setTimeout(() => preview.classList.remove('visible'), 5000);
  }
}

function topScoreAxis(ev) {
  if (!ev.scoreReasoning) return '';
  const axes = [
    ['Genre Match', ev.scoreReasoning.genreMatch],
    ['Venue', ev.scoreReasoning.venueQuality],
    ['Rare Format', ev.scoreReasoning.formatRarity],
    ['Lineup', ev.scoreReasoning.lineupStrength],
    ['Value', ev.scoreReasoning.valueForMoney]
  ].sort((a,b) => b[1] - a[1]);
  return axes[0][1] >= 90 ? `<span class="er-axis-star">★ ${axes[0][0]}</span>` : '';
}

function renderSurpriseStrip(filtered) {
  const strip = document.getElementById('surprise-strip');
  if (!strip) return;
  if (!wizard.when && !wizard.who && !wizard.vibe) { strip.style.display = 'none'; return; }
  const filteredIds = new Set(filtered.map(e => e.id));
  const surprises = EVENTS
    .filter(ev => parseLocalDate(ev.date) >= TODAY_MID && !filteredIds.has(ev.id) && ev.score >= 70)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  if (!surprises.length) { strip.style.display = 'none'; return; }
  strip.style.display = 'block';
  strip.innerHTML = `<div class="surprise-label">🎲 Outside your filter — you might like:</div>
    <div class="surprise-cards">${surprises.map(ev => `
      <div class="surprise-card" onclick="openBottomSheet(${ev.id})">
        <span class="surprise-title">${ev.title}</span>
        <span class="surprise-meta">${ev.dateStr}</span>
        <span class="er-score tier-${ev.tier}">${ev.score}</span>
      </div>`).join('')}
    </div>`;
}

// ─── MOBILE BOTTOM SHEET ──────────────────────────────────────────────────
const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

function buildBottomSheetHTML(ev) {
  const iconKey = eventIconKey(ev);
  const catLabel = CAT_LABEL[iconKey] || iconKey;

  const imgHtml = ev.imageUrl
    ? `<img class="bs-hero-img" src="${ev.imageUrl}" alt="${ev.title}">`
    : ev.youtubeId
    ? `<img class="bs-hero-img" src="https://img.youtube.com/vi/${ev.youtubeId}/maxresdefault.jpg" alt="${ev.title}" onerror="this.src='https://img.youtube.com/vi/${ev.youtubeId}/hqdefault.jpg'">`
    : '';

  const urgTag  = ev.urgent ? `<span class="tag urgent">⚡ Act Now</span>` : '';
  const freeTag = ev.free   ? `<span class="tag free">💸 Free</span>` : '';
  const ageTag  = `<span class="tag">${AGE_EMOJI[ev.age] || ev.age}</span>`;
  const envTag  = ev.environment === 'outdoor'
    ? `<span class="tag outdoor">🌿 Outdoor</span>`
    : `<span class="tag indoor">🏠 Indoor</span>`;
  const genreTags = ev.genres.slice(0, 3).map(g => `<span class="tag">${g}</span>`).join('');
  const driveTag = driveMinutes(ev) ? `<span class="tag">🚗 ~${driveMinutes(ev)} min</span>` : '';

  // Ticket link and "more info" link used to both render (once here, once
  // again down in linksSection) — one primary action link instead of two.
  const primaryLinkBtn = ev.ticketUrl
    ? `<a href="${ev.ticketUrl}" target="_blank" rel="noopener" class="btn-sm btn-buy" onclick="event.stopPropagation()">${ticketLinkLabel(ev.ticketUrl)}</a>`
    : ev.officialUrl
    ? `<a href="${ev.officialUrl}" target="_blank" rel="noopener" class="btn-sm btn-buy" onclick="event.stopPropagation()">More Info →</a>`
    : '';

  const ytSection = ev.youtubeId ? `
    <div class="bs-section">
      <div class="drawer-section-label">Watch</div>
      <div class="yt-wrap" id="bs-yt-${ev.id}">
        <div class="yt-placeholder" onclick="loadBsYT(${ev.id},'${ev.youtubeId}')">
          <img class="yt-thumb-bg" src="https://img.youtube.com/vi/${ev.youtubeId}/hqdefault.jpg" alt="" loading="lazy">
          <div class="play-icon">▶</div>
        </div>
      </div>
    </div>` : '';

  const lineupSection = (ev.lineup && ev.lineup.length) ? `
    <div class="bs-section">
      <div class="drawer-section-label">Lineup</div>
      ${ev.lineup.map((a, i) => {
        const st = ev.setTimes ? ev.setTimes.split(' · ')[i] || '' : '';
        return `<div class="lineup-artist"><span>${a}</span>${st ? `<span class="set-time">${st}</span>` : ''}</div>`;
      }).join('')}
    </div>` : '';

  const radarSection = ev.scoreReasoning ? `
    <div class="bs-section radar-wrap">
      <div class="drawer-section-label">Score Breakdown</div>
      <div class="radar-canvas-wrap"><canvas id="bs-radar-${ev.id}" width="220" height="220"></canvas></div>
    </div>` : '';

  // officialUrl already covers "more info" via primaryLinkBtn above when
  // there's no ticketUrl — only show it again here if a ticketUrl exists too
  // (i.e. officialUrl is then a distinct, non-duplicate link).
  const extraOfficialLink = (ev.officialUrl && ev.ticketUrl) ? `<a href="${ev.officialUrl}" target="_blank" rel="noopener" class="drawer-link">🎟 More Info</a>` : '';
  const instagramLink = ev.instagramUrl ? `<a href="${ev.instagramUrl}" target="_blank" rel="noopener" class="drawer-link">📷 Instagram</a>` : '';
  const linksSection = (extraOfficialLink || instagramLink) ? `
    <div class="bs-section drawer-links">${extraOfficialLink}${instagramLink}</div>` : '';

  const rsvpSection = INTERNAL ? `
    <div class="bs-section">
      <div class="drawer-section-label">Going?</div>
      <div id="bs-rsvp-${ev.id}">${rsvpButtonsHTML(ev.id)}</div>
    </div>` : '';

  // Track D / Rec 4: who to invite + copy-paste draft (internal only)
  const inviteSlot = INTERNAL ? inviteSlotFor(ev) : null;
  const inviteSection = inviteSlot ? `
    <div class="bs-section invite-panel">
      <div class="drawer-section-label">Invite</div>
      <div class="invite-group">${FRIEND_SLOTS[inviteSlot].label} — ${FRIEND_SLOTS[inviteSlot].names.join(', ')}</div>
      <div class="invite-draft">${generateDraftText(ev, inviteSlot).split('\n')[0]}</div>
      <button class="btn-sm invite-copy-btn" data-id="${ev.id}" onclick="copyInviteText(${ev.id});event.stopPropagation()">Copy Text</button>
    </div>${inviteTrackerSectionHTML(ev, inviteSlot)}` : '';

  // Item 30b: star rating for scoring calibration (internal only)
  const starSection = INTERNAL ? `
    <div class="bs-section" onclick="event.stopPropagation()">
      <div class="drawer-section-label">Rate (calibration)</div>
      ${starButtonsHTML('ev', ev.id)}
    </div>` : '';

  const gcalUrl = generateGCalUrl(ev);

  // Everything that isn't the primary Buy Tickets / Copy Share Text pair
  // (Add to Calendar, Add to invite) lives in one muted secondary row right
  // under it — same "chip" visual weight (.btn-cal / .btn-sm.btn-details),
  // so all actions read as one cluster instead of Add to Calendar showing
  // up orphaned much further down the sheet, after the note/rsvp/invite
  // sections, disconnected from the other two action buttons.
  const secondaryActions = `
    <div class="bs-actions-secondary">
      <a href="${gcalUrl}" target="_blank" rel="noopener" class="btn-sm btn-cal">📅 Add to Google Calendar</a>
      <button class="btn-sm btn-details" id="bs-add-invite-${ev.id}" onclick="addEventToInvite(${ev.id}, 'bs-add-invite-${ev.id}')">+ Add to invite</button>
    </div>`;

  return `
    ${imgHtml ? `<div class="bs-hero">${imgHtml}</div>` : ''}
    <div class="bs-header">
      <div class="bs-cat-row">
        <span class="ev-cat-badge cat-${ev.category}">${catGlyphHTML(ev, 13)} ${catLabel}</span>
      </div>
      <div class="bs-title">${ev.title}</div>
      ${ev.subtitle ? `<div class="bs-subtitle">${ev.subtitle}</div>` : ''}
      <div class="bs-datetime">${ev.dateStr}${ev.time ? ' · '+ev.time : ''}</div>
      <div class="bs-venue">📍 ${ev.venue}</div>
      <div class="ev-tags bs-header-tags">${urgTag}${freeTag}${ageTag}${envTag}${genreTags}${driveTag}</div>
    </div>
    <div class="bs-actions">
      ${primaryLinkBtn}
      <button class="share-btn" data-id="${ev.id}" onclick="copyEventShare(${ev.id})">Copy Share Text</button>
    </div>
    <div class="bs-share-preview" id="bs-share-preview-${ev.id}"></div>
    ${secondaryActions}
    <div class="bs-body">
      <div class="bs-section"><div class="drawer-note">${ev.note}</div></div>
      ${rsvpSection}
      ${starSection}
      ${inviteSection}
      ${ytSection}
      ${lineupSection}
      ${radarSection}
      ${linksSection}
      ${ev.recurringNote ? `<div class="bs-section recurring-note">↺ ${ev.recurringNote}</div>` : ''}
    </div>`;
}

function loadBsYT(evId, ytId) {
  const wrap = document.getElementById(`bs-yt-${evId}`);
  if (!wrap) return;
  wrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen loading="lazy"></iframe>`;
}

let bsCurrentId = null;

function openBottomSheet(id) {
  const ev = EVENTS.find(e => e.id === id);
  if (!ev) return;
  bsCurrentId = id;
  const overlay = document.getElementById('bs-overlay');
  const content = document.getElementById('bs-content');
  content.innerHTML = buildBottomSheetHTML(ev);
  content.scrollTop = 0;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
  });
  if (ev.scoreReasoning) {
    requestAnimationFrame(() => {
      const canvas = document.getElementById(`bs-radar-${ev.id}`);
      if (canvas) {
        new Chart(canvas, {
          type: 'radar',
          data: {
            labels: [['Genre','Match'], ['Venue','Quality'], ['Format','Rarity'], ['Lineup','Strength'], ['Value','for Money']],
            datasets: [{
              data: [ev.scoreReasoning.genreMatch, ev.scoreReasoning.venueQuality, ev.scoreReasoning.formatRarity, ev.scoreReasoning.lineupStrength, ev.scoreReasoning.valueForMoney],
              backgroundColor: ev.tier==='S' ? 'rgba(180,83,9,0.18)' : ev.tier==='A' ? 'rgba(194,65,12,0.18)' : 'rgba(17,94,89,0.15)',
              borderColor: ev.tier==='S' ? '#B45309' : ev.tier==='A' ? '#C2410C' : '#115E59',
              borderWidth: 1.5,
              pointBackgroundColor: ev.tier==='S' ? '#B45309' : ev.tier==='A' ? '#C2410C' : '#115E59',
              pointRadius: 3,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            layout: { padding: 6 },
            plugins: { legend: {display:false}, tooltip: {callbacks:{label: c => ` ${c.raw}`}} },
            scales: { r: {
              min:0, max:100, beginAtZero:true,
              ticks: {display:false, stepSize:25},
              pointLabels: {color:'#6B5843', font:{size:10}, padding: 6},
              grid: {color:'rgba(36,26,14,0.08)'},
              angleLines: {color:'rgba(36,26,14,0.08)'}
            }}
          }
        });
      }
    });
  }
}

function closeBottomSheet() {
  const overlay = document.getElementById('bs-overlay');
  if (!overlay.classList.contains('active')) return;
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  bsCurrentId = null;
}

// Backdrop click
document.getElementById('bs-overlay')?.addEventListener('click', e => {
  if (e.target.id === 'bs-overlay') closeBottomSheet();
});

// ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && bsCurrentId !== null) closeBottomSheet();
});

// Swipe-to-dismiss on handle
(function initBsSwipe() {
  const sheet = document.getElementById('bs-sheet');
  const handle = sheet?.querySelector('.bs-handle');
  if (!sheet || !handle) return;
  let startY = 0, currentY = 0, dragging = false;

  handle.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
    currentY = startY;
    dragging = true;
    sheet.style.transition = 'none';
  }, { passive: true });

  sheet.addEventListener('touchmove', e => {
    if (!dragging) return;
    currentY = e.touches[0].clientY;
    const dy = Math.max(0, currentY - startY);
    sheet.style.transform = `translateY(${dy}px)`;
  }, { passive: true });

  sheet.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    sheet.style.transition = '';
    const dy = currentY - startY;
    if (dy > 100) {
      closeBottomSheet();
    }
    sheet.style.transform = '';
  });
})();

// ─── ROW PEEK + DETAIL ────────────────────────────────────────────────────
function togglePeek(id) {
  const card = document.querySelector(`.event-card[data-id="${id}"]`);
  if (!card) return;
  card.classList.toggle('peeked');
}

function openDetails(id) {
  openBottomSheet(id);
}

// kept for backward compat (jumpToEvent, calendar pill clicks)
function toggleDrawer(id) {
  togglePeek(id);
}

function loadYT(evId, ytId) {
  const wrap = document.getElementById(`yt-${evId}`);
  if (!wrap) return;
  wrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen loading="lazy"></iframe>`;
}

// Jump from calendar to event card
function jumpToEvent(evId) {
  // Calendar/events grid live in Browse — switch there first if needed
  setView('browse', { skipScroll: true });
  // Ensure the event is visible in the grid (reset filters if needed)
  const evSection = document.getElementById('events');
  if (evSection) evSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => {
    let card = document.querySelector(`.event-card[data-id="${evId}"]`);
    if (!card) {
      // Card may be filtered out (Type/Score/When/Who/Vibe), or past the
      // pagination cutoff — reset every filter and force the full list so
      // the target is guaranteed to render.
      activeFilter = 'all'; activeTier = 'all'; searchQuery = '';
      wizard.when = wizard.who = wizard.vibe = null;
      document.querySelectorAll('.chip[data-wizwhen], .chip[data-wizwho], .chip[data-wizvibe]').forEach(b => {
        b.classList.toggle('active', b.dataset.wizwhen === 'all' || b.dataset.wizwho === 'all' || b.dataset.wizvibe === 'all');
      });
      const napBanner = document.getElementById('ruby-nap');
      if (napBanner) napBanner.classList.add('hidden');
      const si = document.getElementById('search-input');
      if (si) si.value = '';
      gridExpanded = true;
      applyEventFilters();
      card = document.querySelector(`.event-card[data-id="${evId}"]`);
    }
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (!card.classList.contains('open')) toggleDrawer(evId);
      card.classList.add('highlight-flash');
      setTimeout(() => card.classList.remove('highlight-flash'), 1800);
    }
  }, 420);
}

// ─── RADAR CHART ───────────────────────────────────────────────────────────
function renderRadar(ev) {
  const canvas = document.getElementById(`radar-${ev.id}`);
  if (!canvas) return;
  const r = ev.scoreReasoning;
  new Chart(canvas, {
    type: 'radar',
    data: {
      labels: [['Genre','Match'], ['Venue','Quality'], ['Format','Rarity'], ['Lineup','Strength'], ['Value','for Money']],
      datasets: [{
        data: [r.genreMatch, r.venueQuality, r.formatRarity, r.lineupStrength, r.valueForMoney],
        backgroundColor: ev.tier==='S' ? 'rgba(180,83,9,0.18)' : ev.tier==='A' ? 'rgba(194,65,12,0.18)' : 'rgba(17,94,89,0.15)',
        borderColor: ev.tier==='S' ? '#B45309' : ev.tier==='A' ? '#C2410C' : '#115E59',
        borderWidth: 1.5,
        pointBackgroundColor: ev.tier==='S' ? '#B45309' : ev.tier==='A' ? '#C2410C' : '#115E59',
        pointRadius: 3,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      layout: { padding: 6 },
      plugins: { legend: {display:false}, tooltip: {callbacks:{label: c => ` ${c.raw}`}} },
      scales: { r: {
        min:0, max:100, beginAtZero:true,
        ticks: {display:false, stepSize:25},
        pointLabels: {color:'#6B5843', font:{size:10}, padding: 6},
        grid: {color:'rgba(36,26,14,0.08)'},
        angleLines: {color:'rgba(36,26,14,0.08)'}
      }}
    }
  });
}

// ─── CALENDAR — SINGLE MONTH WIDGET ─────────────────────────────────────
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOW_LABELS  = ['Mo','Tu','We','Th','Fr','Sa','Su'];

let calYear  = SITE_TODAY.getFullYear();
let calMonth = SITE_TODAY.getMonth();

// R2-B: recurring-event marker on calendar pills (Critical Mass, Sol Dance,
// Streets Alive, etc) — a small repeat-loop icon, not a second color/emoji,
// so it reads at calendar-pill scale without adding visual noise.
const RECUR_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:9px;height:9px;display:inline-block;vertical-align:-1px;margin-right:3px"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>';

function buildCalendar() {
  const container = document.getElementById('cal-body');
  if (!container) return;

  // Update header label
  const lbl = document.getElementById('cal-month-label');
  if (lbl) lbl.textContent = `${MONTH_NAMES[calMonth]} ${calYear}`;

  // Group all events by ISO date string
  const evByDate = {};
  EVENTS.forEach(ev => {
    if (!evByDate[ev.date]) evByDate[ev.date] = [];
    evByDate[ev.date].push(ev);
  });

  const todayStr = toLocalISODate(TODAY_MID);
  const firstDay = new Date(calYear, calMonth, 1);
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  let offset = firstDay.getDay() - 1;
  if (offset < 0) offset = 6;

  let html = `<div class="cal-dow-row">${DOW_LABELS.map(d => `<div class="cal-dow">${d}</div>`).join('')}</div><div class="cal-days-grid">`;

  for (let i = 0; i < offset; i++) html += `<div class="cal-cell cal-cell-empty"></div>`;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isPast  = dateStr < todayStr;
    const isToday = dateStr === todayStr;
    const evs     = evByDate[dateStr] || [];
    const cls     = ['cal-cell', evs.length ? 'has-ev' : '', isToday ? 'is-today' : '', isPast ? 'is-past' : ''].filter(Boolean).join(' ');

    html += `<div class="${cls}">
      <span class="cal-cell-num">${day}</span>
      ${evs.map(ev => {
        const iconKey = eventIconKey(ev);
        const tooltip = `${ev.title} — ${ev.venue}${ev.recurring && ev.recurringNote ? ' · ' + ev.recurringNote : ev.recurring ? ' · recurring' : ''}`;
        // Category icon (not just the tier-colored pill background) so a
        // glance at the calendar shows what *kind* of thing each pill is —
        // reuses the same catIconHTML/eventIconKey pattern as the Browse
        // cards, tinted via currentColor to match the pill's tier color.
        // Hidden on mobile (<=480px) where the pill collapses to a plain dot.
        return `<div class="cal-ev-pill tier-${ev.tier}" data-ev-id="${ev.id}" onclick="jumpToEvent(${ev.id})" title="${tooltip}"><span class="cal-ev-pill-icon">${catIconHTML(iconKey, 9)}</span><span class="cal-ev-pill-text">${ev.recurring ? RECUR_ICON : ''}${ev.title}</span></div>`;
      }).join('')}
    </div>`;
  }

  html += '</div>';
  container.innerHTML = html;
  applyCalendarHighlight();
}

function initCalendarNav() {
  const prevBtn = document.getElementById('cal-prev');
  const nextBtn = document.getElementById('cal-next');
  if (!prevBtn || !nextBtn) return;

  function updateCalNavState() {
    prevBtn.disabled = (calYear === 2026 && calMonth <= 3);
    nextBtn.disabled = (calYear === 2026 && calMonth >= 8);
    prevBtn.classList.toggle('cal-nav-disabled', prevBtn.disabled);
    nextBtn.classList.toggle('cal-nav-disabled', nextBtn.disabled);
  }

  prevBtn.addEventListener('click', () => {
    if (prevBtn.disabled) return;
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    buildCalendar();
    updateCalNavState();
  });
  nextBtn.addEventListener('click', () => {
    if (nextBtn.disabled) return;
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    buildCalendar();
    updateCalNavState();
  });
  updateCalNavState();
}

function applyCalendarHighlight() {
  const hasFilter = !!(wizard.when || wizard.who || wizard.vibe);
  document.querySelectorAll('.cal-ev-pill[data-ev-id]').forEach(pill => {
    const ev = EVENTS.find(e => e.id === parseInt(pill.dataset.evId));
    pill.classList.toggle('cal-pill-dim', hasFilter && ev && !wizardEventFilter(ev));
  });
}

// ─── LEAFLET MAP ───────────────────────────────────────────────────────────
let atlMap = null;
const mapMarkers = []; // {marker, layer:'events'|'evergreen', category:string}

function initMap() {
  atlMap = L.map('atl-map', { center:[33.775,-84.39], zoom:12, zoomControl:true, attributionControl:false });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { subdomains:'abcd', maxZoom:19 }).addTo(atlMap);
  function makeIcon(color) {
    return L.divIcon({ className:'', html:`<div style="width:14px;height:14px;background:${color};border:2px solid rgba(255,255,255,0.6);border-radius:50%;box-shadow:0 0 8px ${color}55;"></div>`, iconSize:[14,14], iconAnchor:[7,7] });
  }
  const catColors = { music:'#B45309', family:'#15803D', date:'#D46A8A', group:'#C2410C', comedy:'#D9A441', social:'#5B7C99', outdoor:'#115E59', free:'#5B7C99' };
  function evColor(ev) { return catColors[ev.category] || '#8A7660'; }
  EVENTS.filter(ev => parseLocalDate(ev.date) >= TODAY_MID && ev.lat).forEach(ev => {
    const m = L.marker([ev.lat,ev.lng],{icon:makeIcon(evColor(ev))}).addTo(atlMap);
    m.bindPopup(`<div class="popup-title">${ev.title}</div><div class="popup-sub">${ev.venue} · ${ev.dateStr}</div><span class="popup-tier ${ev.tier}">${ev.score}</span>${ev.ticketUrl?`<a href="${ev.ticketUrl}" target="_blank" class="popup-link">Get Tickets →</a>`:''}`);
    m.bindTooltip(`${ev.title} — ${ev.dateStr}`, { direction:'top', offset:[0,-8], opacity:0.95 });
    mapMarkers.push({marker:m, layer:'events', category:ev.category});
  });
  EVERGREEN.filter(eg => eg.lat).forEach(eg => {
    const m = L.marker([eg.lat,eg.lng],{icon:makeIcon('#4D7C0F')}).addTo(atlMap);
    m.bindPopup(`<div class="popup-title">${eg.emoji} ${eg.name}</div><div class="popup-sub">${eg.description.slice(0,80)}…</div><span class="popup-tier EG">${eg.membershipIncluded?`Member · ${eg.membershipVenue}`:eg.free?'Free':eg.cost||''}</span>${eg.url?`<a href="${eg.url}" target="_blank" class="popup-link">Learn more →</a>`:''}`);
    m.bindTooltip(eg.name, { direction:'top', offset:[0,-8], opacity:0.95 });
    mapMarkers.push({marker:m, layer:'evergreen', category:eg.category});
  });
  const legend = L.control({position:'bottomright'});
  legend.onAdd = () => {
    const div = L.DomUtil.create('div');
    div.innerHTML = `<div style="background:rgba(255,252,246,0.95);border:1px solid rgba(36,26,14,0.18);border-radius:8px;padding:10px 14px;font-size:11px;color:var(--text-muted,#6B5843);line-height:1.9;box-shadow:0 2px 10px rgba(36,26,14,0.12)"><div style="color:var(--text,#241A0E);font-weight:700;margin-bottom:4px;font-size:10px;letter-spacing:.08em">EVENT TYPE</div><div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#B45309;margin-right:6px"></span>🎵 Music</div><div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#D46A8A;margin-right:6px"></span>💑 Date Night</div><div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#C2410C;margin-right:6px"></span>👥 Group</div><div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#15803D;margin-right:6px"></span>👨‍👧 Family</div><div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#4D7C0F;margin-right:6px"></span>🌿 Evergreen</div></div>`;
    return div;
  };
  legend.addTo(atlMap);

  // Filter controls
  document.querySelectorAll('.map-toggle').forEach(btn => {
    btn.addEventListener('click', () => { btn.classList.toggle('active'); applyMapFilters(); });
  });
  document.querySelectorAll('.map-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyMapFilters();
    });
  });
}

function applyMapFilters() {
  const showEvents = document.querySelector('.map-toggle[data-layer="events"]')?.classList.contains('active');
  const showEvergreen = document.querySelector('.map-toggle[data-layer="evergreen"]')?.classList.contains('active');
  const activeCat = document.querySelector('.map-cat-btn.active')?.dataset.cat || 'all';

  mapMarkers.forEach(({marker, layer, category}) => {
    const layerOk = (layer === 'events' && showEvents) || (layer === 'evergreen' && showEvergreen);
    const catOk = activeCat === 'all' || category === activeCat;
    if (layerOk && catOk) {
      if (!atlMap.hasLayer(marker)) atlMap.addLayer(marker);
    } else {
      if (atlMap.hasLayer(marker)) atlMap.removeLayer(marker);
    }
  });
}

// ─── EVERGREEN SECTION ─────────────────────────────────────────────────────
let activeEgCat    = 'all';
let activeEgTime   = 'any';
let activeEgDay    = 'any';
let activeEgAvail  = 'all';
let activeEgEffort = 'all';
const openEgCards = new Set();

function buildEvergreenGrid() {
  const grid = document.getElementById('eg-grid');
  grid.innerHTML = EVERGREEN.map(eg => {
    const memTag  = eg.membershipIncluded ? `<span class="eg-tag member">🏅 Member · ${eg.membershipVenue}</span>` : '';
    const freeTag = eg.free && !eg.membershipIncluded ? `<span class="eg-tag free">💸 Free</span>` : '';
    const costTag = !eg.free && !eg.membershipIncluded && eg.cost ? `<span class="eg-tag">${eg.cost}</span>` : '';
    const effortTag = `<span class="eg-tag">${eg.effort === 'low' ? '🟢' : eg.effort === 'medium' ? '🟡' : '🔴'} ${eg.effort}</span>`;
    const distTag  = `<span class="eg-tag">📍 ${eg.distance}</span>`;
    const timeTag  = eg.timeOfDay !== 'anytime' ? `<span class="eg-tag">${eg.timeOfDay === 'morning' ? '🌅' : eg.timeOfDay === 'afternoon' ? '☀️' : '🌙'} ${eg.timeOfDay}</span>` : '';

    // Harvey balls (single pie-fill circle) replace the old 5-dot scores —
    // one glance instead of counting filled dots.
    const hbDean   = harveyBallHTML(eg.deanScore, 'var(--amber)');
    const hbParent = harveyBallHTML(eg.parentScore, 'var(--teal)');

    const notesHtml = eg.notes ? `<div class="eg-notes">${eg.notes}</div>` : '';
    const urlHtml = eg.url ? `<a href="${eg.url}" target="_blank" rel="noopener" class="eg-link" onclick="event.stopPropagation()">Visit website →</a>` : '';
    const imgHtml = eg.imageUrl ? `<div class="eg-img"><img src="${eg.imageUrl}" alt="${eg.name}" loading="lazy" onerror="this.closest('.eg-img').style.display='none'"></div>` : '';

    // Card face: real photo/logo if we have one, category icon otherwise —
    // the hand-picked per-entry emoji used to show unconditionally even when
    // a real image existed in the drawer below it.
    const faceHtml = eg.imageUrl
      ? `<img src="${eg.imageUrl}" alt="" loading="lazy" onerror="iconFallback(this, '${eg.category}', 22)">`
      : catIconHTML(eg.category, 22);

    const availIcon = eg.availability === 'seasonal' ? '🌸' : eg.availability === 'scheduled' ? '🗓' : null;
    const availTag = availIcon && eg.availabilityNote ? `<span class="eg-tag eg-avail-tag">${availIcon} ${eg.availabilityNote}</span>` : '';

    return `
      <div class="eg-card" data-id="${eg.id}" data-category="${eg.category}"
           data-effort="${eg.effort}" data-distance="${eg.distance}"
           data-timeofday="${eg.timeOfDay}" data-bestdays="${eg.bestDays||'any'}"
           data-availability="${eg.availability||'year-round'}"
           onclick="toggleEgCard('${eg.id}')">
        <div class="eg-card-top">
          <div class="eg-face cat-${eg.category}">${faceHtml}</div>
          <div class="eg-harvey-row">
            <span class="eg-hb-label eg-hb-label-dean">Dean</span>${hbDean}
            <span class="eg-hb-label eg-hb-label-adult">Adult</span>${hbParent}
          </div>
        </div>
        <div class="eg-name">${eg.name}</div>
        <div class="eg-desc">${eg.description}</div>
        <div class="eg-meta">${availTag}${memTag}${freeTag}${costTag}${effortTag}${distTag}${timeTag}</div>
        <div class="eg-drawer">
          ${imgHtml}
          ${notesHtml}
          ${urlHtml}
          ${eg.address ? `<div class="eg-address">📍 ${eg.address}</div>` : ''}
          ${proposeBuilderHTML(eg)}
        </div>
      </div>`;
  }).join('');
}

// ─── PROPOSE A TIME — scheduling poll for a single evergreen activity ──────
// Dima picks 1-4 candidate date/time-block slots for one activity here on
// the main site; the generated link opens propose.html, where a friend
// (no account, no app) multi-selects which slots work and copies a reply
// link back into the same thread. Same no-backend URL-round-trip pattern as
// share.html's event RSVP, just scoped to one activity with open time slots
// instead of a fixed list of already-scheduled events.
const TOD_CODE = { morning: 'm', afternoon: 'a', evening: 'e', anytime: 'x' };

function proposeBuilderHTML(eg) {
  const defaultTod = TOD_CODE[eg.timeOfDay] || 'x';
  return `
    <div class="eg-propose" onclick="event.stopPropagation()">
      <button class="eg-propose-toggle" onclick="toggleProposeBuilder('${eg.id}')">📅 Propose a time to friends</button>
      <div class="eg-propose-builder" id="eg-propose-builder-${eg.id}" style="display:none">
        <div class="eg-propose-slots" id="eg-propose-slots-${eg.id}">
          ${proposeSlotRowHTML(0, defaultTod)}
        </div>
        <button class="eg-propose-add-slot" id="eg-propose-add-${eg.id}" onclick="addProposeSlot('${eg.id}', '${defaultTod}')">+ Add another time option</button>
        <input type="text" class="eg-propose-note" id="eg-propose-note-${eg.id}" placeholder="Optional note — e.g. bring swimsuit" maxlength="140">
        <div class="eg-propose-actions">
          <span class="eg-propose-warn" id="eg-propose-warn-${eg.id}"></span>
          <button class="btn-sm btn-details" id="eg-propose-invite-${eg.id}" onclick="addEvergreenToInvite('${eg.id}')">+ Add to invite</button>
          <button class="btn-sm btn-buy" id="eg-propose-copy-${eg.id}" onclick="copyProposeLink('${eg.id}')">Copy proposal link</button>
        </div>
      </div>
    </div>`;
}

function proposeSlotRowHTML(idx, defaultTod) {
  return `
    <div class="eg-propose-slot" data-idx="${idx}">
      <input type="date" class="eg-propose-date" onchange="updateProposeGapHint(this)">
      <select class="eg-propose-tod">
        <option value="x"${defaultTod==='x'?' selected':''}>Any time</option>
        <option value="m"${defaultTod==='m'?' selected':''}>Morning</option>
        <option value="a"${defaultTod==='a'?' selected':''}>Afternoon</option>
        <option value="e"${defaultTod==='e'?' selected':''}>Evening</option>
      </select>
      <span class="eg-propose-gap-hint"></span>
      <button class="eg-propose-remove-slot" onclick="removeProposeSlot(this)" title="Remove">✕</button>
    </div>`;
}

function toggleProposeBuilder(egId) {
  const panel = document.getElementById(`eg-propose-builder-${egId}`);
  if (!panel) return;
  const open = panel.style.display !== 'none';
  panel.style.display = open ? 'none' : 'block';
}

// "Identify calendar gaps" — the actual value-add over Dima just eyeballing
// his own calendar: flag whether he already has something scored on that
// date so he doesn't propose a playdate on top of a concert.
function updateProposeGapHint(dateInput) {
  const hint = dateInput.parentElement.querySelector('.eg-propose-gap-hint');
  if (!hint) return;
  const dateStr = dateInput.value;
  if (!dateStr) { hint.textContent = ''; return; }
  const count = EVENTS.filter(ev => ev.date === dateStr).length;
  hint.textContent = count ? `📅 ${count} event${count>1?'s':''} that day` : '🟢 open';
  hint.classList.toggle('busy', count > 0);
}

function addProposeSlot(egId, defaultTod) {
  const wrap = document.getElementById(`eg-propose-slots-${egId}`);
  if (!wrap) return;
  const rows = wrap.querySelectorAll('.eg-propose-slot');
  if (rows.length >= 4) return;
  const div = document.createElement('div');
  div.innerHTML = proposeSlotRowHTML(rows.length, defaultTod);
  wrap.appendChild(div.firstElementChild);
  document.getElementById(`eg-propose-add-${egId}`).style.display = rows.length + 1 >= 4 ? 'none' : '';
}

function removeProposeSlot(btn) {
  const wrap = btn.closest('.eg-propose-slots');
  const row = btn.closest('.eg-propose-slot');
  if (wrap.querySelectorAll('.eg-propose-slot').length <= 1) return; // keep at least one
  row.remove();
  const addBtn = wrap.parentElement.querySelector('.eg-propose-add-slot');
  if (addBtn) addBtn.style.display = '';
}

function copyProposeLink(egId) {
  const wrap = document.getElementById(`eg-propose-slots-${egId}`);
  const warn = document.getElementById(`eg-propose-warn-${egId}`);
  const dateEls = Array.from(wrap.querySelectorAll('.eg-propose-date'));
  const slots = Array.from(wrap.querySelectorAll('.eg-propose-slot')).map((row, i) => {
    const date = dateEls[i].value;
    const tod = row.querySelector('.eg-propose-tod').value;
    if (date) { dateEls[i].classList.remove('eg-propose-date-error'); return `${date}_${tod}`; }
    dateEls[i].classList.add('eg-propose-date-error');
    dateEls[i].addEventListener('input', () => dateEls[i].classList.remove('eg-propose-date-error'), { once: true });
    return null;
  }).filter(Boolean);

  if (!slots.length) {
    if (warn) warn.textContent = 'Pick at least one date first (highlighted below)';
    return;
  }
  if (warn) warn.textContent = '';

  const note = document.getElementById(`eg-propose-note-${egId}`).value.trim();
  const base = `${location.origin}${location.pathname.replace(/index\.html$/, '').replace(/\/$/, '')}`;
  const url = new URL(`${base}/propose.html`);
  url.searchParams.set('eg', egId);
  url.searchParams.set('s', slots.join(','));
  if (note) url.searchParams.set('note', note);

  const btn = document.getElementById(`eg-propose-copy-${egId}`);
  const restore = () => setTimeout(() => { btn.textContent = 'Copy proposal link'; }, 1800);
  const text = url.toString();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => { btn.textContent = 'Copied ✓'; restore(); })
      .catch(() => fallbackCopyText(text, btn, restore));
  } else {
    fallbackCopyText(text, btn, restore);
  }
}

function toggleEgCard(id) {
  const card = document.querySelector(`.eg-card[data-id="${id}"]`);
  if (!card) return;
  const isOpen = card.classList.contains('open');
  card.classList.toggle('open', !isOpen);
}

const EG_PAGE_SIZE = 24;
let egGridExpanded = false;

function applyEvergreenFilter() {
  let shownCount = 0;
  let matchCount = 0;
  document.querySelectorAll('.eg-card').forEach(card => {
    const cat  = card.dataset.category;
    const tod  = card.dataset.timeofday;
    const days = card.dataset.bestdays;
    const egId = card.dataset.id;
    const eg   = EVERGREEN.find(e => e.id === egId);

    let show = (activeEgCat === 'all' || cat === activeEgCat);
    if (show && activeEgTime !== 'any') show = (tod === activeEgTime || tod === 'anytime');
    if (show && activeEgDay  !== 'any') show = (days === activeEgDay  || days === 'any');
    if (show && activeEgAvail !== 'all') show = (card.dataset.availability === activeEgAvail);
    if (show && activeEgEffort !== 'all') show = (card.dataset.effort === activeEgEffort);
    // Who — formerly a dim-only opacity overlay applied after the fact, now a
    // real filter predicate like the rest of this function (see Task 2 note
    // on applyEventFilters above).
    if (show && eg && !wizardEvergreenFilter(eg)) show = false;
    if (show && eg && !egMatchesSearch(eg)) show = false;
    if (show && eg && !egMatchesFreeform(eg)) show = false;

    if (show) matchCount++;
    if (show && !egGridExpanded && shownCount >= EG_PAGE_SIZE) show = false;
    if (show) shownCount++;

    card.classList.toggle('hidden', !show);
  });

  const egMoreBtn = document.getElementById('eg-show-more-btn');
  if (egMoreBtn) {
    const truncated = !egGridExpanded && matchCount > EG_PAGE_SIZE;
    egMoreBtn.style.display = truncated ? 'block' : 'none';
    if (truncated) egMoreBtn.textContent = `Show all ${matchCount} evergreen activities`;
  }
}

document.querySelectorAll('.eg-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.eg-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); activeEgCat = btn.dataset.cat; egGridExpanded = false; applyEvergreenFilter();
  });
});
document.querySelectorAll('.eg-chip-time').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.eg-chip-time').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); activeEgTime = btn.dataset.time; egGridExpanded = false; applyEvergreenFilter();
  });
});
document.querySelectorAll('.eg-chip-day').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.eg-chip-day').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); activeEgDay = btn.dataset.day; egGridExpanded = false; applyEvergreenFilter();
  });
});
document.querySelectorAll('.eg-chip-avail').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.eg-chip-avail').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); activeEgAvail = btn.dataset.avail; egGridExpanded = false; applyEvergreenFilter();
  });
});
document.querySelectorAll('.eg-chip-effort').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.eg-chip-effort').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); activeEgEffort = btn.dataset.effort; egGridExpanded = false; applyEvergreenFilter();
  });
});
document.getElementById('eg-show-more-btn')?.addEventListener('click', () => {
  egGridExpanded = true;
  applyEvergreenFilter();
});

// ─── UNIVERSAL SEARCH MODAL (⌘K) ─────────────────────────────────────────────
function initSearchModal() {
  const overlay = document.getElementById('search-overlay');
  const input   = document.getElementById('search-modal-input');
  const results = document.getElementById('search-modal-results');
  let focusedIdx = -1;
  let allResults = [];

  function openModal() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { input.focus(); }, 40);
    input.value = '';
    renderResults('');
  }
  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    focusedIdx = -1;
  }
  window.openSearchModal = openModal;

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      results.innerHTML = '<div class="search-empty-hint">Start typing to search all events and activities</div>';
      allResults = []; return;
    }
    const evMatches = EVENTS.filter(ev => {
      const hay = [ev.title, ev.subtitle, ev.venue, ev.note, ...(ev.genres||[]), ...(ev.lineup||[])].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q) && parseLocalDate(ev.date) >= TODAY_MID;
    }).slice(0, 6);
    const egMatches = EVERGREEN.filter(eg => {
      const hay = [eg.name, eg.description, eg.category, eg.notes].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    }).slice(0, 5);
    allResults = [...evMatches.map(ev=>({type:'event',ev})), ...egMatches.map(eg=>({type:'eg',eg}))];
    if (!allResults.length) { results.innerHTML = '<div class="search-empty-hint">No results found</div>'; return; }

    function scoreBadgeStyle(score) {
      if (score >= 90) return 'rgba(180,83,9,0.22);color:var(--tier-s-ink)';
      if (score >= 75) return 'rgba(194,65,12,0.22);color:var(--tier-a-ink)';
      if (score >= 60) return 'rgba(17,94,89,0.15);color:var(--tier-b-ink)';
      return 'rgba(160,137,102,0.15);color:var(--tier-c-ink)';
    }
    let html = '';
    if (evMatches.length) {
      html += `<div class="search-section-label">Upcoming Events</div>`;
      evMatches.forEach((ev, i) => {
        const bg = scoreBadgeStyle(ev.score);
        const img = ev.imageUrl
          ? `<img class="search-result-img" src="${ev.imageUrl}" alt="" loading="lazy">`
          : ev.youtubeId
          ? `<img class="search-result-img" src="https://img.youtube.com/vi/${ev.youtubeId}/mqdefault.jpg" alt="" loading="lazy">`
          : `<div class="search-result-fallback cat-${ev.category}">${catGlyphHTML(ev, 18)}</div>`;
        html += `<div class="search-result-item" data-idx="${i}" onclick="selectSearchResult(${i})">${img}<div class="search-result-info"><div class="search-result-title">${ev.title}</div><div class="search-result-sub">${ev.venue} · ${ev.dateStr}</div></div><span class="search-result-badge" style="background:${bg.split(';')[0]};${bg.split(';')[1]}">${ev.score}</span></div>`;
      });
    }
    if (egMatches.length) {
      html += `<div class="search-section-label">Evergreen Activities</div>`;
      egMatches.forEach((eg, i) => {
        const idx = evMatches.length + i;
        const badge = eg.free ? `<span class="search-result-badge" style="background:rgba(21,128,61,0.15);color:var(--green)">Free</span>` : eg.membershipIncluded ? `<span class="search-result-badge" style="background:rgba(180,83,9,0.15);color:var(--amber)">Member</span>` : '';
        html += `<div class="search-result-item" data-idx="${idx}" onclick="selectSearchResult(${idx})"><div class="search-result-fallback">${eg.emoji}</div><div class="search-result-info"><div class="search-result-title">${eg.name}</div><div class="search-result-sub">${eg.description.slice(0,60)}…</div></div>${badge}</div>`;
      });
    }
    results.innerHTML = html;
    focusedIdx = -1;
  }

  window.selectSearchResult = function(idx) {
    const r = allResults[idx]; if (!r) return;
    closeModal();
    if (r.type === 'event') {
      jumpToEvent(r.ev.id);
    } else {
      const egSection = document.getElementById('evergreen');
      if (egSection) egSection.scrollIntoView({behavior:'smooth',block:'start'});
      setTimeout(() => {
        let card = document.querySelector(`.eg-card[data-id="${r.eg.id}"]`);
        if (card && card.classList.contains('hidden')) {
          activeEgCat = 'all'; activeEgTime = 'any'; activeEgDay = 'any'; activeEgAvail = 'all'; activeEgEffort = 'all';
          document.querySelectorAll('.eg-chip').forEach(b => b.classList.toggle('active', b.dataset.cat==='all'));
          document.querySelectorAll('.eg-chip-time').forEach(b => b.classList.toggle('active', b.dataset.time==='any'));
          document.querySelectorAll('.eg-chip-day').forEach(b => b.classList.toggle('active', b.dataset.day==='any'));
          document.querySelectorAll('.eg-chip-avail').forEach(b => b.classList.toggle('active', b.dataset.avail==='all'));
          document.querySelectorAll('.eg-chip-effort').forEach(b => b.classList.toggle('active', b.dataset.effort==='all'));
          applyEvergreenFilter();
          card = document.querySelector(`.eg-card[data-id="${r.eg.id}"]`);
        }
        if (card) {
          card.scrollIntoView({behavior:'smooth',block:'center'});
          if (!card.classList.contains('open')) toggleEgCard(r.eg.id);
          card.classList.add('highlight-flash');
          setTimeout(() => card.classList.remove('highlight-flash'), 1800);
        }
      }, 420);
    }
  };

  function moveFocus(dir) {
    const items = results.querySelectorAll('.search-result-item');
    if (!items.length) return;
    items[focusedIdx]?.classList.remove('focused');
    focusedIdx = Math.max(0, Math.min(items.length - 1, focusedIdx + dir));
    items[focusedIdx].classList.add('focused');
    items[focusedIdx].scrollIntoView({block:'nearest'});
  }

  input.addEventListener('input', () => renderResults(input.value));
  input.addEventListener('keydown', e => {
    if      (e.key === 'ArrowDown')                 { e.preventDefault(); moveFocus(1); }
    else if (e.key === 'ArrowUp')                   { e.preventDefault(); moveFocus(-1); }
    else if (e.key === 'Enter' && focusedIdx >= 0)  { selectSearchResult(focusedIdx); }
    else if (e.key === 'Escape')                    { closeModal(); }
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openModal(); }
    if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) { e.preventDefault(); openModal(); }
  });
}

// ─── BACK TO TOP ────────────────────────────────────────────────────────────
const bttBtn = document.getElementById('back-to-top');
if (bttBtn) bttBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

// ─── SCROLL: PROGRESS + NAV + BACK-TO-TOP ──────────────────────────────────
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('progress').style.width = pct + '%';
  if (bttBtn) bttBtn.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
  // Nav: compress links to emoji once hero is scrolled past
  document.getElementById('site-nav')?.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

// ─── HERO STATS ─────────────────────────────────────────────────────────────
function updateHeroStats() {
  const in3mo    = new Date(TODAY_MID.getFullYear(), TODAY_MID.getMonth() + 3, TODAY_MID.getDate());
  const next3    = EVENTS.filter(ev => { const d = parseLocalDate(ev.date); return d >= TODAY_MID && d <= in3mo; });
  const upcoming = EVENTS.filter(ev => parseLocalDate(ev.date) >= TODAY_MID);

  // Event + evergreen counts — just the number, no sub-breakdown (used to
  // show "8 adults · 19 family · 55 all-ages" etc, which was more noise
  // than signal on a card that's supposed to be a glance-able stat).
  const elEv = document.getElementById('stat-ev-count');
  if (elEv) elEv.textContent = next3.length;

  const elEg = document.getElementById('stat-eg-count');
  if (elEg) elEg.textContent = EVERGREEN.length;

  // S+A tier
  const elSA = document.getElementById('stat-sa-count');
  if (elSA) elSA.textContent = upcoming.filter(e => e.score >= 75).length;

  // RSVP count (internal only)
  if (INTERNAL) {
    const rsvpIn = upcoming.filter(e => getRSVP(e.id) === 'in').length;
    const elRsvp = document.getElementById('stat-rsvp-count');
    const elRsvpSub = document.getElementById('stat-rsvp-sub');
    if (elRsvp) elRsvp.textContent = rsvpIn;
    if (elRsvpSub) {
      const maybe = upcoming.filter(e => getRSVP(e.id) === 'maybe').length;
      const attended = EVENTS.filter(e => getRSVP(e.id) === 'attended').length;
      const bits = [];
      if (maybe) bits.push(`${maybe} maybe`);
      if (attended) bits.push(`${attended} attended`);
      elRsvpSub.textContent = bits.length ? bits.join(' · ') : 'Mark events below';
    }
  }
}

// ─── STAR RATINGS (Batch S / item 30b — internal only, calibration feedback) ─
function getStars(scope, id) {
  if (!INTERNAL) return 0;
  return parseInt(localStorage.getItem(`star_${scope}_${id}`) || '0', 10);
}

function setStars(scope, id, n) {
  if (!INTERNAL) return;
  const current = getStars(scope, id);
  const next = current === n ? 0 : n; // clicking the active star clears it
  if (next === 0) localStorage.removeItem(`star_${scope}_${id}`);
  else localStorage.setItem(`star_${scope}_${id}`, String(next));
  const row = document.getElementById(`stars-${scope}-${id}`);
  if (row) row.innerHTML = starButtonsInner(scope, id);
}

function starButtonsInner(scope, id) {
  const current = getStars(scope, id);
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<button class="star-btn${i <= current ? ' filled' : ''}" onclick="setStars('${scope}',${id},${i});event.stopPropagation()">★</button>`;
  }
  return html;
}

function starButtonsHTML(scope, id) {
  return `<div class="star-row" id="stars-${scope}-${id}">${starButtonsInner(scope, id)}</div>`;
}

function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportRatings() {
  const ratings = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const m = key.match(/^star_(ev|inv)_(\d+)$/);
    if (!m) continue;
    const scope = m[1] === 'ev' ? 'event' : 'inventory';
    const id = parseInt(m[2], 10);
    const stars = parseInt(localStorage.getItem(key), 10);
    if (scope === 'event') {
      const ev = EVENTS.find(e => e.id === id);
      if (ev) ratings.push({ scope, id, title: ev.title, venue: ev.venue, score: ev.score, category: ev.category, stars });
    } else {
      const inv = INVENTORY.find(e => e.id === id);
      if (inv) ratings.push({ scope, id, title: inv.title, venue: inv.venue, score: inv.score, category: inv.category, stars });
    }
  }
  downloadJSON({ version: 1, exportedAt: new Date().toISOString(), ratings }, 'ratings_feedback.json');
  const btn = document.getElementById('export-ratings-btn');
  if (btn) { const orig = btn.textContent; btn.textContent = `Downloaded (${ratings.length} ratings)`; setTimeout(() => btn.textContent = orig, 1800); }
}

// ─── SCANNED INVENTORY + SCORE THRESHOLD (Batch S / item 30a) ───────────────
let INVENTORY = [];

function getScoreThreshold() {
  const v = parseInt(localStorage.getItem('atlradar_score_threshold') || '40', 10);
  return isNaN(v) ? 40 : v;
}

function setScoreThreshold(n) {
  localStorage.setItem('atlradar_score_threshold', String(n));
  const label = document.getElementById('score-threshold-value');
  if (label) label.textContent = n;
  renderInventoryPanel();
}

function loadInventory() {
  fetch('scripts/scanned_inventory.json')
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(data => { INVENTORY = data.entries || []; renderInventoryPanel(); })
    .catch(() => {
      const el = document.getElementById('inventory-list');
      if (el) el.innerHTML = '<div class="it-panel-note">Could not load scanned_inventory.json — run <code>python3 scripts/expand_concerts.py</code>.</div>';
      const c = document.getElementById('inv-count-label'); if (c) c.textContent = '';
    });
}

// Footer "last scan" date — read from the scanned_inventory.json export
// timestamp, the freshest signal we have for when the pipeline last ran.
function loadLastScanDate() {
  fetch('scripts/scanned_inventory.json')
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(data => {
      const el = document.getElementById('footer-last-scan');
      if (!el || !data.updatedAt) return;
      const d = new Date(data.updatedAt);
      el.textContent = `Last scan ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    })
    .catch(() => {});
}

function renderInventoryPanel() {
  const list = document.getElementById('inventory-list');
  if (!list) return;
  const threshold = getScoreThreshold();
  const rows = INVENTORY.filter(e => e.score >= threshold).sort((a, b) => b.score - a.score);
  const countLabel = document.getElementById('inv-count-label');
  if (countLabel) countLabel.textContent = `${rows.length} of ${INVENTORY.length} scanned candidates ≥ ${threshold}`;
  if (!rows.length) { list.innerHTML = '<div class="it-panel-note">No scanned candidates at this threshold.</div>'; return; }
  list.innerHTML = rows.map(e => `
    <div class="inv-row">
      <div class="inv-score${e.score >= 70 ? ' hi' : ''}">${e.score}</div>
      <div>
        <div class="inv-title">${e.title}</div>
        <div class="inv-meta">${e.venue ? e.venue + ' · ' : ''}${e.date} · ${e.source}</div>
      </div>
      <div class="inv-decision ${e.decision}">${e.decision}</div>
      ${starButtonsHTML('inv', e.id)}
    </div>`).join('');
}

// ─── PEOPLE ROSTER (Batch S addendum / item 1.6 — overdue-ranked, household-aware) ─
let ROSTER = [];
let rosterFilterGroup = 'all';

function loadRoster() {
  fetch('scripts/invite_context.json')
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(data => { ROSTER = data.people || []; buildRosterTabs(); renderRoster(); })
    .catch(() => {
      const el = document.getElementById('roster-list');
      if (el) el.innerHTML = '<div class="it-panel-note">Could not load invite_context.json — run <code>python3 scripts/social_scan.py --no-cal --export-roster</code>.</div>';
      const c = document.getElementById('roster-count-label'); if (c) c.textContent = '';
    });
}

function buildRosterTabs() {
  const wrap = document.getElementById('roster-tabs');
  if (!wrap) return;
  const groups = new Set();
  ROSTER.forEach(p => (p.groups || []).forEach(g => groups.add(g)));
  const tabs = ['all', ...Array.from(groups).sort()];
  wrap.innerHTML = tabs.map(g =>
    `<button class="roster-tab${g === rosterFilterGroup ? ' active' : ''}" onclick="setRosterFilter('${g.replace(/'/g, "\\'")}')">${g === 'all' ? 'All' : g}</button>`
  ).join('');
}

function setRosterFilter(g) {
  rosterFilterGroup = g;
  buildRosterTabs();
  renderRoster();
}

// Cross-references the local Invite Tracker (item 24) — the closest thing to
// a "who went to what with Dima" record that actually exists today.
function eventsTogetherWith(firstName) {
  const titles = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const m = key.match(/^invite_(\d+)_(.+)$/);
    if (!m || m[2] !== firstName) continue;
    if (localStorage.getItem(key) !== 'in') continue;
    const ev = EVENTS.find(e => e.id === parseInt(m[1], 10));
    if (ev) titles.push(ev.title);
  }
  return titles;
}

function renderRoster() {
  const list = document.getElementById('roster-list');
  if (!list) return;
  const rows = (rosterFilterGroup === 'all' ? ROSTER : ROSTER.filter(p => (p.groups || []).includes(rosterFilterGroup)))
    .slice().sort((a, b) => b.daysOverdue - a.daysOverdue);
  const countLabel = document.getElementById('roster-count-label');
  if (countLabel) countLabel.textContent = `${rows.length} of ${ROSTER.length}`;
  if (!rows.length) { list.innerHTML = '<div class="it-panel-note">No one in this group.</div>'; return; }
  list.innerHTML = rows.map(p => {
    const together = eventsTogetherWith(p.firstName);
    const prov = p.provenance ? `<div class="roster-provenance">current via ${p.provenance}</div>` : '';
    const togetherHtml = together.length ? `<div class="roster-meta">Went together: ${together.slice(0, 2).join(', ')}</div>` : '';
    return `<div class="roster-card">
      <div class="roster-avatar">${p.firstName[0]}</div>
      <div>
        <div class="roster-name">${p.firstName} <span class="roster-meta">T${p.tier}</span></div>
        <div class="roster-meta">${(p.groups || []).join(', ') || '—'}</div>
        ${togetherHtml}
        ${prov}
      </div>
      <div class="roster-overdue${p.daysOverdue > 0 ? ' hot' : ''}">${p.overdueStr}</div>
    </div>`;
  }).join('');
}

// ─── INVITE TRACKER (Batch S / item 24 — phase 1: manual state + JSON export) ─
const INVITE_STATES = ['invited', 'awaiting', 'in', 'out'];

function getInviteState(evId, name) {
  return localStorage.getItem(`invite_${evId}_${name}`) || '';
}

function inviteStateLabel(state) {
  return { invited: 'Invited', awaiting: 'Awaiting', in: 'In', out: 'Out' }[state] || '';
}

function cycleInviteState(evId, name) {
  if (!INTERNAL) return;
  const current = getInviteState(evId, name);
  const idx = INVITE_STATES.indexOf(current);
  const next = idx === -1 ? INVITE_STATES[0] : (idx === INVITE_STATES.length - 1 ? '' : INVITE_STATES[idx + 1]);
  if (next === '') localStorage.removeItem(`invite_${evId}_${name}`);
  else localStorage.setItem(`invite_${evId}_${name}`, next);
  const chip = document.getElementById(`inv-chip-${evId}-${name}`);
  if (chip) {
    chip.className = `invite-chip${next ? ' state-' + next : ''}`;
    chip.textContent = `${name}${next ? ': ' + inviteStateLabel(next) : ''}`;
  }
  renderInviteSummary();
}

function inviteTrackerSectionHTML(ev, slot) {
  if (!slot || !FRIEND_SLOTS[slot]) return '';
  const names = FRIEND_SLOTS[slot].names.filter(n => !n.includes('+')); // skip "Arjun+Kirsten" couple labels
  if (!names.length) return '';
  return `<div class="bs-section invite-tracker-section" onclick="event.stopPropagation()">
    <div class="drawer-section-label">Invite Tracker</div>
    <div class="inv-chip-row">${names.map(n => {
      const state = getInviteState(ev.id, n);
      return `<button class="invite-chip${state ? ' state-' + state : ''}" id="inv-chip-${ev.id}-${n}" onclick="cycleInviteState(${ev.id},'${n}')">${n}${state ? ': ' + inviteStateLabel(state) : ''}</button>`;
    }).join('')}</div>
  </div>`;
}

function renderInviteSummary() {
  const el = document.getElementById('invite-summary-list');
  if (!el) return;
  const perEvent = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const m = key.match(/^invite_(\d+)_(.+)$/);
    if (!m) continue;
    perEvent[m[1]] = perEvent[m[1]] || {};
    perEvent[m[1]][m[2]] = localStorage.getItem(key);
  }
  const evIds = Object.keys(perEvent);
  const countLabel = document.getElementById('invite-count-label');
  if (countLabel) countLabel.textContent = `${evIds.length} event${evIds.length !== 1 ? 's' : ''} tracked`;
  if (!evIds.length) { el.innerHTML = '<div class="it-panel-note">No invite states tracked yet — set them from an event\'s detail sheet.</div>'; return; }
  el.innerHTML = evIds.map(evId => {
    const ev = EVENTS.find(e => e.id === parseInt(evId, 10));
    const counts = {};
    Object.values(perEvent[evId]).forEach(s => counts[s] = (counts[s] || 0) + 1);
    const summary = Object.entries(counts).map(([s, n]) => `${n} ${inviteStateLabel(s)}`).join(' · ');
    return `<div class="inv-row" style="grid-template-columns:1fr auto">
      <div><div class="inv-title">${ev ? ev.title : 'Event #' + evId}</div><div class="inv-meta">${summary}</div></div>
      <div></div>
    </div>`;
  }).join('');
}

function exportInviteTracker() {
  const events = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const m = key.match(/^invite_(\d+)_(.+)$/);
    if (!m) continue;
    const evId = m[1], name = m[2];
    const ev = EVENTS.find(e => e.id === parseInt(evId, 10));
    events[evId] = events[evId] || { eventTitle: ev ? ev.title : '', eventDate: ev ? ev.date : '', people: {} };
    events[evId].people[name] = { state: localStorage.getItem(key), updatedAt: new Date().toISOString() };
  }
  downloadJSON({ version: 1, updatedAt: new Date().toISOString(), events }, 'invite_tracker.json');
}

function importInviteTracker(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      Object.entries(data.events || {}).forEach(([evId, evData]) => {
        Object.entries(evData.people || {}).forEach(([name, info]) => {
          if (info.state) localStorage.setItem(`invite_${evId}_${name}`, info.state);
        });
      });
      renderInviteSummary();
      alert('Invite tracker imported.');
    } catch (e) {
      alert('Could not parse file: ' + e.message);
    }
  };
  reader.readAsText(file);
}

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateHeroStats();
  renderTonight();
  applyEventFilters();
  document.getElementById('show-more-btn')?.addEventListener('click', () => {
    gridExpanded = true;
    applyEventFilters();
  });
  buildCalendar();
  initCalendarNav();
  initSearch();

  buildEvergreenGrid();
  applyEvergreenFilter();
  initEgFreeform();
  decorateMapFilterIcons();
  initMap();
  initSearchModal();
  initViewRouting();
  initDisclosure('cal-disclosure-toggle', 'cal-mini');
  initDisclosure('filters-disclosure-toggle', 'filters-panel');
  initDisclosure('eg-filters-disclosure-toggle', 'eg-filters-panel');
  initDisclosure('threshold-disclosure-toggle', 'threshold-panel');
  // Map is collapsed by default — Leaflet computes tile bounds from the
  // container's size at init, which is 0 while collapsed (max-height:0),
  // so it needs an explicit invalidateSize() once it actually becomes visible.
  initDisclosure('map-disclosure-toggle', 'map-panel', () => {
    setTimeout(() => atlMap?.invalidateSize(), 80);
  });
  initThemeToggle();

  // Score threshold + scanned inventory (Batch S / item 30a) — public, everyone
  // can lower the threshold to see near-miss candidates beyond the curated grid.
  const thInput = document.getElementById('score-threshold-input');
  const thValue = document.getElementById('score-threshold-value');
  if (thInput) {
    thInput.value = getScoreThreshold();
    if (thValue) thValue.textContent = thInput.value;
    thInput.addEventListener('input', () => setScoreThreshold(parseInt(thInput.value, 10)));
  }
  loadInventory();
  loadLastScanDate();

  // Batch S: invite tracker + roster (internal only — friend names/CRM data)
  if (INTERNAL) {
    loadRoster();
    renderInviteSummary();
  }

  // Hero stat: "Top Picks" click → jump to Browse, sorted by score
  const saCard = document.getElementById('stat-sa-count')?.closest('.stat-card');
  if (saCard) {
    saCard.style.cursor = 'pointer';
    saCard.title = 'Click to sort by score';
    saCard.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('sort-score').classList.add('active');
      activeSort = 'score';
      gridExpanded = false;
      applyEventFilters();
      setView('browse', { skipScroll: true });
      document.getElementById('events').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Hero stat: "Evergreen Activities" click → jump to Evergreen section
  const egCard = document.getElementById('stat-eg-count')?.closest('.stat-card');
  if (egCard) {
    egCard.style.cursor = 'pointer';
    egCard.title = 'Click to jump to Evergreen';
    egCard.addEventListener('click', () => {
      setView('browse', { skipScroll: true });
      document.getElementById('evergreen').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

});
