import { notFound } from "next/navigation"
import { blogPosts } from "@/data/blog-posts"
import React from "react"
import { AnimatedHeading } from "@/components/AnimatedHeading"
import Image from "next/image"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

export const dynamicParams = false

export default async function BlogPost({ params }: PageProps) {
  // Wait for params to be available
  const resolvedParams = await params
  const slug = resolvedParams.slug as string
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  return (
    <div className="relative min-h-screen">
      <article className="relative prose prose-gray prose-invert mx-auto max-w-4xl py-8 px-4">
        <h1 className="text-6xl font-bold tracking-tight mb-6 leading-tight gradient-text">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-2xl text-muted-foreground mt-6 mb-8 leading-relaxed">
            {post.subtitle}
          </p>
        )}
        <div className="flex items-center gap-4 mt-8 text-sm text-muted-foreground">
          <time dateTime={post.date}>{post.date}</time>
          <span>•</span>
          <span>{post.author}</span>
        </div>
        <div className="relative w-full h-64 md:h-80 my-8 rounded-lg overflow-hidden shadow-lg">
          <Image 
            src="/purple-brain.jpeg" 
            alt={`${post.title} image`} 
            fill 
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div className="mt-8 space-y-6">
          {post.content.split('\n').map((line, index) => {
            if (line.startsWith('##')) {
              const headingText = line.substring(2).trim()
              return <AnimatedHeading key={index} text={headingText} />
            } else if (line.trim() !== '') {
              return (
                <p key={index} className="leading-7">
                  {line}
                </p>
              )
            } else {
              return null
            }
          })}
        </div>
        {post.worksCited && post.worksCited.length > 0 && (
          <div className="mt-12 border-t border-white/20 pt-8">
            <h2 className="text-2xl font-semibold mb-4">Works Cited</h2>
            <ul className="space-y-2">
              {post.worksCited.map((citation, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {citation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  )
} 