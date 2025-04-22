"use client"

import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  blinkDuration: number
  color: string
}

export function StarryBackground() {
  const { theme } = useTheme()
  const [stars, setStars] = useState<Star[]>([])
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only generate stars if mounted and in dark mode
    if (mounted && theme === 'dark') {
      const numberOfStars = 250 // Slightly more stars
      const newStars: Star[] = Array.from({ length: numberOfStars }, (_, i) => {
        const sizeCategory = Math.random()
        let size
        let opacity
        let color

        if (sizeCategory < 0.5) { // 50% tiny stars
          size = Math.random() * 1.5 + 0.8 // 0.8-2.3px
          opacity = Math.random() * 0.4 + 0.4 // Increased min opacity
          color = 'rgb(255, 255, 255)'
        } else if (sizeCategory < 0.80) { // 30% medium stars
          size = Math.random() * 2.5 + 2.3 // 2.3-4.8px
          opacity = Math.random() * 0.3 + 0.7 // Brighter
          color = 'rgb(255, 255, 245)' // Slightly warmer/brighter white
        } else if (sizeCategory < 0.95) { // 15% large stars
          size = Math.random() * 3 + 4.8 // 4.8-7.8px
          opacity = Math.random() * 0.1 + 0.9 // Brightest
          color = 'rgb(255, 250, 245)' // Bright warm white
        } else { // 5% extra large stars
          size = Math.random() * 3 + 7.8 // 7.8-10.8px
          opacity = Math.random() * 0.1 + 0.95 // Max brightness
          color = 'rgb(255, 250, 250)' // Brightest white
        }

        return {
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size,
          opacity,
          color,
          blinkDuration: Math.random() * 3 + 2 // Slightly faster twinkle range (2-5s)
        }
      })
      setStars(newStars)
    } else {
      setStars([])
    }
  }, [theme, mounted])

  if (!mounted || theme !== 'dark') {
    return null
  }

  // Simple 5-point star polygon clip-path
  const starClipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

  return (
    <>
      {/* Background Gradient */}
      <div className="fixed inset-0 z-[-2] !bg-[#030A14] bg-gradient-to-br from-[#030A14] via-[#060F1D] via-[#091526] via-[#0C1B2E] to-[#102339]" />
      
      {/* Moon - Even Larger */}
      <div 
        className="fixed top-[10%] right-[12%] z-[-1] w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-radial from-gray-100 via-gray-200 to-gray-300 shadow-xl shadow-gray-300/40 blur-[1.5px]"
      />

      {/* Stars */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              backgroundColor: star.color,
              animation: `twinkle ${star.blinkDuration}s ease-in-out infinite`,
              clipPath: starClipPath
            }}
          />
        ))}
      </div>
    </>
  )
} 