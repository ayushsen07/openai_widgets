"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatWidgetProps {
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  theme?: "light" | "dark" | "auto";
  model?: string;
  welcomeMessage?: string;
}

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export function ChatWidget({
  className,
  position = "bottom-right",
  theme = "light",
  model = "gpt-3.5-turbo",
  welcomeMessage = "Hello! How can I help you today?",
}: ChatWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);

    // Notify parent iframe to resize
    window.parent?.postMessage({ type: "jarvis-widget-resize", expanded: newState }, "*");

    if (newState && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: welcomeMessage,
        },
      ]);
    }
  };

  const sendMessageToAPI = async (messageHistory: Message[]) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messageHistory,
          model,
          temperature: 0.7,
        }),
      });

      // Clone the response before reading it
      const responseClone = response.clone();

      if (!response.ok) {
        // Try to parse error response
        try {
          const errorData = await responseClone.json();
          throw new Error(
            errorData.error || errorData.message || "API request failed"
          );
        } catch (e) {
          // If JSON parsing fails, read as text
          const errorText = await response.text();
          throw new Error(errorText || "API request failed");
        }
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling chat API:", error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!textInput.trim() || isLoading) return;
    setError(null);

    const userMessage: Message = { role: "user", content: textInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setTextInput("");
    setIsLoading(true);

    try {
      const response = await sendMessageToAPI(newMessages);
      setMessages((prev) => [...prev, response.message]);
    } catch (error) {
      let errorMessage = "Failed to get response";
      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.includes("Incorrect API key")) {
          errorMessage = "Invalid API key - please check your configuration";
        }
      }

      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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

  const getThemeClasses = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-900 text-white";
      case "light":
        return "bg-white text-gray-900";
      default:
        return "bg-white dark:bg-gray-900 text-gray-900 dark:text-white";
    }
  };

  const cn = (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <div className={cn("fixed z-50", getPositionClasses(), className)}>
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <button
              onClick={handleToggleExpanded}
              className="h-14 px-6 rounded-full bg-amber-500 hover:bg-amber-600 shadow-md hover:shadow-amber-500/30 transition-all duration-300 text-white font-medium flex items-center space-x-2"
              aria-label="Open chat widget"
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Chat with us</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="border border-gray-200 rounded-2xl overflow-hidden shadow-xl bg-white"
          >
            <div className="w-96 h-[600px] flex flex-col">
              {/* Header */}
              <div className="bg-amber-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
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
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold">Help Center</h3>
                  </div>
                  <button
                    onClick={handleToggleExpanded}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    aria-label="Close chat widget"
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

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                      <svg
                        className="h-8 w-8 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      How can we help?
                    </h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Ask us anything or share your feedback.
                    </p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${message.role === "user"
                        ? "bg-amber-500 text-white rounded-br-none"
                        : "bg-white rounded-bl-none shadow-sm border border-gray-200"
                        }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
                      <div className="flex space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-bounce" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-bounce delay-100" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center border border-red-100">
                    {error}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={isLoading}
                    className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !textInput.trim()}
                    className="h-12 w-12 p-0 rounded-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 flex items-center justify-center text-white transition-colors"
                    aria-label="Send message"
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
