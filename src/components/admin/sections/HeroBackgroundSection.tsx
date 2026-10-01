'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sliders,
  Sparkles,
  Eye,
  Film,
  Plus,
  Trash2,
  Edit2,
  Check,
  RefreshCw,
  ExternalLink,
  Play,
  Pause,
  AlertCircle,
  Trophy,
  Layers,
  Activity,
  Tv,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

interface HeroSceneItem {
  id: string;
  name: string;
  nickname?: string | null;
  sport: string;
  team: string;
  tournament: string;
  poseTitle: string;
  poseDescription: string;
  statBadge: string;
  accentColor: string;
  borderGlow: string;
  image: string;
  videoUrl?: string | null;
  ticketSlug: string;
  order: number;
  isActive: boolean;
  matchCompetition?: string | null;
  matchMinuteOrOver?: string | null;
  matchHomeTeam?: string | null;
  matchAwayTeam?: string | null;
  matchScore?: string | null;
  matchLiveAction?: string | null;
}

interface HeroSettings {
  heroOpacity: number;
  heroKenBurns: boolean;
  heroCycleSeconds: number;
  heroBeamsEnabled: boolean;
  heroRadarEnabled: boolean;
  heroScoreTicker: boolean;
}

export default function HeroBackgroundSection() {
  const { setStatusMessage } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settings, setSettings] = useState<HeroSettings>({
    heroOpacity: 80,
    heroKenBurns: true,
    heroCycleSeconds: 7,
    heroBeamsEnabled: true,
    heroRadarEnabled: true,
    heroScoreTicker: true,
  });

  const [scenes, setScenes] = useState<HeroSceneItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Partial<HeroSceneItem> | null>(null);
  const [savingScene, setSavingScene] = useState(false);

  // Fetch hero background config
  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/hero-background');
      const data = await res.json();
      if (data.success) {
        if (data.settings) setSettings(data.settings);
        if (data.scenes) setScenes(data.scenes);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to load hero background configuration.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error fetching hero background.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  // Save global hero settings
  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      const res = await fetch('/api/admin/hero-background', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Hero background settings saved successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save settings.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error saving settings.' });
    } finally {
      setSavingSettings(false);
    }
  };

  // Toggle active state for a player scene
  const handleToggleScene = async (scene: HeroSceneItem) => {
    const updatedState = !scene.isActive;
    // Optimistic UI update
    setScenes((prev) =>
      prev.map((s) => (s.id === scene.id ? { ...s, isActive: updatedState } : s))
    );

    try {
      const res = await fetch('/api/admin/hero-background', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: scene.id, isActive: updatedState }),
      });
      const data = await res.json();
      if (!data.success) {
        // Rollback
        setScenes((prev) =>
          prev.map((s) => (s.id === scene.id ? { ...s, isActive: scene.isActive } : s))
        );
        setStatusMessage({ type: 'error', text: data.error || 'Failed to toggle scene.' });
      } else {
        setStatusMessage({
          type: 'success',
          text: `${scene.name} scene is now ${updatedState ? 'Active' : 'Muted'}.`,
        });
      }
    } catch (err: any) {
      setScenes((prev) =>
        prev.map((s) => (s.id === scene.id ? { ...s, isActive: scene.isActive } : s))
      );
      setStatusMessage({ type: 'error', text: err.message || 'Error updating scene.' });
    }
  };

  // Delete a scene
  const handleDeleteScene = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the hero scene for "${name}"?`)) return;

    try {
      const res = await fetch('/api/admin/hero-background', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setScenes((prev) => prev.filter((s) => s.id !== id));
        setStatusMessage({ type: 'success', text: `Deleted scene "${name}".` });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to delete scene.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error deleting scene.' });
    }
  };

  // Open modal for new scene
  const handleAddNew = () => {
    setEditingScene({
      name: '',
      nickname: '',
      sport: 'football',
      team: '',
      tournament: '',
      poseTitle: '',
      poseDescription: '',
      statBadge: 'Superstar 🏆',
      accentColor: 'from-sky-500 via-teal-400 to-emerald-500',
      borderGlow: 'shadow-sky-500/30 border-sky-500/40',
      image: '/players/messi-pose.jpg',
      ticketSlug: 'arsenal-vs-chelsea',
      order: scenes.length + 1,
      isActive: true,
      matchCompetition: 'Premier League Derby',
      matchMinuteOrOver: "75' IN-PLAY",
      matchHomeTeam: 'HOME',
      matchAwayTeam: 'AWAY',
      matchScore: '1 - 0',
      matchLiveAction: 'Dangerous attack down the wing',
    });
    setModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (scene: HeroSceneItem) => {
    setEditingScene({ ...scene });
    setModalOpen(true);
  };

  // Save scene form (create or edit)
  const handleSaveScene = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScene?.name || !editingScene?.image || !editingScene?.poseTitle) {
      alert('Please fill in Player Name, Image URL, and Pose Title.');
      return;
    }

    try {
      setSavingScene(true);
      const res = await fetch('/api/admin/hero-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingScene),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: `Hero scene for "${editingScene.name}" saved!`,
        });
        setModalOpen(false);
        setEditingScene(null);
        fetchHeroData();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save scene.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error saving scene.' });
    } finally {
      setSavingScene(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Film className="w-4 h-4 text-emerald-400" />
            Visual Identity &amp; Moving Atmosphere
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Hero Motion Background Controller
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Manage the cinematic motion canvas of the public homepage. Control background video opacity,
            stadium lighting sweeps, broadcast scanlines, and customize superstar action poses (Messi, Ronaldo, Kohli, etc.).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-emerald-500/50 text-xs font-bold text-slate-200 hover:text-white transition shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>View Live Site</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black transition shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Superstar Scene</span>
          </button>
        </div>
      </div>

      {/* Global Controls Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Global Background &amp; Animation Settings</h3>
              <p className="text-xs text-slate-400">Tune the visual weight, cycle frequency, and atmospheric effects.</p>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition"
          >
            {savingSettings ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Opacity Slider */}
          <div className="space-y-2.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Background Video Opacity</span>
              </label>
              <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                {settings.heroOpacity}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={settings.heroOpacity}
              onChange={(e) => setSettings({ ...settings, heroOpacity: Number(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Subtle (20%)</span>
              <span>Balanced (80%)</span>
              <span>Ultra Vivid (100%)</span>
            </div>
          </div>

          {/* Cycle Interval */}
          <div className="space-y-2.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white">Slide Cycle Duration</label>
              <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                {settings.heroCycleSeconds}s
              </span>
            </div>
            <select
              value={settings.heroCycleSeconds}
              onChange={(e) => setSettings({ ...settings, heroCycleSeconds: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value={4}>4 seconds (Fast pace)</option>
              <option value={5}>5 seconds</option>
              <option value={7}>7 seconds (Recommended broadcast default)</option>
              <option value={10}>10 seconds</option>
              <option value={15}>15 seconds (Relaxed)</option>
            </select>
            <p className="text-[10px] text-slate-500">Seconds each superstar scene remains active on screen.</p>
          </div>

          {/* Ken Burns Motion Toggle */}
          <div className="space-y-2.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Ken Burns Camera Motion</div>
                <div className="text-[10px] text-slate-400">Cinematic zoom and panning animations</div>
              </div>
              <input
                type="checkbox"
                checked={settings.heroKenBurns}
                onChange={(e) => setSettings({ ...settings, heroKenBurns: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>
            <span className="text-[10px] text-emerald-400/80 font-medium">
              {settings.heroKenBurns ? '✓ Camera movement enabled' : '✕ Static imagery'}
            </span>
          </div>

          {/* Stadium Beams Toggle */}
          <div className="space-y-2.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Stadium Spotlight Beams</div>
                <div className="text-[10px] text-slate-400">Sweeping overhead emerald &amp; blue floodlights</div>
              </div>
              <input
                type="checkbox"
                checked={settings.heroBeamsEnabled}
                onChange={(e) => setSettings({ ...settings, heroBeamsEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {settings.heroBeamsEnabled ? 'Active atmospheric lighting' : 'Disabled'}
            </span>
          </div>

          {/* Laser Radar Scanning Line */}
          <div className="space-y-2.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Pitch Radar / Scan Line</div>
                <div className="text-[10px] text-slate-400">Moving broadcast telemetry beam across pitch</div>
              </div>
              <input
                type="checkbox"
                checked={settings.heroRadarEnabled}
                onChange={(e) => setSettings({ ...settings, heroRadarEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {settings.heroRadarEnabled ? 'Active telemetry line' : 'Disabled'}
            </span>
          </div>

          {/* In-Play Scoreboard Overlay */}
          <div className="space-y-2.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Match Score Ticker Pill</div>
                <div className="text-[10px] text-slate-400">Floating live in-play scoreboard widget</div>
              </div>
              <input
                type="checkbox"
                checked={settings.heroScoreTicker}
                onChange={(e) => setSettings({ ...settings, heroScoreTicker: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {settings.heroScoreTicker ? 'Display live score overlay' : 'Hidden'}
            </span>
          </div>
        </div>
      </div>

      {/* Superstar Scenes List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-400" />
              Superstar Match Scenes ({scenes.length})
            </h3>
            <p className="text-xs text-slate-400">
              Each scene configures a superstar player, their action pose, match in-play scoreboard, and direct ticket destination.
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Active: <strong className="text-emerald-400">{scenes.filter((s) => s.isActive).length}</strong> / {scenes.length}
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
            <span className="text-xs font-bold">Loading superstar scenes...</span>
          </div>
        ) : scenes.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
            No superstar scenes found. Click &quot;Add Superstar Scene&quot; to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {scenes.map((scene) => (
              <div
                key={scene.id}
                className={`group relative rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden shadow-lg ${
                  scene.isActive
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-emerald-500/50'
                    : 'bg-slate-950/60 border-slate-800/50 opacity-60'
                }`}
              >
                {/* Visual Image Banner with Pose Title */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${scene.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Sport & Status Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md border border-white/20 text-white flex items-center gap-1 shadow">
                      {scene.sport === 'football' ? '⚽ Football' : '🏏 Cricket'}
                    </span>

                    <button
                      onClick={() => handleToggleScene(scene)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                        scene.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                      title={scene.isActive ? 'Click to Mute' : 'Click to Activate'}
                    >
                      {scene.isActive ? '● Live' : '○ Muted'}
                    </button>
                  </div>

                  {/* Pose Title Overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Proper Pose:
                    </div>
                    <div className="text-sm font-black text-white drop-shadow truncate">
                      {scene.poseTitle}
                    </div>
                  </div>
                </div>

                {/* Scene Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-black text-white">{scene.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                        Seq #{scene.order}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-0.5 truncate">
                      {scene.team} • {scene.tournament}
                    </div>

                    <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {scene.poseDescription}
                    </p>
                  </div>

                  {/* In-play match widget preview */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{scene.matchCompetition || 'In-Play Match'}</span>
                      <span className="text-emerald-400 font-bold">{scene.matchMinuteOrOver || 'LIVE'}</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{scene.matchHomeTeam}</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs">
                        {scene.matchScore || '0 - 0'}
                      </span>
                      <span>{scene.matchAwayTeam}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 truncate max-w-[120px]" title={scene.ticketSlug}>
                      🎟️ /{scene.ticketSlug}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEdit(scene)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="Edit Scene"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteScene(scene.id, scene.name)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                        title="Delete Scene"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Add Scene Modal */}
      {modalOpen && editingScene && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                {editingScene.id ? `Edit Scene: ${editingScene.name}` : 'Add New Superstar Scene'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveScene} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Player Name *</label>
                  <input
                    type="text"
                    required
                    value={editingScene.name || ''}
                    onChange={(e) => setEditingScene({ ...editingScene, name: e.target.value })}
                    placeholder="e.g. Lionel Messi, Erling Haaland"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Sport Category</label>
                  <select
                    value={editingScene.sport || 'football'}
                    onChange={(e) => setEditingScene({ ...editingScene, sport: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="football">⚽ Football (Soccer)</option>
                    <option value="cricket">🏏 Cricket</option>
                    <option value="basketball">🏀 Basketball</option>
                    <option value="tennis">🎾 Tennis</option>
                    <option value="f1">🏎️ Formula 1</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Team / Nation</label>
                  <input
                    type="text"
                    value={editingScene.team || ''}
                    onChange={(e) => setEditingScene({ ...editingScene, team: e.target.value })}
                    placeholder="e.g. Argentina / Inter Miami"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Tournament / League</label>
                  <input
                    type="text"
                    value={editingScene.tournament || ''}
                    onChange={(e) => setEditingScene({ ...editingScene, tournament: e.target.value })}
                    placeholder="e.g. Premier League, Champions League"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Proper Player Pose Title *</label>
                <input
                  type="text"
                  required
                  value={editingScene.poseTitle || ''}
                  onChange={(e) => setEditingScene({ ...editingScene, poseTitle: e.target.value })}
                  placeholder="e.g. Iconic Heavenly Arms Celebration, Airborne SIUUU Stance"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Pose Description</label>
                <textarea
                  rows={2}
                  value={editingScene.poseDescription || ''}
                  onChange={(e) => setEditingScene({ ...editingScene, poseDescription: e.target.value })}
                  placeholder="Description of the player pose and stadium glory..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Background Image URL *</label>
                  <input
                    type="text"
                    required
                    value={editingScene.image || ''}
                    onChange={(e) => setEditingScene({ ...editingScene, image: e.target.value })}
                    placeholder="/players/messi-pose.jpg or https://images..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Target Ticket Slug</label>
                  <input
                    type="text"
                    value={editingScene.ticketSlug || ''}
                    onChange={(e) => setEditingScene({ ...editingScene, ticketSlug: e.target.value })}
                    placeholder="e.g. arsenal-vs-chelsea"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* In-play match overlay settings */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Live In-Play Match Scoreboard Overlay
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Home Team</label>
                    <input
                      type="text"
                      value={editingScene.matchHomeTeam || ''}
                      onChange={(e) => setEditingScene({ ...editingScene, matchHomeTeam: e.target.value })}
                      placeholder="MIA"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Score</label>
                    <input
                      type="text"
                      value={editingScene.matchScore || ''}
                      onChange={(e) => setEditingScene({ ...editingScene, matchScore: e.target.value })}
                      placeholder="2 - 1"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Away Team</label>
                    <input
                      type="text"
                      value={editingScene.matchAwayTeam || ''}
                      onChange={(e) => setEditingScene({ ...editingScene, matchAwayTeam: e.target.value })}
                      placeholder="NYC"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Minute / Status</label>
                    <input
                      type="text"
                      value={editingScene.matchMinuteOrOver || ''}
                      onChange={(e) => setEditingScene({ ...editingScene, matchMinuteOrOver: e.target.value })}
                      placeholder="74' IN-PLAY"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Live Match Action Alert</label>
                  <input
                    type="text"
                    value={editingScene.matchLiveAction || ''}
                    onChange={(e) => setEditingScene({ ...editingScene, matchLiveAction: e.target.value })}
                    placeholder="⚽ Messi signature free-kick curler into top corner"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingScene.order || 0}
                    onChange={(e) => setEditingScene({ ...editingScene, order: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActiveCheckbox"
                    checked={editingScene.isActive ?? true}
                    onChange={(e) => setEditingScene({ ...editingScene, isActive: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="isActiveCheckbox" className="text-xs font-bold text-white cursor-pointer">
                    Active in Rotating Hero
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingScene}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20"
                >
                  {savingScene ? 'Saving...' : 'Save Superstar Scene'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
