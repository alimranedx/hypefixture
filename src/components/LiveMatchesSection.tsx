'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Flame,
  Tv,
  RefreshCw,
  Search,
  Radio,
  ExternalLink,
  ChevronRight,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  Play,
  Volume2,
} from 'lucide-react';
import { LiveMatchItem, LiveScoreResponse, SportCategory } from '@/lib/liveScores';

interface LiveMatchesSectionProps {
  initialSport?: SportCategory | 'all';
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

const SPORTS_TABS: Array<{ id: SportCategory | 'all'; label: string; emoji: string }> = [
  { id: 'all', label: 'All Sports', emoji: '🔥' },
  { id: 'cricket', label: 'Cricket', emoji: '🏏' },
  { id: 'football', label: 'Football / Soccer', emoji: '⚽' },
  { id: 'nfl', label: 'NFL', emoji: '🏈' },
  { id: 'rugby', label: 'Rugby', emoji: '🏉' },
  { id: 'nba', label: 'NBA', emoji: '🏀' },
];

export default function LiveMatchesSection({
  initialSport = 'all',
  title = 'Live Match Center',
  subtitle = 'Real-time scores, in-play action, and official broadcast channels across Football, Cricket, NFL & Rugby',
  compact = false,
}: LiveMatchesSectionProps) {
  const [selectedSport, setSelectedSport] = useState<SportCategory | 'all'>(initialSport);
  const [onlyLive, setOnlyLive] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [data, setData] = useState<LiveScoreResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Fetch live matches from our aggregator API
  const fetchLiveMatches = useCallback(
    async (showRefreshIndicator = false) => {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      }
      try {
        const params = new URLSearchParams();
        if (selectedSport !== 'all') {
          params.set('sport', selectedSport);
        }
        if (onlyLive) {
          params.set('onlyLive', 'true');
        }

        const res = await fetch(`/api/live-matches?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch live matches');
        const json: LiveScoreResponse = await res.json();
        setData(json);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error in fetchLiveMatches:', err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedSport, onlyLive]
  );

  // Initial fetch and on filter changes
  useEffect(() => {
    setIsLoading(true);
    fetchLiveMatches(false);
  }, [fetchLiveMatches]);

  // Auto-refresh interval (every 25 seconds)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLiveMatches(true);
    }, 25000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLiveMatches]);

  // Client-side search filtering
  const filteredMatches = useMemo(() => {
    if (!data?.matches) return [];
    let list = data.matches;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.homeTeam.name.toLowerCase().includes(q) ||
          m.awayTeam.name.toLowerCase().includes(q) ||
          m.tournament.toLowerCase().includes(q) ||
          (m.venue && m.venue.toLowerCase().includes(q))
      );
    }

    return list;
  }, [data, searchQuery]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/30">
              Live Scores & Streaming
            </span>
            {data && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {data.liveNowCount} In-Play Now
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            {title}
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">{subtitle}</p>
        </div>

        {/* Action Controls: Refresh, Auto-refresh toggle */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-end">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
              autoRefresh
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle 25s auto-refresh"
          >
            <Radio className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-pulse text-emerald-400' : ''}`} />
            Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => fetchLiveMatches(true)}
            disabled={isRefreshing}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
            title="Refresh latest scores"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>

          <div className="text-[11px] text-slate-500 hidden sm:block">
            Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Sport Navigation Tabs & Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Sport Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin scrollbar-thumb-slate-800">
          {SPORTS_TABS.map((tab) => {
            const isActive = selectedSport === tab.id;
            const liveCount =
              tab.id === 'all'
                ? data?.liveNowCount ?? 0
                : data?.sportsCount?.[tab.id as SportCategory]?.live ?? 0;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedSport(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition shadow-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-emerald-500/20'
                    : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
                {liveCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                      isActive ? 'bg-slate-950 text-emerald-400' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {liveCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Search and Mode Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Live vs All Fixtures Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => setOnlyLive(true)}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                onlyLive ? 'bg-red-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Live Now
            </button>
            <button
              onClick={() => setOnlyLive(false)}
              className={`px-3 py-1.5 rounded-lg transition ${
                !onlyLive ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Matchday
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search team or league..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Main Scoreboard Display Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-28 bg-slate-800 rounded"></div>
                <div className="h-4 w-16 bg-slate-800 rounded-full"></div>
              </div>
              <div className="space-y-3 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-slate-800 rounded-full"></div>
                    <div className="h-4 w-24 bg-slate-800 rounded"></div>
                  </div>
                  <div className="h-6 w-12 bg-slate-800 rounded"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-slate-800 rounded-full"></div>
                    <div className="h-4 w-24 bg-slate-800 rounded"></div>
                  </div>
                  <div className="h-6 w-12 bg-slate-800 rounded"></div>
                </div>
              </div>
              <div className="h-8 bg-slate-800 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className={`bg-slate-900/90 border rounded-2xl p-5 transition flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-slate-700 ${
                match.isLive
                  ? 'border-red-500/30 hover:border-red-500/60 shadow-red-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Subtle Ambient Glow for Live Matches */}
              {match.isLive && (
                <div className="absolute top-0 right-0 w-36 h-36 bg-red-500/5 blur-2xl rounded-full pointer-events-none -mr-10 -mt-10" />
              )}

              {/* Card Header: Tournament & Live Badge */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base" title={match.sportLabel}>
                    {match.sportEmoji}
                  </span>
                  <span className="text-xs font-bold text-slate-300 truncate" title={match.tournament}>
                    {match.tournament}
                  </span>
                </div>

                {/* Status Indicator */}
                {match.isLive ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-black tracking-wide shrink-0">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span>LIVE</span>
                    {match.clock && <span className="text-white ml-0.5">• {match.clock}</span>}
                  </div>
                ) : match.state === 'post' ? (
                  <div className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-bold shrink-0">
                    Final
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md shrink-0">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{match.statusDetail || 'Upcoming'}</span>
                  </div>
                )}
              </div>

              {/* Match Teams & Present Scores */}
              <div className="py-4 space-y-3">
                {/* Home / Team 1 Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-8 h-8 rounded-full bg-slate-800/90 p-1 flex items-center justify-center border border-slate-700/50 shrink-0">
                      {match.homeTeam.logo ? (
                        <img
                          src={match.homeTeam.logo}
                          alt={match.homeTeam.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          {match.homeTeam.shortName || match.homeTeam.name.slice(0, 3)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-white truncate">
                          {match.homeTeam.name}
                        </span>
                        {match.homeTeam.isBatting && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0"
                            title="Currently batting"
                          >
                            🏏 Batting
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <span
                      className={`text-base font-black tracking-tight ${
                        match.homeTeam.score && match.homeTeam.score !== '0' && match.homeTeam.score !== 'Yet to bat'
                          ? 'text-white'
                          : 'text-slate-500 text-xs font-semibold'
                      }`}
                    >
                      {match.homeTeam.score || '—'}
                    </span>
                  </div>
                </div>

                {/* Away / Team 2 Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-8 h-8 rounded-full bg-slate-800/90 p-1 flex items-center justify-center border border-slate-700/50 shrink-0">
                      {match.awayTeam.logo ? (
                        <img
                          src={match.awayTeam.logo}
                          alt={match.awayTeam.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          {match.awayTeam.shortName || match.awayTeam.name.slice(0, 3)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-white truncate">
                          {match.awayTeam.name}
                        </span>
                        {match.awayTeam.isBatting && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0"
                            title="Currently batting"
                          >
                            🏏 Batting
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <span
                      className={`text-base font-black tracking-tight ${
                        match.awayTeam.score && match.awayTeam.score !== '0' && match.awayTeam.score !== 'Yet to bat'
                          ? 'text-white'
                          : 'text-slate-500 text-xs font-semibold'
                      }`}
                    >
                      {match.awayTeam.score || '—'}
                    </span>
                  </div>
                </div>

                {/* In-play match situation / commentary line */}
                {match.summary && (
                  <div className="pt-2 border-t border-slate-800/50 text-[11px] font-semibold text-emerald-400/90 flex items-center gap-1.5 leading-snug">
                    <Volume2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{match.summary}</span>
                  </div>
                )}
              </div>

              {/* Card Footer: Broadcaster & Action CTA */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                {/* Official Broadcaster Channels */}
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1 truncate">
                    <Tv className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate font-medium">
                      US: <strong className="text-slate-300 font-semibold">{match.broadcasters.us.split('/')[0]}</strong> • UK: <strong className="text-slate-300 font-semibold">{match.broadcasters.uk.split('/')[0]}</strong>
                    </span>
                  </div>
                </div>

                {/* Stream / Match Center Action Links */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href={match.streamUrl}
                    target="_blank"
                    rel="sponsored nofollow"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-md shadow-red-950/50 transition group-hover:scale-[1.02]"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Watch Stream
                  </Link>

                  <Link
                    href={`/match/${match.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs transition"
                  >
                    <span>Match Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-4 max-w-xl mx-auto">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">
            No {selectedSport === 'all' ? '' : selectedSport.toUpperCase()} matches currently in-play
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {onlyLive
              ? 'There are currently no active live matches running right this second for this sport. Toggle to "All Matchday" to inspect upcoming fixtures and TV broadcast schedules!'
              : 'No scheduled games found matching your current filter.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            {onlyLive && (
              <button
                onClick={() => setOnlyLive(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
              >
                View All Today's Fixtures
              </button>
            )}
            <button
              onClick={() => {
                setSelectedSport('all');
                setOnlyLive(true);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition"
            >
              View All Live Sports
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
