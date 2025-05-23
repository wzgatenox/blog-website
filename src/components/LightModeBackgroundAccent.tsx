'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'

interface UnicornState {
  id: number;
  position: { x: number; y: number };
  velocity: { dx: number; dy: number };
}

const UNICORN_SIZE = { width: 100, height: 100 }; // Approx size for collisions and init
const MIN_UNICORNS = 2;
const MAX_UNICORNS = 3;

// RainbowArcSVG component removed

export function LightModeBackgroundAccent() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [unicorns, setUnicorns] = useState<UnicornState[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Initialize state only after mount
  const initializeUnicorns = useCallback(() => {
    const numUnicorns = MIN_UNICORNS + Math.floor(Math.random() * (MAX_UNICORNS - MIN_UNICORNS + 1));
    const initialUnicorns: UnicornState[] = [];
    for (let i = 0; i < numUnicorns; i++) {
      initialUnicorns.push({
        id: i,
        position: {
          x: Math.random() * (window.innerWidth - UNICORN_SIZE.width),
          y: Math.random() * (window.innerHeight - UNICORN_SIZE.height)
        },
        velocity: {
          dx: (Math.random() - 0.5) * 1.5, // Slightly faster max speed
          dy: (Math.random() - 0.5) * 1.5
        }
      });
    }
    setUnicorns(initialUnicorns);
  }, []); // No dependencies needed as it uses window

  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect to initialize unicorns once mounted and in light mode
  useEffect(() => {
    if (mounted && theme === 'light') {
      initializeUnicorns();
    } else {
      setUnicorns([]); // Clear unicorns if not light mode
    }
    // Intentionally only runs when mounted/theme changes, not on initializeUnicorns change
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [mounted, theme]);

  // Animation loop effect
  useEffect(() => {
    if (!mounted || theme !== 'light' || unicorns.length === 0) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    const animate = () => {
      setUnicorns(currentUnicorns => 
        currentUnicorns.map(unicorn => {
          let newX = unicorn.position.x + unicorn.velocity.dx;
          let newY = unicorn.position.y + unicorn.velocity.dy;
          let newDx = unicorn.velocity.dx;
          let newDy = unicorn.velocity.dy;

          // Bounce logic (simplified, using constant size)
          if (newX <= 0 || newX >= window.innerWidth - UNICORN_SIZE.width) {
            newDx = -newDx;
            newX = unicorn.position.x + newDx;
          }
          if (newY <= 0 || newY >= window.innerHeight - UNICORN_SIZE.height) {
            newDy = -newDy;
            newY = unicorn.position.y + newDy;
          }

          return {
            ...unicorn,
            position: { x: newX, y: newY },
            // Only update velocity if it changed
            velocity: (newDx !== unicorn.velocity.dx || newDy !== unicorn.velocity.dy) 
                      ? { dx: newDx, dy: newDy } 
                      : unicorn.velocity
          };
        })
      );

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
    // Rerun animation loop if unicorns array ref changes (or mount/theme)
  }, [unicorns, mounted, theme]); 

  // Render nothing until mounted and in light mode
  if (!mounted || theme !== 'light') {
    return null;
  }

  // Return only the unicorns, no extra background element
  return (
    <>
      {unicorns.map(unicorn => (
        <div 
          key={unicorn.id}
          className="fixed z-[-1] w-24 h-24 md:w-32 md:h-32 pointer-events-none opacity-50 mix-blend-multiply"
          style={{
            left: `${unicorn.position.x}px`,
            top: `${unicorn.position.y}px`,
          }}
        >
          <Image 
            src="/unicorn-with-butterflies.jpg"
            alt="Floating unicorn accent"
            fill
            style={{ objectFit: "contain" }}
            priority={unicorn.id < 3} // Prioritize loading first few
          />
        </div>
      ))}
    </>
  )
} 