import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const partners = await prisma.affiliatePartner.findMany({
    orderBy: { clicks: 'desc' },
  });

  const totalClicks = partners.reduce((sum, p) => sum + p.clicks, 0);
  const totalConversions = partners.reduce((sum, p) => sum + p.conversions, 0);

  return NextResponse.json({
    partners,
    stats: {
      totalPartners: partners.length,
      totalClicks,
      totalConversions,
      estimatedRevenue: totalConversions * 45, // Average $45 blended CPA
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, name, slug, targetUrl, category, payout, status } = await request.json();

    if (id) {
      const updated = await prisma.affiliatePartner.update({
        where: { id },
        data: {
          name,
          slug: slug.toLowerCase().trim(),
          targetUrl,
          category,
          payout,
          status,
        },
      });
      return NextResponse.json({ success: true, partner: updated });
    }

    const created = await prisma.affiliatePartner.create({
      data: {
        name,
        slug: slug.toLowerCase().trim(),
        targetUrl,
        category: category || 'CPA Streaming',
        payout: payout || 'Up to $50 CPA',
        status: status || 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true, partner: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
