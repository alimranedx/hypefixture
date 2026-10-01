import { AffiliateProviderInterface, TicketOfferData } from './contracts';

/**
 * Concrete Affiliate Provider: SeatGeek
 */
export class SeatGeekProvider implements AffiliateProviderInterface {
  readonly providerSlug = 'seatgeek';
  readonly providerName = 'SeatGeek';

  generateAffiliateUrl(event: { title: string; homeTeam: string; awayTeam: string }, rawUrl?: string): string {
    if (rawUrl) return `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}ref=ticketfixture`;
    const term = encodeURIComponent(`${event.homeTeam} vs ${event.awayTeam}`);
    return `https://seatgeek.com/search?search=${term}&ref=ticketfixture`;
  }

  normalizeOffer(rawOffer: any): Partial<TicketOfferData> {
    return {
      providerName: 'SeatGeek',
      providerSlug: 'seatgeek',
      guaranteeBadge: '100% Buyer Guarantee',
      rating: 4.9,
      reviewCount: 14200,
      instantDownload: true,
    };
  }
}

/**
 * Concrete Affiliate Provider: StubHub
 */
export class StubHubProvider implements AffiliateProviderInterface {
  readonly providerSlug = 'stubhub';
  readonly providerName = 'StubHub';

  generateAffiliateUrl(event: { title: string; homeTeam: string; awayTeam: string }, rawUrl?: string): string {
    if (rawUrl) return `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}ref=ticketfixture`;
    const term = encodeURIComponent(`${event.homeTeam} vs ${event.awayTeam}`);
    return `https://stubhub.com/search?q=${term}&ref=ticketfixture`;
  }

  normalizeOffer(rawOffer: any): Partial<TicketOfferData> {
    return {
      providerName: 'StubHub',
      providerSlug: 'stubhub',
      guaranteeBadge: 'StubHub FanProtect™ Guarantee',
      rating: 4.8,
      reviewCount: 31000,
      instantDownload: true,
    };
  }
}

/**
 * Concrete Affiliate Provider: Viagogo
 */
export class ViagogoProvider implements AffiliateProviderInterface {
  readonly providerSlug = 'viagogo';
  readonly providerName = 'Viagogo';

  generateAffiliateUrl(event: { title: string; homeTeam: string; awayTeam: string }, rawUrl?: string): string {
    if (rawUrl) return `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}ref=ticketfixture`;
    const term = encodeURIComponent(`${event.homeTeam} ${event.awayTeam}`);
    return `https://viagogo.com/search?q=${term}&ref=ticketfixture`;
  }

  normalizeOffer(rawOffer: any): Partial<TicketOfferData> {
    return {
      providerName: 'Viagogo',
      providerSlug: 'viagogo',
      guaranteeBadge: 'Verified Resale Ticket',
      rating: 4.7,
      reviewCount: 19800,
      instantDownload: true,
    };
  }
}

/**
 * Concrete Affiliate Provider: TickPick (Zero Fees)
 */
export class TickPickProvider implements AffiliateProviderInterface {
  readonly providerSlug = 'tickpick';
  readonly providerName = 'TickPick';

  generateAffiliateUrl(event: { title: string; homeTeam: string; awayTeam: string }, rawUrl?: string): string {
    if (rawUrl) return `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}ref=ticketfixture`;
    const term = encodeURIComponent(`${event.homeTeam} ${event.awayTeam}`);
    return `https://tickpick.com/search?q=${term}&ref=ticketfixture`;
  }

  normalizeOffer(rawOffer: any): Partial<TicketOfferData> {
    return {
      providerName: 'TickPick',
      providerSlug: 'tickpick',
      guaranteeBadge: 'Best Price & Zero Buyer Fees',
      rating: 4.8,
      reviewCount: 9400,
      instantDownload: true,
    };
  }
}

/**
 * Affiliate Service
 * Registry of ticket providers and link generator
 */
export class AffiliateService {
  private static providers: Map<string, AffiliateProviderInterface> = new Map<string, AffiliateProviderInterface>([
    ['seatgeek', new SeatGeekProvider()],
    ['stubhub', new StubHubProvider()],
    ['viagogo', new ViagogoProvider()],
    ['tickpick', new TickPickProvider()],
  ]);

  static getProvider(slug: string): AffiliateProviderInterface | undefined {
    return this.providers.get(slug.toLowerCase());
  }

  static generateTrackingUrl(
    providerSlug: string,
    event: { title: string; homeTeam: string; awayTeam: string },
    rawUrl?: string
  ): string {
    const provider = this.getProvider(providerSlug);
    if (provider) {
      return provider.generateAffiliateUrl(event, rawUrl);
    }
    // Fallback if provider is not in registry
    return rawUrl || `https://${providerSlug}.com/search?q=${encodeURIComponent(event.title)}&ref=ticketfixture`;
  }

  static enrichOffers(
    event: { title: string; homeTeam: string; awayTeam: string },
    rawOffers: any[]
  ): TicketOfferData[] {
    const lowestPrice = Math.min(...rawOffers.map((o) => Number(o.price) || Infinity));

    return rawOffers.map((offer) => {
      const providerSlug = (offer.provider?.slug || offer.vendorSlug || 'seatgeek').toLowerCase();
      const provider = this.getProvider(providerSlug);
      const isLowest = Number(offer.price) === lowestPrice;

      const normalized = provider ? provider.normalizeOffer(offer) : {};

      return {
        id: offer.id,
        eventId: offer.eventId || '',
        providerId: offer.providerId || offer.provider?.id || '',
        providerName: offer.provider?.name || offer.vendorName || normalized.providerName || 'Ticket Marketplace',
        providerSlug,
        seatingTier: offer.seatingTier || 'General Admission',
        tierCategory: offer.tierCategory || 'CAT_2',
        price: Number(offer.price) || 0,
        originalCurrency: offer.originalCurrency || 'GBP',
        originalUrl: offer.originalUrl || offer.affiliateUrl,
        affiliateUrl: offer.affiliateUrl || this.generateTrackingUrl(providerSlug, event, offer.originalUrl),
        availability: offer.availability || 'AVAILABLE',
        isBestValue: offer.isBestValue ?? isLowest,
        instantDownload: offer.instantDownload ?? (normalized.instantDownload ?? true),
        guaranteeBadge: offer.guaranteeBadge || normalized.guaranteeBadge || '100% Buyer Guarantee',
        rating: offer.provider?.rating || normalized.rating || 4.8,
        reviewCount: offer.provider?.reviewCount || normalized.reviewCount || 10000,
      };
    });
  }
}
