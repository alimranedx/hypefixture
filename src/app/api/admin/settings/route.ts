import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const settings = await prisma.systemSetting.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      postsPerDay: 5,
      autoPublish: true,
      activeSports: 'football,nba,nfl,ufc',
      affforceUrl: 'https://panel.affforce.com/apply/register-affiliate/',
      vpnUrl: 'https://nordvpn.com',
      fuboUrl: 'https://www.fubo.tv',
    },
  });

  const totalPosts = await prisma.post.count();
  const publishedPosts = await prisma.post.count({ where: { status: 'PUBLISHED' } });
  const draftPosts = await prisma.post.count({ where: { status: 'DRAFT' } });

  return NextResponse.json({
    settings,
    stats: {
      totalPosts,
      publishedPosts,
      draftPosts,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const data = await request.json();

    const updated = await prisma.systemSetting.upsert({
      where: { id: 'global' },
      update: {
        postsPerDay: Number(data.postsPerDay) || 10,
        autoPublish: Boolean(data.autoPublish),
        activeSports: data.activeSports || 'football,nba,nfl,ufc',
        affforceUrl: data.affforceUrl || 'https://panel.affforce.com/apply/register-affiliate/',
        vpnUrl: data.vpnUrl || 'https://nordvpn.com',
        fuboUrl: data.fuboUrl || 'https://www.fubo.tv',
        autoShareSocial: Boolean(data.autoShareSocial),
        autoIndexNow: data.autoIndexNow !== undefined ? Boolean(data.autoIndexNow) : true,
        indexNowKey: data.indexNowKey !== undefined ? data.indexNowKey : undefined,
        twitterApiKey: data.twitterApiKey !== undefined ? data.twitterApiKey : undefined,
        twitterApiSecret: data.twitterApiSecret !== undefined ? data.twitterApiSecret : undefined,
        twitterAccessToken: data.twitterAccessToken !== undefined ? data.twitterAccessToken : undefined,
        twitterAccessSecret: data.twitterAccessSecret !== undefined ? data.twitterAccessSecret : undefined,
        facebookPageId: data.facebookPageId !== undefined ? data.facebookPageId : undefined,
        facebookAccessToken: data.facebookAccessToken !== undefined ? data.facebookAccessToken : undefined,
        pinterestAccessToken: data.pinterestAccessToken !== undefined ? data.pinterestAccessToken : undefined,
        pinterestBoardId: data.pinterestBoardId !== undefined ? data.pinterestBoardId : undefined,
      },
      create: {
        id: 'global',
        postsPerDay: Number(data.postsPerDay) || 10,
        autoPublish: Boolean(data.autoPublish),
        activeSports: data.activeSports || 'football,nba,nfl,ufc',
        affforceUrl: data.affforceUrl || 'https://panel.affforce.com/apply/register-affiliate/',
        vpnUrl: data.vpnUrl || 'https://nordvpn.com',
        fuboUrl: data.fuboUrl || 'https://www.fubo.tv',
        autoShareSocial: Boolean(data.autoShareSocial),
        autoIndexNow: data.autoIndexNow !== undefined ? Boolean(data.autoIndexNow) : true,
        indexNowKey: data.indexNowKey || 'hypefixture-indexnow-2026-key',
        twitterApiKey: data.twitterApiKey || null,
        twitterApiSecret: data.twitterApiSecret || null,
        twitterAccessToken: data.twitterAccessToken || null,
        twitterAccessSecret: data.twitterAccessSecret || null,
        facebookPageId: data.facebookPageId || null,
        facebookAccessToken: data.facebookAccessToken || null,
        pinterestAccessToken: data.pinterestAccessToken || null,
        pinterestBoardId: data.pinterestBoardId || null,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
