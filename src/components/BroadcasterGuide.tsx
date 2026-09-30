import React from 'react';
import { Globe, Tv, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface BroadcasterGuideProps {
  broadcasters: {
    us: string;
    uk: string;
    ca?: string;
    au?: string;
  };
}

export default function BroadcasterGuide({ broadcasters }: BroadcasterGuideProps) {
  const regions = [
    { country: 'United States', code: 'US', channels: broadcasters.us, cta: 'Peacock / ESPN+' },
    { country: 'United Kingdom', code: 'UK', channels: broadcasters.uk, cta: 'Sky Sports / TNT' },
    { country: 'Canada', code: 'CA', channels: broadcasters.ca || 'Fubo / TSN / DAZN', cta: 'Fubo Canada' },
    { country: 'Australia', code: 'AU', channels: broadcasters.au || 'Optus Sport / Stan Sport', cta: 'Optus Sport' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 my-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-bold text-white">Official TV Channels & Streaming Services</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Country / Region</th>
              <th className="py-3 px-4">TV Broadcaster</th>
              <th className="py-3 px-4">Online Stream</th>
              <th className="py-3 px-4 text-right">Access Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {regions.map((reg) => (
              <tr key={reg.code} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-4 bg-slate-800 text-[10px] font-bold rounded flex items-center justify-center border border-slate-700">
                    {reg.code}
                  </span>
                  {reg.country}
                </td>
                <td className="py-3 px-4">{reg.channels}</td>
                <td className="py-3 px-4 text-emerald-400">{reg.cta}</td>
                <td className="py-3 px-4 text-right">
                  <a
                    href="#ticket-comparison"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                  >
                    Match Guide <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
