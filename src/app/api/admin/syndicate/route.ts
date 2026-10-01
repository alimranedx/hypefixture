import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { syndicatePost, pushToIndexNow } from '@/lib/syndication';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { postId, action, postIds } = await request.json();

    // 1. Single Post Syndication (all channels: IndexNow, Twitter, Facebook, Pinterest)
    if (postId) {
      const report = await syndicatePost(postId);
      return NextResponse.json({ success: true, report });
    }

    // 2. Batch IndexNow Push
    if (action === 'BATCH_INDEXNOW') {
      const targetPosts = await prisma.post.findMany({
        where: postIds ? { id: { in: postIds } } : { status: 'PUBLISHED' },
        select: { slug: true },
        take: 50,
      });

      const siteUrl = process.env.NEXTAUTH_URL || 'https://ticketfixture.com';
      const urls = targetPosts.map((p) => `${siteUrl}/post/${p.slug}`);

      const result = await pushToIndexNow(urls);

      if (result.success) {
        await prisma.post.updateMany({
          where: { slug: { in: targetPosts.map((p) => p.slug) } },
          data: { indexedBing: true, indexedAt: new Date() },
        });
      }

      return NextResponse.json({ success: result.success, message: result.message });
    }

    return NextResponse.json({ error: 'Invalid syndication action or missing postId' }, { status: 400 });
  } catch (error: any) {
    console.error('Syndication API error:', error);
    return NextResponse.json({ error: error.message || 'Syndication failed' }, { status: 500 });
  }
}
