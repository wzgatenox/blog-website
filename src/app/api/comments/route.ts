import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const COMMENTS_FILE = path.resolve(process.cwd(), 'comments.json');

async function readComments() {
  try {
    const data = await fs.readFile(COMMENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeComments(comments: any) {
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf-8');
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
  const comments = await readComments();
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const { name, comment, rating, parentId } = await req.json();
  const comments = await readComments();
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
  await writeComments(comments);
  return NextResponse.json(newComment);
} 