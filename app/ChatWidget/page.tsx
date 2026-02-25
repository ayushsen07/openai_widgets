// import { WidgetDemo } from "@/components/widget-demo"
import { ChatEmbedInstructions } from "@/components/ChatComponent/embed-instructions"
import { ChatWidget } from "@/components/ChatComponent/chat-widget"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
              Powered by Advanced AI
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              Jarvis AI Assistant
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Your intelligent AI companion with natural voice interaction.
              <br />
              Seamlessly integrate Jarvis into any website for instant assistance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2 text-slate-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm">Live Demo Below</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Meet Jarvis</h2>
            <p className="text-slate-600">
              Click the assistant button in the bottom right corner to start talking with Jarvis
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-slate-200">
            <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl p-8 min-h-[400px] relative">
              <div className="text-center text-slate-500">
                <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                    />
                  </svg>
                </div>
                <p className="text-lg">Your website content goes here</p>
                <p className="text-sm mt-2">Jarvis will appear in the bottom right corner</p>
              </div>
              <ChatWidget/>
            </div>
          </div>

          <ChatEmbedInstructions />
        </div>
      </div>
    </div>
  )
}
