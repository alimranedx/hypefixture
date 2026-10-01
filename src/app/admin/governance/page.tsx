import React from 'react';
import GovernanceSection from '@/components/admin/sections/GovernanceSection';

export const metadata = {
  title: 'Super Admin Governance & Approvals | TicketFixture Admin',
  description: 'Manage staff approvals, admin permissions, and role access',
};

export default function GovernancePage() {
  return <GovernanceSection />;
}
