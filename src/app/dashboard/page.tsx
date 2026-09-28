import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Bookmark, Calendar, ArrowRight, User, Tv } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== 'USER') {
    redirect('/admin/dashboard');
  }

  const userId = (session.user as any)?.id;

  const bookmarks = userId
    ? await prisma.bookmark.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-2xl">
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            className="w-20 h-20 rounded-full border-2 border-emerald-500 shadow-xl"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
            <User className="w-8 h-8 text-emerald-400" />
          </div>
        )}

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-white">{session.user?.name}</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              {(session.user as any)?.role || 'USER'}
            </span>
          </div>
          <p className="text-xs text-slate-400">{session.user?.email}</p>
        </div>

        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
        >
          Browse Match Schedule
        </Link>
      </div>

      {/* Bookmarked Matches */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Your Saved Match Fixtures</h2>
        </div>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between group shadow-xl"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    {bm.sport}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                    {bm.title}
                  </h3>
                  {bm.matchTime && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{bm.matchTime}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    href={`/match/${bm.matchSlug}`}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    View Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/go/affforce"
                    target="_blank"
                    rel="sponsored nofollow"
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white"
                  >
                    <Tv className="w-3 h-3 text-emerald-400" />
                    Watch Stream
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-3">
            <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No saved matches yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click the bookmark icon on any match card across Football, NFL, NBA, or UFC to track it here.
            </p>
            <Link
              href="/"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              Explore Today's Games
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
