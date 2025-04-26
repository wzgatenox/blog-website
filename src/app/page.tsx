import React from "react"
import { AnimatedHeading } from "@/components/AnimatedHeading"

const aboutContent = `
About This Blog

Hi, I'm Maia - a student with a curious mind and a love for dreams.
My goal isn't to make sense of every dream. It's to open up ideas, challenge assumptions, and maybe help you see your own dreams - and your own mind - a little differently.

I don't claim to have all the answers (who does?), but I love asking questions: Why do we dream? Why do some dreams feel so real? What's going on in our brains while we sleep?

This blog is where I explore those questions - from what science says to the strange, personal side of dreaming.

If you've ever woken up from a dream and thought, what was that? - you're in the right place.
`

export default function AboutPage() {
  const lines = aboutContent.trim().split('\n')
  const mainHeading = lines[0] || "About"
  const contentLines = lines.slice(2) // Skip main heading and the following blank line

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Main Heading - Left Aligned */}
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10 gradient-text leading-tight">
        {mainHeading}
      </h1>

      <div className="prose prose-lg dark:prose-invert mx-auto space-y-6">
        {contentLines.map((line, index) => {
          if (line.startsWith('##')) {
            // Render AnimatedHeading for subheadings (though none in current text)
            const headingText = line.substring(2).trim()
            return <AnimatedHeading key={index} text={headingText} />
          } else if (line.trim() !== '') {
            // Render non-empty lines as paragraphs
            return (
              <p key={index} className="leading-relaxed">
                {line}
              </p>
            )
          } else {
            // Return null for empty lines
            return null
          }
        })}
        </div>
    </div>
  )
}
