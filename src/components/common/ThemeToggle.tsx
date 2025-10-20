"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button className="ml-2" onClick={() => {
      if(theme && theme === 'dark') {
        setTheme('light')
      } else if(theme && theme === 'light') {
        setTheme('dark')
      }
    }}>
      {theme === 'dark' ? (
        <Sun className="h-7 w-7" />
      ) : (
        <Moon className="h-7 w-7" />
      )}
    </button>
  )
}
