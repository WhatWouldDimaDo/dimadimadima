(function () {
  "use strict";

  /* ---- scroll reveal ---- */
  var revealables = document.querySelectorAll(
    ".concept-context, .observation, .assessment-board, .ba-slider, .concept-block, .plan-card, .reference-compare, .company-profile, .arjun-profile, .process-section, .tier, .contact-title, .contact-note"
  );

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---- lightbox ---- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var triggers = document.querySelectorAll("[data-lightbox]");

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  triggers.forEach(function (el) {
    var img = el.querySelector("img");
    if (!img) return;

    el.addEventListener("click", function () {
      openLightbox(img.currentSrc || img.src, img.alt);
    });

    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(img.currentSrc || img.src, img.alt);
      }
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  /* ---- before / after sliders ---- */
  var baSliders = document.querySelectorAll("[data-ba-slider]");

  baSliders.forEach(function (el) {
    var frame = el.querySelector(".ba-frame");
    var range = el.querySelector(".ba-range");
    var viewButtons = el.querySelectorAll("[data-ba-view]");
    if (!frame || !range) return;

    function setPos(val) {
      var v = Math.min(100, Math.max(0, val));
      range.value = String(v);
      frame.style.setProperty("--ba-pos", v + "%");
      viewButtons.forEach(function (button) {
        button.classList.toggle("is-active", Math.abs(parseFloat(button.dataset.baView) - v) < 0.1);
      });
    }

    function setFromPointer(event) {
      var rect = frame.getBoundingClientRect();
      setPos(((event.clientX - rect.left) / rect.width) * 100);
    }

    setPos(parseFloat(range.value));

    range.addEventListener("input", function () {
      setPos(parseFloat(range.value));
    });

    range.addEventListener("pointerdown", function (event) {
      range.setPointerCapture(event.pointerId);
      setFromPointer(event);
    });

    range.addEventListener("pointermove", function (event) {
      if (event.buttons === 1 || range.hasPointerCapture(event.pointerId)) setFromPointer(event);
    });

    range.addEventListener("pointerup", setFromPointer);

    range.addEventListener("keydown", function (event) {
      var delta = 0;
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") delta = -1;
      if (event.key === "ArrowRight" || event.key === "ArrowUp") delta = 1;
      if (event.key === "Home") {
        event.preventDefault();
        setPos(0);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        setPos(100);
        return;
      }
      if (delta) {
        event.preventDefault();
        setPos(parseFloat(range.value) + delta);
      }
    });

    viewButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setPos(parseFloat(button.dataset.baView));
      });
    });
  });

  /* ---- front-entry concept directions ---- */
  var conceptButtons = document.querySelectorAll("[data-concept]");
  var frontAfterImage = document.getElementById("frontAfterImage");
  var conceptTitle = document.getElementById("conceptTitle");
  var conceptDescription = document.getElementById("conceptDescription");
  var conceptCharacter = document.getElementById("conceptCharacter");
  var conceptMaintenance = document.getElementById("conceptMaintenance");
  var conceptSeasonal = document.getElementById("conceptSeasonal");
  var conceptBudget = document.getElementById("conceptBudget");
  var conceptPreference = document.getElementById("conceptPreference");
  var conceptLabel = document.querySelector(".ba-tag-after");

  conceptButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      conceptButtons.forEach(function (candidate) {
        var isSelected = candidate === button;
        candidate.classList.toggle("is-active", isSelected);
        candidate.setAttribute("aria-pressed", String(isSelected));
      });

      frontAfterImage.src = button.dataset.src;
      frontAfterImage.alt = button.dataset.alt;
      conceptTitle.textContent = button.dataset.title;
      conceptDescription.textContent = button.dataset.description;
      conceptCharacter.textContent = button.dataset.character;
      conceptMaintenance.textContent = button.dataset.maintenance;
      conceptSeasonal.textContent = button.dataset.seasonal;
      conceptBudget.textContent = button.dataset.budget;
      conceptLabel.textContent = button.dataset.label;
      conceptPreference.href = "sms:+14044460539?&body=Hi%20Arjun%20%E2%80%94%20I%20prefer%20direction%20" + button.dataset.code + ".%20Can%20we%20talk%20through%20it%3F";
    });
  });

  /* ---- optional Calendly embed ----
     Add the approved event URL to body[data-calendly-url] to activate. */
  var calendlyUrl = document.body.dataset.calendlyUrl;
  var calendlyEmbed = document.getElementById("calendlyEmbed");
  var bookingPlaceholder = document.getElementById("bookingPlaceholder");
  var bookingPlaceholderNote = document.querySelector(".booking-placeholder-note");

  if (calendlyUrl && calendlyEmbed) {
    calendlyEmbed.dataset.url = calendlyUrl;
    bookingPlaceholder.hidden = true;
    if (bookingPlaceholderNote) bookingPlaceholderNote.hidden = true;

    var loadCalendly = function () {
      if (document.querySelector('script[data-calendly-loader]')) return;
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);

      var script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.dataset.calendlyLoader = "true";
      document.body.appendChild(script);
    };

    if ("IntersectionObserver" in window) {
      var calendlyObserver = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) {
          loadCalendly();
          calendlyObserver.disconnect();
        }
      }, { rootMargin: "500px 0px" });
      calendlyObserver.observe(calendlyEmbed);
    } else {
      loadCalendly();
    }
  }

  /* ---- print / PDF actions ---- */
  var printButtons = document.querySelectorAll("#printProposal, [data-print-proposal]");
  printButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      window.print();
    });
  });
})();
