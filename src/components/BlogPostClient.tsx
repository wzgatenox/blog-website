"use client" // This component handles client-side interactions

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { TableOfContents, TocEntry } from "@/components/TableOfContents"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { AnimatedHeading } from "@/components/AnimatedHeading"
import type { BlogPost as BlogPostType } from "@/data/blog-posts" // Import the type
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw' // Import rehype-raw

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

// Define block types including 'html'
interface ContentBlock {
    type: 'heading' | 'paragraph' | 'image' | 'html'; 
    content: string; 
    imageSide?: 'left' | 'right';
    alt?: string; 
    id?: string;
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

  // --- Updated Content Splitting Logic ---
  const contentBlocks: ContentBlock[] = [];
  const tocEntries: TocEntry[] = [];
  let nextImage: { src: string; alt: string; side: 'left' | 'right' } | null = null;

  if (post.subtitle) {
    tocEntries.push({ id: 'subtitle', text: post.subtitle });
  }

  let currentHtmlBlock = '';
  let inHtmlBlock = false;

  post.content.split('\n').forEach(line => {
    // Detect start of the specific HTML block we want to treat differently
    if (line.trim().startsWith('<div class="my-6 rounded-lg')) {
      inHtmlBlock = true;
      currentHtmlBlock = line + '\n';
    } 
    // If we are inside that HTML block, keep appending lines
    else if (inHtmlBlock) {
      currentHtmlBlock += line + '\n';
      // Detect the end of the block
      if (line.trim() === '</div>') {
        contentBlocks.push({ type: 'html', content: currentHtmlBlock.trim() });
        currentHtmlBlock = '';
        inHtmlBlock = false;
      }
    } 
    // Handle headings (outside the HTML block)
    else if (line.startsWith('##')) {
      const headingText = line.substring(2).trim();
      const headingId = slugify(headingText);
      contentBlocks.push({ type: 'heading', content: headingText, id: headingId });
      tocEntries.push({ id: headingId, text: headingText });
      // Reset nextImage when a new section starts
      nextImage = null; 
      // Simplified image logic based on original component
      if (headingText.toLowerCase().includes('freud')) {
        nextImage = { src: '/Freud.jpeg', alt: 'Sigmund Freud', side: 'left' };
      } else if (headingText.toLowerCase().includes('neuroscience')) { // Changed from 'science says' for clarity
        nextImage = { src: '/synthesis-model.jpeg', alt: 'Activation-Synthesis Model Diagram', side: 'right' };
      }
    } 
    // Handle paragraphs and potential images (outside the HTML block)
    else if (line.trim() !== '') {
      if (nextImage) {
        // Find the correct way to add image blocks if needed, current logic seems simplified
        // Assuming paragraph comes after potential image setup
        contentBlocks.push({ type: 'paragraph', content: line }); 
        // Reset nextImage? Might need adjustment based on desired image placement logic.
        // nextImage = null; 
      } else {
        contentBlocks.push({ type: 'paragraph', content: line });
      }
    }
  });
  // --- End Updated Content Splitting Logic ---

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

        {/* --- Updated Block Rendering Logic --- */}
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

              if (block.type === 'heading') {
                 renderedBlocks.push(<AnimatedHeading key={index} id={block.id} text={block.content} />);
              } 
              else if (block.type === 'paragraph') {
                 // Render normal paragraphs using ReactMarkdown (no raw HTML needed here typically)
                 renderedBlocks.push(
                   <div key={index} className="leading-relaxed prose dark:prose-invert max-w-none">
                     <ReactMarkdown>{block.content}</ReactMarkdown>
                   </div>
                 );
              } 
              else if (block.type === 'html') {
                 // Render the captured HTML block using ReactMarkdown with rehype-raw
                 renderedBlocks.push(
                   <ReactMarkdown key={index} rehypePlugins={[rehypeRaw]}>{block.content}</ReactMarkdown>
                 );
              } 
              // Add logic for 'image' type blocks if your splitting logic creates them
              // else if (block.type === 'image') { ... }
            }
            return renderedBlocks;
          })()}
        </div>
        {/* --- End Updated Block Rendering Logic --- */}

        {/* Works Cited Section */}
        {post.worksCited && post.worksCited.length > 0 && (
          <div id="works-cited" className="mt-12 border-t border-white/20 pt-8 clear-both prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-3">Works Cited</h2> 
            <ul className="space-y-1.5 list-none pl-0">
              {post.worksCited.map((citation, index) => (
                <li key={index} className="text-xs text-muted-foreground">
                  {/* Pass rehypeRaw here too for safety if citations might contain HTML */}
                  <ReactMarkdown components={{ p: React.Fragment }} rehypePlugins={[rehypeRaw]}>{citation}</ReactMarkdown>
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
            <p className="text-lg text-gray-700 font-semibold text-center mb-4">I'd love to hear your perspective on dreams and meaning!</p>
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
        <li key={comment.id} className="border rounded-2xl p-2 sm:p-4 bg-white/80 dark:bg-black/30 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start overflow-hidden">
          <span className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-0 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-900 flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md select-none flex-shrink-0">
            {getAvatar(comment.name)}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-1">
              <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 break-words">{comment.name}</span>
              <StarRatingStatic rating={comment.rating} />
              <span className="text-xs sm:text-sm text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <div className="text-sm sm:text-base mb-2 whitespace-pre-line break-words">{comment.comment}</div>
            <ReplySection parentId={comment.id} onReply={onReply} />
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-0 sm:ml-6 mt-4 border-l-0 sm:border-l-2 border-gray-200 dark:border-gray-700 pl-0 sm:pl-4">
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
        <span key={star} className={star <= rating ? "text-yellow-400 text-lg sm:text-xl" : "text-gray-300 text-lg sm:text-xl"}>★</span>
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
          className="text-xs sm:text-sm text-primary underline hover:no-underline"
          onClick={() => setShow(true)}
        >
          Reply
        </button>
      )}
    </div>
  );
} 