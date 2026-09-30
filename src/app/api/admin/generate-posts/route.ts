import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateDailyHypePosts, saveGeneratedPostsToDatabase } from '@/lib/gemini';
import { pushToIndexNow, syndicatePost } from '@/lib/syndication';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const settings = await prisma.systemSetting.upsert({
      where: { id: 'global' },
      update: {},
      create: {
        id: 'global',
        postsPerDay: 5,
        autoPublish: true,
        activeSports: 'football,nba,nfl,ufc',
      },
    });

    const body = await request.json().catch(() => ({}));
    const count = body.count || settings.postsPerDay || 5;
    const autoPublish = body.autoPublish !== undefined ? body.autoPublish : settings.autoPublish;

    const { posts: generated, telemetry } = await generateDailyHypePosts(count, autoPublish);

    if (!generated || generated.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: telemetry.error || 'Gemini AI failed to generate posts. No posts were created.',
          telemetry,
        },
        { status: 400 }
      );
    }

    const saved = await saveGeneratedPostsToDatabase(generated);

    // 1. Instant IndexNow push to Bing/Yahoo/Yandex
    if (settings.autoIndexNow) {
      const siteUrl = process.env.NEXTAUTH_URL || 'https://hypefixture.com';
      const urls = saved.map((s) => `${siteUrl}/post/${s.slug}`);
      pushToIndexNow(urls).catch((e) => console.warn('Background IndexNow push error:', e));
    }

    // 2. Automated Social Syndication (Twitter, Facebook, Pinterest)
    if (settings.autoShareSocial) {
      for (const p of saved) {
        syndicatePost(p.id).catch((e) => console.warn(`Background syndication error for ${p.id}:`, e));
      }
    }

    const timeStr = new Date(telemetry.timestamp).toLocaleTimeString();
    const shortLog = telemetry.summaryLog || `Generated ${saved.length} posts at ${timeStr} using model ${telemetry.model}`;

    return NextResponse.json({
      success: true,
      message: `⚡ Google Gemini generated ${saved.length} articles at ${timeStr} using model "${telemetry.model}" in ${telemetry.latencyMs}ms!${
        telemetry.fallbackOccurred ? ' (Recovered via auto-failover).' : ''
      }${settings.autoIndexNow ? ' Pushed to IndexNow.' : ''}${settings.autoShareSocial ? ' Syndicated to social media.' : ''}`,
      count: saved.length,
      model: telemetry.model,
      createdTime: timeStr,
      shortLog,
      telemetry,
      posts: saved,
    });
  } catch (error: any) {
    console.error('Error generating posts:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate posts' },
      { status: 500 }
    );
  }
}
