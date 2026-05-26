/**
 * IP Replacer for Immich Unraid Manual
 *
 * Replaces all occurrences of <your-unraid-ip> in text and code blocks
 * with a user-provided IP address and selected protocol (http/https).
 * Persists via localStorage.
 *
 * Security: User input is escaped via escapeHtml() before insertion.
 * Browser-only — no data is stored or transmitted.
 */
(function () {
  "use strict";

  var STORAGE_KEY_IP = "immich-guide-unraid-ip";
  var STORAGE_KEY_PROTO = "immich-guide-unraid-proto";

  // Match http://<your-unraid-ip> as a unit (protocol + placeholder)
  var URL_PATTERN_RE = /http:\/\/&lt;your-unraid-ip&gt;/g;
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

    // Step 1: collect all elements that match OR already have a snapshot
    for (var i = 0; i < allEls.length; i++) {
      var el = allEls[i];
      IP_PATTERN_RE.lastIndex = 0;
      if (el.dataset.ipOriginal || IP_PATTERN_RE.test(el.innerHTML)) {
        candidates.push(el);
      }
    }

    // Step 2: keep only innermost — drop any candidate that contains another
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

    for (var i = 0; i < targets.length; i++) {
      var el = targets[i];
      var original = el.dataset.ipOriginal;
      if (!original) continue;

      if (safeIp) {
        var urlReplacement =
          '<span class="ip-replaced">' + safeProto + "://" + safeIp + "</span>";
        var ipReplacement =
          '<span class="ip-replaced">' + safeIp + "</span>";

        URL_PATTERN_RE.lastIndex = 0;
        IP_PATTERN_RE.lastIndex = 0;
        var result = original.replace(URL_PATTERN_RE, urlReplacement);
        result = result.replace(IP_PATTERN_RE, ipReplacement);
        el.innerHTML = result;
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

    // Initial snapshot — done once, reused for all replacements
    var targets = snapshotOriginals();
    if (state.ip) {
      applyReplacement(targets, state.ip, state.proto);
    }

    function onUpdate() {
      var ip = input.value;
      var proto = protoSelect ? protoSelect.value : "http";
      saveState(ip, proto);
      // Restore originals first, then re-apply with new values.
      // This ensures we always replace from the clean original.
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
