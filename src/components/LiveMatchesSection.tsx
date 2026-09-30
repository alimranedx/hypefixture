'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  VolumeX,
  Zap,
  Activity,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { LiveMatchItem, LiveScoreResponse, SportCategory } from '@/lib/liveScores';
import { ActiveSport } from '@/lib/sports';

interface LiveMatchesSectionProps {
  initialSport?: SportCategory | 'all';
  dynamicSports?: ActiveSport[];
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

// Clean Web Audio synthesizer for score notification chimes
function playScoreChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Audio might be prevented before first user interaction
  }
}

export default function LiveMatchesSection({
  initialSport = 'all',
  dynamicSports,
  title = 'Live Match Center',
  subtitle = 'Real-time scores, in-play action, and official broadcast channels across Football, Cricket, NFL & Rugby',
  compact = false,
}: LiveMatchesSectionProps) {
  const [selectedSport, setSelectedSport] = useState<SportCategory | 'all'>(initialSport);
  const [availableSports, setAvailableSports] = useState<ActiveSport[]>(dynamicSports || []);
  const [onlyLive, setOnlyLive] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [data, setData] = useState<LiveScoreResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'reconnecting' | 'polling'>('connecting');
  const [recentlyUpdatedIds, setRecentlyUpdatedIds] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Fetch active sports if not provided
  useEffect(() => {
    if (!dynamicSports || dynamicSports.length === 0) {
      fetch('/api/sports')
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.sports)) {
            setAvailableSports(json.sports);
          }
        })
        .catch(() => {});
    }
  }, [dynamicSports]);

  // Derive dynamic tabs from active sports in database
  const sportsTabs = useMemo(() => {
    const list: Array<{ id: SportCategory | 'all'; label: string; emoji: string }> = [
      { id: 'all', label: 'All Sports', emoji: '🔥' },
    ];
    availableSports.forEach((s) => {
      list.push({
        id: s.slug as SportCategory,
        label: s.name.split(' ')[0],
        emoji: s.icon || '🏆',
      });
    });
    return list;
  }, [availableSports]);

  const eventSourceRef = useRef<EventSource | null>(null);
  const fallbackPollRef = useRef<NodeJS.Timeout | null>(null);
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  // Process incoming score data and detect changes for visual flash & chime
  const handleIncomingData = useCallback((incoming: LiveScoreResponse) => {
    setData((prev) => {
      if (!prev || !prev.matches) {
        setLastUpdated(new Date());
        return incoming;
      }

      const prevMap = new Map(prev.matches.map((m) => [m.id, m]));
      const changed = new Set<string>();

      for (const m of incoming.matches) {
        const p = prevMap.get(m.id);
        if (p) {
          const scoreDiff =
            p.homeTeam.score !== m.homeTeam.score ||
            p.awayTeam.score !== m.awayTeam.score ||
            p.clock !== m.clock ||
            p.statusDetail !== m.statusDetail;

          if (scoreDiff && m.isLive) {
            changed.add(m.id);
          }
        }
      }

      if (changed.size > 0) {
        setRecentlyUpdatedIds((curr) => {
          const next = new Set(curr);
          changed.forEach((id) => next.add(id));
          return next;
        });

        if (soundEnabledRef.current) {
          playScoreChime();
        }

        // Highlight flash stays active for 4 seconds
        setTimeout(() => {
          setRecentlyUpdatedIds((curr) => {
            const next = new Set(curr);
            changed.forEach((id) => next.delete(id));
            return next;
          });
        }, 4000);
      }

      setLastUpdated(new Date());
      return incoming;
    });

    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  // Manual fallback poll if SSE is not available or disconnected
  const manualFetch = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (selectedSport !== 'all') params.set('sport', selectedSport);
      if (onlyLive) params.set('onlyLive', 'true');

      const res = await fetch(`/api/live-matches?${params.toString()}`);
      if (!res.ok) throw new Error('Fetch failed');
      const json: LiveScoreResponse = await res.json();
      handleIncomingData(json);
    } catch (err) {
      console.error('Fallback fetch error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedSport, onlyLive, handleIncomingData]);

  // Real-time Server-Sent Events (SSE) Socket Connection
  useEffect(() => {
    setIsLoading(true);
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (fallbackPollRef.current) {
      clearInterval(fallbackPollRef.current);
      fallbackPollRef.current = null;
    }

    setConnectionStatus('connecting');

    const params = new URLSearchParams();
    if (selectedSport !== 'all') params.set('sport', selectedSport);
    if (onlyLive) params.set('onlyLive', 'true');

    // Create browser EventSource streaming connection
    try {
      const es = new EventSource(`/api/live-matches/stream?${params.toString()}`);
      eventSourceRef.current = es;

      es.addEventListener('connected', () => {
        setConnectionStatus('connected');
      });

      es.addEventListener('snapshot', (e: MessageEvent) => {
        try {
          const snapshot = JSON.parse(e.data);
          handleIncomingData(snapshot);
          setConnectionStatus('connected');
        } catch {
          // ignore parse error
        }
      });

      es.addEventListener('score-update', (e: MessageEvent) => {
        try {
          const update = JSON.parse(e.data);
          handleIncomingData(update);
          setConnectionStatus('connected');
        } catch {
          // ignore parse error
        }
      });

      es.onerror = () => {
        // EventSource will auto-retry in the background
        setConnectionStatus('reconnecting');
      };
    } catch (err) {
      console.warn('SSE not supported or blocked, switching to resilient polling loop:', err);
      setConnectionStatus('polling');
      manualFetch(false);
      fallbackPollRef.current = setInterval(() => {
        manualFetch(false);
      }, 7000);
    }

    // Safety fallback: if EventSource does not receive snapshot within 4s, trigger initial manual fetch
    const timeoutTimer = setTimeout(() => {
      if (isLoading) {
        manualFetch(false);
      }
    }, 4000);

    return () => {
      clearTimeout(timeoutTimer);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (fallbackPollRef.current) {
        clearInterval(fallbackPollRef.current);
        fallbackPollRef.current = null;
      }
    };
  }, [selectedSport, onlyLive, handleIncomingData, manualFetch]);

  // Page Visibility API: sync immediately when tab becomes visible again
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        manualFetch(false);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [manualFetch]);

  // Filter matches by search query
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
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Status Badge */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/30">
              Live Scores & Streaming
            </span>

            {/* Connection Indicator */}
            {connectionStatus === 'connected' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Socket: Real-Time Stream (Live)
              </span>
            ) : connectionStatus === 'reconnecting' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                <Activity className="w-3 h-3 animate-spin" />
                Reconnecting Stream...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-bold">
                <Wifi className="w-3 h-3" />
                Auto-Sync Mode (Active)
              </span>
            )}

            {data && (
              <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                {data.liveNowCount} In-Play Now
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            {title}
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">{subtitle}</p>
        </div>

        {/* Action Controls: Audio Chime Toggle & Manual Refresh */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-end">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playScoreChime();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle audio alerts on score updates"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Alerts: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span>Alerts: Muted</span>
              </>
            )}
          </button>

          {/* Manual Refresh */}
          <button
            onClick={() => manualFetch(true)}
            disabled={isRefreshing}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
            title="Force instant sync"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          <div className="text-[11px] text-slate-500 hidden sm:block">
            {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Sport Navigation Tabs & Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Sport Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin scrollbar-thumb-slate-800">
          {sportsTabs.map((tab) => {
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
          {filteredMatches.map((match) => {
            const isJustUpdated = recentlyUpdatedIds.has(match.id);

            return (
              <div
                key={match.id}
                className={`bg-slate-900/90 border rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between shadow-xl relative overflow-hidden group ${
                  isJustUpdated
                    ? 'ring-2 ring-emerald-400 border-emerald-500/80 shadow-emerald-500/20 scale-[1.01]'
                    : match.isLive
                    ? 'border-red-500/30 hover:border-red-500/60 shadow-red-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Score Flash Banner */}
                {isJustUpdated && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-black uppercase text-center py-0.5 tracking-wider animate-pulse z-20">
                    ⚡ Score Just Updated (Real-Time)
                  </div>
                )}

                {/* Subtle Ambient Glow for Live Matches */}
                {match.isLive && (
                  <div className="absolute top-0 right-0 w-36 h-36 bg-red-500/5 blur-2xl rounded-full pointer-events-none -mr-10 -mt-10" />
                )}

                {/* Card Header: Tournament & Live Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mt-1">
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
                <div className="py-4 space-y-3.5">
                  {/* Home / Team 1 Row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 p-1.5 flex items-center justify-center shrink-0 shadow-md">
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
                          <span className="text-xs font-black text-slate-400">
                            {match.homeTeam.shortName || match.homeTeam.name.slice(0, 3)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                            {match.homeTeam.name}
                          </span>
                          {match.homeTeam.isBatting && (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0"
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
                        className={`font-mono text-lg font-black tracking-tight transition-all ${
                          isJustUpdated
                            ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                            : match.homeTeam.score && match.homeTeam.score !== '0' && match.homeTeam.score !== 'Yet to bat'
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
                      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 p-1.5 flex items-center justify-center shrink-0 shadow-md">
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
                          <span className="text-xs font-black text-slate-400">
                            {match.awayTeam.shortName || match.awayTeam.name.slice(0, 3)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                            {match.awayTeam.name}
                          </span>
                          {match.awayTeam.isBatting && (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0"
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
                        className={`font-mono text-lg font-black tracking-tight transition-all ${
                          isJustUpdated
                            ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                            : match.awayTeam.score && match.awayTeam.score !== '0' && match.awayTeam.score !== 'Yet to bat'
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
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-emerald-400 flex items-center gap-2 shadow-inner">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                      <span className="truncate">{match.summary}</span>
                    </div>
                  )}
                </div>

                {/* Card Footer: Broadcaster & Action CTA */}
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  {/* Official Broadcaster Channels */}
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl px-3 py-2 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 truncate">
                      <Tv className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <div className="flex items-center gap-3 truncate">
                        <span className="truncate">
                          <span className="text-slate-500 font-semibold">🇺🇸 USA:</span> <strong className="text-slate-200 font-bold">{match.broadcasters.us.split('/')[0]}</strong>
                        </span>
                        <span className="text-slate-700 hidden sm:inline">•</span>
                        <span className="truncate hidden sm:inline">
                          <span className="text-slate-500 font-semibold">🇬🇧 UK:</span> <strong className="text-slate-200 font-bold">{match.broadcasters.uk.split('/')[0]}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stream / Match Center Action Links */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={match.streamUrl}
                      target="_blank"
                      rel="sponsored nofollow"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-lg shadow-red-950/60 hover:shadow-red-500/25 active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Stream</span>
                    </Link>

                    <Link
                      href={`/match/${match.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/60 text-slate-200 hover:text-white font-bold text-xs transition active:scale-95"
                    >
                      <span>Match Guide</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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
