'use client'

import React, { useState, useEffect, useMemo } from 'react'

interface AnimatedHeadingProps {
  text: string
}

export function AnimatedHeading({ text }: AnimatedHeadingProps) {
  const words = useMemo(() => text.split(' '), [text])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  useEffect(() => {
    // Initial random word
    if (words.length > 0) {
      setHighlightedIndex(Math.floor(Math.random() * words.length))
    }

    // Change word every 10 seconds
    const intervalId = setInterval(() => {
      setHighlightedIndex((prevIndex) => {
        if (words.length <= 1) return prevIndex // No change if 0 or 1 word
        let nextIndex
        do {
          nextIndex = Math.floor(Math.random() * words.length)
        } while (nextIndex === prevIndex) // Ensure it's a different word
        return nextIndex
      })
    }, 10000) // 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [words]) // Re-run effect if words change

  return (
    <h2 className="text-3xl font-semibold mt-10 mb-4 leading-tight">
      {words.map((word, index) => (
        <React.Fragment key={index}>
          {index === highlightedIndex ? (
            <span className="gradient-text transition-all duration-500 ease-in-out">
              {word}
            </span>
          ) : (
            <span>{word}</span>
          )}
          {' '}{/* Add space between words */}
        </React.Fragment>
      ))}
    </h2>
  )
} 