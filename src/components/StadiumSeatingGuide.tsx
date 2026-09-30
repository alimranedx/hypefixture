'use client';

import React from 'react';
import { StadiumSeatingTier } from '@/lib/tickets';
import { MapPin, Users, Compass, Eye, ShieldCheck, Info } from 'lucide-react';

interface StadiumSeatingGuideProps {
  venueName: string;
  city: string;
  country: string;
  capacity: number;
  address: string;
  currency: string;
  seatingTiers: StadiumSeatingTier[];
}

export default function StadiumSeatingGuide({
  venueName,
  city,
  country,
  capacity,
  address,
  currency,
  seatingTiers,
}: StadiumSeatingGuideProps) {
  const currencySymbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            Stadium & Seating Blueprint
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {venueName} Seating Guide
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official stadium capacity, viewing angles, and category recommendations.
          </p>
        </div>

        {/* Stadium quick stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Capacity</div>
              <div className="text-xs font-black text-white">{capacity.toLocaleString()} seats</div>
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Location</div>
              <div className="text-xs font-black text-white">{city}, {country}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Address banner */}
      <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="truncate"><strong>Venue Address:</strong> {address}</span>
      </div>

      {/* Seating Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {seatingTiers.map((tier) => (
          <div
            key={tier.id}
            className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-bold text-white tracking-tight">{tier.name}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-emerald-400 border border-slate-700">
                  {tier.viewQuality}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{tier.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Best for: <strong className="text-white">{tier.recommendedFor}</strong></span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] block">Starting from</span>
                <span className="text-sm font-black text-emerald-400">{currencySymbol}{tier.priceFrom}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Matchday Entry Advice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Matchday Entry Advice:</strong> Stadium turnstiles typically open 90 to 120 minutes prior to kickoff. Have your digital mobile ticket ready in Apple Wallet or Google Wallet before arriving at the stadium gates to avoid cellular network congestion around turnstiles.
        </div>
      </div>
    </div>
  );
}
