'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import {
  ArrowLeft,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Tag,
  Globe,
  Share2,
  Tv,
  Save,
  X,
  Sparkles,
} from 'lucide-react';
import { sanitizeArticleHtml } from '@/lib/sanitize';
import RichPostEditor from '@/components/RichPostEditor';

export default function AdminPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const slug = params?.slug as string;

  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editSport, setEditSport] = useState('');
  const [editStatus, setEditStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  // Load post details
  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/posts?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      const found = data.post || data.posts?.[0];
      if (res.ok && found) {
        setPost(found);
        setEditTitle(found.title);
        setEditSummary(found.summary);
        setEditSport(found.sport);
        setEditStatus(found.status);
        setEditContent(found.content);
      } else {
        setError('Article not found in the CMS database.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching article.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/admin/login');
    } else if (authStatus === 'authenticated') {
      fetchPost();
    }
  }, [authStatus, slug]);

  // Handle Save Edit
  const handleSaveEdit = async () => {
    if (!post) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: post.id,
          title: editTitle,
          summary: editSummary,
          sport: editSport,
          status: editStatus,
          content: editContent,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPost(data.post);
        setIsEditing(false);
        setSuccess('Article updated and saved successfully!');
      } else {
        setError(data.error || 'Failed to update article.');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating article.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!post) return;
    if (!window.confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/posts?id=${post.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/admin/dashboard?tab=posts');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete post.');
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting post.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100">
      {/* Side Nav Bar */}
      <AdminSidebar
        activeTab="posts"
        user={session?.user as any}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl overflow-y-auto">
        {/* Top Breadcrumb & Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <Link
            href="/admin/dashboard?tab=posts"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Post Management
          </Link>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                Edit Article
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition"
              >
                <X className="w-3.5 h-3.5" />
                Cancel Edit
              </button>
            )}

            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-400 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>

            {/* External link to public portal in new tab */}
            {post && (
              <Link
                href={`/post/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 transition"
                title="View public live article in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Public URL ↗
              </Link>
            )}
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading article details from CMS database...</p>
          </div>
        ) : !post ? (
          <div className="py-24 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Post Not Found</h3>
            <p className="text-xs text-slate-400">
              The article with slug &quot;{slug}&quot; could not be found.
            </p>
            <Link
              href="/admin/dashboard?tab=posts"
              className="inline-block px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400"
            >
              Return to Posts
            </Link>
          </div>
        ) : isEditing ? (
          /* ================= INLINE EDIT MODE ================= */
          <div className="mt-6 space-y-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-400" />
                Edit Article: {post.title}
              </h2>
              <span className="text-xs text-slate-500 font-mono">ID: {post.id}</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Headline Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-sm text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Sport Category</label>
                  <select
                    value={editSport}
                    onChange={(e) => setEditSport(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white outline-none"
                  >
                    <option value="football">Football / Soccer</option>
                    <option value="nfl">NFL</option>
                    <option value="nba">NBA</option>
                    <option value="ufc">UFC / Boxing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Publishing Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white outline-none"
                  >
                    <option value="PUBLISHED">Published (Live)</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Summary / SEO Meta Description</label>
                <textarea
                  rows={3}
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">Article Content & Formatting</label>
                  <span className="text-[11px] text-slate-400">Use toolbar to format headings, links, tables & CTA</span>
                </div>
                <RichPostEditor
                  value={editContent}
                  onChange={(val) => setEditContent(val)}
                  rows={14}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving Changes...' : 'Save & Update Article'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ================= POST PREVIEW MODE ================= */
          <div className="mt-6 space-y-8">
            {/* Meta & Status Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
                    {post.sport}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      post.status === 'PUBLISHED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    {post.views || 0} Views
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                {post.title}
              </h1>

              {/* Summary */}
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {post.summary}
              </p>

              {/* Technical / SEO Details Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400 font-mono">
                <div>
                  <span className="text-slate-500 block">CMS Slug:</span>
                  <span className="text-slate-200">/admin/post/{post.slug}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Public URL:</span>
                  <span className="text-emerald-400">/post/{post.slug}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl max-h-96 relative">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-slate-950/80 text-[10px] text-slate-400 font-mono">
                  Curated HD Sports Photography
                </div>
              </div>
            )}

            {/* Rendered HTML Content */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Article Body (Live HTML Output)
                </span>
                <span className="text-xs text-emerald-400 font-bold">
                  Affiliate Redirects Active (/go/affforce, /go/vpn)
                </span>
              </div>

              <div
                className="prose prose-invert prose-emerald max-w-none text-slate-300 leading-relaxed text-sm sm:text-base [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-100 [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4"
                dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(post.content) }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
