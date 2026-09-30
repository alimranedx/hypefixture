import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { HYPE_MATCH_POOL } from '@/lib/gemini';
import MatchCard from '@/components/MatchCard';
import StreamCtaCard from '@/components/StreamCtaCard';
import LiveMatchesSection from '@/components/LiveMatchesSection';
import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';
import { SportCategory } from '@/lib/liveScores';

interface SportPageProps {
  params: Promise<{ sport: string }>;
}

const VALID_SPORTS: Record<string, { title: string; desc: string; icon: string }> = {
  football: {
    title: 'Football / Soccer Broadcasts & Live Streams',
    desc: 'Watch Premier League, UEFA Champions League, and La Liga matches. Official TV channels, kickoff times, and streaming access.',
    icon: '⚽',
  },
  cricket: {
    title: 'Cricket Live Scores, Broadcasts & Match Streams',
    desc: 'Live scores, over-by-over updates, and official TV channels for international cricket tours, ICC tournaments, and domestic T20 leagues.',
    icon: '🏏',
  },
  nfl: {
    title: 'NFL Live Streams & Sunday Broadcast Schedule',
    desc: 'Live TV channels and streams for Thursday Night, Sunday Night, and Monday Night Football.',
    icon: '🏈',
  },
  rugby: {
    title: 'Rugby Union & League Live Streams and Fixtures',
    desc: 'Where to watch Six Nations, The Rugby Championship, Premiership, and Super Rugby live.',
    icon: '🏉',
  },
  nba: {
    title: 'NBA Live Games & Broadcast Channels',
    desc: 'Never miss an NBA matchup. Find where to stream NBA games today on ESPN, TNT, and NBA League Pass.',
    icon: '🏀',
  },
  ufc: {
    title: 'UFC PPV & Fight Night Live Streaming Guides',
    desc: 'Official UFC Main Card times, ESPN+ PPV streaming details, and preliminary fight schedules.',
    icon: '🥊',
  },
};

export async function generateMetadata({ params }: SportPageProps): Promise<Metadata> {
  const { sport } = await params;
  const config = VALID_SPORTS[sport.toLowerCase()];
  if (!config) return { title: 'Sport Not Found' };

  return {
    title: `${config.title} - Where to Watch Live`,
    description: config.desc,
  };
}

export default async function SportPage({ params }: SportPageProps) {
  const { sport } = await params;
  const sportKey = sport.toLowerCase();
  const config = VALID_SPORTS[sportKey];

  if (!config) {
    notFound();
  }

  // Filter pool matches for this sport
  const matches = HYPE_MATCH_POOL.filter((m) => m.sport.toLowerCase() === sportKey);

  // Fetch articles for this sport from MySQL
  const posts = await prisma.post.findMany({
    where: {
      sport: sportKey,
      status: 'PUBLISHED',
    },
    orderBy: { createdAt: 'desc' },
    take: 9,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" />
          {sportKey.toUpperCase()} Broadcast Guide
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          {config.icon} {config.title}
        </h1>
        <p className="text-base text-slate-300 max-w-3xl leading-relaxed">
          {config.desc}
        </p>
      </div>

      {/* Live In-Play Match Scorecards */}
      {['football', 'cricket', 'nfl', 'rugby', 'nba'].includes(sportKey) && (
        <LiveMatchesSection
          initialSport={sportKey as SportCategory}
          title={`Live ${config.icon} ${sportKey.toUpperCase()} Scores`}
          subtitle={`Real-time scores and live streaming channels for today's running ${sportKey} matches.`}
        />
      )}

      {/* Sport Marquee Matches */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Upcoming {config.icon} Matchups & Streaming Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => {
            const slug = match.teams.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return (
              <MatchCard
                key={match.teams}
                slug={slug}
                teams={match.teams}
                tournament={match.tournament}
                sport={match.sport}
                venue={match.venue}
                time={match.time}
                broadcasters={match.broadcasters}
              />
            );
          })}
        </div>
      </section>

      {/* Streaming Affiliate Callout */}
      <StreamCtaCard matchTitle={`Every ${sportKey.toUpperCase()} Live Event`} sport={sportKey} />

      {/* Latest Articles */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {sportKey.toUpperCase()} Match Previews & Lineups
        </h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between group shadow-xl"
              >
                <div className="space-y-3">
                  <Link href={`/post/${post.slug}`} className="block group-hover:text-emerald-400 transition">
                    <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    href={`/post/${post.slug}`}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/go/affforce"
                    target="_blank"
                    rel="sponsored nofollow"
                    className="text-[11px] font-semibold text-slate-400 hover:text-white"
                  >
                    Stream &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No published articles for this sport yet. You can trigger new articles from the Admin Panel.
          </p>
        )}
      </section>
    </div>
  );
}
