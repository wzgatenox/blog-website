import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const aboutContent = `
Maia's Dreams Blog

Hi, I'm Maia - a student with a curious mind and a love for dreams.
My goal isn't to make sense of every dream. It's to open up ideas, challenge assumptions, and maybe help you see your own dreams - and your own mind - a little differently.

I don't claim to have all the answers (who does?), but I love asking questions: Why do we dream? Why do some dreams feel so real? What's going on in our brains while we sleep?

This blog is where I explore those questions - from what science says to the strange, personal side of dreaming.

If you've ever woken up from a dream and thought, what was that? - you're in the right place.
`

export default function HomePage() {
  const lines = aboutContent.trim().split('\n')
  const mainHeading = lines[0] || "About"

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10 gradient-text leading-tight text-center">
        {mainHeading}
      </h1>

      <div className="prose prose-lg dark:prose-invert w-full space-y-6">
        <p className="leading-relaxed text-center">
          Hi, I&apos;m Maia - a student with a curious mind and a love for dreams.
        </p>

        <div className="relative w-64 h-64 mx-auto my-8 rounded-full overflow-hidden shadow-lg not-prose">
          <Image 
            src="/maia.jpg" 
            alt="Maia profile picture" 
            fill 
            style={{ objectFit: "cover" }}
            priority 
          />
        </div>

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
      </div>

      <div className="mt-12">
        <Link href="/blog/what-if-your-dreams-are-lying">
          <Button 
            size="lg" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6"
          >
            Read My Blog
          </Button>
        </Link>
      </div>
    </div>
  )
}
