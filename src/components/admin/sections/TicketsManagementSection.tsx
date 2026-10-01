'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Ticket,
  Plus,
  Loader2,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface TicketFixtureItem {
  id: string;
  slug: string;
  title: string;
  homeTeam: string;
  awayTeam: string;
  sport: string;
  tournament: string;
  matchDate: string;
  venueName: string;
  city: string;
  country: string;
  minPrice: number;
  maxPrice: number;
  currency: string;
  availableTickets: number;
  demandStatus: string;
  featuredImage?: string | null;
  seatgeekPrice?: number | null;
  seatgeekUrl?: string | null;
  stubhubPrice?: number | null;
  stubhubUrl?: string | null;
  viagogoPrice?: number | null;
  viagogoUrl?: string | null;
  isActive: boolean;
}

export default function TicketsManagementSection() {
  const [fixtures, setFixtures] = useState<TicketFixtureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFixture, setEditingFixture] = useState<Partial<TicketFixtureItem> | null>(null);

  const fetchFixtures = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tickets');
      const data = await res.json();
      if (data.success && Array.isArray(data.fixtures)) {
        setFixtures(data.fixtures);
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to load ticket fixtures.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures();
  }, []);

  const handleOpenAddModal = () => {
    setEditingFixture({
      title: '',
      homeTeam: '',
      awayTeam: '',
      sport: 'football',
      tournament: 'Premier League',
      matchDate: 'Saturday, Matchday 2026',
      venueName: 'Emirates Stadium',
      city: 'London',
      country: 'United Kingdom',
      minPrice: 89,
      maxPrice: 480,
      currency: 'GBP',
      availableTickets: 500,
      demandStatus: 'HIGH_DEMAND',
      featuredImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
      seatgeekPrice: 135,
      seatgeekUrl: 'https://seatgeek.com/?ref=hypefixture',
      stubhubPrice: 89,
      stubhubUrl: 'https://stubhub.com/?ref=hypefixture',
      viagogoPrice: 110,
      viagogoUrl: 'https://viagogo.com/?ref=hypefixture',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: TicketFixtureItem) => {
    setEditingFixture({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveFixture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFixture) return;
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFixture),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMessage({
          type: 'success',
          text: editingFixture.id ? 'Ticket fixture updated successfully!' : 'New ticket fixture created!',
        });
        setIsModalOpen(false);
        setEditingFixture(null);
        await fetchFixtures();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save fixture' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error saving ticket fixture.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/tickets?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `Deleted ${name}` });
        setFixtures((prev) => prev.filter((f) => f.id !== id));
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to delete fixture' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Error connecting to delete API.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Ticket className="w-4 h-4" />
            European Football & Major Sports Hub
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Dynamic Match Tickets Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Add European fixtures, set live secondary marketplace prices (SeatGeek, StubHub, Viagogo), and manage affiliate referral URLs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFixtures}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
            title="Refresh Fixtures"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Match Fixture
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white text-sm">
            ✕
          </button>
        </div>
      )}

      {/* Quick Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Active Fixtures</div>
          <div className="text-2xl font-black text-white mt-1">
            {fixtures.filter((f) => f.isActive).length} / {fixtures.length}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Ready for ticket buyers</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Primary Target Leagues</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            Premier League &amp; UCL
          </div>
          <div className="text-[10px] text-slate-400 mt-1">High ticket resale commissions</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Active Ticket Partners</div>
          <div className="text-2xl font-black text-sky-400 mt-1">
            SeatGeek &amp; StubHub
          </div>
          <div className="text-[10px] text-slate-400 mt-1">100% money-back guarantees</div>
        </div>
      </div>

      {/* Fixtures List */}
      {loading ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <div className="text-sm font-bold text-white">Loading ticket fixtures...</div>
        </div>
      ) : fixtures.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="text-lg font-bold text-white">No match fixtures found</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click &ldquo;Add Match Fixture&rdquo; above to add your first high-demand European football derby.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
          >
            Create First Match
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {fixtures.map((fixture) => {
            const sym = fixture.currency === 'GBP' ? '£' : fixture.currency === 'EUR' ? '€' : '$';
            return (
              <div
                key={fixture.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-bold text-[10px] uppercase border border-slate-700">
                      {fixture.tournament}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        fixture.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {fixture.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white line-clamp-1">
                    {fixture.title || `${fixture.homeTeam} vs ${fixture.awayTeam}`}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{fixture.matchDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">
                        {fixture.venueName}, {fixture.city}
                      </span>
                    </div>
                  </div>

                  {/* Multi-Vendor Live Price Comparison Matrix */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="font-semibold text-emerald-400">SeatGeek:</span>
                      <span className="font-mono font-bold text-white">
                        {fixture.seatgeekPrice ? `${sym}${fixture.seatgeekPrice}` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="font-semibold text-sky-400">StubHub:</span>
                      <span className="font-mono font-bold text-white">
                        {fixture.stubhubPrice ? `${sym}${fixture.stubhubPrice}` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="font-semibold text-amber-400">Viagogo:</span>
                      <span className="font-mono font-bold text-white">
                        {fixture.viagogoPrice ? `${sym}${fixture.viagogoPrice}` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/match/${fixture.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Preview Public Match Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleOpenEditModal(fixture)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition"
                      title="Edit Fixture &amp; Prices"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(fixture.id, fixture.title)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition"
                      title="Delete Fixture"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">From</div>
                    <div className="text-base font-black text-emerald-400 font-mono">
                      {sym}{fixture.minPrice}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Fixture Modal Form */}
      {isModalOpen && editingFixture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-black text-white">
                {editingFixture.id ? 'Edit Match Ticket Fixture' : 'Add European Match Fixture'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingFixture(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFixture} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Home Team
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFixture.homeTeam || ''}
                    onChange={(e) =>
                      setEditingFixture({ ...editingFixture, homeTeam: e.target.value })
                    }
                    placeholder="e.g. Real Madrid"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Away Team
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFixture.awayTeam || ''}
                    onChange={(e) =>
                      setEditingFixture({ ...editingFixture, awayTeam: e.target.value })
                    }
                    placeholder="e.g. Barcelona"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Tournament / League
                  </label>
                  <select
                    value={editingFixture.tournament || 'Premier League'}
                    onChange={(e) =>
                      setEditingFixture({ ...editingFixture, tournament: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Premier League">Premier League</option>
                    <option value="UEFA Champions League">UEFA Champions League</option>
                    <option value="La Liga">La Liga (Spain)</option>
                    <option value="Serie A">Serie A (Italy)</option>
                    <option value="Bundesliga">Bundesliga (Germany)</option>
                    <option value="ICC Champions Trophy">ICC Champions Trophy</option>
                    <option value="Indian Premier League (IPL)">Indian Premier League (IPL)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Match Date
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFixture.matchDate || ''}
                    onChange={(e) =>
                      setEditingFixture({ ...editingFixture, matchDate: e.target.value })
                    }
                    placeholder="e.g. Saturday, October 24, 2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Stadium Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFixture.venueName || ''}
                    onChange={(e) =>
                      setEditingFixture({ ...editingFixture, venueName: e.target.value })
                    }
                    placeholder="e.g. Estadio Santiago Bernabéu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFixture.city || ''}
                    onChange={(e) =>
                      setEditingFixture({ ...editingFixture, city: e.target.value })
                    }
                    placeholder="e.g. Madrid"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Currency
                  </label>
                  <select
                    value={editingFixture.currency || 'GBP'}
                    onChange={(e) =>
                      setEditingFixture({ ...editingFixture, currency: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              {/* Vendor Live Resale Prices & Links */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Secondary Marketplaces &amp; Affiliate URLs
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      SeatGeek Price ({editingFixture.currency})
                    </label>
                    <input
                      type="number"
                      value={editingFixture.seatgeekPrice || ''}
                      onChange={(e) =>
                        setEditingFixture({
                          ...editingFixture,
                          seatgeekPrice: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      SeatGeek Affiliate URL
                    </label>
                    <input
                      type="text"
                      value={editingFixture.seatgeekUrl || ''}
                      onChange={(e) =>
                        setEditingFixture({ ...editingFixture, seatgeekUrl: e.target.value })
                      }
                      placeholder="https://seatgeek.com/...?ref=..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      StubHub Price ({editingFixture.currency})
                    </label>
                    <input
                      type="number"
                      value={editingFixture.stubhubPrice || ''}
                      onChange={(e) =>
                        setEditingFixture({
                          ...editingFixture,
                          stubhubPrice: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      StubHub Affiliate URL
                    </label>
                    <input
                      type="text"
                      value={editingFixture.stubhubUrl || ''}
                      onChange={(e) =>
                        setEditingFixture({ ...editingFixture, stubhubUrl: e.target.value })
                      }
                      placeholder="https://stubhub.com/...?ref=..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Viagogo Price ({editingFixture.currency})
                    </label>
                    <input
                      type="number"
                      value={editingFixture.viagogoPrice || ''}
                      onChange={(e) =>
                        setEditingFixture({
                          ...editingFixture,
                          viagogoPrice: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Viagogo Affiliate URL
                    </label>
                    <input
                      type="text"
                      value={editingFixture.viagogoUrl || ''}
                      onChange={(e) =>
                        setEditingFixture({ ...editingFixture, viagogoUrl: e.target.value })
                      }
                      placeholder="https://viagogo.com/...?ref=..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingFixture.isActive ?? true}
                    onChange={(e) =>
                      setEditingFixture({ ...editingFixture, isActive: e.target.checked })
                    }
                    className="rounded border-slate-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Active &amp; Visible on Public Ticket Engine</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingFixture(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Fixture
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
