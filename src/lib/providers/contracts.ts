/**
 * TicketFixture Provider Architecture Contracts
 * 
 * Clean separation of concerns:
 * SPORTS / EVENT DATA -> TICKETFIXTURE EVENT -> TICKET OFFERS -> AFFILIATE PROVIDER -> MARKETPLACE
 */

export interface TicketProviderData {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  websiteUrl: string;
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
}

export interface TicketOfferData {
  id: string;
  eventId: string;
  providerId: string;
  providerName: string;
  providerSlug: string;
  seatingTier: string;
  tierCategory: 'CAT_1' | 'CAT_2' | 'CAT_3' | 'VIP' | 'AWAY';
  price: number;
  originalCurrency: string;
  originalUrl?: string | null;
  affiliateUrl: string;
  availability: 'AVAILABLE' | 'LOW_STOCK' | 'ALMOST_SOLD_OUT' | 'SOLD_OUT';
  isBestValue: boolean;
  instantDownload: boolean;
  guaranteeBadge: string;
  rating?: number;
  reviewCount?: number;
}

export interface EventData {
  id: string;
  slug: string;
  title: string;
  homeTeam: string;
  awayTeam: string;
  sport: string;
  tournament: string;
  matchDate: string;
  kickoffUtc?: string | null;
  venueName: string;
  city: string;
  country: string;
  venueCapacity: number;
  stadiumAddress: string;
  minPrice: number;
  maxPrice: number;
  currency: string;
  availableTickets: number;
  demandStatus: string;
  featuredImage?: string | null;
  offers: TicketOfferData[];
}

/**
 * Event Data Provider Abstraction
 * Allows integrating future feeds (API-Sports, Sportradar, ESPN, or mock feeds)
 * without rewriting business logic.
 */
export interface EventDataProviderInterface {
  readonly providerName: string;
  getEvents(filters?: { sport?: string; query?: string; limit?: number }): Promise<EventData[]>;
  getEventBySlug(slug: string): Promise<EventData | null>;
  searchEvents(query: string): Promise<EventData[]>;
}

/**
 * Affiliate Provider Interface
 * Allows integrating ticket marketplaces (SeatGeek, StubHub, Viagogo, Ticketmaster, Partnerize)
 * without hardcoding affiliate networks or URLs into the Event model.
 */
export interface AffiliateProviderInterface {
  readonly providerSlug: string;
  readonly providerName: string;
  generateAffiliateUrl(event: { title: string; homeTeam: string; awayTeam: string }, rawUrl?: string): string;
  normalizeOffer(rawOffer: any): Partial<TicketOfferData>;
}
