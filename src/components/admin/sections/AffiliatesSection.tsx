'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { DollarSign, Loader2, Check, ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react';

export default function AffiliatesSection() {
  const { affiliates, setStatusMessage } = useAdmin();
  const [updatingAffId, setUpdatingAffId] = useState<string | null>(null);

  const handleUpdateUrl = async (aff: any, targetUrl: string) => {
    if (aff.targetUrl === targetUrl) return;
    setUpdatingAffId(aff.id);
    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...aff, targetUrl }),
      });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `Updated destination URL for ${aff.name}!` });
      }
    } catch {
      setStatusMessage({ type: 'error', text: `Failed to update destination URL for ${aff.name}.` });
    } finally {
      setUpdatingAffId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          Primary Ticket Monetization
        </div>
        <h3 className="text-xl font-bold text-white">
          Ticket Affiliate Partners &amp; Cloaked Hops
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Manage your high-ticket affiliate partnership destination links. Outbound clicks route through{' '}
          <code className="text-emerald-400">/go/[slug]</code> with{' '}
          <code className="text-emerald-400">noindex, nofollow</code> headers to protect your SEO rankings and maximize commission tracking.
        </p>
      </div>

      {/* Guide Banner: How to get partnered with SeatGeek & StubHub */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Recommended 2-Partner Strategy for European Football &amp; Major Sports
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center justify-between">
              <span>1. StubHub / Viagogo Partner Program</span>
              <span className="text-emerald-400 font-mono">5% - 8% Commission</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Best For:</strong> Sold-out European Football (Premier League, El Clásico, Champions League).
              <br />
              <strong>How to Join:</strong> Sign up as a publisher on <strong>Awin.com</strong> (Search: <em>StubHub International</em>, ID 7029) or direct at <em>viagogo.com/affiliates</em>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center justify-between">
              <span>2. SeatGeek Affiliate Program</span>
              <span className="text-emerald-400 font-mono">5% - 10% Commission</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Best For:</strong> Overseas/US sports tourists, clean interactive stadium seating maps.
              <br />
              <strong>How to Join:</strong> Apply on <strong>Impact.com</strong> (Search: <em>SeatGeek</em>) with your website URL.
            </p>
          </div>
        </div>
      </div>

      {/* Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {affiliates.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
            No affiliate networks configured. Seed partners via prisma or add new affiliate hops.
          </div>
        ) : (
          affiliates.map((aff) => (
            <div
              key={aff.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-bold text-[10px] uppercase border border-slate-700">
                  {aff.category}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">{aff.status}</span>
              </div>

              <h4 className="text-base font-bold text-white">{aff.name}</h4>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Cloaked Hop:</span>
                  <code className="text-emerald-400 font-bold">/go/{aff.slug}</code>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Payout Rate:</span>
                  <span className="text-white font-medium">{aff.payout}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Clicks:</span>
                  <span className="font-mono text-emerald-400 font-bold">{aff.clicks || 0}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Destination Affiliate Referral Link
                  </label>
                  {updatingAffId === aff.id && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  disabled={updatingAffId === aff.id}
                  defaultValue={aff.targetUrl}
                  onBlur={(e) => handleUpdateUrl(aff, e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-mono transition disabled:opacity-50"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href={`/go/${aff.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                >
                  <span>Test Hop Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
