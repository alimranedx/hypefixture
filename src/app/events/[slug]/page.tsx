import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Ticket, HelpCircle, Calendar, MapPin } from 'lucide-react';
import { getDynamicTicketEventBySlug, getDynamicTicketEvents } from '@/lib/tickets';
import TicketHeroCard from '@/components/TicketHeroCard';
import TicketComparisonEngine from '@/components/TicketComparisonEngine';
import StadiumSeatingGuide from '@/components/StadiumSeatingGuide';
import BroadcasterGuide from '@/components/BroadcasterGuide';
import JsonLd from '@/components/JsonLd';

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const events = await getDynamicTicketEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getDynamicTicketEventBySlug(slug);

  if (!event) {
    return { title: 'Event Ticket Guide Not Found | TicketFixture' };
  }

  const currencySymbol = event.currency === 'GBP' ? '£' : event.currency === 'EUR' ? '€' : '$';

  return {
    title: `${event.title} - Compare Tickets from ${currencySymbol}${event.minPrice} | TicketFixture`,
    description: `Compare verified ${event.title} from SeatGeek, StubHub, and Viagogo. View ${event.venueName} seating chart, category pricing, and 100% guaranteed tickets from ${currencySymbol}${event.minPrice}.`,
    openGraph: {
      title: `${event.title} | Verified Tickets from ${currencySymbol}${event.minPrice}`,
      description: `Compare ticket prices and seating categories for ${event.homeTeam} vs ${event.awayTeam} at ${event.venueName}.`,
      images: [event.featuredImage],
    },
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getDynamicTicketEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const currencySymbol = event.currency === 'GBP' ? '£' : event.currency === 'EUR' ? '€' : '$';

  // Schema.org SportsEvent + AggregateOffer Structured Data
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
      url: `https://ticketfixture.com/events/${event.slug}`,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <JsonLd data={sportsEventSchema} />
      <JsonLd data={faqSchema} />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/" className="hover:text-emerald-400 transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/events" className="hover:text-emerald-400 transition">
          Events
        </Link>
        <span>/</span>
        <Link href={`/sports/${event.sport.toLowerCase()}`} className="hover:text-emerald-400 transition capitalize">
          {event.sport}
        </Link>
        <span>/</span>
        <span className="text-slate-200 truncate">{event.title}</span>
      </nav>

      {/* Event Header Banner */}
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

      {/* Ticket Comparison Engine */}
      <div id="ticket-offers" className="scroll-mt-10">
        <TicketComparisonEngine
          offers={event.offers}
          matchTitle={event.title}
          currency={event.currency}
        />
      </div>

      {/* Stadium Seating Blueprint */}
      <StadiumSeatingGuide
        venueName={event.venueName}
        city={event.city}
        country={event.country}
        capacity={event.venueCapacity}
        address={event.stadiumAddress}
        currency={event.currency}
        seatingTiers={event.seatingTiers}
      />

      {/* Broadcaster & Streaming Channels */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xl font-bold text-white">
            Can&apos;t Attend in Person? Official TV &amp; Streaming Channels
          </h3>
        </div>
        <BroadcasterGuide broadcasters={event.broadcasters} />
      </div>

      {/* Trust & Guarantee Callout */}
      <div className="rounded-3xl border border-emerald-500/20 bg-emerald-950/15 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">100% Money-Back Buyer Protection</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              All tickets aggregated by TicketFixture are sourced from accredited secondary marketplaces featuring full buyer guarantees, verified barcodes, and on-time mobile delivery before kickoff.
            </p>
          </div>
        </div>
        <Link
          href="#ticket-offers"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider shrink-0 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition"
        >
          Compare Verified Offers
        </Link>
      </div>

      {/* FAQs Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" /> Matchday Ticket Questions
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Frequently Asked Questions About {event.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {event.faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-sm font-black text-white">{faq.question}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
