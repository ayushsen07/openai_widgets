"use client"

import { ChatWidget } from "./chat-widget"

export function WidgetDemo() {
  return (
    <ChatWidget
        position="bottom-right"
        model="gpt-4"
        welcomeMessage="Hi there! How can I assist you today?"
      />
  )
}
