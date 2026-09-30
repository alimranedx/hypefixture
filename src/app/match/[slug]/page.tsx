import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Ticket, HelpCircle } from 'lucide-react';
import { getTicketEventBySlug, getAllTicketEvents } from '@/lib/tickets';
import TicketHeroCard from '@/components/TicketHeroCard';
import TicketComparisonEngine from '@/components/TicketComparisonEngine';
import StadiumSeatingGuide from '@/components/StadiumSeatingGuide';
import BroadcasterGuide from '@/components/BroadcasterGuide';
import JsonLd from '@/components/JsonLd';

interface MatchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const events = getAllTicketEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getTicketEventBySlug(slug);

  if (!event) {
    return { title: 'Matchday Ticket Guide Not Found | HypeFixture' };
  }

  const currencySymbol = event.currency === 'GBP' ? '£' : event.currency === 'EUR' ? '€' : '$';

  return {
    title: `${event.title} - Compare Prices from ${currencySymbol}${event.minPrice} | HypeFixture`,
    description: `Compare verified ${event.title} from SeatGeek, StubHub, Viagogo, and TickPick. View ${event.venueName} seating chart, category pricing, and 100% guaranteed tickets from ${currencySymbol}${event.minPrice}.`,
    keywords: [
      `${event.title}`,
      `${event.homeTeam} vs ${event.awayTeam} tickets`,
      `cheap ${event.title}`,
      `${event.venueName} seating chart`,
      `where to buy ${event.title}`,
    ],
    openGraph: {
      title: `${event.title} | Verified Tickets from ${currencySymbol}${event.minPrice}`,
      description: `Compare ticket prices and seating categories for ${event.homeTeam} vs ${event.awayTeam} at ${event.venueName}.`,
      images: [event.featuredImage],
    },
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { slug } = await params;
  const event = getTicketEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const currencySymbol = event.currency === 'GBP' ? '£' : event.currency === 'EUR' ? '€' : '$';

  // Schema.org SportsEvent + AggregateOffer Structured Data for Google Rich Snippets
  const sportsEventSchema = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: event.title,
    startDate: event.kickoffUtc,
    location: {
      '@type': 'Place',
      name: event.venueName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.stadiumAddress,
        addressLocality: event.city,
        addressCountry: event.country,
      },
    },
    sport: event.sport,
    image: event.featuredImage,
    description: `Compare verified ticket prices for ${event.title} taking place at ${event.venueName}, ${event.city}.`,
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: String(event.minPrice),
      highPrice: String(event.maxPrice),
      priceCurrency: event.currency,
      offerCount: String(event.availableTickets),
      availability: 'https://schema.org/InStock',
      url: `https://hypefixture.com/match/${event.slug}`,
      offers: event.offers.map((offer) => ({
        '@type': 'Offer',
        name: `${offer.vendorName} - ${offer.seatingTier}`,
        price: String(offer.price),
        priceCurrency: offer.originalCurrency,
        availability: 'https://schema.org/InStock',
        url: offer.affiliateUrl,
      })),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: event.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <JsonLd data={sportsEventSchema} />
      <JsonLd data={faqSchema} />

      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Match Tickets
        </Link>
        <span className="text-xs text-slate-500 font-semibold">
          Updated 5 mins ago &bull; Verified Inventory
        </span>
      </div>

      {/* Hero Event Card with Live Countdown & Pricing */}
      <TicketHeroCard
        title={event.title}
        sport={event.sport}
        tournament={event.tournament}
        venueName={event.venueName}
        city={event.city}
        country={event.country}
        kickoffUtc={event.kickoffUtc}
        matchDate={event.matchDate}
        minPrice={event.minPrice}
        currency={event.currency}
        availableTickets={event.availableTickets}
        demandStatus={event.demandStatus}
        featuredImage={event.featuredImage}
      />

      {/* Interactive Ticket Comparison Engine */}
      <div id="ticket-comparison" className="scroll-mt-10">
        <TicketComparisonEngine
          offers={event.offers}
          matchTitle={event.title}
          currency={event.currency}
        />
      </div>

      {/* Stadium Seating Blueprint & Best View Guide */}
      <StadiumSeatingGuide
        venueName={event.venueName}
        city={event.city}
        country={event.country}
        capacity={event.venueCapacity}
        address={event.stadiumAddress}
        currency={event.currency}
        seatingTiers={event.seatingTiers}
      />

      {/* TV Broadcaster Guide for Home Fans */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xl font-bold text-white">
            Can&apos;t Attend in Person? Official TV &amp; Streaming Channels
          </h3>
        </div>
        <BroadcasterGuide broadcasters={event.broadcasters} />
      </div>

      {/* FAQ & Buying Guide */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xl font-bold text-white">
            Frequently Asked Questions: {event.title}
          </h3>
        </div>

        <div className="space-y-4">
          {event.faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <h4 className="text-sm font-bold text-white">{faq.question}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
