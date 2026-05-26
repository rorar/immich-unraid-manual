/**
 * IP Replacer for Immich Unraid Manual
 *
 * Replaces all occurrences of <your-unraid-ip> in text and code blocks
 * with a user-provided IP address. Persists via localStorage.
 *
 * Security: User input is escaped via escapeHtml() before insertion.
 * Original DOM content is preserved from MkDocs-rendered pages only.
 *
 * Browser-only — no data is stored or transmitted.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "immich-guide-unraid-ip";
  var PLACEHOLDER_RE = /&lt;your-unraid-ip&gt;|<your-unraid-ip>/g;

  /** Escape HTML special characters to prevent XSS from user input. */
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /** Build and inject the input bar below the header. */
  function createInputBar() {
    var bar = document.createElement("div");
    bar.className = "ip-replacer";

    var label = document.createElement("label");
    label.setAttribute("for", "ip-input");
    label.textContent = "Your Unraid IP:";

    var input = document.createElement("input");
    input.id = "ip-input";
    input.type = "text";
    input.placeholder = "192.168.1.x";
    input.autocomplete = "off";
    input.spellcheck = false;

    var resetBtn = document.createElement("button");
    resetBtn.id = "ip-reset";
    resetBtn.type = "button";
    resetBtn.title = "Reset to placeholder";
    resetBtn.textContent = "Reset";

    var disclaimer = document.createElement("span");
    disclaimer.className = "ip-replacer-disclaimer";
    disclaimer.textContent = "Browser-only \u2014 no data is stored or transmitted.";

    bar.appendChild(label);
    bar.appendChild(input);
    bar.appendChild(resetBtn);
    bar.appendChild(disclaimer);

    var header = document.querySelector(".md-header");
    if (header && header.nextSibling) {
      header.parentNode.insertBefore(bar, header.nextSibling);
    } else {
      document.body.prepend(bar);
    }

    return bar;
  }

  /**
   * Snapshot original innerHTML of elements that contain the placeholder.
   * We store originals from the MkDocs-rendered DOM (trusted content).
   */
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
        if (!el.dataset.ipOriginal) {
          el.dataset.ipOriginal = el.innerHTML;
        }
        targets.push(el);
      }
    }
    return targets;
  }

  /**
   * Replace placeholder with given IP in all target elements.
   * User input is escaped to prevent XSS before being placed into a <span>.
   * The base content comes from dataset.ipOriginal (trusted MkDocs DOM).
   */
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

  /** Restore all originals from trusted snapshots. */
  function restoreOriginals(targets) {
    for (var i = 0; i < targets.length; i++) {
      var el = targets[i];
      if (el.dataset.ipOriginal) {
        el.innerHTML = el.dataset.ipOriginal;
      }
    }
  }

  /** Initialize on page load and MkDocs instant navigation. */
  function init() {
    var bar = document.querySelector(".ip-replacer") || createInputBar();
    var input = document.getElementById("ip-input");
    var resetBtn = document.getElementById("ip-reset");

    // Restore saved value
    var saved = "";
    try {
      saved = localStorage.getItem(STORAGE_KEY) || "";
    } catch (e) {
      // localStorage unavailable (private browsing etc.)
    }
    if (input) {
      input.value = saved;
    }

    // Snapshot and apply
    var targets = snapshotOriginals();
    if (saved) {
      applyReplacement(targets, saved);
    }

    // Input handler
    if (input) {
      input.addEventListener("input", function () {
        var val = input.value;
        try {
          localStorage.setItem(STORAGE_KEY, val);
        } catch (e) {
          // ignore
        }
        targets = snapshotOriginals();
        applyReplacement(targets, val);
      });
    }

    // Reset handler
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (input) {
          input.value = "";
        }
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          // ignore
        }
        restoreOriginals(targets);
      });
    }
  }

  // Run on initial load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Re-run on MkDocs Material instant navigation (SPA page changes)
  document.addEventListener("DOMContentSwap", function () {
    setTimeout(function () {
      var saved = "";
      try {
        saved = localStorage.getItem(STORAGE_KEY) || "";
      } catch (e) {
        // ignore
      }
      var targets = snapshotOriginals();
      if (saved) {
        applyReplacement(targets, saved);
      }
    }, 50);
  });
})();
