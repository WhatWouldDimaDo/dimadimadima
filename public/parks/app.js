/* Pit Stop Radar — corridor UI */
(function () {
  const DATA = window.PARKS_DATA;
  const stops = DATA.stops;
  const meta = DATA.meta;

  // ---------- state ----------
  const state = {
    direction: "NB",          // NB = Atlanta -> Charlotte (ascending route_mile)
    view: "list",             // list | map
    sort: "mile",             // mile | detour
    filters: new Set(),       // splash_pad / playground / restrooms / fenced / rest_area / quick / quick10 / unnamed
  };

  // ---------- icons ----------
  const I = {
    playground: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M4 20V6l8-3 8 3v14"/><path d="M9 20v-6h6v6"/><circle cx="12" cy="9.5" r="1.6" fill="currentColor" stroke="none"/></svg>',
    splash_pad: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c2.8 3.4 5.5 6.6 5.5 9.7A5.5 5.5 0 0 1 12 18a5.5 5.5 0 0 1-5.5-5.3C6.5 9.6 9.2 6.4 12 3z"/><path d="M4 21c1.3-1 2.7-1 4 0s2.7 1 4 0 2.7-1 4-0 2.7 1 4 0" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
    restrooms: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="7.5" cy="4.6" r="2"/><path d="M5.6 8h3.8c.9 0 1.6.7 1.6 1.6V14H9.6v6H5.4v-6H4V9.6C4 8.7 4.7 8 5.6 8z"/><circle cx="16.5" cy="4.6" r="2"/><path d="M14.6 8h3.8c.7 0 1.2.6 1 1.3L18 14h1.4l-1.6 6h-2.6l-1.6-6H15l-1.4-4.7c-.2-.7.3-1.3 1-1.3z"/></svg>',
    shade: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a8 8 0 0 1 8 8H4a8 8 0 0 1 8-8z"/><path d="M12 10v9a2 2 0 0 0 4 0" stroke="currentColor" stroke-width="1.9" fill="none" stroke-linecap="round"/></svg>',
    fenced: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 21V6l1.8-2.6L8.6 6v15M15.4 21V6l1.8-2.6L19 6v15M3 11h18M3 17h18"/></svg>',
    picnic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M3 8h18M7 8l-3 12M17 8l3 12M9.2 14h5.6M8 8l-1.5 6h11L16 8"/></svg>',
    parking: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 3h7a5.5 5.5 0 0 1 0 11H10v7H6V3zm4 7.5h3a2 2 0 0 0 0-4h-3v4z"/></svg>',
    food_nearby: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M6 3v7a2.5 2.5 0 0 0 5 0V3M8.5 3v18M16 3c2 1.5 3 4 3 6.5 0 2-1 3.5-2.5 3.5V21"/></svg>',
    changing_table: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="2.2"/><path d="M3 12.5h18v3H3z"/><path d="M5 15.5 4 21M19 15.5 20 21" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    water_fountain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M8 21V5a2 2 0 0 1 2-2h6M10 8h5c1.6 0 2 1.4 1.4 2.4C15.6 11.9 14 13 12 13"/><path d="M12 13c0 2 1 2.6 1 4a1.6 1.6 0 1 1-3.2 0"/></svg>',
    vending: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="3" width="14" height="18" rx="1.6"/><path d="M9 7h3M9 11h3M15.5 3v18M8 17.5h4"/></svg>',
    park: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 6.5 10h2.6L5 16h5.5v5h3v-5H19l-4.1-6h2.6L12 2z"/></svg>',
    rest_area: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M3 10 12 4l9 6M6 8.5V20M18 8.5V20M6 13h12M9.5 13v7M14.5 13v7"/></svg>',
    travel_center: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="4" width="10" height="17" rx="1.5"/><path d="M7 8h4M14 10h3l2 3v6h-5M17.5 21v-2"/></svg>',
    library_indoor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 5a3 3 0 0 1 3-3h13v18H7a3 3 0 0 0-3 3V5z"/><path d="M8 2v16"/></svg>',
  };
  const CAT_LABEL = { playground: "Playground", splash_pad: "Splash pad", park: "Park", rest_area: "Rest area", travel_center: "Travel ctr", library_indoor: "Library" };
  const CARD_AMENITIES = ["playground", "splash_pad", "restrooms", "shade", "fenced", "picnic"];
  const ALL_AMENITIES = ["playground", "splash_pad", "restrooms", "shade", "fenced", "picnic", "parking", "food_nearby", "changing_table", "water_fountain", "vending"];
  const AMEN_LABEL = {
    playground: "Play", splash_pad: "Splash", restrooms: "Restrm", shade: "Shade",
    fenced: "Fenced", picnic: "Picnic", parking: "Parking", food_nearby: "Food",
    changing_table: "Chg tbl", water_fountain: "Fountain", vending: "Vending",
  };
  const AMEN_FULL = {
    playground: "Playground", splash_pad: "Splash pad", restrooms: "Restrooms", shade: "Shade over play area",
    fenced: "Fenced play area", picnic: "Picnic tables", parking: "Parking", food_nearby: "Food nearby",
    changing_table: "Changing table", water_fountain: "Water fountain", vending: "Vending",
  };

  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- filtering ----------
  function dirMismatch(s) {
    if (state.direction === "NB" && s.access_direction === "southbound_only") return true;
    if (state.direction === "SB" && s.access_direction === "northbound_only") return true;
    return false;
  }
  function hiddenByDirection(s) {
    // travel centers sit at exits reachable from both carriageways via the crossover;
    // only rest areas (and off-exit stops) are genuinely direction-bound
    return dirMismatch(s) && s.category !== "travel_center";
  }
  function effDetour(s) { // on-highway stops are effectively a 0-minute detour
    if (s.category === "rest_area" || s.category === "travel_center") return 0;
    return s.detour_min;
  }
  function passesFilters(s) {
    if (hiddenByDirection(s)) return false;
    for (const f of state.filters) {
      if (f === "unnamed") continue;
      if (f === "quick") { const d = effDetour(s); if (!(d != null && d <= 5)) return false; }
      else if (f === "quick10") { const d = effDetour(s); if (!(d != null && d <= 10)) return false; }
      else if (f === "rest_area") { if (!(s.category === "rest_area" || s.category === "travel_center")) return false; }
      else if (!(s.amenities[f] && s.amenities[f].value === "yes")) return false;
    }
    return true;
  }
  function visibleStops() {
    const showUnnamed = state.filters.has("unnamed");
    return stops.filter((s) => passesFilters(s) && (showUnnamed || s.named));
  }

  // ---------- small renderers ----------
  function amenIconRow(s, keys) {
    return '<div class="amen-row">' + keys.map((k) => {
      const a = s.amenities[k] || { value: "unknown" };
      const cls = a.value === "yes" ? "amen-yes" : a.value === "no" ? "amen-no" : "amen-unknown";
      const conf = a.value !== "unknown" && a.confidence
        ? `<span class="conf-dot ${a.confidence === "med" ? "med" : ""}" title="confidence: ${a.confidence}"></span>` : "";
      return `<span class="amen ${cls}" title="${AMEN_FULL[k]}: ${a.value}${a.confidence ? " (" + a.confidence + ")" : ""}">
        <span class="amen-glyph">${a.value === "unknown" ? "" : I[k]}${conf}</span>
        <span class="amen-label">${AMEN_LABEL[k]}</span></span>`;
    }).join("") + "</div>";
  }

  function detourPrefix(s) { return s.detour_method === "osrm" ? "" : "~"; }

  function detourHtml(s) {
    if (s.category === "rest_area") return '<span class="detour quick">on the highway</span>';
    if (s.detour_min == null) return "";
    const min = Math.max(1, Math.round(s.detour_min));
    const cls = s.detour_min <= 5 ? "detour quick" : "detour";
    return `<span class="${cls}">${detourPrefix(s)}${min} min off</span> · ${s.detour_mi.toFixed(1)} mi`;
  }

  function detourLine(s) {
    const exitPart = s.exit_number ? `Exit ${esc(s.exit_number)}` : `Mile ${s.route_mile != null ? s.route_mile.toFixed(1) : "?"}`;
    let det;
    if (s.category === "rest_area" || s.category === "travel_center") {
      det = '<span class="dl-quick">on the highway</span>';
    } else if (s.detour_min != null) {
      const min = Math.max(1, Math.round(s.detour_min));
      det = `<span class="${s.detour_min <= 5 ? "dl-quick" : "dl-min"}">${detourPrefix(s)}${min} min off</span>`;
    } else {
      det = '<span class="dl-unknown">detour unknown</span>';
    }
    const dir = s.access_direction === "northbound_only" ? "NB"
      : s.access_direction === "southbound_only" ? "SB"
      : s.access_direction === "both" ? "NB+SB" : "";
    return `<span class="card-detourline">${exitPart} · ${det}${dir ? " · " + dir : ""}</span>`;
  }

  // ---------- splash season ----------
  const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
  const BUILT_MD = (() => {
    const p = String(meta.built || "").split("-");
    return p.length === 3 && +p[1] && +p[2] ? [+p[1], +p[2]] : null;
  })();
  function parseSeason(season) { // "May 15 - Sep 30" style; null when unparseable
    if (!season || typeof season !== "string") return null;
    const m = season.match(/([A-Za-z]{3,9})\.?\s+(\d{1,2})\s*[-–—]+\s*([A-Za-z]{3,9})\.?\s+(\d{1,2})/);
    if (!m) return null;
    const m1 = MONTHS[m[1].slice(0, 3).toLowerCase()], m2 = MONTHS[m[3].slice(0, 3).toLowerCase()];
    const d1 = +m[2], d2 = +m[4];
    if (!m1 || !m2 || d1 < 1 || d1 > 31 || d2 < 1 || d2 > 31) return null;
    return { from: [m1, d1], to: [m2, d2] };
  }
  const mdCmp = (a, b) => a[0] - b[0] || a[1] - b[1];

  function splashSeasonState(s) { // null = no splash pad · "in" | "out" | "unknown"
    const sp = s.amenities.splash_pad;
    if (!sp || sp.value !== "yes") return null;
    const season = parseSeason(s.splash_status && s.splash_status.season);
    if (!season || !BUILT_MD) return "unknown";
    const inSeason = mdCmp(season.from, season.to) <= 0
      ? mdCmp(BUILT_MD, season.from) >= 0 && mdCmp(BUILT_MD, season.to) <= 0
      : mdCmp(BUILT_MD, season.from) >= 0 || mdCmp(BUILT_MD, season.to) <= 0; // year-wrapping range
    return inSeason ? "in" : "out";
  }

  function splashBadge(s) {
    const st = splashSeasonState(s);
    if (!st) return "";
    const cls = st === "in" ? "sb-green" : st === "out" ? "sb-off" : "sb-amber";
    const label = st === "in" ? "Splash: in season" : st === "out" ? "Splash: out of season" : "Season unconfirmed";
    return `<span class="splash-badge ${cls}">${label}</span>`;
  }

  function splashBlock(s) { // detail-sheet version: badge + hours/note + verified + evidence
    const badge = splashBadge(s);
    if (!badge) return "";
    const st = s.splash_status || {};
    const bits = [];
    if (st.season) bits.push(esc(st.season));
    if (st.daily_hours) bits.push(esc(st.daily_hours));
    if (st.status_note) bits.push(esc(st.status_note));
    return `<div class="sheet-note splash-note"><b>Splash pad:</b> ${badge}${bits.length ? " " + bits.join(" · ") : ""}
      ${st.last_verified ? `<span class="splash-verified">verified ${esc(st.last_verified)}</span>` : ""}
      ${st.evidence ? `<div class="ev-quote">${esc(st.evidence)}</div>` : ""}</div>`;
  }

  function shadeBlock(s) {
    const sh = s.amenities.shade;
    if (!sh) return "";
    if (sh.value === "no") {
      const line = sh.confidence === "high"
        ? "Play equipment is unshaded — plan a morning stop in summer."
        : "Likely unshaded — plan a morning stop in summer.";
      return `<div class="sheet-note shade-note">${line}</div>`;
    }
    if (sh.value === "yes") {
      const line = sh.confidence === "high" ? "Shaded play area." : "Likely shaded play area.";
      return `<div class="sheet-note shade-note shade-yes">${line}${sh.evidence ? `<div class="ev-quote">${esc(sh.evidence)}</div>` : ""}</div>`;
    }
    return "";
  }

  // ---------- external link chips ----------
  const LG = {
    gmaps: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 4.6A2.4 2.4 0 1 0 12 11.4 2.4 2.4 0 0 0 12 6.6z"/></svg>',
    greviews: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5 14.9 8.6l6.6.8-4.9 4.5 1.3 6.5L12 17.2 6.1 20.4l1.3-6.5L2.5 9.4l6.6-.8z"/></svg>',
    yelp: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><text x="12" y="17" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="var(--card)">Y</text></svg>',
    tripadvisor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="13" r="3.6"/><circle cx="16.5" cy="13" r="3.6"/><circle cx="7.5" cy="13" r="1" fill="currentColor" stroke="none"/><circle cx="16.5" cy="13" r="1" fill="currentColor" stroke="none"/><path d="M3 9.5C6 7 9 6.5 12 6.5s6 .5 9 3" stroke-linecap="round"/></svg>',
    official: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5.5 5.5-5.5 12.5 0 18M12 3c5.5 5.5 5.5 12.5 0 18"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><text x="12.4" y="17.5" text-anchor="middle" font-family="Georgia,serif" font-size="14" font-weight="bold" fill="var(--card)">f</text></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="6" y="7" width="12" height="11" rx="2"/><path d="M9 7l1.4-2h3.2L15 7"/><circle cx="12" cy="12.5" r="2.6"/></svg>',
  };
  const LINK_LABEL = { gmaps: "Maps", greviews: "Reviews", yelp: "Yelp", tripadvisor: "TripAdvisor", official: "Official site", facebook: "Facebook", instagram: "Instagram" };
  const LINK_ORDER = ["gmaps", "greviews", "yelp", "tripadvisor", "official", "facebook", "instagram"];

  function linkChips(s) {
    const L = s.links || {};
    const chips = LINK_ORDER.filter((k) => L[k]).map((k) =>
      `<a class="link-chip" href="${esc(L[k])}" target="_blank" rel="noopener">${LG[k]}${LINK_LABEL[k]}</a>`);
    return chips.length ? `<div class="link-row">${chips.join("")}</div>` : "";
  }

  function displayName(s) {
    return s.name || `<span class="unnamed">Unnamed ${CAT_LABEL[s.category].toLowerCase()}</span>`;
  }

  function tierBadge(s) {
    return s.tier === "verified"
      ? '<span class="tier-badge tier-verified">HAND-VERIFIED</span>'
      : '<span class="tier-badge tier-mapped">MAPPED</span>';
  }

  function dirWarn(s) {
    if (s.category === "travel_center") {
      return dirMismatch(s) ? '<span class="dir-warn">⚠ Other side of exit</span>' : "";
    }
    if (s.access_direction === "southbound_only") return '<span class="dir-warn">⚠ Southbound side only</span>';
    if (s.access_direction === "northbound_only") return '<span class="dir-warn">⚠ Northbound side only</span>';
    return "";
  }

  function cardHtml(s) {
    const hasImg = s.named;
    const thumb = hasImg
      ? `<div class="card-thumb"><img src="img/sat/${esc(s.id)}.jpg" alt="" loading="lazy"
           onerror="this.parentElement.classList.add('no-img');this.remove();"></div>`
      : `<div class="card-thumb no-img"><span class="thumb-cat">${I[s.category] || I.park}</span></div>`;
    const town = [s.town, s.state].filter(Boolean).join(", ");
    const rating = s.rating ? `<span class="rating">★ ${s.rating}${s.rating_count ? ` (${s.rating_count})` : ""}</span>` : "";
    return `<div class="card-wrap"><button class="stop-card ${s.tier}" data-id="${esc(s.id)}" type="button">
      ${thumb}
      <span class="card-body">
        ${detourLine(s)}
        <span class="card-name">${displayName(s)}</span>
        ${amenIconRow(s, CARD_AMENITIES)}
        <span class="card-sub">
          <span class="cat-chip cat-${s.category}">${I[s.category] || ""}${CAT_LABEL[s.category]}</span>
          ${tierBadge(s)}${splashBadge(s)}${town ? `<span>${esc(town)}</span>` : ""}${rating}
        </span>
        ${dirWarn(s)}
      </span>
    </button>${starBtn(s.id)}</div>`;
  }

  // ---------- corridor timeline ----------
  function renderTimeline() {
    const list = visibleStops();
    const showUnnamed = state.filters.has("unnamed");
    // count hidden unnamed per exit (only when unnamed are hidden and no amenity filters exclude them anyway)
    const hiddenUnnamed = {};
    if (!showUnnamed) {
      for (const s of stops) {
        if (!s.named && passesFilters(s)) {
          const k = s.exit_number || "?";
          hiddenUnnamed[k] = (hiddenUnnamed[k] || 0) + 1;
        }
      }
    }

    $("#introCount").textContent = list.length;
    $("#introSub").textContent = (state.direction === "NB" ? "Atlanta → Charlotte" : "Charlotte → Atlanta")
      + (state.sort === "detour" ? " · sorted by detour time" : " · sorted by mile marker");

    if (state.sort === "detour") {
      const byDetour = [...list].sort((a, b) => {
        const da = effDetour(a), db = effDetour(b);
        return (da == null ? Infinity : da) - (db == null ? Infinity : db);
      });
      $("#timeline").innerHTML = byDetour.length
        ? byDetour.map((s) => `<div class="exit-group flat">${cardHtml(s)}</div>`).join("")
        : `<div class="empty-state">Nothing matches those filters in this direction.<br><strong>Loosen a filter</strong> — or that's a real gap in the corridor.</div>`;
      return;
    }

    // group consecutive stops by exit
    const ordered = state.direction === "NB" ? list : [...list].reverse();
    const groups = [];
    for (const s of ordered) {
      const key = s.exit_number || "mm";
      const last = groups[groups.length - 1];
      if (last && last.key === key) last.stops.push(s);
      else groups.push({ key, exit: s.exit_number, stops: [s] });
    }

    let html = "";
    let prevMile = null;
    for (const g of groups) {
      const mile = g.stops[0].route_mile;
      if (prevMile != null) {
        const gap = Math.abs(mile - prevMile);
        if (gap >= 15) {
          html += `<div class="gap-marker">${Math.round(gap)} miles of highway · ~${Math.round(gap / 65 * 60)} min</div>`;
        }
      }
      prevMile = mile;
      const isRest = g.stops.every((s) => s.category === "rest_area" || s.category === "travel_center");
      const towns = [...new Set(g.stops.map((s) => s.town).filter(Boolean))].slice(0, 2).join(" · ");
      const signCls = isRest && !g.exit ? "exit-sign mm-sign" : "exit-sign";
      const label = g.exit ? `EXIT ${esc(g.exit)}` : "HIGHWAY-SIDE";
      html += `<div class="exit-group">
        <div class="${signCls}"><span class="ex-label">${label}</span>${towns ? `<span class="ex-towns">${esc(towns)}</span>` : ""}</div>
        <div class="mile-note">MILE ${mile.toFixed(1)}</div>
        ${g.stops.map(cardHtml).join("")}
        ${!showUnnamed && hiddenUnnamed[g.key] ? `<button class="unnamed-row" data-exit="${esc(g.key)}" type="button"><span class="caret">▸</span>${hiddenUnnamed[g.key]} unnamed playground pin${hiddenUnnamed[g.key] > 1 ? "s" : ""} mapped near this exit</button><div class="unnamed-slot" data-slot="${esc(g.key)}"></div>` : ""}
      </div>`;
      delete hiddenUnnamed[g.key];
    }

    if (!list.length) {
      html = `<div class="empty-state">Nothing matches those filters in this direction.<br><strong>Loosen a filter</strong> — or that's a real gap in the corridor.</div>`;
    }
    $("#timeline").innerHTML = html;
  }

  // ---------- map ----------
  let map = null, markerLayer = null;
  const CAT_COLOR = { playground: "#1C7A4C", splash_pad: "#0E7490", park: "#10603B", rest_area: "#00579E", travel_center: "#00579E", library_indoor: "#63402A" };

  function ensureMap() {
    if (map) return;
    map = L.map("map", { zoomSnap: 0.5 });
    const esri = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19, attribution: "Imagery &copy; Esri",
    });
    const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "&copy; OpenStreetMap contributors",
    });
    esri.addTo(map);
    L.control.layers({ "Satellite (Esri)": esri, "Street map (OSM)": osm }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
    map.fitBounds([[33.7, -84.4], [35.5, -80.6]]);
  }

  function renderMap() {
    ensureMap();
    markerLayer.clearLayers();
    const showUnnamed = state.filters.has("unnamed");
    for (const s of stops) {
      if (!passesFilters(s)) continue;
      if (s.lat == null) continue;
      const named = s.named;
      if (!named && !showUnnamed && state.filters.size === 0) {
        // unnamed pins are always drawn on the map, just smaller
      }
      const verified = s.tier === "verified";
      const m = L.circleMarker([s.lat, s.lon], {
        radius: verified ? 9 : named ? 7 : 4.5,
        color: verified ? "#63402A" : "#ffffff",
        weight: verified ? 3 : 1.5,
        fillColor: CAT_COLOR[s.category] || "#10603B",
        fillOpacity: named ? 0.95 : 0.7,
      });
      m.bindPopup(() => {
        const el = document.createElement("div");
        el.className = "map-popup";
        el.innerHTML = `<div class="card-topline"><span class="cat-chip cat-${s.category}">${CAT_LABEL[s.category]}</span>${tierBadge(s)}</div>
          <div class="card-name">${displayName(s)}</div>
          <div class="card-sub">${g_exitLabel(s)} · ${detourHtml(s)}</div>
          ${amenIconRow(s, CARD_AMENITIES)}
          <button class="popup-detail-btn" type="button">Full record →</button>`;
        el.querySelector(".popup-detail-btn").addEventListener("click", () => openSheet(s.id));
        return el;
      }, { maxWidth: 240 });
      markerLayer.addLayer(m);
    }
  }
  function g_exitLabel(s) { return s.exit_number ? `Exit ${s.exit_number}` : `Mile ${s.route_mile}`; }

  // ---------- detail sheet ----------
  function confBadge(conf) {
    if (!conf) return "";
    const dot = conf === "high" ? '<span class="dot dot-high"></span>' : conf === "med" ? '<span class="dot dot-med"></span>' : "";
    return `<span class="ev-conf">${dot}${conf}</span>`;
  }

  function evidenceRows(s) {
    const known = [], unknown = [];
    for (const k of ALL_AMENITIES) {
      const a = s.amenities[k] || { value: "unknown" };
      (a.value === "unknown" ? unknown : known).push([k, a]);
    }
    const row = ([k, a]) => {
      const domain = a.source_url ? a.source_url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] : null;
      return `<div class="ev-row ${a.value === "unknown" ? "ev-unknown" : ""}">
        <div class="ev-head">
          <span class="ev-name">${AMEN_FULL[k]}</span>
          ${confBadge(a.confidence)}
          <span class="ev-val v-${a.value}">${a.value}</span>
        </div>
        ${a.evidence ? `<div class="ev-quote">${esc(a.evidence)}</div>` : ""}
        ${a.source_url ? `<div class="ev-src"><a href="${esc(a.source_url)}" target="_blank" rel="noopener">${esc(domain)} ↗</a></div>` : ""}
      </div>`;
    };
    return known.map(row).join("") + unknown.map(row).join("");
  }

  function openSheet(id) {
    const s = stops.find((x) => x.id === id);
    if (!s) return;
    const town = [s.town, s.state].filter(Boolean).join(", ");
    const hasImg = s.named;
    const hero = hasImg
      ? `<img class="hero-img" src="img/sat/${esc(s.id)}.jpg" alt="Satellite view of ${esc(s.name || "stop")}"
           onerror="this.insertAdjacentHTML('afterend','<span class=\\'hero-cat\\'>${(I[s.category] || I.park).replace(/'/g, "&#39;").replace(/"/g, "&quot;")}</span>');this.remove();">
         <span class="hero-attrib">Imagery © Esri</span>`
      : `<span class="hero-cat">${I[s.category] || I.park}</span>`;
    const hours = s.hours && s.hours.value && s.hours.value !== "unknown"
      ? `<div class="sheet-note"><b>Hours:</b> ${esc(s.hours.value)}${s.hours.evidence ? ` — <em>${esc(s.hours.evidence)}</em>` : ""}</div>` : "";
    const seasonal = s.seasonal_note ? `<div class="sheet-note"><b>Seasonal:</b> ${esc(s.seasonal_note)}</div>` : "";
    const dirNote = s.directional_note ? `<div class="sheet-note dir"><b>Direction:</b> ${esc(s.directional_note)}</div>`
      : (s.access_direction === "southbound_only" || s.access_direction === "northbound_only")
        ? `<div class="sheet-note dir"><b>Direction:</b> ${s.access_direction.replace("_", " ")}</div>` : "";
    const rating = s.rating ? ` · ★ ${s.rating}${s.rating_count ? ` (${s.rating_count} reviews)` : ""}` : "";

    const body = s.tier === "verified"
      ? `<div class="evidence-h">Amenities &amp; evidence</div><div class="ev-table">${evidenceRows(s)}</div>`
      : `<div class="evidence-h">Amenities</div>
         <div class="mapped-note">This stop is <strong>mapped, not yet verified</strong> — it was found via
         ${esc(Array.isArray(s.sources) && s.sources.length ? "public web + map sources" : "map sources")}, but no one has
         pulled its amenity evidence yet. Every flag below is honestly <em>unknown</em> until the enrichment
         pass reaches it.</div>
         ${amenIconRow(s, ALL_AMENITIES)}`;

    const sources = (s.sources || []).length
      ? `<div class="sheet-sources"><div class="evidence-h">Sources on file</div>
         ${s.sources.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a>`).join("")}</div>` : "";

    $("#sheetPanel").innerHTML = `
      <div class="sheet-hero">${hero}
        <button class="sheet-close" id="sheetClose" aria-label="Close" type="button">✕</button>
        <span class="sheet-exit-sign">${g_exitLabel(s).toUpperCase()} · MILE ${s.route_mile.toFixed(1)}</span>
      </div>
      <div class="sheet-body">
        <div class="sheet-topline">
          <span class="cat-chip cat-${s.category}">${I[s.category] || ""}${CAT_LABEL[s.category]}</span>
          ${tierBadge(s)}
          ${starBtn(s.id, "sheet-star")}
        </div>
        <h2>${displayName(s)}</h2>
        <div class="sheet-sub">${town ? esc(town) + " · " : ""}${detourHtml(s)}${rating}</div>
        ${linkChips(s)}
        ${dirNote}${splashBlock(s)}${shadeBlock(s)}${seasonal}${hours}
        ${body}
        ${sources}
        <p class="sheet-fine">Confidence: <span class="dot dot-high"></span> high = official source states it ·
        <span class="dot dot-med"></span> med = official-list omission or secondary source · ? = no evidence found.</p>
      </div>`;
    $("#sheet").hidden = false;
    syncScrollLock();
    $("#sheetClose").addEventListener("click", closeSheet);
  }
  function closeSheet() {
    $("#sheet").hidden = true;
    syncScrollLock();
  }
  function syncScrollLock() {
    const locked = !$("#sheet").hidden || !$("#tripSheet").hidden || !$("#planSheet").hidden;
    document.body.style.overflow = locked ? "hidden" : "";
  }

  // ---------- my trip ----------
  const TRIP_KEY = "parks_mytrip";
  const byId = new Map(stops.map((s) => [s.id, s]));
  function loadTrip() {
    try {
      const t = JSON.parse(localStorage.getItem(TRIP_KEY));
      return Array.isArray(t) ? t.filter((id) => byId.has(id)) : [];
    } catch { return []; }
  }
  let trip = loadTrip();
  const inTrip = (id) => trip.includes(id);
  function saveTrip() { localStorage.setItem(TRIP_KEY, JSON.stringify(trip)); updateTripBtn(); }

  function starBtn(id, extraCls) {
    const on = inTrip(id);
    return `<button class="trip-star${on ? " starred" : ""}${extraCls ? " " + extraCls : ""}" data-star="${esc(id)}"
      type="button" aria-label="${on ? "Remove from" : "Add to"} My Trip" title="My Trip">${on ? "★" : "☆"}</button>`;
  }

  function updateTripBtn() {
    const btn = $("#tripBtn");
    btn.textContent = `★ My Trip (${trip.length})`;
    btn.classList.toggle("has-stops", trip.length > 0);
  }

  function refreshStars(id) {
    document.querySelectorAll(`.trip-star[data-star="${CSS.escape(id)}"]`).forEach((el) => {
      const on = inTrip(id);
      el.classList.toggle("starred", on);
      el.textContent = on ? "★" : "☆";
      el.setAttribute("aria-label", `${on ? "Remove from" : "Add to"} My Trip`);
    });
  }

  function toggleTrip(id) {
    if (!byId.has(id)) return;
    if (inTrip(id)) trip = trip.filter((x) => x !== id);
    else trip.push(id);
    saveTrip();
    refreshStars(id);
    if (!$("#tripSheet").hidden) renderTripPanel();
  }

  function tripStopsOrdered() {
    return trip.map((id) => byId.get(id)).filter(Boolean)
      .sort((a, b) => state.direction === "NB" ? a.route_mile - b.route_mile : b.route_mile - a.route_mile);
  }

  function tripFlags(s) {
    const yes = (k) => s.amenities[k] && s.amenities[k].value === "yes";
    const f = [];
    if (s.category === "playground" || yes("playground")) f.push("P");
    if (s.category === "splash_pad" || yes("splash_pad")) f.push("S");
    if (yes("restrooms")) f.push("R");
    if (yes("fenced")) f.push("F");
    return f.map((c) => `<span class="trip-flag">${c}</span>`).join("");
  }

  function renderTripPanel() {
    const list = tripStopsOrdered();
    if (!list.length) {
      $("#tripBody").innerHTML = `<div class="empty-state">Star stops to build your route sheet.</div>`;
      return;
    }
    let totalDetour = 0, unknownDetour = 0;
    for (const s of list) {
      const d = effDetour(s);
      if (d == null) unknownDetour++; else totalDetour += d;
    }
    const rows = list.map((s) => {
      const det = (s.category === "rest_area" || s.category === "travel_center") ? "on hwy"
        : s.detour_min != null ? `${detourPrefix(s)}${Math.max(1, Math.round(s.detour_min))} min off` : "detour ?";
      const flags = tripFlags(s);
      const wrongSide = !dirMismatch(s) ? ""
        : s.category === "travel_center"
          ? ' · <span class="trip-warn">⚠ other side of exit</span>'
          : ` · <span class="trip-warn">⚠ ${state.direction === "NB" ? "SB" : "NB"} side only</span>`;
      return `<div class="trip-row">
        <button class="trip-row-main" data-id="${esc(s.id)}" type="button">
          <span class="trip-exit">${s.exit_number ? "Exit " + esc(s.exit_number) : "Mile " + s.route_mile.toFixed(1)}</span>
          <span class="trip-name">${displayName(s)}</span>
          <span class="trip-meta">${det}${flags ? " · " + flags : ""}${wrongSide}</span>
        </button>
        <button class="trip-remove" data-remove="${esc(s.id)}" type="button" aria-label="Remove from My Trip">✕</button>
      </div>`;
    }).join("");
    $("#tripBody").innerHTML = `
      <p class="trip-sub">${list.length} stop${list.length > 1 ? "s" : ""} ·
        ${state.direction === "NB" ? "Atlanta → Charlotte" : "Charlotte → Atlanta"} ·
        +${Math.round(totalDetour)} min total added detour${unknownDetour ? ` (${unknownDetour} unknown)` : ""}</p>
      <div class="trip-list">${rows}</div>
      <div class="trip-actions">
        <button class="trip-action" id="tripPrint" type="button">⎙ Print trip</button>
        <button class="trip-action" id="tripShare" type="button">Share</button>
        <span class="trip-flash" id="tripFlash"></span>
      </div>`;
    $("#tripPrint").addEventListener("click", () => window.open("print.html?trip=" + trip.join(","), "_blank"));
    $("#tripShare").addEventListener("click", shareTrip);
  }

  function shareTrip() {
    const url = new URL(location.href);
    url.search = "?trip=" + trip.join(",");
    url.hash = "";
    const flash = () => {
      const f = $("#tripFlash");
      if (f) { f.textContent = "Link copied"; setTimeout(() => { f.textContent = ""; }, 2500); }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url.href).then(flash, () => window.prompt("Copy this link:", url.href));
    } else {
      window.prompt("Copy this link:", url.href);
    }
  }

  function openTrip() { renderTripPanel(); $("#tripSheet").hidden = false; syncScrollLock(); }
  function closeTrip() { $("#tripSheet").hidden = true; syncScrollLock(); }

  function checkSharedTrip() {
    const raw = new URLSearchParams(location.search).get("trip");
    if (!raw) return;
    const ids = [...new Set(raw.split(",").map((x) => x.trim()))].filter((id) => byId.has(id));
    if (!ids.length) return;
    const banner = document.createElement("div");
    banner.className = "trip-banner";
    banner.innerHTML = `<span>Someone shared a route with you.</span>
      <button class="trip-banner-load" type="button">Load shared trip (${ids.length} stop${ids.length > 1 ? "s" : ""})</button>
      <button class="trip-banner-dismiss" type="button" aria-label="Dismiss">✕</button>`;
    banner.querySelector(".trip-banner-load").addEventListener("click", () => {
      for (const id of ids) if (!inTrip(id)) trip.push(id);
      saveTrip();
      banner.remove();
      history.replaceState(null, "", location.pathname);
      render();
      openTrip();
    });
    banner.querySelector(".trip-banner-dismiss").addEventListener("click", () => banner.remove());
    document.querySelector("main").prepend(banner);
  }

  // ---------- drive planner (core) ----------
  const AVG_MPH = 65, STOP_MIN = 20, SLOT_WINDOW_MI = 12;
  const NAP_FROM = 750, NAP_TO = 870; // 12:30–14:30 clock minutes

  function fmtClock(min) {
    const m = ((Math.round(min) % 1440) + 1440) % 1440;
    return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
  }

  function planScore(s) {
    const why = [];
    let score;
    if (s.tier === "verified") { score = 3; why.push("hand-verified"); }
    else { score = 1; why.push("named stop"); }
    const a = s.amenities;
    const pg = a.playground;
    if (pg && pg.value === "yes" && (pg.confidence === "high" || pg.confidence === "med")) { score += 2; why.push("playground"); }
    if (a.restrooms && a.restrooms.value === "yes") { score += 2; why.push("restrooms"); }
    if (splashSeasonState(s) === "in") { score += 1; why.push("splash pad in season"); }
    if (a.fenced && a.fenced.value === "yes") { score += 1; why.push("fenced"); }
    const d = effDetour(s);
    score -= (d == null ? 10 : d) / 4;
    why.push(d === 0 ? "right on the highway" : d == null ? "detour unknown" : `${detourPrefix(s)}${Math.max(1, Math.round(d))} min off the exit`);
    return { score, why };
  }

  function buildPlan(o) { // o = { depMin, dir, cadenceMin, nap }
    const nb = o.dir === "NB";
    const startMile = nb ? meta.mile_min : meta.mile_max;
    const span = meta.mile_max - meta.mile_min;
    const pool = stops.filter((s) => s.named && s.route_mile != null
      && (s.category === "travel_center" // reachable from both directions via the exit crossover
        || !(nb && s.access_direction === "southbound_only")
        && !(!nb && s.access_direction === "northbound_only")));
    const slots = [];
    const used = new Set();
    let priorStops = 0;
    for (let k = 1; ; k++) {
      const driveMin = k * o.cadenceMin;
      const offset = driveMin / 60 * AVG_MPH;
      if (offset >= span - 5) break; // within ~5 mi of arrival — just drive
      const ideal = nb ? startMile + offset : startMile - offset;
      const clock = o.depMin + driveMin + priorStops * STOP_MIN;
      const tod = ((clock % 1440) + 1440) % 1440;
      if (o.nap && tod >= NAP_FROM && tod <= NAP_TO) {
        slots.push({ type: "nap", clock, ideal });
        continue;
      }
      const cands = pool
        .filter((s) => !used.has(s.id) && Math.abs(s.route_mile - ideal) <= SLOT_WINDOW_MI)
        .map((s) => ({ s, ...planScore(s) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
      if (!cands.length) {
        slots.push({ type: "gap", clock, ideal });
        continue;
      }
      slots.push({ type: "stop", clock, ideal, cands, pick: 0 });
      used.add(cands[0].s.id);
      priorStops++;
    }
    return { slots, arriveClock: o.depMin + span / AVG_MPH * 60 + priorStops * STOP_MIN };
  }
  // ---------- drive planner (ui) ----------
  let plan = null, planOpts = null;

  function renderPlanResult() {
    if (!plan) return;
    const rows = plan.slots.map((slot, i) => {
      if (slot.type === "nap") {
        return `<div class="plan-slot plan-skip"><span class="plan-time">${fmtClock(slot.clock)}</span>
          <span class="plan-slot-body">nap window — drive on</span></div>`;
      }
      if (slot.type === "gap") {
        return `<div class="plan-slot plan-skip"><span class="plan-time">${fmtClock(slot.clock)}</span>
          <span class="plan-slot-body">no good stop near mile ${slot.ideal.toFixed(0)} — drive on</span></div>`;
      }
      const c = slot.cands[slot.pick];
      const s = c.s;
      return `<div class="plan-slot">
        <span class="plan-time">${fmtClock(slot.clock)}</span>
        <div class="plan-slot-body">
          <button class="plan-stop-name" data-id="${esc(s.id)}" type="button">
            ${s.exit_number ? "Exit " + esc(s.exit_number) : "Mile " + s.route_mile.toFixed(1)} · ${displayName(s)}</button>
          <div class="plan-why">${c.why.join(" · ")}</div>
        </div>
        ${slot.cands.length > 1 ? `<button class="plan-swap" data-swap="${i}" type="button">Swap</button>` : ""}
      </div>`;
    }).join("");
    const nStops = plan.slots.filter((sl) => sl.type === "stop").length;
    $("#planResult").innerHTML = `
      <div class="plan-head">${nStops} stop${nStops === 1 ? "" : "s"} ·
        arrive ${planOpts.dir === "NB" ? "Charlotte" : "Atlanta"} ~${fmtClock(plan.arriveClock)}
        <span class="plan-head-fine">(${AVG_MPH} mph avg + ${STOP_MIN} min per stop)</span></div>
      <div class="plan-timeline">${rows}</div>
      ${nStops ? `<div class="trip-actions"><button class="trip-action" id="planAddAll" type="button">★ Add all to My Trip</button>
        <span class="trip-flash" id="planFlash"></span></div>` : ""}`;
    if (nStops) {
      $("#planAddAll").addEventListener("click", () => {
        let added = 0;
        for (const sl of plan.slots) {
          if (sl.type !== "stop") continue;
          const id = sl.cands[sl.pick].s.id;
          if (!inTrip(id)) { trip.push(id); added++; }
        }
        saveTrip();
        render();
        const f = $("#planFlash");
        f.textContent = added ? `${added} added to My Trip` : "already in My Trip";
        setTimeout(() => { f.textContent = ""; }, 2500);
      });
    }
  }

  function swapSlot(i) {
    const slot = plan.slots[i];
    if (!slot || slot.type !== "stop" || slot.cands.length < 2) return;
    const usedElsewhere = new Set(plan.slots
      .filter((sl, j) => j !== i && sl.type === "stop")
      .map((sl) => sl.cands[sl.pick].s.id));
    let p = slot.pick;
    for (let n = 0; n < slot.cands.length; n++) {
      p = (p + 1) % slot.cands.length;
      if (!usedElsewhere.has(slot.cands[p].s.id)) break;
    }
    slot.pick = p;
    renderPlanResult();
  }

  function openPlan() {
    $("#planDir").value = state.direction;
    $("#planSheet").hidden = false;
    syncScrollLock();
  }
  function closePlan() { $("#planSheet").hidden = true; syncScrollLock(); }

  // ---------- events ----------
  document.addEventListener("click", (e) => {
    const star = e.target.closest(".trip-star");
    if (star) { toggleTrip(star.dataset.star); return; }
    const rem = e.target.closest(".trip-remove");
    if (rem) { toggleTrip(rem.dataset.remove); return; }
    const tripRow = e.target.closest(".trip-row-main");
    if (tripRow) { openSheet(tripRow.dataset.id); return; }
    const swap = e.target.closest(".plan-swap");
    if (swap) { swapSlot(+swap.dataset.swap); return; }
    const planStop = e.target.closest(".plan-stop-name");
    if (planStop) { openSheet(planStop.dataset.id); return; }
    const card = e.target.closest(".stop-card");
    if (card) { openSheet(card.dataset.id); return; }
    const row = e.target.closest(".unnamed-row");
    if (row) {
      row.classList.toggle("open");
      const slot = document.querySelector(`.unnamed-slot[data-slot="${CSS.escape(row.dataset.exit)}"]`);
      if (slot) {
        if (slot.innerHTML) slot.innerHTML = "";
        else {
          const items = stops.filter((s) => !s.named && passesFilters(s) && String(s.exit_number || "?") === row.dataset.exit);
          slot.innerHTML = items.map(cardHtml).join("");
        }
      }
    }
  });
  $("#sheetBackdrop").addEventListener("click", closeSheet);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("#sheet").hidden) closeSheet();
    else if (!$("#tripSheet").hidden) closeTrip();
    else if (!$("#planSheet").hidden) closePlan();
  });

  $("#tripBtn").addEventListener("click", openTrip);
  $("#tripClose").addEventListener("click", closeTrip);
  $("#tripBackdrop").addEventListener("click", closeTrip);
  $("#planBtn").addEventListener("click", openPlan);
  $("#planClose").addEventListener("click", closePlan);
  $("#planBackdrop").addEventListener("click", closePlan);
  $("#planForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const [h, m] = ($("#planDep").value || "09:00").split(":").map(Number);
    planOpts = {
      depMin: (h || 0) * 60 + (m || 0),
      dir: $("#planDir").value,
      cadenceMin: +$("#planCadence").value,
      nap: $("#planNap").checked,
    };
    plan = buildPlan(planOpts);
    renderPlanResult();
  });

  function setDirection(dir) {
    state.direction = dir;
    $("#dirNB").classList.toggle("active", dir === "NB");
    $("#dirSB").classList.toggle("active", dir === "SB");
    render();
    if (!$("#tripSheet").hidden) renderTripPanel();
  }
  $("#dirNB").addEventListener("click", () => setDirection("NB"));
  $("#dirSB").addEventListener("click", () => setDirection("SB"));

  function setView(v) {
    state.view = v;
    $("#viewList").classList.toggle("active", v === "list");
    $("#viewMap").classList.toggle("active", v === "map");
    $("#corridorView").hidden = v !== "list";
    $("#mapView").hidden = v !== "map";
    render();
    if (v === "map") setTimeout(() => map && map.invalidateSize(), 50);
  }
  $("#viewList").addEventListener("click", () => setView("list"));
  $("#viewMap").addEventListener("click", () => setView("map"));

  function setSort(sort) {
    state.sort = sort;
    $("#sortMile").classList.toggle("active", sort === "mile");
    $("#sortDetour").classList.toggle("active", sort === "detour");
    render();
  }
  $("#sortMile").addEventListener("click", () => setSort("mile"));
  $("#sortDetour").addEventListener("click", () => setSort("detour"));
  $("#logoHome").addEventListener("click", (e) => { e.preventDefault(); setView("list"); window.scrollTo({ top: 0, behavior: "smooth" }); });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      if (state.filters.has(f)) state.filters.delete(f); else state.filters.add(f);
      chip.classList.toggle("active");
      render();
    });
  });

  function render() {
    if (state.view === "list") renderTimeline();
    else renderMap();
  }

  // ---------- about ----------
  $("#aboutFine").textContent =
    `${meta.counts.total} places on file for ${meta.corridor} (${meta.corridor_label}): ` +
    `${meta.counts.verified} hand-verified with full evidence, ${meta.counts.named - meta.counts.verified} named and mapped, ` +
    `${meta.counts.unnamed} unnamed map pins awaiting a name and a visit. Last updated ${meta.built}.`;

  updateTripBtn();
  checkSharedTrip();
  render();
})();
