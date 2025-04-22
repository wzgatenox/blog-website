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

      {/* Featured Posts - Updated Layout */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
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
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-800" />
                    )}
                  </div>

                  {/* Content Section Below Image */}
                  <div className="flex flex-col flex-grow p-4 md:p-6">
                    <time dateTime={post.date} className="block text-xs text-muted-foreground mb-2">
                      {new Date(post.date).toLocaleDateString('en-GB')} 
                    </time>
                    <h3 className="text-lg md:text-xl font-semibold leading-snug group-hover:text-primary transition-colors flex-grow">
                      {post.title}
                    </h3>
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
