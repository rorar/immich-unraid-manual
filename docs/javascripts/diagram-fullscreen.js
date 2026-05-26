/**
 * Mermaid Diagram Fullscreen Viewer
 *
 * Uses the native Fullscreen API on the .mermaid container.
 * Works regardless of how Mermaid renders (SVG, canvas, shadow DOM).
 * The browser fullscreens whatever is visually rendered in the element.
 *
 * Zoom: use browser native zoom (Ctrl+/Ctrl- or pinch on mobile).
 * Exit: Esc key or swipe down on mobile.
 */

function openMermaidFullscreen(btnEl) {
  "use strict";

  var el = btnEl.previousElementSibling;
  while (el && !(el.classList && el.classList.contains("mermaid"))) {
    el = el.previousElementSibling;
  }

  if (!el) {
    console.warn("[diagram-fullscreen] No .mermaid element found");
    return;
  }

  // Add close button inside the element
  var closeBtn = document.createElement("button");
  closeBtn.className = "mermaid-close-btn";
  closeBtn.setAttribute("aria-label", "Exit fullscreen");
  closeBtn.textContent = "\u2715 Close";
  closeBtn.addEventListener("click", function () {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  });
  el.appendChild(closeBtn);

  // Enter fullscreen
  el.classList.add("mermaid--fullscreen");

  var fsMethod = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
  if (fsMethod) {
    fsMethod.call(el).catch(function (err) {
      console.warn("[diagram-fullscreen] Fullscreen request failed:", err);
      el.classList.remove("mermaid--fullscreen");
      el.removeChild(closeBtn);
    });
  } else {
    console.warn("[diagram-fullscreen] Fullscreen API not supported");
    el.classList.remove("mermaid--fullscreen");
    el.removeChild(closeBtn);
  }

  // Clean up when exiting fullscreen
  function onFsChange() {
    var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fsEl) {
      el.classList.remove("mermaid--fullscreen");
      if (closeBtn.parentNode) closeBtn.parentNode.removeChild(closeBtn);
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    }
  }
  document.addEventListener("fullscreenchange", onFsChange);
  document.addEventListener("webkitfullscreenchange", onFsChange);
}
