'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, ShieldCheck, HelpCircle, ExternalLink } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* FTC Affiliate Disclosure Box */}
        <div className="mb-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            FTC Affiliate Disclosure & Editorial Standards
          </div>
          <p>
            HypeFixture.com is an independent sports broadcast guide and fixture directory. We may receive
            compensation from affiliate partners (such as official streaming trials, sports networks, and VPN providers)
            when visitors click outbound links or make qualified purchases. This comes at zero extra cost to you and
            funds our server infrastructure and daily fixture analysis. We do not host or broadcast copyrighted video
            streams on our servers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Flame className="w-5 h-5 text-slate-950 fill-slate-950" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                HYPE<span className="text-emerald-400">FIXTURE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your real-time hub for finding where to watch live football, NFL, NBA, and UFC broadcasts legally across
              the USA, UK, Canada, and worldwide.
            </p>
          </div>

          {/* Sports Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Sports Covered</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/football" className="hover:text-emerald-400 transition">
                  Football / Premier League & UCL
                </Link>
              </li>
              <li>
                <Link href="/nfl" className="hover:text-emerald-400 transition">
                  NFL Sunday Night & RedZone
                </Link>
              </li>
              <li>
                <Link href="/nba" className="hover:text-emerald-400 transition">
                  NBA Live Games & League Pass
                </Link>
              </li>
              <li>
                <Link href="/ufc" className="hover:text-emerald-400 transition">
                  UFC PPV & Fight Night Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Guides & Streaming */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Live Streaming</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/go/affforce" target="_blank" rel="sponsored nofollow" className="hover:text-emerald-400 transition flex items-center gap-1">
                  Access Live Sports Offers <ExternalLink className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/go/vpn" target="_blank" rel="sponsored nofollow" className="hover:text-emerald-400 transition flex items-center gap-1">
                  Watch Overseas with Sports VPN <ExternalLink className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/go/fubo" target="_blank" rel="sponsored nofollow" className="hover:text-emerald-400 transition flex items-center gap-1">
                  Official FuboTV Sports Pass <ExternalLink className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Legal & DMCA</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-slate-300">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-slate-300">DMCA Copyright Policy</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Contact Broadcaster Team</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} HypeFixture.com. All sports trademarks and broadcaster logos belong to their respective rights holders.
        </div>
      </div>
    </footer>
  );
}
