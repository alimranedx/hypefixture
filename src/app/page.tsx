import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { HYPE_MATCH_POOL } from '@/lib/gemini';
import MatchCard from '@/components/MatchCard';
import StreamCtaCard from '@/components/StreamCtaCard';
import LiveMatchesSection from '@/components/LiveMatchesSection';
import JsonLd from '@/components/JsonLd';
import { Flame, Tv, ArrowRight, ShieldCheck, Zap, Radio } from 'lucide-react';

import { getActiveSports } from '@/lib/sports';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch dynamic active sports and latest published posts concurrently
  const [activeSports, latestPosts] = await Promise.all([
    getActiveSports(),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
  ]);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HypeFixture',
    url: 'https://hypefixture.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://hypefixture.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="space-y-16 pb-16">
      <JsonLd data={websiteSchema} />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950 pt-16 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950/0 to-slate-950 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Flame className="w-4 h-4 text-emerald-400 animate-bounce" />
            Daily AI-Curated Sports Broadcast Guides
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Find Where To Watch <span className="text-emerald-400">Live Sports</span> Today
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Never miss kickoff. Real-time TV channels, official live streaming options, and predicted lineups across
            global sports.
          </p>

          {/* Quick Sport Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
            <Link
              href="/live"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white text-sm font-black transition flex items-center gap-2 shadow-lg shadow-red-900/40 hover:scale-105 active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              🔴 Live Matches Now
            </Link>

            {/* Dynamically Rendered Active Sports from Database */}
            {activeSports.map((sport) => (
              <Link
                key={sport.id}
                href={`/${sport.slug}`}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 hover:text-white text-sm font-bold transition flex items-center gap-2 shadow-lg hover:-translate-y-0.5 active:scale-95"
              >
                <span>{sport.icon || '🏆'}</span>
                <span>{sport.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live Match Center Section */}
      <LiveMatchesSection
        initialSport="all"
        dynamicSports={activeSports}
        title="Live Matches In-Play Now"
        subtitle="Watch Football, Cricket, NFL, and Rugby games currently running with real-time present scores, live situation updates, and stream links."
      />

      {/* Featured High-Hype Matches Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              Real-Time Matchday Hub
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Today's High-Hype Fixtures
            </h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:block">
            Updated continuously by AI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HYPE_MATCH_POOL.map((match) => {
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

      {/* Streaming Banner Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StreamCtaCard matchTitle="Premier League, NFL, NBA & UFC Live Streams" />
      </section>

      {/* Latest AI-Generated Articles & SEO Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Published Content
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Latest Match Previews & Streaming Guides
            </h2>
          </div>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition flex flex-col justify-between group shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-bold uppercase border border-slate-700">
                      {post.sport}
                    </span>
                    <span className="text-slate-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link href={`/post/${post.slug}`} className="block group-hover:text-emerald-400 transition">
                    <h3 className="text-lg font-bold text-white leading-snug line-clamp-2">
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
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                  >
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/go/affforce"
                    target="_blank"
                    rel="sponsored nofollow"
                    className="text-[11px] font-semibold text-slate-400 hover:text-white transition"
                  >
                    Watch Stream &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <Tv className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Daily AI Posts Ready to Generate</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              No articles are currently published. Go to the Admin Panel to trigger today's automated 5-post Gemini cluster!
            </p>
            <Link
              href="/admin"
              className="inline-block px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20"
            >
              Open Admin AI Generator
            </Link>
          </div>
        )}
      </section>

      {/* SEO FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <h3 className="font-bold text-white text-base">How do I watch live sports streams legally?</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Live sports are broadcast legally through authorized networks such as Peacock, Sky Sports, ESPN+, Fubo,
              and TNT Sports. Our broadcast directory lists verified legal channels for your country so you can stream
              high-definition matches without pirated link risks.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <h3 className="font-bold text-white text-base">What if a match is blacked out in my region?</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              If you are traveling abroad or restricted by local TV blackouts, using a verified sports VPN allows you
              to securely connect to your official home broadcaster account.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <h3 className="font-bold text-white text-base">How often are match schedules updated?</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our AI automation checks schedules and odds continuously throughout the day to ensure kickoff times,
              confirmed channels, and injury news are completely up to date.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
