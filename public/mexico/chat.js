/* Condesa Days — chat.js
   Guide assistant. Renders inline into the Chat view (#view-chat in
   index.html) — app.js owns showing and hiding that view like every other
   one, and pings 'cdmx:viewchange' when it does. Self-initialising, same
   IIFE style as app.js.

   Contract for whoever wires this in (see CHAT-SETUP.md and the PR notes):

   For every tool call the model proposes (add_place / add_to_itinerary /
   mark_visited / add_note), this file dispatches:

       document.dispatchEvent(new CustomEvent('cdmx:mutate', {
         cancelable: true,
         detail: { tool, args, toolCallId }
       }))

   If nothing calls preventDefault() on that event, chat.js applies the
   change itself, directly to localStorage:
     - condesa_plan_v1        (same key/shape app.js already uses)
     - condesa_userplaces_v1  (new — user-added places, kept separate from
                                data.js so they can never corrupt the curated set)
     - condesa_placemeta_v1   (new — visited dates + notes, keyed by place id)
   ...then dispatches a non-cancelable 'cdmx:mutated' event with
   { tool, args, result } so app.js can re-render if it wants to observe the
   write without owning it.

   To take ownership instead (e.g. so app.js's own render functions run),
   listen for 'cdmx:mutate', apply the change your own way, and call
   e.preventDefault() — chat.js will not also touch localStorage. */

(function () {
  "use strict";

  var D = window.CDMX;
  if (!D) { console.error("CDMX data missing — chat.js needs data.js loaded first"); return; }

  var API_URL = "/api/mexico-chat";

  var LS_HISTORY   = "condesa_chat_history_v1";
  var LS_TOOLLOG    = "condesa_chat_toollog_v1";
  var LS_PLAN       = "condesa_plan_v1";
  var LS_USERPLACES = "condesa_userplaces_v1";
  var LS_PLACEMETA  = "condesa_placemeta_v1";

  var DAY_LABEL = {};
  D.days.forEach(function (d) { DAY_LABEL[d.id] = d.label; });
  var SLOT_LABEL = {};
  D.slots.forEach(function (s) { SLOT_LABEL[s.id] = s.label; });
  var CAT_LABEL = {};
  Object.keys(D.categories).forEach(function (k) { CAT_LABEL[k] = D.categories[k].label; });

  /* ───────────────────────── storage helpers ───────────────────────── */

  function readJSON(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v == null ? fallback : v;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function loadHistory() { return readJSON(LS_HISTORY, []); }
  function saveHistory() { writeJSON(LS_HISTORY, state.history); }

  function loadToolLog() { return readJSON(LS_TOOLLOG, {}); }
  function saveToolLog() { writeJSON(LS_TOOLLOG, state.toolLog); }

  function loadPlan() {
    var p = readJSON(LS_PLAN, null);
    if (p && typeof p === "object") return p;
    var out = {};
    D.days.forEach(function (d) { out[d.id] = []; });
    return out;
  }
  function savePlan(p) { writeJSON(LS_PLAN, p); }

  function loadUserPlaces() { return readJSON(LS_USERPLACES, []); }
  function saveUserPlaces(arr) { writeJSON(LS_USERPLACES, arr); }

  function loadMeta() { return readJSON(LS_PLACEMETA, {}); }
  function saveMeta(m) { writeJSON(LS_PLACEMETA, m); }

  /* ───────────────────────── place resolution ───────────────────────── */

  function byIdAll(id) {
    var hit = D.places.filter(function (p) { return p.id === id; })[0];
    if (hit) return hit;
    return loadUserPlaces().filter(function (p) { return p.id === id; })[0] || null;
  }

  function byNameAll(name) {
    if (!name) return null;
    var q = String(name).trim().toLowerCase();
    var all = D.places.concat(loadUserPlaces());
    var exact = all.filter(function (p) { return p.name.toLowerCase() === q; })[0];
    if (exact) return exact;
    return all.filter(function (p) { return p.name.toLowerCase().indexOf(q) > -1; })[0] || null;
  }

  function resolvePlace(args) {
    if (args.place_id) {
      var byId = byIdAll(args.place_id);
      if (byId) return byId;
    }
    if (args.place_name) return byNameAll(args.place_name);
    return null;
  }

  function slugify(name) {
    return String(name || "place")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "place";
  }

  function uniqueSlug(name) {
    var base = slugify(name), id = base, n = 2;
    var taken = {};
    D.places.forEach(function (p) { taken[p.id] = true; });
    loadUserPlaces().forEach(function (p) { taken[p.id] = true; });
    while (taken[id]) { id = base + "-" + n; n++; }
    return id;
  }

  var CATEGORY_IDS = Object.keys(D.categories);

  /* ───────────────────────── applying tool calls ───────────────────────── */
  /* Every apply* function returns { ok, label, error, undo } where undo is a
     small plain-data descriptor (not a closure) so it survives a reload via
     the tool log in localStorage. */

  function applyAddPlace(args) {
    if (!args.name) return { ok: false, error: "The assistant tried to add a place without a name." };
    var cat = CATEGORY_IDS.indexOf(args.category) > -1 ? args.category : "outing";
    var id = uniqueSlug(args.name);
    var hasCoords = typeof args.lat === "number" && typeof args.lng === "number";
    var place = {
      id: id, name: args.name, cat: cat,
      colonia: args.colonia || "", address: args.address || "",
      lat: hasCoords ? args.lat : null, lng: hasCoords ? args.lng : null,
      coordsUnconfirmed: !!args.coords_unconfirmed || !hasCoords,
      when: Array.isArray(args.when) ? args.when : [],
      cost: args.cost || "", hours: args.hours || "",
      link: args.link || "", tags: Array.isArray(args.tags) ? args.tags : [],
      blurb: args.blurb || "", benefit: args.why_it_works || "",
      userAdded: true, addedAt: new Date().toISOString()
    };
    var arr = loadUserPlaces();
    arr.push(place);
    saveUserPlaces(arr);
    var label = "Added " + place.name + " (" + (CAT_LABEL[cat] || cat) + ")" +
      (place.coordsUnconfirmed ? " — coordinates unconfirmed, worth checking" : "");
    return { ok: true, label: label, result: place, undo: { kind: "add_place", id: id } };
  }

  function undoAddPlace(u) {
    var arr = loadUserPlaces().filter(function (p) { return p.id !== u.id; });
    saveUserPlaces(arr);
  }

  function applyAddToItinerary(args) {
    var place = resolvePlace(args);
    if (!place) return { ok: false, error: "Couldn't find “" + (args.place_name || args.place_id || "") + "” to add to the plan." };
    if (D.days.indexOf === undefined) {}
    var dayOk = D.days.some(function (d) { return d.id === args.day; });
    var slotOk = D.slots.some(function (s) { return s.id === args.slot && !s.block; });
    if (!dayOk || !slotOk) return { ok: false, error: "That day or time block isn't one that exists in this guide." };

    var plan = loadPlan();
    if (!plan[args.day]) plan[args.day] = [];
    var item = { p: place.id, s: args.slot, n: args.note || "" };
    plan[args.day].push(item);
    savePlan(plan);
    var idx = plan[args.day].length - 1;
    var label = "Added " + place.name + " to " + (DAY_LABEL[args.day] || args.day) + " — " + (SLOT_LABEL[args.slot] || args.slot) +
      (item.n ? " (“" + item.n + "”)" : "");
    return { ok: true, label: label, result: item, undo: { kind: "add_to_itinerary", day: args.day, placeId: place.id, slot: args.slot, index: idx } };
  }

  function undoAddToItinerary(u) {
    var plan = loadPlan();
    var arr = plan[u.day] || [];
    // Prefer the exact index if the array hasn't shifted; fall back to the
    // last matching item otherwise so an undo after other edits still works.
    if (arr[u.index] && arr[u.index].p === u.placeId && arr[u.index].s === u.slot) {
      arr.splice(u.index, 1);
    } else {
      for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i].p === u.placeId && arr[i].s === u.slot) { arr.splice(i, 1); break; }
      }
    }
    plan[u.day] = arr;
    savePlan(plan);
  }

  function applyMarkVisited(args) {
    var place = resolvePlace(args);
    if (!place) return { ok: false, error: "Couldn't find “" + (args.place_name || args.place_id || "") + "” to mark visited." };
    var date = args.date || new Date().toISOString().slice(0, 10);
    var meta = loadMeta();
    if (!meta[place.id]) meta[place.id] = { visited: [], notes: [] };
    meta[place.id].visited.push({ date: date, note: args.note || "" });
    saveMeta(meta);
    return {
      ok: true,
      label: "Marked " + place.name + " visited on " + date,
      result: { placeId: place.id, date: date },
      undo: { kind: "mark_visited", placeId: place.id }
    };
  }

  function undoMarkVisited(u) {
    var meta = loadMeta();
    if (meta[u.placeId] && meta[u.placeId].visited.length) {
      meta[u.placeId].visited.pop();
      saveMeta(meta);
    }
  }

  function applyAddNote(args) {
    var place = resolvePlace(args);
    if (!place) return { ok: false, error: "Couldn't find “" + (args.place_name || args.place_id || "") + "” to note." };
    if (!args.note) return { ok: false, error: "The assistant tried to add an empty note." };
    var meta = loadMeta();
    if (!meta[place.id]) meta[place.id] = { visited: [], notes: [] };
    meta[place.id].notes.push({ text: args.note, at: new Date().toISOString() });
    saveMeta(meta);
    return {
      ok: true,
      label: "Added a note to " + place.name,
      result: { placeId: place.id },
      undo: { kind: "add_note", placeId: place.id }
    };
  }

  function undoAddNote(u) {
    var meta = loadMeta();
    if (meta[u.placeId] && meta[u.placeId].notes.length) {
      meta[u.placeId].notes.pop();
      saveMeta(meta);
    }
  }

  var APPLIERS = {
    add_place: applyAddPlace,
    add_to_itinerary: applyAddToItinerary,
    mark_visited: applyMarkVisited,
    add_note: applyAddNote
  };
  var UNDOERS = {
    add_place: undoAddPlace,
    add_to_itinerary: undoAddToItinerary,
    mark_visited: undoMarkVisited,
    add_note: undoAddNote
  };

  function applyToolCall(tool, args, toolCallId) {
    var evt = new CustomEvent("cdmx:mutate", { cancelable: true, detail: { tool: tool, args: args, toolCallId: toolCallId } });
    var handled = !document.dispatchEvent(evt); // false return from dispatchEvent means preventDefault() was called

    if (handled) {
      var entry = { tool: tool, args: args, ok: true, label: humanFallbackLabel(tool, args), handledByHost: true, at: Date.now() };
      state.toolLog[toolCallId] = entry;
      saveToolLog();
      return entry;
    }

    var applier = APPLIERS[tool];
    if (!applier) {
      var unknown = { tool: tool, args: args, ok: false, error: "Unknown tool: " + tool, at: Date.now() };
      state.toolLog[toolCallId] = unknown;
      saveToolLog();
      return unknown;
    }

    var res = applier(args);
    var entry2 = Object.assign({ tool: tool, args: args, at: Date.now() }, res);
    state.toolLog[toolCallId] = entry2;
    saveToolLog();

    if (res.ok) {
      document.dispatchEvent(new CustomEvent("cdmx:mutated", { detail: { tool: tool, args: args, result: res.result } }));
    }
    return entry2;
  }

  function humanFallbackLabel(tool, args) {
    if (tool === "add_place") return "Added " + (args.name || "a place");
    if (tool === "add_to_itinerary") return "Added to the plan";
    if (tool === "mark_visited") return "Marked visited";
    if (tool === "add_note") return "Added a note";
    return tool;
  }

  function undoToolCall(toolCallId) {
    var entry = state.toolLog[toolCallId];
    if (!entry || entry.undone) return;
    if (entry.handledByHost) {
      // The host app owned this mutation; we don't know how to reverse it.
      entry.undoUnavailable = true;
      saveToolLog();
      renderMessages();
      return;
    }
    var undoer = UNDOERS[entry.tool];
    if (undoer && entry.undo) undoer(entry.undo);
    entry.undone = true;
    saveToolLog();
    document.dispatchEvent(new CustomEvent("cdmx:mutated", { detail: { tool: entry.tool, args: entry.args, undone: true } }));
    renderMessages();
  }

  /* ───────────────────────── context sent to the model ───────────────────────── */

  function compactPlace(p) {
    return {
      id: p.id, name: p.name, cat: p.cat, colonia: p.colonia, address: p.address,
      lat: p.lat, lng: p.lng, coordsUnconfirmed: !!p.coordsUnconfirmed,
      when: p.when || [], cost: p.cost || "", hours: p.hours || "",
      tags: p.tags || [], confidence: p.confidence || null,
      blurb: (p.blurb || "").slice(0, 90), userAdded: !!p.userAdded
    };
  }

  function buildContext() {
    return {
      about: D.about,
      updated: D.updated,
      base: D.base,
      whenLabels: D.whenLabels,
      categories: (function () {
        var out = {};
        Object.keys(D.categories).forEach(function (k) { out[k] = D.categories[k].label; });
        return out;
      })(),
      days: D.days.map(function (d) { return { id: d.id, label: d.label, title: d.title, sub: d.sub, date: d.date }; }),
      slots: D.slots.map(function (s) { return { id: s.id, label: s.label, time: s.time, block: !!s.block, fits: s.fits || null }; }),
      places: D.places.map(compactPlace).concat(loadUserPlaces().map(compactPlace)),
      plan: loadPlan(),
      placeMeta: loadMeta(),
      guides: (window.CDMX_GUIDES || []).map(function (g) { return { id: g.id, title: g.title, kicker: g.kicker, summary: g.summary }; })
    };
  }

  /* ───────────────────────── UI ───────────────────────── */

  var $ = function (s, r) { return (r || document).querySelector(s); };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Chat is an inline view (view-chat in index.html) now, not a floating
     panel — app.js owns showing/hiding it like every other view and tells us
     when that happens via cdmx:viewchange. There is no fab, scrim or close
     button left to build; just the conversation itself. */
  function buildUI() {
    var host = $("#view-chat");
    if (!host) { console.error("chat.js: #view-chat container missing"); return; }
    host.innerHTML =
      '<div class="ccx-toolbar">' +
        '<button id="ccxClear" type="button" class="ccx-iconbtn" aria-label="Clear conversation" title="Clear conversation">↻</button>' +
      "</div>" +
      '<div id="ccxMsgs" class="ccx-msgs" role="log" aria-live="polite"></div>' +
      '<div id="ccxError" class="ccx-error" hidden></div>' +
      '<form id="ccxForm" class="ccx-form">' +
        '<textarea id="ccxInput" class="ccx-input" rows="1" ' +
          'placeholder="Ask about the guide, add a place, plan a day…" aria-label="Message"></textarea>' +
        '<button id="ccxSend" class="ccx-send" type="submit" aria-label="Send">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
          'stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>' +
        "</button>" +
      "</form>";
  }

  buildUI();

  var msgsEl = $("#ccxMsgs"), errorEl = $("#ccxError"), formEl = $("#ccxForm"), inputEl = $("#ccxInput");
  if (!msgsEl) return; // #view-chat was missing; buildUI() already logged it

  var state = {
    sending: false,
    history: loadHistory(),
    toolLog: loadToolLog()
  };

  // app.js dispatches this on every view switch (see setView() in app.js).
  // Focus and drop the keyboard-safe scroll position only when we're the one
  // becoming visible — not on every other view change.
  document.addEventListener("cdmx:viewchange", function (e) {
    if (e.detail && e.detail.view === "chat") {
      renderMessages();
      setTimeout(function () { inputEl.focus(); }, 30);
    }
  });

  $("#ccxClear").addEventListener("click", function () {
    if (state.sending) return;
    state.history = [];
    state.toolLog = {};
    saveHistory(); saveToolLog();
    hideError();
    renderMessages();
  });

  /* textarea grows with content, capped by CSS max-height */
  inputEl.addEventListener("input", autosize);
  function autosize() {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + "px";
  }

  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formEl.requestSubmit ? formEl.requestSubmit() : sendCurrentInput();
    }
  });
  formEl.addEventListener("submit", function (e) { e.preventDefault(); sendCurrentInput(); });

  function sendCurrentInput() {
    var text = inputEl.value;
    inputEl.value = "";
    autosize();
    sendMessage(text);
  }

  function hideError() { errorEl.hidden = true; errorEl.textContent = ""; }
  function showError(msg) { errorEl.hidden = false; errorEl.textContent = msg; }

  function apiMessage(m) {
    // Strip UI-only fields before this goes over the wire.
    return { role: m.role, content: m.content, tool_calls: m.tool_calls, tool_call_id: m.tool_call_id, name: m.name };
  }

  /* ───────────────────────── send / receive ───────────────────────── */

  function sendMessage(text) {
    text = (text || "").trim();
    if (!text || state.sending) return;

    hideError();
    state.history.push({ role: "user", content: text });
    saveHistory();
    renderMessages();

    state.sending = true;
    renderPending(true);

    var payload = { messages: state.history.map(apiMessage), context: buildContext() };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) { return { res: res, data: data }; });
      })
      .then(function (r) {
        state.sending = false;
        renderPending(false);

        if (r.res.status === 429) {
          showError(r.data.error || "Too many messages — wait a few minutes and try again.");
          return;
        }
        if (!r.res.ok) {
          showError(r.data.error || "Something went wrong (" + r.res.status + ").");
          return;
        }

        var generated = Array.isArray(r.data.messages) ? r.data.messages : [];
        if (!generated.length) { showError("Empty response from the assistant."); return; }

        generated.forEach(function (m) { state.history.push(m); });
        saveHistory();

        var last = generated[generated.length - 1];
        if (last && last.role === "assistant" && Array.isArray(last.tool_calls)) {
          last.tool_calls.forEach(function (call) {
            if (!call.function) return;
            if (call.function.name === "search_web") {
              // Shouldn't normally reach the client unresolved (the server
              // loops these itself), but guard against a mixed-tool reply so
              // the conversation stays well-formed for the next turn.
              state.history.push({ role: "tool", tool_call_id: call.id, name: "search_web", content: "Search could not be resolved this turn." });
              return;
            }
            var args = {};
            try { args = JSON.parse(call.function.arguments || "{}"); } catch (e) {}
            var entry = applyToolCall(call.function.name, args, call.id);
            state.history.push({
              role: "tool", tool_call_id: call.id, name: call.function.name,
              content: entry.ok ? ("Applied: " + entry.label) : ("Could not apply: " + entry.error)
            });
          });
          saveHistory();
        }

        renderMessages();
      })
      .catch(function () {
        state.sending = false;
        renderPending(false);
        // Roll the optimistic user message back out of the sent-to-server
        // history state is unnecessary — keep it, just flag the failure so
        // the user can retry without retyping.
        showError("Couldn't reach the assistant — check your connection and try again.");
      });
  }

  /* ───────────────────────── rendering ───────────────────────── */

  function renderPending(on) {
    var existing = $("#ccxPending");
    if (on) {
      if (existing) return;
      var el = document.createElement("div");
      el.id = "ccxPending"; el.className = "ccx-msg ccx-msg--bot ccx-pending";
      el.innerHTML = '<span></span><span></span><span></span>';
      msgsEl.appendChild(el);
      msgsEl.scrollTop = msgsEl.scrollHeight;
    } else if (existing) {
      existing.remove();
    }
  }

  function searchQueryFor(historyIdx) {
    // Look back for the assistant tool_call this search result answered, to
    // show a short "looked up: …" line instead of the raw model instruction.
    var m = state.history[historyIdx - 1];
    if (!m || !Array.isArray(m.tool_calls)) return "";
    var call = m.tool_calls.filter(function (c) { return c.function && c.function.name === "search_web"; })[0];
    if (!call) return "";
    try { return JSON.parse(call.function.arguments || "{}").query || ""; } catch (e) { return ""; }
  }

  function renderMessages() {
    var html = "";
    if (!state.history.length) {
      html += '<div class="ccx-empty">Ask about the guide, or ask me to add somewhere, put it on a day, or mark it visited.</div>';
    }

    state.history.forEach(function (m, i) {
      if (m.role === "user") {
        html += '<div class="ccx-msg ccx-msg--user">' + esc(m.content) + "</div>";
        return;
      }
      if (m.role === "tool") {
        if (m.name === "search_web") {
          html += '<div class="ccx-searchnote">🔎 Looked up: ' + esc(searchQueryFor(i) || "the web") + "</div>";
        }
        return; // tool results otherwise aren't shown as bubbles
      }
      if (m.role === "assistant") {
        if (m.content) html += '<div class="ccx-msg ccx-msg--bot">' + esc(m.content) + "</div>";
        (m.tool_calls || []).forEach(function (call) {
          if (!call.function || call.function.name === "search_web") return;
          var entry = state.toolLog[call.id];
          if (!entry) return;
          html += renderToolCard(call.id, entry);
        });
      }
    });

    msgsEl.innerHTML = html;
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function renderToolCard(callId, entry) {
    if (!entry.ok) {
      return '<div class="ccx-toolcard ccx-toolcard--err">⚠ ' + esc(entry.error || "Couldn't apply that change.") + "</div>";
    }
    if (entry.handledByHost) {
      return '<div class="ccx-toolcard">✓ ' + esc(entry.label) + "</div>";
    }
    if (entry.undone) {
      return '<div class="ccx-toolcard ccx-toolcard--undone">↩ Undone — ' + esc(entry.label) + "</div>";
    }
    return '<div class="ccx-toolcard">' +
      '<span>✓ ' + esc(entry.label) + "</span>" +
      '<button type="button" class="ccx-undo" data-undo="' + esc(callId) + '">Undo</button>' +
      "</div>";
  }

  msgsEl.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-undo]");
    if (btn) undoToolCall(btn.dataset.undo);
  });

  /* boot */
  renderMessages();
})();
