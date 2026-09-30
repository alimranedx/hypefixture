'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import RichPostEditor from '@/components/RichPostEditor';
import {
  ArrowLeft,
  Save,
  Globe,
  Tag,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
} from 'lucide-react';

const PRESET_SPORTS_IMAGES = {
  football: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
  nfl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1200&q=80',
  nba: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
  ufc: 'https://images.unsplash.com/photo-1517438322307-e67111335449?auto=format&fit=crop&w=1200&q=80',
};

export default function CreateNewPostPage() {
  const router = useRouter();
  const { loadAllData, setStatusMessage } = useAdmin();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [sport, setSport] = useState('football');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [summary, setSummary] = useState('');
  const [featuredImage, setFeaturedImage] = useState(PRESET_SPORTS_IMAGES.football);
  const [content, setContent] = useState('<h2>Matchday Broadcast Overview</h2>\n<p>Enter your comprehensive match analysis, predicted lineups, and verified live stream channels here.</p>');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [matchDate, setMatchDate] = useState(new Date().toISOString().slice(0, 16));

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate slug from title unless manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  const handleSportChange = (newSport: string) => {
    setSport(newSport);
    if (!featuredImage || Object.values(PRESET_SPORTS_IMAGES).includes(featuredImage)) {
      setFeaturedImage((PRESET_SPORTS_IMAGES as any)[newSport] || PRESET_SPORTS_IMAGES.football);
    }
  };

  const handleSubmit = async (submitStatus?: 'PUBLISHED' | 'DRAFT') => {
    setError('');
    if (!title.trim()) {
      setError('Please provide an article title.');
      return;
    }

    const postStatus = submitStatus || status;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          sport,
          status: postStatus,
          summary,
          content,
          featuredImage,
          seoKeywords,
          matchDate,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: `Article "${data.post.title}" successfully created and saved as ${postStatus}!`,
        });
        await loadAllData();
        router.push('/admin/posts');
      } else {
        setError(data.error || 'Failed to create article.');
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link href="/admin/posts" className="hover:text-emerald-400">
                Articles
              </Link>
              <span>/</span>
              <span className="text-white font-medium">New Article</span>
            </div>
            <h2 className="text-lg font-black text-white mt-0.5">Compose New Sports SEO Guide</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit('DRAFT')}
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Save as Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{submitting ? 'Publishing...' : 'Publish to Live Site'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Title, Content Editor, FAQs (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Headline / Article Title <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Where to Watch Real Madrid vs Barcelona Live: TV Channels & Global Stream Guide"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-bold placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 flex items-center justify-between">
                <span>URL Slug (Permalink)</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  Auto-formatted for clean search engine indexing
                </span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono">hypefixture.com/post/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setIsSlugManual(true);
                  }}
                  placeholder="real-madrid-vs-barcelona-live-stream"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 flex items-center justify-between">
                <span>Google Meta Summary (150-160 chars)</span>
                <span className={`text-[10px] ${summary.length > 160 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                  {summary.length} / 160 chars
                </span>
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                placeholder="High-CTR Google search description highlighting TV networks, live stream apps, and kickoff times..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Rich Content Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm">Full Article Content & Broadcast Guide</h3>
                <p className="text-[11px] text-slate-400">
                  Include H2/H3 headings, broadcaster tables, tactical storylines, and streaming links.
                </p>
              </div>
            </div>

            <RichPostEditor value={content} onChange={(val) => setContent(val)} />
          </div>
        </div>

        {/* Right Column: Metadata, Sport, Status, Photography (1 Col) */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
              Publishing & Categorization
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5">Sport Category</label>
              <select
                value={sport}
                onChange={(e) => handleSportChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="football">Football (Soccer)</option>
                <option value="nba">NBA Basketball</option>
                <option value="nfl">NFL American Football</option>
                <option value="ufc">UFC & Boxing</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5">Publish Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="PUBLISHED">Published (Live Online)</option>
                <option value="DRAFT">Draft (Under Review)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>Match Kickoff Time</span>
              </label>
              <input
                type="datetime-local"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-slate-500" />
                <span>SEO Keywords (Comma Separated)</span>
              </label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="where to watch, live stream, kickoff time"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Featured Matchday Photography</span>
            </h3>

            {featuredImage && (
              <div className="relative rounded-xl overflow-hidden border border-slate-800 aspect-video bg-slate-950">
                <img
                  src={featuredImage}
                  alt="Featured preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Image URL</label>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Quick Sports Presets
              </span>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(PRESET_SPORTS_IMAGES).map(([sportKey, url]) => (
                  <button
                    key={sportKey}
                    type="button"
                    onClick={() => setFeaturedImage(url)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold capitalize transition truncate ${
                      featuredImage === url
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sportKey}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
