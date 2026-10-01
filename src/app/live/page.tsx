import React from 'react';
import type { Metadata } from 'next';
import LiveMatchesSection from '@/components/LiveMatchesSection';
import JsonLd from '@/components/JsonLd';
import { Tv, Radio, ShieldCheck, Zap, Globe, Flame } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Live Matches & Real-Time Scores | Watch Football, Cricket, NFL & Rugby Live',
  description:
    'Watch live sports matches running right now. Present live scores, over-by-over cricket commentary, soccer minute clocks, NFL quarters, and official TV & streaming channels.',
  keywords: [
    'live matches today',
    'live cricket score',
    'live football score',
    'nfl live stream',
    'rugby live scores',
    'where to watch live sports',
    'in play matches',
  ],
};

export default function LiveMatchesPage() {
  const liveHubSchema = {
    '@context': 'https://schema.org',
    '@type': 'LiveBlogPosting',
    headline: 'Real-Time Sports Live Match Center - Today\'s In-Play Scores & Broadcast Channels',
    description:
      'Continuous real-time scorecards and verified broadcast channels for in-play Football, Cricket, NFL, and Rugby fixtures.',
    url: 'https://ticketfixture.com/live',
    coverageStartTime: new Date().toISOString(),
  };

  return (
    <div className="space-y-12 pb-20">
      <JsonLd data={liveHubSchema} />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 pt-12 pb-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/20 via-slate-950/0 to-slate-950 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            Real-Time Scoreboard & Official Stream Links
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Live Matches <span className="text-red-500">In-Play Now</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Track present scores, live clocks, ball-by-ball updates, and authorized broadcast options across
            Football (Soccer), Cricket, NFL, Rugby, and Basketball.
          </p>

          {/* Quick Feature Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 text-xs font-semibold text-slate-300">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Scores</span>
            </div>
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-center gap-2">
              <Tv className="w-4 h-4 text-blue-400" />
              <span>TV Channels</span>
            </div>
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-center gap-2">
              <Globe className="w-4 h-4 text-teal-400" />
              <span>Official Streams</span>
            </div>
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Verified Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Live Match Center Section */}
      <LiveMatchesSection
        initialSport="all"
        title="Active Match Scorecards"
        subtitle="Filter by sport to inspect in-play action, present runs/wickets or goals, and start watching with a single click."
      />

      {/* Senior Sports Analyst Live Broadcast FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Live Sports Viewing Guide & FAQ</h2>
        <div className="space-y-4 text-sm text-slate-300">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <h3 className="font-bold text-white text-base">How fast are the live scores updated?</h3>
            <p className="leading-relaxed">
              Our live score feed pulls real-time event updates and over-by-over statistics continuously every 20 seconds.
              You can also click the <strong>Refresh</strong> button at any moment to instantly synchronize with the latest
              match events.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <h3 className="font-bold text-white text-base">Where can I stream live Cricket matches?</h3>
            <p className="leading-relaxed">
              In the United States, official cricket matches (including ICC tournaments, bilateral tours, and IPL) are
              streamed on Willow TV and ESPN+. In the United Kingdom, Sky Sports Cricket and TNT Sports broadcast live
              cricket.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <h3 className="font-bold text-white text-base">How do I stream NFL and Soccer legally abroad?</h3>
            <p className="leading-relaxed">
              If you have a subscription with domestic broadcasters like Peacock, Paramount+, or DAZN and are currently
              traveling abroad, you can access your home streaming package using a verified, high-speed sports VPN to
              bypass regional blackout constraints.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
