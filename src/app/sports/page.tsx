import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getDynamicTicketEvents } from '@/lib/tickets';
import { Trophy, ArrowRight, Ticket, Flame, Calendar } from 'lucide-react';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Browse Sports & Upcoming Matchday Events | TicketFixture',
  description:
    'Explore verified matchday tickets across Football, Cricket, Basketball, Tennis, Formula 1, and Boxing. Compare ticket prices across top secondary marketplaces.',
};

export const revalidate = 60;

export default async function SportsIndexPage() {
  const [sports, allEvents] = await Promise.all([
    prisma.sportCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    getDynamicTicketEvents(),
  ]);

  const sportsWithCounts = sports.map((s) => {
    const eventsForSport = allEvents.filter((e) => e.sport.toLowerCase() === s.slug.toLowerCase());
    return {
      ...s,
      eventCount: eventsForSport.length,
      lowestPrice: eventsForSport.length > 0 ? Math.min(...eventsForSport.map((e) => e.minPrice)) : 0,
      currency: eventsForSport[0]?.currency || 'GBP',
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 text-emerald-400" />
          Sports Ticket Marketplace
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Browse by <span className="text-emerald-400">Sport Category</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Select your favorite sport to find verified tickets, compare vendor seating tiers, and get live price alerts across accredited marketplaces.
        </p>
      </div>

      {/* Sports Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sportsWithCounts.map((sport) => {
          const sym = sport.currency === 'GBP' ? '£' : sport.currency === 'EUR' ? '€' : '$';
          return (
            <Link
              key={sport.id}
              href={`/sports/${sport.slug}`}
              className="group p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition duration-300">
                    {sport.icon || '🏆'}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black">
                    {sport.eventCount} {sport.eventCount === 1 ? 'Event' : 'Events'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition">
                    {sport.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {sport.description || 'Major tournaments, derbies, and verified stadium seats.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  {sport.eventCount > 0 ? (
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Tickets From</span>
                      <div className="text-base font-black text-white">
                        {sym}{sport.lowestPrice}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">Upcoming Fixtures Soon</span>
                  )}
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-black text-emerald-400 group-hover:translate-x-1 transition">
                  <span>Explore Sport</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
