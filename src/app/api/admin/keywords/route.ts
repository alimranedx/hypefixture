import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';
import { callGeminiWithCascade } from '@/lib/gemini';

export async function GET() {
  const keywords = await prisma.keyword.findMany({
    orderBy: [{ currentRank: 'asc' }, { volume: 'desc' }],
  });

  const totalVolume = keywords.reduce((sum, k) => sum + k.volume, 0);
  const top10Ranks = keywords.filter((k) => k.currentRank && k.currentRank <= 10).length;

  return NextResponse.json({
    keywords,
    stats: {
      totalKeywords: keywords.length,
      top10Ranks,
      totalVolume,
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

    const body = await request.json();
    const { action, keyword, sport, intent, volume, difficulty, targetSlug } = body;

    if (action === 'GENERATE_FOR_KEYWORD') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === '') {
        return NextResponse.json({
          error: 'GEMINI_API_KEY is not configured in .env. AI generation requires a valid Gemini API key. No post was created.',
        }, { status: 400 });
      }

      const targetKw = keyword || 'where to watch live sports stream';
      const kwSport = sport || 'football';
      const cleanSlug = targetKw.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Write an in-depth 700-word sports SEO broadcast guide for the search query: "${targetKw}". Sport: ${kwSport}. Include H2 headings, broadcaster breakdown by country (US, UK, CA, AU), and a call to action box. Output raw HTML only.`;
        const cascadeResult = await callGeminiWithCascade(ai, prompt);

        const articleContent = (cascadeResult.text || '').replace(/```html/gi, '').replace(/```/g, '').trim();
        if (!articleContent) {
          return NextResponse.json({
            error: 'Gemini AI returned empty content. No post was created.',
          }, { status: 500 });
        }

        const createdPost = await prisma.post.upsert({
          where: { slug: cleanSlug },
          update: {
            title: `How to Watch: ${targetKw.toUpperCase()} (Live Broadcast & Channels)`,
            content: articleContent,
            status: 'PUBLISHED',
          },
          create: {
            title: `How to Watch: ${targetKw.toUpperCase()} (Live Broadcast & Channels)`,
            slug: cleanSlug,
            summary: `Official viewing guide, TV channels, and verified streaming options for ${targetKw}.`,
            content: articleContent,
            sport: kwSport,
            status: 'PUBLISHED',
            seoKeywords: targetKw,
          },
        });

        // Update keyword targetSlug and rank simulation
        await prisma.keyword.updateMany({
          where: { keyword: targetKw },
          data: { targetSlug: createdPost.slug, currentRank: 3 },
        });

        const createdTime = new Date().toLocaleTimeString();
        const shortLog = `Article for "${targetKw}" created at ${createdTime} via model "${cascadeResult.model}"${
          cascadeResult.fallbackOccurred ? ' (auto-recovered from busy model)' : ''
        }`;

        console.log(`[TicketFixture Keywords AI] ${shortLog}`);

        return NextResponse.json({
          success: true,
          message: `Generated and published targeted article for keyword "${targetKw}" via Gemini (${cascadeResult.model})!`,
          post: createdPost,
          model: cascadeResult.model,
          timestamp: new Date().toISOString(),
          shortLog,
        });
      } catch (err: any) {
        return NextResponse.json({
          error: `Gemini AI generation failed: ${err.message || err}. No post was created.`,
        }, { status: 500 });
      }
    }

    // Default: Add new keyword
    const createdKw = await prisma.keyword.create({
      data: {
        keyword: keyword.toLowerCase().trim(),
        sport: sport || 'football',
        intent: intent || 'COMMERCIAL',
        volume: parseInt(volume) || 25000,
        difficulty: difficulty || 'MEDIUM',
        currentRank: body.currentRank ? parseInt(body.currentRank) : null,
        targetSlug,
      },
    });

    return NextResponse.json({ success: true, keyword: createdKw });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
