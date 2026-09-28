import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | HypeFixture',
    default: 'HypeFixture - Where to Watch Live Football, NFL, NBA & UFC Streams',
  },
  description:
    'Find where to watch live sports today. Broadcast channels, official streaming platforms, and matchday kickoff times for Premier League, Champions League, NFL, NBA, and UFC.',
  keywords: [
    'where to watch sports',
    'live sports stream',
    'premier league live stream',
    'nfl sunday night live',
    'nba league pass guide',
    'ufc ppv broadcast channels',
  ],
  metadataBase: new URL('https://hypefixture.com'),
  openGraph: {
    title: 'HypeFixture - Where to Watch Live Sports Today',
    description:
      'Verified broadcast channels, kickoff times, and streaming access for Premier League, NFL, NBA, and UFC.',
    url: 'https://hypefixture.com',
    siteName: 'HypeFixture',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HypeFixture - Live Sports Schedule & Broadcast Guides',
    description: 'Find where to watch live football, NFL, NBA & UFC broadcasts legally today.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" style={{ colorScheme: 'dark' }}>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500/25 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 bg-slate-950">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
