"use client"

import { useEffect, useState } from "react"

export function StarrySky() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number }>>([])

  useEffect(() => {
    // Generate stars
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
    }))
    setStars(newStars)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-purple-950 to-gray-950 dark:opacity-100 opacity-0 transition-opacity duration-500" />
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white dark:opacity-100 opacity-0 transition-opacity duration-500"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${Math.random() * 2 + 1}s infinite alternate`,
          }}
        />
      ))}
    </div>
  )
} 