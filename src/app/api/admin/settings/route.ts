import { NextRequest, NextResponse } from 'next/server';
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
    const data = await request.json();

    const updated = await prisma.systemSetting.upsert({
      where: { id: 'global' },
      update: {
        postsPerDay: Number(data.postsPerDay) || 5,
        autoPublish: Boolean(data.autoPublish),
        activeSports: data.activeSports || 'football,nba,nfl,ufc',
        affforceUrl: data.affforceUrl || 'https://panel.affforce.com/apply/register-affiliate/',
        vpnUrl: data.vpnUrl || 'https://nordvpn.com',
        fuboUrl: data.fuboUrl || 'https://www.fubo.tv',
      },
      create: {
        id: 'global',
        postsPerDay: Number(data.postsPerDay) || 5,
        autoPublish: Boolean(data.autoPublish),
        activeSports: data.activeSports || 'football,nba,nfl,ufc',
        affforceUrl: data.affforceUrl || 'https://panel.affforce.com/apply/register-affiliate/',
        vpnUrl: data.vpnUrl || 'https://nordvpn.com',
        fuboUrl: data.fuboUrl || 'https://www.fubo.tv',
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
