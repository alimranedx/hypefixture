import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';

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
      // Generate a specialized SEO article targeted at this specific keyword
      const targetKw = keyword || 'where to watch live sports stream';
      const kwSport = sport || 'football';
      const cleanSlug = targetKw.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      let articleContent = `
<h2>Complete Matchday Guide: ${targetKw}</h2>
<p>Sports enthusiasts searching for <strong>${targetKw}</strong> need fast, reliable, and verified broadcasting options. In this guide, we break down official television networks, digital live stream passes, and global kickoff times.</p>

<h3>Official Broadcasters & Channels</h3>
<p>Live television broadcasts are available across premium networks. In the United States, tune in via NBC/Peacock or ESPN+. In the United Kingdom, Sky Sports and TNT Sports hold live broadcasting rights.</p>

<div class="cta-box bg-slate-900 border border-emerald-500/30 p-6 rounded-xl my-6">
  <h4 class="text-emerald-400 font-bold text-lg mb-2">⚡ Direct Live Streaming Access</h4>
  <p class="text-slate-300 text-sm mb-4">Stream live in high definition with multi-camera commentary and no regional lag.</p>
  <a href="/go/affforce" class="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-2.5 rounded-lg transition" rel="sponsored nofollow">Access Stream Here &rarr;</a>
</div>

<h3>How to Avoid Broadcast Blackouts with a Sports VPN</h3>
<p>If you are traveling abroad, geographic restrictions may prevent you from loading your domestic sports passes. Connecting to a verified sports VPN instantly restores your secure connection.</p>
      `;

      // Call Gemini if API key is provided
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey.trim() !== '') {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `Write an in-depth 700-word sports SEO broadcast guide for the search query: "${targetKw}". Sport: ${kwSport}. Include H2 headings, broadcaster breakdown by country (US, UK, CA, AU), and a call to action box. Output raw HTML only.`;
          const resp = await ai.models.generateContent({ model: 'gemini-3.8-flash', contents: prompt });
          if (resp.text) articleContent = resp.text.replace(/```html/gi, '').replace(/```/g, '');
        } catch (e) {
          console.warn('Gemini keyword generation fallback used');
        }
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

      return NextResponse.json({
        success: true,
        message: `Generated and published targeted article for keyword "${targetKw}"!`,
        post: createdPost,
      });
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
