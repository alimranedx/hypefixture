import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Please sign in to save fixtures' }, { status: 401 });
  }

  const { matchSlug, sport, title, matchTime } = await request.json();

  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_matchSlug: {
        userId,
        matchSlug,
      },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id },
    });
    return NextResponse.json({ bookmarked: false, message: 'Removed from bookmarks' });
  } else {
    const created = await prisma.bookmark.create({
      data: {
        userId,
        matchSlug,
        sport,
        title,
        matchTime,
      },
    });
    return NextResponse.json({ bookmarked: true, bookmark: created });
  }
}
