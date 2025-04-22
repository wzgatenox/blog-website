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
  const resolvedParams = await params
  const slug = resolvedParams.slug as string
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  // Pre-process content to handle image insertion logic more easily
  const contentBlocks: Array<{ 
    type: 'heading' | 'paragraph' | 'image'; 
    content: string; 
    imageSide?: 'left' | 'right';
    alt?: string; // Add optional alt text for images
  }> = [];
  let nextImage: { src: string; alt: string; side: 'left' | 'right' } | null = null;

  post.content.split('\n').forEach(line => {
    if (line.startsWith('##')) {
      const headingText = line.substring(2).trim();
      contentBlocks.push({ type: 'heading', content: headingText });
      if (headingText.toLowerCase().includes('freud')) {
        nextImage = { src: '/Freud.jpeg', alt: 'Sigmund Freud', side: 'left' };
      } else if (headingText.toLowerCase().includes('science says')) {
        nextImage = { src: '/synthesis-model.jpeg', alt: 'Activation-Synthesis Model Diagram', side: 'right' };
      } else {
          nextImage = null; 
      }
    } else if (line.trim() !== '') {
      if (nextImage) {
        // Add image block *with* alt text
        contentBlocks.push({ type: 'image', content: nextImage.src, imageSide: nextImage.side, alt: nextImage.alt });
        contentBlocks.push({ type: 'paragraph', content: line });
        nextImage = null;
      } else {
        contentBlocks.push({ type: 'paragraph', content: line });
      }
    } // Ignore empty lines
  });

  return (
    <div className="relative min-h-screen">
      <article className="relative prose prose-lg prose-gray dark:prose-invert mx-auto max-w-4xl py-8 px-4">
        <h1 className="text-6xl font-bold tracking-tight mb-6 leading-tight gradient-text">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-2xl text-muted-foreground mt-6 mb-8 leading-relaxed">
            {post.subtitle}
          </p>
        )}
        <div className="flex items-center gap-4 mt-8 mb-8 text-sm text-muted-foreground">
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

        {/* Render processed content blocks */}
        <div className="mt-8 space-y-6 clear-both"> {/* Added clear-both to ensure works cited is below floats */}
          {contentBlocks.map((block, index) => {
            if (block.type === 'heading') {
              return <AnimatedHeading key={index} text={block.content} />;
            } else if (block.type === 'paragraph') {
              return <p key={index} className="leading-relaxed">{block.content}</p>;
            } else if (block.type === 'image') {
              const floatClass = block.imageSide === 'left' ? 'float-left mr-6 mb-4' : 'float-right ml-6 mb-4';
              return (
                <div key={index} className={`relative w-1/2 md:w-1/3 ${floatClass} shape-outside-rectangle`}> {/* Adjust width as needed */}
                  <Image 
                    src={block.content} 
                    alt={block.alt || 'Blog post image'} // Use the alt text from the block
                    width={400} // Provide explicit width/height for non-fill images
                    height={400} // Adjust height based on image aspect ratio 
                    className="rounded-md shadow-md w-full h-auto"
                  />
                </div>
              );
            }
            return null;
          })}
        </div>

        {post.worksCited && post.worksCited.length > 0 && (
          <div className="mt-12 border-t border-white/20 pt-8 clear-both"> {/* Added clear-both */}
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