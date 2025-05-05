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

  // Add subtitle to ToC if it exists
  if (post.subtitle) {
    tocEntries.push({ id: 'subtitle', text: post.subtitle });
  }

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
          <p id="subtitle" className="text-2xl text-muted-foreground mt-6 mb-8 leading-relaxed">
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
          {(() => {
            let inFreudSection = false;
            let lastFreudParagraphIndex = -1;
            let secondToLastFreudParagraphIndex = -1;
            // First, find the last and second-to-last paragraph index in the Freud section
            for (let i = 0; i < contentBlocks.length; i++) {
              const block = contentBlocks[i];
              if (block.type === 'heading' && block.content.toLowerCase().includes('freud')) {
                inFreudSection = true;
              } else if (block.type === 'heading' && !block.content.toLowerCase().includes('freud') && inFreudSection) {
                inFreudSection = false;
              } else if (block.type === 'paragraph' && inFreudSection) {
                secondToLastFreudParagraphIndex = lastFreudParagraphIndex;
                lastFreudParagraphIndex = i;
              }
            }
            inFreudSection = false;
            let justEndedFreudSection = false;
            let afterWindtImage = false;
            let windtImageInserted = false;
            let windtSectionStarted = false;
            const renderedBlocks = [];
            for (let index = 0; index < contentBlocks.length; index++) {
              const block = contentBlocks[index];
              // Insert clear-both before 'Interpreting Dreams: Meaning or Making It Up?' heading
              if (block.type === 'heading' && block.content.trim().toLowerCase().startsWith('interpreting dreams:')) {
                renderedBlocks.push(<div key={index + '-clear-interpreting'} className="clear-both" />);
              }
              // Freud section logic
              if (block.type === 'heading' && block.content.toLowerCase().includes('freud')) {
                inFreudSection = true;
                renderedBlocks.push(<AnimatedHeading key={index} id={block.id} text={block.content} />);
                continue;
              }
              if (block.type === 'heading' && !block.content.toLowerCase().includes('freud') && inFreudSection) {
                inFreudSection = false;
                justEndedFreudSection = true;
              }
              // Insert Freud image at the second-to-last paragraph
              if (block.type === 'paragraph' && inFreudSection && index === secondToLastFreudParagraphIndex && post.freudImageUrl) {
                renderedBlocks.push(
                  <p key={index} className="leading-relaxed">
                    <span className="float-right inline-block ml-6 mb-4 rounded-lg overflow-hidden shadow-lg not-prose w-[320px]">
                      <Image
                        src={post.freudImageUrl}
                        alt="The layers of dream interpretation according to Freud"
                        width={320}
                        height={240}
                        style={{ objectFit: "contain", display: "block" }}
                      />
                    </span>
                    {block.content}
                  </p>
                );
                continue;
              }
              // Insert clear-both after Freud section
              if (justEndedFreudSection) {
                renderedBlocks.push(<div key={index + '-clear'} className="clear-both" />);
                justEndedFreudSection = false;
              }
              // Neuroscience image after heading
              if (
                block.type === 'heading' &&
                block.content.toLowerCase().includes('neuroscience') &&
                post.neuroscienceImageUrl
              ) {
                renderedBlocks.push(
                  <React.Fragment key={index}>
                    <AnimatedHeading id={block.id} text={block.content} />
                    <div className="float-left inline-block mr-6 mb-4 rounded-lg overflow-hidden shadow-lg not-prose">
                      <Image
                        src={post.neuroscienceImageUrl}
                        alt="The brain's activity during dreaming"
                        width={600}
                        height={360}
                        style={{ objectFit: "contain", display: "block" }}
                      />
                    </div>
                  </React.Fragment>
                );
                continue;
              }
              // Windt image after heading: set flag to insert image in next paragraph
              if (
                block.type === 'heading' &&
                block.content.toLowerCase().includes('middle ground') &&
                post.windtImageUrl
              ) {
                renderedBlocks.push(
                  <AnimatedHeading key={index} id={block.id} text={block.content} />
                );
                windtImageInserted = false;
                windtSectionStarted = true;
                afterWindtImage = false;
                continue;
              }
              // Insert Windt image as float-right at start of first paragraph after heading ONLY
              if (windtSectionStarted && !windtImageInserted && post.windtImageUrl && block.type === 'paragraph') {
                renderedBlocks.push(
                  <p key={index} className="leading-relaxed">
                    <span className="float-right inline-block ml-6 mb-4 rounded-lg overflow-hidden shadow-lg not-prose w-[600px]">
                      <Image
                        src={post.windtImageUrl}
                        alt="The intersection of memory and imagination in dreams"
                        width={600}
                        height={360}
                        style={{ objectFit: "contain", display: "block" }}
                      />
                    </span>
                    {block.content}
                  </p>
                );
                windtImageInserted = true;
                windtSectionStarted = false;
                afterWindtImage = true;
                continue;
              }
              // First paragraph after Windt image gets clear-both
              if (afterWindtImage && block.type === 'paragraph') {
                renderedBlocks.push(
                  <p key={index} className="leading-relaxed clear-both">{block.content}</p>
                );
                afterWindtImage = false;
                continue;
              }
              // Default rendering
              if (block.type === 'heading') {
                renderedBlocks.push(<AnimatedHeading key={index} id={block.id} text={block.content} />);
              } else if (block.type === 'paragraph') {
                renderedBlocks.push(<p key={index} className="leading-relaxed">{block.content}</p>);
              } else if (block.type === 'image') {
                const floatClass = block.imageSide === 'left' ? 'float-left mr-6 mb-4' : 'float-right ml-6 mb-4';
                renderedBlocks.push(
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
            }
            return renderedBlocks;
          })()}
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