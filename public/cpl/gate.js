/* Password gate — privacy etiquette, not security. Shared across all pages. */
(function () {
  "use strict";

  var KEY = "cpl_ok";
  var PASSWORD = "1987";

  var overlay = document.getElementById("gate-overlay");
  if (!overlay) return;

  var box = overlay.querySelector(".gate-box");
  var form = overlay.querySelector(".gate-form");
  var input = overlay.querySelector(".gate-input");
  var error = overlay.querySelector(".gate-error");

  function lock() {
    document.documentElement.classList.add("gate-locked");
  }

  function unlock(instant) {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    document.documentElement.classList.remove("gate-locked");
    if (instant) {
      overlay.style.display = "none";
      return;
    }
    overlay.classList.add("gate-fade");
    window.setTimeout(function () { overlay.style.display = "none"; }, 650);
  }

  var alreadyOk = false;
  try { alreadyOk = sessionStorage.getItem(KEY) === "1"; } catch (e) {}

  if (alreadyOk) {
    unlock(true);
  } else {
    lock();
    window.setTimeout(function () { if (input) input.focus(); }, 300);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = (input && input.value || "").trim();
      if (value === PASSWORD) {
        if (error) error.classList.remove("show");
        unlock(false);
      } else {
        if (error) error.classList.add("show");
        if (box) {
          box.classList.remove("shake");
          void box.offsetWidth;
          box.classList.add("shake");
        }
        if (input) { input.value = ""; input.focus(); }
      }
    });
  }
})();
