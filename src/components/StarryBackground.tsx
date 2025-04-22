"use client"

import { useEffect, useState } from 'react'

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
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    // Generate random stars
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
  }, [])

  return (
    <>
      <div className="fixed inset-0 z-[-1] !bg-[#101C30] bg-gradient-to-br from-navy-700 via-navy-800 via-navy-900 to-navy-950" />
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