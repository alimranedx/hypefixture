'use client';

import React from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { TrendingUp, ArrowUpRight, Search } from 'lucide-react';

export default function SerpSection() {
  const { keywords } = useAdmin();

  const rankedKeywords = keywords.filter((k) => k.currentRank);
  const top3 = rankedKeywords.filter((k) => k.currentRank <= 3).length;
  const pos4to10 = rankedKeywords.filter((k) => k.currentRank > 3 && k.currentRank <= 10).length;

  return (
    <div className="space-y-6">
      {/* Top SERP Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Website Organic Search Ranking Positions
        </h3>
        <p className="text-xs text-slate-400">
          Live Google Search Console position tracking for top money keywords, team search terms, and streaming queries.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Top 3 Positions</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{top3} Keywords</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Positions 4 - 10</span>
            <div className="text-2xl font-black text-blue-400 mt-1">{pos4to10} Keywords</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Average Organic CTR</span>
            <div className="text-2xl font-black text-purple-400 mt-1">8.4%</div>
          </div>
        </div>
      </div>

      {/* Rank Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Search Query</th>
                <th className="py-3.5 px-4">Ranking Target URL</th>
                <th className="py-3.5 px-4">Current Google Rank</th>
                <th className="py-3.5 px-4">Historic Best</th>
                <th className="py-3.5 px-4 text-right">Est. Monthly Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rankedKeywords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No keywords currently tracked with rank positions. Add keywords in the Keyword Research tab to monitor rankings.
                  </td>
                </tr>
              ) : (
                rankedKeywords.map((kw) => (
                  <tr key={kw.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-semibold text-white">{kw.keyword}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-mono text-[11px]">
                      {kw.targetSlug ? (
                        <Link
                          href={`/admin/posts/${kw.targetSlug}`}
                          className="hover:underline inline-flex items-center gap-1"
                        >
                          /post/{kw.targetSlug} <ArrowUpRight className="w-2.5 h-2.5" />
                        </Link>
                      ) : (
                        <span className="text-slate-500">/match/*</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-emerald-400 font-mono text-sm">
                        #{kw.currentRank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      #{kw.bestRank || kw.currentRank || 1}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                      ~{Math.round(kw.volume * (kw.currentRank <= 3 ? 0.28 : 0.08)).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
