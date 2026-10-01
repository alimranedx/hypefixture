import React from 'react';
import TicketsManagementSection from '@/components/admin/sections/TicketsManagementSection';

export const metadata = {
  title: 'Match Tickets Management | TicketFixture Admin',
  description: 'Dynamically add, edit prices, and manage European football ticket fixtures and affiliate links',
};

export default function AdminTicketsPage() {
  return <TicketsManagementSection />;
}
