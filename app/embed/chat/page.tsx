import { ChatWidget } from "@/components/ChatComponent/chat-widget";

interface EmbedPageProps {
  searchParams: {
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    theme?: "light" | "dark" | "auto";
    model?: string;
    welcomeMessage?: string;
  }
}

export default function EmbedPage({ searchParams }: EmbedPageProps) {
  const {
    position = "bottom-right",
    theme = "light",
    model = "gpt-3.5-turbo",
    welcomeMessage = "Hello! How can I help you today?"
  } = searchParams;

  // API key check removed - authentication is now server-side

  return (
    <div className="min-h-screen bg-transparent">
      <ChatWidget
        position={position}
        theme={theme}
        model={model}
        welcomeMessage={welcomeMessage}
      />
    </div>
  );
}