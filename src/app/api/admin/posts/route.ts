import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizeArticleHtml, sanitizePlainText } from '@/lib/sanitize';

export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get('sport');
  const status = request.nextUrl.searchParams.get('status');
  const search = request.nextUrl.searchParams.get('search');
  const slug = request.nextUrl.searchParams.get('slug');

  if (slug) {
    const post = await prisma.post.findUnique({ where: { slug } });
    return NextResponse.json({ post, posts: post ? [post] : [] });
  }

  const where: any = {};
  if (sport && sport !== 'all') where.sport = sport;
  if (status && status !== 'all') where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { summary: { contains: search } },
      { seoKeywords: { contains: search } },
    ];
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      summary,
      content,
      sport,
      status,
      featuredImage,
      seoKeywords,
      matchDate,
      schemaJson,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const cleanTitle = sanitizePlainText(title);
    let baseSlug = (slug || cleanTitle).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (!baseSlug) baseSlug = `sports-post-${Date.now()}`;

    // Ensure slug uniqueness
    let uniqueSlug = baseSlug;
    const existing = await prisma.post.findUnique({ where: { slug: uniqueSlug } });
    if (existing) {
      uniqueSlug = `${uniqueSlug}-${Date.now().toString().slice(-4)}`;
    }

    const cleanSummary = sanitizePlainText(summary || `${cleanTitle} broadcast and viewing guide.`);
    const cleanContent = sanitizeArticleHtml(content || `<p>Upcoming match details for ${cleanTitle}.</p>`);
    const cleanSport = sanitizePlainText(sport || 'football').toLowerCase();
    const cleanKeywords = seoKeywords ? sanitizePlainText(seoKeywords) : cleanTitle;

    const created = await prisma.post.create({
      data: {
        title: cleanTitle,
        slug: uniqueSlug,
        summary: cleanSummary,
        content: cleanContent,
        sport: cleanSport,
        status: status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
        featuredImage: featuredImage || null,
        seoKeywords: cleanKeywords,
        matchDate: matchDate || new Date().toISOString(),
        schemaJson: schemaJson || null,
      },
    });

    return NextResponse.json({ success: true, post: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create post' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, title, summary, content, sport, status, seoKeywords } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Enterprise Security: Sanitize all inputs against JavaScript Injection & XSS
    const cleanContent = content ? sanitizeArticleHtml(content) : undefined;
    const cleanTitle = title ? sanitizePlainText(title) : undefined;
    const cleanSummary = summary ? sanitizePlainText(summary) : undefined;
    const cleanSport = sport ? sanitizePlainText(sport).toLowerCase() : undefined;

    const updated = await prisma.post.update({
      where: { id },
      data: {
        ...(cleanTitle !== undefined && { title: cleanTitle }),
        ...(cleanSummary !== undefined && { summary: cleanSummary }),
        ...(cleanContent !== undefined && { content: cleanContent }),
        ...(cleanSport !== undefined && { sport: cleanSport }),
        ...(status !== undefined && { status }),
        ...(seoKeywords !== undefined && { seoKeywords: sanitizePlainText(seoKeywords) }),
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  return PATCH(request);
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await request.json();
    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Post successfully deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
