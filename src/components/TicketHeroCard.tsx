'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Trophy, ShieldCheck, Ticket, Flame, ArrowDown } from 'lucide-react';

interface TicketHeroCardProps {
  title: string;
  sport: string;
  tournament: string;
  venueName: string;
  city: string;
  country: string;
  kickoffUtc: string;
  matchDate: string;
  minPrice: number;
  currency: string;
  availableTickets: number;
  demandStatus: string;
  featuredImage: string;
}

export default function TicketHeroCard({
  title,
  sport,
  tournament,
  venueName,
  city,
  country,
  kickoffUtc,
  matchDate,
  minPrice,
  currency,
  availableTickets,
  demandStatus,
  featuredImage,
}: TicketHeroCardProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(kickoffUtc).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [kickoffUtc]);

  const currencySymbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-6 sm:p-10 shadow-2xl">
      {/* Background ambient glow & image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url(${featuredImage})` }}
      />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Badges bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
              {sport}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-300 font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              {tournament}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider animate-pulse">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            {demandStatus === 'ALMOST_SOLD_OUT'
              ? 'Almost Sold Out'
              : demandStatus === 'HIGH_DEMAND'
              ? 'High Demand Fixture'
              : 'Selling Fast'}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
          {title}
        </h1>

        {/* Venue & Time Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Date & Time:</strong> {matchDate} ({new Date(kickoffUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Stadium:</strong> {venueName}, {city}</span>
          </div>
        </div>

        {/* Live Countdown & Starting Price Block */}
        <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800">
          {/* Countdown Clock */}
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Kickoff Countdown
            </div>
            <div className="flex items-center gap-3">
              {[
                { label: 'DAYS', value: timeLeft.days },
                { label: 'HOURS', value: timeLeft.hours },
                { label: 'MINS', value: timeLeft.minutes },
                { label: 'SECS', value: timeLeft.seconds },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg sm:text-xl font-black text-white">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 mt-1">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Quick Scroll CTA */}
          <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Verified Tickets From
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                {currencySymbol}{minPrice}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Ticket className="w-3 h-3 text-emerald-400" />
                <span>{availableTickets} tickets remaining</span>
              </div>
            </div>

            <a
              href="#ticket-comparison"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
            >
              <span>Compare Prices</span>
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
