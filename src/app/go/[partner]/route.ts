import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ partner: string }> }
) {
  const { partner } = await params;
  const partnerSlug = partner.toLowerCase().trim();

  // Try finding in dynamic AffiliatePartner table
  const dbPartner = await prisma.affiliatePartner.findFirst({
    where: {
      OR: [
        { slug: partnerSlug },
        { slug: partnerSlug === 'tickets' ? 'seatgeek' : partnerSlug },
      ],
    },
  });

  let destination = 'https://seatgeek.com/?ref=hypefixture';

  if (dbPartner) {
    destination = dbPartner.targetUrl;
    // Asynchronously record click count
    await prisma.affiliatePartner.update({
      where: { id: dbPartner.id },
      data: { clicks: { increment: 1 } },
    }).catch(() => null);
  } else {
    if (partnerSlug.includes('stubhub')) {
      destination = 'https://stubhub.com/?ref=hypefixture';
    } else if (partnerSlug.includes('viagogo')) {
      destination = 'https://viagogo.com/?ref=hypefixture';
    } else if (partnerSlug.includes('tickpick')) {
      destination = 'https://tickpick.com/?ref=hypefixture';
    } else {
      destination = 'https://seatgeek.com/?ref=hypefixture';
    }
  }

  // SEO shielding headers: Never index affiliate hop links
  return NextResponse.redirect(destination, {
    status: 307,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Cache-Control': 'no-store, max-age=0',
      'Referrer-Policy': 'no-referrer-when-downgrade',
    },
  });
}
