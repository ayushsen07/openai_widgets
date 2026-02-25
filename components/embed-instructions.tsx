"use client"

import { useState } from "react"

export function EmbedInstructions() {
  const [copied, setCopied] = useState(false)

  const embedCode = `<script src="${typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"}/embed.js"></script>
<div id="jarvis-widget" 
     data-agent-id="your-agent-id"
     data-api-key="your-api-key">
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
          Add Jarvis AI assistant to any website with just a few lines of code. No complex setup required.
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
          <p className="text-sm text-slate-600">Optimized AI responses</p>
        </div>
      </div>

      <div className="card p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Embed Code</h3>
          <button onClick={handleCopy} className="btn btn-secondary btn-sm flex items-center space-x-2">
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
            <strong>Note:</strong> Replace <code className="bg-amber-100 px-1 rounded">your-agent-id</code> and{" "}
            <code className="bg-amber-100 px-1 rounded">your-api-key</code> with your actual AI agent credentials.
          </p>
        </div>
      </div>
    </div>
  )
}
