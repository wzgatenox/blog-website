import { notFound } from "next/navigation"
import { blogPosts } from "@/data/blog-posts"
import React from "react"
import { AnimatedHeading } from "@/components/AnimatedHeading"
import Image from "next/image"
import { TableOfContents, TocEntry } from "@/components/TableOfContents"

// Helper to generate URL-friendly slugs/IDs
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
};

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

  // Process content for blocks AND generate ToC entries
  const contentBlocks: Array<{ 
    type: 'heading' | 'paragraph' | 'image'; 
    content: string; 
    imageSide?: 'left' | 'right';
    alt?: string; 
    id?: string; // Add id for headings
  }> = [];
  const tocEntries: TocEntry[] = []; // Array for ToC data
  let nextImage: { src: string; alt: string; side: 'left' | 'right' } | null = null;

  post.content.split('\n').forEach(line => {
    if (line.startsWith('##')) {
      const headingText = line.substring(2).trim();
      const headingId = slugify(headingText); // Generate ID
      contentBlocks.push({ type: 'heading', content: headingText, id: headingId });
      tocEntries.push({ id: headingId, text: headingText }); // Add to ToC data
      
      // Reset image logic based on heading
      if (headingText.toLowerCase().includes('freud')) {
        nextImage = { src: '/Freud.jpeg', alt: 'Sigmund Freud', side: 'left' };
      } else if (headingText.toLowerCase().includes('science says')) {
        nextImage = { src: '/synthesis-model.jpeg', alt: 'Activation-Synthesis Model Diagram', side: 'right' };
      } else {
          nextImage = null; 
      }
    } else if (line.trim() !== '') {
      if (nextImage) {
        contentBlocks.push({ type: 'image', content: nextImage.src, imageSide: nextImage.side, alt: nextImage.alt });
        contentBlocks.push({ type: 'paragraph', content: line });
        nextImage = null;
      } else {
        contentBlocks.push({ type: 'paragraph', content: line });
      }
    } // Ignore empty lines
  });

  return (
    // Use Flexbox for layout: ToC on left, Article on right
    <div className="relative container mx-auto flex flex-row gap-12 py-8 px-4">
      {/* Table of Contents (Left Column) - Make it sticky */}
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-4">
         <TableOfContents entries={tocEntries} />
      </aside>

      {/* Article Content (Right Column) - Takes remaining space */}
      <article className="prose prose-lg prose-gray dark:prose-invert max-w-none lg:max-w-4xl flex-grow">
        {/* Header Section */}
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
        <div className="relative w-full h-64 md:h-80 my-8 rounded-lg overflow-hidden shadow-lg not-prose"> {/* Add not-prose */} 
          <Image 
            src="/purple-brain.jpeg" 
            alt={`${post.title} image`} 
            fill 
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* Render processed content blocks */}
        <div className="mt-8 space-y-6 clear-both">
          {contentBlocks.map((block, index) => {
            if (block.type === 'heading') {
              // Use AnimatedHeading with id
              return <AnimatedHeading key={index} id={block.id} text={block.content} />;
            } else if (block.type === 'paragraph') {
              return <p key={index} className="leading-relaxed">{block.content}</p>;
            } else if (block.type === 'image') {
              const floatClass = block.imageSide === 'left' ? 'float-left mr-6 mb-4' : 'float-right ml-6 mb-4';
              return (
                <div key={index} className={`relative w-1/2 md:w-1/3 ${floatClass} shape-outside-rectangle not-prose`}> {/* Add not-prose */} 
                  <Image 
                    src={block.content} 
                    alt={block.alt || 'Blog post image'}
                    width={400} 
                    height={400} 
                    className="rounded-md shadow-md w-full h-auto"
                  />
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Works Cited Section */}
        {post.worksCited && post.worksCited.length > 0 && (
          <div className="mt-12 border-t border-white/20 pt-8 clear-both">
            <h2 className="text-xl font-semibold mb-3">Works Cited</h2> 
            <ul className="space-y-1.5">
              {post.worksCited.map((citation, index) => (
                <li key={index} className="text-xs text-muted-foreground">
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