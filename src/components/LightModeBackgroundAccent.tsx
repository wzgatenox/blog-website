'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export function LightModeBackgroundAccent() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render the accent if mounted and in light mode
  if (!mounted || theme !== 'light') {
    return null
  }

  return (
    <div 
      className="fixed inset-0 z-[-1] opacity-30 blur-3xl pointer-events-none"
      style={{
        background: `radial-gradient(circle at top right, 
          rgba(255, 209, 209, 0.5) 0%,   /* pastel-red */
          rgba(255, 228, 196, 0.4) 15%,  /* pastel-orange */
          rgba(255, 250, 205, 0.3) 30%,  /* pastel-yellow */
          rgba(209, 255, 209, 0.2) 45%,  /* pastel-green */
          rgba(209, 225, 255, 0.15) 60%, /* pastel-blue */
          rgba(225, 209, 255, 0.1) 75%,  /* pastel-purple */
          transparent 85% /* Fade out slightly sooner */
        )`
      }}
    />
  )
} 