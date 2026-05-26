/**
 * IP Replacer for Immich Unraid Manual
 *
 * Replaces all occurrences of <your-unraid-ip> in text and code blocks
 * with a user-provided IP address and selected protocol (http/https).
 * URLs become clickable links when an IP is entered.
 * Persists via localStorage.
 *
 * Security: User input is escaped via escapeHtml() before insertion.
 * Browser-only — no data is stored or transmitted.
 */
(function () {
  "use strict";

  var STORAGE_KEY_IP = "immich-guide-unraid-ip";
  var STORAGE_KEY_PROTO = "immich-guide-unraid-proto";

  // Match http://<your-unraid-ip> with optional port and path
  var URL_PATTERN_RE = /http:\/\/&lt;your-unraid-ip&gt;(:\d+)?(\/[^\s<"]*)?/g;
  // Match standalone <your-unraid-ip> (after URL patterns are handled)
  var IP_PATTERN_RE = /&lt;your-unraid-ip&gt;/g;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /**
   * Find the innermost elements containing the placeholder.
   * Avoids processing both a parent (li) and its child (code) for
   * the same placeholder, which would corrupt innerHTML snapshots.
   */
  function snapshotOriginals() {
    var selectors =
      ".md-content p, .md-content li, .md-content td, .md-content th, " +
      ".md-content code, .md-content pre, .md-content a, .md-content h1, " +
      ".md-content h2, .md-content h3, .md-content h4";
    var allEls = document.querySelectorAll(selectors);
    var candidates = [];

    for (var i = 0; i < allEls.length; i++) {
      var el = allEls[i];
      IP_PATTERN_RE.lastIndex = 0;
      if (el.dataset.ipOriginal || IP_PATTERN_RE.test(el.innerHTML)) {
        candidates.push(el);
      }
    }

    var targets = [];
    for (var i = 0; i < candidates.length; i++) {
      var isParent = false;
      for (var j = 0; j < candidates.length; j++) {
        if (i !== j && candidates[i].contains(candidates[j])) {
          isParent = true;
          break;
        }
      }
      if (!isParent) {
        if (!candidates[i].dataset.ipOriginal) {
          candidates[i].dataset.ipOriginal = candidates[i].innerHTML;
        }
        targets.push(candidates[i]);
      }
    }
    return targets;
  }

  function applyReplacement(targets, ip, proto) {
    var safeIp = ip ? escapeHtml(ip.trim()) : "";
    var safeProto = proto === "https" ? "https" : "http";
    if (!safeIp) return;

    for (var i = 0; i < targets.length; i++) {
      var el = targets[i];
      var original = el.dataset.ipOriginal;
      if (!original) continue;

      // Step 1: Replace full URL patterns
      // URLs with a port (e.g. :2283) → clickable links (Immich/app URLs)
      // URLs without a port (e.g. /Terminal, /Docker) → plain text (Unraid UI, requires active session)
      URL_PATTERN_RE.lastIndex = 0;
      var result = original.replace(URL_PATTERN_RE, function (match, port, path) {
        var p = port || "";
        var pa = path || "";
        var display = safeProto + "://" + safeIp + p + pa;

        if (p) {
          // Has port → app URL → clickable link
          var href = safeProto + "://" + safeIp + p + pa;
          return '<a href="' + href + '" class="ip-link" target="_blank" rel="noopener">' +
            display + '<span class="ip-link-icon" aria-hidden="true">\u00a0\u2197</span></a>';
        } else {
          // No port → Unraid UI path → plain text (user must copy-paste)
          return '<span class="ip-replaced">' + display + "</span>";
        }
      });

      // Step 2: Replace remaining standalone placeholders → plain text
      IP_PATTERN_RE.lastIndex = 0;
      result = result.replace(IP_PATTERN_RE, '<span class="ip-replaced">' + safeIp + "</span>");

      el.innerHTML = result;
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

  function getState() {
    var ip = "";
    var proto = "http";
    try {
      ip = localStorage.getItem(STORAGE_KEY_IP) || "";
      proto = localStorage.getItem(STORAGE_KEY_PROTO) || "http";
    } catch (e) {}
    return { ip: ip, proto: proto };
  }

  function saveState(ip, proto) {
    try {
      localStorage.setItem(STORAGE_KEY_IP, ip);
      localStorage.setItem(STORAGE_KEY_PROTO, proto);
    } catch (e) {}
  }

  function init() {
    var input = document.getElementById("ip-input");
    var protoSelect = document.getElementById("ip-protocol");
    var resetBtn = document.getElementById("ip-reset");
    if (!input) return;

    var state = getState();
    input.value = state.ip;
    if (protoSelect) protoSelect.value = state.proto;

    var targets = snapshotOriginals();
    if (state.ip) {
      applyReplacement(targets, state.ip, state.proto);
    }

    function onUpdate() {
      var ip = input.value;
      var proto = protoSelect ? protoSelect.value : "http";
      saveState(ip, proto);
      restoreOriginals(targets);
      if (ip.trim()) {
        applyReplacement(targets, ip, proto);
      }
    }

    input.addEventListener("input", onUpdate);
    if (protoSelect) protoSelect.addEventListener("change", onUpdate);

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        input.value = "";
        if (protoSelect) protoSelect.value = "http";
        try {
          localStorage.removeItem(STORAGE_KEY_IP);
          localStorage.removeItem(STORAGE_KEY_PROTO);
        } catch (e) {}
        restoreOriginals(targets);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
