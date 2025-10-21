'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { BarChart3, Mic, MessageSquare, FileText, Bot } from "lucide-react"

const tools = [
  { 
    title: "Roadmap Generator", 
    icon: BarChart3, 
    description: "Create personalized learning paths for any skill or subject",
    href: "/aitools/roadmap",
    available: true
  },
  { 
    title: "Voice Mentor", 
    icon: Mic, 
    description: "Get real-time feedback on your speaking and pronunciation",
    href: "/aitools/voicementor",
    available: true
  },
  { 
    title: "Chat with Site", 
    icon: MessageSquare, 
    description: "Have natural conversations with any website content",
    href: "/aitools/sitechat",
    available: false,
    comingSoon: true
  },
  { 
    title: "Chat with PDF", 
    icon: FileText, 
    description: "Extract insights and discuss any PDF document with AI",
    href: "/aitools/pdfchat",
    available: false,
    comingSoon: true
  },
  { 
    title: "AI Agents", 
    icon: Bot, 
    description: "Deploy intelligent agents to automate your workflows",
    href: "/aitools/agents",
    available: false,
    comingSoon: true
  }
]

export default function AIToolsPage() {
  const router = useRouter()

  return (
    <div className="w-full bg-white dark:bg-zinc-950">
      {/* Header Banner */}
      <div className="relative w-full bg-gradient-to-br from-slate-900 via-zinc-900/40 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="relative flex flex-col items-center justify-center text-white p-6 py-20">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              AI-Powered Tools
            </h1>
            <p className="text-base text-gray-300 leading-relaxed">
              Discover our collection of AI-driven tools designed to enhance your learning experience and accelerate your educational journey
            </p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Tools Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <div
                key={tool.title}
                onClick={() => tool.available && router.push(tool.href)}
                className={tool.available ? "cursor-pointer" : ""}
              >
                <Card className={`h-full p-6 border transition-all duration-300 ${
                  tool.available
                    ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30'
                    : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/50 opacity-60'
                }`}>
                  <div className="space-y-4">
                    {/* Icon */}
                    <div className="relative w-fit">
                      <Icon className={`w-10 h-10 ${
                        tool.available 
                          ? 'text-zinc-700 dark:text-zinc-300' 
                          : 'text-zinc-400 dark:text-zinc-600'
                      }`} />
                      {tool.comingSoon && (
                        <span className="absolute -top-2 -right-8 text-xs font-medium text-zinc-500 dark:text-zinc-400 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full whitespace-nowrap">
                          Coming Soon
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className={`text-lg font-semibold ${
                      tool.available
                        ? 'text-zinc-900 dark:text-white'
                        : 'text-zinc-500 dark:text-zinc-600'
                    }`}>
                      {tool.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm leading-relaxed ${
                      tool.available
                        ? 'text-zinc-600 dark:text-zinc-400'
                        : 'text-zinc-400 dark:text-zinc-600'
                    }`}>
                      {tool.description}
                    </p>

                    {/* Button */}
                    {tool.available && (
                      <Button
                        onClick={() => router.push(tool.href)}
                        className="w-full mt-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-black"
                      >
                        Explore
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}