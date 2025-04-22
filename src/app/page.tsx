import Link from "next/link"
import { Button } from "@/components/ui/button"
import { blogPosts } from "@/data/blog-posts"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 gradient-text">
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
              <article key={slug} className="group relative overflow-hidden rounded-lg shadow-lg">
                <Link href={`/blog/${slug}`} className="block">
                  <Image
                    src="/purple-brain.jpeg"
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 z-10">
                    <h3 className="text-xl font-semibold text-white group-hover:text-gray-100 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-200 text-sm mt-2">
                      {post.subtitle || "Understanding the mysteries of our subconscious mind"}
                    </p>
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
