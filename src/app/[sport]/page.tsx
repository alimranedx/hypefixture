import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { HYPE_MATCH_POOL } from '@/lib/gemini';
import MatchCard from '@/components/MatchCard';
import LiveMatchesSection from '@/components/LiveMatchesSection';
import Link from 'next/link';
import { ArrowRight, Trophy, Ticket } from 'lucide-react';
import { SportCategory } from '@/lib/liveScores';

import { getSportBySlug, getActiveSports } from '@/lib/sports';

interface SportPageProps {
  params: Promise<{ sport: string }>;
}

export async function generateStaticParams() {
  const sports = await getActiveSports();
  return sports.map((s) => ({ sport: s.slug }));
}

export async function generateMetadata({ params }: SportPageProps): Promise<Metadata> {
  const { sport } = await params;
  const sportData = await getSportBySlug(sport);
  if (!sportData) return { title: 'Sport Not Found | HypeFixture' };

  return {
    title: `${sportData.icon || '🏆'} ${sportData.name} Broadcasts & Live Streams | Where to Watch`,
    description: sportData.description || `Watch live ${sportData.name} matches today. Verified TV channels, kickoff times, and legal streaming access.`,
  };
}

export default async function SportPage({ params }: SportPageProps) {
  const { sport } = await params;
  const sportKey = sport.toLowerCase();
  const sportData = await getSportBySlug(sportKey);

  if (!sportData) {
    notFound();
  }

  const config = {
    name: sportData.name,
    title: `${sportData.name} Broadcasts & Live Streams`,
    desc: sportData.description || `Watch live ${sportData.name} matches today with verified TV channels, official streams, and schedule guides.`,
    icon: sportData.icon || '🏆',
  };

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

      {/* Verified Matchday Tickets Banner for this sport */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Ticket className="w-3.5 h-3.5 text-emerald-400" />
            Verified {config.name} Match Tickets
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">Compare {config.name} Matchday Tickets &amp; Seats</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Compare prices across SeatGeek, StubHub, and Viagogo. Filter by seating tier (Cat 1 Sideline, Behind Goal, VIP Hospitality) with 100% money-back buyer guarantee.
          </p>
        </div>
        <Link
          href="/tickets"
          className="shrink-0 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 hover:scale-105"
        >
          Compare Tickets &rarr;
        </Link>
      </div>

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
