import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | TicketFixture',
    default: 'TicketFixture - Compare Verified Matchday Tickets, Fixtures & Stadium Seats',
  },
  description:
    'Compare real-time verified matchday tickets, schedules, and stadium seating across SeatGeek, StubHub, and Viagogo. Find the cheapest seats with 100% money-back buyer protection.',
  keywords: [
    'matchday tickets',
    'compare sports tickets',
    'cheap football tickets',
    'premier league tickets',
    'el clasico tickets',
    'stadium seating guide',
    'seatgeek vs stubhub tickets',
  ],
  metadataBase: new URL('https://ticketfixture.com'),
  icons: {
    icon: '/favicon-32.png',
    shortcut: '/favicon-32.png',
    apple: '/logo-icon.png',
  },
  openGraph: {
    title: 'TicketFixture - Compare Verified Matchday Tickets & Stadium Seats',
    description:
      'Real-time ticket price comparison, official schedules, and stadium seating blueprints for Football, Cricket, and Live Events.',
    url: 'https://ticketfixture.com',
    siteName: 'TicketFixture',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TicketFixture - Compare Verified Matchday Tickets & Stadium Seats',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TicketFixture - Compare Verified Matchday Tickets & Stadium Seats',
    description: 'Find verified matchday tickets and compare prices from SeatGeek, StubHub, and Viagogo.',
    images: ['/og-image.png'],
  },
};

import { getActiveSports } from '@/lib/sports';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const activeSports = await getActiveSports();

  return (
    <html lang="en" className="dark scroll-smooth" style={{ colorScheme: 'dark' }}>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500/25 selection:text-white">
        <AuthProvider>
          <Navbar initialSports={activeSports} />
          <main className="flex-1 bg-slate-950">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
