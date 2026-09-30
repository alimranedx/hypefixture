'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import {
  Sparkles,
  Sliders,
  Check,
  RefreshCw,
  Zap,
  Globe,
  Radio,
  Clock,
  ShieldCheck,
  Trophy,
  Plus,
  ExternalLink,
  Loader2,
} from 'lucide-react';

export default function AiStudioSection() {
  const {
    settings,
    setSettings,
    handleSaveSettings,
    handleGeneratePosts,
    generatingAi,
    aiTelemetry,
    sports,
    handleToggleSport,
  } = useAdmin();

  const [saving, setSaving] = useState(false);
  const [togglingSportId, setTogglingSportId] = useState<string | null>(null);

  const onToggleSport = async (id: string, currentActive: boolean) => {
    setTogglingSportId(id);
    await handleToggleSport(id, currentActive);
    setTogglingSportId(null);
  };

  const onSubmitSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await handleSaveSettings();
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Configuration Form */}
      <form onSubmit={onSubmitSettings} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-lg">AI Editorial & Automation Controls</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Configure how Gemini discovers live matches and schedules daily content clusters.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleGeneratePosts()}
              disabled={generatingAi}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 shrink-0"
            >
              {generatingAi ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Batch...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Generate 5 Posts Now</span>
                </>
              )}
            </button>
          </div>

          {/* Daily Articles Quota */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Daily Articles Quota
              </label>
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                {settings.postsPerDay} Posts / Day
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={settings.postsPerDay}
              onChange={(e) => setSettings({ ...settings, postsPerDay: parseInt(e.target.value) || 5 })}
              className="w-full accent-emerald-500 bg-slate-950 rounded-lg cursor-pointer h-2 border border-slate-800"
            />
            <p className="text-[11px] text-slate-400">
              Generates inter-linked articles matching real-time Google search demand for live games.
            </p>
          </div>

          {/* Publishing Workflow */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Publishing Workflow
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, autoPublish: true })}
                className={`p-4 rounded-xl text-left border transition flex items-start gap-3 ${
                  settings.autoPublish
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    settings.autoPublish
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {settings.autoPublish && <Check className="w-3.5 h-3.5 font-bold" />}
                </div>
                <div>
                  <span className="font-bold text-xs block text-white">⚡ Auto-Publish Directly to Live Site</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Instantly indexed in sitemap.xml & submitted to Google/Bing for breaking matchday traffic.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, autoPublish: false })}
                className={`p-4 rounded-xl text-left border transition flex items-start gap-3 ${
                  !settings.autoPublish
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    !settings.autoPublish
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {!settings.autoPublish && <Check className="w-3.5 h-3.5 font-bold" />}
                </div>
                <div>
                  <span className="font-bold text-xs block text-white">📝 Save into Drafts Queue</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Editorial staff reviews and approves each article manually before publishing live.
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Active Sports Coverage */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Active Sports Coverage ({sports.filter((s) => s.isActive).length} Selected)
              </label>
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/sports?action=new"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition"
                >
                  <Plus className="w-3 h-3" /> Add Sport
                </Link>
                <Link
                  href="/admin/sports"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white transition"
                >
                  Manage All <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sports.map((sport) => {
                const isSelected = sport.isActive;
                const isToggling = togglingSportId === sport.id;
                return (
                  <button
                    key={sport.id}
                    type="button"
                    disabled={isToggling}
                    onClick={() => onToggleSport(sport.id, sport.isActive)}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between group disabled:opacity-60 ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                    title={isSelected ? 'Active in AI & site. Click to deselect.' : 'Inactive. Click to select.'}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base select-none">{sport.icon || '🏆'}</span>
                      <span className="truncate">{sport.name}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-700 bg-slate-900 group-hover:border-slate-600'
                      }`}
                    >
                      {isToggling ? (
                        <Loader2 className="w-3 h-3 animate-spin text-current" />
                      ) : (
                        isSelected && <Check className="w-3 h-3 font-bold" />
                      )}
                    </div>
                  </button>
                );
              })}

              {sports.length === 0 && (
                <div className="col-span-full py-4 px-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                  Loading sports coverage database...
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Click any sport card to instantly select or deselect coverage. Gemini auto-clusters matchday articles exclusively for selected sports.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition disabled:opacity-50 shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin text-slate-950" />}
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Real-time Gemini Telemetry Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="font-bold text-white text-base">Gemini Engine Auto-Failover & Live Telemetry</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
            CASCADE ACTIVE (3.8 ➔ 3.7 ➔ 3.6 ➔ 3.5)
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The cluster engine automatically attempts <code className="text-emerald-400 font-mono">gemini-3.8-flash</code> first. If Google reports high traffic (503), rate limit (429), or capacity spikes, the engine immediately fails over to <code className="text-emerald-400 font-mono">gemini-3.7-flash</code>, <code className="text-emerald-400 font-mono">gemini-3.6-flash</code>, and <code className="text-emerald-400 font-mono">gemini-3.5-flash</code> seamlessly.
        </p>

        {aiTelemetry ? (
          <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 space-y-3">
            {aiTelemetry.summaryLog && (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono flex items-center gap-2">
                <span className="text-emerald-400 font-bold">📋 Engine Audit:</span>
                <span>{aiTelemetry.summaryLog}</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
              <div>
                <span className="text-slate-500 block text-[10px]">Active Model Used</span>
                <span className="font-bold text-white font-mono flex items-center gap-1">
                  {aiTelemetry.model}
                  {aiTelemetry.fallbackOccurred && (
                    <span className="text-[9px] text-amber-400 font-semibold">(Fallback)</span>
                  )}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Execution Latency</span>
                <span className="font-bold text-emerald-400 font-mono">{aiTelemetry.latencyMs} ms</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Authenticated Key</span>
                <span className="font-bold text-slate-300 font-mono">{aiTelemetry.apiKeyPreview}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Generated Time</span>
                <span className="font-bold text-slate-300 font-mono">
                  {new Date(aiTelemetry.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Click &quot;Generate 5 Posts Now&quot; above to trigger a fresh cluster and inspect real-time network telemetry.</span>
          </div>
        )}
      </div>
    </div>
  );
}
