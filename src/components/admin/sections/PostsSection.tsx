'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import {
  Search,
  Plus,
  ExternalLink,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Filter,
  Loader2,
} from 'lucide-react';

export default function PostsSection() {
  const { posts, sports, handleTogglePostStatus, handleDeletePost } = useAdmin();
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [togglingPostId, setTogglingPostId] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const onToggleStatus = async (post: any) => {
    setTogglingPostId(post.id);
    await handleTogglePostStatus(post);
    setTogglingPostId(null);
  };

  const onDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    setDeletingPostId(id);
    await handleDeletePost(id);
    setDeletingPostId(null);
  };

  const filteredPosts = posts.filter((p) => {
    const matchQuery =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.seoKeywords && p.seoKeywords.toLowerCase().includes(search.toLowerCase()));
    const matchSport = sportFilter === 'all' || p.sport.toLowerCase() === sportFilter.toLowerCase();
    return matchQuery && matchSport;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search articles by title, slug, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="all">All Sports</option>
            <option value="football">Football (Soccer)</option>
            <option value="nba">NBA Basketball</option>
            <option value="nfl">NFL Football</option>
            <option value="ufc">UFC & Boxing</option>
          </select>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredPosts.length}</strong> of {posts.length} articles
          </span>

          <Link
            href="/admin/posts/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-500/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Article</span>
          </Link>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Title & Slug</th>
                <th className="py-3.5 px-4">Sport</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Views</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No articles found matching &quot;{search}&quot;. Try adjusting your search query or filters.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="flex items-center gap-3">
                        {post.featuredImage && (
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-800"
                          />
                        )}
                        <div className="truncate">
                          <Link
                            href={`/admin/posts/${post.slug}`}
                            className="font-bold text-white hover:text-emerald-400 transition block truncate text-xs"
                          >
                            {post.title}
                          </Link>
                          <span className="text-[10px] text-slate-500 font-mono block truncate mt-0.5">
                            /{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                        {post.sport}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        disabled={togglingPostId === post.id}
                        onClick={() => onToggleStatus(post)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition flex items-center gap-1 disabled:opacity-60 ${
                          post.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                        }`}
                        title="Click to toggle PUBLISHED / DRAFT"
                      >
                        {togglingPostId === post.id ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : post.status === 'PUBLISHED' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-500" />
                        {post.views || 0}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/post/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                          title="View public live post"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/admin/posts/${post.slug}`}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition"
                          title="Edit article"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          disabled={deletingPostId === post.id}
                          onClick={() => onDeletePost(post.id)}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition disabled:opacity-50"
                          title="Delete article"
                        >
                          {deletingPostId === post.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
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
