// Keep server-side imports
import { notFound } from "next/navigation"
import { blogPosts } from "@/data/blog-posts"
import React from "react"
// Remove client-side imports like useState, Sheet, etc.

// Import the new client component
import { BlogPostClient } from "@/components/BlogPostClient"

// Keep generateStaticParams
export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

export const dynamicParams = false

// Define props for the server component if needed (can reuse or simplify)
interface PageProps {
  params: { // No need for Promise here
    slug: string
  }
}

// Server Component (Data Fetching)
export default async function BlogPost({ params }: PageProps) {
  const slug = params.slug;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  // Pass the fetched post data to the client component
  return <BlogPostClient post={post} />;
} 