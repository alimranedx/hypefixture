import React, { Suspense } from 'react';
import SportsSection from '@/components/admin/sections/SportsSection';

export const metadata = {
  title: 'Sports Coverage & Dynamic Categories | HypeFixture Admin',
  description: 'Manage dynamic sports coverage, active selection, and Gemini cluster targeting',
};

export default function SportsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 animate-pulse text-xs">
          Loading sports coverage database...
        </div>
      }
    >
      <SportsSection />
    </Suspense>
  );
}
