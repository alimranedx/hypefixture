'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import {
  Search,
  Plus,
  Sparkles,
  RefreshCw,
  X,
  TrendingUp,
  Loader2,
} from 'lucide-react';

export default function KeywordsSection() {
  const {
    keywords,
    loadAllData,
    handleGenerateForKeyword,
    generatingAi,
    setStatusMessage,
  } = useAdmin();

  const [showAddKwModal, setShowAddKwModal] = useState(false);
  const [newKw, setNewKw] = useState({
    keyword: '',
    sport: 'football',
    volume: 50000,
    intent: 'COMMERCIAL',
    difficulty: 'MEDIUM',
  });
  const [addingKw, setAddingKw] = useState(false);
  const [generatingKw, setGeneratingKw] = useState<string | null>(null);

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKw.keyword.trim()) return;

    setAddingKw(true);
    try {
      const res = await fetch('/api/admin/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKw),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `Keyword "${newKw.keyword}" added successfully!` });
        setShowAddKwModal(false);
        setNewKw({
          keyword: '',
          sport: 'football',
          volume: 50000,
          intent: 'COMMERCIAL',
          difficulty: 'MEDIUM',
        });
        await loadAllData();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to add keyword.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error adding keyword.' });
    } finally {
      setAddingKw(false);
    }
  };

  const onWritePostForKw = async (keyword: string, sport: string) => {
    setGeneratingKw(keyword);
    await handleGenerateForKeyword(keyword, sport);
    setGeneratingKw(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-400" />
            Sports Keyword Intelligence & Hype Discovery
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Identify high-volume matchday queries and trigger specialized AI articles with 1 click using the cascading Gemini engine.
          </p>
        </div>

        <button
          onClick={() => setShowAddKwModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Keyword
        </button>
      </div>

      {/* Keyword Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Target Keyword</th>
                <th className="py-3.5 px-4">Sport</th>
                <th className="py-3.5 px-4">Search Intent</th>
                <th className="py-3.5 px-4">Monthly Volume</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Current SERP</th>
                <th className="py-3.5 px-4 text-right">Editorial Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {keywords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No keywords found. Click &quot;Add Keyword&quot; to seed your sports keyword tracker.
                  </td>
                </tr>
              ) : (
                keywords.map((kw) => (
                  <tr key={kw.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-semibold text-white max-w-xs">{kw.keyword}</td>
                    <td className="py-3.5 px-4 uppercase font-bold text-[10px] text-emerald-400">
                      {kw.sport}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {kw.intent}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {kw.volume.toLocaleString()}/mo
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          kw.difficulty === 'LOW'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : kw.difficulty === 'MEDIUM'
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-red-400 bg-red-500/10'
                        }`}
                      >
                        {kw.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {kw.currentRank ? (
                        <span className="font-bold text-emerald-400 font-mono">#{kw.currentRank} on Google</span>
                      ) : (
                        <span className="text-slate-500">Unranked</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onWritePostForKw(kw.keyword, kw.sport)}
                        disabled={generatingAi}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        {generatingKw === kw.keyword ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Writing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            <span>⚡ Write Post</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Keyword Modal */}
      {showAddKwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add Target Sports Keyword</h3>
              <button
                onClick={() => setShowAddKwModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddKeyword} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Search Query / Keyword</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. how to watch manchester city vs arsenal"
                  value={newKw.keyword}
                  onChange={(e) => setNewKw({ ...newKw, keyword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Sport</label>
                  <select
                    value={newKw.sport}
                    onChange={(e) => setNewKw({ ...newKw, sport: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="football">Football</option>
                    <option value="nba">NBA</option>
                    <option value="nfl">NFL</option>
                    <option value="ufc">UFC</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Intent</label>
                  <select
                    value={newKw.intent}
                    onChange={(e) => setNewKw({ ...newKw, intent: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="INFORMATIONAL">Informational</option>
                    <option value="NAVIGATIONAL">Navigational</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Estimated Monthly Volume</label>
                  <input
                    type="number"
                    value={newKw.volume}
                    onChange={(e) => setNewKw({ ...newKw, volume: parseInt(e.target.value) || 10000 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Difficulty</label>
                  <select
                    value={newKw.difficulty}
                    onChange={(e) => setNewKw({ ...newKw, difficulty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddKwModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingKw}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {addingKw && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />}
                  <span>{addingKw ? 'Saving...' : 'Add Keyword'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
