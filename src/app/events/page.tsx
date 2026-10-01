'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  SlidersHorizontal,
} from 'lucide-react';
import { TICKET_EVENTS, TicketMatchEvent } from '@/lib/tickets';
import DealScoreTicketCard from '@/components/DealScoreTicketCard';

export default function EventsBrowsePage() {
  const [eventsList, setEventsList] = useState<TicketMatchEvent[]>(TICKET_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(850);
  const [sportsList, setSportsList] = useState<{ id: string; name: string; slug: string; icon: string }[]>([]);

  useEffect(() => {
    // Fetch dynamic events from database
    fetch('/api/tickets')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tickets) && data.tickets.length > 0) {
          setEventsList(data.tickets);
        }
      })
      .catch(() => {});

    // Fetch active sports
    fetch('/api/sports')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.sports)) {
          setSportsList(data.sports);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-12 text-center space-y-5 shadow-2xl">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Ticket className="w-3.5 h-3.5 text-emerald-400" />
          🇪🇺 European Football &amp; Cricket Ticket Aggregator
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight max-w-3xl mx-auto leading-none">
          Compare European Matchday <span className="text-emerald-400">Tickets &amp; Seats</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Compare real-time prices for Premier League, Champions League, La Liga, The Ashes, and Lord&apos;s blockbusters across verified European marketplaces in <strong className="text-white">GBP (£)</strong> and <strong className="text-white">EUR (€)</strong>.
        </p>

        {/* Search Bar Input */}
        <div className="max-w-xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Premier League, The Ashes, Champions League, Lord's, London..."
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-emerald-500 transition shadow-inner"
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
          <button
            onClick={() => setSelectedSport('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
              selectedSport === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            All Sports ({eventsList.length})
          </button>
          {sportsList.map((sport) => {
            const count = eventsList.filter((e) => e.sport.toLowerCase() === sport.slug.toLowerCase()).length;
            return (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                  selectedSport === sport.slug
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>{sport.icon || '🏆'}</span>
                <span>{sport.name}</span>
                {count > 0 && <span className="opacity-60 text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Max Price Slider Filter */}
        <div className="flex items-center gap-3 shrink-0 px-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-bold whitespace-nowrap">Max Price:</span>
          <span className="text-xs font-black text-emerald-400 w-14">£/€{maxPrice}</span>
          <input
            type="range"
            min="50"
            max="1000"
            step="25"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="accent-emerald-500 cursor-pointer w-28 sm:w-36"
          />
        </div>
      </div>

      {/* Events Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
          <span>Showing {filteredEvents.length} Verified Events</span>
          <span>Sorting: Live Best Value First</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
            <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No matchday events match your filters</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your max price slider or clear your search keyword to view all available tickets.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSport('all');
                setMaxPrice(850);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <DealScoreTicketCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
