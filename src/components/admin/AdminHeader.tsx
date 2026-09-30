'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  FilePlus,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminHeader() {
  const pathname = usePathname();
  const {
    generatingAi,
    handleGeneratePosts,
    statusMessage,
    setStatusMessage,
    generationProgress,
    setGenerationProgress,
  } = useAdmin();

  // Determine current page title & metadata based on route
  const getPageInfo = () => {
    if (pathname === '/admin/dashboard' || pathname === '/admin/overview') {
      return {
        title: 'Senior Sports CMS Overview',
        subtitle: 'System health • Autonomous cluster pipeline • Real-time traffic',
      };
    }
    if (pathname === '/admin/ai-studio') {
      return {
        title: 'AI Editorial Studio & Cluster Engine',
        subtitle: 'Autonomous publishing • Gemini Cascade (3.8 ➔ 3.5) • Multi-Sport Live Coverage',
      };
    }
    if (pathname === '/admin/posts') {
      return {
        title: 'Post Management & Article CMS',
        subtitle: 'Live match guides, SEO articles, drafts, and schedule directory',
      };
    }
    if (pathname === '/admin/posts/new') {
      return {
        title: 'Create New Sports Article',
        subtitle: 'Compose, format with rich media, and instantly publish or save as draft',
      };
    }
    if (pathname.startsWith('/admin/posts/') || pathname.startsWith('/admin/post/')) {
      return {
        title: 'Edit Sports Article',
        subtitle: 'Modify headline, broadcast guide table, FAQs, and SEO metadata',
      };
    }
    if (pathname === '/admin/keywords') {
      return {
        title: 'High-CPC Keyword Research',
        subtitle: 'Discover high-intent sports search terms and trigger targeted AI articles',
      };
    }
    if (pathname === '/admin/serp') {
      return {
        title: 'Website SERP Rank Tracker',
        subtitle: 'Live Google organic rank positions and targeted sports search keywords',
      };
    }
    if (pathname === '/admin/syndication') {
      return {
        title: 'Social & SEO Hub',
        subtitle: 'Instant IndexNow submission to Bing/Yahoo and auto-syndication to social media',
      };
    }
    if (pathname === '/admin/affiliates') {
      return {
        title: 'Ticket Partners & EPC Hub',
        subtitle: 'SeatGeek, StubHub, and Viagogo performance tracking and outbound links',
      };
    }
    if (pathname === '/admin/sports') {
      return {
        title: 'Sports Coverage & Dynamic Categorization',
        subtitle: 'Dynamic sport categories, AI cluster targeting, and editorial coverage',
      };
    }
    if (pathname === '/admin/governance' || pathname === '/admin/security') {
      return {
        title: 'Super Admin Governance & Approvals',
        subtitle: 'Manage administrative roles, pending staff access requests, and security audit',
      };
    }
    return {
      title: 'HypeFixture Admin Control Center',
      subtitle: 'Senior Sports Broadcasting & AI Automation Engine',
    };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-30">
      <header className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">{title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {pathname !== '/admin/posts/new' && (
            <Link
              href="/admin/posts/new"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition"
            >
              <FilePlus className="w-3.5 h-3.5 text-emerald-400" />
              <span>New Article</span>
            </Link>
          )}

          <button
            onClick={() => handleGeneratePosts()}
            disabled={generatingAi}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {generatingAi ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>Generate 5 Posts</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Global Status Notification Bar */}
      {statusMessage && (
        <div className="px-6 pb-3">
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              )}
              <span className="font-semibold">{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="p-1 hover:bg-slate-900 rounded-lg transition"
            >
              <X className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Global AI Progress Tracker Banner */}
      {generationProgress && (
        <div className="px-6 pb-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                {generationProgress.active ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">
                    {generationProgress.active ? 'AI Generation in Progress...' : 'Post Generation Complete!'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {generationProgress.percent}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">{generationProgress.step}</p>
              </div>
            </div>

            {!generationProgress.active && (
              <button
                onClick={() => setGenerationProgress(null)}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 transition"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
