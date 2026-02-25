"use client"

import { useState, useCallback } from "react"
import { useConversation } from "@elevenlabs/react"

interface Message {
  type: "user" | "agent"
  content: string
  timestamp: number
  isPlaying: boolean
}

interface UseJarvisAIAgentProps {
  agentId: string
  apiKey?: string 
}

export function useJarvisAIAgent({ agentId }: UseJarvisAIAgentProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState(false)

  const conversation = useConversation()

  const connect = useCallback(async () => {
    if (!agentId) {
      setError("Missing agentId")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasPermission(true)
    } catch (err) {
      setError("Microphone access denied")
      return
    }

    setIsConnecting(true)

    try {
      const conversationId = await conversation.startSession({
        agentId,
        // Removed invalid property enableStartAudioInput
        // Removed unsupported onAgentResponse property
        // Removed unsupported onUserTranscript property
        onError: (err) => {
          console.error("Agent session error:", err)
          setError("Agent error: " + ((err as unknown) as Error).message)
        },
      })

      if (conversationId) {
        setIsConnected(true)
        setError(null)
      } else {
        setError("Failed to start conversation.")
      }
    } catch (err) {
      console.error("Conversation start failed:", err)
      setError("Conversation could not start.")
    } finally {
      setIsConnecting(false)
    }
  }, [agentId, conversation])

  const disconnect = useCallback(async () => {
    try {
      await conversation.endSession()
    } catch (err) {
      console.warn("End session error", err)
    }
    setIsConnected(false)
    setMessages([])
  }, [conversation])

  const sendTextMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      setMessages((prev) => [
        ...prev,
        { type: "user", content: text, timestamp: Date.now(), isPlaying: false },
      ])

      try {
        await conversation.sendUserMessage(text)
      } catch (err) {
        console.error("Failed to send message:", err)
        setError("Message sending failed")
      }
    },
    [conversation],
  )

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession()
    } catch (err) {
      console.error("Error stopping session:", err)
    }
    setIsConnected(false)
  }, [conversation])

  const startRecording = useCallback(async () => {
    try {
      await conversation.startSession({agentId})
    } catch (err) {
      console.error("Failed to start recording:", err)
      setError("Recording could not start")
    }
  }, [conversation])

  const stopRecording = useCallback(async () => {
    try {
      await conversation.endSession()
    } catch (err) {
      console.error("Failed to stop recording:", err)
    }
  }, [conversation])

  return {
    messages,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendTextMessage,
    stopConversation,
    startRecording,
    stopRecording,
  }
}


