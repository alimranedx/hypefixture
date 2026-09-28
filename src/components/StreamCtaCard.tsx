import React from 'react';
import Link from 'next/link';
import { Tv, Zap, CheckCircle2, Shield, Play } from 'lucide-react';

interface StreamCtaCardProps {
  matchTitle?: string;
  sport?: string;
}

export default function StreamCtaCard({
  matchTitle = "Today's Marquee Sports Event",
  sport = 'sports',
}: StreamCtaCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6 md:p-8 shadow-2xl shadow-emerald-500/5 my-8">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Verified Matchday Stream Access
          </div>

          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Stream {matchTitle} in Full HD
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed">
            Get instant matchday access to live broadcasts, multi-camera angles, and crystal-clear audio on Smart TV,
            PC, Tablet, and Mobile devices.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1080p 60FPS Live Broadcast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multi-Language Commentary</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero Buffering Cloud Stream</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No Long-Term Contracts</span>
            </div>
          </div>
        </div>

        {/* CTA Button Block */}
        <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
          <Link
            href="/go/affforce"
            target="_blank"
            rel="sponsored nofollow"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base transition shadow-xl shadow-emerald-500/25 group"
          >
            <Play className="w-5 h-5 fill-slate-950 group-hover:scale-110 transition" />
            Watch Live Stream Now
          </Link>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            Official promotional partner & instant setup
          </span>
        </div>
      </div>
    </div>
  );
}
