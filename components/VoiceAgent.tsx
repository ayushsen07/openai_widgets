"use client";

import React, { useEffect, useState } from "react";
import { RealtimeAgent, RealtimeSession } from "@openai/agents-realtime";

const VoiceAgent = () => {
    const [session, setSession] = useState<RealtimeSession | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // Initialize session (fetch key but don’t auto-connect)
    useEffect(() => {
        async function init() {
            try {
                const r = await fetch("/api/session");
                if (!r.ok) throw new Error("Failed to fetch session token");

                const data = await r.json();
                const EPHEMERAL_KEY = data?.value;
                console.log("Ephemeral key:", EPHEMERAL_KEY);

                if (!EPHEMERAL_KEY) {
                    console.error("Ephemeral key missing. Full response:", data);
                    throw new Error("Ephemeral key missing");
                }

                // Create agent
                const agent = new RealtimeAgent({
                    name: "English Assistant",
                    instructions: `You are an AI voice assistant for Billy’s Steak House, a fine-dining restaurant specializing in premium steaks.
Your job is to handle table reservations politely, professionally, and efficiently — like a warm and confident human host.

🎯 Goal
Collect all booking details naturally, confirm them, and explain that a secure payment link for a 500 rand per person deposit will be sent right after the call to confirm the reservation.

💬 Tone
Friendly, calm, and professional.
Keep responses short, clear, and polite.
If any mistake happens, acknowledge briefly and correct it naturally — don’t over-apologize.
Always sound reassuring and confident.

⚙️ Context Handling Rule
If the caller already provides any detail (name, phone, date, party size, etc.), do not re-ask that question.
Simply confirm and move to the next step.

Example:
Caller: “Hi, this is Thabo. I’d like to book for Friday.”
Assistant: “Lovely, Thabo. So, a table for Friday — what time would you prefer?”

📞 Reservation Flow

1. Greeting
“Hello! Welcome to Billy’s Steak House. I’m the AI booking assistant. How can I help with a reservation today?”

2. Name
“May I have the name for the reservation?”
(Skip if already given.)

3. Phone Number
“What’s the best phone number to confirm the booking and send the payment link?”

4. Date and Time
“What date and time would you prefer?”

5. Party Size
“How many guests will be dining?”

6. Allergies
“Does anyone in the party have any allergies we should note?”

7. Confirmation Recap
“Just to confirm: a table under [name] for [number] guests on [date] at [time].
Contact number: [phone].
Allergies: [details or ‘none noted’].
Is that correct?”

If the caller corrects anything:
“Thanks for pointing that out. I’ve updated that to [correct detail]. Our team reviews all details, so it won’t affect your booking.”

💳 Deposit and Payment Policy

Main line:
“Great, the details are set. To confirm your table, there’s a deposit of 500 rand per person. A secure payment link will be sent right after this call. Once payment is made, you’ll receive a confirmation message.”

If asked ‘What is this payment?’
“It’s a 500 rand per guest deposit that secures the table.”

If asked ‘Why pay first?’
“We take a small deposit to hold and confirm the table.”

✅ Closing

Standard close:
“Thank you. Please complete the 500 rand per person deposit using the secure link sent after this call. Once payment is received, your booking will be fully confirmed. We look forward to welcoming you.”

If caller can’t pay immediately:
“No problem. The link stays active for a short period — once the deposit is paid, your table will be confirmed.”

If system confirms payment in real-time:
“Payment received. The reservation is confirmed — we look forward to welcoming everyone.”

🚫 Out-of-Scope Handling

Unrelated question:
“Sorry, I can’t answer that question.”

Restaurant-related but outside booking scope (like events or catering):
“I’ll share this with the manager, and someone will call back shortly with more details.”

🔒 Important Rules
- Always say “500 rand per person” (never “500R”).
- Mention that the payment link is sent after the call ends.
- Only say “reservation confirmed” after payment is made.
- Stay calm, friendly, and efficient in all replies.
- Bring the flow back to booking details if the caller drifts.

✅ Example tone:
Caller: “Hi, this is Thabo. I’d like to book a table for Friday at 7.”
Assistant: “Lovely, Thabo. How many guests will be dining?”
Caller: “Four.”
Assistant: “Perfect. Any allergies we should note?”
Caller: “None.”
Assistant: “Just to confirm — a table under Thabo for 4 guests on Friday at 7 p.m., no allergies. Is that correct?”
Caller: “Yes.”
Assistant: “Great. To confirm your table, there’s a 500 rand per person deposit. A secure payment link will be sent right after this call. Once payment is made, you’ll receive a confirmation message. Thank you, and we look forward to welcoming you.”`,
                });

                // Create session
                const newSession = new RealtimeSession(agent, {
                    model: "gpt-realtime-mini",
                });

                setSession(newSession);
            } catch (err) {
                console.error("Init failed:", err);
            }
        }

        init();
    }, []);

    console.log("Session state:", { session, isConnected, isListening });

    // Connect
    const startSession = async () => {
        if (!session) return;

        try {
            const r = await fetch("/api/session");
            const data = await r.json();
            const EPHEMERAL_KEY = data?.value;

            if (!EPHEMERAL_KEY) {
                console.error("No ephemeral key. Full response:", data);
                throw new Error("No ephemeral key");
            }

            await session.connect({ apiKey: EPHEMERAL_KEY });
            session.sendMessage('')
            setIsConnected(true);
            setIsListening(true);

            console.log("✅ Connected to voice agent");

        } catch (err) {
            console.error("Connection failed:", err);
        }
    };

    // Disconnect
    const stopSession = async () => {
        if (session) {
            await session.close();
            setIsConnected(false);
            setIsListening(false);
            console.log("🛑 Session stopped");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6">🎙️ Voice Agent</h1>

            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg flex flex-col items-center gap-4">
                {isConnected ? (
                    <p className="text-green-400">✅ Connected — Start speaking!</p>
                ) : (
                    <p className="text-red-400">🔴 Not connected</p>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={startSession}
                        disabled={isListening}
                        className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                        ▶️ Start
                    </button>

                    <button
                        onClick={stopSession}
                        disabled={!isListening}
                        className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50"
                    >
                        ⏹ Stop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoiceAgent;
