"use client";

import { useOpenAIRealtimeAgent } from "@/hooks/use-openai-realtime-agent";

interface JarvisInlineWidgetProps {
  className?: string;
}

/**
 * JarvisInlineWidget — button-only, matching "Chat on WhatsApp" style.
 * Only the text changes:
 *   1. "Try Demo Call"  (idle)
 *   2. "Connecting..."  (connecting)
 *   3. "End Call"       (connected)
 */
export function JarvisInlineWidget({ className = "" }: JarvisInlineWidgetProps) {
  const { isConnected, isConnecting, connect, disconnect } = useOpenAIRealtimeAgent();

  const handleClick = async () => {
    if (isConnected) {
      await disconnect();
    } else if (!isConnecting) {
      await connect();
    }
  };

  const label = isConnecting
    ? "Connecting..."
    : isConnected
    ? "End Call"
    : "Try Demo Call";

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className={`bg-gradient-to-r from-indigo-600 to-indigo-500 text-white md:px-6 md:py-3 px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-xl cursor-pointer ${className}`}
    >
      {label}
    </button>
  );
}
