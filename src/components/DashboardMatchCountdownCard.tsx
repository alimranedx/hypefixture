'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Ticket,
  Clock,
  Trash2,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Star,
  ExternalLink,
} from 'lucide-react';

interface DashboardMatchCountdownCardProps {
  bookmark: {
    id: string;
    matchSlug: string;
    sport: string;
    title: string;
    matchTime?: string | null;
  };
  eventDetails?: {
    venueName: string;
    city: string;
    minPrice: number;
    maxPrice: number;
    currency: string;
    availableTickets: number;
    kickoffUtc: string;
    featuredImage: string;
  } | null;
  onRemove?: (slug: string) => void;
}

export default function DashboardMatchCountdownCard({
  bookmark,
  eventDetails,
  onRemove,
}: DashboardMatchCountdownCardProps) {
  const [removing, setRemoving] = useState(false);
  const [removed, setRemoved] = useState(false);

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    if (!eventDetails?.kickoffUtc) return;
    const targetDate = new Date(eventDetails.kickoffUtc).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [eventDetails?.kickoffUtc]);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      const res = await fetch('/api/user/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchSlug: bookmark.matchSlug }),
      });
      if (res.ok) {
        setRemoved(true);
        if (onRemove) onRemove(bookmark.matchSlug);
      }
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    } finally {
      setRemoving(false);
    }
  };

  if (removed) return null;

  const currencySymbol =
    eventDetails?.currency === 'GBP' ? '£' : eventDetails?.currency === 'EUR' ? '€' : '$';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 hover:border-emerald-500/40 transition-all duration-300 shadow-xl group flex flex-col justify-between">
      {/* Top Banner with Background Ambient Cover */}
      <div className="relative h-36 w-full overflow-hidden bg-slate-950">
        {eventDetails?.featuredImage && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${eventDetails.featuredImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-black/50" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
            {bookmark.sport}
          </span>

          <button
            onClick={handleRemove}
            disabled={removing}
            title="Remove from saved"
            className="p-1.5 rounded-lg bg-slate-950/70 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Kickoff Countdown Pill */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-slate-700/80 backdrop-blur-md text-xs font-bold text-white shadow-lg">
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>
              {timeLeft.days > 0
                ? `${timeLeft.days}d ${timeLeft.hours}h until Kickoff`
                : `${timeLeft.hours}h ${timeLeft.minutes}m until Kickoff`}
            </span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black backdrop-blur-md">
            <TrendingDown className="w-3 h-3" />
            <span>Price Track Active</span>
          </div>
        </div>
      </div>

      {/* Fixture Details & Actions */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <Link href={`/match/${bookmark.matchSlug}`} className="block group-hover:text-emerald-400 transition">
            <h3 className="text-lg font-black text-white leading-snug">
              {bookmark.title}
            </h3>
          </Link>

          <div className="space-y-1 text-xs text-slate-300">
            {eventDetails && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">{eventDetails.venueName}, {eventDetails.city}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{bookmark.matchTime || 'Upcoming Matchday'}</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-black">Verified Resale From</div>
            <div className="text-xl font-black text-emerald-400">
              {eventDetails ? `${currencySymbol}${eventDetails.minPrice}` : 'Check Prices'}
            </div>
          </div>

          <Link
            href={`/match/${bookmark.matchSlug}#ticket-comparison`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95"
          >
            <span>Compare Seats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
