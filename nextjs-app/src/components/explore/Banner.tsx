"use client"

import React from 'react'

export default function Banner() {
  return (
    <div className="relative w-full h-[315px] bg-gradient-to-br from-slate-900 via-zinc-900/40 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
        <div className="space-y-6 text-center max-w-4xl mx-auto backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl">
          <h1 className="text-6xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 via-gray-800 to-zinc-500 dark:from-zinc-400 dark:via-gray-400 dark:to-zinc-500">
              AiVerse
            </span>
            <span className="text-4xl text-gray-200 ml-2">AI Learning Community</span>
          </h1>
          <p className="text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Explore user posts, generated courses. Create content and share with the community. Use a variety of AI tools to enhance your learning experience.
          </p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}