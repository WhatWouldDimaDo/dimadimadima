/* On Dima's Radar — analytics: Vercel Web Analytics + PostHog dual-send.
   Self-contained by design: delegated listeners + a wrap of the global
   openBottomSheet, so app.js never needs analytics edits. Loaded from
   <head> on every page; pages without app.js just get pageviews,
   cta_click, and scroll_depth. */
(function () {
  "use strict";

  /* PostHog official queue stub + init (same token as all Dima properties) */
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId startSessionRecording stopSessionRecording get_distinct_id get_session_id".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('phc_tcNY2thEZc7bdM9Gafdzp8HZYFuUoWWAnyVgSFRXB9t7', {api_host: 'https://us.i.posthog.com', defaults: '2025-05-24', person_profiles: 'always'});

  function track(name, data) {
    if (typeof window.va === "function") window.va("event", { name: name, data: data || {} });
    if (window.posthog && typeof window.posthog.capture === "function") window.posthog.capture(name, data || {});
  }
  window.track = window.track || track;

  /* cta_click: outbound links. Capture phase so inline
     onclick="event.stopPropagation()" (btn-buy) can't swallow it. */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (!/^https?:\/\//i.test(href) || href.indexOf(location.hostname) !== -1) return;
    var type = (a.classList.contains("btn-buy") || /ticket|eventbrite|axs\.com|dice\.fm|seatgeek|etix|freshtix/i.test(href)) ? "tickets" : "outbound";
    track("cta_click", { type: type, location: location.pathname });
  }, true);

  /* filter_use: evergreen chip rows + sort controls (delegated, capture) */
  document.addEventListener("click", function (e) {
    var chip = e.target.closest && e.target.closest('[class*="eg-chip"], [data-sort]');
    if (!chip) return;
    var group = (chip.className.match(/eg-chip[\w-]*/) || ["sort"])[0];
    track("filter_use", { filter: group, value: (chip.textContent || "").trim().slice(0, 40) });
  }, true);

  /* scroll_depth */
  var depthFired = {};
  window.addEventListener("scroll", function () {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    if (max <= 0) return;
    var pct = ((window.scrollY || doc.scrollTop) / max) * 100;
    [25, 50, 75, 100].forEach(function (d) {
      if (pct >= d && !depthFired[d]) {
        depthFired[d] = true;
        track("scroll_depth", { depth: d });
      }
    });
  }, { passive: true });

  /* event_detail_open: wrap the global bottom-sheet opener after app.js runs.
     Inline onclick handlers and internal calls both resolve through the
     global binding, so the wrap sees every open. */
  document.addEventListener("DOMContentLoaded", function () {
    var orig = window.openBottomSheet;
    if (typeof orig !== "function") return;
    window.openBottomSheet = function (id) {
      try {
        var list = (typeof EVENTS !== "undefined" && EVENTS) || [];
        var ev = list.find(function (e) { return e.id === id; });
        track("event_detail_open", { event: ev ? ev.title : String(id) });
      } catch (err) { /* tracking must never block the sheet */ }
      return orig.apply(this, arguments);
    };
  });
})();
