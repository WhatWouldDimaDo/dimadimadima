const POSTHOG_PROJECT_TOKEN = "phc_tcNY2thEZc7bdM9Gafdzp8HZYFuUoWWAnyVgSFRXB9t7";
const isProductionHost = window.location.hostname === "dimadimadima.com";

if (isProductionHost) {
  !(function (t, e) {
    let o;
    let n;
    let p;
    let r;
    if (e.__SV) return;
    window.posthog = e;
    e._i = [];
    e.init = function (i, s, a) {
      function g(target, method) {
        const parts = method.split(".");
        if (parts.length === 2) {
          target = target[parts[0]];
          method = parts[1];
        }
        target[method] = function () {
          target.push([method].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }
      p = t.createElement("script");
      p.type = "text/javascript";
      p.crossOrigin = "anonymous";
      p.async = true;
      p.src =
        s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") +
        "/static/array.js";
      r = t.getElementsByTagName("script")[0];
      r.parentNode.insertBefore(p, r);
      let instance = e;
      if (a !== undefined) instance = e[a] = [];
      else a = "posthog";
      instance.people = instance.people || [];
      instance.toString = function (asPeople) {
        let name = "posthog";
        if (a !== "posthog") name += `.${a}`;
        if (!asPeople) name += " (stub)";
        return name;
      };
      instance.people.toString = function () {
        return `${instance.toString(1)}.people (stub)`;
      };
      o =
        "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(
          " ",
        );
      for (n = 0; n < o.length; n += 1) g(instance, o[n]);
      e._i.push([i, s, a]);
    };
    e.__SV = 1;
  })(document, window.posthog || []);

  window.posthog.init(POSTHOG_PROJECT_TOKEN, {
    api_host: "https://us.i.posthog.com",
    defaults: "2026-05-30",
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    disable_session_recording: true,
    person_profiles: "identified_only",
  });

  window.posthog.register({
    site_surface: "private_proposal",
    proposal: "adhd_rewired_growth_strategy",
    access_context: "password_protected_link",
  });
}

const pageName = window.location.pathname.includes("communication-analytics")
  ? "communication_analytics"
  : "growth_strategy";

const capture = (eventName, properties = {}) => {
  if (!isProductionHost || !window.posthog?.capture) return;
  window.posthog.capture(eventName, {
    proposal_page: pageName,
    ...properties,
  });
};

capture("proposal_page_viewed");

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");

menuButton?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open") ?? false;
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-label", "Open navigation");
  });
});

document.querySelector(".search-button")?.addEventListener("click", () => {
  const query = window.prompt("Find a word or phrase on this page");
  if (query?.trim()) window.find(query.trim(), false, false, true);
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.querySelector(".search-button")?.click();
  }
  if (event.key === "Escape") {
    nav?.classList.remove("open");
    menuButton?.setAttribute("aria-label", "Open navigation");
  }
});

const sectionNames =
  pageName === "growth_strategy"
    ? [
        "hero",
        "strategy_map",
        "direction",
        "ip_inventory",
        "book_authority_engine",
        "market_models",
        "ai_research_enablement",
        "opportunity_priorities",
        "collaboration",
        "next_discussion",
        "final_decision",
      ]
    : [
        "hero",
        "proof_points",
        "prototype_evidence",
        "method",
        "business_concepts",
        "value_for_eric",
        "pilot_concept",
        "guardrails",
        "final_decision",
      ];

const sections = Array.from(document.querySelectorAll("main > section"));
const viewedSections = new Set();

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const sectionIndex = sections.indexOf(entry.target);
        const section = sectionNames[sectionIndex] || `section_${sectionIndex + 1}`;
        if (viewedSections.has(section)) return;
        viewedSections.add(section);
        capture("proposal_section_viewed", {
          section,
          section_number: sectionIndex + 1,
        });
        sectionObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.25 },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

let maxScrollDepth = 0;
const firedDepths = new Set();
const scrollMilestones = [25, 50, 75, 90, 100];

const trackScrollDepth = () => {
  const root = document.documentElement;
  const scrollableHeight = root.scrollHeight - root.clientHeight;
  if (scrollableHeight <= 0) return;

  const scrollDepth = Math.min(
    100,
    Math.round(((window.scrollY || root.scrollTop) / scrollableHeight) * 100),
  );
  maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);

  scrollMilestones.forEach((milestone) => {
    if (scrollDepth < milestone || firedDepths.has(milestone)) return;
    firedDepths.add(milestone);
    capture("proposal_scroll_depth_reached", { depth_percent: milestone });
  });
};

window.addEventListener("scroll", trackScrollDepth, { passive: true });
trackScrollDepth();

let activeStartedAt = document.visibilityState === "visible" ? Date.now() : null;
let activeMilliseconds = 0;
const openedAt = Date.now();
const firedTimeMilestones = new Set();
const timeMilestones = [30, 60, 120, 300];
let clickCount = 0;

const updateActiveTime = () => {
  if (activeStartedAt === null) return;
  activeMilliseconds += Date.now() - activeStartedAt;
  activeStartedAt = Date.now();
};

const trackTimeMilestones = () => {
  if (document.visibilityState !== "visible") return;
  updateActiveTime();
  const activeSeconds = Math.floor(activeMilliseconds / 1000);
  timeMilestones.forEach((milestone) => {
    if (activeSeconds < milestone || firedTimeMilestones.has(milestone)) return;
    firedTimeMilestones.add(milestone);
    capture("proposal_active_time_reached", { active_seconds: milestone });
  });
};

const activeTimeInterval = window.setInterval(trackTimeMilestones, 5000);

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    updateActiveTime();
    activeStartedAt = null;
    return;
  }
  activeStartedAt = Date.now();
});

document.addEventListener("click", (event) => {
  const link = event.target.closest?.("a");
  if (!link) return;

  clickCount += 1;
  const rawHref = link.getAttribute("href") || "";

  if (rawHref.startsWith("#")) {
    capture("proposal_navigation_clicked", {
      destination_type: "section",
      destination: rawHref.slice(1) || "top",
    });
    return;
  }

  let destination;
  try {
    destination = new URL(link.href, window.location.href);
  } catch {
    return;
  }

  if (destination.origin === window.location.origin) {
    capture("proposal_navigation_clicked", {
      destination_type: "proposal_page",
      destination:
        destination.pathname.includes("communication-analytics")
          ? "communication_analytics"
          : "growth_strategy",
    });
    return;
  }

  capture("proposal_external_link_clicked", {
    destination_type: "external_reference",
    destination_domain: destination.hostname,
  });
});

let summaryCaptured = false;

const captureEngagementSummary = () => {
  if (summaryCaptured) return;
  summaryCaptured = true;
  updateActiveTime();
  window.clearInterval(activeTimeInterval);
  capture("proposal_engagement_summary", {
    active_seconds: Math.round(activeMilliseconds / 1000),
    elapsed_seconds: Math.round((Date.now() - openedAt) / 1000),
    max_scroll_depth_percent: maxScrollDepth,
    sections_viewed: viewedSections.size,
    total_sections: sections.length,
    link_clicks: clickCount,
  });
};

window.addEventListener("pagehide", captureEngagementSummary);
