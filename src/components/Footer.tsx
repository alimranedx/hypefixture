'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Ticket, Trophy, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Buyer Protection & Disclosure Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>TicketFixture 100% Buyer Guarantee &amp; Editorial Transparency</span>
          </div>
          <p>
            TicketFixture is an independent matchday schedule, stadium guide, and ticket comparison portal. We compare real-time pricing across accredited secondary marketplaces (such as SeatGeek, StubHub, and Viagogo) whose listings carry 100% money-back buyer guarantees. We may earn a referral commission when tickets are booked through our comparison links, at zero additional cost to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-md shadow-emerald-500/10">
                <Image
                  src="/logo-icon.png"
                  alt="TicketFixture Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                TICKET<span className="text-emerald-400">FIXTURE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare verified sports &amp; live event tickets, view stadium seating blueprints, and track kickoff times across top world leagues.
            </p>
          </div>

          {/* Featured Match Tickets */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-emerald-400" /> Match Tickets
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tickets" className="hover:text-emerald-400 transition font-semibold text-emerald-400/90">
                  🎟️ All Event Tickets &amp; Seats
                </Link>
              </li>
              <li>
                <Link href="/match/arsenal-vs-chelsea" className="hover:text-emerald-400 transition">
                  Arsenal vs Chelsea Tickets
                </Link>
              </li>
              <li>
                <Link href="/match/real-madrid-vs-barcelona" className="hover:text-emerald-400 transition">
                  El Clásico Tickets
                </Link>
              </li>
              <li>
                <Link href="/match/india-vs-pakistan" className="hover:text-emerald-400 transition">
                  India vs Pakistan Tickets
                </Link>
              </li>
              <li>
                <Link href="/match/chennai-super-kings-vs-mumbai-indians" className="hover:text-emerald-400 transition">
                  CSK vs Mumbai Indians (IPL)
                </Link>
              </li>
            </ul>
          </div>

          {/* Active Sports & Live Match Hub */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Sports Coverage
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/football" className="hover:text-emerald-400 transition">
                  ⚽ Football (Premier League &amp; UCL)
                </Link>
              </li>
              <li>
                <Link href="/cricket" className="hover:text-emerald-400 transition">
                  🏏 Cricket (IPL &amp; Champions Trophy)
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-red-400 transition flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  🔴 Live In-Play Scores
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-emerald-400 transition">
                  🔥 All Fixtures &amp; Schedules
                </Link>
              </li>
            </ul>
          </div>

          {/* Buyer Trust & Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> Trust &amp; Standards
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-slate-300">100% Money-Back Buyer Protection</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Verified Barcodes &amp; Turnstile Entry</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} TicketFixture.com. All sports club names, tournament names, and venue trademarks belong to their respective copyright holders.
        </div>
      </div>
    </footer>
  );
}
