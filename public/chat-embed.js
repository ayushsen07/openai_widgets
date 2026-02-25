; (() => {
  // Prevent multiple initializations
  if (window.JarvisAIWidgetLoaded) {
    return
  }
  window.jarivsAIWidgetLoaded = true

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

      // Authentication is now handled server-side
      // No client-side API keys required

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

      // Create iframe
      const iframe = document.createElement("iframe")
      iframe.id = iframeId
      iframe.src = `${baseUrl}/embed/chat?${params.toString()}`
      iframe.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          border: none;
          pointer-events: none;
          z-index: 2147483647;
          background: transparent;
        `
      iframe.allow = "microphone; screen-wake-lock"
      iframe.title = "JarvisAI AI Chat Widget"

      // Handle iframe load
      iframe.onload = () => {
        iframe.style.pointerEvents = "auto"
        console.log("JarvisAI Widget loaded successfully")
      }

      // Handle iframe errors
      iframe.onerror = () => {
        console.error("Jarivs Widget failed to load")
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
