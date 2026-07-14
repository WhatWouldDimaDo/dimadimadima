/* ============================================================
   On Dima's Radar — propose.js
   Standalone friend-facing scheduling poll for ONE evergreen activity.
   Reads ?eg=<id>&s=<date>_<tod>,...(&note=...) from the URL, renders the
   activity plus candidate time slots as multi-select pills, and lets the
   visitor copy a reply (as a link or as plain text) back into the thread
   they got this from. No accounts, no backend — mirrors share.js's
   URL-round-trip pattern, just scoped to one activity with open slots
   instead of a fixed list of already-scheduled events.
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

function harveyBallHTML(n, color) {
  const pct = Math.max(0, Math.min(1, n / 5));
  const deg = Math.round(pct * 360);
  return `<span class="harvey-ball" style="color:${color};background:conic-gradient(${color} ${deg}deg, transparent ${deg}deg)" title="${n}/5"></span>`;
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
const egId = params.get('eg');
const eg = EVERGREEN.find(e => e.id === egId);
const rawSlots = (params.get('s') || '').split(',').filter(Boolean).map(pair => {
  const [date, tod] = pair.split('_');
  return { date, tod: tod || 'x' };
}).filter(s => /^\d{4}-\d{2}-\d{2}$/.test(s.date));
const note = params.get('note');

// Selected slot indices, or the special 'none' sentinel — pre-filled from
// &resp= if this link is a friend's reply bouncing back to Dima.
const selected = new Set();
let noneWork = false;
(params.get('resp') || '').split(',').filter(Boolean).forEach(v => {
  if (v === 'none') noneWork = true;
  else { const n = Number(v); if (!Number.isNaN(n)) selected.add(n); }
});

function activityHTML() {
  const faceHtml = eg.imageUrl
    ? `<img src="${eg.imageUrl}" alt="" loading="lazy" onerror="iconFallback(this, '${eg.category}', 26)">`
    : catIconHTML(eg.category, 26);
  const hbDean = harveyBallHTML(eg.deanScore, '#B45309');
  const hbParent = harveyBallHTML(eg.parentScore, '#115E59');
  const effortTag = `<span class="eg-tag">${eg.effort === 'low' ? '🟢' : eg.effort === 'medium' ? '🟡' : '🔴'} ${eg.effort}</span>`;
  const distTag = `<span class="eg-tag">📍 ${eg.distance}</span>`;
  const freeTag = eg.free ? `<span class="eg-tag free">💸 Free</span>` : '';

  return `
    <div class="propose-face cat-${eg.category}">${faceHtml}</div>
    <div class="propose-activity-body">
      <div class="propose-activity-name">${eg.name}</div>
      <div class="propose-activity-desc">${eg.description}</div>
      <div class="eg-meta">${freeTag}${effortTag}${distTag}</div>
      <div class="propose-harvey-row">
        <span class="eg-hb-label eg-hb-label-dean">Dean</span>${hbDean}
        <span class="eg-hb-label eg-hb-label-adult">Adult</span>${hbParent}
      </div>
    </div>`;
}

function slotPillHTML(slot, idx) {
  return `<button class="propose-slot-pill${selected.has(idx) ? ' active' : ''}" data-idx="${idx}" onclick="toggleSlot(${idx})">
    <span class="propose-slot-date">${formatSlotDate(slot.date)}</span>
    <span class="propose-slot-tod">${TOD_LABEL[slot.tod] || 'Any time'}</span>
  </button>`;
}

function toggleSlot(idx) {
  if (noneWork) toggleNoneWork(); // picking a real slot cancels "none work"
  if (selected.has(idx)) selected.delete(idx); else selected.add(idx);
  document.querySelector(`.propose-slot-pill[data-idx="${idx}"]`)?.classList.toggle('active');
  updateCount();
}

function toggleNoneWork() {
  noneWork = !noneWork;
  if (noneWork) { selected.clear(); document.querySelectorAll('.propose-slot-pill:not(.propose-none-btn)').forEach(p => p.classList.remove('active')); }
  document.getElementById('propose-none-btn')?.classList.toggle('active', noneWork);
  updateCount();
}

function updateCount() {
  const el = document.getElementById('propose-selected-count');
  if (el) el.textContent = noneWork ? 'None work' : selected.size;
}

function buildResponseLink() {
  const base = `${location.origin}${location.pathname}`;
  const url = new URL(base);
  url.searchParams.set('eg', egId);
  url.searchParams.set('s', rawSlots.map(s => `${s.date}_${s.tod}`).join(','));
  if (note) url.searchParams.set('note', note);
  const respVal = noneWork ? 'none' : Array.from(selected).sort((a, b) => a - b).join(',');
  if (respVal) url.searchParams.set('resp', respVal);
  return url.toString();
}

function buildPlainAnswer() {
  if (noneWork) return `None of the times for "${eg.name}" work for me — got other options?`;
  if (!selected.size) return `Haven't picked a time yet for "${eg.name}" — check a slot first.`;
  const list = Array.from(selected).sort((a, b) => a - b)
    .map(i => `${formatSlotDate(rawSlots[i].date)} (${TOD_LABEL[rawSlots[i].tod] || 'any time'})`)
    .join(', ');
  return `I'm free for "${eg.name}": ${list}`;
}

function copyResponseLink() {
  const url = buildResponseLink();
  const btn = document.getElementById('propose-copy-link-btn');
  const restore = () => setTimeout(() => { btn.textContent = 'Copy link with my answer'; }, 1800);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url)
      .then(() => { btn.textContent = 'Copied ✓ — paste into your reply'; restore(); })
      .catch(() => fallbackCopy(url, btn, restore));
  } else {
    fallbackCopy(url, btn, restore);
  }
}

function copyPlainAnswer() {
  const text = buildPlainAnswer();
  const btn = document.getElementById('propose-copy-text-btn');
  const restore = () => setTimeout(() => { btn.textContent = 'Copy plain text'; }, 1800);
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
  if (!eg || !rawSlots.length) {
    document.getElementById('propose-empty').style.display = 'block';
    document.getElementById('propose-activity').style.display = 'none';
    document.getElementById('propose-slots-wrap').style.display = 'none';
    document.getElementById('propose-bottom-bar').style.display = 'none';
    return;
  }
  if (note) {
    const line = document.getElementById('propose-note-line');
    line.textContent = `"${note}"`;
    line.style.display = 'block';
  }
  document.getElementById('propose-activity').innerHTML = activityHTML();
  document.getElementById('propose-slots').innerHTML = rawSlots.map(slotPillHTML).join('');
  document.getElementById('propose-none-btn').classList.toggle('active', noneWork);
  updateCount();
}

init();
