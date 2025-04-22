import Link from "next/link"
import { blogPosts } from "@/data/blog-posts"
import Image from "next/image"

export default function BlogPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Blog Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(blogPosts).map(([slug, post]) => (
            <article key={slug} className="group flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
              <Link href={`/blog/${slug}`} className="flex flex-col h-full">
                {/* Image Section */}
                <div className="relative aspect-video w-full overflow-hidden">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    // Fallback gradient if no image URL
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-800" />
                  )}
                </div>

                {/* Content Section Below Image */}
                <div className="flex flex-col flex-grow p-4 md:p-6">
                  <time dateTime={post.date} className="block text-xs text-muted-foreground mb-2">
                    {new Date(post.date).toLocaleDateString('en-GB')} {/* Formatted date */}
                  </time>
                  <h2 className="text-lg md:text-xl font-semibold leading-snug group-hover:text-primary transition-colors flex-grow">
                    {post.title}
                  </h2>
                  {/* Removed author display */}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
} 