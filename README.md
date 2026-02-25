# Jarvis Widget

## Overview
Next.js 14 (App Router) TypeScript project providing:
- ChatWidget: Text chat via `/api/chat` -> OpenAI Chat Completions.
- JarvisWidget: Voice/agent UI using ElevenLabs (`@elevenlabs/react`).
- VoiceAgent: OpenAI Realtime (ephemeral key from `/api/session`).
- Embeddable iframe loaders: `public/embed.js` and `public/chat-embed.js`.

## Prerequisites
- Node 18+ (recommended: 18.18+)
- pnpm (preferred, lockfile present). Enable via:
  corepack enable

## Install
```bash
pnpm install
```

## Environment Variables
Create `.env.local`:
```
OPENAI_API_KEY=sk-...
# For Jarvis/JarvisWidget demo (avoid exposing real prod keys if possible)
NEXT_PUBLIC_AGENT_ID=your_elevenlabs_agent_id
NEXT_PUBLIC_API_KEY=your_elevenlabs_api_key
```
(Anything prefixed NEXT_PUBLIC_ is exposed to the browser.)

## Development
```bash
pnpm dev
# Visit http://localhost:3000
```

## Build & Start
```bash
pnpm build
pnpm start
```

## Key Routes
- `/` Landing (JarvisPage).
- `/ChatWidget` Chat widget showcase.
- `/embed` Iframe target for JarvisWidget (agent + key).
- `/embed/chat` Iframe target for ChatWidget (text chat).
- `/voiceAgent` OpenAI Realtime voice test.

## API Routes
- `POST /api/chat` Proxy to OpenAI (uses OPENAI_API_KEY server side).
- `GET /api/session` Requests ephemeral key (OpenAI Realtime client secret endpoint).
- `POST /api/elevenlabs/signed-url` (unused currently in hook) obtains signed URL for ElevenLabs.

## Embedding
Include (example):
```html
<script src="https://your-domain.com/embed.js"></script>
<div id="jarvis-widget"
     data-agent-id="YOUR_AGENT_ID"
     data-api-key="PUBLIC_KEY">
</div>
```
or chat version:
```html
<script src="https://your-domain.com/chat-embed.js"></script>
<div id="JarvisAI-chat-widget"
     data-agent-id="YOUR_AGENT_ID"
     data-api-key="PUBLIC_KEY"></div>
```

## Core Components
- `components/ChatComponent/chat-widget.tsx`: Manages local message state, calls `/api/chat`.
- `components/jarvis-widget.tsx`: Connect / disconnect, (voice placeholder UI) via `useJarvisAIAgent`.
- `hooks/use-JarvisAI-agent.tsx`: Wraps `useConversation` from ElevenLabs (start/end session, send messages).
- `components/VoiceAgent.tsx`: OpenAI Realtime usage with ephemeral token fetch before connect.

## Notes
- Ephemeral session token generated server-side; never hard-code secret keys in client components.
- Some ElevenLabs signed URL logic exists but hook does not call `/api/elevenlabs/signed-url`; integrate if needed.
- `requirement.txt` is informational; actual dependency management is via `package.json`.

## Testing / Lint
(ESLint/TS errors ignored in build per next.config.mjs — adjust for production hardening.)

## Production Hardening Suggestions
- Remove `ignoreBuildErrors` / `ignoreDuringBuilds`.
- Implement rate limiting on `/api/chat`.
- Store agent/API keys securely (do not expose true secrets in `NEXT_PUBLIC_*`).

## License
Internal / Unspecified.
