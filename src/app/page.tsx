"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon } from "lucide-react"
import { motion } from "framer-motion"

const aboutContent = `
Maia's Dreams Blog

Hi, I'm Maia - a student with a curious mind and a love for dreams.
My goal isn't to make sense of every dream. It's to open up ideas, challenge assumptions, and maybe help you see your own dreams - and your own mind - a little differently.

I don't claim to have all the answers (who does?), but I love asking questions: Why do we dream? Why do some dreams feel so real? What's going on in our brains while we sleep?

This blog is where I explore those questions - from what science says to the strange, personal side of dreaming.

If you've ever woken up from a dream and thought, what was that? - you're in the right place.
`

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function HomePage() {
  const lines = aboutContent.trim().split('\n')
  const mainHeading = lines[0] || "About"

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 flex flex-col items-center">
      <motion.div 
        className="flex items-center justify-center mb-10"
        initial={fadeIn.initial}
        animate={fadeIn.animate}
        transition={{ ...fadeIn.transition, delay: 0.1 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text leading-tight text-center mr-3">
          {mainHeading}
        </h1>
        <Moon className="w-8 h-8 md:w-10 md:h-10 text-indigo-400" />
      </motion.div>

      <motion.div 
        className="prose prose-lg dark:prose-invert w-full space-y-6 text-center"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.2 }}
      >
        <motion.p 
          className="leading-relaxed text-center"
          variants={fadeIn}
        >
          Hi, I&apos;m Maia - a student with a curious mind and a love for dreams.
        </motion.p>

        <motion.div 
          className="relative w-64 h-64 mx-auto my-8 rounded-full overflow-hidden shadow-lg not-prose"
          variants={fadeIn}
        >
          <Image 
            src="/maia1.jpeg" 
            alt="Maia profile picture" 
            fill 
            style={{ objectFit: "cover" }}
            priority 
          />
        </motion.div>

        <motion.div variants={fadeIn}>
          <p className="leading-relaxed">
            My goal isn&apos;t to make sense of every dream. It&apos;s to open up ideas, challenge assumptions, and maybe help you see your own dreams - and your own mind - a little differently.
          </p>
          <p className="leading-relaxed">
            I don&apos;t claim to have all the answers (who does?), but I love asking questions: Why do we dream? Why do some dreams feel so real? What&apos;s going on in our brains while we sleep?
          </p>
          <p className="leading-relaxed">
            This blog is where I explore those questions - from what science says to the strange, personal side of dreaming.
          </p>
          <p className="leading-relaxed">
            If you&apos;ve ever woken up from a dream and thought, what was that? - you&apos;re in the right place.
          </p>
        </motion.div>

      </motion.div>
        
      <motion.div 
        className="mt-12"
        initial={fadeIn.initial}
        whileInView={fadeIn.animate}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ ...fadeIn.transition, delay: 0.4 }}
      >
        <Link href="/blog/what-if-your-dreams-are-lying">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6"
            >
              Read My Blog
            </Button>
          </motion.div>
        </Link>
      </motion.div>

    </div>
  )
}
