import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { HYPE_MATCH_POOL } from '@/lib/gemini';
import MatchCard from '@/components/MatchCard';
import LiveMatchesSection from '@/components/LiveMatchesSection';
import JsonLd from '@/components/JsonLd';
import HeroMotionBackground from '@/components/HeroMotionBackground';
import HeroCommandCenter from '@/components/HeroCommandCenter';
import DealScoreTicketCard from '@/components/DealScoreTicketCard';
import EuropeanTrustBanner from '@/components/EuropeanTrustBanner';
import { Flame, Tv, ArrowRight, ShieldCheck, Zap, Radio, Ticket, Calendar, MapPin, Sparkles } from 'lucide-react';
import { getDynamicTicketEvents } from '@/lib/tickets';

import { getActiveSports } from '@/lib/sports';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch dynamic tickets, active sports and latest published posts concurrently
  const [activeSports, latestPosts, ticketEvents] = await Promise.all([
    getActiveSports(),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    getDynamicTicketEvents(),
  ]);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TicketFixture',
    url: 'https://ticketfixture.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ticketfixture.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="space-y-20 pb-20">
      <JsonLd data={websiteSchema} />

      {/* Hero Section: 100% Viewport Height with Motion Background & Command Center */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
        <HeroMotionBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider shadow-inner">
            <Ticket className="w-4 h-4 text-emerald-400" />
            <span>🇪🇺 Europe&apos;s Premier Football &amp; Cricket Ticket Marketplace</span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
              Find Verified European <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">Matchday Tickets</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] font-medium">
              Compare live prices with SeatGeek-style Deal Scores across verified UK &amp; European exchanges in <strong className="text-emerald-400">GBP (£)</strong> and <strong className="text-emerald-400">EUR (€)</strong>.
            </p>
          </div>

          {/* Interactive Floating Command Center */}
          <HeroCommandCenter />
        </div>
      </section>

      {/* Marquee Matchday Tickets Section with SeatGeek-Style Deal Scores */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Verified Deal Score Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Featured European Matchday Tickets
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ranked by deal value and seat sightlines across Premier League, The Ashes, and UEFA Champions League derbies.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-wider transition shadow-lg"
          >
            <span>View All {ticketEvents.length} European Fixtures</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ticketEvents.slice(0, 6).map((event) => (
            <DealScoreTicketCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* European Trust & 100% FanProtect Guarantee Banner */}
      <EuropeanTrustBanner />

      {/* Live Match Center Section */}
      <LiveMatchesSection
        initialSport="all"
        dynamicSports={activeSports}
        title="Live Matches In-Play Now"
        subtitle="Watch European Football, Champions League, The Ashes, and UK Cricket matches currently in-play with real-time scores and verified broadcast links."
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
                    href="/tickets"
                    className="text-[11px] font-semibold text-slate-400 hover:text-white transition"
                  >
                    Match Tickets &rarr;
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
        <h2 className="text-2xl font-bold text-white text-center">Frequently Asked Questions for Ticket Buyers</h2>
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <h3 className="font-bold text-white text-base">How do I buy sold-out Premier League &amp; European Football tickets safely?</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Official club box offices typically sell out tickets to paying club members within minutes. TicketFixture compares prices across verified secondary exchanges like SeatGeek, StubHub, and Viagogo that provide 100% money-back buyer guarantees, ensuring you receive authentic barcodes before kickoff.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <h3 className="font-bold text-white text-base">Can foreign tourists and overseas fans attend matches without a membership?</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Yes! International travelers visiting the UK or Europe can purchase verified resale match tickets and official club hospitality passes directly without holding seasonal club memberships.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <h3 className="font-bold text-white text-base">When will my mobile matchday ticket arrive?</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Most European clubs issue digital NFC / Apple Wallet passes or PDF e-tickets 24 to 48 hours before match kickoff. All partner marketplaces backed on TicketFixture provide instant or expedited digital delivery with 100% buyer protection.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
