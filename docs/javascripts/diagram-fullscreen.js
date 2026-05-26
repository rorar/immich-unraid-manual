/**
 * Mermaid Diagram Fullscreen Viewer
 *
 * Provides openMermaidFullscreen() — called from a button placed
 * directly in the Markdown (no dynamic DOM insertion needed).
 *
 * Interaction:
 * - Desktop: scroll-to-zoom + drag-to-pan + Esc to close
 * - Mobile: pinch-to-zoom + drag-to-pan + double-tap to reset
 */

/* exported openMermaidFullscreen */
function openMermaidFullscreen(btnEl) {
  "use strict";

  // Find the nearest .mermaid sibling before the button
  var mermaidEl = btnEl.previousElementSibling;
  while (mermaidEl && !mermaidEl.classList.contains("mermaid")) {
    mermaidEl = mermaidEl.previousElementSibling;
  }
  if (!mermaidEl) return;

  var svg = mermaidEl.querySelector("svg");
  if (!svg) return;

  var SCALE_STEP = 0.15, MIN_SCALE = 0.5, MAX_SCALE = 5;

  var clonedSvg = svg.cloneNode(true);
  clonedSvg.removeAttribute("width");
  clonedSvg.removeAttribute("height");
  clonedSvg.removeAttribute("style");
  clonedSvg.style.maxWidth = "90vw";
  clonedSvg.style.maxHeight = "80vh";
  clonedSvg.style.width = "auto";
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
