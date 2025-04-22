import Link from "next/link"
import { Button } from "@/components/ui/button"
import { blogPosts } from "@/data/blog-posts"

export default function Home() {
  const latestPost = Object.entries(blogPosts)[0]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Exploring the World of Dreams
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Discover insights about dreams, consciousness, and the mysteries of the mind
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/blog">Read Blog</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/about">About</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(blogPosts).map(([slug, post]) => (
              <article key={slug} className="group">
                <Link href={`/blog/${slug}`} className="block">
                  <div className="relative overflow-hidden rounded-lg">
                    <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-xl font-semibold text-white group-hover:text-gray-200 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-200 text-sm mt-2">
                        {post.subtitle || "Understanding the mysteries of our subconscious mind"}
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
