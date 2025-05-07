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
  if (typeof text !== 'string') return '' 
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

  // --- Generate ToC Entries Only --- 
  const tocEntries: TocEntry[] = [];
  if (post.subtitle) {
    tocEntries.push({ id: 'subtitle', text: post.subtitle });
  }
  const headingRegex = /^##\s+(.*)/gm;
  let match;
  while ((match = headingRegex.exec(post.content)) !== null) {
      const headingText = match[1].trim();
      if (headingText) { 
        const headingId = slugify(headingText);
        tocEntries.push({ id: headingId, text: headingText });
      }
  }
  // --- End ToC Generation ---

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

      {/* Article Content - Apply prose styling here, render entire content with ReactMarkdown */}
      <article className="prose prose-lg prose-gray dark:prose-invert w-full lg:max-w-4xl flex-grow break-words prose-p:mb-12">
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

        {/* Render ENTIRE post content using ReactMarkdown with rehype-raw and component mapping for h2 */}
        <ReactMarkdown 
          rehypePlugins={[rehypeRaw]}
          components={{
            h2: ({node, ...props}) => {
              let headingText = '';
              if (node && node.children) {
                const textNode = node.children.find(child => child.type === 'text');
                if (textNode && 'value' in textNode) {
                  headingText = textNode.value;
                }
              }
              const id = slugify(headingText);
              return <AnimatedHeading id={id} text={headingText} />;
            }
          }}
        >
          {post.content}
        </ReactMarkdown>

        {/* Works Cited Section - Rendered AFTER main content */}
        {post.worksCited && post.worksCited.length > 0 && (
          <div id="works-cited" className="mt-12 border-t border-white/20 pt-8 clear-both prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-3">Works Cited</h2> 
            <ul className="space-y-1.5 list-none pl-0">
              {post.worksCited.map((citation, index) => (
                <li key={index} className="text-xs text-muted-foreground">
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
  const [nestedComments, setNestedComments] = useState<any[]>([]); // For desktop tree view
  const [flatComments, setFlatComments] = useState<any[]>([]);   // For mobile flat view
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [isMobile, setIsMobile] = useState(false); // State to track mobile view

  // Effect to check for mobile view on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Using 768px as Tailwind's md breakpoint
    };
    checkIsMobile(); // Initial check
    window.addEventListener('resize', checkIsMobile);
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("/api/comments")
      .then(res => res.json())
      .then(data => {
        setNestedComments(data); // Original nested data for desktop

        // Create a flattened list for mobile display
        const allCommentsForFlatList: any[] = [];
        const flattenRepliesRecursively = (commentsToFlatten: any[]) => {
          commentsToFlatten.forEach(comment => {
            allCommentsForFlatList.push({ ...comment }); // Add comment to flat list
            if (comment.replies && comment.replies.length > 0) {
              flattenRepliesRecursively(comment.replies); // Recurse for replies
            }
          });
        };
        flattenRepliesRecursively(data);
        setFlatComments(allCommentsForFlatList);
      })
      .catch(() => setError("Failed to load comments. Please try refreshing."))
      .finally(() => setLoading(false));
  }, [refresh]);

  const commentsToRender = isMobile ? flatComments : nestedComments;

  return (
    <div>
      <CommentForm onSubmit={() => setRefresh(r => r + 1)} parentId={undefined} />
      <div className="mt-8">
        {loading ? (
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-200"><span className="animate-spin text-2xl">⏳</span> Loading comments...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : commentsToRender.length === 0 ? (
          <div className="text-muted-foreground text-center py-4">No comments yet. Be the first to share your thoughts!</div>
        ) : (
          <CommentList 
            comments={commentsToRender} 
            onReply={() => setRefresh(r => r + 1)} 
            isMobileView={isMobile}
            depth={0} 
          />
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
  comments: any[]; // Will be flat for mobile, nested for desktop (top-level or replies)
  onReply: () => void;
  isMobileView: boolean;
  depth?: number; 
}

function CommentList({ comments, onReply, isMobileView, depth = 0 }: CommentListProps) {
  return (
    <ul className={`
      space-y-4 
      ${!isMobileView && depth > 0 ? 'pl-3 sm:pl-4 mt-3 border-l-2 border-purple-200 dark:border-purple-700/60' : 'space-y-5 sm:space-y-6'}
    `}>
      {comments.map((comment: any) => (
        <li 
          key={comment.id} 
          className="p-3 sm:p-4 bg-white/70 dark:bg-black/30 rounded-lg shadow-md"
        >
          <div className="flex items-start gap-2.5 sm:gap-3">
            <span 
              className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-800 flex items-center justify-center text-base sm:text-lg font-semibold text-white dark:text-purple-100 flex-shrink-0 mt-0.5 shadow-sm select-none"
              aria-label={`${comment.name || 'User'}'s avatar`}
            >
              {getAvatar(comment.name || 'User')}
            </span>
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-0.5">
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                  {comment.name || "Anonymous"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                  {comment.rating > 0 && (
                    <span className="ml-1.5 sm:ml-2 inline-flex items-center">
                      <StarRatingStatic rating={comment.rating} />
                    </span>
                  )}
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm break-words leading-relaxed">
                {comment.comment}
              </p>
              
              {/* Reply button - only for DESKTOP view */}
              {!isMobileView && (
                <div className="mt-1.5">
                  <ReplySection parentId={comment.id} onReply={onReply} />
                </div>
              )}
            </div>
          </div>

          {/* Render replies for DESKTOP view (tree structure) */}
          {/* For mobile view, replies are already part of the flat 'comments' list passed to this component, so no recursive call needed here. */}
          {!isMobileView && comment.replies && comment.replies.length > 0 && (
            <CommentList 
              comments={comment.replies} 
              onReply={onReply} 
              isMobileView={false} // Always false for desktop recursive calls
              depth={depth + 1} 
            />
          )}
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