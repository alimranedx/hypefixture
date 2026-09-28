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
        { slug: partnerSlug === 'sports-stream' || partnerSlug === 'live-stream' ? 'affforce' : partnerSlug },
        { slug: partnerSlug === 'nordvpn' ? 'vpn' : partnerSlug },
      ],
    },
  });

  let destination = 'https://panel.affforce.com/apply/register-affiliate/';

  if (dbPartner) {
    destination = dbPartner.targetUrl;
    // Asynchronously record click count
    await prisma.affiliatePartner.update({
      where: { id: dbPartner.id },
      data: { clicks: { increment: 1 } },
    }).catch(() => null);
  } else {
    // Fallback to SystemSettings table
    const settings = await prisma.systemSetting.findUnique({ where: { id: 'global' } });
    if (partnerSlug.includes('vpn')) {
      destination = settings?.vpnUrl || 'https://nordvpn.com';
    } else if (partnerSlug.includes('fubo')) {
      destination = settings?.fuboUrl || 'https://www.fubo.tv';
    } else {
      destination = settings?.affforceUrl || 'https://panel.affforce.com/apply/register-affiliate/';
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
