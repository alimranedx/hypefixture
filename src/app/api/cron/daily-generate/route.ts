import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateDailyHypePosts, saveGeneratedPostsToDatabase } from '@/lib/gemini';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'hypefixture_cron_key_987654';

  // Secure cron endpoint
  if (authHeader !== `Bearer ${cronSecret}`) {
    const urlSecret = request.nextUrl.searchParams.get('key');
    if (urlSecret !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized cron access' }, { status: 401 });
    }
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

  const count = settings.postsPerDay || 5;
  const autoPublish = settings.autoPublish;

  const { posts, telemetry } = await generateDailyHypePosts(count, autoPublish);
  const saved = await saveGeneratedPostsToDatabase(posts);

  return NextResponse.json({
    success: true,
    triggeredAt: new Date().toISOString(),
    telemetry,
    postsGenerated: saved.length,
    articles: saved.map((s) => ({ title: s.title, slug: s.slug })),
  });
}
