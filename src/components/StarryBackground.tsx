"use client"

import { useEffect, useState } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  blinkDuration: number
}

export function StarryBackground() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    // Generate random stars
    const numberOfStars = 100
    const newStars: Star[] = Array.from({ length: numberOfStars }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random(),
      blinkDuration: Math.random() * 3 + 2
    }))
    setStars(newStars)
  }, [])

  return (
    <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-navy-900 via-navy-950 to-black overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.blinkDuration}s ease-in-out infinite`
          }}
        />
      ))}
    </div>
  )
} 