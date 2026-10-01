import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getDynamicTicketEvents } from '@/lib/tickets';
import { Trophy, Calendar, MapPin, ArrowRight, Ticket, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import JsonLd from '@/components/JsonLd';

interface SportPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SportPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sport = await prisma.sportCategory.findUnique({
    where: { slug: slug.toLowerCase() },
  });

  const sportName = sport?.name || slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `${sportName} Matchday Tickets & Stadium Seating | TicketFixture`,
    description: `Compare verified ${sportName} tickets across SeatGeek, StubHub, and Viagogo. Find the best seats, lowest resale prices, and 100% money-back buyer guarantees.`,
  };
}

export const revalidate = 60;

export default async function SportDetailPage({ params }: SportPageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();

  const [sport, allEvents] = await Promise.all([
    prisma.sportCategory.findUnique({
      where: { slug: normalizedSlug },
    }),
    getDynamicTicketEvents(),
  ]);

  if (!sport) {
    // If not found in DB categories, check if any events match sport slug
    const matching = allEvents.filter((e) => e.sport.toLowerCase() === normalizedSlug);
    if (matching.length === 0) {
      notFound();
    }
  }

  const sportName = sport?.name || slug.charAt(0).toUpperCase() + slug.slice(1);
  const sportEvents = allEvents.filter((e) => e.sport.toLowerCase() === normalizedSlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Sport Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-12 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span>{sport?.icon || '🏆'}</span>
              <span>Sport Category Hub</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {sportName} <span className="text-emerald-400">Matchday Tickets</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {sport?.description ||
                `Browse upcoming ${sportName} fixtures, compare vendor prices, and secure verified seats with buyer guarantees.`}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-6 shrink-0">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Available Matches</div>
              <div className="text-2xl font-black text-white">{sportEvents.length} Fixtures</div>
            </div>
            <div className="w-[1px] h-10 bg-slate-800" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Buyer Guarantee</div>
              <div className="text-2xl font-black text-emerald-400">100% Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Listing */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-emerald-400" />
            Upcoming {sportName} Matches
          </h2>
          <span className="text-xs text-slate-400 font-bold">{sportEvents.length} Events Listed</span>
        </div>

        {sportEvents.length === 0 ? (
          <div className="text-center py-16 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No upcoming fixtures listed right now</h3>
            <p className="text-xs text-slate-400">Check back soon as new ticket allotments and tournament schedules are released.</p>
            <Link href="/events" className="inline-block mt-2 text-xs font-bold text-emerald-400 hover:underline">
              Browse all other sporting events →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sportEvents.map((event) => {
              const sym = event.currency === 'GBP' ? '£' : event.currency === 'EUR' ? '€' : '$';
              return (
                <div
                  key={event.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden hover:border-slate-700 hover:shadow-2xl transition flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.featuredImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                        {event.tournament}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-white hover:text-emerald-400 transition leading-snug">
                        <Link href={`/events/${event.slug}`}>{event.title}</Link>
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-2.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{event.matchDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{event.venueName}, {event.city}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Seats From</span>
                        <div className="text-xl font-black text-emerald-400">
                          {sym}{event.minPrice}
                        </div>
                      </div>
                      <Link
                        href={`/events/${event.slug}`}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95"
                      >
                        <span>Compare Prices</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
