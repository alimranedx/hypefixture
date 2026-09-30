'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { Tv, Bookmark, MapPin, Calendar, ExternalLink } from 'lucide-react';

interface MatchCardProps {
  slug: string;
  teams: string;
  tournament: string;
  sport: string;
  venue: string;
  time: string;
  broadcasters: { us: string; uk: string; ca?: string; au?: string };
  isBookmarked?: boolean;
}

export default function MatchCard({
  slug,
  teams,
  tournament,
  sport,
  venue,
  time,
  broadcasters,
  isBookmarked = false,
}: MatchCardProps) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(isBookmarked);
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const toggleBookmark = async () => {
    if (!session) {
      signIn('google');
      return;
    }
    setLoadingBookmark(true);
    try {
      const res = await fetch('/api/user/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchSlug: slug,
          sport,
          title: teams,
          matchTime: time,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaved(data.bookmarked);
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    } finally {
      setLoadingBookmark(false);
    }
  };

  const getSportBadgeColor = (s: string) => {
    switch (s.toLowerCase()) {
      case 'football':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'cricket':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'nba':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'nfl':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'rugby':
        return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
      case 'ufc':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'f1':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'tennis':
        return 'bg-lime-500/15 text-lime-400 border-lime-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 group flex flex-col justify-between">
      <div>
        {/* Top Meta: Tournament & Sport Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getSportBadgeColor(
                sport
              )}`}
            >
              {sport}
            </span>
            <span className="text-xs font-semibold text-slate-400 truncate max-w-[180px]">
              {tournament}
            </span>
          </div>

          {/* Bookmark Action */}
          <button
            onClick={toggleBookmark}
            disabled={loadingBookmark}
            title={saved ? 'Remove bookmark' : 'Save to my fixtures'}
            className={`p-1.5 rounded-lg border transition ${
              saved
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-emerald-400' : ''}`} />
          </button>
        </div>

        {/* Match Heading & Teams */}
        <Link href={`/match/${slug}`} className="block group-hover:text-emerald-400 transition mb-3">
          <h3 className="text-lg font-black text-white tracking-tight leading-snug">
            {teams}
          </h3>
        </Link>

        {/* Date & Location */}
        <div className="space-y-1.5 mb-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="font-medium text-slate-300">{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{venue}</span>
          </div>
        </div>

        {/* Broadcaster Quick View */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 mb-4 text-xs space-y-1.5">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">
            Confirmed Broadcast Networks
          </span>
          <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
            <div className="truncate">
              <span className="font-semibold text-slate-400">🇺🇸 USA:</span> <strong className="text-white font-medium">{broadcasters.us.split('/')[0]}</strong>
            </div>
            <div className="truncate">
              <span className="font-semibold text-slate-400">🇬🇧 UK:</span> <strong className="text-white font-medium">{broadcasters.uk.split('/')[0]}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
        <Link
          href={`/match/${slug}`}
          className="text-center py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1"
        >
          <span>Where to Watch</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>
        <Link
          href={`/match/${slug}#ticket-comparison`}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black transition shadow-md shadow-emerald-500/20 active:scale-95"
        >
          <Tv className="w-3.5 h-3.5" />
          <span>Tickets & Guide</span>
        </Link>
      </div>
    </div>
  );
}
