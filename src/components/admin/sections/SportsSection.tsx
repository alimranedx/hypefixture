'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAdmin, SportCategoryItem } from '@/context/AdminContext';
import {
  Trophy,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Check,
  X,
  Radio,
  Sliders,
  Sparkles,
  Layers,
  Search,
  LayoutGrid,
  List,
  Loader2,
} from 'lucide-react';

export default function SportsSection() {
  const {
    sports,
    loadAllData,
    handleToggleSport,
    handleCreateOrUpdateSport,
    handleDeleteSport,
    setStatusMessage,
    settings,
  } = useAdmin();

  const searchParams = useSearchParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSport, setEditingSport] = useState<SportCategoryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '🏆',
    description: '',
    isActive: true,
    order: 0,
  });

  // Auto-open modal if ?action=new in URL
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openCreateModal();
    }
  }, [searchParams]);

  const openCreateModal = () => {
    setEditingSport(null);
    setFormData({
      name: '',
      slug: '',
      icon: '🏆',
      description: '',
      isActive: true,
      order: sports.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (sport: SportCategoryItem) => {
    setEditingSport(sport);
    setFormData({
      name: sport.name,
      slug: sport.slug,
      icon: sport.icon || '🏆',
      description: sport.description || '',
      isActive: sport.isActive,
      order: sport.order || 0,
    });
    setModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    if (!editingSport) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, name, slug }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      setStatusMessage({ type: 'error', text: 'Sport name and slug are required.' });
      return;
    }

    setSaving(true);
    const success = await handleCreateOrUpdateSport({
      ...(editingSport ? { id: editingSport.id } : {}),
      name: formData.name.trim(),
      slug: formData.slug.trim().toLowerCase(),
      icon: formData.icon.trim() || '🏆',
      description: formData.description.trim() || null,
      isActive: formData.isActive,
      order: Number(formData.order) || 0,
    });
    setSaving(false);

    if (success) {
      setModalOpen(false);
    }
  };

  const onToggleSport = async (id: string, currentActive: boolean) => {
    setTogglingId(id);
    await handleToggleSport(id, currentActive);
    setTogglingId(null);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const confirmDelete = async (id: string) => {
    setDeletingId(id);
    await handleDeleteSport(id);
    setDeletingId(null);
    setDeleteConfirmId(null);
  };

  const filteredSports = sports.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeCount = sports.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6">
      {/* Top Header with prominent Right-Top-Corner Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-black text-white tracking-tight">
              Sports Coverage Management
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure dynamic sports categories, activate AI automated writing clusters, and manage editorial coverage.
          </p>
        </div>

        {/* Right Top Corner Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition disabled:opacity-50"
            title="Refresh sports list"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add New Sport Coverage
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Categories
            </span>
            <span className="text-xl font-black text-white">{sports.length} Sports</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Selected in AI Studio
            </span>
            <span className="text-xl font-black text-emerald-400">
              {activeCount} Active
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Gemini Active Pipeline
            </span>
            <span className="text-xs font-semibold text-slate-300 block truncate max-w-[200px]" title={settings.activeSports}>
              {settings.activeSports || 'None selected'}
            </span>
          </div>
        </div>
      </div>

      {/* Search & View Mode Switcher */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sports by name, slug, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'grid'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'table'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Data Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Table</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden lg:inline">
            Showing {filteredSports.length} of {sports.length} categories
          </span>
        </div>
      </div>

      {/* VIEW 1: Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSports.map((sport) => {
            return (
              <div
                key={sport.id}
                className={`relative rounded-2xl p-5 border transition flex flex-col justify-between group shadow-xl ${
                  sport.isActive
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-500/40 hover:border-emerald-500/70 shadow-emerald-950/20'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl select-none">{sport.icon || '🏆'}</span>
                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition">
                          {sport.name}
                        </h4>
                        <code className="text-[10px] text-emerald-400/90 font-mono">
                          slug: {sport.slug}
                        </code>
                      </div>
                    </div>

                    {/* 1-Click Toggle Active */}
                    <button
                      type="button"
                      disabled={togglingId === sport.id}
                      onClick={() => onToggleSport(sport.id, sport.isActive)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-60 ${
                        sport.isActive ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                      title={sport.isActive ? 'Selected. Click to deselect.' : 'Deselected. Click to select.'}
                    >
                      {togglingId === sport.id ? (
                        <span
                          className={`pointer-events-none inline-flex items-center justify-center h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            sport.isActive ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        >
                          <Loader2 className="w-3 h-3 text-slate-950 animate-spin" />
                        </span>
                      ) : (
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            sport.isActive ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 min-h-[32px]">
                    {sport.description || 'Live match commentary, schedules, betting odds & vital fixtures.'}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      sport.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {sport.isActive ? 'Selected' : 'Deselected'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Explicit Edit & Update button */}
                    <button
                      onClick={() => openEditModal(sport)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1"
                      title="Edit & update sport details"
                    >
                      <Edit2 className="w-3 h-3 text-emerald-400" />
                      Edit
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => setDeleteConfirmId(sport.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete this sport"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: Data Table View */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Slug</th>
                  <th className="py-3.5 px-4 font-bold">Description</th>
                  <th className="py-3.5 px-4 font-bold text-center">AI Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredSports.map((sport) => {
                  return (
                    <tr key={sport.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl select-none">{sport.icon || '🏆'}</span>
                          <span className="font-bold text-white text-xs">{sport.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <code className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {sport.slug}
                        </code>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                        {sport.description || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          disabled={togglingId === sport.id}
                          onClick={() => onToggleSport(sport.id, sport.isActive)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-60 ${
                            sport.isActive ? 'bg-emerald-500' : 'bg-slate-800'
                          }`}
                          title={sport.isActive ? 'Selected. Click to deselect.' : 'Deselected. Click to select.'}
                        >
                          {togglingId === sport.id ? (
                            <span
                              className={`pointer-events-none inline-flex items-center justify-center h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                sport.isActive ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            >
                              <Loader2 className="w-3 h-3 text-slate-950 animate-spin" />
                            </span>
                          ) : (
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                sport.isActive ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(sport)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition inline-flex items-center gap-1.5"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
                            Edit / Update
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(sport.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Delete sport"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredSports.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-white font-bold text-base">No sports found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No sport categories match "${searchQuery}".`
              : 'No sports configured yet. Click the button above to add your first coverage category.'}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Add New Sport Coverage
          </button>
        </div>
      )}

      {/* Create / Edit / Update Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  {editingSport ? 'Edit & Update Sport Coverage' : 'Add New Sport Coverage'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  Sport Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Formula 1, Cricket, NBA Basketball"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1.5">
                    URL Slug <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. f1, cricket, nba"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 font-mono text-xs focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1.5">
                    Icon / Emoji
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 🏎️, 🏏, 🏀, ⚽"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 text-center text-base focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  Description & Scope
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Grand Prix races, telemetry, driver standings & live commentary"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none transition"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-bold text-white block">Active in AI Studio</span>
                  <span className="text-[11px] text-slate-400 block">
                    Automatically targeted by Gemini Autonomous AI generation.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    formData.isActive ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      formData.isActive ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition disabled:opacity-50 shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin text-slate-950" />}
                  <span>
                    {saving
                      ? editingSport
                        ? 'Updating Sport...'
                        : 'Creating Sport...'
                      : editingSport
                      ? 'Update Sport Coverage'
                      : 'Create Sport Coverage'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Delete Sport Category?</h3>
            </div>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove this sport? It will also be excluded from Gemini autonomous sports generation.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                disabled={Boolean(deletingId)}
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={Boolean(deletingId)}
                onClick={() => confirmDelete(deleteConfirmId)}
                className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition shadow-lg shadow-rose-500/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                {deletingId && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
                <span>{deletingId ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
