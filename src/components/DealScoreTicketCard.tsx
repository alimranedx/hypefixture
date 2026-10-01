'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import {
  Calendar,
  MapPin,
  Ticket,
  Flame,
  Star,
  ShieldCheck,
  ArrowRight,
  Bookmark,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { TicketMatchEvent } from '@/lib/tickets';

interface DealScoreTicketCardProps {
  event: TicketMatchEvent;
  isBookmarked?: boolean;
}

export default function DealScoreTicketCard({ event, isBookmarked = false }: DealScoreTicketCardProps) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(isBookmarked);
  const [saving, setSaving] = useState(false);

  // Compute SeatGeek-style Deal Score algorithm (scale 8.8 - 9.9)
  const computeDealScore = () => {
    const spread = event.maxPrice - event.minPrice;
    if (spread > 300) return { score: '9.8', label: 'Amazing Deal', color: 'emerald' };
    if (spread > 150) return { score: '9.4', label: 'Great Value', color: 'teal' };
    return { score: '8.9', label: 'Good Deal', color: 'amber' };
  };

  const deal = computeDealScore();

  // Currency symbols & conversion approximation for European audience
  const currencySymbol = event.currency === 'GBP' ? '£' : event.currency === 'EUR' ? '€' : '$';
  const alternatePrice =
    event.currency === 'GBP'
      ? `€${Math.round(event.minPrice * 1.18)}`
      : `£${Math.round(event.minPrice * 0.85)}`;

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      signIn('google');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/user/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchSlug: event.slug,
          sport: event.sport,
          title: event.title,
          matchTime: event.matchDate,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaved(data.bookmarked);
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Extract date abbreviation (e.g., "OCT 24")
  const parseDateBadge = () => {
    try {
      const d = new Date(event.kickoffUtc);
      const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const day = d.getDate();
      return { month, day };
    } catch {
      return { month: 'MATCH', day: 'DAY' };
    }
  };

  const dateBadge = parseDateBadge();

  return (
    <div className="group rounded-3xl border border-slate-800 bg-slate-900/95 overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/20 transition-all duration-300 flex flex-col justify-between">
      {/* Visual Header / Cover with Deal Score & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${event.featuredImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-black/40" />

        {/* Top Floating Row: Deal Score & Bookmark */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {/* SeatGeek-style Deal Score pill */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-lg backdrop-blur-md border ${
              deal.color === 'emerald'
                ? 'bg-emerald-500/90 text-slate-950 border-emerald-400 shadow-emerald-500/30'
                : deal.color === 'teal'
                ? 'bg-teal-500/90 text-slate-950 border-teal-400 shadow-teal-500/30'
                : 'bg-amber-500/90 text-slate-950 border-amber-400 shadow-amber-500/30'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{deal.score}</span>
            <span className="opacity-90 font-bold">• {deal.label}</span>
          </div>

          {/* Quick Bookmark Toggle */}
          <button
            onClick={toggleBookmark}
            disabled={saving}
            title={saved ? 'Saved in my favorites' : 'Save this match'}
            className={`p-2 rounded-xl backdrop-blur-md transition-all duration-200 border ${
              saved
                ? 'bg-emerald-500/30 text-emerald-400 border-emerald-500/60 shadow-lg'
                : 'bg-slate-950/70 text-slate-300 border-slate-700/60 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-emerald-400' : ''}`} />
          </button>
        </div>

        {/* Date Calendar Badge & Tournament */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-950/90 border border-slate-700/80 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider leading-none">
                {dateBadge.month}
              </span>
              <span className="text-base font-black text-white leading-tight">
                {dateBadge.day}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                {event.sport}
              </span>
              <span className="text-xs font-bold text-white drop-shadow-md">
                {event.tournament}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-bold text-slate-300">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{event.availableTickets} left</span>
          </div>
        </div>
      </div>

      {/* Match Details & Teams */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <Link href={`/match/${event.slug}`} className="block group-hover:text-emerald-400 transition">
            <h3 className="text-lg sm:text-xl font-black text-white leading-snug tracking-tight line-clamp-2">
              {event.title}
            </h3>
          </Link>

          {/* Stadium & City */}
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="font-semibold text-slate-200 truncate">
                {event.venueName}, {event.city}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{event.matchDate}</span>
            </div>
          </div>

          {/* Marketplace Badges Preview */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% FanProtect Guarantee
            </span>
            <span className="text-slate-500 font-semibold">4 Marketplaces</span>
          </div>
        </div>

        {/* Pricing & Comparison CTA */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
              Tickets From
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400">
                {currencySymbol}{event.minPrice}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                ({alternatePrice})
              </span>
            </div>
          </div>

          <Link
            href={`/match/${event.slug}#ticket-comparison`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95"
          >
            <span>Compare</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
