"use client" // This component handles client-side interactions

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { TableOfContents, TocEntry } from "@/components/TableOfContents"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { AnimatedHeading } from "@/components/AnimatedHeading"
import type { BlogPost as BlogPostType } from "@/data/blog-posts" // Import the type
import ReactMarkdown from 'react-markdown' // Added import

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

  // Event listener for ToC hamburger click from Nav
  useEffect(() => {
    const handleOpenToc = () => setIsTocOpen(true);
    document.addEventListener('openBlogPostToc', handleOpenToc);
    return () => {
      document.removeEventListener('openBlogPostToc', handleOpenToc);
    };
  }, []);

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
      {/* Mobile ToC Sheet (triggered by event from Nav.tsx) */}
      <Sheet open={isTocOpen} onOpenChange={setIsTocOpen}>
        <SheetContent side="right" className="w-3/4 sm:w-1/2 lg:w-1/3 overflow-y-auto pt-10">
          <TableOfContents 
            entries={tocEntries} 
            onLinkClick={() => setIsTocOpen(false)}
            hasWorksCited={post.worksCited && post.worksCited.length > 0} 
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Table of Contents */}
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-4">
        <TableOfContents 
          entries={tocEntries} 
          hasWorksCited={post.worksCited && post.worksCited.length > 0} 
        />
      </aside>

      {/* Article Content - Added break-words */}
      <article className="prose prose-lg prose-gray dark:prose-invert w-full lg:max-w-4xl flex-grow break-words">
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
            let afterDreamsVideo = false;
            let dreamsVideoInserted = false;
            const renderedBlocks = [];
            for (let index = 0; index < contentBlocks.length; index++) {
              const block = contentBlocks[index];
              // Insert clear-both before '💬 Interpreting Dreams: Meaning or Making It Up?' heading
              if (block.type === 'heading' && block.content.trim().toLowerCase().startsWith('💬 interpreting dreams:')) {
                renderedBlocks.push(<div key={index + '-clear-interpreting'} className="clear-both" />);
              }
              // Detect '🔮 So, What Dreams Really Tell Us?' section
              if (block.type === 'heading' && block.content.trim().toLowerCase().startsWith('🔮 so, what dreams really tell us')) {
                afterDreamsVideo = true;
                dreamsVideoInserted = false;
                renderedBlocks.push(<AnimatedHeading key={index} id={block.id} text={block.content} />);
                continue;
              }
              // Insert YouTube video as float-right at start of first paragraph after heading ONLY
              if (afterDreamsVideo && !dreamsVideoInserted && block.type === 'paragraph') {
                renderedBlocks.push(
                  <div key={index} className="leading-relaxed clear-both">
                    {/* Responsive YouTube video - further increased size */}
                    <span className="float-right inline-block ml-6 mb-4 rounded-lg overflow-hidden shadow-lg not-prose w-full max-w-[560px] sm:w-3/4 md:w-2/3 lg:w-1/2">
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/2W85Dwxx218"
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          style={{ display: "block" }}
                        ></iframe>
                      </div>
                    </span>
                    {block.content}
                  </div>
                );
                dreamsVideoInserted = true;
                afterDreamsVideo = false;
                continue;
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
                  <div key={index} className="leading-relaxed clear-both">
                    {/* Responsive Freud image */}
                    <span className="float-right inline-block ml-6 mb-4 rounded-lg overflow-hidden shadow-lg not-prose w-full max-w-[320px] sm:w-1/2">
                      <Image
                        src={post.freudImageUrl}
                        alt="The layers of dream interpretation according to Freud"
                        width={320}
                        height={240}
                        style={{ objectFit: "contain", display: "block" }}
                      />
                    </span>
                    {block.content}
                  </div>
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
                    {/* Responsive Neuroscience image */}
                    <div className="float-left inline-block mr-6 mb-4 rounded-lg overflow-hidden shadow-lg not-prose w-full max-w-[600px] sm:w-2/3">
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
                  <div key={index} className="leading-relaxed clear-both">
                    {/* Responsive Windt image */}
                    <span className="float-right inline-block ml-6 mb-4 rounded-lg overflow-hidden shadow-lg not-prose w-full max-w-[600px] sm:w-2/3">
                      <Image
                        src={post.windtImageUrl}
                        alt="The intersection of memory and imagination in dreams"
                        width={600}
                        height={360}
                        style={{ objectFit: "contain", display: "block" }}
                      />
                    </span>
                    {block.content}
                  </div>
                );
                windtImageInserted = true;
                windtSectionStarted = false;
                afterWindtImage = true;
                continue;
              }
              // First paragraph after Windt image gets clear-both
              if (afterWindtImage && block.type === 'paragraph') {
                renderedBlocks.push(
                  <div key={index} className="leading-relaxed clear-both">{block.content}</div>
                );
                afterWindtImage = false;
                continue;
              }
              // Default rendering
              if (block.type === 'heading') {
                renderedBlocks.push(<AnimatedHeading key={index} id={block.id} text={block.content} />);
              } else if (block.type === 'paragraph') {
                // Use ReactMarkdown for paragraph content
                renderedBlocks.push(
                  <div key={index} className="leading-relaxed prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{block.content}</ReactMarkdown>
                  </div>
                );
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
          <div id="works-cited" className="mt-12 border-t border-white/20 pt-8 clear-both prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-3">Works Cited</h2> 
            <ul className="space-y-1.5 list-none pl-0">
              {post.worksCited.map((citation, index) => (
                <li key={index} className="text-xs text-muted-foreground">
                  <ReactMarkdown components={{ p: React.Fragment }}>{citation}</ReactMarkdown>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Enhanced Comment Section - Added w-full and responsive padding */}
        <div className="mt-12 border-t border-white/20 pt-8 w-full max-w-2xl mx-auto bg-gradient-to-br from-purple-100 via-blue-50 to-purple-200 dark:from-purple-900/40 dark:to-blue-900/60 dark:bg-[#232347]/80 border-2 border-purple-300 dark:border-purple-700 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-purple-300/40 text-gray-900 dark:text-gray-100">
          <div className="flex flex-col items-center mb-4">
            <span className="text-4xl mb-2">💬</span>
            <h2 className="text-4xl font-extrabold mb-2 text-purple-900 dark:text-purple-200 text-center drop-shadow">Share Your Thoughts</h2>
            <p className="text-lg text-muted-foreground text-center mb-4">We'd love to hear your perspective on dreams and meaning!</p>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mb-4"></div>
          </div>
          <CommentBoxThreaded />
        </div>
      </article>
    </div>
  );
}

// Threaded comment box component
function CommentBoxThreaded() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch("/api/comments")
      .then(res => res.json())
      .then(setComments)
      .catch(() => setError("Failed to load comments."))
      .finally(() => setLoading(false));
  }, [refresh]);

  return (
    <div>
      <CommentForm onSubmit={() => setRefresh(r => r + 1)} parentId={undefined} />
      <div className="mt-8">
        {loading ? (
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-200"><span className="animate-spin text-2xl">⏳</span> Loading comments...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : comments.length === 0 ? (
          <div className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</div>
        ) : (
          <CommentList comments={comments} onReply={() => setRefresh(r => r + 1)} />
        )}
      </div>
    </div>
  );
}

interface CommentFormProps {
  parentId?: string;
  onSubmit: () => void;
}

function CommentForm({ parentId, onSubmit }: CommentFormProps) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment, rating, parentId }),
      });
      if (!res.ok) throw new Error("Failed to submit comment");
      setSubmitted(true);
      setName("");
      setComment("");
      setRating(0);
      if (onSubmit) onSubmit();
    } catch (err) {
      setError("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && !parentId) {
    return <div className="p-4 bg-green-100 text-green-800 rounded">Thank you for sharing your thoughts!</div>;
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} aria-label="Comment form">
      <StarRating rating={rating} setRating={setRating} />
      <input
        type="text"
        placeholder="Your name (optional)"
        className="border rounded px-3 py-2 bg-white dark:bg-[#232347] text-gray-900 dark:text-gray-100"
        value={name}
        onChange={e => setName(e.target.value)}
        aria-label="Your name"
      />
      <textarea
        placeholder="Your comment..."
        className="border rounded px-3 py-2 min-h-[80px] bg-white dark:bg-[#232347] text-gray-900 dark:text-gray-100"
        value={comment}
        onChange={e => setComment(e.target.value)}
        required
        aria-label="Your comment"
      />
      {error && <div className="text-red-600">{error}</div>}
      <button
        type="submit"
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 flex items-center justify-center gap-2"
        disabled={submitting}
        aria-busy={submitting}
      >
        {submitting && <span className="animate-spin">⏳</span>}
        {submitting ? "Submitting..." : parentId ? "Reply" : "Submit"}
      </button>
    </form>
  );
}

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

function StarRating({ rating, setRating }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          type="button"
          key={star}
          onClick={() => setRating(star)}
          className={
            star <= rating
              ? "text-yellow-400 text-2xl cursor-pointer"
              : "text-gray-300 text-2xl cursor-pointer"
          }
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">{rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : "No rating"}</span>
    </div>
  );
}

// Avatar helper
function getAvatar(name: string) {
  if (!name || name === 'Anonymous') return '👤';
  // Use first letter or emoji if present
  const first = name.trim()[0];
  if (/\p{Emoji}/u.test(first)) return first;
  return first.toUpperCase();
}

interface CommentListProps {
  comments: any[];
  onReply: () => void;
}

function CommentList({ comments, onReply }: CommentListProps) {
  return (
    <ul className="space-y-6">
      {comments.map((comment: any) => (
        <li key={comment.id} className="border rounded-2xl p-4 bg-white/80 dark:bg-black/30 flex gap-4 items-start">
          <span className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-900 flex items-center justify-center text-2xl font-bold shadow-md select-none">
            {getAvatar(comment.name)}
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900 dark:text-gray-100 break-words">{comment.name}</span>
              <StarRatingStatic rating={comment.rating} />
              <span className="text-xs text-muted-foreground ml-auto">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <div className="mb-2 whitespace-pre-line break-words">{comment.comment}</div>
            <ReplySection parentId={comment.id} onReply={onReply} />
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-6 mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                <CommentList comments={comment.replies} onReply={onReply} />
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

interface StarRatingStaticProps {
  rating: number;
}

function StarRatingStatic({ rating }: StarRatingStaticProps) {
  return (
    <span className="flex items-center">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= rating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}>★</span>
      ))}
    </span>
  );
}

interface ReplySectionProps {
  parentId: string;
  onReply: () => void;
}

function ReplySection({ parentId, onReply }: ReplySectionProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="mt-2">
      {show ? (
        <div className="mb-2">
          <CommentForm parentId={parentId} onSubmit={() => { setShow(false); if (onReply) onReply(); }} />
        </div>
      ) : (
        <button
          className="text-sm text-primary underline hover:no-underline"
          onClick={() => setShow(true)}
        >
          Reply
        </button>
      )}
    </div>
  );
} 