/**
 * IP Replacer for Immich Unraid Manual
 *
 * Replaces all occurrences of <your-unraid-ip> in text and code blocks
 * with a user-provided IP address. Persists via localStorage.
 *
 * The input bar is rendered via MkDocs Material template override (announce block),
 * so it persists across page navigations without re-injection.
 *
 * Security: User input is escaped via escapeHtml() before insertion.
 * Browser-only — no data is stored or transmitted.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "immich-guide-unraid-ip";
  var PLACEHOLDER_RE = /&lt;your-unraid-ip&gt;|<your-unraid-ip>/g;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function snapshotOriginals() {
    var selectors =
      ".md-content p, .md-content li, .md-content td, .md-content th, " +
      ".md-content code, .md-content pre, .md-content a, .md-content h1, " +
      ".md-content h2, .md-content h3, .md-content h4";
    var elements = document.querySelectorAll(selectors);
    var targets = [];
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      PLACEHOLDER_RE.lastIndex = 0;
      if (PLACEHOLDER_RE.test(el.innerHTML)) {
        el.dataset.ipOriginal = el.innerHTML;
        targets.push(el);
      }
    }
    return targets;
  }

  function applyReplacement(targets, ip) {
    var safeIp = escapeHtml(ip.trim());
    for (var i = 0; i < targets.length; i++) {
      var el = targets[i];
      var original = el.dataset.ipOriginal;
      if (!original) continue;
      PLACEHOLDER_RE.lastIndex = 0;
      if (safeIp) {
        el.innerHTML = original.replace(
          PLACEHOLDER_RE,
          '<span class="ip-replaced">' + safeIp + "</span>"
        );
      } else {
        el.innerHTML = original;
      }
    }
  }

  function restoreOriginals(targets) {
    for (var i = 0; i < targets.length; i++) {
      var el = targets[i];
      if (el.dataset.ipOriginal) {
        el.innerHTML = el.dataset.ipOriginal;
      }
    }
  }

  function applyFromStorage() {
    var saved = "";
    try { saved = localStorage.getItem(STORAGE_KEY) || ""; } catch (e) {}
    var targets = snapshotOriginals();
    if (saved) applyReplacement(targets, saved);
    return { targets: targets, saved: saved };
  }

  function init() {
    var input = document.getElementById("ip-input");
    var resetBtn = document.getElementById("ip-reset");
    var infoBtn = document.getElementById("ip-info-btn");
    var tooltip = document.getElementById("ip-tooltip");

    if (!input) return;

    // Restore saved IP into input field
    var state = applyFromStorage();
    input.value = state.saved;

    // Tooltip toggle
    if (infoBtn && tooltip) {
      infoBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        tooltip.classList.toggle("ip-replacer-tooltip--visible");
      });
      document.addEventListener("click", function () {
        tooltip.classList.remove("ip-replacer-tooltip--visible");
      });
    }

    // IP input handler
    input.addEventListener("input", function () {
      var val = input.value;
      try { localStorage.setItem(STORAGE_KEY, val); } catch (e) {}
      var targets = snapshotOriginals();
      applyReplacement(targets, val);
    });

    // Reset handler
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        input.value = "";
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        var targets = snapshotOriginals();
        restoreOriginals(targets);
      });
    }
  }

  // Run on initial page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
