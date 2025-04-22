"use client"

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    // Only generate stars if in dark mode
    if (theme === 'dark') {
      const numberOfStars = 200
      const newStars: Star[] = Array.from({ length: numberOfStars }, (_, i) => {
        const sizeCategory = Math.random()
        let size
        let opacity
        let color

        if (sizeCategory < 0.6) {
          size = Math.random() * 1 + 0.5
          opacity = Math.random() * 0.5 + 0.3
          color = 'rgb(255, 255, 255)'
        } else if (sizeCategory < 0.9) {
          size = Math.random() * 2 + 1.5
          opacity = Math.random() * 0.3 + 0.6
          color = 'rgb(255, 255, 240)'
        } else {
          size = Math.random() * 2 + 3.5
          opacity = Math.random() * 0.2 + 0.8
          color = 'rgb(255, 250, 240)'
        }

        return {
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size,
          opacity,
          color,
          blinkDuration: Math.random() * 4 + 2
        }
      })
      setStars(newStars)
    } else {
      setStars([]) // Clear stars if not in dark mode
    }
  }, [theme]) // Re-run effect when theme changes

  // Only render the background if the theme is dark
  if (theme !== 'dark') {
    return null
  }

  return (
    <>
      {/* Reversed: Darkest top-left (#030A14) to lighter bottom-right (#102339) */}
      <div className="fixed inset-0 z-[-1] !bg-[#030A14] bg-gradient-to-br from-[#030A14] via-[#060F1D] via-[#091526] via-[#0C1B2E] to-[#102339]" />
      <div className="fixed inset-0 z-[-1]">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              backgroundColor: star.color,
              animation: `twinkle ${star.blinkDuration}s ease-in-out infinite`
            }}
          />
        ))}
      </div>
    </>
  )
} 