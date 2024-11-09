"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

const Star = ({ x, y, size, opacity }: { x: number; y: number; size: number; opacity: number }) => (
  <motion.div
    className="absolute bg-white"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      opacity,
      boxShadow: `0 0 ${size}px ${size / 2}px rgba(255, 255, 255, ${opacity})`,
    }}
    animate={{
      y: ['-2px', '2px'],
    }}
    transition={{
      y: {
        duration: 2 + Math.random() * 2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    }}
  />
)

export default function Banner() {
  const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number }[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const bannerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    const newStars = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    }))
    setStars(newStars)
  }, [])

  useEffect(() => {
    const animateLaser = async () => {
      while (true) {
        await controls.start({
          pathLength: [0, 1],
          pathOffset: [0, 1],
          transition: { duration: 6, ease: "linear" }
        })
      }
    }
    animateLaser()
  }, [controls])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect()
      setMousePosition({
        x: (event.clientX - rect.left) / rect.width - 0.5,
        y: (event.clientY - rect.top) / rect.height - 0.5,
      })
    }
  }

  return (
    <div 
      ref={bannerRef}
      className="relative w-full h-[315px] bg-zinc-800 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          x: mousePosition.x * 30,
          y: mousePosition.y * 10,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        {stars.map((star, index) => (
          <Star key={index} {...star} />
        ))}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900 z-10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
        <h1 className="text-5xl font-bold mb-4 relative px-6 py-2">
          <span className="relative z-10">AiVerse: AI Learning Community</span>
          <svg
            className="absolute -inset-1 pointer-events-none"
            width="100%"
            height="100%"
          >
            <motion.rect
              width="100%"
              height="100%"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              rx="8"
              ry="8"
              animate={controls}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </h1>
        <p className="text-lg text-center max-w-2xl px-4">
          Explore user posts, generated courses roadmaps blog posts, and much more.
        </p>
      </div>
    </div>
  )
}