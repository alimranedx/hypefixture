'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Heart, Ticket, Calendar, Trash2, ArrowRight, ShieldCheck, LogIn } from 'lucide-react';

interface FavoriteEvent {
  id: string;
  matchSlug: string;
  sport: string;
  title: string;
  matchTime?: string | null;
  createdAt: string;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/user/bookmark');
      const data = await res.json();
      if (data.success && Array.isArray(data.favorites)) {
        setFavorites(data.favorites);
      }
    } catch (err) {
      console.error('Failed to load favorites', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchFavorites();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const handleRemoveFavorite = async (matchSlug: string) => {
    try {
      const res = await fetch('/api/user/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchSlug }),
      });
      const data = await res.json();
      if (!data.bookmarked) {
        setFavorites((prev) => prev.filter((item) => item.matchSlug !== matchSlug));
      }
    } catch (err) {
      console.error('Failed to remove bookmark', err);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 mt-3 font-semibold">Loading your saved events...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8 fill-rose-500/30" />
        </div>
        <h1 className="text-2xl font-black text-white">Sign In to Save Favorite Matches</h1>
        <p className="text-sm text-slate-400">
          Save your marquee derbies, track ticket resale price drops, and compare SeatGeek &amp; StubHub offers across all your devices.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <LogIn className="w-4 h-4" /> Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-rose-500" />
            User Saved Events
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Your Favorite <span className="text-rose-400">Matches &amp; Derbies</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Keep track of sold-out fixtures and check live ticket marketplace prices.
          </p>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-xs font-black text-white hover:text-emerald-400 transition shrink-0"
        >
          <span>Find More Matches</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No saved matches yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse upcoming derbies and click the heart icon on any match card to save it here for fast price comparison.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition"
          >
            Browse Upcoming Events →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-4 shadow-xl"
            >
              <div className="space-y-1.5 min-w-0">
                <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-black uppercase text-emerald-400">
                  {fav.sport}
                </span>
                <h4 className="text-sm font-black text-white truncate">
                  <Link href={`/events/${fav.matchSlug}`} className="hover:text-emerald-400 transition">
                    {fav.title}
                  </Link>
                </h4>
                {fav.matchTime && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{fav.matchTime}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/events/${fav.matchSlug}`}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center gap-1"
                >
                  <Ticket className="w-3 h-3" />
                  <span>Tickets</span>
                </Link>
                <button
                  onClick={() => handleRemoveFavorite(fav.matchSlug)}
                  aria-label="Remove favorite"
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
