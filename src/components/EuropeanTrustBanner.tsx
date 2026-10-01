'use client';

import React from 'react';
import { ShieldCheck, Zap, Coins, Clock, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function EuropeanTrustBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-8 sm:p-12 shadow-2xl">
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              The European FanProtect Guarantee
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Why European Football &amp; Cricket Fans Trust TicketFixture
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              We aggregate and verify secondary ticket exchanges across the UK and Europe. Every single ticket listed on our engine comes with full entry protection and verified mobile delivery.
            </p>
          </div>

          {/* 4 Feature Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">100% Entry Guarantee</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If your match is postponed, rescheduled, or your tickets fail at the turnstile, you receive a full 100% immediate cash refund or superior upgraded seats.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Instant NFC Mobile Transfer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive official contactless mobile passes straight into your Apple Wallet or Google Wallet 24–48 hours before match kickoff. No paper printing required.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Zero Hidden Surprise Fees</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transparent comparison in both GBP (£) and EUR (€). Compare exact net prices across SeatGeek, StubHub, Ticombo, and Viagogo before you click out.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Matchday Live Helpdesk</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated European matchday support desk active right up to kickoff at London Emirates, Manchester Old Trafford, Madrid Bernabéu, and London Lord&apos;s.
              </p>
            </div>
          </div>

          {/* Quick Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Accredited partners only • SSL 256-bit encrypted checkout</span>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 hover:scale-105"
            >
              <span>Explore Verified European Fixtures</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
