import Link from "next/link"
import { blogPosts } from "@/data/blog-posts"

export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Blog Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(blogPosts).map(([slug, post]) => (
            <article key={slug} className="group">
              <Link href={`/blog/${slug}`} className="block">
                <div className="relative overflow-hidden rounded-lg">
                  <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h2 className="text-xl font-semibold text-white group-hover:text-gray-200 transition-colors">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-200">
                      <span>{post.author}</span>
                      <span>•</span>
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
} 