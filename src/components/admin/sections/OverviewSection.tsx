'use client';

import React from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import {
  FileText,
  TrendingUp,
  Tv,
  Eye,
  Sparkles,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Search,
  Share2,
} from 'lucide-react';

export default function OverviewSection() {
  const { posts, keywords, affiliates, settings, handleGeneratePosts, generatingAi, aiTelemetry } = useAdmin();

  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalClicks = affiliates.reduce((sum, a) => sum + (a.clicks || 0), 0);
  const top10Keywords = keywords.filter((k) => k.currentRank && k.currentRank <= 10).length;
  const recentPosts = posts.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Total Articles</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{posts.length}</div>
          <span className="text-[11px] text-emerald-400 font-medium">
            {posts.filter((p) => p.status === 'PUBLISHED').length} Live on Google
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Google Top 10 Ranks</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-blue-400">{top10Keywords}</div>
          <span className="text-[11px] text-slate-400 font-medium">
            Out of {keywords.length} tracked keywords
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Affiliate Outbound Clicks</span>
            <Tv className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-400">{totalClicks}</div>
          <span className="text-[11px] text-slate-400 font-medium">Across SeatGeek &amp; StubHub partners</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Total Article Reads</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{totalViews}</div>
          <span className="text-[11px] text-slate-400 font-medium">Organically driven</span>
        </div>
      </div>

      {/* Quick Actions & Hype Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Automation Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Gemini Autonomous Publishing Pipeline</h3>
            </div>
            <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
              Active ({settings.postsPerDay} Posts/Day)
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            TicketFixture content engine monitors upcoming marquee games across Football, Cricket, and live stadium events. Every cycle prompts Google Gemini with strict deduplication to ensure fresh, zero-duplicate organic rankings.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleGeneratePosts()}
              disabled={generatingAi}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {generatingAi ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Batch...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Trigger Instant AI Cluster</span>
                </>
              )}
            </button>

            <Link
              href="/admin/ai-studio"
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span>Configure AI Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/posts/new"
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Custom Article</span>
            </Link>
          </div>
        </div>

        {/* Quick Nav Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base">Quick Management Hub</h3>
          <div className="space-y-2">
            <Link
              href="/admin/posts"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 hover:text-white transition group"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>All Articles ({posts.length})</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
            </Link>

            <Link
              href="/admin/keywords"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 hover:text-white transition group"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-400" />
                <span>Keyword Ranks ({keywords.length})</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition" />
            </Link>

            <Link
              href="/admin/syndication"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 hover:text-white transition group"
            >
              <span className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-pink-400" />
                <span>IndexNow & Social Hub</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-pink-400 transition" />
            </Link>
          </div>
        </div>
      </div>

      {/* Live Articles Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-white text-lg">Latest Live Sports Guides</h3>
          <Link
            href="/admin/posts"
            className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>View All ({posts.length})</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentPosts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 group transition shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {post.sport}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm line-clamp-2 group-hover:text-emerald-400 transition">
                  {post.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1 font-mono">
                  <Eye className="w-3 h-3 text-slate-400" />
                  {post.views || 0} views
                </span>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/post/${post.slug}`}
                    target="_blank"
                    className="text-slate-400 hover:text-white transition"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/admin/posts/${post.slug}`}
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    Edit &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
