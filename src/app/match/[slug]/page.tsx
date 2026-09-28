import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { HYPE_MATCH_POOL } from '@/lib/gemini';
import StreamCtaCard from '@/components/StreamCtaCard';
import BroadcasterGuide from '@/components/BroadcasterGuide';
import JsonLd from '@/components/JsonLd';
import Link from 'next/link';
import { Calendar, MapPin, Trophy, ShieldCheck, ArrowLeft, Tv } from 'lucide-react';

interface MatchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = HYPE_MATCH_POOL.find(
    (m) => m.teams.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  );

  if (!match) return { title: 'Match Broadcast Guide Not Found' };

  return {
    title: `Where to Watch ${match.teams} Live: TV Channels & Kickoff Time`,
    description: `Complete guide on how to watch ${match.teams} live stream online, official TV broadcast channels in USA, UK, Canada, Australia, and ${match.tournament} start time.`,
    keywords: [
      `where to watch ${match.teams}`,
      `${match.teams} live stream`,
      `${match.teams} tv channel`,
      `${match.teams} broadcast`,
    ],
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { slug } = await params;
  const match = HYPE_MATCH_POOL.find(
    (m) => m.teams.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  );

  if (!match) {
    notFound();
  }

  // Schema.org SportsEvent & FAQPage structured data
  const sportsEventSchema = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.teams} - ${match.tournament}`,
    startDate: match.time,
    location: {
      '@type': 'Place',
      name: match.venue,
    },
    sport: match.sport,
    description: `Live broadcast guide and channels for ${match.teams} taking place at ${match.venue}.`,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What TV channel is ${match.teams} on in the US?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `In the United States, ${match.teams} is broadcast on ${match.broadcasters.us}.`,
        },
      },
      {
        '@type': 'Question',
        name: `How can I stream ${match.teams} online?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can stream ${match.teams} through authorized live streaming services or matchday streaming passes.`,
        },
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <JsonLd data={sportsEventSchema} />
      <JsonLd data={faqSchema} />

      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Fixtures
      </Link>

      {/* Event Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            {match.sport}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Trophy className="w-3.5 h-3.5 text-slate-500" />
            {match.tournament}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Where to Watch <span className="text-emerald-400">{match.teams}</span> Live
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span><strong>Kickoff / Start:</strong> {match.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span><strong>Venue:</strong> {match.venue}</span>
          </div>
        </div>
      </div>

      {/* Broadcaster Table Component */}
      <BroadcasterGuide broadcasters={match.broadcasters} />

      {/* High-CTR Streaming CTA */}
      <StreamCtaCard matchTitle={match.teams} sport={match.sport} />

      {/* SEO Match Details & FAQ */}
      <div className="space-y-6 text-slate-300 leading-relaxed text-sm">
        <h2 className="text-2xl font-bold text-white">How to Watch {match.teams} Online</h2>
        <p>
          The upcoming clash between <strong>{match.teams}</strong> is set to draw millions of sports fans worldwide.
          Depending on your location, television broadcasting networks and digital streaming platforms hold exclusive rights
          to broadcast every minute of action.
        </p>

        <h3 className="text-lg font-bold text-white pt-4">Watching from Outside Your Home Country</h3>
        <p>
          If you are traveling internationally, geographic broadcast blackouts may prevent direct access to your local
          cable or streaming subscriptions. Connecting to a fast, reliable sports VPN allows you to maintain continuous
          access to authorized domestic broadcasts.
        </p>
        <div className="pt-2">
          <Link
            href="/go/vpn"
            target="_blank"
            rel="sponsored nofollow"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20"
          >
            Get Verified Sports VPN Access &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
