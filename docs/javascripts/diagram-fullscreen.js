/**
 * Mermaid Diagram Fullscreen Viewer
 *
 * Adds an expand button to Mermaid diagrams. On click/tap, opens the
 * diagram in a fullscreen overlay with native touch support:
 * - Mobile: pinch-to-zoom + drag-to-pan + double-tap to reset
 * - Desktop: scroll-to-zoom + drag-to-pan + Esc to close
 *
 * The SVG is cloned from the rendered Mermaid output (trusted DOM content).
 */
(function () {
  "use strict";

  var SCALE_STEP = 0.15;
  var MIN_SCALE = 0.5;
  var MAX_SCALE = 5;

  function addExpandButtons() {
    var diagrams = document.querySelectorAll("pre.mermaid");
    for (var i = 0; i < diagrams.length; i++) {
      if (diagrams[i].dataset.fullscreenReady) continue;
      diagrams[i].dataset.fullscreenReady = "true";
      diagrams[i].style.position = "relative";

      var btn = document.createElement("button");
      btn.className = "mermaid-expand-btn";
      btn.title = "View fullscreen";
      btn.setAttribute("aria-label", "View diagram fullscreen");
      btn.textContent = "\u26F6";
      btn.addEventListener("click", openFullscreen.bind(null, diagrams[i]));
      diagrams[i].appendChild(btn);
    }
  }

  function openFullscreen(mermaidEl) {
    var svg = mermaidEl.querySelector("svg");
    if (!svg) return;

    // Clone the trusted Mermaid-rendered SVG node (not user content)
    var clonedSvg = svg.cloneNode(true);
    clonedSvg.removeAttribute("width");
    clonedSvg.removeAttribute("height");
    clonedSvg.style.width = "100%";
    clonedSvg.style.height = "auto";

    // --- Build overlay ---
    var overlay = document.createElement("div");
    overlay.className = "mermaid-overlay";

    var closeBtn = document.createElement("button");
    closeBtn.className = "mermaid-overlay-close";
    closeBtn.setAttribute("aria-label", "Close fullscreen");
    closeBtn.textContent = "\u2715";

    var hint = document.createElement("div");
    hint.className = "mermaid-overlay-hint";
    hint.textContent = window.matchMedia("(pointer: coarse)").matches
      ? "Pinch to zoom \u2022 Drag to pan \u2022 Double-tap to reset"
      : "Scroll to zoom \u2022 Drag to pan \u2022 Esc to close";

    var viewport = document.createElement("div");
    viewport.className = "mermaid-overlay-viewport";

    var content = document.createElement("div");
    content.className = "mermaid-overlay-content";
    content.appendChild(clonedSvg);

    viewport.appendChild(content);
    overlay.appendChild(closeBtn);
    overlay.appendChild(hint);
    overlay.appendChild(viewport);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    // --- Transform state ---
    var scale = 1;
    var translateX = 0;
    var translateY = 0;
    var isDragging = false;
    var startX = 0;
    var startY = 0;
    var lastTx = 0;
    var lastTy = 0;

    function applyTransform() {
      content.style.transform =
        "translate(" + translateX + "px, " + translateY + "px) scale(" + scale + ")";
    }

    // --- Scroll zoom (desktop) ---
    viewport.addEventListener("wheel", function (e) {
      e.preventDefault();
      var delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
      scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta));
      applyTransform();
    }, { passive: false });

    // --- Mouse drag (desktop) ---
    viewport.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      lastTx = translateX;
      lastTy = translateY;
      viewport.style.cursor = "grabbing";
      e.preventDefault();
    });

    function onMouseMove(e) {
      if (!isDragging) return;
      translateX = lastTx + (e.clientX - startX);
      translateY = lastTy + (e.clientY - startY);
      applyTransform();
    }

    function onMouseUp() {
      isDragging = false;
      viewport.style.cursor = "grab";
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    // --- Touch: pinch-zoom + drag (mobile) ---
    var lastTouchDist = 0;

    viewport.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        lastTx = translateX;
        lastTy = translateY;
      } else if (e.touches.length === 2) {
        isDragging = false;
        lastTouchDist = getTouchDist(e.touches);
      }
      e.preventDefault();
    }, { passive: false });

    viewport.addEventListener("touchmove", function (e) {
      if (e.touches.length === 1 && isDragging) {
        translateX = lastTx + (e.touches[0].clientX - startX);
        translateY = lastTy + (e.touches[0].clientY - startY);
        applyTransform();
      } else if (e.touches.length === 2) {
        var dist = getTouchDist(e.touches);
        var ratio = dist / lastTouchDist;
        scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * ratio));
        lastTouchDist = dist;
        applyTransform();
      }
      e.preventDefault();
    }, { passive: false });

    viewport.addEventListener("touchend", function () {
      isDragging = false;
      lastTouchDist = 0;
    });

    // --- Double-tap to reset (mobile) ---
    var lastTap = 0;
    viewport.addEventListener("touchend", function (e) {
      if (e.touches.length > 0) return;
      var now = Date.now();
      if (now - lastTap < 300) {
        scale = 1;
        translateX = 0;
        translateY = 0;
        applyTransform();
      }
      lastTap = now;
    });

    function getTouchDist(touches) {
      var dx = touches[0].clientX - touches[1].clientX;
      var dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    // --- Close handlers ---
    function close() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("keydown", onKey);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.body.style.overflow = "";
    }

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target === viewport) close();
    });

    function onKey(e) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);

    // Fade out hint after 3s
    setTimeout(function () {
      hint.style.opacity = "0";
    }, 3000);
  }

  // Mermaid renders async — wait for SVGs to appear
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(addExpandButtons, 500);
    });
  } else {
    setTimeout(addExpandButtons, 500);
  }
})();
