/**
 * embed-inline.js  —  JarvisAI Inline Widget Embed Script
 *
 * How to use on ANY external website:
 * ─────────────────────────────────────────────────────────
 * 1. Place a placeholder div exactly where you want the widget (before WhatsApp button):
 *      <div id="JarvisAI-inline-widget"></div>
 *
 * 2. Add script tag at bottom of <body>:
 *      <script src="https://YOUR-JARVIS-DOMAIN.vercel.app/embed-inline.js" async></script>
 *
 * The widget is a button-only — 3 states: Try Demo Call → Connecting... → End Call
 * No expansion, no orb, no layout changes. Fixed height always.
 * ─────────────────────────────────────────────────────────
 */

;(() => {
  if (window.JarvisAIInlineWidgetLoaded) return;
  window.JarvisAIInlineWidgetLoaded = true;

  // ── Fixed dimensions — button only, never expands ──────────────────
  const BUTTON_WIDTH  = "200px";
  const BUTTON_HEIGHT = "52px";

  function init() {
    const containers = document.querySelectorAll("#JarvisAI-inline-widget");

    containers.forEach((container, index) => {
      if (container.dataset.inlineProcessed) return;
      container.dataset.inlineProcessed = "true";

      // ── Determine base URL from the script tag ────────────────────
      let baseUrl = "";
      const scripts = document.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.includes("embed-inline.js")) {
          baseUrl = scripts[i].src.replace("/embed-inline.js", "");
          break;
        }
      }
      if (!baseUrl) {
        baseUrl = window.location.protocol + "//" + window.location.host;
      }

      // ── Build iframe URL ────────────────────────────────────────────
      const buttonLabel = container.getAttribute("data-button-label") || "Try Demo Call";
      const params = new URLSearchParams({ buttonLabel });
      const iframeSrc = `${baseUrl}/embed/inline?${params.toString()}`;

      // ── Create the iframe ───────────────────────────────────────────
      const iframe = document.createElement("iframe");
      iframe.id = `JarvisAI-inline-iframe-${index}`;
      iframe.src = iframeSrc;

      // Button-only widget — fixed size, no resize needed
      iframe.style.cssText = `
        display: inline-block;
        position: relative;
        width: ${BUTTON_WIDTH};
        height: ${BUTTON_HEIGHT};
        border: none;
        background: transparent;
        overflow: hidden;
        pointer-events: auto;
        vertical-align: middle;
      `;

      iframe.allow = "microphone; screen-wake-lock";
      iframe.title = "JarvisAI Inline Widget";

      iframe.onload = () => console.log("[JarvisAI] Inline widget loaded.");
      iframe.onerror = () => console.error("[JarvisAI] Inline widget failed to load.");

      // ── Replace the placeholder div with the iframe (keeps DOM position) ──
      container.replaceWith(iframe);
    });
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
