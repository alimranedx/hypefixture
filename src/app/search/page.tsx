'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Ticket,
  Calendar,
  MapPin,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    events: any[];
    sports: any[];
    venues: any[];
    total: number;
  }>({
    events: [],
    sports: [],
    venues: [],
    total: 0,
  });

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults({ events: [], sports: [], venues: [], total: 0 });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.success) {
        setResults({
          events: data.events || [],
          sports: data.sports || [],
          venues: data.venues || [],
          total: data.total || 0,
        });
      }
    } catch (err) {
      console.error('Search request failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Search Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-12 text-center space-y-5 shadow-2xl">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Search className="w-3.5 h-3.5 text-emerald-400" />
          🇪🇺 European Event &amp; Ticket Search
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-none">
          Find Tickets for <span className="text-emerald-400">European Matches</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Search Premier League, Champions League, La Liga, The Ashes, and Lord&apos;s tickets across verified European marketplaces in <strong className="text-white">GBP (£)</strong> and <strong className="text-white">EUR (€)</strong>.
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Premier League, The Ashes, Arsenal, Real Madrid, Lord's, London..."
              className="w-full pl-12 pr-28 py-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-emerald-500 transition shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black hover:scale-105 active:scale-95 transition shadow-md shadow-emerald-500/20"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400 mt-3 font-semibold">Searching matches and ticket marketplaces...</p>
        </div>
      )}

      {/* Results View */}
      {!loading && query && (
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-black text-white">
              Search Results for <span className="text-emerald-400">&ldquo;{query}&rdquo;</span>
            </h2>
            <span className="text-xs text-slate-400 font-semibold">{results.total} results found</span>
          </div>

          {results.total === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No matches found for &ldquo;{query}&rdquo;</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try searching for broad terms like &ldquo;Football&rdquo;, &ldquo;Arsenal&rdquo;, &ldquo;Cricket&rdquo;, or &ldquo;London&rdquo;.
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black transition"
              >
                Browse All Upcoming Events →
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Matching Sports */}
              {results.sports.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-emerald-400" /> Matching Sports Categories
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {results.sports.map((sport) => (
                      <Link
                        key={sport.id}
                        href={`/sports/${sport.slug}`}
                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition group flex items-center gap-3"
                      >
                        <span className="text-2xl">{sport.icon || '🏆'}</span>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                            {sport.name}
                          </div>
                          <div className="text-[10px] text-slate-500">View Events →</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Events */}
              {results.events.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-emerald-400" /> Upcoming Matchday Events ({results.events.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.events.map((event) => {
                      const currencySymbol = event.currency === 'GBP' ? '£' : event.currency === 'EUR' ? '€' : '$';
                      return (
                        <div
                          key={event.id}
                          className="rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden hover:border-slate-700 hover:shadow-2xl transition flex flex-col justify-between"
                        >
                          <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url(${event.featuredImage})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                                {event.sport}
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-4 right-4">
                              <span className="text-[11px] font-bold text-slate-300">{event.tournament}</span>
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                              <h4 className="text-base font-black text-white leading-snug hover:text-emerald-400 transition">
                                <Link href={`/events/${event.slug}`}>{event.title}</Link>
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                <span>{event.matchDate}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                <span>{event.venueName}, {event.city}</span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Tickets from</span>
                                <div className="text-lg font-black text-emerald-400">
                                  {currencySymbol}{event.minPrice}
                                </div>
                              </div>
                              <Link
                                href={`/events/${event.slug}`}
                                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5"
                              >
                                <span>Compare Offers</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400 text-sm">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
