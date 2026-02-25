

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { RealtimeAgent, RealtimeSession } from "@openai/agents-realtime";

export function useOpenAIRealtimeAgent() {
    const [session, setSession] = useState<RealtimeSession | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Store agent config to reuse
    const agentRef = useRef<RealtimeAgent | null>(null);

    // Initialize agent configuration once (but NOT the session yet)
    useEffect(() => {
        try {
            // Instructions are configured server-side in /api/session route
            const agent = new RealtimeAgent({
                name: "Restro assistant",
                voice: "marin", // female, options-cedar male
            });

            agentRef.current = agent;

        } catch (err: any) {
            console.error("Failed to create agent:", err);
            setError("Agent initialization failed: " + err.message);
        }

        // Cleanup on unmount
        return () => {
            if (session) {
                session.close();
            }
        };
    }, []);

    // Connect - Create NEW session with FRESH key each time
    const connect = useCallback(async () => {
        if (!agentRef.current) {
            console.error("Agent not initialized yet");
            return;
        }

        setIsConnecting(true);
        setError(null);

        try {
            // Close existing session if any
            if (session) {
                await session.close();
            }

            // Fetch fresh ephemeral key
            const timestamp = new Date().getTime();
            const r = await fetch(`/api/session?t=${timestamp}`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            if (!r.ok) {
                const errorText = await r.text();
                throw new Error(`Failed to fetch session token: ${r.status} - ${errorText}`);
            }

            const data = await r.json();
            const EPHEMERAL_KEY = data?.value;

            if (!EPHEMERAL_KEY) {
                throw new Error("Ephemeral key missing from response");
            }

            // Create NEW session with fresh key
            const newSession = new RealtimeSession(agentRef.current, {
                model: "gpt-realtime-mini",
            });

            // Connect with the fresh key
            await newSession.connect({ apiKey: EPHEMERAL_KEY });

            // Optional: Trigger first message
            newSession.sendMessage('');

            setSession(newSession);
            console.log("session is ", newSession);
            setIsConnected(true);
            setIsListening(true);
            console.log("✅ Connected to voice agent");

        } catch (err: any) {
            console.error("Connection failed with error:", err);

            setError("Failed to connect: " + err.message);
            setIsConnected(false);
            setIsListening(false);
        } finally {
            setIsConnecting(false);
        }
    }, [session]);

    // Disconnect
    const disconnect = useCallback(async () => {
        if (session) {
            try {
                await session.close();
            } catch (err) {
                console.error("Error closing session:", err);
            }

            setSession(null);
            setIsConnected(false);
            setIsListening(false);
            console.log("Disconnected encted the voice agent")
        }
    }, [session]);

    return {
        isConnected,
        isConnecting,
        isListening,
        connect,
        disconnect,
        error
    };
}



