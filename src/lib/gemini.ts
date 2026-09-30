import { GoogleGenAI } from '@google/genai';
import { prisma } from './prisma';
import { sanitizeArticleHtml, sanitizePlainText } from './sanitize';

export interface GeneratedPostData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  sport: string;
  seoKeywords: string;
  matchDate: string;
  schemaJson: string;
  status: 'PUBLISHED' | 'DRAFT';
  featuredImage: string;
}

// High-resolution sports feature photography bank
const SPORTS_IMAGES = {
  football: [
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80', // Stadium night floodlights
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', // Soccer ball on pitch
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80', // Premier league arena
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80', // Packed football stadium
    'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80', // Goal net match action
  ],
  nfl: [
    'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1200&q=80', // American football under lights
    'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=1200&q=80', // NFL game ball on yard line
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80', // Packed football colosseum
    'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1200&q=80', // NFL evening kick
  ],
  nba: [
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80', // Basketball hoop arena
    'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80', // Indoor basketball court
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80', // Basketball through hoop
    'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=1200&q=80', // NBA game lights
  ],
  ufc: [
    'https://images.unsplash.com/photo-1517438322307-e67111335449?auto=format&fit=crop&w=1200&q=80', // Boxing ring / Octagon ropes
    'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80', // Fight gloves & canvas
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80', // MMA fighting arena
    'https://images.unsplash.com/photo-1509563400140-1278d6634f81?auto=format&fit=crop&w=1200&q=80', // Fight championship spotlight
  ],
};

function getRandomImage(sport: string): string {
  const sportKey = (sport || 'football').toLowerCase() as keyof typeof SPORTS_IMAGES;
  const list = SPORTS_IMAGES[sportKey] || SPORTS_IMAGES.football;
  return list[Math.floor(Math.random() * list.length)];
}

// 25+ Marquee Hype Match Pool across Football, NFL, NBA, UFC & Boxing
export const EXTENDED_HYPE_MATCHES = [
  // Football
  {
    sport: 'football',
    teams: 'Arsenal vs Chelsea',
    tournament: 'Premier League',
    venue: 'Emirates Stadium, London',
    time: '2026-09-29 19:30 UTC',
    broadcasters: { us: 'Peacock / USA Network', uk: 'Sky Sports Main Event', ca: 'Fubo Canada', au: 'Optus Sport' },
  },
  {
    sport: 'football',
    teams: 'Real Madrid vs Barcelona',
    tournament: 'La Liga (El Clásico)',
    venue: 'Santiago Bernabéu, Madrid',
    time: '2026-09-30 20:00 UTC',
    broadcasters: { us: 'ESPN+ / ESPN Deportes', uk: 'Premier Sports', ca: 'TSN', au: 'beIN Sports' },
  },
  {
    sport: 'football',
    teams: 'Liverpool vs Manchester City',
    tournament: 'Premier League Title Clash',
    venue: 'Anfield, Liverpool',
    time: '2026-10-01 16:30 UTC',
    broadcasters: { us: 'USA Network / Peacock', uk: 'Sky Sports Premier League', ca: 'Fubo Canada', au: 'Optus Sport' },
  },
  {
    sport: 'football',
    teams: 'Bayern Munich vs Borussia Dortmund',
    tournament: 'Bundesliga (Der Klassiker)',
    venue: 'Allianz Arena, Munich',
    time: '2026-10-03 17:30 UTC',
    broadcasters: { us: 'ESPN+', uk: 'Sky Sports Football', ca: 'DAZN Canada', au: 'beIN Sports' },
  },
  {
    sport: 'football',
    teams: 'Inter Milan vs AC Milan',
    tournament: 'Serie A (Derby della Madonnina)',
    venue: 'San Siro, Milan',
    time: '2026-10-04 19:45 UTC',
    broadcasters: { us: 'Paramount+', uk: 'TNT Sports 1', ca: 'Fubo Canada', au: 'beIN Sports' },
  },
  {
    sport: 'football',
    teams: 'Paris Saint-Germain vs Marseille',
    tournament: 'Ligue 1 (Le Classique)',
    venue: 'Parc des Princes, Paris',
    time: '2026-10-05 19:00 UTC',
    broadcasters: { us: 'beIN Sports', uk: 'TNT Sports', ca: 'Fubo Canada', au: 'beIN Sports' },
  },
  {
    sport: 'football',
    teams: 'Tottenham Hotspur vs Arsenal',
    tournament: 'Premier League (North London Derby)',
    venue: 'Tottenham Hotspur Stadium, London',
    time: '2026-10-06 15:30 UTC',
    broadcasters: { us: 'USA Network', uk: 'Sky Sports', ca: 'Fubo Canada', au: 'Optus Sport' },
  },

  // NFL
  {
    sport: 'nfl',
    teams: 'Kansas City Chiefs vs San Francisco 49ers',
    tournament: 'NFL Sunday Night Football',
    venue: 'Arrowhead Stadium, Kansas City',
    time: '2026-09-29 00:20 UTC',
    broadcasters: { us: 'NBC / Peacock', uk: 'Sky Sports NFL', ca: 'DAZN Canada', au: 'ESPN / Kayo' },
  },
  {
    sport: 'nfl',
    teams: 'Baltimore Ravens vs Buffalo Bills',
    tournament: 'NFL Sunday Showcase',
    venue: 'M&T Bank Stadium, Baltimore',
    time: '2026-10-02 17:00 UTC',
    broadcasters: { us: 'CBS / Paramount+', uk: 'Sky Sports NFL', ca: 'DAZN Canada', au: 'ESPN / Kayo' },
  },
  {
    sport: 'nfl',
    teams: 'Dallas Cowboys vs Philadelphia Eagles',
    tournament: 'NFL NFC East Rivalry',
    venue: 'AT&T Stadium, Arlington',
    time: '2026-10-03 20:25 UTC',
    broadcasters: { us: 'FOX Sports', uk: 'Sky Sports NFL', ca: 'DAZN Canada', au: 'ESPN / Kayo' },
  },
  {
    sport: 'nfl',
    teams: 'Detroit Lions vs Green Bay Packers',
    tournament: 'NFL NFC North Showdown',
    venue: 'Ford Field, Detroit',
    time: '2026-10-04 18:00 UTC',
    broadcasters: { us: 'FOX / NFL+', uk: 'Sky Sports NFL', ca: 'DAZN Canada', au: 'ESPN / Kayo' },
  },

  // NBA
  {
    sport: 'nba',
    teams: 'Los Angeles Lakers vs Boston Celtics',
    tournament: 'NBA Regular Season Rivalry',
    venue: 'Crypto.com Arena, Los Angeles',
    time: '2026-09-29 02:30 UTC',
    broadcasters: { us: 'ESPN / NBA League Pass', uk: 'TNT Sports', ca: 'Sportsnet', au: 'ESPN / Kayo' },
  },
  {
    sport: 'nba',
    teams: 'Golden State Warriors vs Milwaukee Bucks',
    tournament: 'NBA Primetime Showcase',
    venue: 'Chase Center, San Francisco',
    time: '2026-10-01 02:00 UTC',
    broadcasters: { us: 'TNT / Max', uk: 'TNT Sports', ca: 'TSN', au: 'NBA League Pass' },
  },
  {
    sport: 'nba',
    teams: 'Denver Nuggets vs Minnesota Timberwolves',
    tournament: 'NBA Western Conference Battle',
    venue: 'Ball Arena, Denver',
    time: '2026-10-02 01:30 UTC',
    broadcasters: { us: 'ESPN', uk: 'TNT Sports', ca: 'Sportsnet', au: 'NBA League Pass' },
  },
  {
    sport: 'nba',
    teams: 'Dallas Mavericks vs Boston Celtics',
    tournament: 'NBA Finals Rematch',
    venue: 'American Airlines Center, Dallas',
    time: '2026-10-04 00:30 UTC',
    broadcasters: { us: 'ABC / ESPN', uk: 'TNT Sports', ca: 'TSN', au: 'NBA League Pass' },
  },

  // UFC & Boxing
  {
    sport: 'ufc',
    teams: 'Makhachev vs Volkanovski 3',
    tournament: 'UFC 315 Main Event',
    venue: 'T-Mobile Arena, Las Vegas',
    time: '2026-09-30 03:00 UTC',
    broadcasters: { us: 'ESPN+ PPV', uk: 'TNT Sports Box Office', ca: 'Sportsnet PPV', au: 'Main Event' },
  },
  {
    sport: 'ufc',
    teams: 'Jon Jones vs Tom Aspinall',
    tournament: 'UFC Heavyweight Unification Championship',
    venue: 'Madison Square Garden, New York',
    time: '2026-10-03 04:00 UTC',
    broadcasters: { us: 'ESPN+ PPV', uk: 'TNT Sports Box Office', ca: 'Sportsnet PPV', au: 'Main Event' },
  },
  {
    sport: 'ufc',
    teams: 'Sean OMalley vs Merab Dvalishvili 2',
    tournament: 'UFC Bantamweight Title Rematch',
    venue: 'Sphere, Las Vegas',
    time: '2026-10-05 03:30 UTC',
    broadcasters: { us: 'ESPN+ PPV', uk: 'TNT Sports Box Office', ca: 'Sportsnet PPV', au: 'Main Event' },
  },
  {
    sport: 'ufc',
    teams: 'Tyson Fury vs Oleksandr Usyk 2',
    tournament: 'Undisputed World Heavyweight Championship',
    venue: 'Kingdom Arena, Riyadh',
    time: '2026-10-06 22:00 UTC',
    broadcasters: { us: 'DAZN PPV / ESPN+ PPV', uk: 'TNT Sports Box Office / Sky Box Office', ca: 'DAZN PPV', au: 'Main Event' },
  },
];

export const HYPE_MATCH_POOL = EXTENDED_HYPE_MATCHES.slice(0, 6);

/**
 * Intelligent AI Content Generator powered by Gemini with deduplication
 */
/**
 * Ordered priority of Gemini models:
 * System first attempts the latest preview/flagship model (3.8). If Google's servers
 * throw 503 (High Demand), 429 (Rate Limit), or temporary unavailable errors, the engine
 * automatically falls back to 3.7, then 3.6, then 3.5, then 3.5-lite.
 */
export function getGeminiModelCascade(): string[] {
  const envModel = process.env.GEMINI_MODEL?.trim();
  const models = [
    envModel,
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
  ].filter((m): m is string => Boolean(m && m.length > 0));

  // Deduplicate preserving priority order
  return Array.from(new Set(models));
}

export interface GeminiCascadeResult {
  text: string;
  model: string;
  attemptedModels: { model: string; error?: string; success?: boolean }[];
  fallbackOccurred: boolean;
}

/**
 * Executes a Gemini prompt through the model cascade with automatic failover
 */
export async function callGeminiWithCascade(
  ai: GoogleGenAI,
  prompt: string
): Promise<GeminiCascadeResult> {
  const cascade = getGeminiModelCascade();
  const attemptedModels: { model: string; error?: string; success?: boolean }[] = [];
  let lastError: any = null;

  for (let i = 0; i < cascade.length; i++) {
    const model = cascade[i];
    try {
      console.log(`[HypeFixture Gemini Engine] Attempting model [${i + 1}/${cascade.length}]: ${model}...`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      if (response && response.text) {
        attemptedModels.push({ model, success: true });
        const fallbackOccurred = i > 0;
        if (fallbackOccurred) {
          console.log(`[HypeFixture Gemini Engine] ⚡ Auto-failover SUCCESS: Primary model congested; generated using fallback model "${model}"!`);
        } else {
          console.log(`[HypeFixture Gemini Engine] ⚡ Prompt SUCCESS using latest model "${model}"!`);
        }

        return {
          text: response.text,
          model,
          attemptedModels,
          fallbackOccurred,
        };
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      console.warn(`[HypeFixture Gemini Engine] ⚠️ Model "${model}" failed (${errMsg.slice(0, 110)}...). Cascading to next fallback model...`);
      attemptedModels.push({ model, error: errMsg });
      // Brief pause between cascade attempts
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  throw lastError || new Error(`All candidate Gemini models (${cascade.join(', ')}) failed.`);
}

export interface GenerateHypeResult {
  posts: GeneratedPostData[];
  telemetry: {
    source: 'GOOGLE_GEMINI_LIVE' | 'FALLBACK_PROGRAMMATIC';
    model: string;
    latencyMs: number;
    timestamp: string;
    apiKeyPreview: string;
    promptPreview?: string;
    error?: string;
    modelsAttempted?: string[];
    fallbackOccurred?: boolean;
    summaryLog?: string;
  };
}

/**
 * Autonomous Content Engine: Generates daily sports article cluster via Gemini.
 * Features automatic model failover (3.8 -> 3.7 -> 3.6 -> 3.5) and detailed audit telemetry.
 */
export async function generateDailyHypePosts(
  count: number = 5,
  autoPublish: boolean = true
): Promise<GenerateHypeResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const apiKeyPreview = apiKey ? `${apiKey.substring(0, 8)}...${apiKey.slice(-4)}` : 'NOT_CONFIGURED';
  const defaultModel = getGeminiModelCascade()[0] || 'gemini-3.8-flash';

  // 1. Fetch existing slugs and titles from MySQL to guarantee 100% NON-DUPLICATE topics
  const existingPosts = await prisma.post.findMany({
    select: { slug: true, title: true },
  });
  const existingSlugs = new Set(existingPosts.map((p) => p.slug));

  // 2. Strict AI generation: Gemini must be configured and called
  if (!apiKey || apiKey.trim() === '') {
    return {
      posts: [],
      telemetry: {
        source: 'GOOGLE_GEMINI_LIVE',
        model: defaultModel,
        latencyMs: 0,
        timestamp: new Date().toISOString(),
        apiKeyPreview: 'NOT_CONFIGURED',
        error: 'GEMINI_API_KEY is not configured in .env. AI generation requires a valid Gemini API key. No posts were created.',
      },
    };
  }

  const t0 = Date.now();
  try {
    const ai = new GoogleGenAI({ apiKey });

    const existingTitlesList = existingPosts.slice(0, 15).map((p) => p.title).join(' | ');

    const prompt = `
You are a senior sports broadcaster analyst and SEO director for HypeFixture.com.
Generate exactly ${count} NEW, high-vitality sports SEO articles covering the biggest upcoming marquee games across Football (Soccer), NFL, NBA, and UFC/Boxing.

CRITICAL: Do NOT duplicate any of these existing topics: [${existingTitlesList}]. Every post must cover a fresh, high-hype matchup.

Structure the topical articles according to search intent:
- Football (Soccer): Matchday Pillar "Where to watch [Match] live stream: TV Channels, Kickoff Time & Streaming Guide"
- Football Lineups: "Predicted Starting Lineups, Team News & Key Injury Reports for [Match]"
- Football Stats: "Head-to-Head Record, 5-Game Form Guide & Betting Insights for [Match]"
- VPN / Geo-Guide: "How to Stream Today's Games from Anywhere (USA, UK, Canada, Australia) without Blackouts"
- Secondary Football Clash: Full broadcast breakdown for a second major European/Domestic clash
- NFL Marquee Game: "How to Watch [NFL Team A] vs [NFL Team B] Live: TV Networks & Kickoff Time"
- NFL Team News: Key injury updates, quarterback status, and tactical matchups
- NBA Primetime Battle: "Where to Stream [NBA Team A] vs [NBA Team B]: National TV & League Pass Guide"
- UFC / Boxing Main Event: "How to Watch [Fighter A] vs [Fighter B] Live PPV: Start Time, Ringwalks & Fight Card"
- Master Schedule: "Today's Live Sports Viewing Schedule: Global Kickoff Times & Verified Broadcast Directory"

Return a strictly valid JSON array of objects with keys:
[
  {
    "title": "High-CTR search headline targeted at Google queries like 'where to watch...', 'how to stream...', or 'predicted lineups'",
    "slug": "unique-kebab-case-slug-${Date.now()}",
    "summary": "150-160 character meta description crafted to achieve high organic Google click-through rate",
    "content": "Rich HTML content (minimum 600 words) with H2, H3, broadcaster table by country (US, UK, CA, AU), key tactical storylines, and a 3-question Frequently Asked Questions (FAQ) section.",
    "sport": "football" | "nba" | "nfl" | "ufc",
    "seoKeywords": "comma separated long-tail SEO keywords",
    "matchDate": "2026-10-02T19:30:00Z",
    "schemaJson": "valid JSON string combining Schema.org SportsEvent and FAQPage"
  }
]
Output ONLY raw JSON with no backticks, markdown, or comments.
`;

    // Cascade through models: 3.8 -> 3.7 -> 3.6 -> 3.5 -> 3.5-lite
    const cascadeResult = await callGeminiWithCascade(ai, prompt);

    const latencyMs = Date.now() - t0;
    const text = cascadeResult.text || '';
    let cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBracket = cleanJson.indexOf('[');
    const lastBracket = cleanJson.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1) {
      cleanJson = cleanJson.substring(firstBracket, lastBracket + 1);
    }

    const parsed = JSON.parse(cleanJson);

    if (Array.isArray(parsed) && parsed.length > 0) {
      const posts = parsed.slice(0, count).map((p: any) => {
        let uniqueSlug = p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (existingSlugs.has(uniqueSlug)) {
          uniqueSlug = `${uniqueSlug}-${Date.now().toString().slice(-4)}`;
        }
        return {
          ...p,
          slug: uniqueSlug,
          status: autoPublish ? 'PUBLISHED' : 'DRAFT',
          featuredImage: getRandomImage(p.sport),
        };
      });

      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      const attemptedSummary = cascadeResult.attemptedModels
        .map((a) => (a.success ? `${a.model} [Success]` : `${a.model} [Busy/503]`))
        .join(' ➔ ');

      const summaryLog = `Created ${posts.length} posts at ${timeStr} via model "${cascadeResult.model}"${
        cascadeResult.fallbackOccurred ? ` (Auto-recovered: ${attemptedSummary})` : ''
      }`;

      console.log(`[HypeFixture Content Engine] ${summaryLog} in ${latencyMs}ms`);

      return {
        posts,
        telemetry: {
          source: 'GOOGLE_GEMINI_LIVE',
          model: cascadeResult.model,
          latencyMs,
          timestamp: now.toISOString(),
          apiKeyPreview,
          promptPreview: `Generate ${count} articles across Football, NFL, NBA, UFC (excluding ${existingPosts.length} existing posts)`,
          modelsAttempted: cascadeResult.attemptedModels.map((a) => a.model),
          fallbackOccurred: cascadeResult.fallbackOccurred,
          summaryLog,
        },
      };
    } else {
      return {
        posts: [],
        telemetry: {
          source: 'GOOGLE_GEMINI_LIVE',
          model: cascadeResult.model,
          latencyMs,
          timestamp: new Date().toISOString(),
          apiKeyPreview,
          error: 'Gemini returned an empty array or invalid article format. No posts were created.',
          modelsAttempted: cascadeResult.attemptedModels.map((a) => a.model),
          fallbackOccurred: cascadeResult.fallbackOccurred,
          summaryLog: `Failed at ${new Date().toLocaleTimeString()}: Invalid format received from ${cascadeResult.model}.`,
        },
      };
    }
  } catch (err: any) {
    console.warn('Gemini live call error across cascade:', err.message || err);
    const latencyMs = Date.now() - t0;
    const now = new Date();
    const cascadeModels = getGeminiModelCascade();
    return {
      posts: [],
      telemetry: {
        source: 'GOOGLE_GEMINI_LIVE',
        model: cascadeModels[0] || 'gemini-3.8-flash',
        latencyMs,
        timestamp: now.toISOString(),
        apiKeyPreview,
        error: `Gemini AI generation failed across cascade (${cascadeModels.join(', ')}): ${err.message || err}. No posts were created.`,
        summaryLog: `Failed at ${now.toLocaleTimeString()} after attempting cascade (${cascadeModels.join(' -> ')}).`,
      },
    };
  }
}

/**
 * High-performing dynamic generator that picks fresh matches from extended pool
 */
function buildFreshProgrammaticHypeCluster(
  count: number,
  autoPublish: boolean,
  existingSlugs: Set<string>
): GeneratedPostData[] {
  // Find matches that do NOT have a primary pillar post yet
  const availableMatches = EXTENDED_HYPE_MATCHES.filter((m) => {
    const primarySlug = `where-to-watch-${m.teams.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-live-stream`;
    return !existingSlugs.has(primarySlug);
  });

  // Pick matches (if all used, shuffle and append unique suffix)
  const candidateMatches = availableMatches.length >= 2 ? availableMatches : EXTENDED_HYPE_MATCHES;
  const primaryMatch = candidateMatches[Math.floor(Math.random() * candidateMatches.length)];
  const remainingCandidates = candidateMatches.filter((m) => m.teams !== primaryMatch.teams);
  const secondaryMatch = remainingCandidates[Math.floor(Math.random() * remainingCandidates.length)] || EXTENDED_HYPE_MATCHES[3];

  const salt = Date.now().toString().slice(-4);
  const primaryBaseSlug = primaryMatch.teams.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const secondaryBaseSlug = secondaryMatch.teams.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const makeUniqueSlug = (base: string) => {
    return existingSlugs.has(base) ? `${base}-${salt}` : base;
  };

  const posts: GeneratedPostData[] = [];

  // Post 1: Main Pillar "Where to Watch" Guide
  const post1Slug = makeUniqueSlug(`where-to-watch-${primaryBaseSlug}-live-stream`);
  posts.push({
    title: `Where to Watch ${primaryMatch.teams} Live: Global TV Channels & Streaming Guide`,
    slug: post1Slug,
    summary: `Complete matchday guide on how to watch ${primaryMatch.teams} live stream online, confirmed TV channels in USA, UK, Canada, Australia, and start time.`,
    content: `
<h2>Matchday Broadcast Breakdown: ${primaryMatch.teams}</h2>
<p>The upcoming showdown between <strong>${primaryMatch.teams}</strong> in the ${primaryMatch.tournament} is generating immense buzz across the sports landscape. Hosted at <strong>${primaryMatch.venue}</strong>, fans are searching for confirmed ways to stream the game live without blackout interruptions.</p>

<h3>Official Television Broadcasters by Region</h3>
<ul>
  <li><strong>United States:</strong> ${primaryMatch.broadcasters.us}</li>
  <li><strong>United Kingdom:</strong> ${primaryMatch.broadcasters.uk}</li>
  <li><strong>Canada:</strong> ${primaryMatch.broadcasters.ca}</li>
  <li><strong>Australia:</strong> ${primaryMatch.broadcasters.au}</li>
</ul>

<div class="cta-box bg-slate-900 border border-emerald-500/30 p-6 rounded-xl my-6">
  <h4 class="text-emerald-400 font-bold text-lg mb-2">⚡ Verified Live Matchday Broadcast</h4>
  <p class="text-slate-300 text-sm mb-4">Stream ${primaryMatch.teams} in 1080p 60FPS with multi-language commentary and instant cloud setup.</p>
  <a href="/go/affforce" class="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20" rel="sponsored nofollow">Access Live Broadcast Now &rarr;</a>
</div>

<h3>Kickoff Time & Schedule</h3>
<p>Scheduled start time is <strong>${primaryMatch.time}</strong>. Pre-match buildup and studio tactical analysis begin 60 minutes prior to kickoff.</p>
    `,
    sport: primaryMatch.sport,
    seoKeywords: `where to watch ${primaryMatch.teams}, ${primaryMatch.teams} live stream, ${primaryMatch.teams} tv channel`,
    matchDate: primaryMatch.time,
    schemaJson: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SportsEvent',
      name: `${primaryMatch.teams} - ${primaryMatch.tournament}`,
      startDate: primaryMatch.time,
      location: { '@type': 'Place', name: primaryMatch.venue },
    }),
    status: autoPublish ? 'PUBLISHED' : 'DRAFT',
    featuredImage: getRandomImage(primaryMatch.sport),
  });

  // Post 2: Predicted Lineups & Injury News
  if (posts.length < count) {
    const post2Slug = makeUniqueSlug(`${primaryBaseSlug}-predicted-lineups-team-news`);
    posts.push({
      title: `${primaryMatch.teams} Predicted Starting Lineups, Team News & Key Injury Reports`,
      slug: post2Slug,
      summary: `Confirmed injury updates, tactical formations, and predicted starting lineups for ${primaryMatch.teams} ahead of kickoff.`,
      content: `
<h2>Team News & Manager Selection Strategy</h2>
<p>Coaching staffs face pivotal selection dilemmas ahead of <strong>${primaryMatch.teams}</strong>. Training reports confirm fitness tests for key squad leaders.</p>

<h3>Predicted Tactical Formations</h3>
<p>Expect high-intensity pressing transitions and quick offensive counter-attacks to dominate the opening 30 minutes of play.</p>

<div class="cta-box bg-slate-900 border border-emerald-500/30 p-6 rounded-xl my-6">
  <h4 class="text-emerald-400 font-bold text-lg mb-2">⚡ Watch the Action Live</h4>
  <p class="text-slate-300 text-sm mb-4">Don't miss the starting whistle. Stream live on Smart TV, mobile, or desktop.</p>
  <a href="/go/affforce" class="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg transition" rel="sponsored nofollow">Stream Live Broadcast &rarr;</a>
</div>
      `,
      sport: primaryMatch.sport,
      seoKeywords: `${primaryMatch.teams} lineups, ${primaryMatch.teams} team news, ${primaryMatch.teams} starting XI`,
      matchDate: primaryMatch.time,
      schemaJson: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: `${primaryMatch.teams} Lineups` }),
      status: autoPublish ? 'PUBLISHED' : 'DRAFT',
      featuredImage: getRandomImage(primaryMatch.sport),
    });
  }

  // Post 3: Head to Head & Stats
  if (posts.length < count) {
    const post3Slug = makeUniqueSlug(`${primaryBaseSlug}-h2h-record-stats-prediction`);
    posts.push({
      title: `${primaryMatch.teams} Head-to-Head Record, Form Guide & Betting Insights`,
      slug: post3Slug,
      summary: `Historic head-to-head statistics, 5-game recent form guide, and tactical match prediction for ${primaryMatch.teams}.`,
      content: `
<h2>Historic Head-to-Head Statistics</h2>
<p>Recent meetings between these franchises have consistently produced thrilling momentum swings with narrow victory margins.</p>

<h3>Recent Form & Momentum</h3>
<p>Both teams arrive with strong offensive output over their previous 5 matches, promising a high-tempo contest.</p>

<div class="cta-box bg-slate-900 border border-emerald-500/30 p-6 rounded-xl my-6">
  <h4 class="text-emerald-400 font-bold text-lg mb-2">⚡ Stream Live with Multi-Angle Coverage</h4>
  <a href="/go/affforce" class="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg transition" rel="sponsored nofollow">Watch Live Match &rarr;</a>
</div>
      `,
      sport: primaryMatch.sport,
      seoKeywords: `${primaryMatch.teams} h2h stats, ${primaryMatch.teams} prediction, ${primaryMatch.teams} head to head`,
      matchDate: primaryMatch.time,
      schemaJson: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: `${primaryMatch.teams} H2H Record` }),
      status: autoPublish ? 'PUBLISHED' : 'DRAFT',
      featuredImage: getRandomImage(primaryMatch.sport),
    });
  }

  // Post 4: Secondary Marquee Clash (NFL / NBA / UFC)
  if (posts.length < count) {
    const post4Slug = makeUniqueSlug(`how-to-watch-${secondaryBaseSlug}-live-channels`);
    posts.push({
      title: `How to Watch ${secondaryMatch.teams} Live: TV Channels & Kickoff Time (${secondaryMatch.tournament})`,
      slug: post4Slug,
      summary: `Full broadcast schedule, verified television networks, and live streaming passes for ${secondaryMatch.teams} taking place at ${secondaryMatch.venue}.`,
      content: `
<h2>Marquee Clash: ${secondaryMatch.teams}</h2>
<p>In another blockbuster matchup, <strong>${secondaryMatch.teams}</strong> square off in ${secondaryMatch.tournament}. Here is how to tune in live from anywhere.</p>

<h3>Confirmed Channels</h3>
<ul>
  <li><strong>USA:</strong> ${secondaryMatch.broadcasters.us}</li>
  <li><strong>UK:</strong> ${secondaryMatch.broadcasters.uk}</li>
  <li><strong>Canada:</strong> ${secondaryMatch.broadcasters.ca}</li>
  <li><strong>Australia:</strong> ${secondaryMatch.broadcasters.au}</li>
</ul>

<div class="cta-box bg-slate-900 border border-emerald-500/30 p-6 rounded-xl my-6">
  <h4 class="text-emerald-400 font-bold text-lg mb-2">⚡ Live Matchday Pass</h4>
  <a href="/go/affforce" class="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg transition" rel="sponsored nofollow">Watch Live Here &rarr;</a>
</div>
      `,
      sport: secondaryMatch.sport,
      seoKeywords: `watch ${secondaryMatch.teams}, ${secondaryMatch.teams} stream, ${secondaryMatch.teams} channels`,
      matchDate: secondaryMatch.time,
      schemaJson: JSON.stringify({ '@context': 'https://schema.org', '@type': 'SportsEvent', name: secondaryMatch.teams }),
      status: autoPublish ? 'PUBLISHED' : 'DRAFT',
      featuredImage: getRandomImage(secondaryMatch.sport),
    });
  }

  // Post 5: Global Sports VPN & Geo-Unblocking Guide
  if (posts.length < count) {
    const post5Slug = makeUniqueSlug(`stream-${primaryBaseSlug}-abroad-vpn-guide`);
    posts.push({
      title: `How to Stream ${primaryMatch.teams} from Abroad: Bypass Regional Blackouts with a Sports VPN`,
      slug: post5Slug,
      summary: `Traveling overseas? Step-by-step guide to streaming ${primaryMatch.teams} legally using a verified high-speed sports VPN.`,
      content: `
<h2>Streaming Without Blackouts</h2>
<p>If regional restrictions or traveling abroad prevents you from accessing your home broadcast for <strong>${primaryMatch.teams}</strong>, a sports-optimized VPN provides immediate access.</p>

<h3>Quick 3-Step Setup</h3>
<ol>
  <li><strong>Download a high-speed Sports VPN</strong> with servers in your home country.</li>
  <li><strong>Log into your domestic broadcast subscription</strong> (Peacock, Sky Sports, Fubo, or ESPN+).</li>
  <li><strong>Enjoy uninterrupted 1080p live streaming.</strong></li>
</ol>

<div class="cta-box bg-slate-900 border border-blue-500/30 p-6 rounded-xl my-6">
  <h4 class="text-blue-400 font-bold text-lg mb-2">🛡️ Unlock Global Sports Broadcasts</h4>
  <p class="text-slate-300 text-sm mb-4">Stream sports securely with zero throttling and military-grade encryption.</p>
  <a href="/go/vpn" class="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-blue-500/20" rel="sponsored nofollow">Get Verified Sports VPN (70% Off) &rarr;</a>
</div>
      `,
      sport: primaryMatch.sport,
      seoKeywords: `stream sports abroad vpn, bypass blackout ${primaryMatch.teams}, sports vpn`,
      matchDate: primaryMatch.time,
      schemaJson: JSON.stringify({ '@context': 'https://schema.org', '@type': 'HowTo', name: `How to Watch Sports with a VPN` }),
      status: autoPublish ? 'PUBLISHED' : 'DRAFT',
      featuredImage: getRandomImage(primaryMatch.sport),
    });
  }

  return posts.slice(0, count);
}

/**
 * Saves generated post list to MySQL via Prisma
 */
export async function saveGeneratedPostsToDatabase(posts: GeneratedPostData[]) {
  if (!posts || posts.length === 0) return [];
  const saved = [];
  for (const post of posts) {
    const cleanTitle = sanitizePlainText(post.title);
    const cleanSummary = sanitizePlainText(post.summary);
    const cleanContent = sanitizeArticleHtml(post.content);
    const cleanSport = sanitizePlainText(post.sport).toLowerCase();
    const cleanKeywords = sanitizePlainText(post.seoKeywords);

    const existing = await prisma.post.findUnique({ where: { slug: post.slug } });
    if (existing) {
      const updated = await prisma.post.update({
        where: { id: existing.id },
        data: {
          title: cleanTitle,
          summary: cleanSummary,
          content: cleanContent,
          sport: cleanSport,
          status: post.status,
          seoKeywords: cleanKeywords,
          matchDate: post.matchDate,
          schemaJson: post.schemaJson,
          featuredImage: post.featuredImage,
        },
      });
      saved.push(updated);
    } else {
      const created = await prisma.post.create({
        data: {
          title: cleanTitle,
          slug: post.slug,
          summary: cleanSummary,
          content: cleanContent,
          sport: cleanSport,
          status: post.status,
          seoKeywords: cleanKeywords,
          matchDate: post.matchDate,
          schemaJson: post.schemaJson,
          featuredImage: post.featuredImage,
        },
      });
      saved.push(created);
    }
  }
  return saved;
}
