'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export function LightModeBackgroundAccent() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Render only when mounted and in light mode
  if (!mounted || theme !== 'light') {
    return null
  }

  return (
    <>
      {/* Intense Rainbow Gradient - Behind Unicorn */}
      <div 
        className="fixed inset-0 z-[-2] opacity-60 blur-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, 
            rgba(255, 209, 209, 0.8) 0%,   /* pastel-red */
            rgba(255, 228, 196, 0.7) 15%,
            rgba(255, 250, 205, 0.6) 30%,
            rgba(209, 255, 209, 0.5) 45%,
            rgba(209, 225, 255, 0.4) 60%,
            rgba(225, 209, 255, 0.3) 75%,
            transparent 90%
          )`
        }}
      />

      {/* Unicorn Container */}
      <div 
        className="fixed bottom-5 left-5 z-[-1] w-24 h-32 pointer-events-none animate-float"
      >
        {/* Unicorn Head Base - Changed background */}
        <div 
          className="absolute bottom-0 left-0 w-full h-2/3 bg-gray-100/70 dark:bg-gray-800/50 backdrop-blur-sm shadow-inner"
          style={{
            clipPath: 'polygon(0% 100%, 0% 25%, 50% 0%, 100% 25%, 100% 100%)' 
          }}
        >
          {/* Unicorn Horn */}
          <div 
            className="absolute left-1/2 top-[-45px] w-3 h-16 bg-gradient-to-b from-pastel-purple via-pastel-blue to-pastel-green -translate-x-1/2 rotate-[15deg] rounded-t-full rounded-b-sm shadow-md"
          />
        </div>
      </div>
    </>
  )
} 