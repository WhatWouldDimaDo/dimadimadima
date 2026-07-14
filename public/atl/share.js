/* ============================================================
   On Dima's Radar — share.js
   Standalone friend-facing picker. Reads three optional URL params that can
   combine freely — a real invite is rarely just "here's a list of tickets":
     ids=1,2,3            — specific EVENTS (existing scored catalog entries)
     eg=<egId>_<date>_<tod>,...   — an EVERGREEN activity proposed for one
                                    specific date + time-of-day
     slots=<date>_<tod>[:<label>],...  — a bare time slot with no fixed
                                    activity ("free Tue evening, want to
                                    hang out?"), optional short label
   All three render as one combined list; the visitor answers Yes/Maybe/Pass
   on each and copies a summary or reply link back into the thread they got
   this from. No accounts, no backend, no personal contact info in this file.
============================================================ */

document.documentElement.setAttribute('data-theme', localStorage.getItem('atlradar_theme') === 'dark' ? 'dark' : 'light');

const CAT_ICON = {
  music:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="17" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>',
  family:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7" r="3"/><path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.2"/><path d="M13.5 20c.3-2.5 2-4.3 4-4.3 2.2 0 4 2 4 4.3"/></svg>',
  comedy:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.3 9.8c.5-1 1.6-1 2.1 0M13.6 9.8c.5-1 1.6-1 2.1 0"/><path d="M7.5 13.3c1 2.3 3 3.7 4.5 3.7s3.5-1.4 4.5-3.7"/></svg>',
  outdoor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-4-1-7-5-7-10a9 9 0 0 1 9-9c5 0 9 4 9 9-5 0-9 4-11 10z"/><path d="M12 21c0-6 3-10 8-13"/></svg>',
  film:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="19" height="16" rx="2"/><circle cx="7.5" cy="9" r="1.2"/><circle cx="16.5" cy="9" r="1.2"/><circle cx="7.5" cy="15" r="1.2"/><circle cx="16.5" cy="15" r="1.2"/><path d="M2.5 12h19"/></svg>',
  social:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="17" r="2.2"/><circle cx="19" cy="17" r="2.2"/><path d="M10.4 6.7 6.6 15.2M13.6 6.7l3.8 8.5M7.4 17h9.2"/></svg>',
  date:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.7-9.8-9.3C.6 7.7 2.4 4 6 4c2.1 0 3.6 1.2 6 3.8C14.4 5.2 15.9 4 18 4c3.6 0 5.4 3.7 3.8 7.2-2.3 4.6-9.8 9.3-9.8 9.3z"/></svg>',
  group:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="8.5" r="2.4"/><path d="M14.5 20c.2-2.7 2.1-4.6 4.5-4.6s4.3 1.9 4.5 4.6"/></svg>',
  solo:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/></svg>',
};
CAT_ICON.papa = CAT_ICON.family;
const CAT_ICON_FALLBACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>';
function catIconHTML(category, px) {
  const svg = CAT_ICON[category] || CAT_ICON_FALLBACK;
  return svg.replace('<svg ', `<svg style="width:${px}px;height:${px}px;display:block" `);
}
function iconFallback(imgEl, category, px) {
  imgEl.outerHTML = catIconHTML(category, px);
}
function ticketLinkLabel(url) {
  return /facebook\.com/i.test(url) ? 'Event Page →' : 'Tickets →';
}

const TOD_LABEL = { m: 'Morning', a: 'Afternoon', e: 'Evening', x: 'Any time' };
const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function formatSlotDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return `${DOW[dt.getDay()]} ${MON[dt.getMonth()]} ${d}`;
}

const params = new URLSearchParams(location.search);
const note = params.get('note');

const rawIds = (params.get('ids') || '').split(',').map(s => Number(s.trim())).filter(n => !Number.isNaN(n));
const rawEg = (params.get('eg') || '').split(',').filter(Boolean).map(str => {
  const [egId, date, tod] = str.split('_');
  return { egId, date, tod: tod || 'x' };
}).filter(item => item.date && EVERGREEN.some(e => e.id === item.egId));
const rawSlots = (params.get('slots') || '').split(',').filter(Boolean).map(str => {
  // First colon splits date_tod from the label — URLSearchParams already
  // decoded the whole &slots= value once, so this is the literal string;
  // no per-label decode needed (and doing one would double-decode).
  const colonIdx = str.indexOf(':');
  const dateTod = colonIdx === -1 ? str : str.slice(0, colonIdx);
  const label = colonIdx === -1 ? '' : str.slice(colonIdx + 1);
  const [date, tod] = dateTod.split('_');
  return { date, tod: tod || 'x', label };
}).filter(item => /^\d{4}-\d{2}-\d{2}$/.test(item.date || ''));

// One combined, date-sorted list — this is the whole point of the unified
// link: a friend sees events, evergreen proposals, and open time slots
// together, not as three separate things to piece together.
const offers = [];
rawIds.forEach(id => {
  const ev = EVENTS.find(e => e.id === id);
  if (ev) offers.push({ key: `e${id}`, type: 'event', date: ev.date, data: ev });
});
rawEg.forEach((item, i) => {
  const eg = EVERGREEN.find(e => e.id === item.egId);
  if (eg) offers.push({ key: `g${i}`, type: 'evergreen', date: item.date, data: { eg, date: item.date, tod: item.tod } });
});
rawSlots.forEach((item, i) => {
  offers.push({ key: `s${i}`, type: 'slot', date: item.date, data: item });
});
offers.sort((a, b) => a.date.localeCompare(b.date));

// 'yes' | 'maybe' | 'pass' | null per offer key. Nothing pre-selected —
// defaulting everything to "yes" meant a friend could send back a summary
// without ever actually choosing anything. If this link came back FROM a
// friend (has a &resp= param), pre-fill their actual answers instead.
const RESP_CODE = { yes: 'y', maybe: 'm', pass: 'p' };
const RESP_FROM_CODE = { y: 'yes', m: 'maybe', p: 'pass' };
const responses = new Map(offers.map(o => [o.key, null]));
(params.get('resp') || '').split(',').forEach(pair => {
  const [key, code] = pair.split(':');
  if (RESP_FROM_CODE[code] && responses.has(key)) responses.set(key, RESP_FROM_CODE[code]);
});

function rsvpRowHTML(key) {
  const cur = responses.get(key);
  return `<div class="share-rsvp-row" role="group" aria-label="Your response">
    <button class="share-rsvp-btn share-rsvp-yes${cur==='yes'?' active':''}" onclick="setResponse('${key}','yes')">Yes</button>
    <button class="share-rsvp-btn share-rsvp-maybe${cur==='maybe'?' active':''}" onclick="setResponse('${key}','maybe')">Maybe</button>
    <button class="share-rsvp-btn share-rsvp-pass${cur==='pass'?' active':''}" onclick="setResponse('${key}','pass')">Pass</button>
  </div>`;
}

function eventCardHTML(offer) {
  const ev = offer.data;
  const thumbInner = ev.imageUrl
    ? `<img src="${ev.imageUrl}" alt="" loading="lazy" onerror="iconFallback(this, '${ev.category}', 22)">`
    : ev.youtubeId
    ? `<img src="https://img.youtube.com/vi/${ev.youtubeId}/mqdefault.jpg" alt="" loading="lazy" onerror="this.style.display='none'">`
    : catIconHTML(ev.category, 22);
  const buyBtn = ev.ticketUrl
    ? `<a href="${ev.ticketUrl}" target="_blank" rel="noopener" class="btn-sm btn-buy" onclick="event.stopPropagation()">${ticketLinkLabel(ev.ticketUrl)}</a>`
    : '';
  const genreTags = (ev.genres || []).slice(0, 3).map(g => `<span class="share-tag">${g}</span>`).join('');
  const lineupLine = ev.lineup && ev.lineup.length ? `<div class="share-card-lineup">Lineup: ${ev.lineup.join(', ')}</div>` : '';

  return `
    <div class="share-card tier-${ev.tier}" id="share-card-${offer.key}">
      <div class="share-card-thumb er-thumb cat-${ev.category}">${thumbInner}</div>
      <div class="share-card-body">
        <div class="share-card-title">${ev.title}${ev.subtitle ? `<span class="share-card-subtitle"> — ${ev.subtitle}</span>` : ''}</div>
        <div class="share-card-meta">${ev.dateStr}${ev.time ? ' · ' + ev.time : ''} · 📍 ${ev.venue}${ev.distance ? ` · ${ev.distance}` : ''}</div>
        <div class="share-card-tags">${genreTags}</div>
        ${ev.note ? `<div class="share-card-note">${ev.note}</div>` : ''}
        ${lineupLine}
        ${buyBtn}
        ${rsvpRowHTML(offer.key)}
      </div>
      <span class="share-score tier-${ev.tier}">
        <span class="share-score-num">${ev.score}</span>
        <span class="share-score-label">match</span>
      </span>
    </div>`;
}

function evergreenCardHTML(offer) {
  const { eg, date, tod } = offer.data;
  const thumbInner = eg.imageUrl
    ? `<img src="${eg.imageUrl}" alt="" loading="lazy" onerror="iconFallback(this, '${eg.category}', 22)">`
    : catIconHTML(eg.category, 22);
  const effortTag = `<span class="share-tag">${eg.effort === 'low' ? '🟢' : eg.effort === 'medium' ? '🟡' : '🔴'} ${eg.effort}</span>`;
  const distTag = `<span class="share-tag">📍 ${eg.distance}</span>`;

  return `
    <div class="share-card share-card-proposal" id="share-card-${offer.key}">
      <div class="share-card-thumb er-thumb cat-${eg.category}">${thumbInner}</div>
      <div class="share-card-body">
        <div class="share-card-title">${eg.name}</div>
        <div class="share-card-meta">📅 ${formatSlotDate(date)} · ${TOD_LABEL[tod] || 'Any time'}</div>
        <div class="share-card-tags">${effortTag}${distTag}</div>
        ${eg.description ? `<div class="share-card-note">${eg.description}</div>` : ''}
        ${rsvpRowHTML(offer.key)}
      </div>
      <span class="share-score share-score-proposal" title="Proposed activity">📅</span>
    </div>`;
}

function slotCardHTML(offer) {
  const { date, tod, label } = offer.data;
  return `
    <div class="share-card share-card-proposal" id="share-card-${offer.key}">
      <div class="share-card-thumb share-card-thumb-slot">🕐</div>
      <div class="share-card-body">
        <div class="share-card-title">${label || 'Want to hang out?'}</div>
        <div class="share-card-meta">📅 ${formatSlotDate(date)} · ${TOD_LABEL[tod] || 'Any time'}</div>
        ${rsvpRowHTML(offer.key)}
      </div>
      <span class="share-score share-score-proposal" title="Open time slot">🕐</span>
    </div>`;
}

function offerCardHTML(offer) {
  if (offer.type === 'event') return eventCardHTML(offer);
  if (offer.type === 'evergreen') return evergreenCardHTML(offer);
  return slotCardHTML(offer);
}

function setResponse(key, value) {
  responses.set(key, value);
  const card = document.getElementById(`share-card-${key}`);
  if (card) {
    card.querySelectorAll('.share-rsvp-btn').forEach(b => b.classList.remove('active'));
    card.querySelector(`.share-rsvp-${value}`)?.classList.add('active');
  }
  updateCount();
}

function updateCount() {
  const answered = Array.from(responses.values()).filter(Boolean).length;
  document.getElementById('share-selected-count').textContent = `${answered}/${offers.length}`;
}

function offerLabel(o) {
  if (o.type === 'event') return `${o.data.title} (${o.data.dateStr}${o.data.time ? ' · ' + o.data.time : ''})`;
  if (o.type === 'evergreen') return `${o.data.eg.name} — ${formatSlotDate(o.data.date)} (${TOD_LABEL[o.data.tod] || 'any time'})`;
  return `${o.data.label || 'Hang out'} — ${formatSlotDate(o.data.date)} (${TOD_LABEL[o.data.tod] || 'any time'})`;
}

function buildSummary() {
  const byResponse = { yes: [], maybe: [], pass: [] };
  offers.forEach(o => { const r = responses.get(o.key); if (r) byResponse[r].push(o); });
  const section = (label, arr) => arr.length
    ? `${label}:\n${arr.map(o => `- ${offerLabel(o)}`).join('\n')}`
    : '';
  const parts = [section('Yes', byResponse.yes), section('Maybe', byResponse.maybe), section('Pass', byResponse.pass)].filter(Boolean);
  return parts.length ? `My picks:\n\n${parts.join('\n\n')}` : "Haven't picked anything yet — check Yes/Maybe/Pass on a few first.";
}

// ─── CALENDAR VIEW — plots every offer type on a month grid, one grid per
// distinct month present in the URL so a short-range invite stays compact.
function monthGridHTML(year, month, offersInMonth) {
  const byDate = {};
  offersInMonth.forEach(o => { (byDate[o.date] = byDate[o.date] || []).push(o); });

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let offset = firstDay.getDay() - 1;
  if (offset < 0) offset = 6;

  let cells = '';
  for (let i = 0; i < offset; i++) cells += `<div class="share-cal-cell share-cal-cell-empty"></div>`;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const evs = byDate[dateStr] || [];
    const dots = evs.map(o => {
      const cls = o.type === 'event' ? `tier-${o.data.tier}` : 'proposal';
      const title = o.type === 'event' ? o.data.title : offerLabel(o);
      return `<span class="share-cal-dot ${cls}" title="${title}" onclick="jumpToShareCard('${o.key}')"></span>`;
    }).join('');
    cells += `<div class="share-cal-cell${evs.length ? ' has-ev' : ''}"><span class="share-cal-num">${day}</span><div class="share-cal-dots">${dots}</div></div>`;
  }

  return `
    <div class="share-cal-month">
      <div class="share-cal-month-title">${MON_FULL[month]} ${year}</div>
      <div class="share-cal-dow-row">${DOW_LABELS.map(d => `<div class="share-cal-dow">${d}</div>`).join('')}</div>
      <div class="share-cal-grid">${cells}</div>
    </div>`;
}
const MON_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW_LABELS = ['MO','TU','WE','TH','FR','SA','SU'];

function buildCalendarView() {
  const months = new Map(); // 'YYYY-M' -> offers[]
  offers.forEach(o => {
    const [y, m] = o.date.split('-').map(Number);
    const key = `${y}-${m}`;
    if (!months.has(key)) months.set(key, []);
    months.get(key).push(o);
  });
  const html = Array.from(months.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, evs]) => {
      const [y, m] = key.split('-').map(Number);
      return monthGridHTML(y, m - 1, evs);
    }).join('');
  document.getElementById('share-calendar').innerHTML = html;
}

function jumpToShareCard(key) {
  setView('list');
  const card = document.getElementById(`share-card-${key}`);
  if (!card) return;
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.classList.add('flash');
  setTimeout(() => card.classList.remove('flash'), 1200);
}

function setView(view) {
  document.getElementById('share-list').style.display = view === 'list' ? '' : 'none';
  document.getElementById('share-calendar').style.display = view === 'calendar' ? '' : 'none';
  document.getElementById('share-view-list-btn').classList.toggle('active', view === 'list');
  document.getElementById('share-view-cal-btn').classList.toggle('active', view === 'calendar');
}

// Builds a link that encodes every answered response as key:code pairs
// (y/m/p) in a &resp= param — opening it pre-fills those exact answers, so
// Dima can see "this one was yes, this one was maybe" without needing the
// plain-text summary at all.
function buildResponseLink() {
  const pairs = offers.filter(o => responses.get(o.key)).map(o => `${o.key}:${RESP_CODE[responses.get(o.key)]}`);
  const base = `${location.origin}${location.pathname}`;
  const url = new URL(base);
  if (rawIds.length) url.searchParams.set('ids', rawIds.join(','));
  if (note) url.searchParams.set('note', note);
  if (rawEg.length) url.searchParams.set('eg', rawEg.map(it => `${it.egId}_${it.date}_${it.tod}`).join(','));
  if (rawSlots.length) {
    url.searchParams.set('slots', rawSlots.map(it =>
      `${it.date}_${it.tod}${it.label ? ':' + it.label : ''}`
    ).join(','));
  }
  if (pairs.length) url.searchParams.set('resp', pairs.join(','));
  return url.toString();
}

function copyResponseLink() {
  const url = buildResponseLink();
  const btn = document.getElementById('share-copy-link-btn');
  const restore = () => setTimeout(() => { btn.textContent = 'Copy link with my answers'; }, 1800);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url)
      .then(() => { btn.textContent = 'Copied ✓ — paste into your reply'; restore(); })
      .catch(() => fallbackCopy(url, btn, restore));
  } else {
    fallbackCopy(url, btn, restore);
  }
}

function copyPicks() {
  const text = buildSummary();
  const btn = document.getElementById('share-copy-btn');
  const restore = () => setTimeout(() => { btn.textContent = 'Copy my picks'; }, 1800);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => { btn.textContent = 'Copied ✓ — paste into your reply'; restore(); })
      .catch(() => fallbackCopy(text, btn, restore));
  } else {
    fallbackCopy(text, btn, restore);
  }
}

function fallbackCopy(text, btn, restore) {
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
    btn.textContent = 'Copied ✓ — paste into your reply';
  } catch (e) {
    btn.textContent = 'Copy failed — select text below';
  }
  ta.style.position = 'fixed';
  ta.style.top = '-9999px';
  ta.style.left = '-9999px';
  restore();
}

function init() {
  if (note) document.getElementById('share-sub').textContent = note;
  if (!offers.length) {
    document.getElementById('share-empty').style.display = 'block';
    document.getElementById('share-bottom-bar').style.display = 'none';
    document.getElementById('share-view-toggle').style.display = 'none';
    return;
  }
  document.getElementById('share-list').innerHTML = offers.map(offerCardHTML).join('');
  buildCalendarView();
  updateCount();
}

init();
