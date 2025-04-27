// Keep server-side imports
import { notFound } from "next/navigation"
import { blogPosts } from "@/data/blog-posts"
import React from "react"
// Remove client-side imports like useState, Sheet, etc.

// Import the new client component
import { BlogPostClient } from "@/components/BlogPostClient"

// Restore generateStaticParams
export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

export const dynamicParams = false // Restore dynamicParams

// Remove the PageProps interface definition
/*
interface PageProps {
  params: { 
    slug: string
  }
}
*/

// Server Component (Data Fetching)
// Use inline type definition for props
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BlogPost({ params }: any) {
  const slug = params.slug;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  // Pass the fetched post data to the client component
  return <BlogPostClient post={post} />;
} 