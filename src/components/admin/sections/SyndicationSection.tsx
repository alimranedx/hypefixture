'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import {
  Share2,
  Zap,
  Globe,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
} from 'lucide-react';

export default function SyndicationSection() {
  const {
    settings,
    setSettings,
    handleSaveSettings,
    handleBatchIndexNow,
    batchIndexing,
    handleSyndicatePost,
    syndicatingPostId,
    posts,
  } = useAdmin();

  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await handleSaveSettings();
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* IndexNow Quick Push Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              IndexNow Instant Search Engine Indexing
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Bypasses standard crawler wait times to notify Bing, Yahoo, Yandex, and Naver within 1 second of publishing.
            </p>
          </div>

          <button
            onClick={handleBatchIndexNow}
            disabled={batchIndexing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 shrink-0"
          >
            {batchIndexing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting URLs...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit All URLs to IndexNow</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Host Domain</span>
            <span className="text-sm font-bold text-white font-mono mt-1 block">hypefixture.com</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">IndexNow Key</span>
            <span className="text-xs font-bold text-emerald-400 font-mono mt-1 block truncate">
              {settings.indexNowKey || 'hypefixture-key-2026'}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Status</span>
            <span className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Active
            </span>
          </div>
        </div>
      </div>

      {/* Social Media API Credentials Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-400" />
              Automated Social Syndication & Broadcast API
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Connect official developer keys to automatically dispatch rich cards and links to social channels when an article is published.
            </p>
          </div>

          {/* Master Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={settings.autoShareSocial}
                onChange={(e) => setSettings({ ...settings, autoShareSocial: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <div>
                <span className="text-xs font-bold text-white block">Auto-Share to Social Media</span>
                <span className="text-[11px] text-slate-400">Post matchday guides to X, Facebook, and Pinterest</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={settings.autoIndexNow}
                onChange={(e) => setSettings({ ...settings, autoIndexNow: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <div>
                <span className="text-xs font-bold text-white block">Auto-Submit to IndexNow</span>
                <span className="text-[11px] text-slate-400">Ping search engines automatically when articles generate</span>
              </div>
            </label>
          </div>

          {/* Social Channels Config */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Twitter / X */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <span>𝕏 / Twitter API v2</span>
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">API Key</label>
                  <input
                    type="text"
                    value={settings.twitterApiKey || ''}
                    onChange={(e) => setSettings({ ...settings, twitterApiKey: e.target.value })}
                    placeholder="API Key"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">API Secret</label>
                  <input
                    type="password"
                    value={settings.twitterApiSecret || ''}
                    onChange={(e) => setSettings({ ...settings, twitterApiSecret: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Access Token</label>
                  <input
                    type="text"
                    value={settings.twitterAccessToken || ''}
                    onChange={(e) => setSettings({ ...settings, twitterAccessToken: e.target.value })}
                    placeholder="Access Token"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Access Secret</label>
                  <input
                    type="password"
                    value={settings.twitterAccessSecret || ''}
                    onChange={(e) => setSettings({ ...settings, twitterAccessSecret: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Facebook */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <span>Facebook Graph API</span>
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Page ID</label>
                  <input
                    type="text"
                    value={settings.facebookPageId || ''}
                    onChange={(e) => setSettings({ ...settings, facebookPageId: e.target.value })}
                    placeholder="Page ID"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Page Access Token</label>
                  <input
                    type="password"
                    value={settings.facebookAccessToken || ''}
                    onChange={(e) => setSettings({ ...settings, facebookAccessToken: e.target.value })}
                    placeholder="Long-lived Token"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Pinterest */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <span>Pinterest API v5</span>
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Board ID</label>
                  <input
                    type="text"
                    value={settings.pinterestBoardId || ''}
                    onChange={(e) => setSettings({ ...settings, pinterestBoardId: e.target.value })}
                    placeholder="Board ID"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Access Token</label>
                  <input
                    type="password"
                    value={settings.pinterestAccessToken || ''}
                    onChange={(e) => setSettings({ ...settings, pinterestAccessToken: e.target.value })}
                    placeholder="Bearer Token"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin text-slate-950" />}
              <span>{saving ? 'Saving...' : 'Save API Settings'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Manual Syndication Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-5 space-y-4">
        <h4 className="text-base font-bold text-white">Live Articles Syndication Log</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Sport</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Syndicate Now</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {posts.slice(0, 10).map((post) => (
                <tr key={post.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-semibold text-white max-w-sm truncate">{post.title}</td>
                  <td className="py-3 px-4 uppercase font-bold text-[10px] text-emerald-400">{post.sport}</td>
                  <td className="py-3 px-4 text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleSyndicatePost(post.id)}
                      disabled={syndicatingPostId === post.id}
                      className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition disabled:opacity-50 inline-flex items-center gap-1"
                    >
                      {syndicatingPostId === post.id ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Pushing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          <span>Syndicate</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
