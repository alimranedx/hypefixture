'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  FilePlus,
  Search,
  TrendingUp,
  DollarSign,
  Crown,
  Shield,
  LogOut,
  ExternalLink,
  RefreshCw,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Radio,
  Share2,
  Trophy,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

interface AdminSidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: any) => void;
  postCount?: number;
  keywordCount?: number;
  pendingAdminCount?: number;
  generatingAi?: boolean;
  onGenerateAi?: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export default function AdminSidebar(props: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Optional Context fallback (if rendered inside AdminProvider)
  let contextValues: any = null;
  try {
    contextValues = useAdmin();
  } catch {
    contextValues = null;
  }

  const currentUser = props.user || session?.user;
  const isSuperAdmin = (currentUser as any)?.role === 'SUPER_ADMIN';

  const effectivePostCount =
    props.postCount !== undefined
      ? props.postCount
      : contextValues?.posts?.length ?? 0;

  const effectiveKeywordCount =
    props.keywordCount !== undefined
      ? props.keywordCount
      : contextValues?.keywords?.length ?? 0;

  const effectivePendingAdminCount =
    props.pendingAdminCount !== undefined
      ? props.pendingAdminCount
      : (contextValues?.adminsList || []).filter((a: any) => !a.isApproved).length;

  const effectiveSportsCount =
    (contextValues?.sports || []).filter((s: any) => s.isActive).length;

  const isGenerating =
    props.generatingAi !== undefined
      ? props.generatingAi
      : contextValues?.generatingAi ?? false;

  const triggerGenerate =
    props.onGenerateAi || contextValues?.handleGeneratePosts || (() => {});

  const navItems = [
    {
      id: 'overview',
      name: 'Overview',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      desc: 'System health & vital stats',
    },
    {
      id: 'ai-studio',
      name: 'AI Editorial Studio',
      href: '/admin/ai-studio',
      icon: Sparkles,
      desc: 'Autonomous cluster pipeline',
    },
    {
      id: 'sports',
      name: 'Sports Coverage',
      href: '/admin/sports',
      icon: Trophy,
      desc: 'Dynamic coverage & AI target',
      count: effectiveSportsCount,
    },
    {
      id: 'posts',
      name: 'Post Management',
      href: '/admin/posts',
      icon: FileText,
      desc: 'Articles, drafts & edits',
      count: effectivePostCount,
    },
    {
      id: 'new-post',
      name: 'Create New Article',
      href: '/admin/posts/new',
      icon: FilePlus,
      desc: 'Publish custom sports post',
      highlight: true,
    },
    {
      id: 'keywords',
      name: 'Keyword Research',
      href: '/admin/keywords',
      icon: Search,
      desc: 'High-CPC sports terms',
      count: effectiveKeywordCount,
    },
    {
      id: 'serp',
      name: 'Website SERP Ranks',
      href: '/admin/serp',
      icon: TrendingUp,
      desc: 'Target keyword rankings',
    },
    {
      id: 'syndication',
      name: 'Social & SEO Hub',
      href: '/admin/syndication',
      icon: Share2,
      desc: 'Auto-share & Instant IndexNow',
    },
    {
      id: 'affiliates',
      name: 'Affiliate & EPC Hub',
      href: '/admin/affiliates',
      icon: DollarSign,
      desc: 'AffForce, VPN, FuboTV',
    },
    ...(isSuperAdmin
      ? [
          {
            id: 'security',
            name: 'Super Admin Governance',
            href: '/admin/governance',
            icon: Crown,
            desc: 'Admin approvals & roles',
            badge: effectivePendingAdminCount,
          },
        ]
      : []),
  ];

  const checkIsActive = (item: (typeof navItems)[0]) => {
    // If explicit activeTab passed for legacy monolith mode
    if (props.activeTab) {
      if (item.id === 'security') return props.activeTab === 'security';
      return props.activeTab === item.id;
    }

    if (item.href === '/admin/dashboard') {
      return pathname === '/admin/dashboard' || pathname === '/admin' || pathname === '/admin/overview';
    }
    if (item.href === '/admin/posts') {
      return pathname === '/admin/posts' || (pathname.startsWith('/admin/posts/') && pathname !== '/admin/posts/new') || pathname.startsWith('/admin/post/');
    }
    if (item.href === '/admin/sports') {
      return pathname === '/admin/sports' || pathname.startsWith('/admin/sports/');
    }
    if (item.href === '/admin/governance') {
      return pathname === '/admin/governance' || pathname === '/admin/security';
    }
    return pathname === item.href;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800 text-slate-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
            <Image
              src="/logo-icon.png"
              alt="Hype Fixture Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white">
                HYPE<span className="text-emerald-400">FIXTURE</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block -mt-0.5">
              Senior Sports CMS
            </span>
          </div>
        </Link>

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Generate AI Cluster Button */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
        <button
          onClick={() => triggerGenerate()}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>AI Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>Generate 5 Posts Now</span>
            </>
          )}
        </button>
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 px-1">
          <span className="flex items-center gap-1" title="Priority Cascade: 3.8 ➔ 3.7 ➔ 3.6 ➔ 3.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            Gemini Auto-Cascade
          </span>
          <span className="text-emerald-400 font-bold">Online</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Control Center
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = checkIsActive(item);

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                setMobileOpen(false);
                if (props.onSelectTab) {
                  props.onSelectTab(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition group text-left ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : item.highlight
                  ? 'text-emerald-300 hover:text-white bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div
                  className={`p-1.5 rounded-lg transition ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : item.highlight
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-900 text-slate-400 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="block truncate font-bold">{item.name}</span>
                  <span className="text-[10px] text-slate-500 block truncate -mt-0.5">
                    {item.desc}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}

                <ChevronRight
                  className={`w-3.5 h-3.5 transition opacity-0 group-hover:opacity-100 ${
                    isActive ? 'opacity-100 text-emerald-400' : 'text-slate-600'
                  }`}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Admin User Profile & Footer Section */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 space-y-2">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            {currentUser?.image ? (
              <img
                src={currentUser.image}
                alt={currentUser.name || 'Admin'}
                className="w-8 h-8 rounded-full border border-emerald-500/50 shrink-0 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
            )}
            <div className="truncate">
              <span className="block text-xs font-bold text-white truncate">
                {currentUser?.name || 'Administrator'}
              </span>
              <span className="block text-[10px] text-slate-400 truncate">
                {currentUser?.email || 'admin@hypefixture.com'}
              </span>
            </div>
          </div>

          {isSuperAdmin ? (
            <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
              SUPER
            </span>
          ) : (
            <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              ADMIN
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition"
            title="Open live public portal in new tab"
          >
            <ExternalLink className="w-3 h-3 text-emerald-400" />
            <span>Public Site</span>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-[11px] font-semibold text-slate-400 hover:text-red-400 transition"
            title="Sign out from Admin Panel"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navbar with Hamburger */}
      <div className="md:hidden sticky top-0 z-40 bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-md shadow-emerald-500/10">
            <Image
              src="/logo-icon.png"
              alt="Hype Fixture Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-black text-white text-sm">
            HYPE<span className="text-emerald-400">FIXTURE</span> CMS
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-full z-10">{sidebarContent}</div>
        </div>
      )}

      {/* Desktop Persistent Left Side Nav */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
}
