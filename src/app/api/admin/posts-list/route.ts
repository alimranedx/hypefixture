import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      sport: true,
      status: true,
      views: true,
      createdAt: true,
    },
    take: 50,
  });

  return NextResponse.json({ posts });
}
