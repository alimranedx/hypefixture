'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OverviewSection from '@/components/admin/sections/OverviewSection';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Backward-compatibility: if user visits /admin/dashboard?tab=... automatically forward to proper route
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (!tab) return;

    const routeMap: Record<string, string> = {
      'overview': '/admin/dashboard',
      'ai-studio': '/admin/ai-studio',
      'posts': '/admin/posts',
      'new-post': '/admin/posts/new',
      'keywords': '/admin/keywords',
      'serp': '/admin/serp',
      'syndication': '/admin/syndication',
      'affiliates': '/admin/affiliates',
      'security': '/admin/governance',
      'governance': '/admin/governance',
    };

    if (routeMap[tab] && routeMap[tab] !== '/admin/dashboard') {
      router.replace(routeMap[tab]);
    }
  }, [searchParams, router]);

  return <OverviewSection />;
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-xs text-slate-400">Loading overview...</span>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
