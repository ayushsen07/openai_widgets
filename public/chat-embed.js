; (() => {
  // Prevent multiple initializations
  if (window.JarvisAIChatWidgetLoaded) {
    return
  }
  window.JarvisAIChatWidgetLoaded = true

  function loadJarvisAIWidget() {
    const containers = document.querySelectorAll("#JarvisAI-chat-widget")

    containers.forEach((container, index) => {
      // Skip if already processed
      if (container.dataset.processed) {
        return
      }
      container.dataset.processed = "true"

      // Optional styling attributes
      const position = container.getAttribute("data-position") || "bottom-right"
      const theme = container.getAttribute("data-theme") || "light"
      const model = container.getAttribute("data-model") || "gpt-3.5-turbo"
      const welcomeMessage = container.getAttribute("data-welcome-message") || "Hello! How can I help you today?"

      // Get the current script's source to determine the base URL
      const scripts = document.getElementsByTagName("script")
      let baseUrl = ""
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.includes("chat-embed.js")) {
          baseUrl = scripts[i].src.replace("/chat-embed.js", "")
          break
        }
      }

      // Fallback to current domain if script source not found
      if (!baseUrl) {
        baseUrl = window.location.protocol + "//" + window.location.host
      }

      // Create unique iframe ID
      const iframeId = `JarvisAI-chat-widget-iframe-${index}`

      // Build iframe URL with parameters
      const params = new URLSearchParams({
        position: position,
        theme: theme,
        model: model,
        welcomeMessage: welcomeMessage,
      })

      // Determine initial position styles based on data-position
      const positionStyles = {
        "bottom-right": "bottom: 0; right: 0;",
        "bottom-left": "bottom: 0; left: 0;",
        "top-right": "top: 0; right: 0;",
        "top-left": "top: 0; left: 0;",
      }

      const posStyle = positionStyles[position] || positionStyles["bottom-right"]

      // Collapsed size: enough for the floating button (with padding)
      const COLLAPSED_WIDTH = "250px"
      const COLLAPSED_HEIGHT = "80px"
      // Expanded size: enough for the chat panel
      const EXPANDED_WIDTH = "420px"
      const EXPANDED_HEIGHT = "660px"

      // Create iframe
      const iframe = document.createElement("iframe")
      iframe.id = iframeId
      iframe.src = `${baseUrl}/embed/chat?${params.toString()}`
      iframe.style.cssText = `
        position: fixed;
        ${posStyle}
        width: ${COLLAPSED_WIDTH};
        height: ${COLLAPSED_HEIGHT};
        border: none;
        z-index: 2147483647;
        background: transparent;
        pointer-events: auto;
        transition: width 0.3s ease, height 0.3s ease;
      `
      iframe.allow = "microphone; screen-wake-lock"
      iframe.title = "JarvisAI AI Chat Widget"

      // Listen for postMessage from the iframe to resize
      window.addEventListener("message", (event) => {
        // Only accept messages from our iframe
        if (event.source !== iframe.contentWindow) return

        if (event.data && event.data.type === "jarvis-widget-resize") {
          if (event.data.expanded) {
            iframe.style.width = EXPANDED_WIDTH
            iframe.style.height = EXPANDED_HEIGHT
          } else {
            iframe.style.width = COLLAPSED_WIDTH
            iframe.style.height = COLLAPSED_HEIGHT
          }
        }
      })

      // Handle iframe load
      iframe.onload = () => {
        console.log("JarvisAI Chat Widget loaded successfully")
      }

      // Handle iframe errors
      iframe.onerror = () => {
        console.error("JarvisAI Chat Widget failed to load")
      }

      // Append iframe to body
      document.body.appendChild(iframe)

      // Clean up the container
      container.style.display = "none"
    })
  }

  // Load when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadJarvisAIWidget)
  } else {
    loadJarvisAIWidget()
  }

  // Also try to load after a short delay to catch any dynamically added elements
  setTimeout(loadJarvisAIWidget, 1000)
})()
