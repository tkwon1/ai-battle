import { NextResponse } from 'next/server';
import { getPosts, getReplies } from '@/lib/airtable';


export async function GET() {
  const posts = await getPosts();
  const replies = await getReplies();

  return NextResponse.json({
    posts_count: posts.length,
    first_post: posts[0] || null,
    replies_count: replies.length,
    first_reply: replies[0] || null,
  });
}