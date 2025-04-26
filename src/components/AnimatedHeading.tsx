'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface WordState {
  id: number;
  text: string;
  isAnimated: boolean;
  nextToggleTime: number;
}

interface AnimatedHeadingProps {
  text: string;
  id?: string;
  minInterval?: number; // Min ms before a word *can* change state
  maxInterval?: number; // Max ms before a word *can* change state
  maxAnimatedWords?: number; // New prop for limit
}

// Function to get a random time for the next state toggle
const getRandomDelay = (min: number, max: number) => {
  return Date.now() + min + Math.random() * (max - min);
}

export function AnimatedHeading({
  text,
  id,
  minInterval = 5000, // Default: 5 seconds min
  maxInterval = 15000, // Default: 15 seconds max
  maxAnimatedWords = 2 // Default limit to 2 words
}: AnimatedHeadingProps) {

  // Initial state: non-random, all words static
  const createStaticInitialState = useCallback(() => {
      return text.split(' ').map((word, index) => ({
        id: index,
        text: word,
        isAnimated: false,
        nextToggleTime: Infinity // Effectively disable toggle until randomized
      }))
  }, [text])

  const [wordStates, setWordStates] = useState<WordState[]>(() => createStaticInitialState());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // --- Apply initial *random* state only AFTER mounting --- 
    const wordsArray = text.split(' ');
    const numWords = wordsArray.length;
    const limit = Math.min(maxAnimatedWords, numWords);
    const initialAnimatedCount = numWords > 0 ? Math.min(limit, Math.floor(Math.random() * limit) + 1) : 0;
    const animatedIndices = new Set<number>();
    while (animatedIndices.size < initialAnimatedCount && numWords > 0) {
      animatedIndices.add(Math.floor(Math.random() * numWords));
    }
    setWordStates(wordsArray.map((word, index) => ({
      id: index,
      text: word,
      isAnimated: animatedIndices.has(index),
      nextToggleTime: getRandomDelay(1000, 5000) // Schedule first toggle
    })))
    // ----------------------------------------------------------

  }, [text, maxAnimatedWords]); // Rerun setup if text/limit changes

  useEffect(() => {
    // Interval timer starts only after mount and initial state is set
    if (!mounted) return;

    const timerId = setInterval(() => {
      const now = Date.now();
      let somethingChanged = false;

      const currentAnimatedCount = wordStates.filter(w => w.isAnimated).length;

      const nextStates = wordStates.map(word => {
        // Skip check if toggle time is Infinity (static initial state)
        if (word.nextToggleTime === Infinity) return word; 
        
        if (now >= word.nextToggleTime) {
          somethingChanged = true;
          let nextIsAnimated = word.isAnimated;

          if (word.isAnimated) {
            nextIsAnimated = false;
          } else {
            if (currentAnimatedCount < maxAnimatedWords) {
              nextIsAnimated = true;
            }
          }

          return {
            ...word,
            isAnimated: nextIsAnimated,
            nextToggleTime: getRandomDelay(minInterval, maxInterval)
          };
        }
        return word;
      });

      if (somethingChanged) {
         setWordStates(nextStates);
      }
    }, 500);

    return () => clearInterval(timerId);
  }, [wordStates, mounted, minInterval, maxInterval, maxAnimatedWords]);

  // Render static text server-side and before first mount+effect
  if (!mounted) {
     return (
        <h2 
          id={id}
          className="text-3xl font-semibold mt-10 mb-4 leading-tight"
        >
            {text}
        </h2>
     )
  }

  // Render potentially animated text after mount
  return (
    <h2 
      id={id}
      className="text-3xl font-semibold mt-10 mb-4 leading-tight scroll-mt-20"
    >
      {wordStates.map((word) => (
        <React.Fragment key={word.id}>
          {word.isAnimated ? (
            <span className="gradient-text transition-opacity duration-500 ease-in-out">
              {word.text}
            </span>
          ) : (
            <span>{word.text}</span>
          )}
          {' '}
        </React.Fragment>
      ))}
    </h2>
  )
} 