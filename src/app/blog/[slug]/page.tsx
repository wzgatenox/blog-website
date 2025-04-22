import { notFound } from "next/navigation"
import { blogPosts } from "@/data/blog-posts"
import type { BlogPost } from "@/data/blog-posts"
import Link from "next/link"

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto py-12">
      <header className="mb-12">
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>{post.author}</span>
          <span>•</span>
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{post.title}</h1>
        {post.subtitle && (
          <p className="text-xl text-gray-600 dark:text-gray-400">{post.subtitle}</p>
        )}
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        {post.content.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={index} className="text-2xl font-bold mt-12 mb-6">
                {paragraph.replace('## ', '')}
              </h2>
            )
          }
          return (
            <p key={index} className="mb-6 leading-relaxed">
              {paragraph}
            </p>
          )
        })}
      </div>

      {post.worksCited && post.worksCited.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-6">Works Cited</h2>
          <ul className="space-y-4">
            {post.worksCited.map((citation, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                {citation}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
        <Link 
          href="/blog" 
          className="text-primary hover:text-primary/80 transition-colors inline-flex items-center"
        >
          ← Back to all posts
        </Link>
      </div>
    </article>
  )
} 