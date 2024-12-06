'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, Mic, MessageSquare, FileText, Bot } from "lucide-react"

export default function Component() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    setTheme('dark')
  }, [setTheme])

  if (!mounted) return null

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-100 via-zinc-200 to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100">

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center border border-zinc-300/50 dark:border-zinc-800/50"
          >
            <svg className="w-12 h-12 text-zinc-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-700 dark:from-zinc-200 dark:via-zinc-300 dark:to-zinc-200 mb-4">
            AI-Powered Learning
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">
            Explore Our Tools
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            Discover our collection of AI-driven tools designed to enhance your learning experience and accelerate your educational journey
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap justify-center gap-8"
        >
          {[
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
          ].map((tool, index) => {
            const Icon = tool.icon
            return (
              <motion.div 
                key={tool.title} 
                variants={item} 
                className={`w-full sm:w-64 ${index === 0 ? 'sm:w-80' : ''}`}
                onClick={() => tool.available && router.push(tool.href)}
              >
                <Card className={`h-full relative group overflow-hidden backdrop-blur-lg bg-gradient-to-br 
                  ${tool.available 
                    ? 'from-zinc-100/90 to-zinc-200/90 dark:from-zinc-900/90 dark:to-zinc-950/90 cursor-pointer' 
                    : 'from-zinc-100/50 to-zinc-200/50 dark:from-zinc-900/50 dark:to-zinc-950/50 cursor-default'
                  } border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-400/50 dark:hover:border-zinc-700/50 transition-all duration-500`}>
                  {tool.available && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-300/10 to-zinc-400/10 dark:from-zinc-800/10 dark:to-zinc-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-zinc-200/50 dark:to-zinc-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800 rounded-lg opacity-0 group-hover:opacity-20 transition duration-500 blur" />
                    </>
                  )}
                  <div className="p-6 relative z-10 transform group-hover:scale-[1.02] transition-transform duration-500">
                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-500 relative">
                      <Icon className={`w-10 h-10 ${tool.available 
                        ? 'text-zinc-700 dark:text-zinc-300' 
                        : 'text-zinc-400 dark:text-zinc-600'}`} />
                      {tool.comingSoon && (
                        <span className="absolute -top-2 -right-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs px-2 py-0.5 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${tool.available 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-zinc-700 to-zinc-800 dark:from-zinc-200 dark:to-zinc-300'
                      : 'text-zinc-500 dark:text-zinc-600'}`}>
                      {tool.title}
                    </h3>
                    <p className={`${tool.available 
                      ? 'text-zinc-600 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-400' 
                      : 'text-zinc-400 dark:text-zinc-600'} transition-colors duration-500`}>
                      {tool.description}
                    </p>
                  </div>
                  {tool.available && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-zinc-400 dark:via-zinc-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 text-center"
        >
        </motion.div>
      </div>
    </div>
  )
}