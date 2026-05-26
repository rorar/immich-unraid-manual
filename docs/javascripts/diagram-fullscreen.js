/**
 * Mermaid Diagram Fullscreen Viewer
 *
 * Wraps the .mermaid element in a temporary fullscreen container
 * with a close button. On exit, the element is moved back.
 *
 * Zoom: browser native (Ctrl+/- or pinch on mobile).
 * Exit: Close button, Esc key, or browser fullscreen controls.
 */

function openMermaidFullscreen(btnEl) {
  "use strict";

  var el = btnEl.previousElementSibling;
  while (el && !(el.classList && el.classList.contains("mermaid"))) {
    el = el.previousElementSibling;
  }
  if (!el) return;

  // Remember position for restoring later
  var originalParent = el.parentNode;
  var originalNext = el.nextSibling;

  // Build fullscreen wrapper
  var wrapper = document.createElement("div");
  wrapper.className = "mermaid-fs-wrapper";

  var closeBtn = document.createElement("button");
  closeBtn.className = "mermaid-close-btn";
  closeBtn.setAttribute("aria-label", "Exit fullscreen");
  closeBtn.textContent = "\u2715 Close";
  closeBtn.addEventListener("click", function () {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  });

  // Move .mermaid into wrapper, add close button
  wrapper.appendChild(closeBtn);
  originalParent.insertBefore(wrapper, originalNext);
  wrapper.appendChild(el);

  // Enter fullscreen on the wrapper
  var fsMethod = wrapper.requestFullscreen || wrapper.webkitRequestFullscreen;
  if (fsMethod) {
    fsMethod.call(wrapper).catch(function () {
      // Fullscreen failed — restore DOM
      originalParent.insertBefore(el, wrapper);
      originalParent.removeChild(wrapper);
    });
  }

  // Restore DOM when exiting fullscreen
  function onFsChange() {
    var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fsEl) {
      originalParent.insertBefore(el, wrapper);
      if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    }
  }
  document.addEventListener("fullscreenchange", onFsChange);
  document.addEventListener("webkitfullscreenchange", onFsChange);
}
