'use client';

import React, { useState } from 'react';
import { TicketVendorOffer } from '@/lib/tickets';
import { ShieldCheck, Zap, Star, ExternalLink, Filter, CheckCircle2, AlertCircle } from 'lucide-react';

interface TicketComparisonEngineProps {
  offers: TicketVendorOffer[];
  matchTitle: string;
  currency: string;
}

export default function TicketComparisonEngine({
  offers,
  matchTitle,
  currency,
}: TicketComparisonEngineProps) {
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'PRICE_ASC' | 'BEST_VALUE' | 'RATING'>('BEST_VALUE');

  // Filter offers by seating tier category
  const filteredOffers = offers.filter((offer) => {
    if (selectedTier === 'ALL') return true;
    return offer.tierCategory === selectedTier;
  });

  // Sort offers
  const sortedOffers = [...filteredOffers].sort((a, b) => {
    if (sortBy === 'PRICE_ASC') return a.price - b.price;
    if (sortBy === 'RATING') return b.rating - a.rating;
    // Default BEST_VALUE
    if (a.isBestValue && !b.isBestValue) return -1;
    if (!a.isBestValue && b.isBestValue) return 1;
    return a.price - b.price;
  });

  const currencySymbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verified Ticket Exchanges
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Compare Verified Ticket Prices
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time ticket listings from accredited secondary marketplaces with 100% money-back buyer guarantees.
          </p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold px-2">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-2"
          >
            <option value="BEST_VALUE" className="bg-slate-900 text-white">⭐ Best Value</option>
            <option value="PRICE_ASC" className="bg-slate-900 text-white">💰 Lowest Price</option>
            <option value="RATING" className="bg-slate-900 text-white">🏆 Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Tier Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-slate-400" /> Seating:
        </span>
        {[
          { id: 'ALL', label: 'All Seats' },
          { id: 'CAT_1', label: 'Cat 1 (Longside / Sideline)' },
          { id: 'CAT_2', label: 'Cat 2 (Upper Tier)' },
          { id: 'CAT_3', label: 'Cat 3 (Behind Goal)' },
          { id: 'VIP', label: 'VIP Club & Hospitality' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTier(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTier === tab.id
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comparison List */}
      <div className="space-y-3 pt-2">
        {sortedOffers.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-slate-800 text-slate-400 text-sm">
            No listings currently available in this seating tier. Try switching to <strong>All Seats</strong>.
          </div>
        ) : (
          sortedOffers.map((offer) => (
            <div
              key={offer.id}
              className={`group relative flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                offer.isBestValue
                  ? 'bg-gradient-to-r from-emerald-950/30 via-slate-950/80 to-slate-950/80 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              {/* Best Value Badge */}
              {offer.isBestValue && (
                <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                  ★ Best Value Choice
                </div>
              )}

              {/* Vendor & Seating info */}
              <div className="space-y-1.5 flex-1 pr-4">
                <div className="flex items-center gap-3">
                  <span className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition">
                    {offer.vendorName}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{offer.rating.toFixed(1)}</span>
                    <span className="text-slate-500 text-[11px] font-normal">
                      ({offer.reviewCount.toLocaleString()})
                    </span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm font-semibold text-slate-200">
                  {offer.seatingTier}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {offer.guaranteeBadge}
                  </span>
                  {offer.instantDownload && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-sky-400 font-medium bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                      <Zap className="w-2.5 h-2.5 text-sky-400" /> Instant Mobile E-Ticket
                    </span>
                  )}
                </div>
              </div>

              {/* Price & CTA Button */}
              <div className="flex items-center justify-between md:justify-end gap-5 mt-4 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                <div className="text-left md:text-right">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    From Price
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    <span className="text-emerald-400">{currencySymbol}</span>
                    {offer.price}
                  </div>
                </div>

                <a
                  href={offer.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className={`inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-md ${
                    offer.isBestValue
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 hover:scale-[1.02]'
                      : 'bg-slate-800 hover:bg-slate-700 text-white hover:text-emerald-400'
                  }`}
                >
                  <span>View Tickets</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Trust & Transparency Note */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong>HypeFixture Fan Guarantee:</strong> All partner exchanges are monitored for pricing accuracy, legitimate barcodes, and 100% refund compliance. Prices may be above or below face value based on matchday demand. We may earn a partner referral fee when tickets are purchased through our comparison links at zero additional cost to you.
        </p>
      </div>
    </div>
  );
}
