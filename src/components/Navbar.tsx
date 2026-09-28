'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Flame,
  Tv,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  Bookmark,
  ChevronDown,
  LogIn,
  UserPlus,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const sportsNav = [
    { name: '🔥 All Fixtures', href: '/' },
    { name: '⚽ Football / Soccer', href: '/football' },
    { name: '🏀 NBA', href: '/nba' },
    { name: '🏈 NFL', href: '/nfl' },
    { name: '🥊 UFC / Boxing', href: '/ufc' },
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
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              <Flame className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                HYPE<span className="text-emerald-400">FIXTURE</span>
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium block -mt-1 tracking-wider uppercase">
                Where To Watch & Live Streams
              </span>
            </div>
          </Link>

          {/* Desktop Sports Links */}
          <nav className="hidden md:flex items-center gap-1">
            {sportsNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Auth, Admin, Quick CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Direct Affiliate Watch CTA */}
            <Link
              href="/go/affforce"
              target="_blank"
              rel="sponsored nofollow"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition"
            >
              <Tv className="w-3.5 h-3.5" />
              Live Streams
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
                      href="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Bookmark className="w-4 h-4 text-emerald-400" />
                      My Saved Fixtures
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
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                {item.name}
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
