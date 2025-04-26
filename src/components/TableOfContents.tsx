"use client" // Required for Framer Motion animations

import React from 'react'
import { motion } from 'framer-motion' // Import motion

export interface TocEntry {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  entries: TocEntry[];
}

export function TableOfContents({ entries }: TableOfContentsProps) {
  if (!entries || entries.length === 0) {
    return null; // Don't render anything if no headings
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.2,
        staggerChildren: 0.1 // Animate list items sequentially
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    // Use motion.nav for animation
    <motion.nav 
      className="toc p-4 rounded-lg border bg-card text-card-foreground shadow-sm" // Added padding, background, border, shadow
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">On This Page</h3> {/* Added border-bottom */} 
      <ol className="space-y-1 text-sm list-none pl-0">
        {entries.map((entry) => (
          // Animate each list item
          <motion.li 
            key={entry.id} 
            variants={itemVariants} 
            className="rounded transition-colors duration-150" // Base styling for hover
            whileHover={{ backgroundColor: 'hsl(var(--accent))' }} // Hover effect using motion
          >
            <a 
              href={`#${entry.id}`} 
              // Removed individual hover class, handled by parent motion.li
              className="block px-2 py-1.5 text-muted-foreground hover:text-foreground"
            >
              {entry.text}
            </a>
          </motion.li>
        ))}
      </ol>
    </motion.nav>
  );
} 