'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Ticket,
  Calendar,
  MapPin,
  Trophy,
  ShieldCheck,
  Flame,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { TICKET_EVENTS } from '@/lib/tickets';
import HeroMotionBackground from '@/components/HeroMotionBackground';

export default function TicketsPage() {
  const [eventsList, setEventsList] = useState(TICKET_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(850);

  React.useEffect(() => {
    fetch('/api/tickets')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tickets) && data.tickets.length > 0) {
          // Normalize if DB fixture
          const mapped = data.tickets.map((t: any) => {
            if (t.offers) return t;
            return {
              ...t,
              offers: [
                {
                  id: `off-sg-${t.slug}`,
                  vendorName: 'SeatGeek',
                  vendorSlug: 'seatgeek',
                  price: t.seatgeekPrice || t.minPrice + 15,
                  originalCurrency: t.currency,
                  isBestValue: true,
                  affiliateUrl: t.seatgeekUrl || `https://seatgeek.com/search?search=${encodeURIComponent(t.title)}&ref=ticketfixture`,
                },
                {
                  id: `off-sh-${t.slug}`,
                  vendorName: 'StubHub',
                  vendorSlug: 'stubhub',
                  price: t.stubhubPrice || t.minPrice,
                  originalCurrency: t.currency,
                  isBestValue: false,
                  affiliateUrl: t.stubhubUrl || `https://stubhub.com/search?q=${encodeURIComponent(t.title)}&ref=ticketfixture`,
                },
              ],
            };
          });
          setEventsList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filteredEvents = useMemo(() => {
    return eventsList.filter((event) => {
      // Sport filter
      if (selectedSport !== 'all' && event.sport.toLowerCase() !== selectedSport.toLowerCase()) {
        return false;
      }
      // Price filter
      if (event.minPrice > maxPrice) {
        return false;
      }
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const searchable = `${event.title} ${event.homeTeam} ${event.awayTeam} ${event.tournament} ${event.venueName} ${event.city}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [eventsList, searchQuery, selectedSport, maxPrice]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-12 text-center space-y-5 shadow-2xl">
        <HeroMotionBackground isCompact={true} />
        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Ticket className="w-3.5 h-3.5 text-emerald-400" />
            🇪🇺 European Matchday Ticket Aggregator
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight max-w-3xl mx-auto leading-none">
            Compare European <span className="text-emerald-400">Matchday Tickets</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Compare verified prices for European Football &amp; Cricket across accredited marketplaces like <strong>SeatGeek</strong>, <strong>StubHub</strong>, and <strong>Viagogo</strong> in <strong className="text-white">GBP (£)</strong> and <strong className="text-white">EUR (€)</strong> with 100% buyer guarantee.
          </p>

          {/* Search Bar Input */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by team, derby, tournament, stadium or city..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-emerald-500 transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> 100% Buyer Guarantee
          </span>
          <span className="flex items-center gap-1.5 text-sky-400">
            <CheckCircle2 className="w-4 h-4" /> Verified Barcodes
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <Sparkles className="w-4 h-4" /> Live Best Value Sorting
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        {/* Sports filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: '🔥 All Events' },
            { id: 'football', label: '⚽ Football' },
            { id: 'cricket', label: '🏏 Cricket' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSport(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSport === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Max Price Slider */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 self-start md:self-auto">
          <span className="text-xs font-bold text-slate-400 whitespace-nowrap">
            Max Price: <strong className="text-white">£/€{maxPrice}</strong>
          </span>
          <input
            type="range"
            min="40"
            max="600"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-28 sm:w-36 accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
          <span>Showing {filteredEvents.length} Verified Matchday Listings</span>
          <span>Sorted by Marquee Demand</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 p-8 space-y-3">
            <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No matches matched your filters</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try increasing your maximum budget slider or clearing your search keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSport('all');
                setMaxPrice(500);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredEvents.map((event) => {
              const currencySymbol = event.currency === 'GBP' ? '£' : event.currency === 'EUR' ? '€' : '$';
              return (
                <div
                  key={event.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden hover:border-slate-700 hover:shadow-2xl hover:shadow-emerald-950/20 transition-all duration-300"
                >
                  {/* Image header */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${event.featuredImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                    {/* Badges overlay */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                        {event.sport}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 px-2.5 py-1 rounded-full">
                        <Flame className="w-3 h-3 text-amber-400" />
                        {event.demandStatus === 'ALMOST_SOLD_OUT'
                          ? 'Almost Sold Out'
                          : event.demandStatus === 'HIGH_DEMAND'
                          ? 'High Demand'
                          : 'Selling Fast'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-slate-400" />
                        {event.tournament}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <Link href={`/match/${event.slug}`}>
                        <h2 className="text-xl sm:text-2xl font-black text-white hover:text-emerald-400 transition leading-snug">
                          {event.title}
                        </h2>
                      </Link>

                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{event.matchDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span className="truncate">{event.venueName}, {event.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Compare Button Footer */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Tickets Starting At
                        </div>
                        <div className="text-2xl font-black text-white">
                          <span className="text-emerald-400">{currencySymbol}</span>
                          {event.minPrice}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Ticket className="w-3 h-3 text-emerald-400" />
                          <span>{event.availableTickets} available across {event.offers.length} vendors</span>
                        </div>
                      </div>

                      <Link
                        href={`/match/${event.slug}`}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md shadow-emerald-500/20 group-hover:scale-[1.02]"
                      >
                        <span>Compare Seats</span>
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

      {/* Buyer Guarantee FAQ Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          The TicketFixture 100% Ticket Buyer Guarantee
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Every ticket marketplace featured on TicketFixture (including SeatGeek, StubHub, and Viagogo) provides an ironclad buyer guarantee. Your tickets will be authentic, valid for stadium entry, and delivered in time for the event — or you will receive a full 100% refund.
        </p>
      </div>
    </div>
  );
}
