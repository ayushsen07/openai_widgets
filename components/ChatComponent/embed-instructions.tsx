"use client";

import { useState } from "react"

export function ChatEmbedInstructions() {
  const [copied, setCopied] = useState(false)

  const embedCode = `<script src="${typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"}/chat-embed.js"></script>
<div class="ai-chat-widget" 
     data-api-key="your-api-key"
     data-model="gpt-3.5-turbo"
     data-position="bottom-right"
     data-theme="light"
     data-welcome-message="Hello! How can I help you today?">
</div>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Easy Integration</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Add AI Assistant to any website with just a few lines of code.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 text-center shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Simple Setup</h3>
          <p className="text-sm text-slate-600">Just copy and paste the embed code</p>
        </div>

        <div className="card p-6 text-center shadow-lg bg-gradient-to-br from-cyan-50 to-cyan-100">
          <div className="w-12 h-12 bg-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Universal</h3>
          <p className="text-sm text-slate-600">Works on any website or platform</p>
        </div>

        <div className="card p-6 text-center shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="w-12 h-12 bg-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Fast & Smart</h3>
          <p className="text-sm text-slate-600">Powered by OpenAI GPT</p>
        </div>
      </div>

      <div className="card p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Embed Code</h3>
          <button 
            onClick={handleCopy} 
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm flex items-center space-x-2 transition-colors"
          >
            {copied ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>

        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm">
            <code>{embedCode}</code>
          </pre>
        </div>

        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Replace <code className="bg-amber-100 px-1 rounded">your-api-key</code> with your actual OpenAI API key.
          </p>
          <ul className="mt-2 text-sm text-amber-800 space-y-1">
            <li><code>data-model</code>: gpt-3.5-turbo, gpt-4, etc.</li>
            <li><code>data-position</code>: bottom-right, bottom-left, top-right, top-left</li>
            <li><code>data-theme</code>: light, dark, auto</li>
            <li><code>data-welcome-message</code>: Custom greeting message</li>
          </ul>
        </div>
      </div>
    </div>
  )
}