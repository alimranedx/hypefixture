import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { HYPE_MATCH_POOL } from '@/lib/gemini';
import MatchCard from '@/components/MatchCard';
import LiveMatchesSection from '@/components/LiveMatchesSection';
import JsonLd from '@/components/JsonLd';
import { Flame, Tv, ArrowRight, ShieldCheck, Zap, Radio, Ticket, Calendar, MapPin } from 'lucide-react';
import { TICKET_EVENTS } from '@/lib/tickets';

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
            <Ticket className="w-4 h-4 text-emerald-400" />
            Verified Matchday Tickets &amp; Stadium Seating Hub
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Compare Verified Matchday <span className="text-emerald-400">Tickets &amp; Seats</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Never miss kickoff or sold-out derbies. Real-time ticket price comparison across SeatGeek, StubHub &amp; Viagogo with 100% money-back buyer guarantees.
          </p>

          {/* Quick Sport & Ticket Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
            <Link
              href="/tickets"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-sm font-black transition flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95"
            >
              <Ticket className="w-4 h-4" />
              🎟️ Compare Match Tickets
            </Link>

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

      {/* Marquee Matchday Tickets Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Ticket className="w-4 h-4" />
              Verified Ticket Marketplace Hub
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Compare Marquee Matchday Tickets
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live price comparison across SeatGeek, StubHub, and Viagogo. 100% money-back buyer guarantee.
            </p>
          </div>
          <Link
            href="/tickets"
            className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-wider transition"
          >
            <span>View All Matchday Tickets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TICKET_EVENTS.slice(0, 3).map((event) => {
            const currencySymbol = event.currency === 'GBP' ? '£' : event.currency === 'EUR' ? '€' : '$';
            return (
              <div
                key={event.id}
                className="group rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden hover:border-slate-700 hover:shadow-2xl hover:shadow-emerald-950/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${event.featuredImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                      {event.sport}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[11px] font-bold text-slate-300">
                      {event.tournament}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <Link href={`/match/${event.slug}`}>
                      <h3 className="text-lg font-black text-white hover:text-emerald-400 transition leading-snug">
                        {event.title}
                      </h3>
                    </Link>
                    <div className="space-y-1 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{event.matchDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="truncate">{event.venueName}, {event.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">From</div>
                      <div className="text-xl font-black text-emerald-400">
                        {currencySymbol}{event.minPrice}
                      </div>
                    </div>
                    <Link
                      href={`/match/${event.slug}`}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md shadow-emerald-500/20"
                    >
                      <span>Compare</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

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
