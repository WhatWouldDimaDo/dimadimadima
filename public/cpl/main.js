(function () {
  "use strict";

  /* ---- scroll reveal ---- */
  var revealables = document.querySelectorAll(".reveal");
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---- before / after sliders ---- */
  var baSliders = document.querySelectorAll("[data-ba-slider]");
  baSliders.forEach(function (el) {
    var frame = el.querySelector(".ba-frame");
    var range = el.querySelector(".ba-range");
    if (!frame || !range) return;

    function setPos(val) {
      var v = Math.min(100, Math.max(0, val));
      frame.style.setProperty("--ba-pos", v + "%");
    }

    setPos(parseFloat(range.value));
    range.addEventListener("input", function () {
      setPos(parseFloat(range.value));
    });
  });

  /* ---- mobile nav toggle ---- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navMenu = document.querySelector("[data-nav-menu]");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
})();
