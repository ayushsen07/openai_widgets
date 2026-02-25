"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOpenAIRealtimeAgent } from "@/hooks/use-openai-realtime-agent";
import { cn } from "@/lib/utils";


interface JarvisWidgetProps {
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  theme?: "light" | "dark";
}

export function JarvisWidget({
  className,
  position = "bottom-right",
  theme = "light",
}: JarvisWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<any[]>([]); // Placeholder for messages as OpenAI hook handles audio primarily
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // --- SWITCHED TO OPENAI REALTIME AGENT ---
  const {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    error,
  } = useOpenAIRealtimeAgent();


  const toggleExpanded = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    // scrollToBottom(); // This was commented out in the original, keeping it that way.
  }, [messages]);

  const handleToggleExpanded = async () => {
    if (!isExpanded) {
      setIsExpanded(true);
      // Notify parent iframe to expand
      window.parent?.postMessage({ type: "jarvis-widget-resize", expanded: true }, "*");
      await connect();
    } else {
      setIsExpanded(false);
      // Notify parent iframe to collapse
      window.parent?.postMessage({ type: "jarvis-widget-resize", expanded: false }, "*");
      await disconnect();
    }
  };

  const handleStopConversation = () => {
    disconnect();
  };



  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-6 left-6";
      case "top-right":
        return "top-6 right-6";
      case "top-left":
        return "top-6 left-6";
      default:
        return "bottom-6 right-6";
    }
  };

  const cn = (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <div className={cn("fixed z-50", getPositionClasses(), className)}>
      <AnimatePresence>
        {!isExpanded ? (
          // Collapsed State - Jarvis Button
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <button
              onClick={handleToggleExpanded}
              className="h-14 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 gradient-animate float-animation text-white font-semibold flex items-center"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Talk to Jarvis
            </button>
          </motion.div>
        ) : (
          // Expanded State - Chat Interface
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="border border-gray-400 rounded-2xl overflow-hidden"
          >
            <div className="w-96 h-[600px] bg-black/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden card flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-cyan-600/80 to-teal-600/80" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-emerald-400 rounded-full" />
                      {isConnected && (
                        <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Jarvis</h3>
                      <p className="text-xs opacity-90 font-medium">
                        {isConnecting
                          ? "Initializing..."
                          : isConnected
                            ? "Ready to assist"
                            : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Stop Conversation Button */}
                    {/* {isConnected && (
                      <button
                        onClick={handleStopConversation}
                        className="text-white hover:bg-white/20 h-10 px-3 rounded-full transition-all duration-200 flex items-center"
                      >
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <rect x="6" y="6" width="12" height="12" rx="2" />
                        </svg>
                        Stop
                      </button>
                    )} */}
                    <button
                      onClick={handleToggleExpanded}
                      className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full transition-all duration-200 flex items-center justify-center"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div
                ref={messagesContainerRef}
                className="flex-1 flex items-center justify-center overflow-y-auto p-6 space-y-2 custom-scrollbar bg-gradient-to-b from-slate-50/50 to-white"
                style={{ maxHeight: "calc(600px - 200px)" }} // fixed height
              >
                <div className="relative w-60 h-60 rounded-full flex items-center justify-center shadow-md shrink-0 overflow-hidden">
                  {/* Animated spinning background */}
                  <div className="absolute inset-0 animate-spin rounded-full bg-gradient-to-tr from-green-400 to-rose-300 blur-sm" />
                  {/* Foreground */}
                  <div className="relative z-10 flex items-center justify-center w-full h-full"></div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-2 border-t bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-center mt-2">
                  <button
                    onClick={isConnected ? handleStopConversation : connect}
                    className={cn(
                      "px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg",
                      isConnected
                        ? "bg-red-600 text-white hover:bg-red-700 shadow-red-500/30"
                        : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/30"
                    )}
                  >
                    {isConnected ? "End Conversation" : "Start Conversation"}
                  </button>
                </div>
              </div >
            </div >
          </motion.div >
        )}
      </AnimatePresence >
    </div >
  );
}
