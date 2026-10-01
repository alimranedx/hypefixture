'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Tv,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  Bookmark,
  ChevronDown,
  LogIn,
  Ticket,
  Search,
  Heart,
  Trophy,
  UserPlus,
} from 'lucide-react';

import { ActiveSport } from '@/lib/sports';

interface NavbarProps {
  initialSports?: ActiveSport[];
}

export default function Navbar({ initialSports }: NavbarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [dynamicSports, setDynamicSports] = useState<ActiveSport[]>(initialSports || []);

  // Fetch active sports from API if not passed from server layout
  useEffect(() => {
    if (!initialSports || initialSports.length === 0) {
      fetch('/api/sports')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.sports)) {
            setDynamicSports(data.sports);
          }
        })
        .catch(() => {});
    }
  }, [initialSports]);

  // Construct dynamic navigation links: Match Tickets first, European Football & Cricket, then directory
  const sportsNav = [
    { name: '🎟️ Match Tickets', href: '/events' },
    { name: '⚽ European Football', href: '/sports/football' },
    { name: '🏏 UK & European Cricket', href: '/sports/cricket' },
    { name: 'Live Scores', href: '/live', isLive: true },
    { name: 'All Sports', href: '/sports' },
  ];

  const userRole = (session?.user as any)?.role;
  // Strict separation: Only standard USER role is treated as logged-in on the public site
  const isPublicUser = session?.user && userRole === 'USER';
  const isAdminSession = session?.user && (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN');

  // Don't render public sports navbar on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      {/* European Trust & Currency Ribbon */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80 py-1.5 px-4 text-center text-[11px] text-slate-300 flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <span>🇪🇺</span>
          <span>Europe&apos;s Dedicated Football &amp; Cricket Ticket Marketplace</span>
        </span>
        <span className="hidden sm:inline text-slate-600">•</span>
        <span className="text-slate-400 hidden sm:inline">
          Prices in <strong className="text-white">GBP (£)</strong> &amp; <strong className="text-white">EUR (€)</strong>
        </span>
        <span className="hidden md:inline text-slate-600">•</span>
        <span className="text-emerald-400 font-semibold hidden md:inline">
          100% European FanProtect™ Guarantee &amp; Instant Mobile Transfer
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              <Image
                src="/logo-icon.png"
                alt="TicketFixture Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                TICKET<span className="text-emerald-400">FIXTURE</span>
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium block -mt-1 tracking-wider uppercase">
                Verified Match Tickets &amp; Seats
              </span>
            </div>
          </Link>

          {/* Desktop Sports Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {sportsNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    item.isLive
                      ? isActive
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-sm shadow-red-500/20'
                        : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30'
                      : isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {item.isLive && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Search, Auth, Quick CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Global Search Button */}
            <Link
              href="/search"
              aria-label="Search events"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/50 transition shadow-sm"
              title="Search matches, teams, venues"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Find Tickets CTA */}
            <Link
              href="/events"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-emerald-500/20 transition hover:scale-[1.02]"
            >
              <Ticket className="w-3.5 h-3.5" />
              Find Tickets
            </Link>

            {/* Authentication state */}
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse"></div>
            ) : isPublicUser ? (
              /* Regular Public User Logged In */
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-medium transition"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="max-w-[100px] truncate">{session.user?.name || 'Account'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800 text-xs text-slate-400">
                      Signed in as <strong className="text-white block truncate">{session.user?.email}</strong>
                    </div>

                    <Link
                      href="/favorites"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Heart className="w-4 h-4 text-rose-400" />
                      Saved Favorites
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Bookmark className="w-4 h-4 text-emerald-400" />
                      User Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <User className="w-4 h-4 text-sky-400" />
                      Profile Settings
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Public Visitor (Even if Admin Session is active, user panel stays unauthenticated for consumers) */
              <div className="flex items-center gap-2">
                {isAdminSession && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin Panel &rarr;
                  </Link>
                )}
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-white text-xs font-bold transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-2">
            {sportsNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-base font-semibold transition ${
                  item.isLive
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span>{item.name}</span>
                {item.isLive && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-black">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    LIVE NOW
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-4 border-t border-slate-800">
              {isPublicUser ? (
                <div className="space-y-2">
                  <div className="px-3 text-xs text-slate-400">
                    Signed in as <strong>{session.user?.name}</strong>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-emerald-400"
                  >
                    My Saved Fixtures
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block w-full text-left px-3 py-2 text-sm text-red-400"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-3">
                  {isAdminSession && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs"
                    >
                      Admin Panel &rarr;
                    </Link>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 px-3 rounded-lg bg-emerald-500 text-slate-950 text-xs font-black"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
