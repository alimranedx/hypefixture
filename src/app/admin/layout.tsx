import React from 'react';
import AdminShell from '@/components/admin/AdminShell';

export const metadata = {
  title: 'HypeFixture Admin Control Center',
  description: 'Senior Sports Broadcasting & AI Automation Engine',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
