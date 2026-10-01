'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  MapPin,
  Sparkles,
  Trophy,
  Flame,
  Tv,
  ArrowRight,
  Shield,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface SuperstarPlayer {
  id: string;
  name: string;
  nickname: string;
  team: string;
  tournament: string;
  sport: 'football' | 'cricket';
  poseTitle: string;
  poseDescription: string;
  statBadge: string;
  accentColor: string;
  borderGlow: string;
  image: string;
  matchScore: {
    competition: string;
    minuteOrOver: string;
    homeTeam: string;
    awayTeam: string;
    score: string;
    liveAction: string;
  };
  ticketSlug: string;
}

const SUPERSTAR_PLAYERS: SuperstarPlayer[] = [
  {
    id: 'haaland',
    name: 'Erling Haaland',
    nickname: 'The Nordic Striking Force',
    team: 'Manchester City',
    tournament: 'Premier League & UEFA Champions League',
    sport: 'football',
    poseTitle: 'Iconic Zen Meditation Pose',
    poseDescription: 'Cross-legged zen focus pose silencing 60,000 stadium fans under European floodlights',
    statBadge: 'EPL Golden Boot Record 🎯',
    accentColor: 'from-cyan-400 via-sky-500 to-blue-600',
    borderGlow: 'shadow-cyan-500/30 border-cyan-500/40',
    image: '/players/haaland-pose.jpg',
    matchScore: {
      competition: 'Premier League Super Derby',
      minuteOrOver: "58' IN-PLAY",
      homeTeam: 'MCI',
      awayTeam: 'LIV',
      score: '2 - 0',
      liveAction: '⚡ Haaland bursts past backline with 34 km/h sprint',
    },
    ticketSlug: 'manchester-city-vs-liverpool',
  },
  {
    id: 'bellingham',
    name: 'Jude Bellingham',
    nickname: 'Golden Boy of Madrid & England',
    team: 'Real Madrid / England',
    tournament: 'La Liga & UEFA Champions League',
    sport: 'football',
    poseTitle: 'Outstretched Arms Bernabéu Stance',
    poseDescription: 'Chest puffed out with wide-open arms embracing 84,000 roaring Madridistas',
    statBadge: 'Champions League Winner 🏆',
    accentColor: 'from-amber-400 via-yellow-500 to-emerald-500',
    borderGlow: 'shadow-amber-500/30 border-amber-500/40',
    image: '/players/ronaldo-pose.jpg',
    matchScore: {
      competition: 'El Clásico Super Derby',
      minuteOrOver: "91' IN-PLAY",
      homeTeam: 'RMA',
      awayTeam: 'FCB',
      score: '3 - 2',
      liveAction: '🚀 Jude stoppage-time curler into roof of the net',
    },
    ticketSlug: 'real-madrid-vs-barcelona',
  },
  {
    id: 'mbappe',
    name: 'Kylian Mbappé',
    nickname: 'The French Speed Phenomenon',
    team: 'Real Madrid / France',
    tournament: 'UEFA Champions League Night',
    sport: 'football',
    poseTitle: 'Folded Arms Under Armpits Pose',
    poseDescription: 'Signature slide and calm folded arms celebration under cathedral European floodlights',
    statBadge: 'European Superstar ⚡',
    accentColor: 'from-indigo-500 via-purple-500 to-pink-500',
    borderGlow: 'shadow-indigo-500/30 border-indigo-500/40',
    image: '/players/messi-pose.jpg',
    matchScore: {
      competition: 'UEFA Champions League Derby',
      minuteOrOver: "76' IN-PLAY",
      homeTeam: 'RMA',
      awayTeam: 'BAY',
      score: '2 - 1',
      liveAction: '⚡ Mbappé blistering counter-attack strike',
    },
    ticketSlug: 'real-madrid-vs-barcelona',
  },
  {
    id: 'stokes',
    name: 'Ben Stokes',
    nickname: 'Captain Marvel • Ashes Miracle Hero',
    team: 'England Cricket',
    tournament: "The Ashes Test Series (Lord's)",
    sport: 'cricket',
    poseTitle: 'Roaring Lord’s Balcony Fist-Pump',
    poseDescription: 'Passionate roar under historic Lord’s pavilion clock after heroic six',
    statBadge: 'Ashes Legend 👑',
    accentColor: 'from-blue-600 via-indigo-600 to-amber-500',
    borderGlow: 'shadow-blue-500/30 border-blue-500/40',
    image: '/players/cricket-action.jpg',
    matchScore: {
      competition: "The Ashes 2nd Test (Lord's)",
      minuteOrOver: 'Day 4 • Final Session',
      homeTeam: 'ENG',
      awayTeam: 'AUS',
      score: '371/8',
      liveAction: '🏏 Stokes smashes six into the Grandstand upper deck',
    },
    ticketSlug: 'the-ashes-england-vs-australia-lords',
  },
  {
    id: 'root',
    name: 'Joe Root',
    nickname: 'England’s All-Time Greatest',
    team: 'England Cricket / Yorkshire',
    tournament: 'ECB Summer International Test Series',
    sport: 'cricket',
    poseTitle: 'Bat-Raise Century Salute at The Oval',
    poseDescription: 'Helmet raised with calm mastery acknowledged by 27,000 standing London fans',
    statBadge: '35x Test Centuries 🏏',
    accentColor: 'from-teal-400 via-emerald-500 to-sky-500',
    borderGlow: 'shadow-teal-500/30 border-teal-500/40',
    image: '/players/kohli-pose.jpg',
    matchScore: {
      competition: 'ECB Summer Test Series',
      minuteOrOver: '78.2 OV (IN-PLAY)',
      homeTeam: 'ENG',
      awayTeam: 'IND',
      score: '286/3',
      liveAction: '💥 Root drives through extra cover for four',
    },
    ticketSlug: 'the-hundred-finals-day-lords',
  },
];

interface HeroMotionBackgroundProps {
  isCompact?: boolean;
}

export default function HeroMotionBackground({ isCompact = false }: HeroMotionBackgroundProps) {
  const [players, setPlayers] = useState<SuperstarPlayer[]>(SUPERSTAR_PLAYERS);
  const [settings, setSettings] = useState<{
    heroOpacity: number;
    heroKenBurns: boolean;
    heroCycleSeconds: number;
    heroBeamsEnabled: boolean;
    heroRadarEnabled: boolean;
    heroScoreTicker: boolean;
  }>({
    heroOpacity: 80,
    heroKenBurns: true,
    heroCycleSeconds: 7,
    heroBeamsEnabled: true,
    heroRadarEnabled: true,
    heroScoreTicker: true,
  });

  const [activeSportFilter, setActiveSportFilter] = useState<'all' | 'football' | 'cricket'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayerCard, setShowPlayerCard] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic configuration fetch from Admin API
  useEffect(() => {
    let isMounted = true;
    async function loadDynamicHero() {
      try {
        const res = await fetch('/api/hero-background');
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;

        if (data.settings) {
          setSettings(data.settings);
        }

        if (Array.isArray(data.scenes) && data.scenes.length > 0) {
          const mapped: SuperstarPlayer[] = data.scenes.map((s: any) => ({
            id: s.id,
            name: s.name,
            nickname: s.nickname || '',
            team: s.team || '',
            tournament: s.tournament || '',
            sport: s.sport === 'cricket' ? 'cricket' : 'football',
            poseTitle: s.poseTitle,
            poseDescription: s.poseDescription || '',
            statBadge: s.statBadge || 'Superstar 🏆',
            accentColor: s.accentColor || 'from-sky-500 via-teal-400 to-emerald-500',
            borderGlow: s.borderGlow || 'shadow-sky-500/30 border-sky-500/40',
            image: s.image,
            matchScore: {
              competition: s.matchCompetition || 'Derby Match',
              minuteOrOver: s.matchMinuteOrOver || "75' IN-PLAY",
              homeTeam: s.matchHomeTeam || 'HOME',
              awayTeam: s.matchAwayTeam || 'AWAY',
              score: s.matchScore || '1 - 0',
              liveAction: s.matchLiveAction || 'Dangerous attack in progress',
            },
            ticketSlug: s.ticketSlug || 'arsenal-vs-chelsea',
          }));
          setPlayers(mapped);
        }
      } catch (err) {
        console.warn('Fallback to built-in hero players:', err);
      }
    }

    loadDynamicHero();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter players based on active sport
  const visiblePlayers = players.filter(
    (p) => activeSportFilter === 'all' || p.sport === activeSportFilter
  );

  const safeIndex = visiblePlayers.length > 0 ? currentIndex % visiblePlayers.length : 0;
  const activePlayer = visiblePlayers[safeIndex] || players[0];

  // Auto-cycle through players using admin-configured interval
  useEffect(() => {
    if (!isPlaying || visiblePlayers.length <= 1) return;

    const intervalMs = Math.max(3000, (settings.heroCycleSeconds || 7) * 1000);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visiblePlayers.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, visiblePlayers.length, settings.heroCycleSeconds]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Dynamic Playing Match In-Play Video / Visual Canvas */}
      {visiblePlayers.map((player, idx) => {
        const isActive = idx === safeIndex;
        // Alternating dynamic camera motion animations
        const animClass =
          idx % 3 === 0
            ? 'animate-kenburns-1'
            : idx % 3 === 1
            ? 'animate-kenburns-2'
            : 'animate-kenburns-3';

        return (
          <div
            key={player.id}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: isActive ? (settings.heroOpacity ?? 80) / 100 : 0,
              willChange: 'transform, opacity',
            }}
          >
            {/* Match In-Play Background Imagery */}
            <div
              className={`w-full h-full bg-cover bg-center ${isActive && isPlaying && settings.heroKenBurns ? animClass : ''}`}
              style={{
                backgroundImage: `url(${player.image})`,
                filter: 'brightness(1.0) contrast(1.18) saturate(1.25)',
              }}
            />
          </div>
        );
      })}

      {/* Sweeping Stadium Floodlight Beams (Admin Managed) */}
      {settings.heroBeamsEnabled && (
        <>
          <div className="absolute -top-32 left-1/4 w-[600px] h-[700px] bg-gradient-to-b from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl rounded-full animate-stadium-beam pointer-events-none" />
          <div className="absolute -top-24 right-1/4 w-[500px] h-[650px] bg-gradient-to-b from-blue-500/20 via-indigo-500/10 to-transparent blur-3xl rounded-full animate-stadium-pulse pointer-events-none" />
        </>
      )}

      {/* Broadcast Radar / Laser Line scanning across pitch (Admin Managed) */}
      {settings.heroRadarEnabled && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent h-40 animate-broadcast-scan pointer-events-none" />
      )}

      {/* Balanced Full-Height Vignette: 100% Full Height Background Visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/55 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(2,6,23,0.55)_95%)] pointer-events-none" />

      {/* Grid Pattern Mesh Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Mobile/Tablet Compact Superstar Banner */}
      {!isCompact && (
        <div className="xl:hidden absolute top-3 inset-x-4 z-20 pointer-events-auto flex items-center justify-between px-3.5 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-slate-700/80 text-xs shadow-xl">
          <div className="flex items-center gap-2 truncate">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <div className="w-5 h-5 rounded-full bg-cover bg-center shrink-0 border border-white/20" style={{ backgroundImage: `url(${activePlayer.image})` }} />
            <span className="font-bold text-white truncate text-[11px]">
              {activePlayer.name} <span className="text-emerald-400">({activePlayer.poseTitle})</span>
            </span>
          </div>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % visiblePlayers.length)}
            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-black uppercase shrink-0 pl-2"
          >
            Next Star →
          </button>
        </div>
      )}

      {/* FLOATING FAMOUS PLAYER SPOTLIGHT CARD (Right Side on Desktop) */}
      {!isCompact && (
        showPlayerCard ? (
          <div className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-auto max-w-sm w-80 animate-player-float">
            <div
              className={`relative rounded-3xl bg-slate-950/85 backdrop-blur-xl border p-4.5 shadow-2xl transition-all duration-700 ${activePlayer.borderGlow}`}
            >
              {/* Glowing Accent Ring */}
              <div
                className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-r ${activePlayer.accentColor} opacity-20 blur-lg -z-10`}
              />

              {/* Header: Live Match in Progress Tag + Minimize Button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-wider text-red-400">
                    {activePlayer.sport === 'football' ? '⚽ Football Match Playing' : '🏏 Cricket Match Playing'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] font-bold text-slate-300">
                    {activePlayer.matchScore.minuteOrOver}
                  </span>
                  <button
                    onClick={() => setShowPlayerCard(false)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
                    title="Minimize player card"
                  >
                    ✕
                  </button>
                </div>
              </div>

            {/* In-Play Scoreboard Pill (Admin Managed) */}
            {settings.heroScoreTicker && (
              <div className="my-2.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-black text-white">{activePlayer.matchScore.homeTeam}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-black text-xs">
                    {activePlayer.matchScore.score}
                  </span>
                  <span className="font-black text-white">{activePlayer.matchScore.awayTeam}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Verified Stream</span>
              </div>
            )}

            {/* Player Pose Photo Spotlight */}
            <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 my-2 group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${activePlayer.image})`,
                  filter: 'brightness(0.95) contrast(1.1)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              {/* Stat Badge Pill */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-black flex items-center gap-1 shadow-lg">
                  {activePlayer.statBadge}
                </span>
              </div>

              {/* Pose Title in Badge */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Proper Player Pose:
                </div>
                <div className="text-xs font-black text-white drop-shadow truncate">
                  {activePlayer.poseTitle}
                </div>
              </div>
            </div>

            {/* Player Details */}
            <div className="space-y-1 pt-1 text-left">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black text-white leading-tight">
                  {activePlayer.name}
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {activePlayer.team}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {activePlayer.poseDescription}
              </p>
            </div>

            {/* Fast Action Link */}
            <div className="pt-3">
              <Link
                href={`/match/${activePlayer.ticketSlug}`}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition"
              >
                <span>Compare Match Tickets for {activePlayer.name.split(' ')[1] || activePlayer.name}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
        ) : (
          <button
            onClick={() => setShowPlayerCard(true)}
            className="hidden xl:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-auto items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-700 hover:border-emerald-500/60 shadow-2xl text-xs font-black text-white hover:text-emerald-400 transition hover:scale-105"
            title="Expand player card"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="w-5 h-5 rounded-full bg-cover bg-center border border-white/20" style={{ backgroundImage: `url(${activePlayer.image})` }} />
            <span>Show {activePlayer.name}</span>
          </button>
        )
      )}

      {/* Bottom Interactive Broadcast Channel & Superstar Switcher Bar */}
      <div
        className={`absolute ${
          isCompact ? 'bottom-2.5 right-3' : 'bottom-4 left-4 right-4 sm:left-auto sm:right-8'
        } z-20 pointer-events-auto flex flex-wrap items-center justify-between sm:justify-end gap-2.5`}
      >
        {/* Sport Tabs: Football / Cricket Channel Switcher */}
        {!isCompact && (
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-700/70 shadow-2xl">
            <button
              onClick={() => {
                setActiveSportFilter('all');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition ${
                activeSportFilter === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => {
                setActiveSportFilter('football');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                activeSportFilter === 'football'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>⚽</span>
              <span>European Football (Haaland/Jude)</span>
            </button>
            <button
              onClick={() => {
                setActiveSportFilter('cricket');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                activeSportFilter === 'cricket'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🏏</span>
              <span>European Cricket (Stokes/Root)</span>
            </button>
          </div>
        )}

        {/* Superstar Player Pose Thumbnail Switcher */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-700/70 shadow-2xl">
          <div className="flex items-center gap-1.5">
            {visiblePlayers.map((player, idx) => {
              const isActive = idx === safeIndex;
              return (
                <button
                  key={player.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`group relative rounded-full transition-all duration-300 ${
                    isActive
                      ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 scale-110'
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                  title={`${player.name} (${player.poseTitle})`}
                  aria-label={`Show ${player.name} pose`}
                >
                  <div
                    className="w-6 h-6 rounded-full bg-cover bg-center border border-white/20"
                    style={{ backgroundImage: `url(${player.image})` }}
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="w-[1px] h-4 bg-slate-700 mx-1" />

          {/* Active Player Mini Name Badge */}
          <div className="text-left hidden sm:block">
            <div className="text-[11px] font-black text-white leading-tight">
              {activePlayer.name}
            </div>
            <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider truncate max-w-[130px]">
              {activePlayer.poseTitle}
            </div>
          </div>

          {/* Motion Play / Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause match background' : 'Resume match background'}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
            title={isPlaying ? 'Pause match motion' : 'Play match motion'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-slate-300" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
