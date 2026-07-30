/* Condesa Days — app.js
   Plan / Browse / Map. Plans persist to localStorage and encode into the URL hash
   so a built plan can be sent to someone else.

   Drag: pointer events, not HTML5 drag-and-drop — the latter does not fire on
   iOS Safari, which is the primary target here. */

(function () {
  "use strict";

  var D = window.CDMX;
  if (!D) { console.error("CDMX data missing"); return; }

  /* Same key as before. The value used to be a bare plan object (v1); it is now a
     versioned wrapper { v:2, plan, visits } — loadStore() migrates the old shape
     on read, so a device or shared link still on v1 keeps working. */
  var LS_KEY = "condesa_plan_v1";
  var byId = {};
  D.places.forEach(function (p) { byId[p.id] = p; });

  var CAT = D.categories;
  var WHEN = D.whenLabels;

  /* ───────────────────────── state ───────────────────────── */

  var state = {
    view: "plan",
    day: D.days[0].id,
    plan: {},
    visits: {},
    q: "",
    fWhen: null,
    fCat: null,
    fSrc: null,
    fTags: [],
    mapCat: null,
    mapSrc: null,
    mapVisited: null,
    userPos: null,
    density: (function () {
      try { return localStorage.getItem("condesa_density") || "card"; } catch (e) { return "card"; }
    })()
  };

  function blankPlan() {
    var o = {};
    D.days.forEach(function (d) { o[d.id] = []; });
    return o;
  }

  function normalisePlan(raw) {
    var out = blankPlan();
    if (!raw || typeof raw !== "object") return out;
    Object.keys(out).forEach(function (dayId) {
      var arr = Array.isArray(raw[dayId]) ? raw[dayId] : [];
      out[dayId] = arr
        .filter(function (it) { return it && byId[it.p]; })
        .map(function (it) {
          return { p: it.p, s: slotExists(it.s) ? it.s : "afternoon", n: it.n || "" };
        });
    });
    return out;
  }

  function slotExists(id) {
    return D.slots.some(function (s) { return s.id === id && !s.block; });
  }

  function isoToday() {
    var d = new Date();
    var mm = ("0" + (d.getMonth() + 1)).slice(-2);
    var dd = ("0" + d.getDate()).slice(-2);
    return d.getFullYear() + "-" + mm + "-" + dd;
  }

  function normaliseVisits(raw) {
    var out = {};
    if (!raw || typeof raw !== "object") return out;
    Object.keys(raw).forEach(function (id) {
      if (!byId[id]) return;
      var v = raw[id];
      if (!v || typeof v !== "object") return;
      out[id] = {
        on: typeof v.on === "string" ? v.on : isoToday(),
        note: typeof v.note === "string" ? v.note : ""
      };
    });
    return out;
  }

  /* Accepts either shape: a v1 bare plan object (old localStorage value and old
     share links), or the current v2 wrapper. Anything else — null, a corrupt
     parse, garbage — falls through to empty plan/visits rather than throwing. */
  function normaliseStore(raw) {
    if (raw && typeof raw === "object" && raw.v === 2) {
      return { plan: normalisePlan(raw.plan), visits: normaliseVisits(raw.visits) };
    }
    return { plan: normalisePlan(raw), visits: normaliseVisits(null) };
  }

  function loadStore() {
    var fromUrl = readHash();
    if (fromUrl) {
      var shared = normaliseStore(fromUrl);
      state.plan = shared.plan;
      state.visits = shared.visits;
      saveStore();
      toast("Shared plan loaded");
      return;
    }
    var stored = null;
    try { stored = JSON.parse(localStorage.getItem(LS_KEY)); } catch (e) {}

    if (stored) {
      var mine = normaliseStore(stored);
      state.plan = mine.plan;
      state.visits = mine.visits;
      return;
    }
    // First visit on this device only. Seeding is recorded straight away so that
    // clearing a day and reloading does not bring the suggestions back.
    state.plan = normalisePlan(D.seed || {});
    state.visits = normaliseVisits(D.seedVisits || null);
    saveStore();
  }

  function saveStore() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ v: 2, plan: state.plan, visits: state.visits }));
    } catch (e) {}
  }

  /* base64url round-trip that survives non-ASCII (accented place names) */
  function b64e(str) {
    var bytes = new TextEncoder().encode(str), bin = "";
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function b64d(str) {
    var s = str.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    var bin = atob(s), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function readHash() {
    var m = /[#&]p=([^&]+)/.exec(location.hash || "");
    if (!m) return null;
    try { return JSON.parse(b64d(m[1])); } catch (e) { return null; }
  }
  function shareUrl() {
    return location.origin + location.pathname + "#p=" +
      b64e(JSON.stringify({ v: 2, plan: state.plan, visits: state.visits }));
  }

  /* ───────────────────────── helpers ───────────────────────── */

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var toastT;
  function toast(msg) {
    var el = $("#toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { el.hidden = true; }, 2200);
  }

  function travelLine(p) {
    if (p.walk != null) return p.walk + " min walk";
    if (p.uber) return "Uber ~" + p.uber.min + " min" + (p.uber.mxn ? " · " + p.uber.mxn : "");
    return "";
  }

  function confClass(c) {
    return c === "VERIFIED" ? "conf--v" : c === "LIKELY" ? "conf--l" : "conf--u";
  }
  function confShort(c) {
    return c === "VERIFIED" ? "CONFIRMED" : c === "LIKELY" ? "LIKELY" : "CHECK";
  }

  function mapsUrl(p) {
    return "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(p.lat + "," + p.lng) + "&query_place_id=";
  }

  /* ───────────────────────── "been there" ───────────────────────── */

  function toggleVisit(id) {
    if (!byId[id]) return;
    if (state.visits[id]) delete state.visits[id];
    else state.visits[id] = { on: isoToday(), note: "" };
    saveStore();
  }

  var noteTimers = {};
  function setVisitNote(id, note) {
    if (!state.visits[id]) return;
    state.visits[id].note = note;
    clearTimeout(noteTimers[id]);
    noteTimers[id] = setTimeout(function () {
      saveStore();
      refreshBackgroundViews();
    }, 600);
  }

  /* Redraws whichever view is currently on screen after a visit toggle or a
     debounced note save, so the change shows up without switching tabs. */
  function refreshBackgroundViews() {
    if (state.view === "browse") renderCards();
    if (state.view === "plan") renderPlan();
    if (map) renderMarkers({ fit: false });
  }

  function beenBtnHtml(p) {
    var on = !!state.visits[p.id];
    var label = on ? ("Remove visited mark from " + p.name) : ("Mark " + p.name + " as been there");
    return '<button class="beenbtn' + (on ? " is-on" : "") + '" type="button" data-been="' + esc(p.id) +
      '" aria-pressed="' + on + '" aria-label="' + esc(label) + '" title="Been there">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>' +
      "</button>";
  }

  /* ───────────────────────── views ───────────────────────── */

  /* Category accents are plain hex (Leaflet needs real colours, not var()), so the
     dark variants have to be chosen here rather than by the cascade. */
  var darkMQ = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  var SRC = D.sources || {};
  function srcOf(id) { return SRC[id] || { label: id, icon: "\u25CE", blurb: "" }; }

  function catOf(id) {
    var c = CAT[id] || { label: id, icon: "\u2022", color: "#666", soft: "rgba(0,0,0,.08)" };
    var dark = darkMQ && darkMQ.matches;
    return {
      label: c.label, icon: c.icon,
      color: dark && c.colorDark ? c.colorDark : c.color,
      soft:  dark && c.softDark  ? c.softDark  : c.soft
    };
  }

  function setView(v) {
    // Leaving the Map view: stop watching position so it doesn't drain the battery.
    if (state.view === "map" && v !== "map" && locWatchId != null) stopLocate();
    state.view = v;
    $$(".tab").forEach(function (t) {
      var on = t.dataset.view === v;
      t.classList.toggle("is-on", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$(".view").forEach(function (s) { s.hidden = s.id !== "view-" + v; });
    $$(".view").forEach(function (s) { s.classList.toggle("is-on", s.id === "view-" + v); });
    if (v === "map") initMap();
    if (v === "guides" && !openGuideId) { $("#guideGrid").hidden = false; $(".guides-intro").hidden = false; $("#guideRead").hidden = true; }
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  /* ───────────────────────── plan ───────────────────────── */

  function renderDaystrip() {
    $("#daystrip").innerHTML = D.days.map(function (d) {
      return '<button type="button" class="daybtn' +
        (d.id === state.day ? " is-on" : "") + (d.travel ? " is-travel" : "") +
        '" data-day="' + d.id + '" role="tab" aria-selected="' + (d.id === state.day) + '">' +
        "<span>" + esc(d.dow) + "</span><strong>" + esc(d.dnum) + "</strong></button>";
    }).join("");
  }

  function renderPlan() {
    var day = D.days.filter(function (d) { return d.id === state.day; })[0];
    renderDaystrip();
    $("#dayTitle").innerHTML = (day.daynum ? '<span class="daynum">' + esc(day.daynum) + "</span>" : "") + esc(day.title);
    $("#daySub").textContent = day.sub || "";

    $("#fixedRow").innerHTML = (day.anchors || []).map(function (a) {
      return '<span class="anchor' + (a.hard ? " is-hard" : "") + '"><b>' +
        esc(a.time) + "</b> " + esc(a.label) + "</span>";
    }).join("");

    var items = state.plan[state.day] || [];
    $("#timeline").innerHTML = D.slots.map(function (slot) {
      if (slot.block) {
        return '<li class="slot is-block"><div class="slot-time">' + esc(slot.time) +
          '</div><div class="slot-body"><div class="blockcard"><h3>' + esc(slot.label) +
          "</h3><p>" + esc(slot.note || "") + "</p></div></div></li>";
      }
      var mine = items.filter(function (it) { return it.s === slot.id; });
      var body = mine.map(function (it, i) {
        var p = byId[it.p];
        var visit = state.visits[p.id];
        return '<div class="item" data-slot="' + slot.id + '" data-idx="' + i + '">' +
          '<button class="item-grip" type="button" aria-label="Move ' + esc(p.name) + '" data-grip="1">' +
          '<svg viewBox="0 0 13 20" fill="currentColor" aria-hidden="true">' +
          '<circle cx="3" cy="3" r="1.6"/><circle cx="10" cy="3" r="1.6"/>' +
          '<circle cx="3" cy="10" r="1.6"/><circle cx="10" cy="10" r="1.6"/>' +
          '<circle cx="3" cy="17" r="1.6"/><circle cx="10" cy="17" r="1.6"/></svg></button>' +
          '<button class="item-main" type="button" data-detail="' + p.id + '"><h3>' + esc(p.name) +
          (visit ? ' <span class="item-been">✓ Been there</span>' : "") + "</h3>" +
          '<div class="item-meta">' + esc([p.colonia, travelLine(p), p.cost].filter(Boolean).join(" · ")) + "</div>" +
          (it.n ? '<div class="item-note">' + esc(it.n) + "</div>" : "") +
          (visit && visit.note ? '<div class="item-visit-note">' + esc(visit.note) + "</div>" : "") +
          "</button>" +
          '<button class="item-x" type="button" aria-label="Remove ' + esc(p.name) + '" data-rm="' + slot.id + ":" + i + '">✕</button>' +
          "</div>";
      }).join("");

      return '<li class="slot" data-slotrow="' + slot.id + '"><div class="slot-time">' + esc(slot.time) +
        '</div><div class="slot-body"><span class="slot-label">' + esc(slot.label) + "</span>" +
        body +
        '<div class="dropzone" data-drop="' + slot.id + '">' +
        '<button type="button" data-addto="' + slot.id + '">＋ Add something</button></div>' +
        "</div></li>";
    }).join("");
  }

  /* ───────────────────────── browse ───────────────────────── */

  function renderChips() {
    $("#chipsWhen").innerHTML = Object.keys(WHEN).map(function (k) {
      return '<button type="button" class="chip' + (state.fWhen === k ? " is-on" : "") +
        '" data-group="when" data-val="' + k + '">' + esc(WHEN[k]) + "</button>";
    }).join("");

    $("#chipsCat").innerHTML = Object.keys(CAT).map(function (k) {
      return '<button type="button" class="chip' + (state.fCat === k ? " is-on" : "") +
        '" data-group="cat" data-val="' + k + '">' + catOf(k).icon + " " + esc(CAT[k].label) + "</button>";
    }).join("");

    $("#chipsSrc").innerHTML = Object.keys(SRC).map(function (k) {
      return '<button type="button" class="chip chip--src' + (state.fSrc === k ? " is-on" : "") +
        '" data-group="src" data-val="' + k + '">' + SRC[k].icon + " " + esc(SRC[k].label) + "</button>";
    }).join("");

    $("#chipsTag").innerHTML = D.filterTags.map(function (t) {
      return '<button type="button" class="chip' + (state.fTags.indexOf(t.id) > -1 ? " is-on" : "") +
        '" data-group="tag" data-val="' + t.id + '">' + esc(t.label) + "</button>";
    }).join("");
  }

  function matches(p) {
    if (state.fWhen && (p.when || []).indexOf(state.fWhen) === -1) return false;
    if (state.fCat && p.cat !== state.fCat) return false;
    if (state.fSrc && p.src !== state.fSrc) return false;
    for (var i = 0; i < state.fTags.length; i++) {
      // "Been there" is live per-device state, not a data tag — check visits instead.
      if (state.fTags[i] === "been") {
        if (!state.visits[p.id]) return false;
      } else if ((p.tags || []).indexOf(state.fTags[i]) === -1) return false;
    }
    if (state.q) {
      var hay = [p.name, p.colonia, p.blurb, p.benefit, (p.tags || []).join(" "), CAT[p.cat] && CAT[p.cat].label]
        .join(" ").toLowerCase();
      if (hay.indexOf(state.q.toLowerCase()) === -1) return false;
    }
    return true;
  }

  function cardHtml(p) {
    var c = catOf(p.cat);
    var sc = srcOf(p.src);
    var visit = state.visits[p.id];
    var visited = !!visit;
    var meta = esc([c.label, p.colonia, travelLine(p)].filter(Boolean).join(" \u00b7 "));

    /* compact: a thumbnail row, nothing else */
    if (state.density === "list") {
      return '<article class="pcard pcard--list' + (visited ? " pcard--visited" : "") + '" data-place="' + p.id + '">' +
        '<img class="pcard-thumb" src="img/' + p.id + '.jpg" alt="" loading="lazy" decoding="async" onerror="this.style.visibility=\'hidden\'">' +
        '<div class="pcard-head"><h2>' + esc(p.name) + (visited ? ' <span class="item-been">\u2713</span>' : "") + "</h2>" +
          '<div class="pcard-sub">' + meta + "</div>" +
          '<div class="pcard-srcline"><span class="srcdot src--' + esc(p.src) + '">' + sc.icon + "</span>" + esc(sc.label) + "</div>" +
        "</div>" +
        beenBtnHtml(p) +
        '<button class="pcard-add" type="button" data-add="' + p.id + '" aria-label="Add ' + esc(p.name) + ' to a day">\uFF0B</button>' +
        "</article>";
    }

    var whenTags = (p.when || []).map(function (w) {
      return '<span class="tag tag--when">' + esc(WHEN[w] || w) + "</span>";
    }).join("");
    var featTags = (p.tags || []).slice(0, state.density === "full" ? 99 : 6).map(function (t) {
      var warn = t === "book-ahead" || t === "closed-mon" || t === "verify";
      return '<span class="tag' + (warn ? " tag--warn" : "") + '">' + esc(tagLabel(t)) + "</span>";
    }).join("");

    var facts = state.density === "full" ? '<div class="pcard-facts">' +
      [["Hours", p.hours], ["Cost", p.cost], ["Budget", p.duration],
       ["If it rains", p.rain === "indoor" ? "Indoors \u2014 fine" : p.rain === "partial" ? "Partly covered" : "Outdoors \u2014 bail"]]
      .filter(function (f) { return f[1]; })
      .map(function (f) { return "<span><b>" + esc(f[0]) + "</b> " + esc(f[1]) + "</span>"; }).join("") + "</div>" : "";

    return '<article class="pcard' + (visited ? " pcard--visited" : "") + '" data-place="' + p.id + '">' +
      '<img class="pcard-img" src="img/' + p.id + '.jpg" alt="" loading="lazy" decoding="async" onerror="this.remove()">' +
      (visited ? '<span class="visited-flag">\u2713 Been there</span>' : "") +
      '<div class="pcard-top">' +
        '<div class="pcard-kind" style="background:' + c.soft + ';color:' + c.color + '">' + c.icon + "</div>" +
        '<div class="pcard-head"><h2>' + esc(p.name) + "</h2>" +
          '<div class="pcard-sub">' + esc([p.colonia, travelLine(p), p.duration || ""].filter(Boolean).join(" \u00b7 ")) + "</div>" +
        "</div>" +
        beenBtnHtml(p) +
        '<button class="pcard-add" type="button" data-add="' + p.id + '" aria-label="Add ' + esc(p.name) + ' to a day">\uFF0B</button>' +
      "</div>" +
      '<div class="pcard-srcline"><span class="srcdot src--' + esc(p.src) + '">' + sc.icon + "</span>" + esc(sc.label) + "</div>" +
      '<p class="pcard-blurb">' + esc(p.blurb) + "</p>" +
      (p.benefit ? '<div class="pcard-why"><b>Why it works.</b> ' + esc(p.benefit) + "</div>" : "") +
      (state.density === "full" && p.notes ? '<p class="pcard-notes">' + esc(p.notes) + "</p>" : "") +
      facts +
      (visited && visit.note ? '<p class="pcard-note"><b>Your note.</b> ' + esc(visit.note) + "</p>" : "") +
      '<div class="tagrow">' + '<span class="tag tag--cat">' + c.icon + " " + esc(c.label) + "</span>" + whenTags + featTags + "</div>" +
      '<div class="pcard-foot">' +
        '<button class="linky" type="button" data-detail="' + p.id + '">Details</button>' +
        (p.link ? '<a href="' + esc(p.link) + '" target="_blank" rel="noopener">More info \u2197</a>' : "") +
        '<span class="conf ' + confClass(p.confidence) + '">' + confShort(p.confidence) + "</span>" +
      "</div>" +
      "</article>";
  }

  function tagLabel(t) {
    var found = D.filterTags.filter(function (x) { return x.id === t; })[0];
    if (found) return found.label;
    return t.replace(/-/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function renderCards() {
    var list = D.places.filter(matches);
    $("#resultCount").textContent = list.length + (list.length === 1 ? " place" : " places");
    $("#cards").innerHTML = list.length
      ? list.map(cardHtml).join("")
      : '<p class="empty">Nothing matches those filters.<br>Try clearing one.</p>';
  }

  /* ───────────────────────── detail sheet ───────────────────────── */

  function openSheet(id) {
    var p = byId[id];
    if (!p) return;
    var c = catOf(p.cat);
    var visit = state.visits[p.id];
    var facts = [
      ["Getting there", travelLine(p) || "—"],
      ["Hours", p.hours || "—"],
      ["Cost", p.cost || "—"],
      ["Budget", p.duration || "—"],
      ["Best", (p.when || []).map(function (w) { return WHEN[w] || w; }).join(", ") || "—"],
      ["If it rains", p.rain === "indoor" ? "Indoors — fine" : p.rain === "partial" ? "Partly covered" : "Outdoors — bail"]
    ];

    var beenSection =
      "<h3>Been there?</h3>" +
      '<div class="sheet-been">' +
        '<button class="btn ' + (visit ? "btn--fill" : "btn--out") + '" type="button" data-beentoggle="' + p.id +
          '" aria-pressed="' + (!!visit) + '">' + (visit ? "✓ Been there" : "Mark as been there") + "</button>" +
        (visit ? '<span class="sheet-been-date">Visited ' + esc(visit.on) + "</span>" : "") +
      "</div>" +
      (visit
        ? '<label class="sheet-notelabel" for="sheetNote">What did you make of it?</label>' +
          '<textarea class="sheet-note" id="sheetNote" data-noteplace="' + p.id +
            '" placeholder="Notes for next time…">' + esc(visit.note || "") + "</textarea>"
        : "");

    $("#sheetBody").innerHTML =
      '<img class="sheet-img" src="img/' + p.id + '.jpg" alt="" loading="lazy" onerror="this.remove()">' +
      "<h2>" + esc(p.name) + "</h2>" +
      '<div class="sub">' + esc([c.label, p.colonia, p.address].filter(Boolean).join(" · ")) + "</div>" +
      "<p>" + esc(p.blurb) + "</p>" +
      (p.benefit ? "<h3>Why it works</h3><p>" + esc(p.benefit) + "</p>" : "") +
      beenSection +
      "<h3>Where this came from</h3>" +
      '<p class="sheet-src"><span class="srcdot src--' + esc(p.src) + '">' + srcOf(p.src).icon + "</span>" +
        "<b>" + esc(srcOf(p.src).label) + ".</b> " + esc(srcOf(p.src).blurb) + "</p>" +
      "<h3>The facts</h3><div class=\"facts\">" +
        facts.map(function (f) { return '<div class="fact"><b>' + esc(f[0]) + "</b><span>" + esc(f[1]) + "</span></div>"; }).join("") +
      "</div>" +
      (p.notes ? "<h3>Worth knowing</h3><p>" + esc(p.notes) + "</p>" : "") +
      (p.confidence !== "VERIFIED"
        ? "<h3>Confidence</h3><p>" + (p.confidence === "LIKELY"
            ? "Consistent across sources but not confirmed with the venue. Worth a quick check before you build the day around it."
            : "Not confirmed. Call or check before going.") + "</p>"
        : "") +
      '<div class="sheet-actions">' +
        '<button class="btn btn--fill" type="button" data-add="' + p.id + '">Add to a day</button>' +
        '<a class="btn btn--out" href="' + esc(mapsUrl(p)) + '" target="_blank" rel="noopener">Open in Maps</a>' +
        (p.link ? '<a class="btn btn--out" href="' + esc(p.link) + '" target="_blank" rel="noopener">More info</a>' : "") +
      "</div>";

    $("#sheet").hidden = false;
    $("#sheetScrim").hidden = false;
  }
  function closeSheet() { $("#sheet").hidden = true; $("#sheetScrim").hidden = true; }

  /* ───────────────────────── add picker ───────────────────────── */

  function openPickDay(placeId) {
    var p = byId[placeId];
    if (!p) return;
    var open = D.slots.filter(function (s) { return !s.block; });

    $("#pickBody").innerHTML =
      "<h2>Add " + esc(p.name) + "</h2>" +
      '<div class="sub">Pick a day, then a time block.</div>' +
      '<div class="picklist">' +
        D.days.map(function (d) {
          return '<button class="pickrow" type="button" data-pickday="' + d.id + '" data-pickplace="' + placeId + '">' +
            "<div><strong>" + esc(d.label) + "</strong><span>" + esc(d.title) + "</span></div>" +
            "<em>" + (state.plan[d.id] || []).length + "</em></button>";
        }).join("") +
      "</div>";
    $("#pick").hidden = false;
    $("#pickScrim").hidden = false;
    $("#pick").dataset.slots = open.map(function (s) { return s.id; }).join(",");
  }

  function openPickSlot(placeId, dayId) {
    var p = byId[placeId];
    var d = D.days.filter(function (x) { return x.id === dayId; })[0];
    var suggested = p.when || [];

    $("#pickBody").innerHTML =
      "<h2>" + esc(p.name) + "</h2>" +
      '<div class="sub">' + esc(d.label) + " — which block?</div>" +
      '<div class="picklist">' +
        D.slots.filter(function (s) { return !s.block; }).map(function (s) {
          var fit = suggested.indexOf(s.fits) > -1;
          return '<button class="pickrow" type="button" data-place="' + placeId +
            '" data-day="' + dayId + '" data-slot="' + s.id + '">' +
            "<div><strong>" + esc(s.label) + "</strong><span>" + esc(s.time) + "</span></div>" +
            (fit ? "<em>good fit</em>" : "") + "</button>";
        }).join("") +
      "</div>";
  }

  function openPickPlace(slotId) {
    var slot = D.slots.filter(function (s) { return s.id === slotId; })[0];
    var fits = D.places.filter(function (p) { return (p.when || []).indexOf(slot.fits) > -1; });
    var rest = D.places.filter(function (p) { return (p.when || []).indexOf(slot.fits) === -1; });
    var list = fits.concat(rest);

    $("#pickBody").innerHTML =
      "<h2>" + esc(slot.label) + "</h2>" +
      '<div class="sub">' + esc(slot.time) + " — best fits first</div>" +
      '<div class="picklist">' +
        list.map(function (p) {
          var c = catOf(p.cat);
          return '<button class="pickrow" type="button" data-place="' + p.id +
            '" data-day="' + state.day + '" data-slot="' + slotId + '">' +
            "<div><strong>" + (c.icon || "") + " " + esc(p.name) + "</strong><span>" +
            esc([p.colonia, travelLine(p)].filter(Boolean).join(" · ")) + "</span></div>" +
            ((p.when || []).indexOf(slot.fits) > -1 ? "<em>fits</em>" : "") + "</button>";
        }).join("") +
      "</div>";
    $("#pick").hidden = false;
    $("#pickScrim").hidden = false;
  }

  function closePick() { $("#pick").hidden = true; $("#pickScrim").hidden = true; }

  function addToPlan(placeId, dayId, slotId) {
    if (!state.plan[dayId]) state.plan[dayId] = [];
    state.plan[dayId].push({ p: placeId, s: slotId, n: "" });
    saveStore();
    closePick(); closeSheet();
    state.day = dayId;
    setView("plan");
    renderPlan();
    toast(byId[placeId].name + " → " + D.days.filter(function (d) { return d.id === dayId; })[0].label);
  }

  /* ───────────────────────── pointer drag ───────────────────────── */

  var drag = null;

  function onPointerDown(e) {
    var grip = e.target.closest("[data-grip]");
    if (!grip) return;
    var item = grip.closest(".item");
    if (!item) return;
    // A second finger landing mid-drag must not hijack the in-flight one —
    // otherwise the first finger's pointerup finalises a move on the wrong item.
    if (drag) return;
    e.preventDefault();

    drag = {
      slot: item.dataset.slot,
      idx: +item.dataset.idx,
      el: item,
      proxy: null,
      id: e.pointerId,
      moved: false
    };
    // setPointerCapture throws if the pointer is already gone. Without this catch
    // the drag state would be left set and the re-entrancy guard above would then
    // block every future drag until a reload.
    try {
      grip.setPointerCapture(e.pointerId);
    } catch (err) {
      drag = null;
      return;
    }
    grip.addEventListener("pointermove", onPointerMove);
    grip.addEventListener("pointerup", onPointerUp);
    grip.addEventListener("pointercancel", onPointerUp);
  }

  function onPointerMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.moved) {
      drag.moved = true;
      drag.el.classList.add("is-dragging");
      var p = byId[state.plan[state.day][findIndex(drag.slot, drag.idx)].p];
      var proxy = document.createElement("div");
      proxy.className = "drag-proxy";
      proxy.textContent = p.name;
      document.body.appendChild(proxy);
      drag.proxy = proxy;
    }
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.proxy.style.left = e.clientX + "px";
    drag.proxy.style.top = e.clientY + "px";
    highlightZone(e.clientX, e.clientY);
    startAutoScroll();
  }

  function highlightZone(x, y) {
    $$(".dropzone").forEach(function (z) { z.classList.remove("is-hot"); });
    var zone = zoneAt(x, y);
    if (zone) zone.classList.add("is-hot");
  }

  /* The timeline is far taller than a phone screen, so a drag has to be able to
     scroll the page or most slots are simply unreachable. */
  var EDGE = 90, MAX_STEP = 14, autoRAF = null;

  function startAutoScroll() {
    if (autoRAF) return;
    autoRAF = requestAnimationFrame(function step() {
      if (!drag || !drag.moved) { autoRAF = null; return; }
      var h = window.innerHeight, dy = 0;
      if (drag.y < EDGE) dy = -MAX_STEP * (1 - drag.y / EDGE);
      else if (drag.y > h - EDGE) dy = MAX_STEP * (1 - (h - drag.y) / EDGE);
      if (dy) {
        // Explicitly instant: the stylesheet sets scroll-behavior:smooth, which
        // would otherwise fight a per-frame scroll and make the drag stutter.
        window.scrollBy({ top: dy, left: 0, behavior: "instant" });
        highlightZone(drag.x, drag.y);
      }
      autoRAF = requestAnimationFrame(step);
    });
  }

  function stopAutoScroll() {
    if (autoRAF) { cancelAnimationFrame(autoRAF); autoRAF = null; }
  }

  function onPointerUp(e) {
    // Same guard as onPointerMove: only the pointer that started this drag may end it.
    if (!drag || e.pointerId !== drag.id) return;
    stopAutoScroll();
    var zone = drag.moved ? zoneAt(e.clientX, e.clientY) : null;
    if (drag.proxy) drag.proxy.remove();
    drag.el.classList.remove("is-dragging");
    $$(".dropzone").forEach(function (z) { z.classList.remove("is-hot"); });

    if (zone && zone.dataset.drop !== drag.slot) {
      var arr = state.plan[state.day];
      var real = findIndex(drag.slot, drag.idx);
      if (real > -1) {
        arr[real].s = zone.dataset.drop;
        saveStore();
        renderPlan();
        toast("Moved");
      }
    }
    drag = null;
  }

  /* index within the flat day array for the Nth item of a given slot */
  function findIndex(slotId, nth) {
    var arr = state.plan[state.day] || [], seen = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].s === slotId) {
        if (seen === nth) return i;
        seen++;
      }
    }
    return -1;
  }

  function zoneAt(x, y) {
    var el = document.elementFromPoint(x, y);
    return el ? el.closest(".dropzone") : null;
  }

  /* ───────────────────────── map ───────────────────────── */

  var map = null, baseLayer = null, placesLayer = null, locLayer = null;

  function hasCoords(p) { return p.lat != null && p.lng != null; }

  function haversineMeters(lat1, lng1, lat2, lng2) {
    var R = 6371000, toRad = function (d) { return d * Math.PI / 180; };
    var dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  function distLabel(m) {
    return m < 950 ? Math.round(m) + " m" : (m / 1000).toFixed(1) + " km";
  }

  function matchesMap(p) {
    if (state.mapCat && p.cat !== state.mapCat) return false;
    if (state.mapSrc && p.src !== state.mapSrc) return false;
    if (state.mapVisited === "been" && !state.visits[p.id]) return false;
    if (state.mapVisited === "not" && state.visits[p.id]) return false;
    return true;
  }

  /* Visited pins invert: hollow with a coloured ring and a tick, instead of a
     solid fill with the category glyph — a filled/hollow difference at a glance. */
  function pinHtml(p) {
    var c = catOf(p.cat);
    var visited = !!state.visits[p.id];
    var style = visited ? "background:var(--card);border-color:" + c.color : "background:" + c.color;
    var inner = visited
      ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="' + c.color +
        '" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>'
      : c.icon;
    return '<div class="pin' + (visited ? " pin--visited" : "") + '" style="' + style + '"><i>' + inner + "</i></div>";
  }

  function popupHtml(p) {
    var dist = state.userPos ? haversineMeters(state.userPos.lat, state.userPos.lng, p.lat, p.lng) : null;
    return "<b>" + esc(p.name) + "</b><br>" + esc(travelLine(p)) +
      (dist != null ? "<br>" + distLabel(dist) + " from you" : "") +
      (state.visits[p.id] ? "<br>✓ Been there" : "") +
      '<br><a href="#" data-pop="' + p.id + '">Details</a>';
  }

  function renderMapChips() {
    $("#mapChipsCat").innerHTML = Object.keys(CAT).map(function (k) {
      return '<button type="button" class="chip' + (state.mapCat === k ? " is-on" : "") +
        '" data-group="mapcat" data-val="' + k + '">' + catOf(k).icon + " " + esc(CAT[k].label) + "</button>";
    }).join("");
    $("#mapChipsSrc").innerHTML = Object.keys(SRC).map(function (k) {
      return '<button type="button" class="chip chip--src' + (state.mapSrc === k ? " is-on" : "") +
        '" data-group="mapsrc" data-val="' + k + '">' + SRC[k].icon + " " + esc(SRC[k].label) + "</button>";
    }).join("");
    var visOpts = [{ v: "been", label: "Been there" }, { v: "not", label: "Not yet" }];
    $("#mapChipsVisited").innerHTML = visOpts.map(function (o) {
      return '<button type="button" class="chip' + (state.mapVisited === o.v ? " is-on" : "") +
        '" data-group="mapvisited" data-val="' + o.v + '">' + esc(o.label) + "</button>";
    }).join("");
  }

  /* Rebuilds the place markers against the current filters. Pass {fit:false} to
     leave the viewport alone — used for visited-state refreshes and geolocation
     ticks, where jumping the map around would be disorientating. */
  function renderMarkers(opts) {
    opts = opts || {};
    placesLayer.clearLayers();
    var list = D.places.filter(hasCoords).filter(matchesMap);
    var pts = [[D.base.lat, D.base.lng]];
    list.forEach(function (p) {
      pts.push([p.lat, p.lng]);
      L.marker([p.lat, p.lng], {
        icon: L.divIcon({ className: "", iconSize: [24, 24], iconAnchor: [12, 24], popupAnchor: [0, -22], html: pinHtml(p) })
      }).addTo(placesLayer).bindPopup(popupHtml(p));
    });
    $("#mapCount").textContent = list.length + (list.length === 1 ? " place shown" : " places shown");
    if (opts.fit !== false && pts.length > 1) map.fitBounds(L.latLngBounds(pts).pad(0.12));
  }

  function initMap() {
    if (map) {
      setTimeout(function () { map.invalidateSize(); }, 60);
      renderMarkers({ fit: false });
      return;
    }

    map = L.map("map", { zoomSnap: 0.5, scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    baseLayer = L.layerGroup().addTo(map);
    placesLayer = L.layerGroup().addTo(map);
    locLayer = L.layerGroup().addTo(map);

    var b = D.base;
    L.marker([b.lat, b.lng], {
      icon: L.divIcon({
        className: "", iconSize: [24, 24], iconAnchor: [12, 12],
        html: '<div class="pin pin--base" style="background:' + "#241C16" + '"><i>★</i></div>'
      }),
      zIndexOffset: 1000
    }).addTo(baseLayer).bindPopup("<b>" + esc(b.name) + "</b><br>" + esc(b.colonia));

    renderMapChips();
    renderMarkers({ fit: true });

    $("#mapLegend").innerHTML = Object.keys(CAT).map(function (k) {
      return '<span class="legchip"><span class="legdot" style="background:' + catOf(k).color + '"></span>' +
        esc(CAT[k].label) + "</span>";
    }).join("") + '<span class="legchip"><span class="legdot legdot--visited"></span>Been there</span>';

    map.on("popupopen", function (ev) {
      var a = ev.popup.getElement().querySelector("[data-pop]");
      if (a) a.addEventListener("click", function (e) {
        e.preventDefault();
        openSheet(a.dataset.pop);
      });
    });
  }

  /* ───────────────────────── where am I ───────────────────────── */

  var locWatchId = null, locFirstFix = false;

  function accentHex() {
    return darkMQ && darkMQ.matches ? "#F2718A" : "#D9455F";
  }

  function setLocStatus(msg) {
    var el = $("#locStatus");
    if (!el) return;
    el.hidden = !msg;
    el.textContent = msg || "";
  }

  function drawUserMarker(lat, lng, acc) {
    locLayer.clearLayers();
    var color = accentHex();
    L.circle([lat, lng], { radius: acc || 30, color: color, weight: 1, fillColor: color, fillOpacity: .12 }).addTo(locLayer);
    L.marker([lat, lng], {
      icon: L.divIcon({ className: "", iconSize: [18, 18], iconAnchor: [9, 9], html: '<div class="pin-user"></div>' }),
      zIndexOffset: 2000
    }).addTo(locLayer).bindPopup("You are here" + (acc ? " · accuracy ±" + Math.round(acc) + " m" : ""));
  }

  function updateNearest() {
    var card = $("#mapCard");
    if (!state.userPos) { card.hidden = true; return; }
    var list = D.places.filter(hasCoords).filter(matchesMap).map(function (p) {
      return { p: p, d: haversineMeters(state.userPos.lat, state.userPos.lng, p.lat, p.lng) };
    }).sort(function (a, b) { return a.d - b.d; }).slice(0, 5);
    card.hidden = false;
    card.innerHTML = "<h3>Nearest to you</h3><ul class=\"nearlist\">" +
      list.map(function (x) {
        return '<li><button type="button" class="nearrow" data-pop="' + x.p.id + '"><span>' + esc(x.p.name) +
          "</span><b>" + distLabel(x.d) + "</b></button></li>";
      }).join("") + "</ul>";
  }

  function onGeoPosition(pos) {
    var lat = pos.coords.latitude, lng = pos.coords.longitude, acc = pos.coords.accuracy;
    state.userPos = { lat: lat, lng: lng, accuracy: acc };
    drawUserMarker(lat, lng, acc);
    if (locFirstFix) {
      map.setView([lat, lng], Math.max(map.getZoom(), 15));
      locFirstFix = false;
      renderMarkers({ fit: false });
    }
    updateNearest();
    setLocStatus("Accuracy ±" + Math.round(acc) + " m");
  }

  function onGeoError(err) {
    var msg = "Couldn't get your location.";
    if (err.code === 1) msg = "Location access was declined — allow it in your browser's site settings to use this.";
    else if (err.code === 2) msg = "Your position isn't available right now.";
    else if (err.code === 3) msg = "Finding your location timed out. Try again.";
    setLocStatus(msg);
    stopLocate({ clearStatus: false });
  }

  function startLocate() {
    if (!("geolocation" in navigator)) {
      setLocStatus("Geolocation isn't supported in this browser.");
      return;
    }
    if (!window.isSecureContext) {
      setLocStatus("Location needs a secure (https) connection — this works on the live site, not over plain http on a phone.");
      return;
    }
    locFirstFix = true;
    state.userPos = null;
    setLocStatus("Finding you…");
    $("#locateBtn").classList.add("is-on");
    $("#locateBtn").setAttribute("aria-pressed", "true");
    locWatchId = navigator.geolocation.watchPosition(onGeoPosition, onGeoError, {
      enableHighAccuracy: true, maximumAge: 10000, timeout: 20000
    });
  }

  function stopLocate(opts) {
    opts = opts || {};
    if (locWatchId != null) { navigator.geolocation.clearWatch(locWatchId); locWatchId = null; }
    $("#locateBtn").classList.remove("is-on");
    $("#locateBtn").setAttribute("aria-pressed", "false");
    if (locLayer) locLayer.clearLayers();
    state.userPos = null;
    var card = $("#mapCard");
    if (card) card.hidden = true;
    if (opts.clearStatus !== false) setLocStatus("");
  }

  /* ───────────────────────── events ───────────────────────── */

  document.addEventListener("click", function (e) {
    var t = e.target;

    var tab = t.closest(".tab");
    if (tab) return setView(tab.dataset.view);

    var day = t.closest("[data-day]:not(.pickrow)");
    if (day && day.classList.contains("daybtn")) {
      state.day = day.dataset.day;
      renderPlan();
      return;
    }

    var chip = t.closest(".chip");
    if (chip) {
      var g = chip.dataset.group, v = chip.dataset.val;
      if (g === "when") { state.fWhen = state.fWhen === v ? null : v; renderChips(); renderCards(); }
      else if (g === "cat") { state.fCat = state.fCat === v ? null : v; renderChips(); renderCards(); }
      else if (g === "src") { state.fSrc = state.fSrc === v ? null : v; renderChips(); renderCards(); }
      else if (g === "tag") {
        var i = state.fTags.indexOf(v);
        if (i > -1) state.fTags.splice(i, 1); else state.fTags.push(v);
        renderChips(); renderCards();
      } else if (g === "mapcat") { state.mapCat = state.mapCat === v ? null : v; renderMapChips(); renderMarkers({ fit: true }); }
      else if (g === "mapsrc") { state.mapSrc = state.mapSrc === v ? null : v; renderMapChips(); renderMarkers({ fit: true }); }
      else if (g === "mapvisited") { state.mapVisited = state.mapVisited === v ? null : v; renderMapChips(); renderMarkers({ fit: true }); }
      return;
    }

    if (t.closest("#clearFilters")) {
      state.fWhen = null; state.fCat = null; state.fSrc = null; state.fTags = [];
      renderChips(); renderCards();
      return;
    }

    if (t.closest("#mapClearFilters")) {
      state.mapCat = null; state.mapSrc = null; state.mapVisited = null;
      renderMapChips(); renderMarkers({ fit: true });
      return;
    }

    if (t.closest("#locateBtn")) {
      if (locWatchId != null) stopLocate(); else startLocate();
      return;
    }

    var near = t.closest(".nearrow");
    if (near) return openSheet(near.dataset.pop);

    var det = t.closest("[data-detail]");
    if (det) return openSheet(det.dataset.detail);

    var add = t.closest("[data-add]");
    if (add) return openPickDay(add.dataset.add);

    var addto = t.closest("[data-addto]");
    if (addto) return openPickPlace(addto.dataset.addto);

    var been = t.closest("[data-been]");
    if (been) {
      toggleVisit(been.dataset.been);
      renderCards();
      if (map) renderMarkers({ fit: false });
      return;
    }

    var beenToggle = t.closest("[data-beentoggle]");
    if (beenToggle) {
      toggleVisit(beenToggle.dataset.beentoggle);
      openSheet(beenToggle.dataset.beentoggle);
      refreshBackgroundViews();
      return;
    }

    var pd = t.closest("[data-pickday]");
    if (pd) return openPickSlot(pd.dataset.pickplace, pd.dataset.pickday);

    var row = t.closest(".pickrow[data-slot]");
    if (row) return addToPlan(row.dataset.place, row.dataset.day, row.dataset.slot);

    var rm = t.closest("[data-rm]");
    if (rm) {
      var parts = rm.dataset.rm.split(":");
      var real = findIndex(parts[0], +parts[1]);
      if (real > -1) {
        var name = byId[state.plan[state.day][real].p].name;
        state.plan[state.day].splice(real, 1);
        saveStore(); renderPlan();
        toast(name + " removed");
      }
      return;
    }

    var card = t.closest(".pcard");
    if (card && !t.closest("button") && !t.closest("a")) return openSheet(card.dataset.place);

    if (t.closest("#sheetClose") || t.closest("#sheetScrim")) return closeSheet();
    if (t.closest("#pickClose") || t.closest("#pickScrim")) return closePick();

    if (t.closest("#resetDayBtn")) {
      if (!(state.plan[state.day] || []).length) return toast("Nothing to reset");
      state.plan[state.day] = [];
      saveStore(); renderPlan();
      toast("Day cleared");
      return;
    }

    if (t.closest("#shareBtn")) {
      var url = shareUrl();
      history.replaceState(null, "", "#p=" + url.split("#p=")[1]);
      if (navigator.share) {
        navigator.share({ title: "Condesa Days — our plan", url: url }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () { toast("Link copied"); },
          function () { toast("Copy the URL from the address bar"); });
      } else {
        toast("Copy the URL from the address bar");
      }
      return;
    }

    if (t.closest("#helpBtn")) {
      $("#sheetBody").innerHTML =
        "<h2>About this guide</h2>" +
        "<p>" + esc(D.about) + "</p>" +
        "<h3>How the plan works</h3>" +
        "<p>Browse places, tap ＋ to drop one into a day and a time block. Drag the handle on a placed card to move it between blocks. Everything saves on this device — nothing is sent anywhere.</p>" +
        "<h3>Sharing</h3>" +
        "<p>“Share plan” puts the whole plan into the link itself. Whoever opens it gets your version loaded on their device, and can change it from there without affecting yours.</p>" +
        "<h3>Confidence</h3>" +
        "<p><b>Confirmed</b> — checked against an official or reliable source. <b>Likely</b> — consistent across sources, not confirmed with the venue. <b>Check</b> — call first.</p>" +
        "<p style=\"font-size:12.5px;color:var(--ink-dim);margin-top:18px\">Updated " + esc(D.updated) + ".</p>";
      $("#sheet").hidden = false; $("#sheetScrim").hidden = false;
      return;
    }
  });


  document.addEventListener("pointerdown", onPointerDown);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeSheet(); closePick(); }
  });

  window.addEventListener("hashchange", function () {
    var p = readHash();
    if (!p) return;
    var shared = normaliseStore(p);
    state.plan = shared.plan;
    state.visits = shared.visits;
    saveStore();
    renderPlan();
    refreshBackgroundViews();
    toast("Shared plan loaded");
  });

  document.addEventListener("input", function (e) {
    var note = e.target.closest("[data-noteplace]");
    if (note) setVisitNote(note.dataset.noteplace, note.value);
  });

  /* ───────────────────────── guides ───────────────────────── */

  var GUIDES = window.CDMX_GUIDES || [];
  var openGuideId = null;

  function renderGuideGrid() {
    $("#guideGrid").innerHTML = GUIDES.map(function (g) {
      return '<button class="gcard" type="button" data-guide="' + g.id + '">' +
        '<span class="gcard-icon" style="background:' + g.tint + ';color:' + g.accent + '">' + g.icon + "</span>" +
        '<span class="gcard-body">' +
          "<strong>" + esc(g.title) + "</strong>" +
          '<em>' + esc(g.kicker) + "</em>" +
          "<span>" + esc(g.summary) + "</span>" +
          (g.status === "researching" ? '<span class="gcard-flag">Research in progress</span>' : "") +
        "</span></button>";
    }).join("");
  }

  function block(b) {
    var out = "";
    if (b.h) out += "<h3>" + esc(b.h) + "</h3>";
    if (b.p) out += b.p.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("");
    if (b.list) out += "<ul>" + b.list.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
    if (b.steps) out += "<ol>" + b.steps.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ol>";
    if (b.table) {
      out += '<div class="tablewrap"><table><thead><tr>' +
        b.table.head.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") +
        "</tr></thead><tbody>" +
        b.table.rows.map(function (r) {
          return "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>";
        }).join("") + "</tbody></table></div>";
    }
    if (b.note) out += '<div class="gnote">' + esc(b.note) + "</div>";
    if (b.quote) out += "<blockquote>" + esc(b.quote) + (b.by ? "<cite>" + esc(b.by) + "</cite>" : "") + "</blockquote>";
    return out;
  }

  function openGuide(id) {
    var g = GUIDES.filter(function (x) { return x.id === id; })[0];
    if (!g) return;
    openGuideId = id;

    $("#guideRead").innerHTML =
      '<button class="gback" id="gback" type="button">\u2039 All guides</button>' +
      '<header class="guide-head">' +
        '<span class="gcard-icon" style="background:' + g.tint + ';color:' + g.accent + '">' + g.icon + "</span>" +
        "<h1>" + esc(g.title) + "</h1>" +
        '<p class="guide-kicker">' + esc(g.kicker) + "</p>" +
      "</header>" +
      (g.sections && g.sections.length
        ? g.sections.map(block).join("")
        : '<div class="gnote">This guide is still being researched. It will fill in shortly \u2014 the section is here so the link works.</div>' +
          "<p>" + esc(g.summary) + "</p>") +
      (g.links && g.links.length
        ? "<h3>Links</h3><ul>" + g.links.map(function (l) {
            return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + " \u2197</a></li>";
          }).join("") + "</ul>"
        : "");

    $("#guideGrid").hidden = true;
    $(".guides-intro").hidden = true;
    $("#guideRead").hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function closeGuide() {
    openGuideId = null;
    $("#guideRead").hidden = true;
    $("#guideGrid").hidden = false;
    $(".guides-intro").hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  document.addEventListener("click", function (e) {
    var gc = e.target.closest("[data-guide]");
    if (gc) return openGuide(gc.dataset.guide);
    if (e.target.closest("#gback")) return closeGuide();
    if (e.target.closest("#brandHome")) {
      // The logo is a to-top control; from inside a guide it steps back out first.
      // Instant rather than smooth: the header collapsing mid-animation can abort a
      // smooth scroll partway, which leaves you stranded halfway up the page.
      if (state.view === "guides" && openGuideId) closeGuide();
      else {
        window.scrollTo({ top: 0, behavior: "instant" });
        applyMin(false);
      }
      return;
    }
  });

  /* ───────────────── header minimise ─────────────────
     The header eats a lot of a phone screen. It collapses to just the brand row
     once you scroll down, comes back when you scroll up, and the hamburger pins
     it collapsed for people who would rather it stayed out of the way. */

  var lastY = 0, pinnedMin = false, topbar = $(".topbar");

  function applyMin(on) {
    topbar.classList.toggle("is-min", on);
    $("#minBtn").setAttribute("aria-pressed", pinnedMin ? "true" : "false");
  }

  $("#minBtn").addEventListener("click", function () {
    pinnedMin = !pinnedMin;
    if (pinnedMin) {
      applyMin(true);
    } else {
      // Restore immediately rather than waiting for the scroll event to fire,
      // which would otherwise leave the header collapsed until the next scroll.
      window.scrollTo({ top: 0, behavior: "instant" });
      lastY = 0;
      applyMin(false);
    }
    $("#minBtn").setAttribute("aria-pressed", pinnedMin ? "true" : "false");
  });

  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (pinnedMin) { applyMin(true); lastY = y; return; }
    if (y < 60) applyMin(false);
    else if (y > lastY + 6) applyMin(true);        // scrolling down — get out of the way
    else if (y < lastY - 24) applyMin(false);      // a deliberate scroll up brings it back
    lastY = y;
  }, { passive: true });

  /* ───────────────────── density ───────────────────── */

  function setDensity(d) {
    state.density = d;
    try { localStorage.setItem("condesa_density", d); } catch (e) {}
    $$(".dbtn").forEach(function (b) { b.classList.toggle("is-on", b.dataset.density === d); });
    $("#cards").className = "cards cards--" + d;
    renderCards();
  }

  document.addEventListener("click", function (e) {
    var db = e.target.closest("[data-density]");
    if (db) setDensity(db.dataset.density);
  });

  /* ───────────────────── global search ───────────────────── */
  /* Searches places and days together and jumps straight to the thing,
     rather than dropping you into a filtered list to hunt again. */

  function searchAll(q) {
    q = q.trim().toLowerCase();
    if (q.length < 2) return [];
    var terms = q.split(/\s+/);
    var hits = [];

    D.places.forEach(function (p) {
      var hay = [p.name, p.colonia, p.address, p.blurb, p.benefit, p.notes, p.cost, p.hours,
                 (p.tags || []).map(tagLabel).join(" "),
                 (p.when || []).map(function (w) { return WHEN[w]; }).join(" "),
                 CAT[p.cat] && CAT[p.cat].label].join(" ").toLowerCase();
      if (!terms.every(function (t) { return hay.indexOf(t) > -1; })) return;
      // Name matches rank above body matches.
      var score = p.name.toLowerCase().indexOf(q) === 0 ? 0
                : p.name.toLowerCase().indexOf(q) > -1 ? 1 : 2;
      hits.push({ kind: "place", score: score, p: p });
    });

    GUIDES.forEach(function (g) {
      var hay = [g.title, g.kicker, g.summary].join(" ").toLowerCase();
      if (terms.every(function (t) { return hay.indexOf(t) > -1; })) {
        hits.push({ kind: "guide", score: g.title.toLowerCase().indexOf(q) === 0 ? 0 : 1, g: g });
      }
    });

    D.days.forEach(function (d) {
      var hay = [d.daynum, d.label, d.title, d.sub].join(" ").toLowerCase();
      if (terms.every(function (t) { return hay.indexOf(t) > -1; })) {
        hits.push({ kind: "day", score: 1, d: d });
      }
    });

    hits.sort(function (a, b) { return a.score - b.score; });
    return hits.slice(0, 24);
  }

  function renderSearch(q) {
    var panel = $("#gsResults");
    var hits = searchAll(q);
    $("#gsClear").hidden = !q;
    $("#gq").setAttribute("aria-expanded", hits.length ? "true" : "false");

    if (!q.trim()) { panel.hidden = true; panel.innerHTML = ""; return; }

    if (!hits.length) {
      panel.innerHTML = '<p class="gs-empty">Nothing matches “' + esc(q) + '”.</p>';
      panel.hidden = false;
      return;
    }

    panel.innerHTML = hits.map(function (h) {
      if (h.kind === "guide") {
        return '<button class="gs-row" type="button" role="option" data-gsguide="' + h.g.id + '">' +
          '<span class="gs-kind" style="background:' + h.g.tint + ';color:' + h.g.accent + '">' + h.g.icon + "</span>" +
          "<span class=\"gs-main\"><strong>" + esc(h.g.title) + "</strong>" +
          "<span>Guide \u00b7 " + esc(h.g.kicker) + "</span></span></button>";
      }
      if (h.kind === "day") {
        return '<button class="gs-row" type="button" role="option" data-gsday="' + h.d.id + '">' +
          '<span class="gs-kind" style="background:var(--ochre-soft)">📅</span>' +
          "<span class=\"gs-main\"><strong>" + esc(h.d.daynum + " · " + h.d.label) + "</strong>" +
          "<span>" + esc(h.d.title) + "</span></span></button>";
      }
      var p = h.p, c = catOf(p.cat);
      return '<button class="gs-row" type="button" role="option" data-gsplace="' + p.id + '">' +
        '<span class="gs-kind" style="background:' + c.soft + '">' + (c.icon || "•") + "</span>" +
        "<span class=\"gs-main\"><strong>" + esc(p.name) + "</strong>" +
        "<span>" + esc([c.label, p.colonia, travelLine(p)].filter(Boolean).join(" · ")) + "</span></span></button>";
    }).join("");
    panel.hidden = false;
  }

  function closeSearch() {
    $("#gsResults").hidden = true;
    $("#gq").value = "";
    $("#gsClear").hidden = true;
    $("#gq").setAttribute("aria-expanded", "false");
  }

  $("#gq").addEventListener("input", function (e) { renderSearch(e.target.value); });
  $("#gq").addEventListener("focus", function (e) { if (e.target.value) renderSearch(e.target.value); });

  document.addEventListener("click", function (e) {
    if (e.target.closest("#gsClear")) { closeSearch(); $("#gq").focus(); return; }

    var gp = e.target.closest("[data-gsplace]");
    if (gp) { closeSearch(); openSheet(gp.dataset.gsplace); return; }

    var gg = e.target.closest("[data-gsguide]");
    if (gg) { closeSearch(); setView("guides"); openGuide(gg.dataset.gsguide); return; }

    var gd = e.target.closest("[data-gsday]");
    if (gd) { closeSearch(); state.day = gd.dataset.gsday; setView("plan"); renderPlan(); return; }

    if (!e.target.closest(".globalsearch") && !e.target.closest("#gsResults")) {
      $("#gsResults").hidden = true;
    }
  });

  /* ───────────────────────── boot ───────────────────────── */

  loadStore();
  // Default to the current day if the trip is live.
  var todayId = D.days.filter(function (d) { return d.date === D.today; })[0];
  if (todayId) state.day = todayId.id;

  renderChips();
  renderGuideGrid();
  setDensity(state.density);
  renderPlan();
  setView("plan");
})();
