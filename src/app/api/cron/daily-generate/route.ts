import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateDailyHypePosts, saveGeneratedPostsToDatabase } from '@/lib/gemini';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'TicketFixture_cron_key_987654';

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

  if (!posts || posts.length === 0) {
    return NextResponse.json({
      success: false,
      triggeredAt: new Date().toISOString(),
      error: telemetry.error || 'Gemini AI failed to generate posts. No posts were created.',
      telemetry,
      postsGenerated: 0,
    }, { status: 400 });
  }

  const saved = await saveGeneratedPostsToDatabase(posts);

  return NextResponse.json({
    success: true,
    triggeredAt: new Date().toISOString(),
    model: telemetry.model,
    shortLog: telemetry.summaryLog,
    telemetry,
    postsGenerated: saved.length,
    articles: saved.map((s) => ({ title: s.title, slug: s.slug })),
  });
}
