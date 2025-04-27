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

// Remove the PageProps interface
// interface PageProps {
//   params: { 
//     slug: string
//   }
// }

// Server Component - Remove explicit PageProps typing for params
export default async function BlogPost({ params }: { params: { slug: string } }) { // Let TS infer or use inline type
  const slug = params.slug;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  // Pass the fetched post data to the client component
  return <BlogPostClient post={post} />;
} 