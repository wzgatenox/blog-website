"use client" // This component handles client-side interactions

import React, { useState } from "react"
import Image from "next/image"
import { TableOfContents, TocEntry } from "@/components/TableOfContents"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedHeading } from "@/components/AnimatedHeading"
import type { BlogPost as BlogPostType } from "@/data/blog-posts" // Import the type

// Helper function (can be kept here or moved to a utils file)
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Interface for component props
interface BlogPostClientProps {
  post: BlogPostType;
}

// Renamed from BlogPostPageContent
export function BlogPostClient({ post }: BlogPostClientProps) {
  const [isTocOpen, setIsTocOpen] = useState(false);

  // Process content for blocks AND generate ToC entries
  const contentBlocks: Array<{ 
    type: 'heading' | 'paragraph' | 'image'; 
    content: string; 
    imageSide?: 'left' | 'right';
    alt?: string; 
    id?: string;
  }> = [];
  const tocEntries: TocEntry[] = [];
  let nextImage: { src: string; alt: string; side: 'left' | 'right' } | null = null;

  post.content.split('\n').forEach(line => {
    if (line.startsWith('##')) {
      const headingText = line.substring(2).trim();
      const headingId = slugify(headingText);
      contentBlocks.push({ type: 'heading', content: headingText, id: headingId });
      tocEntries.push({ id: headingId, text: headingText });
      
      // Simplified image logic based on original component
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
    }
  });

  // The entire JSX structure from the previous BlogPostPageContent
  return (
    <div className="relative container mx-auto flex flex-row gap-12 py-8 px-4">
      {/* Mobile ToC Trigger Button */}
      <div className="lg:hidden fixed top-5 right-4 z-50">
        <Sheet open={isTocOpen} onOpenChange={setIsTocOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open Table of Contents</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-3/4 sm:w-1/2 overflow-y-auto pt-10">
            <TableOfContents 
              entries={tocEntries} 
              onLinkClick={() => setIsTocOpen(false)} 
              hasWorksCited={post.worksCited && post.worksCited.length > 0} 
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Table of Contents */}
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-4">
        <TableOfContents 
          entries={tocEntries} 
          hasWorksCited={post.worksCited && post.worksCited.length > 0} 
        />
      </aside>

      {/* Article Content */}
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
        <div className="relative w-full h-64 md:h-80 my-8 rounded-lg overflow-hidden shadow-lg not-prose">
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
            // Insert Freud image at the start of Freud section
            if (
              block.type === 'heading' &&
              block.content.toLowerCase().includes("freud") &&
              post.freudImageUrl
            ) {
              return [
                <AnimatedHeading key={index} id={block.id} text={block.content} />,
                <div key={index + '-freud-img'} className="relative w-full h-64 md:h-80 my-8 rounded-lg overflow-hidden shadow-lg not-prose">
                  <Image
                    src={post.freudImageUrl}
                    alt="The layers of dream interpretation according to Freud"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ];
            }
            // Insert Neuroscience image at the start of Neuroscience section
            if (
              block.type === 'heading' &&
              block.content.toLowerCase().includes("neuroscience") &&
              post.neuroscienceImageUrl
            ) {
              return [
                <AnimatedHeading key={index} id={block.id} text={block.content} />,
                <div key={index + '-neuro-img'} className="relative w-full h-64 md:h-80 my-8 rounded-lg overflow-hidden shadow-lg not-prose">
                  <Image
                    src={post.neuroscienceImageUrl}
                    alt="The brain's activity during dreaming"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ];
            }
            // Insert Windt image at the start of Windt section
            if (
              block.type === 'heading' &&
              block.content.toLowerCase().includes("middle ground") &&
              post.windtImageUrl
            ) {
              return [
                <AnimatedHeading key={index} id={block.id} text={block.content} />,
                <div key={index + '-windt-img'} className="relative w-full h-64 md:h-80 my-8 rounded-lg overflow-hidden shadow-lg not-prose">
                  <Image
                    src={post.windtImageUrl}
                    alt="The intersection of memory and imagination in dreams"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ];
            }
            if (block.type === 'heading') {
              return <AnimatedHeading key={index} id={block.id} text={block.content} />;
            } else if (block.type === 'paragraph') {
              return <p key={index} className="leading-relaxed">{block.content}</p>;
            } else if (block.type === 'image') {
              const floatClass = block.imageSide === 'left' ? 'float-left mr-6 mb-4' : 'float-right ml-6 mb-4';
              return (
                <div key={index} className={`relative w-1/2 md:w-1/3 ${floatClass} shape-outside-rectangle not-prose`}>
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
          <div id="works-cited" className="mt-12 border-t border-white/20 pt-8 clear-both">
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
  );
} 