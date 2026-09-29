'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Flame,
  LayoutDashboard,
  Sparkles,
  FileText,
  Search,
  TrendingUp,
  DollarSign,
  Shield,
  Crown,
  LogOut,
  RefreshCw,
  Plus,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Globe,
  Tv,
  ArrowUpRight,
  Filter,
  Check,
  X,
  Eye,
  BarChart3,
  Tag,
  Zap,
  Share2,
  Send,
  Clock,
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import RichPostEditor from '@/components/RichPostEditor';

export default function AdminDashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'ai-studio' | 'posts' | 'keywords' | 'serp' | 'syndication' | 'affiliates' | 'security'
  >('overview');

  // Sync tab with URL search parameter if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (
        tab &&
        ['overview', 'ai-studio', 'posts', 'keywords', 'serp', 'syndication', 'affiliates', 'security'].includes(
          tab
        )
      ) {
        setActiveTab(tab as any);
      }
    }
  }, []);

  // State
  const [settings, setSettings] = useState({
    postsPerDay: 10,
    autoPublish: true,
    activeSports: 'football,nba,nfl,ufc',
    affforceUrl: 'https://panel.affforce.com/apply/register-affiliate/',
    vpnUrl: 'https://nordvpn.com',
    fuboUrl: 'https://www.fubo.tv',
    autoShareSocial: false,
    autoIndexNow: true,
    indexNowKey: 'hypefixture-indexnow-2026-key',
    twitterApiKey: '',
    twitterApiSecret: '',
    twitterAccessToken: '',
    twitterAccessSecret: '',
    facebookPageId: '',
    facebookAccessToken: '',
    pinterestAccessToken: '',
    pinterestBoardId: '',
  });

  const [posts, setPosts] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [syndicatingPostId, setSyndicatingPostId] = useState<string | null>(null);
  const [batchIndexing, setBatchIndexing] = useState(false);

  // Filters & Modal
  const [postSearch, setPostSearch] = useState('');
  const [postSportFilter, setPostSportFilter] = useState('all');
  const [editingPost, setEditingPost] = useState<any | null>(null);

  // Keyword modal
  const [newKeyword, setNewKeyword] = useState({ keyword: '', sport: 'football', volume: 50000, intent: 'COMMERCIAL', difficulty: 'MEDIUM' });
  const [showAddKwModal, setShowAddKwModal] = useState(false);

  // Status
  const [loading, setLoading] = useState(true);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [aiTelemetry, setAiTelemetry] = useState<any | null>(null);

  const userRole = (session?.user as any)?.role;
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  // Auth gate
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [authStatus, router]);

  // Load all dashboard data
  const loadAllData = async () => {
    try {
      setLoading(true);
      // Settings
      const setRes = await fetch('/api/admin/settings');
      const setData = await setRes.json();
      if (setData.settings) setSettings(setData.settings);

      // Posts
      const postRes = await fetch('/api/admin/posts');
      const postData = await postRes.json();
      if (postData.posts) setPosts(postData.posts);

      // Keywords
      const kwRes = await fetch('/api/admin/keywords');
      const kwData = await kwRes.json();
      if (kwData.keywords) setKeywords(kwData.keywords);

      // Affiliates
      const affRes = await fetch('/api/admin/affiliates');
      const affData = await affRes.json();
      if (affData.partners) setAffiliates(affData.partners);

      // Super admin list
      if (isSuperAdmin) {
        const admRes = await fetch('/api/admin/users');
        const admData = await admRes.json();
        if (admData.admins) setAdminsList(admData.admins);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus === 'authenticated') {
      loadAllData();
    }
  }, [authStatus, isSuperAdmin]);

  // Live Generation Progress State
  const [generationProgress, setGenerationProgress] = useState<{
    active: boolean;
    step: string;
    percent: number;
    newPosts: any[];
  } | null>(null);

  // Generate 5-Post AI Cluster with live progress tracking
  const handleGenerateAiPosts = async () => {
    setGeneratingAi(true);
    setStatusMessage(null);
    setGenerationProgress({
      active: true,
      step: 'Scanning global sports calendar for vital marquee matches (Football, NFL, NBA, UFC)...',
      percent: 25,
      newPosts: [],
    });

    const timer1 = setTimeout(() => {
      setGenerationProgress((prev) =>
        prev
          ? {
              ...prev,
              step: 'Querying Gemini AI for top trending hype topics & filtering out existing posts...',
              percent: 55,
            }
          : null
      );
    }, 1000);

    const timer2 = setTimeout(() => {
      setGenerationProgress((prev) =>
        prev
          ? {
              ...prev,
              step: 'Assigning HD sports photography & generating Schema.org SportsEvent metadata...',
              percent: 80,
            }
          : null
      );
    }, 2200);

    try {
      const res = await fetch('/api/admin/generate-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: settings.postsPerDay, autoPublish: settings.autoPublish }),
      });
      const data = await res.json();
      clearTimeout(timer1);
      clearTimeout(timer2);

      if (res.ok) {
        if (data.telemetry) {
          setAiTelemetry(data.telemetry);
        }
        setGenerationProgress({
          active: false,
          step: `Complete! Generated and published ${data.count} fresh vital sports articles with HD photography.`,
          percent: 100,
          newPosts: data.posts || [],
        });
        setStatusMessage({
          type: 'success',
          text: data.message || `⚡ Gemini created ${data.count} new vital sports articles with HD photography!`,
        });
        loadAllData();
      } else {
        setGenerationProgress(null);
        setStatusMessage({ type: 'error', text: data.error || 'Generation failed' });
      }
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setGenerationProgress(null);
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setGeneratingAi(false);
    }
  };

  // Generate Post From Keyword
  const handleGenerateForKeyword = async (keyword: string, sport: string) => {
    setGeneratingAi(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'GENERATE_FOR_KEYWORD', keyword, sport }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `Targeted SEO article generated for: "${keyword}"` });
        loadAllData();
        setActiveTab('posts');
      } else {
        setStatusMessage({ type: 'error', text: data.error });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setGeneratingAi(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Settings saved in MySQL.' });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message });
    }
  };

  // Update Post (Save edit)
  const handleSavePostEdit = async () => {
    if (!editingPost) return;
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPost),
      });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Article updated successfully!' });
        setEditingPost(null);
        loadAllData();
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  // Toggle Post Status
  const handleTogglePostStatus = async (post: any) => {
    const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id, status: newStatus }),
      });
      if (res.ok) {
        loadAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Post
  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Super Admin action
  const handleAdminAction = async (adminId: string, action: 'APPROVE' | 'REVOKE' | 'DELETE') => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: data.message });
        loadAllData();
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  // Syndicate a single post to all channels
  const handleSyndicatePost = async (postId: string) => {
    try {
      setSyndicatingPostId(postId);
      const res = await fetch('/api/admin/syndicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: `Syndicated article! IndexNow: ${data.report?.indexNow?.success ? '✅ Pushed' : '⚠️ ' + (data.report?.indexNow?.message || 'Queued')}`,
        });
        loadAllData();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Syndication failed.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Syndication request failed.' });
    } finally {
      setSyndicatingPostId(null);
    }
  };

  // Batch IndexNow push for all published posts
  const handleBatchIndexNow = async () => {
    try {
      setBatchIndexing(true);
      const res = await fetch('/api/admin/syndicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'BATCH_INDEXNOW' }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: data.message || 'Successfully submitted all URLs to IndexNow!' });
        loadAllData();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'IndexNow push failed.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setBatchIndexing(false);
    }
  };

  // Save Social & SEO settings
  const handleSaveSocialSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Social media API keys & syndication settings saved successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save settings.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  // Filtered Posts
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.summary.toLowerCase().includes(postSearch.toLowerCase());
    const matchesSport = postSportFilter === 'all' || p.sport === postSportFilter;
    return matchesSearch && matchesSport;
  });

  // Calculate totals
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalClicks = affiliates.reduce((sum, a) => sum + (a.clicks || 0), 0);
  const top10Keywords = keywords.filter((k) => k.currentRank && k.currentRank <= 10).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Side Nav Bar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        postCount={posts.length}
        keywordCount={keywords.length}
        pendingAdminCount={adminsList.filter((a) => !a.isApproved && a.role === 'ADMIN').length}
        generatingAi={generatingAi}
        onGenerateAi={handleGenerateAiPosts}
        user={session?.user as any}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header of Main Area */}
        <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-black text-white capitalize">
                {activeTab === 'overview' && 'Senior Sports CMS Overview'}
                {activeTab === 'ai-studio' && 'AI Editorial Studio & Cluster Engine'}
                {activeTab === 'posts' && 'Post Management & Article CMS'}
                {activeTab === 'keywords' && 'High-CPC Keyword Research'}
                {activeTab === 'serp' && 'Website SERP Rank Tracker'}
                {activeTab === 'affiliates' && 'Affiliate Conversions & EPC Hub'}
                {activeTab === 'security' && 'Super Admin Governance & Approvals'}
              </h1>
              <p className="text-xs text-slate-400">
                Autonomous publishing • Gemini 3.8 Flash • Multi-Sport Live Coverage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateAiPosts}
              disabled={generatingAi}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {generatingAi ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  Generate 5 Posts
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-8 max-w-7xl w-full">
        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)}>
              <X className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>
          </div>
        )}

        {/* LIVE AI GENERATION PROGRESS TRACKER */}
        {generationProgress && (
          <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  {generationProgress.active ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">
                      {generationProgress.active ? 'AI Post Generation in Progress...' : 'Post Generation Complete!'}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {generationProgress.percent}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{generationProgress.step}</p>
                </div>
              </div>
              {!generationProgress.active && (
                <button
                  onClick={() => setGenerationProgress(null)}
                  className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 transition"
                >
                  Dismiss Progress
                </button>
              )}
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${generationProgress.percent}%` }}
              />
            </div>

            {/* Newly Created Articles Cards */}
            {generationProgress.newPosts.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Freshly Generated Articles ({generationProgress.newPosts.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generationProgress.newPosts.map((np: any) => (
                    <div
                      key={np.id || np.slug}
                      className="bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-3 flex gap-3 items-center group shadow-md transition"
                    >
                      {np.featuredImage && (
                        <img
                          src={np.featuredImage}
                          alt={np.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800"
                        />
                      )}
                      <div className="space-y-1 min-w-0">
                        <span className="text-[9px] uppercase font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {np.sport}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition">
                          {np.title}
                        </h4>
                        <Link
                          href={`/admin/post/${np.slug}`}
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          View & Edit in Admin <ArrowUpRight className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Telemetry & Network Verification Box */}
            {aiTelemetry && (
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 space-y-3 mt-4">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-white">Google Gemini AI Telemetry & Network Proof</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                    {aiTelemetry.source === 'GOOGLE_GEMINI_LIVE' ? 'LIVE GOOGLE GEMINI API' : 'DYNAMIC CLUSTER ENGINE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">AI Engine & Model</span>
                    <span className="font-bold text-white font-mono">{aiTelemetry.model}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Roundtrip Latency</span>
                    <span className="font-bold text-emerald-400 font-mono">{aiTelemetry.latencyMs} ms</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">API Key Authenticated</span>
                    <span className="font-bold text-slate-300 font-mono">{aiTelemetry.apiKeyPreview}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Verified Timestamp</span>
                    <span className="font-bold text-slate-300 font-mono">{new Date(aiTelemetry.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                {aiTelemetry.error && (
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px]">
                    Note: {aiTelemetry.error}
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <span>🔍 How to inspect this in Chrome DevTools:</span>
                  </div>
                  <p>
                    Open DevTools (<code className="text-emerald-400">F12</code>) &rarr; Click <code className="text-emerald-400">Network</code> &rarr; Filter <code className="text-emerald-400">Fetch/XHR</code> &rarr; Click <code className="text-emerald-400">generate-posts</code> &rarr; Select the <code className="text-emerald-400">Response</code> or <code className="text-emerald-400">Preview</code> tab to see the live JSON response containing this telemetry object directly from the server.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- 1. OVERVIEW TAB ---------------- */}
        {activeTab === 'overview' && (
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
                <span className="text-[11px] text-slate-400 font-medium">Out of {keywords.length} tracked keywords</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Affiliate Outbound Clicks</span>
                  <Tv className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-purple-400">{totalClicks}</div>
                <span className="text-[11px] text-slate-400 font-medium">Across CPA & VPN channels</span>
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
                  Every day at 06:00 AM, Gemini identifies today's vital sports fixtures across Premier League, NFL, NBA,
                  and UFC. It generates an inter-linked topical cluster (Where to watch guide + predicted lineups + head-to-head stats + VPN streaming pass).
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleGenerateAiPosts}
                    disabled={generatingAi}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow"
                  >
                    {generatingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    Trigger Today's Posts Now
                  </button>
                  <button
                    onClick={() => setActiveTab('ai-studio')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    Adjust AI Quota & Tone &rarr;
                  </button>
                </div>
              </div>

              {/* Monetization Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" /> Top Affiliate Partners
                  </h3>
                  <button
                    onClick={() => setActiveTab('affiliates')}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Manage
                  </button>
                </div>
                <div className="space-y-3 text-xs">
                  {affiliates.map((aff) => (
                    <div
                      key={aff.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-white block">{aff.name}</span>
                        <span className="text-[10px] text-slate-400">{aff.payout}</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">{aff.clicks} clicks</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 2. AI EDITORIAL STUDIO TAB ---------------- */}
        {activeTab === 'ai-studio' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    AI Editorial & Automation Controls
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Control how Gemini discovers vital matches and schedules daily content clusters.
                  </p>
                </div>
                <button
                  onClick={handleGenerateAiPosts}
                  disabled={generatingAi}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-2"
                >
                  {generatingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  Generate {settings.postsPerDay} Posts Now
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Daily Articles Quota
                    </label>
                    <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {settings.postsPerDay} Posts / Day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings.postsPerDay}
                    onChange={(e) => setSettings({ ...settings, postsPerDay: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Generates inter-linked articles matching real-time Google search demand for live games.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                    Publishing Workflow
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, autoPublish: true })}
                      className={`p-3.5 rounded-xl border text-xs font-bold text-left transition ${
                        settings.autoPublish
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      ⚡ Auto-Publish Directly to Live Site
                      <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                        Instantly indexed in sitemap.xml
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, autoPublish: false })}
                      className={`p-3.5 rounded-xl border text-xs font-bold text-left transition ${
                        !settings.autoPublish
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      📝 Save into Drafts Queue
                      <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                        Editorial staff reviews before publishing
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Active Sports Coverage
                  </label>
                  <input
                    type="text"
                    value={settings.activeSports}
                    onChange={(e) => setSettings({ ...settings, activeSports: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                >
                  Save Configuration
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ---------------- 3. POST MANAGEMENT CMS TAB ---------------- */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search articles by title or keyword..."
                    value={postSearch}
                    onChange={(e) => setPostSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <select
                  value={postSportFilter}
                  onChange={(e) => setPostSportFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="all">All Sports</option>
                  <option value="football">Football</option>
                  <option value="nba">NBA</option>
                  <option value="nfl">NFL</option>
                  <option value="ufc">UFC</option>
                </select>
              </div>

              <div className="text-xs text-slate-400">
                Showing <strong>{filteredPosts.length}</strong> articles
              </div>
            </div>

            {/* Posts Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Title & Slug</th>
                    <th className="py-3 px-4">Sport</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          {post.featuredImage && (
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-800"
                            />
                          )}
                          <div className="min-w-0">
                            <Link
                              href={`/admin/post/${post.slug}`}
                              className="font-semibold text-white block truncate hover:text-emerald-400 transition"
                            >
                              {post.title}
                            </Link>
                            <span className="text-[10px] text-slate-500 truncate block">/admin/post/{post.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 uppercase font-bold text-[10px] text-emerald-400">
                        {post.sport}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePostStatus(post)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                            post.status === 'PUBLISHED'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {post.status}
                        </button>
                      </td>
                      <td className="py-3 px-4">{post.views || 0}</td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Quick Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/admin/post/${post.slug}`}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 inline-block"
                          title="Inspect & Edit in Admin"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1 rounded bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                          title="Delete Post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Inline Post Editor Modal */}
            {editingPost && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-white text-base">Edit Article</h3>
                    <button onClick={() => setEditingPost(null)}>
                      <X className="w-5 h-5 text-slate-400 hover:text-white" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Headline / Title</label>
                      <input
                        type="text"
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Meta Description / Summary</label>
                      <textarea
                        rows={2}
                        value={editingPost.summary}
                        onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-bold text-slate-300">HTML Content & Formatting</label>
                        <span className="text-[11px] text-slate-400">Use toolbar to format headings, links, tables & CTA</span>
                      </div>
                      <RichPostEditor
                        value={editingPost.content}
                        onChange={(val) => setEditingPost({ ...editingPost, content: val })}
                        rows={8}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => setEditingPost(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePostEdit}
                        className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- 4. KEYWORD RESEARCH TAB ---------------- */}
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-emerald-400" />
                  Sports Keyword Intelligence & Hype Discovery
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Identify high-volume matchday queries and trigger specialized AI articles with 1 click.
                </p>
              </div>

              <button
                onClick={() => setShowAddKwModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Keyword
              </button>
            </div>

            {/* Keyword Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Target Keyword</th>
                    <th className="py-3 px-4">Sport</th>
                    <th className="py-3 px-4">Search Intent</th>
                    <th className="py-3 px-4">Monthly Volume</th>
                    <th className="py-3 px-4">Keyword Difficulty</th>
                    <th className="py-3 px-4">Current SERP</th>
                    <th className="py-3 px-4 text-right">Editorial Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {keywords.map((kw) => (
                    <tr key={kw.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-semibold text-white max-w-xs">{kw.keyword}</td>
                      <td className="py-3 px-4 uppercase font-bold text-[10px] text-emerald-400">
                        {kw.sport}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                          {kw.intent}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{kw.volume.toLocaleString()}/mo</td>
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4">
                        {kw.currentRank ? (
                          <span className="font-bold text-emerald-400">#{kw.currentRank} on Google</span>
                        ) : (
                          <span className="text-slate-500">Unranked</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleGenerateForKeyword(kw.keyword, kw.sport)}
                          disabled={generatingAi}
                          className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition"
                        >
                          ⚡ Write Post
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- 5. SERP RANKING LIST TAB ---------------- */}
        {activeTab === 'serp' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Website Organic Search Ranking Positions
              </h3>
              <p className="text-xs text-slate-400">
                Live Google Search Console position tracking for top money keywords and streaming queries.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Top 3 Positions</span>
                  <div className="text-2xl font-black text-emerald-400">
                    {keywords.filter((k) => k.currentRank && k.currentRank <= 3).length} Keywords
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Positions 4 - 10</span>
                  <div className="text-2xl font-black text-blue-400">
                    {keywords.filter((k) => k.currentRank && k.currentRank > 3 && k.currentRank <= 10).length} Keywords
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Average CTR</span>
                  <div className="text-2xl font-black text-purple-400">8.4%</div>
                </div>
              </div>
            </div>

            {/* Rank Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Search Query</th>
                    <th className="py-3 px-4">Ranking URL</th>
                    <th className="py-3 px-4">Current Rank</th>
                    <th className="py-3 px-4">Best Rank</th>
                    <th className="py-3 px-4">Estimated Monthly Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {keywords
                    .filter((k) => k.currentRank)
                    .map((kw) => (
                      <tr key={kw.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-semibold text-white">{kw.keyword}</td>
                        <td className="py-3 px-4 text-emerald-400 font-mono text-[11px]">
                          {kw.targetSlug ? (
                            <Link href={`/admin/post/${kw.targetSlug}`} className="hover:underline flex items-center gap-1">
                              /admin/post/{kw.targetSlug} <ArrowUpRight className="w-2.5 h-2.5" />
                            </Link>
                          ) : (
                            '/match/*'
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-xs">
                            Position #{kw.currentRank}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">#{kw.bestRank || kw.currentRank}</td>
                        <td className="py-3 px-4 font-bold text-slate-200">
                          {Math.round(kw.volume * (1 / (kw.currentRank || 10)) * 0.15).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- SOCIAL MEDIA & INSTANT SEO INDEXING HUB ---------------- */}
        {activeTab === 'syndication' && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      Social Syndication & Search Engine Indexing Hub
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Automatically syndicate matchday guides to Twitter/X, Facebook, and Pinterest. Push sub-minute IndexNow pings to Bing & Yahoo to rank before kickoff.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBatchIndexNow}
                  disabled={batchIndexing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30"
                >
                  <Send className={`w-3.5 h-3.5 ${batchIndexing ? 'animate-spin' : ''}`} />
                  <span>{batchIndexing ? 'Pushing to Search Engines...' : 'Push All URLs to IndexNow'}</span>
                </button>
              </div>
            </div>

            {/* Quick Automation & Configuration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: 10-Post Engine Automation */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Publishing Velocity
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    Gemini 3.8 Flash
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Target Posts Per Day</label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={settings.postsPerDay}
                    onChange={(e) => setSettings({ ...settings, postsPerDay: parseInt(e.target.value) || 10 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Autonomous cluster covering Football, NFL, NBA, and UFC/Boxing.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoIndexNow}
                      onChange={(e) => setSettings({ ...settings, autoIndexNow: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
                    />
                    <span className="text-slate-300 font-semibold">Auto-Push to IndexNow (Bing/Yahoo)</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoShareSocial}
                      onChange={(e) => setSettings({ ...settings, autoShareSocial: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
                    />
                    <span className="text-slate-300 font-semibold">Auto-Share to Social Media</span>
                  </label>
                </div>

                <button
                  onClick={handleSaveSocialSettings}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded-xl transition border border-slate-700"
                >
                  Save Automation Rules
                </button>
              </div>

              {/* Card 2: Instant Search Indexing Stats */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Instant Search Engine Push
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-500/30">
                    IndexNow API
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Published Posts</span>
                    <span className="text-xl font-black text-white">
                      {posts.filter((p) => p.status === 'PUBLISHED').length}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">IndexNow Pushed</span>
                    <span className="text-xl font-black text-indigo-400">
                      {posts.filter((p) => p.indexedBing).length}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">IndexNow Key</label>
                  <input
                    type="text"
                    value={settings.indexNowKey || ''}
                    onChange={(e) => setSettings({ ...settings, indexNowKey: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Verified automatically via <code className="text-slate-400">/{settings.indexNowKey || 'key'}.txt</code>
                  </span>
                </div>
              </div>

              {/* Card 3: 1-Click Launch Action */}
              <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Flame className="w-4 h-4 fill-emerald-400" />
                    <span>Instant Execution Engine</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Trigger 10 Matchday Posts Now</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Prompts Gemini 3.8 Flash to write 10 high-CTR articles with broadcaster tables and auto-submits them to search engines.
                  </p>
                </div>

                <button
                  onClick={handleGenerateAiPosts}
                  disabled={generatingAi}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  {generatingAi ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating Cluster...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      <span>Generate 10 Posts & Syndicate</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Media API Credentials Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    Social Media API Integration Credentials
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Paste your API keys below. The autonomous engine will post matchday guides directly to your pages and boards.
                  </p>
                </div>

                <button
                  onClick={handleSaveSocialSettings}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20"
                >
                  Save API Keys
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Twitter / X */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                    <span className="w-7 h-7 rounded-lg bg-sky-500/20 flex items-center justify-center font-black">X</span>
                    <span>Twitter / X API (v2)</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">API Key (Consumer Key)</label>
                      <input
                        type="text"
                        value={settings.twitterApiKey || ''}
                        onChange={(e) => setSettings({ ...settings, twitterApiKey: e.target.value })}
                        placeholder="e.g. 7q8XyZ..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">API Secret</label>
                      <input
                        type="password"
                        value={settings.twitterApiSecret || ''}
                        onChange={(e) => setSettings({ ...settings, twitterApiSecret: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Access Token</label>
                      <input
                        type="text"
                        value={settings.twitterAccessToken || ''}
                        onChange={(e) => setSettings({ ...settings, twitterAccessToken: e.target.value })}
                        placeholder="e.g. 12345-..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Access Secret</label>
                      <input
                        type="password"
                        value={settings.twitterAccessSecret || ''}
                        onChange={(e) => setSettings({ ...settings, twitterAccessSecret: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Get keys at developer.x.com</span>
                </div>

                {/* Facebook */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <span className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center font-black">f</span>
                    <span>Facebook Graph API</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Facebook Page ID</label>
                      <input
                        type="text"
                        value={settings.facebookPageId || ''}
                        onChange={(e) => setSettings({ ...settings, facebookPageId: e.target.value })}
                        placeholder="e.g. 1092837465..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Page Access Token</label>
                      <input
                        type="password"
                        value={settings.facebookAccessToken || ''}
                        onChange={(e) => setSettings({ ...settings, facebookAccessToken: e.target.value })}
                        placeholder="Long-lived page token..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Get keys at developers.facebook.com</span>
                </div>

                {/* Pinterest */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <span className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center font-black">P</span>
                    <span>Pinterest API v5</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Pinterest Board ID</label>
                      <input
                        type="text"
                        value={settings.pinterestBoardId || ''}
                        onChange={(e) => setSettings({ ...settings, pinterestBoardId: e.target.value })}
                        placeholder="e.g. 839201928374..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Access Token</label>
                      <input
                        type="password"
                        value={settings.pinterestAccessToken || ''}
                        onChange={(e) => setSettings({ ...settings, pinterestAccessToken: e.target.value })}
                        placeholder="Bearer token..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Get keys at developers.pinterest.com</span>
                </div>
              </div>
            </div>

            {/* Live Post Syndication & Backlinking Status Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white">Live Matchday Articles Syndication Log</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click &quot;Syndicate&quot; on any article to manually push to IndexNow and dispatch social media posts.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">Total: {posts.length} articles</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Article Title</th>
                      <th className="py-3 px-4">Sport</th>
                      <th className="py-3 px-4">IndexNow (Bing)</th>
                      <th className="py-3 px-4">Twitter / X</th>
                      <th className="py-3 px-4">Facebook</th>
                      <th className="py-3 px-4">Pinterest</th>
                      <th className="py-3 px-4 text-right">Syndicate Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-semibold text-white max-w-xs truncate">
                          <Link href={`/admin/post/${post.slug}`} className="hover:text-emerald-400 transition">
                            {post.title}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded uppercase font-bold text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                            {post.sport}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {post.indexedBing ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
                              <Check className="w-3 h-3" /> Indexed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500 font-medium bg-slate-950 px-2 py-0.5 rounded text-[10px]">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {post.sharedTwitter ? (
                            <span className="inline-flex items-center gap-1 text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30 text-[10px]">
                              <Check className="w-3 h-3" /> Shared
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">Not sent</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {post.sharedFacebook ? (
                            <span className="inline-flex items-center gap-1 text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30 text-[10px]">
                              <Check className="w-3 h-3" /> Shared
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">Not sent</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {post.sharedPinterest ? (
                            <span className="inline-flex items-center gap-1 text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 text-[10px]">
                              <Check className="w-3 h-3" /> Pinned
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">Not sent</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleSyndicatePost(post.id)}
                            disabled={syndicatingPostId === post.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs transition disabled:opacity-50"
                          >
                            <Send className={`w-3 h-3 ${syndicatingPostId === post.id ? 'animate-spin' : ''}`} />
                            <span>{syndicatingPostId === post.id ? 'Syndicating...' : 'Syndicate ⚡'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 6. AFFILIATE & EPC HUB TAB ---------------- */}
        {activeTab === 'affiliates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Affiliate Monetization & Cloaked Link Router
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage outbound affiliate redirect hops (<code className="text-emerald-400">/go/[slug]</code>) protected with{' '}
                  <code className="text-emerald-400">noindex, nofollow</code> headers.
                </p>
              </div>
            </div>

            {/* Partner Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {affiliates.map((aff) => (
                <div key={aff.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-bold text-[10px] uppercase border border-slate-700">
                      {aff.category}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">{aff.status}</span>
                  </div>

                  <h4 className="text-base font-bold text-white">{aff.name}</h4>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Cloaked Route:</span>
                      <code className="text-emerald-400 font-bold">/go/{aff.slug}</code>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Payout Rate:</span>
                      <span className="text-white font-medium">{aff.payout}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Total Clicks:</span>
                      <span className="font-mono text-emerald-400 font-bold">{aff.clicks}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Destination URL</label>
                    <input
                      type="text"
                      defaultValue={aff.targetUrl}
                      onBlur={async (e) => {
                        const targetUrl = e.target.value;
                        await fetch('/api/admin/affiliates', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ ...aff, targetUrl }),
                        });
                        setStatusMessage({ type: 'success', text: `Updated ${aff.name} destination URL!` });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 7. SUPER ADMIN SECURITY TAB ---------------- */}
        {activeTab === 'security' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="bg-slate-900 border-2 border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Staff Approvals & Governance</h3>
                  <p className="text-xs text-slate-400">
                    Newly registered admins are blocked from logging in until approved here.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Admin Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Registered Date</th>
                      <th className="py-3 px-4 text-right">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {adminsList.map((adm) => (
                      <tr key={adm.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-semibold text-white">{adm.name || 'Unnamed Admin'}</td>
                        <td className="py-3 px-4 font-mono text-slate-300">{adm.email}</td>
                        <td className="py-3 px-4">
                          {adm.isApproved ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 text-[10px]">
                              <AlertCircle className="w-3 h-3" /> Pending Approval
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(adm.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {adm.role !== 'SUPER_ADMIN' && (
                            <>
                              {!adm.isApproved ? (
                                <button
                                  onClick={() => handleAdminAction(adm.id, 'APPROVE')}
                                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                                >
                                  Approve Admin
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAdminAction(adm.id, 'REVOKE')}
                                  className="px-2.5 py-1 bg-slate-800 text-amber-400 rounded-lg text-xs border border-slate-700"
                                >
                                  Revoke Access
                                </button>
                              )}
                              <button
                                onClick={() => handleAdminAction(adm.id, 'DELETE')}
                                className="px-2 py-1 text-red-400 hover:text-red-300 rounded-lg text-xs"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  </div>
);
}
