import { prisma } from './prisma';

export interface TicketVendorOffer {
  id: string;
  vendorName: 'SeatGeek' | 'StubHub' | 'Viagogo' | 'TickPick' | 'Official Box Office';
  vendorSlug: string;
  seatingTier: string;
  tierCategory: 'CAT_1' | 'CAT_2' | 'CAT_3' | 'VIP' | 'AWAY';
  price: number;
  originalCurrency: string;
  rating: number;
  reviewCount: number;
  guaranteeBadge: string;
  instantDownload: boolean;
  isBestValue?: boolean;
  affiliateUrl: string;
}

export interface StadiumSeatingTier {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  viewQuality: 'Panoramic' | 'Prime Sideline' | 'Intense Atmosphere' | 'VIP Luxury';
  recommendedFor: string;
}

export interface TicketMatchEvent {
  id: string;
  slug: string;
  title: string;
  homeTeam: string;
  awayTeam: string;
  sport: string;
  tournament: string;
  matchDate: string;
  kickoffUtc: string;
  venueName: string;
  city: string;
  country: string;
  venueCapacity: number;
  stadiumAddress: string;
  minPrice: number;
  maxPrice: number;
  currency: string;
  availableTickets: number;
  demandStatus: 'SELLING_FAST' | 'HIGH_DEMAND' | 'ALMOST_SOLD_OUT' | 'AVAILABLE';
  featuredImage: string;
  broadcasters: {
    us: string;
    uk: string;
    ca: string;
    au: string;
    in?: string;
  };
  offers: TicketVendorOffer[];
  seatingTiers: StadiumSeatingTier[];
  faqs: { question: string; answer: string }[];
}

export const TICKET_EVENTS: TicketMatchEvent[] = [
  // 1. Arsenal vs Chelsea - London Derby (Football)
  {
    id: 'tkt-arsenal-chelsea',
    slug: 'arsenal-vs-chelsea',
    title: 'Arsenal vs Chelsea Tickets',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    sport: 'football',
    tournament: 'Premier League',
    matchDate: 'Saturday, October 24, 2026',
    kickoffUtc: '2026-10-24T16:30:00Z',
    venueName: 'Emirates Stadium',
    city: 'London',
    country: 'United Kingdom',
    venueCapacity: 60704,
    stadiumAddress: 'Hornsey Rd, London N7 7AJ, United Kingdom',
    minPrice: 89,
    maxPrice: 480,
    currency: 'GBP',
    availableTickets: 642,
    demandStatus: 'HIGH_DEMAND',
    featuredImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    broadcasters: {
      us: 'Peacock / USA Network',
      uk: 'Sky Sports Main Event / Ultra HD',
      ca: 'Fubo Sports Canada',
      au: 'Optus Sport',
      in: 'Star Sports / Disney+ Hotstar',
    },
    offers: [
      {
        id: 'off-sg-ars-che-1',
        vendorName: 'SeatGeek',
        vendorSlug: 'seatgeek',
        seatingTier: 'Category 1 Longside Lower',
        tierCategory: 'CAT_1',
        price: 135,
        originalCurrency: 'GBP',
        rating: 4.9,
        reviewCount: 14200,
        guaranteeBadge: '100% Buyer Guarantee',
        instantDownload: true,
        isBestValue: true,
        affiliateUrl: 'https://seatgeek.com/search?search=Arsenal+vs+Chelsea&ref=hypefixture',
      },
      {
        id: 'off-sh-ars-che-2',
        vendorName: 'StubHub',
        vendorSlug: 'stubhub',
        seatingTier: 'Behind Goal Clock End',
        tierCategory: 'CAT_3',
        price: 89,
        originalCurrency: 'GBP',
        rating: 4.8,
        reviewCount: 31000,
        guaranteeBadge: 'StubHub FanProtect™ Guarantee',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://stubhub.com/search?q=Arsenal+vs+Chelsea&ref=hypefixture',
      },
      {
        id: 'off-vg-ars-che-3',
        vendorName: 'Viagogo',
        vendorSlug: 'viagogo',
        seatingTier: 'Upper Tier Central Longside',
        tierCategory: 'CAT_2',
        price: 110,
        originalCurrency: 'GBP',
        rating: 4.7,
        reviewCount: 19800,
        guaranteeBadge: 'Verified Resale Ticket',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://viagogo.com/search?q=Arsenal+Chelsea&ref=hypefixture',
      },
      {
        id: 'off-tp-ars-che-4',
        vendorName: 'TickPick',
        vendorSlug: 'tickpick',
        seatingTier: 'Corner View Level 2',
        tierCategory: 'CAT_2',
        price: 104,
        originalCurrency: 'GBP',
        rating: 4.9,
        reviewCount: 8400,
        guaranteeBadge: 'No Added Hidden Buyer Fees',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://tickpick.com/search?q=Arsenal+vs+Chelsea&ref=hypefixture',
      },
      {
        id: 'off-hosp-ars-che-5',
        vendorName: 'Official Box Office',
        vendorSlug: 'boxoffice',
        seatingTier: 'Club Level Executive + Champagne Lounge',
        tierCategory: 'VIP',
        price: 395,
        originalCurrency: 'GBP',
        rating: 5.0,
        reviewCount: 1200,
        guaranteeBadge: 'Official Arsenal Hospitality',
        instantDownload: false,
        isBestValue: false,
        affiliateUrl: 'https://www.arsenal.com/tickets?ref=hypefixture',
      },
    ],
    seatingTiers: [
      {
        id: 'st-cat1',
        name: 'Category 1: Longside Lower Tier',
        description: 'Between the 18-yard penalty boxes. Closest to pitch-side action and players tunnel.',
        priceFrom: 135,
        viewQuality: 'Prime Sideline',
        recommendedFor: 'Best overall view & photography',
      },
      {
        id: 'st-cat2',
        name: 'Category 2: Upper Tier Panoramic',
        description: 'Elevated view across the entire pitch. Outstanding tactical perspective.',
        priceFrom: 104,
        viewQuality: 'Panoramic',
        recommendedFor: 'Tactical fans & great value',
      },
      {
        id: 'st-cat3',
        name: 'Category 3: North Bank & Clock End',
        description: 'Behind the goals. Home of the loudest Arsenal chants, banners, and matchday roar.',
        priceFrom: 89,
        viewQuality: 'Intense Atmosphere',
        recommendedFor: 'Atmosphere chasers & budget fans',
      },
      {
        id: 'st-vip',
        name: 'VIP Club Level & Dial Square',
        description: 'Complimentary drinks, match programme, padded seats, and access to private bars.',
        priceFrom: 395,
        viewQuality: 'VIP Luxury',
        recommendedFor: 'Corporate guests & special occasions',
      },
    ],
    faqs: [
      {
        question: 'Are Arsenal vs Chelsea tickets 100% genuine and guaranteed?',
        answer: 'Yes. All vendors indexed on HypeFixture (SeatGeek, StubHub, Viagogo, TickPick) provide comprehensive 100% money-back buyer guarantees. If an event is cancelled or tickets do not arrive in time, you receive a full refund or comparable replacement tickets.',
      },
      {
        question: 'When will I receive my mobile matchday ticket?',
        answer: 'Most Premier League tickets are digital mobile passes issued via NFC / Apple Wallet or PDF e-ticket within 24 to 48 hours before kickoff.',
      },
      {
        question: 'Can visiting away fans sit in the home sections?',
        answer: 'Away supporters are strictly advised to purchase seats in designated away allocations or neutral club hospitality to prevent stadium ejection.',
      },
    ],
  },

  // 2. Real Madrid vs Barcelona - El Clásico (Football)
  {
    id: 'tkt-real-barca',
    slug: 'real-madrid-vs-barcelona',
    title: 'Real Madrid vs Barcelona (El Clásico) Tickets',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    sport: 'football',
    tournament: 'La Liga',
    matchDate: 'Sunday, November 8, 2026',
    kickoffUtc: '2026-11-08T20:00:00Z',
    venueName: 'Estadio Santiago Bernabéu',
    city: 'Madrid',
    country: 'Spain',
    venueCapacity: 84744,
    stadiumAddress: 'Av. de Concha Espina, 1, Chamartín, 28036 Madrid, Spain',
    minPrice: 145,
    maxPrice: 850,
    currency: 'EUR',
    availableTickets: 420,
    demandStatus: 'ALMOST_SOLD_OUT',
    featuredImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    broadcasters: {
      us: 'ESPN+ / ESPN Deportes',
      uk: 'LaLigaTV / Premier Sports',
      ca: 'TSN / RDS',
      au: 'beIN Sports Australia',
      in: 'JioCinema / Sports18',
    },
    offers: [
      {
        id: 'off-sg-rm-fcb-1',
        vendorName: 'SeatGeek',
        vendorSlug: 'seatgeek',
        seatingTier: 'Lateral Este Lower Stand (Cat 1)',
        tierCategory: 'CAT_1',
        price: 260,
        originalCurrency: 'EUR',
        rating: 4.9,
        reviewCount: 14200,
        guaranteeBadge: '100% Buyer Guarantee',
        instantDownload: true,
        isBestValue: true,
        affiliateUrl: 'https://seatgeek.com/search?search=Real+Madrid+Barcelona&ref=hypefixture',
      },
      {
        id: 'off-sh-rm-fcb-2',
        vendorName: 'StubHub',
        vendorSlug: 'stubhub',
        seatingTier: 'Fondo Sur 3rd Anfiteatro',
        tierCategory: 'CAT_3',
        price: 145,
        originalCurrency: 'EUR',
        rating: 4.8,
        reviewCount: 31000,
        guaranteeBadge: 'FanProtect™ Guarantee',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://stubhub.com/search?q=El+Clasico+Madrid&ref=hypefixture',
      },
      {
        id: 'off-vg-rm-fcb-3',
        vendorName: 'Viagogo',
        vendorSlug: 'viagogo',
        seatingTier: 'Tribuna Lateral Oeste',
        tierCategory: 'CAT_1',
        price: 295,
        originalCurrency: 'EUR',
        rating: 4.7,
        reviewCount: 19800,
        guaranteeBadge: 'Verified Reseller',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://viagogo.com/search?q=Real+Madrid+vs+Barcelona&ref=hypefixture',
      },
      {
        id: 'off-vip-rm-fcb-4',
        vendorName: 'Official Box Office',
        vendorSlug: 'boxoffice',
        seatingTier: 'VIP Silver Club & Bernabéu Skybar',
        tierCategory: 'VIP',
        price: 780,
        originalCurrency: 'EUR',
        rating: 5.0,
        reviewCount: 890,
        guaranteeBadge: 'Official Real Madrid Hospitality',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://www.realmadrid.com/en-US/tickets?ref=hypefixture',
      },
    ],
    seatingTiers: [
      {
        id: 'st-clasico-1',
        name: 'Lateral Stand (Cat 1)',
        description: 'Prime sideline seats alongside the dugouts under the Bernabéu retractable roof.',
        priceFrom: 260,
        viewQuality: 'Prime Sideline',
        recommendedFor: 'World-class view of both squads',
      },
      {
        id: 'st-clasico-2',
        name: 'Fondo Norte / Sur (Goal Ends)',
        description: 'Directly behind the nets where Madridistas generate deafening decibels.',
        priceFrom: 145,
        viewQuality: 'Intense Atmosphere',
        recommendedFor: 'Vibrant local chanting experience',
      },
      {
        id: 'st-clasico-vip',
        name: 'Bernabéu 360 Skybar VIP',
        description: 'Panoramic roof terrace access, gourmet catering by Michelin-starred partners.',
        priceFrom: 780,
        viewQuality: 'VIP Luxury',
        recommendedFor: 'Bucket-list El Clásico luxury',
      },
    ],
    faqs: [
      {
        question: 'How much do El Clásico tickets cost on average?',
        answer: 'Face-value member tickets start around €130, while verified secondary resale marketplace prices typically range from €145 for upper goal stands up to €700+ for central lateral VIP hospitality.',
      },
      {
        question: 'Is the Santiago Bernabéu covered if it rains?',
        answer: 'Yes! The reconstructed Santiago Bernabéu features a cutting-edge retractable roof and 360-degree video scoreboard, ensuring complete weather protection.',
      },
    ],
  },

  // 3. India vs Pakistan - ICC Champions Trophy / World Cup (Cricket)
  {
    id: 'tkt-ind-pak-cricket',
    slug: 'india-vs-pakistan',
    title: 'India vs Pakistan Cricket Tickets',
    homeTeam: 'India',
    awayTeam: 'Pakistan',
    sport: 'cricket',
    tournament: 'ICC Champions Trophy 2026',
    matchDate: 'Sunday, October 11, 2026',
    kickoffUtc: '2026-10-11T09:30:00Z',
    venueName: 'Dubai International Cricket Stadium',
    city: 'Dubai',
    country: 'United Arab Emirates',
    venueCapacity: 25000,
    stadiumAddress: 'Dubai Sports City, Sheikh Mohammed Bin Zayed Rd, Dubai, UAE',
    minPrice: 110,
    maxPrice: 650,
    currency: 'USD',
    availableTickets: 290,
    demandStatus: 'ALMOST_SOLD_OUT',
    featuredImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    broadcasters: {
      us: 'Willow TV / Sling TV',
      uk: 'Sky Sports Cricket',
      ca: 'Willow Canada',
      au: 'Fox Cricket / Kayo Sports',
      in: 'Star Sports / Disney+ Hotstar',
    },
    offers: [
      {
        id: 'off-sg-ind-pak-1',
        vendorName: 'SeatGeek',
        vendorSlug: 'seatgeek',
        seatingTier: 'Grandstand Pavilion (Center Pitch)',
        tierCategory: 'CAT_1',
        price: 240,
        originalCurrency: 'USD',
        rating: 4.9,
        reviewCount: 14200,
        guaranteeBadge: '100% Verified Buyer Protection',
        instantDownload: true,
        isBestValue: true,
        affiliateUrl: 'https://seatgeek.com/search?search=India+vs+Pakistan+Cricket&ref=hypefixture',
      },
      {
        id: 'off-sh-ind-pak-2',
        vendorName: 'StubHub',
        vendorSlug: 'stubhub',
        seatingTier: 'General Admission East Stand',
        tierCategory: 'CAT_3',
        price: 110,
        originalCurrency: 'USD',
        rating: 4.8,
        reviewCount: 31000,
        guaranteeBadge: 'FanProtect™ Ticket Guarantee',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://stubhub.com/search?q=India+Pakistan+Cricket&ref=hypefixture',
      },
      {
        id: 'off-vg-ind-pak-3',
        vendorName: 'Viagogo',
        vendorSlug: 'viagogo',
        seatingTier: 'West Pavilion Tier 2',
        tierCategory: 'CAT_2',
        price: 175,
        originalCurrency: 'USD',
        rating: 4.7,
        reviewCount: 19800,
        guaranteeBadge: 'International Resale Guarantee',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://viagogo.com/search?q=India+vs+Pakistan+Dubai&ref=hypefixture',
      },
      {
        id: 'off-box-ind-pak-4',
        vendorName: 'Official Box Office',
        vendorSlug: 'boxoffice',
        seatingTier: 'Platinum Corporate Hospitality Suite',
        tierCategory: 'VIP',
        price: 580,
        originalCurrency: 'USD',
        rating: 5.0,
        reviewCount: 650,
        guaranteeBadge: 'Official ICC Hospitality',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://www.icc-cricket.com/tickets?ref=hypefixture',
      },
    ],
    seatingTiers: [
      {
        id: 'st-indpak-1',
        name: 'Grandstand Pavilion (Cat 1)',
        description: 'Prime straight-on view of the bowler delivery stride and batsman stance.',
        priceFrom: 240,
        viewQuality: 'Prime Sideline',
        recommendedFor: 'Cricket purists & best ball-tracking',
      },
      {
        id: 'st-indpak-2',
        name: 'General Stand (Square Leg & Fine Leg)',
        description: 'High energy cheering stands packed with drums, flags, and vocal fans.',
        priceFrom: 110,
        viewQuality: 'Intense Atmosphere',
        recommendedFor: 'Maximum matchday cheering experience',
      },
      {
        id: 'st-indpak-vip',
        name: 'Platinum Corporate Suite',
        description: 'Air-conditioned suite with outdoor balcony seats, buffet luncheon, and private hospitality lounge.',
        priceFrom: 580,
        viewQuality: 'VIP Luxury',
        recommendedFor: 'Ultimate comfort in Dubai climate',
      },
    ],
    faqs: [
      {
        question: 'Why are India vs Pakistan tickets in such high demand?',
        answer: 'India vs Pakistan is the biggest sports rivalry in international cricket, attracting over 400 million global viewers. Matches in neutral venues like Dubai regularly sell out primary allocations within minutes.',
      },
      {
        question: 'Are digital e-tickets scanned on smartphones at Dubai Stadium?',
        answer: 'Yes. E-tickets sent to your smartphone wallet or email PDF are accepted at all automated turnstiles.',
      },
    ],
  },

  // 4. Chennai Super Kings vs Mumbai Indians - IPL El Clásico (Cricket)
  {
    id: 'tkt-csk-mi-cricket',
    slug: 'chennai-super-kings-vs-mumbai-indians',
    title: 'CSK vs Mumbai Indians (IPL 2026) Tickets',
    homeTeam: 'Chennai Super Kings',
    awayTeam: 'Mumbai Indians',
    sport: 'cricket',
    tournament: 'Indian Premier League (IPL)',
    matchDate: 'Friday, April 17, 2026',
    kickoffUtc: '2026-04-17T14:00:00Z',
    venueName: 'M. A. Chidambaram Stadium (Chepauk)',
    city: 'Chennai',
    country: 'India',
    venueCapacity: 38200,
    stadiumAddress: 'Chepauk, Triplicane, Chennai, Tamil Nadu 600005, India',
    minPrice: 45,
    maxPrice: 320,
    currency: 'USD',
    availableTickets: 512,
    demandStatus: 'SELLING_FAST',
    featuredImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
    broadcasters: {
      us: 'Willow TV',
      uk: 'Sky Sports Cricket',
      ca: 'Willow Canada',
      au: 'Fox Sports / Kayo',
      in: 'JioCinema / Star Sports 1 HD',
    },
    offers: [
      {
        id: 'off-sg-csk-mi-1',
        vendorName: 'SeatGeek',
        vendorSlug: 'seatgeek',
        seatingTier: 'Pavilion Terrace Upper Stand',
        tierCategory: 'CAT_1',
        price: 95,
        originalCurrency: 'USD',
        rating: 4.9,
        reviewCount: 14200,
        guaranteeBadge: '100% Verified Ticket Delivery',
        instantDownload: true,
        isBestValue: true,
        affiliateUrl: 'https://seatgeek.com/search?search=CSK+vs+Mumbai+Indians&ref=hypefixture',
      },
      {
        id: 'off-sh-csk-mi-2',
        vendorName: 'StubHub',
        vendorSlug: 'stubhub',
        seatingTier: 'C, D & E Lower Stands',
        tierCategory: 'CAT_3',
        price: 45,
        originalCurrency: 'USD',
        rating: 4.8,
        reviewCount: 31000,
        guaranteeBadge: 'FanProtect™ Guarantee',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://stubhub.com/search?q=CSK+vs+MI+IPL&ref=hypefixture',
      },
      {
        id: 'off-vg-csk-mi-3',
        vendorName: 'Viagogo',
        vendorSlug: 'viagogo',
        seatingTier: 'KMK Terrace Stand',
        tierCategory: 'CAT_2',
        price: 78,
        originalCurrency: 'USD',
        rating: 4.7,
        reviewCount: 19800,
        guaranteeBadge: 'Money Back Guarantee',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://viagogo.com/search?q=CSK+Mumbai+Indians&ref=hypefixture',
      },
    ],
    seatingTiers: [
      {
        id: 'st-csk-1',
        name: 'Pavilion Terrace & Club',
        description: 'Center wicket views with prime breeze from Marina Beach.',
        priceFrom: 95,
        viewQuality: 'Prime Sideline',
        recommendedFor: 'Best overall comfort and sightlines',
      },
      {
        id: 'st-csk-2',
        name: 'C, D, E Lower Whistle Podu Stands',
        description: 'The epic yellow wall of Chepauk where thousands of fans sing Dhoni chants.',
        priceFrom: 45,
        viewQuality: 'Intense Atmosphere',
        recommendedFor: 'Diehard CSK supporters',
      },
      {
        id: 'st-csk-vip',
        name: 'Air Conditioned Corporate Box',
        description: 'Exclusive luxury box seating with complimentary dinner and VIP parking access.',
        priceFrom: 320,
        viewQuality: 'VIP Luxury',
        recommendedFor: 'Luxury matchday VIP experience',
      },
    ],
    faqs: [
      {
        question: 'When do IPL Chepauk tickets go on sale?',
        answer: 'Primary tickets are released on official partners (Paytm Insider / BookMyShow) 5–7 days prior to match day. Due to rapid sellouts, verified secondary exchanges like StubHub and SeatGeek offer guaranteed resale tickets until match start.',
      },
    ],
  },

  // 5. Manchester City vs Liverpool - Premier League (Football)
  {
    id: 'tkt-mancity-liv',
    slug: 'manchester-city-vs-liverpool',
    title: 'Manchester City vs Liverpool Tickets',
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    sport: 'football',
    tournament: 'Premier League',
    matchDate: 'Saturday, November 21, 2026',
    kickoffUtc: '2026-11-21T12:30:00Z',
    venueName: 'Etihad Stadium',
    city: 'Manchester',
    country: 'United Kingdom',
    venueCapacity: 53400,
    stadiumAddress: 'Ashton New Rd, Manchester M11 3FF, United Kingdom',
    minPrice: 85,
    maxPrice: 420,
    currency: 'GBP',
    availableTickets: 388,
    demandStatus: 'HIGH_DEMAND',
    featuredImage: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80',
    broadcasters: {
      us: 'NBC / Peacock',
      uk: 'TNT Sports 1 / Ultimate',
      ca: 'Fubo Sports Canada',
      au: 'Optus Sport',
      in: 'Star Sports Select HD',
    },
    offers: [
      {
        id: 'off-sg-mci-liv-1',
        vendorName: 'SeatGeek',
        vendorSlug: 'seatgeek',
        seatingTier: 'Colin Bell Stand Lower Tier',
        tierCategory: 'CAT_1',
        price: 125,
        originalCurrency: 'GBP',
        rating: 4.9,
        reviewCount: 14200,
        guaranteeBadge: '100% Buyer Guarantee',
        instantDownload: true,
        isBestValue: true,
        affiliateUrl: 'https://seatgeek.com/search?search=Man+City+vs+Liverpool&ref=hypefixture',
      },
      {
        id: 'off-sh-mci-liv-2',
        vendorName: 'StubHub',
        vendorSlug: 'stubhub',
        seatingTier: 'South Stand Singing Section',
        tierCategory: 'CAT_3',
        price: 85,
        originalCurrency: 'GBP',
        rating: 4.8,
        reviewCount: 31000,
        guaranteeBadge: 'FanProtect™ Ticket Guarantee',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://stubhub.com/search?q=Man+City+vs+Liverpool&ref=hypefixture',
      },
      {
        id: 'off-vg-mci-liv-3',
        vendorName: 'Viagogo',
        vendorSlug: 'viagogo',
        seatingTier: 'East Stand Level 2',
        tierCategory: 'CAT_2',
        price: 105,
        originalCurrency: 'GBP',
        rating: 4.7,
        reviewCount: 19800,
        guaranteeBadge: 'Verified Reseller',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://viagogo.com/search?q=Man+City+Liverpool&ref=hypefixture',
      },
    ],
    seatingTiers: [
      {
        id: 'st-mci-1',
        name: 'Colin Bell Stand (Cat 1)',
        description: 'Prime lower tier seats alongside the tunnel and technical area.',
        priceFrom: 125,
        viewQuality: 'Prime Sideline',
        recommendedFor: 'Unbeatable view of tactical masterminds',
      },
      {
        id: 'st-mci-2',
        name: 'South Stand (Atmosphere Section)',
        description: 'Lower level behind the goal, vibrant atmosphere with home ultras.',
        priceFrom: 85,
        viewQuality: 'Intense Atmosphere',
        recommendedFor: 'Passion & matchday singing',
      },
    ],
    faqs: [
      {
        question: 'How do I reach the Etihad Stadium on matchday?',
        answer: 'The Metrolink tram runs directly from Manchester Piccadilly station to the Etihad Campus tram stop in under 10 minutes.',
      },
    ],
  },
];

export function mapDbFixtureToEvent(db: any): TicketMatchEvent {
  const sym = db.currency === 'GBP' ? '£' : db.currency === 'EUR' ? '€' : '$';
  const sgPrice = db.seatgeekPrice || db.minPrice + 15;
  const shPrice = db.stubhubPrice || db.minPrice;
  const vgPrice = db.viagogoPrice || db.minPrice + 10;

  const offers: TicketVendorOffer[] = [
    {
      id: `off-sg-${db.slug}`,
      vendorName: 'SeatGeek',
      vendorSlug: 'seatgeek',
      seatingTier: 'Category 1 Longside Lower',
      tierCategory: 'CAT_1',
      price: sgPrice,
      originalCurrency: db.currency,
      rating: 4.9,
      reviewCount: 14200,
      guaranteeBadge: '100% Buyer Guarantee',
      instantDownload: true,
      isBestValue: sgPrice <= shPrice,
      affiliateUrl: db.seatgeekUrl || `https://seatgeek.com/search?search=${encodeURIComponent(db.title)}&ref=hypefixture`,
    },
    {
      id: `off-sh-${db.slug}`,
      vendorName: 'StubHub',
      vendorSlug: 'stubhub',
      seatingTier: 'Behind Goal Lower Stand',
      tierCategory: 'CAT_3',
      price: shPrice,
      originalCurrency: db.currency,
      rating: 4.8,
      reviewCount: 31000,
      guaranteeBadge: 'StubHub FanProtect™ Guarantee',
      instantDownload: true,
      isBestValue: shPrice < sgPrice,
      affiliateUrl: db.stubhubUrl || `https://stubhub.com/search?q=${encodeURIComponent(db.title)}&ref=hypefixture`,
    },
    {
      id: `off-vg-${db.slug}`,
      vendorName: 'Viagogo',
      vendorSlug: 'viagogo',
      seatingTier: 'Upper Tier Central Longside',
      tierCategory: 'CAT_2',
      price: vgPrice,
      originalCurrency: db.currency,
      rating: 4.7,
      reviewCount: 19800,
      guaranteeBadge: 'Verified Resale Ticket',
      instantDownload: true,
      isBestValue: false,
      affiliateUrl: db.viagogoUrl || `https://viagogo.com/search?q=${encodeURIComponent(db.title)}&ref=hypefixture`,
    },
  ];

  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    homeTeam: db.homeTeam,
    awayTeam: db.awayTeam,
    sport: db.sport,
    tournament: db.tournament,
    matchDate: db.matchDate,
    kickoffUtc: db.kickoffUtc || new Date().toISOString(),
    venueName: db.venueName,
    city: db.city,
    country: db.country,
    venueCapacity: db.venueCapacity,
    stadiumAddress: db.stadiumAddress,
    minPrice: db.minPrice,
    maxPrice: db.maxPrice,
    currency: db.currency,
    availableTickets: db.availableTickets,
    demandStatus: db.demandStatus as any,
    featuredImage: db.featuredImage || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    broadcasters: {
      us: 'NBC / Peacock / ESPN+',
      uk: 'Sky Sports / TNT Sports',
      ca: 'Fubo Sports Canada',
      au: 'Optus Sport',
    },
    offers,
    seatingTiers: [
      {
        id: `st-cat1-${db.slug}`,
        name: 'Category 1: Longside Lower Tier',
        description: 'Prime sideline view between the penalty boxes.',
        priceFrom: sgPrice,
        viewQuality: 'Prime Sideline',
        recommendedFor: 'Best overall matchday sightlines',
      },
      {
        id: `st-cat2-${db.slug}`,
        name: 'Category 2: Upper Tier Panoramic',
        description: 'Elevated view across the entire pitch with tactical perspective.',
        priceFrom: vgPrice,
        viewQuality: 'Panoramic',
        recommendedFor: 'Tactical fans & great value',
      },
      {
        id: `st-cat3-${db.slug}`,
        name: 'Category 3: Behind Goal Atmosphere',
        description: 'Directly behind the goal with the most vocal home ultras.',
        priceFrom: shPrice,
        viewQuality: 'Intense Atmosphere',
        recommendedFor: 'Passion & roaring matchday chants',
      },
    ],
    faqs: [
      {
        question: `How do I receive my ${db.title}?`,
        answer: 'Tickets are securely transferred digitally to your mobile wallet (Apple Wallet / Google Pay) or PDF e-ticket within 24 to 48 hours before match kickoff.',
      },
      {
        question: 'Are seats seated together?',
        answer: 'Yes! When purchasing 2 or more tickets in a single checkout, vendors guarantee seats directly side-by-side unless explicitly stated otherwise.',
      },
    ],
  };
}

export async function getDynamicTicketEvents(): Promise<TicketMatchEvent[]> {
  try {
    const dbFixtures = await prisma.ticketFixture.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (dbFixtures.length > 0) {
      return dbFixtures.map(mapDbFixtureToEvent);
    }
  } catch (err) {
    console.error('Error fetching dynamic ticket fixtures from DB, using fallback:', err);
  }
  return TICKET_EVENTS;
}

export async function getDynamicTicketEventBySlug(slug: string): Promise<TicketMatchEvent | undefined> {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  try {
    const dbFixture = await prisma.ticketFixture.findFirst({
      where: {
        OR: [
          { slug: normalized },
          { slug: { contains: normalized } },
        ],
        isActive: true,
      },
    });

    if (dbFixture) {
      return mapDbFixtureToEvent(dbFixture);
    }
  } catch (err) {
    console.error('Error fetching ticket fixture by slug from DB:', err);
  }

  return getTicketEventBySlug(normalized);
}

export function getAllTicketEvents(): TicketMatchEvent[] {
  return TICKET_EVENTS;
}

export function getTicketEventBySlug(slug: string): TicketMatchEvent | undefined {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return TICKET_EVENTS.find(
    (e) =>
      e.slug === normalized ||
      e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(normalized) ||
      `${e.homeTeam}-vs-${e.awayTeam}`.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized
  );
}

export function getTicketEventsBySport(sport: string): TicketMatchEvent[] {
  const normSport = sport.toLowerCase().trim();
  return TICKET_EVENTS.filter((e) => e.sport.toLowerCase() === normSport);
}

export function searchTicketEvents(params: {
  query?: string;
  sport?: string;
  maxPrice?: number;
}): TicketMatchEvent[] {
  return TICKET_EVENTS.filter((event) => {
    if (params.sport && params.sport !== 'all' && event.sport.toLowerCase() !== params.sport.toLowerCase()) {
      return false;
    }
    if (params.maxPrice && event.minPrice > params.maxPrice) {
      return false;
    }
    if (params.query) {
      const q = params.query.toLowerCase().trim();
      const matchText = `${event.title} ${event.homeTeam} ${event.awayTeam} ${event.tournament} ${event.venueName} ${event.city}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });
}

