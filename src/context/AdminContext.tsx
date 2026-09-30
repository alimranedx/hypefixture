'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export interface SystemSettings {
  postsPerDay: number;
  autoPublish: boolean;
  activeSports: string;
  affforceUrl: string;
  vpnUrl: string;
  fuboUrl: string;
  autoShareSocial: boolean;
  autoIndexNow: boolean;
  indexNowKey: string;
  twitterApiKey: string;
  twitterApiSecret: string;
  twitterAccessToken: string;
  twitterAccessSecret: string;
  facebookPageId: string;
  facebookAccessToken: string;
  pinterestAccessToken: string;
  pinterestBoardId: string;
}

export interface GenerationProgress {
  active: boolean;
  step: string;
  percent: number;
  newPosts: any[];
}

export interface SportCategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  isActive: boolean;
  order: number;
}

export interface AdminContextType {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  posts: any[];
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
  keywords: any[];
  setKeywords: React.Dispatch<React.SetStateAction<any[]>>;
  affiliates: any[];
  setAffiliates: React.Dispatch<React.SetStateAction<any[]>>;
  adminsList: any[];
  setAdminsList: React.Dispatch<React.SetStateAction<any[]>>;
  sports: SportCategoryItem[];
  setSports: React.Dispatch<React.SetStateAction<SportCategoryItem[]>>;
  loading: boolean;
  generatingAi: boolean;
  statusMessage: { type: 'success' | 'error'; text: string } | null;
  setStatusMessage: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error'; text: string } | null>>;
  aiTelemetry: any | null;
  setAiTelemetry: React.Dispatch<React.SetStateAction<any | null>>;
  generationProgress: GenerationProgress | null;
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress | null>>;
  syndicatingPostId: string | null;
  batchIndexing: boolean;
  loadAllData: () => Promise<void>;
  handleGeneratePosts: (count?: number) => Promise<void>;
  handleGenerateForKeyword: (keyword: string, sport: string) => Promise<boolean>;
  handleSaveSettings: (overrideSettings?: Partial<SystemSettings>) => Promise<boolean>;
  handleSavePostEdit: (postData: any) => Promise<boolean>;
  handleTogglePostStatus: (post: any) => Promise<void>;
  handleDeletePost: (id: string) => Promise<boolean>;
  handleAdminAction: (adminId: string, action: 'APPROVE' | 'REVOKE' | 'DELETE') => Promise<void>;
  handleSyndicatePost: (postId: string) => Promise<void>;
  handleBatchIndexNow: () => Promise<void>;
  handleToggleSport: (id: string, currentActive: boolean) => Promise<boolean>;
  handleCreateOrUpdateSport: (sportData: Partial<SportCategoryItem>) => Promise<boolean>;
  handleDeleteSport: (id: string) => Promise<boolean>;
}

const defaultSettings: SystemSettings = {
  postsPerDay: 10,
  autoPublish: true,
  activeSports: 'football,cricket',
  affforceUrl: 'https://seatgeek.com/?ref=hypefixture',
  vpnUrl: 'https://nordvpn.com',
  fuboUrl: 'https://www.fubo.tv',
  autoShareSocial: false,
  autoIndexNow: true,
  indexNowKey: 'hypefixture-indexnow-2026-key',
  twitterApiKey: '',
  twitterApiSecret: '',
  twitterAccessToken: '',
  twitterAccessSecret: '',
  facebookPageId: '',
  facebookAccessToken: '',
  pinterestAccessToken: '',
  pinterestBoardId: '',
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [posts, setPosts] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [sports, setSports] = useState<SportCategoryItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [aiTelemetry, setAiTelemetry] = useState<any | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);
  const [syndicatingPostId, setSyndicatingPostId] = useState<string | null>(null);
  const [batchIndexing, setBatchIndexing] = useState(false);

  // Auth Protection
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [authStatus, router]);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [setRes, postRes, kwRes, affRes, sportRes] = await Promise.all([
        fetch('/api/admin/settings').catch(() => null),
        fetch('/api/admin/posts').catch(() => null),
        fetch('/api/admin/keywords').catch(() => null),
        fetch('/api/admin/affiliates').catch(() => null),
        fetch('/api/admin/sports').catch(() => null),
      ]);

      if (setRes && setRes.ok) {
        const data = await setRes.json();
        if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }));
      }
      if (postRes && postRes.ok) {
        const data = await postRes.json();
        if (data.posts) setPosts(data.posts);
      }
      if (kwRes && kwRes.ok) {
        const data = await kwRes.json();
        if (data.keywords) setKeywords(data.keywords);
      }
      if (affRes && affRes.ok) {
        const data = await affRes.json();
        if (data.affiliates) setAffiliates(data.affiliates);
      }
      if (sportRes && sportRes.ok) {
        const data = await sportRes.json();
        if (data.sports) setSports(data.sports);
      }

      const userRole = (session?.user as any)?.role;
      if (userRole === 'SUPER_ADMIN') {
        const admRes = await fetch('/api/admin/users').catch(() => null);
        if (admRes && admRes.ok) {
          const data = await admRes.json();
          if (data.users) setAdminsList(data.users);
        }
      }
    } catch (e: any) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      loadAllData();
    }
  }, [authStatus, loadAllData]);

  // Generate Posts
  const handleGeneratePosts = async (customCount?: number) => {
    setGeneratingAi(true);
    setStatusMessage(null);

    setGenerationProgress({
      active: true,
      step: 'Initializing Google Gemini Autonomous Engine...',
      percent: 20,
      newPosts: [],
    });

    const timer1 = setTimeout(() => {
      setGenerationProgress((prev) =>
        prev
          ? {
              ...prev,
              step: 'Querying Gemini AI cascade (3.8 ➔ 3.7 ➔ 3.6 ➔ 3.5) with deduplication...',
              percent: 55,
            }
          : null
      );
    }, 1200);

    const timer2 = setTimeout(() => {
      setGenerationProgress((prev) =>
        prev
          ? {
              ...prev,
              step: 'Assigning HD sports photography & generating Schema.org SportsEvent metadata...',
              percent: 80,
            }
          : null
      );
    }, 2400);

    try {
      const res = await fetch('/api/admin/generate-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: customCount || settings.postsPerDay || 5,
          autoPublish: settings.autoPublish,
        }),
      });
      const data = await res.json();
      clearTimeout(timer1);
      clearTimeout(timer2);

      if (res.ok) {
        if (data.telemetry) {
          setAiTelemetry(data.telemetry);
        }
        setGenerationProgress({
          active: false,
          step: `Complete! Generated and published ${data.count} fresh vital sports articles using model "${data.model || data.telemetry?.model || 'Gemini'}".`,
          percent: 100,
          newPosts: data.posts || [],
        });
        setStatusMessage({
          type: 'success',
          text: data.shortLog || data.message || `⚡ Gemini created ${data.count} new vital sports articles!`,
        });
        loadAllData();
      } else {
        setGenerationProgress(null);
        setStatusMessage({ type: 'error', text: data.error || 'Generation failed' });
      }
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setGenerationProgress(null);
      setStatusMessage({ type: 'error', text: err.message || 'Generation error' });
    } finally {
      setGeneratingAi(false);
    }
  };

  // Generate for keyword
  const handleGenerateForKeyword = async (keyword: string, sport: string): Promise<boolean> => {
    setGeneratingAi(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'GENERATE_FOR_KEYWORD', keyword, sport }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: data.shortLog || data.message || `Targeted SEO article generated for: "${keyword}"`,
        });
        loadAllData();
        return true;
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to generate post for keyword' });
        return false;
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Keyword generation request error' });
      return false;
    } finally {
      setGeneratingAi(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (overrideSettings?: Partial<SystemSettings>): Promise<boolean> => {
    const payload = overrideSettings ? { ...settings, ...overrideSettings } : settings;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSettings(payload);
        setStatusMessage({ type: 'success', text: 'Settings saved successfully!' });
        return true;
      } else {
        const data = await res.json().catch(() => ({}));
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save settings.' });
        return false;
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Failed to save settings.' });
      return false;
    }
  };

  // Save Post Edit
  const handleSavePostEdit = async (postData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Article updated successfully!' });
        loadAllData();
        return true;
      } else {
        const data = await res.json().catch(() => ({}));
        setStatusMessage({ type: 'error', text: data.error || 'Failed to update article.' });
        return false;
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update article.' });
      return false;
    }
  };

  // Toggle Post Status
  const handleTogglePostStatus = async (post: any) => {
    const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id, status: newStatus }),
      });
      if (res.ok) {
        loadAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Post
  const handleDeletePost = async (id: string): Promise<boolean> => {
    if (!confirm('Are you sure you want to delete this article?')) return false;
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Article deleted successfully.' });
        loadAllData();
        return true;
      }
      return false;
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete article.' });
      return false;
    }
  };

  // Super Admin action
  const handleAdminAction = async (adminId: string, action: 'APPROVE' | 'REVOKE' | 'DELETE') => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: data.message });
        loadAllData();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Admin action failed' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  // Syndicate a single post
  const handleSyndicatePost = async (postId: string) => {
    try {
      setSyndicatingPostId(postId);
      const res = await fetch('/api/admin/syndicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: `Syndicated article! IndexNow: ${data.report?.indexNow?.success ? '✅ Pushed' : '⚠️ ' + (data.report?.indexNow?.message || 'Queued')}`,
        });
        loadAllData();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Syndication failed.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Syndication request failed.' });
    } finally {
      setSyndicatingPostId(null);
    }
  };

  // Batch IndexNow push
  const handleBatchIndexNow = async () => {
    try {
      setBatchIndexing(true);
      const res = await fetch('/api/admin/syndicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'BATCH_INDEXNOW' }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: data.message || 'Successfully submitted all URLs to IndexNow!' });
        loadAllData();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'IndexNow push failed.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setBatchIndexing(false);
    }
  };

  // Toggle sport active state
  const handleToggleSport = async (id: string, currentActive: boolean): Promise<boolean> => {
    // Optimistic UI update
    setSports((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !currentActive } : s))
    );
    try {
      const res = await fetch('/api/admin/sports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentActive }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.activeSports) {
          setSettings((prev) => ({ ...prev, activeSports: data.activeSports }));
        }
        return true;
      } else {
        // Rollback
        setSports((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isActive: currentActive } : s))
        );
        setStatusMessage({ type: 'error', text: data.error || 'Failed to update sport' });
        return false;
      }
    } catch (e: any) {
      setSports((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: currentActive } : s))
      );
      setStatusMessage({ type: 'error', text: e.message || 'Network error' });
      return false;
    }
  };

  // Create or Update Sport
  const handleCreateOrUpdateSport = async (sportData: Partial<SportCategoryItem>): Promise<boolean> => {
    try {
      const isEdit = !!sportData.id;
      const res = await fetch('/api/admin/sports', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sportData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: isEdit
            ? `Sport "${data.sport?.name || 'Category'}" updated successfully`
            : `Sport "${data.sport?.name || 'Category'}" added successfully`,
        });
        loadAllData();
        return true;
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save sport' });
        return false;
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Network error' });
      return false;
    }
  };

  // Delete Sport
  const handleDeleteSport = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/sports?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setSports((prev) => prev.filter((s) => s.id !== id));
        if (data.activeSports) {
          setSettings((prev) => ({ ...prev, activeSports: data.activeSports }));
        }
        setStatusMessage({ type: 'success', text: 'Sport deleted successfully' });
        return true;
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to delete sport' });
        return false;
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Network error' });
      return false;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        settings,
        setSettings,
        posts,
        setPosts,
        keywords,
        setKeywords,
        affiliates,
        setAffiliates,
        adminsList,
        setAdminsList,
        sports,
        setSports,
        loading,
        generatingAi,
        statusMessage,
        setStatusMessage,
        aiTelemetry,
        setAiTelemetry,
        generationProgress,
        setGenerationProgress,
        syndicatingPostId,
        batchIndexing,
        loadAllData,
        handleGeneratePosts,
        handleGenerateForKeyword,
        handleSaveSettings,
        handleSavePostEdit,
        handleTogglePostStatus,
        handleDeletePost,
        handleAdminAction,
        handleSyndicatePost,
        handleBatchIndexNow,
        handleToggleSport,
        handleCreateOrUpdateSport,
        handleDeleteSport,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
