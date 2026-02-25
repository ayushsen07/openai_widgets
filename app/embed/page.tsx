import { JarvisWidget } from "@/components/jarvis-widget"

interface EmbedPageProps {
  searchParams: {
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
    theme?: "light" | "dark"
  }
}

export default function EmbedPage({ searchParams }: EmbedPageProps) {
  const { position = "bottom-right", theme = "light" } = searchParams

  // Credentials check removed as OpenAI implementation uses server-side env vars
  // if (!agentId || !apiKey) { ... }

  return (
    <div className="min-h-screen bg-transparent">
      <JarvisWidget position={position} theme={theme} />
    </div>
  )
}
 