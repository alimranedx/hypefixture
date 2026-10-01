'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Ticket, Flame, Trophy, ShieldCheck, Zap, ArrowRight, X } from 'lucide-react';

interface HeroCommandCenterProps {
  onSportFilter?: (sport: string) => void;
}

const TRENDING_DERBIES = [
  { label: '🔥 Arsenal vs Chelsea', query: 'Arsenal vs Chelsea', sport: 'football', slug: 'arsenal-vs-chelsea' },
  { label: '👑 El Clásico: Real Madrid vs Barcelona', query: 'Real Madrid vs Barcelona', sport: 'football', slug: 'real-madrid-vs-barcelona' },
  { label: '🏏 The Ashes 2nd Test at Lord\'s', query: 'The Ashes Lords', sport: 'cricket', slug: 'the-ashes-2nd-test-lords' },
  { label: '⚡ Man City vs Liverpool', query: 'Man City vs Liverpool', sport: 'football', slug: 'man-city-vs-liverpool' },
  { label: '🏟️ The Hundred Final at Lord\'s', query: 'The Hundred Lords', sport: 'cricket', slug: 'the-hundred-final-lords' },
  { label: '⚔️ Der Klassiker: Bayern vs Dortmund', query: 'Bayern vs Dortmund', sport: 'football', slug: 'bayern-vs-dortmund' },
];

export default function HeroCommandCenter({ onSportFilter }: HeroCommandCenterProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'FOOTBALL' | 'CRICKET'>('ALL');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleQuickChipClick = (slug: string) => {
    router.push(`/match/${slug}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Category Navigation Pills */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => {
            setActiveTab('ALL');
            if (onSportFilter) onSportFilter('all');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
            activeTab === 'ALL'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
          }`}
        >
          All European Fixtures
        </button>
        <button
          onClick={() => {
            setActiveTab('FOOTBALL');
            if (onSportFilter) onSportFilter('football');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
            activeTab === 'FOOTBALL'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
          }`}
        >
          <span>⚽</span>
          <span>Premier League &amp; UCL</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('CRICKET');
            if (onSportFilter) onSportFilter('cricket');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
            activeTab === 'CRICKET'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
          }`}
        >
          <span>🏏</span>
          <span>The Ashes &amp; Lord&apos;s</span>
        </button>
      </div>

      {/* Floating Glassmorphic Search Command Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative group flex items-center bg-slate-950/85 hover:bg-slate-950/95 border-2 border-slate-700/80 hover:border-emerald-500/60 focus-within:border-emerald-500 rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-xl transition-all duration-300"
      >
        <div className="pl-3 sm:pl-4 text-emerald-400">
          <Search className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search European teams, stadiums (e.g., Arsenal, Lord's, El Clásico, Wembley)..."
          className="flex-1 bg-transparent px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-slate-400 font-medium focus:outline-none"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-95"
        >
          <span>Find Tickets</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Trending European Derby Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Trending High-Hype Derbies Today:</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {TRENDING_DERBIES.map((derby) => (
            <button
              key={derby.slug}
              onClick={() => handleQuickChipClick(derby.slug)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 hover:border-emerald-500/50 text-slate-200 hover:text-white transition-all duration-200 shadow-md hover:-translate-y-0.5 active:scale-95"
            >
              {derby.label}
            </button>
          ))}
        </div>
      </div>

      {/* European Trust & Guarantee Bar */}
      <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-black text-white leading-tight">100% FanProtect</div>
            <div className="text-[10px] text-slate-400">Guaranteed authentic entry</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
          <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-black text-white leading-tight">Instant Mobile NFC</div>
            <div className="text-[10px] text-slate-400">Apple &amp; Google Wallet</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-black text-white leading-tight">All-In Pricing</div>
            <div className="text-[10px] text-slate-400">Transparent GBP (£) &amp; EUR (€)</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-black text-white leading-tight">4.9 / 5 Trust Rating</div>
            <div className="text-[10px] text-slate-400">Across 18,000+ EU fans</div>
          </div>
        </div>
      </div>
    </div>
  );
}
