'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
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
  Loader2,
} from 'lucide-react';
import RichPostEditor from '@/components/RichPostEditor';

export default function AdminPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { loadAllData, setStatusMessage, handleSyndicatePost, syndicatingPostId } = useAdmin();
  const slug = params?.slug as string;

  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editSport, setEditSport] = useState('');
  const [editStatus, setEditStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [editContent, setEditContent] = useState('');
  const [editKeywords, setEditKeywords] = useState('');
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
        setEditKeywords(found.seoKeywords || '');
      } else {
        setError('Article not found.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load post.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Save changes
  const handleSave = async () => {
    if (!post) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: post.id,
          title: editTitle,
          summary: editSummary,
          sport: editSport,
          status: editStatus,
          content: editContent,
          seoKeywords: editKeywords,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Article successfully updated!');
        setPost(data.post);
        setIsEditing(false);
        setStatusMessage({ type: 'success', text: `Article "${data.post.title}" updated!` });
        await loadAllData();
      } else {
        setError(data.error || 'Failed to update article.');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating article.');
    } finally {
      setSaving(false);
    }
  };

  // Delete post
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this article? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id }),
      });

      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Article deleted.' });
        await loadAllData();
        router.push('/admin/posts');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete post.');
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting post.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <span className="text-xs text-slate-400">Loading article details...</span>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Article Not Found</h3>
        <p className="text-xs text-slate-400">{error}</p>
        <Link
          href="/admin/posts"
          className="inline-block px-4 py-2 rounded-xl bg-slate-800 text-xs text-white font-bold hover:bg-slate-700"
        >
          Return to Post Management
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <Link
          href="/admin/posts"
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
              Cancel Editing
            </button>
          )}

          <button
            onClick={() => handleSyndicatePost(post.id)}
            disabled={syndicatingPostId === post.id}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition disabled:opacity-50"
          >
            {syndicatingPostId === post.id ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
            )}
            <span>{syndicatingPostId === post.id ? 'Syndicating...' : 'Syndicate & IndexNow'}</span>
          </button>

          <Link
            href={`/post/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live Preview
          </Link>

          <button
            disabled={deleting}
            onClick={handleDelete}
            className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 transition disabled:opacity-50"
            title="Delete article"
          >
            {deleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Form Mode */}
      {isEditing ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-emerald-400" />
              <span>Editing Article</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">ID: {post.id}</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Headline / Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Sport</label>
                <select
                  value={editSport}
                  onChange={(e) => setEditSport(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="football">Football (Soccer)</option>
                  <option value="nba">NBA Basketball</option>
                  <option value="nfl">NFL Football</option>
                  <option value="ufc">UFC & Boxing</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="PUBLISHED">Published (Live Online)</option>
                  <option value="DRAFT">Draft (Unpublished)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Meta Summary</label>
              <textarea
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">SEO Keywords</label>
              <input
                type="text"
                value={editKeywords}
                onChange={(e) => setEditKeywords(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Article Content (Rich Editor)</label>
              <RichPostEditor value={editContent} onChange={setEditContent} />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* View Mode */
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-950 border border-slate-800 text-emerald-400">
                {post.sport}
              </span>
              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                  post.status === 'PUBLISHED'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                {post.status}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Slug: /{post.slug}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white">{post.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{post.summary}</p>

            <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Created {new Date(post.createdAt).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>{post.views || 0} organic reads</span>
              </span>
              {post.seoKeywords && (
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate max-w-xs">{post.seoKeywords}</span>
                </span>
              )}
            </div>
          </div>

          {post.featuredImage && (
            <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-video max-h-80 bg-slate-950">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* HTML Preview Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
              Rendered Content Preview
            </h3>
            <div
              className="prose prose-invert prose-emerald max-w-none text-xs text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
