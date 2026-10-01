import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  Bookmark,
  Calendar,
  ArrowRight,
  User,
  Tv,
  ShieldCheck,
  Bell,
  Star,
  Flame,
  Ticket,
  Heart,
  TrendingDown,
  Sparkles,
  Zap,
} from 'lucide-react';
import { getDynamicTicketEvents } from '@/lib/tickets';
import DashboardMatchCountdownCard from '@/components/DashboardMatchCountdownCard';
import DealScoreTicketCard from '@/components/DealScoreTicketCard';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== 'USER') {
    redirect('/admin/dashboard');
  }

  const userId = (session.user as any)?.id;

  const [bookmarks, ticketEvents] = await Promise.all([
    userId
      ? prisma.bookmark.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        })
      : [],
    getDynamicTicketEvents(),
  ]);

  // Map ticket events by slug for quick lookup
  const eventMap = new Map();
  ticketEvents.forEach((ev) => {
    eventMap.set(ev.slug, ev);
  });

  const TRACKED_CLUBS = [
    { name: 'Arsenal FC', league: 'Premier League', stadium: 'Emirates Stadium', icon: '🔴', slug: 'arsenal-vs-chelsea' },
    { name: 'Real Madrid', league: 'La Liga / UCL', stadium: 'Santiago Bernabéu', icon: '👑', slug: 'real-madrid-vs-barcelona' },
    { name: 'Manchester City', league: 'Premier League', stadium: 'Etihad Stadium', icon: '⚡', slug: 'man-city-vs-liverpool' },
    { name: 'England Cricket', league: 'The Ashes / ICC', stadium: 'Lord\'s & The Oval', icon: '🏏', slug: 'the-ashes-2nd-test-lords' },
    { name: 'FC Barcelona', league: 'La Liga', stadium: 'Camp Nou', icon: '🔵🔴', slug: 'real-madrid-vs-barcelona' },
    { name: 'FC Bayern München', league: 'Bundesliga / UCL', stadium: 'Allianz Arena', icon: '🛡️', slug: 'bayern-vs-dortmund' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* VIP Matchday Fan Command Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-20 h-20 rounded-full border-2 border-emerald-400 shadow-xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <User className="w-9 h-9" />
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-950 font-black">
                ✓
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {session.user?.name || 'Sports Fan'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-emerald-400" />
                  VIP Member
                </span>
              </div>
              <p className="text-xs text-slate-400">{session.user?.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% European FanProtect Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/favorites"
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Favorites</span>
            </Link>
            <Link
              href="/events"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <Ticket className="w-4 h-4" />
              <span>Find Tickets</span>
            </Link>
          </div>
        </div>

        {/* Live Metrics Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80 text-left">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/70">
            <div className="text-[10px] uppercase font-bold text-slate-400">Saved Fixtures</div>
            <div className="text-2xl font-black text-white mt-0.5">{bookmarks.length}</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/70">
            <div className="text-[10px] uppercase font-bold text-slate-400">Price Drop Alerts</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">Active (2)</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/70">
            <div className="text-[10px] uppercase font-bold text-slate-400">Tracked Derbies</div>
            <div className="text-2xl font-black text-white mt-0.5">6 European</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/70">
            <div className="text-[10px] uppercase font-bold text-slate-400">Preferred Currency</div>
            <div className="text-2xl font-black text-teal-400 mt-0.5">GBP (£) / EUR (€)</div>
          </div>
        </div>
      </div>

      {/* Bookmarked Matches Section with Kickoff Countdown Clocks */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">
              Your Tracked Match Fixtures &amp; Tickets
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {bookmarks.length} matchday{bookmarks.length === 1 ? '' : 's'} monitored
          </span>
        </div>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookmarks.map((bm) => {
              const matchedEvent = eventMap.get(bm.matchSlug);
              return (
                <DashboardMatchCountdownCard
                  key={bm.id}
                  bookmark={bm}
                  eventDetails={matchedEvent || null}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No match fixtures saved yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Save Arsenal vs Chelsea, El Clásico, or The Ashes at Lord&apos;s to monitor live price drops and ticket availability right from your dashboard.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
            >
              <span>Explore European Fixtures</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Follow European Clubs & Derbies Quick Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-black text-white tracking-tight">
              Follow Top European Clubs &amp; Cricket Stadiums
            </h2>
          </div>
          <span className="text-xs text-slate-400">1-Click Ticket Alerts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TRACKED_CLUBS.map((club) => (
            <Link
              key={club.name}
              href={`/match/${club.slug}`}
              className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition-all duration-200 text-center space-y-1.5 group shadow-lg"
            >
              <div className="text-2xl">{club.icon}</div>
              <div className="text-xs font-black text-white group-hover:text-emerald-400 transition truncate">
                {club.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{club.league}</div>
              <div className="text-[10px] font-bold text-emerald-400 pt-1 border-t border-slate-800/80">
                View Fixtures &rarr;
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended European Derbies Carousel with Deal Scores */}
      <div className="space-y-6 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              High Value Picks
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Recommended For You Today
            </h2>
          </div>
          <Link
            href="/events"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>All Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ticketEvents.slice(0, 3).map((event) => (
            <DealScoreTicketCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
