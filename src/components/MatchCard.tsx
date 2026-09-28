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
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'nba':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'nfl':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ufc':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition duration-200 shadow-xl group">
      {/* Top Meta: Tournament & Sport Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getSportBadgeColor(
              sport
            )}`}
          >
            {sport}
          </span>
          <span className="text-xs font-medium text-slate-400 truncate max-w-[180px]">
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
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-emerald-400' : ''}`} />
        </button>
      </div>

      {/* Match Heading & Teams */}
      <Link href={`/match/${slug}`} className="block group-hover:text-emerald-400 transition mb-3">
        <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
          {teams}
        </h3>
      </Link>

      {/* Date & Location */}
      <div className="space-y-1.5 mb-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate">{venue}</span>
        </div>
      </div>

      {/* Broadcaster Quick View */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 mb-4 text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
          Confirmed TV Broadcast
        </span>
        <div className="grid grid-cols-2 gap-2 text-slate-300">
          <div>
            <span className="text-slate-500 font-semibold">USA:</span> {broadcasters.us}
          </div>
          <div>
            <span className="text-slate-500 font-semibold">UK:</span> {broadcasters.uk}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
        <Link
          href={`/match/${slug}`}
          className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
        >
          Where to Watch Guide
        </Link>
        <Link
          href="/go/affforce"
          target="_blank"
          rel="sponsored nofollow"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-500/10"
        >
          <Tv className="w-3.5 h-3.5" />
          Live Stream
        </Link>
      </div>
    </div>
  );
}
