'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminProvider } from '@/context/AdminContext';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <AdminProvider>
      <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
        {/* Persistent Unified Sidebar */}
        <AdminSidebar />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Dynamic Top Header with Action Bar & Notifications */}
          <AdminHeader />

          {/* Child Page Routed Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
