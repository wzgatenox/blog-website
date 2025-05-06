import { NextRequest, NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob'; // Corrected imports

const COMMENTS_BLOB_PATH = 'comments.json'; // Path for the blob in Vercel Storage

async function readCommentsFromBlob() {
  try {
    // List blobs with the specific path. Since it's a unique file, limit to 1.
    const { blobs } = await list({ prefix: COMMENTS_BLOB_PATH, limit: 1 });

    // Check if the specific blob was found
    if (blobs && blobs.length > 0 && blobs[0].pathname === COMMENTS_BLOB_PATH) {
      const blob = blobs[0];
      const response = await fetch(blob.url); // Fetch content from the blob's public URL
      
      if (!response.ok) {
        // If fetching fails, but the blob was listed (e.g. permissions, temporary issue)
        // For a 404 here, it might mean the blob was listed but then immediately deleted, or URL is stale.
        if (response.status === 404) {
            return []; // Treat as not found
        }
        console.error(`Failed to fetch comments blob content: ${response.status} ${response.statusText}`);
        return []; // Return empty on fetch error to avoid breaking GET
      }
      const text = await response.text();
      return JSON.parse(text);
    }
    return []; // Blob not found by list operation
  } catch (error: any) {
    console.error('Error in readCommentsFromBlob:', error);
    return []; // Return empty on any other error to avoid breaking GET
  }
}

async function writeCommentsToBlob(comments: any) {
  try {
    await put(COMMENTS_BLOB_PATH, JSON.stringify(comments, null, 2), {
      access: 'public', // Or 'private' if you handle access control differently
      contentType: 'application/json',
      // Add a cache control header if desired, e.g., to ensure fresh data
      // cacheControl: 'max-age=0, s-maxage=0, must-revalidate',
    });
  } catch (error) {
    console.error('Error writing comments to blob:', error);
    throw new Error('Failed to save comments.'); // Propagate error to be caught by POST handler
  }
}

function addReply(comments: any[], parentId: string, reply: any) {
  for (const comment of comments) {
    if (comment.id === parentId) {
      comment.replies = comment.replies || [];
      comment.replies.push(reply);
      return true;
    }
    if (comment.replies && addReply(comment.replies, parentId, reply)) {
      return true;
    }
  }
  return false;
}

export async function GET() {
  try {
    const comments = await readCommentsFromBlob();
    return NextResponse.json(comments);
  } catch (error) {
    console.error('GET /api/comments error:', error);
    return NextResponse.json({ error: 'Failed to retrieve comments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, comment, rating, parentId } = await req.json();
    let comments = await readCommentsFromBlob(); // Read current comments

    const newComment = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: name || 'Anonymous',
      comment,
      rating,
      parentId: parentId || null,
      replies: [],
      createdAt: new Date().toISOString(),
    };

    if (parentId) {
      addReply(comments, parentId, newComment);
    } else {
      comments.push(newComment);
    }

    await writeCommentsToBlob(comments); // Write updated comments back to blob
    return NextResponse.json(newComment, { status: 201 }); // Return 201 for created resource

  } catch (error: any) {
    console.error('POST /api/comments error:', error);
    // If writeCommentsToBlob threw, it might be a specific error string
    const errorMessage = error.message || 'Failed to submit comment';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 