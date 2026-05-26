/**
 * Mermaid Diagram Fullscreen Viewer
 *
 * Adds a "Fullscreen" button after each Mermaid diagram.
 * On click/tap, opens the diagram SVG in a fullscreen overlay:
 * - Mobile: pinch-to-zoom + drag-to-pan + double-tap to reset
 * - Desktop: scroll-to-zoom + drag-to-pan + Esc to close
 *
 * Important: does NOT wrap or move the .mermaid element — Mermaid.js
 * replaces <pre> with <div> during rendering and any DOM manipulation
 * of the element would break that process.
 */
(function () {
  "use strict";

  var SCALE_STEP = 0.15;
  var MIN_SCALE = 0.5;
  var MAX_SCALE = 5;

  function addButton(el) {
    // Skip if button already exists after this element
    if (el.nextElementSibling && el.nextElementSibling.classList.contains("mermaid-expand-btn")) return;

    var btn = document.createElement("button");
    btn.className = "mermaid-expand-btn";
    btn.title = "Click to view fullscreen";
    btn.setAttribute("aria-label", "View diagram fullscreen");
    btn.textContent = "\u2922  Fullscreen";
    btn.addEventListener("click", function () {
      var svg = el.querySelector("svg");
      if (svg) openFullscreen(svg);
    });

    // Insert button right after the diagram element (as sibling, not child)
    el.parentNode.insertBefore(btn, el.nextSibling);
  }

  function scan() {
    var els = document.querySelectorAll(".mermaid");
    for (var i = 0; i < els.length; i++) {
      addButton(els[i]);
    }
  }

  function openFullscreen(svg) {
    var clonedSvg = svg.cloneNode(true);
    clonedSvg.removeAttribute("width");
    clonedSvg.removeAttribute("height");
    clonedSvg.style.width = "100%";
    clonedSvg.style.height = "auto";

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

    var scale = 1, translateX = 0, translateY = 0;
    var isDragging = false, startX = 0, startY = 0, lastTx = 0, lastTy = 0;

    function applyTransform() {
      content.style.transform =
        "translate(" + translateX + "px," + translateY + "px) scale(" + scale + ")";
    }

    viewport.addEventListener("wheel", function (e) {
      e.preventDefault();
      scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + (e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP)));
      applyTransform();
    }, { passive: false });

    viewport.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;
      isDragging = true; startX = e.clientX; startY = e.clientY;
      lastTx = translateX; lastTy = translateY;
      viewport.style.cursor = "grabbing"; e.preventDefault();
    });

    function onMouseMove(e) {
      if (!isDragging) return;
      translateX = lastTx + (e.clientX - startX);
      translateY = lastTy + (e.clientY - startY);
      applyTransform();
    }
    function onMouseUp() { isDragging = false; viewport.style.cursor = "grab"; }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    var lastTouchDist = 0;
    viewport.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) {
        isDragging = true; startX = e.touches[0].clientX; startY = e.touches[0].clientY;
        lastTx = translateX; lastTy = translateY;
      } else if (e.touches.length === 2) {
        isDragging = false; lastTouchDist = getTouchDist(e.touches);
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
        scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * (dist / lastTouchDist)));
        lastTouchDist = dist; applyTransform();
      }
      e.preventDefault();
    }, { passive: false });

    viewport.addEventListener("touchend", function () { isDragging = false; lastTouchDist = 0; });

    var lastTap = 0;
    viewport.addEventListener("touchend", function (e) {
      if (e.touches.length > 0) return;
      var now = Date.now();
      if (now - lastTap < 300) { scale = 1; translateX = 0; translateY = 0; applyTransform(); }
      lastTap = now;
    });

    function getTouchDist(t) {
      var dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

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
    function onKey(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);

    setTimeout(function () { hint.style.opacity = "0"; }, 3000);
  }

  // Scan immediately + observe for Mermaid's async element replacement
  function init() {
    scan();
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
