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
        affiliateUrl: 'https://seatgeek.com/search?search=Arsenal+vs+Chelsea&ref=ticketfixture',
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
        affiliateUrl: 'https://stubhub.com/search?q=Arsenal+vs+Chelsea&ref=ticketfixture',
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
        affiliateUrl: 'https://viagogo.com/search?q=Arsenal+Chelsea&ref=ticketfixture',
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
        affiliateUrl: 'https://tickpick.com/search?q=Arsenal+vs+Chelsea&ref=ticketfixture',
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
        affiliateUrl: 'https://www.arsenal.com/tickets?ref=ticketfixture',
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
        answer: 'Yes. All vendors indexed on TicketFixture (SeatGeek, StubHub, Viagogo, TickPick) provide comprehensive 100% money-back buyer guarantees. If an event is cancelled or tickets do not arrive in time, you receive a full refund or comparable replacement tickets.',
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
        affiliateUrl: 'https://seatgeek.com/search?search=Real+Madrid+Barcelona&ref=ticketfixture',
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
        affiliateUrl: 'https://stubhub.com/search?q=El+Clasico+Madrid&ref=ticketfixture',
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
        affiliateUrl: 'https://viagogo.com/search?q=Real+Madrid+vs+Barcelona&ref=ticketfixture',
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
        affiliateUrl: 'https://www.realmadrid.com/en-US/tickets?ref=ticketfixture',
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

  // 3. The Ashes - England vs Australia 2nd Test at Lord's (European/UK Cricket)
  {
    id: 'tkt-ashes-lords',
    slug: 'the-ashes-england-vs-australia-lords',
    title: "The Ashes: England vs Australia 2nd Test Tickets (Lord's)",
    homeTeam: 'England',
    awayTeam: 'Australia',
    sport: 'cricket',
    tournament: 'The Ashes Test Series',
    matchDate: 'Thursday, July 16, 2026',
    kickoffUtc: '2026-07-16T10:00:00Z',
    venueName: "Lord's Cricket Ground",
    city: 'London',
    country: 'United Kingdom',
    venueCapacity: 31100,
    stadiumAddress: "St John's Wood Rd, London NW8 8QN, United Kingdom",
    minPrice: 75,
    maxPrice: 420,
    currency: 'GBP',
    availableTickets: 340,
    demandStatus: 'ALMOST_SOLD_OUT',
    featuredImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    broadcasters: {
      us: 'Willow TV',
      uk: 'Sky Sports The Ashes / BBC TMS (Radio)',
      ca: 'Willow Canada',
      au: 'Channel 7 / Fox Cricket',
      in: 'Sony Sports Ten 1 / Sony LIV',
    },
    offers: [
      {
        id: 'off-sg-ashes-1',
        vendorName: 'SeatGeek',
        vendorSlug: 'seatgeek',
        seatingTier: 'Grandstand Upper Tier (Behind Bowler Arm)',
        tierCategory: 'CAT_1',
        price: 185,
        originalCurrency: 'GBP',
        rating: 4.9,
        reviewCount: 14200,
        guaranteeBadge: '100% Verified Buyer Protection',
        instantDownload: true,
        isBestValue: true,
        affiliateUrl: 'https://seatgeek.com/search?search=The+Ashes+Lords+England+Australia&ref=ticketfixture',
      },
      {
        id: 'off-sh-ashes-2',
        vendorName: 'StubHub',
        vendorSlug: 'stubhub',
        seatingTier: 'Edrich Stand Lower Tier',
        tierCategory: 'CAT_2',
        price: 120,
        originalCurrency: 'GBP',
        rating: 4.8,
        reviewCount: 31000,
        guaranteeBadge: 'StubHub FanProtect™ Guarantee',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://stubhub.com/search?q=The+Ashes+Lords&ref=ticketfixture',
      },
      {
        id: 'off-vg-ashes-3',
        vendorName: 'Viagogo',
        vendorSlug: 'viagogo',
        seatingTier: 'Compton Stand Upper',
        tierCategory: 'CAT_3',
        price: 75,
        originalCurrency: 'GBP',
        rating: 4.7,
        reviewCount: 19800,
        guaranteeBadge: 'European Resale Guarantee',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://viagogo.com/search?q=England+Australia+Lords&ref=ticketfixture',
      },
      {
        id: 'off-box-ashes-4',
        vendorName: 'Official Box Office',
        vendorSlug: 'boxoffice',
        seatingTier: 'Lord’s Tavern & Nursery Pavilion Hospitality',
        tierCategory: 'VIP',
        price: 395,
        originalCurrency: 'GBP',
        rating: 5.0,
        reviewCount: 950,
        guaranteeBadge: 'Official MCC Hospitality',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://www.lords.org/tickets?ref=ticketfixture',
      },
    ],
    seatingTiers: [
      {
        id: 'st-ashes-1',
        name: 'Grandstand & Warner Stand (Cat 1)',
        description: 'Iconic sightlines behind the bowler arm overlooking the historic Lord’s Pavilion.',
        priceFrom: 185,
        viewQuality: 'Prime Sideline',
        recommendedFor: 'Cricket purists & best ball-tracking',
      },
      {
        id: 'st-ashes-2',
        name: 'Edrich & Compton Stands (Cat 2 & 3)',
        description: 'Modern two-tiered stands offering fantastic elevated views of Lord’s slope.',
        priceFrom: 75,
        viewQuality: 'Panoramic',
        recommendedFor: 'Superb atmosphere & all-day cricket value',
      },
      {
        id: 'st-ashes-vip',
        name: 'Nursery Pavilion Hospitality',
        description: 'Champagne reception, 3-course lunch by Michelin chefs, afternoon tea, and complimentary bar.',
        priceFrom: 395,
        viewQuality: 'VIP Luxury',
        recommendedFor: 'The ultimate British summer sporting tradition',
      },
    ],
    faqs: [
      {
        question: 'What is the dress code for Lord’s Cricket Ground?',
        answer: 'General admission in the public stands (Grandstand, Compton, Edrich) requires smart casual attire. Lord’s Pavilion and VIP hospitality require jacket and tie for gentlemen and smart dress for ladies.',
      },
      {
        question: 'Can I bring my own food and wine into Lord’s?',
        answer: 'Yes! Lord’s is one of the few international cricket venues in the world where spectators may bring a personal picnic including a bottle of wine or Champagne per adult into public areas.',
      },
    ],
  },

  // 4. The Hundred - Finals Day at Lord's (European/UK Cricket)
  {
    id: 'tkt-the-hundred-final',
    slug: 'the-hundred-finals-day-lords',
    title: "The Hundred 2026 Finals Day Tickets (Lord's)",
    homeTeam: 'Oval Invincibles',
    awayTeam: 'London Spirit',
    sport: 'cricket',
    tournament: 'The Hundred (UK)',
    matchDate: 'Sunday, August 23, 2026',
    kickoffUtc: '2026-08-23T13:30:00Z',
    venueName: "Lord's Cricket Ground",
    city: 'London',
    country: 'United Kingdom',
    venueCapacity: 31100,
    stadiumAddress: "St John's Wood Rd, London NW8 8QN, United Kingdom",
    minPrice: 42,
    maxPrice: 220,
    currency: 'GBP',
    availableTickets: 580,
    demandStatus: 'SELLING_FAST',
    featuredImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
    broadcasters: {
      us: 'Willow TV',
      uk: 'BBC Two / Sky Sports Cricket & The Hundred',
      ca: 'Willow Canada',
      au: 'Fox Cricket',
      in: 'FanCode / Sony Sports',
    },
    offers: [
      {
        id: 'off-sg-hundred-1',
        vendorName: 'SeatGeek',
        vendorSlug: 'seatgeek',
        seatingTier: 'Lower Grandstand Central',
        tierCategory: 'CAT_1',
        price: 85,
        originalCurrency: 'GBP',
        rating: 4.9,
        reviewCount: 14200,
        guaranteeBadge: '100% Verified Ticket Delivery',
        instantDownload: true,
        isBestValue: true,
        affiliateUrl: 'https://seatgeek.com/search?search=The+Hundred+Final+Lords&ref=ticketfixture',
      },
      {
        id: 'off-sh-hundred-2',
        vendorName: 'StubHub',
        vendorSlug: 'stubhub',
        seatingTier: 'Compton Stand Upper Level',
        tierCategory: 'CAT_3',
        price: 42,
        originalCurrency: 'GBP',
        rating: 4.8,
        reviewCount: 31000,
        guaranteeBadge: 'FanProtect™ Guarantee',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://stubhub.com/search?q=The+Hundred+Finals+Day&ref=ticketfixture',
      },
      {
        id: 'off-vg-hundred-3',
        vendorName: 'Viagogo',
        vendorSlug: 'viagogo',
        seatingTier: 'Edrich Mid Tier',
        tierCategory: 'CAT_2',
        price: 68,
        originalCurrency: 'GBP',
        rating: 4.7,
        reviewCount: 19800,
        guaranteeBadge: 'European Reseller Guarantee',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://viagogo.com/search?q=The+Hundred+Final&ref=ticketfixture',
      },
    ],
    seatingTiers: [
      {
        id: 'st-hundred-1',
        name: 'Lower Grandstand & Warner Stand',
        description: 'Pitch-side views with DJ sets, pyro fireworks, and electric family atmosphere.',
        priceFrom: 85,
        viewQuality: 'Prime Sideline',
        recommendedFor: 'Best overall experience of men’s and women’s finals',
      },
      {
        id: 'st-hundred-2',
        name: 'Compton & Edrich Stands',
        description: 'Vibrant party stands, high energy music, and unrestricted views of 6-hitting fireworks.',
        priceFrom: 42,
        viewQuality: 'Panoramic',
        recommendedFor: 'Great value double-header matchday ticket',
      },
    ],
    faqs: [
      {
        question: 'Does one ticket give access to both Men’s and Women’s Finals?',
        answer: 'Yes! A single Finals Day ticket grants full access to both the Women’s Hundred Final in the afternoon and the Men’s Hundred Final under the floodlights in the evening.',
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
        affiliateUrl: 'https://seatgeek.com/search?search=Man+City+vs+Liverpool&ref=ticketfixture',
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
        affiliateUrl: 'https://stubhub.com/search?q=Man+City+vs+Liverpool&ref=ticketfixture',
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
        affiliateUrl: 'https://viagogo.com/search?q=Man+City+Liverpool&ref=ticketfixture',
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

  // 6. England vs India - Summer Test Series at The Oval (UK/European Cricket)
  {
    id: 'tkt-eng-ind-oval',
    slug: 'england-vs-india-the-oval',
    title: 'England vs India 5th Test Tickets (The Oval)',
    homeTeam: 'England',
    awayTeam: 'India',
    sport: 'cricket',
    tournament: 'ECB International Summer Test Series',
    matchDate: 'Thursday, September 10, 2026',
    kickoffUtc: '2026-09-10T10:00:00Z',
    venueName: 'The Kia Oval',
    city: 'London',
    country: 'United Kingdom',
    venueCapacity: 27500,
    stadiumAddress: 'Kennington Oval, London SE11 5SS, United Kingdom',
    minPrice: 65,
    maxPrice: 380,
    currency: 'GBP',
    availableTickets: 490,
    demandStatus: 'HIGH_DEMAND',
    featuredImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    broadcasters: {
      us: 'Willow TV',
      uk: 'Sky Sports Cricket / BBC Test Match Special',
      ca: 'Willow Canada',
      au: 'Fox Cricket',
      in: 'Sony Sports Network / Sony LIV',
    },
    offers: [
      {
        id: 'off-sg-eng-ind-1',
        vendorName: 'SeatGeek',
        vendorSlug: 'seatgeek',
        seatingTier: 'JM Finn Stand Lower Tier',
        tierCategory: 'CAT_1',
        price: 145,
        originalCurrency: 'GBP',
        rating: 4.9,
        reviewCount: 14200,
        guaranteeBadge: '100% Buyer Guarantee',
        instantDownload: true,
        isBestValue: true,
        affiliateUrl: 'https://seatgeek.com/search?search=England+vs+India+Oval+Cricket&ref=ticketfixture',
      },
      {
        id: 'off-sh-eng-ind-2',
        vendorName: 'StubHub',
        vendorSlug: 'stubhub',
        seatingTier: 'Peter May Stand Tier 2',
        tierCategory: 'CAT_2',
        price: 95,
        originalCurrency: 'GBP',
        rating: 4.8,
        reviewCount: 31000,
        guaranteeBadge: 'FanProtect™ Ticket Guarantee',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://stubhub.com/search?q=England+vs+India+Oval&ref=ticketfixture',
      },
      {
        id: 'off-vg-eng-ind-3',
        vendorName: 'Viagogo',
        vendorSlug: 'viagogo',
        seatingTier: 'Lock Laker Stand Upper',
        tierCategory: 'CAT_3',
        price: 65,
        originalCurrency: 'GBP',
        rating: 4.7,
        reviewCount: 19800,
        guaranteeBadge: 'Verified Reseller',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://viagogo.com/search?q=England+India+The+Oval&ref=ticketfixture',
      },
    ],
    seatingTiers: [
      {
        id: 'st-oval-1',
        name: 'JM Finn & Galadari Stands (Cat 1)',
        description: 'Prime side-on and behind bowler arm views with historic gasometers in backdrop.',
        priceFrom: 145,
        viewQuality: 'Prime Sideline',
        recommendedFor: 'Best overall cricket photography and sightlines',
      },
      {
        id: 'st-oval-2',
        name: 'Peter May & Lock Laker Stands (Cat 2/3)',
        description: 'Atmospheric family and members stands with great sightlines of London cricket summer.',
        priceFrom: 65,
        viewQuality: 'Panoramic',
        recommendedFor: 'Passionate cricket supporters',
      },
    ],
    faqs: [
      {
        question: 'How do I get to The Kia Oval by London Underground?',
        answer: 'The Oval tube station (Northern line) is directly across the street from the Alec Stewart Gate.',
      },
    ],
  },

  // 7. Bayern Munich vs Borussia Dortmund - Der Klassiker (European Football)
  {
    id: 'tkt-bayern-dortmund',
    slug: 'bayern-munich-vs-borussia-dortmund',
    title: 'Bayern Munich vs Borussia Dortmund (Der Klassiker) Tickets',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    sport: 'football',
    tournament: 'Bundesliga',
    matchDate: 'Saturday, November 28, 2026',
    kickoffUtc: '2026-11-28T17:30:00Z',
    venueName: 'Allianz Arena',
    city: 'Munich',
    country: 'Germany',
    venueCapacity: 75024,
    stadiumAddress: 'Werner-Heisenberg-Allee 25, 80939 München, Germany',
    minPrice: 95,
    maxPrice: 620,
    currency: 'EUR',
    availableTickets: 390,
    demandStatus: 'ALMOST_SOLD_OUT',
    featuredImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    broadcasters: {
      us: 'ESPN+ / ABC',
      uk: 'Sky Sports Football',
      ca: 'DAZN Canada',
      au: 'beIN Sports',
      in: 'Sony LIV',
    },
    offers: [
      {
        id: 'off-sg-bay-bvb-1',
        vendorName: 'SeatGeek',
        vendorSlug: 'seatgeek',
        seatingTier: 'Haupttribüne Ost (Cat 1 Lower)',
        tierCategory: 'CAT_1',
        price: 195,
        originalCurrency: 'EUR',
        rating: 4.9,
        reviewCount: 14200,
        guaranteeBadge: '100% Buyer Guarantee',
        instantDownload: true,
        isBestValue: true,
        affiliateUrl: 'https://seatgeek.com/search?search=Bayern+Munich+vs+Dortmund&ref=ticketfixture',
      },
      {
        id: 'off-sh-bay-bvb-2',
        vendorName: 'StubHub',
        vendorSlug: 'stubhub',
        seatingTier: 'Südkurve Stehplatz / Oberrang',
        tierCategory: 'CAT_3',
        price: 95,
        originalCurrency: 'EUR',
        rating: 4.8,
        reviewCount: 31000,
        guaranteeBadge: 'FanProtect™ Guarantee',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://stubhub.com/search?q=Der+Klassiker+Bayern+Dortmund&ref=ticketfixture',
      },
      {
        id: 'off-vg-bay-bvb-3',
        vendorName: 'Viagogo',
        vendorSlug: 'viagogo',
        seatingTier: 'Gegentribüne Mittelrang',
        tierCategory: 'CAT_2',
        price: 145,
        originalCurrency: 'EUR',
        rating: 4.7,
        reviewCount: 19800,
        guaranteeBadge: 'Verified Reseller',
        instantDownload: true,
        isBestValue: false,
        affiliateUrl: 'https://viagogo.com/search?q=Bayern+Dortmund+Allianz&ref=ticketfixture',
      },
    ],
    seatingTiers: [
      {
        id: 'st-allianz-1',
        name: 'Haupttribüne (Cat 1)',
        description: 'Center line seats close to the dugouts with panoramic views of the Allianz illuminated exterior.',
        priceFrom: 195,
        viewQuality: 'Prime Sideline',
        recommendedFor: 'Best matchday sightlines',
      },
      {
        id: 'st-allianz-2',
        name: 'Südkurve (Atmosphere)',
        description: 'The heartbeat of Bayern Munich support with flags and continuous chanting.',
        priceFrom: 95,
        viewQuality: 'Intense Atmosphere',
        recommendedFor: 'Passionate matchday experience',
      },
    ],
    faqs: [
      {
        question: 'How do I pay inside Allianz Arena?',
        answer: 'The Allianz Arena is completely cashless. You can pay seamlessly using contactless debit/credit cards or mobile pay (Apple Pay, Google Pay).',
      },
    ],
  },
];

export function mapDbFixtureToEvent(db: any): TicketMatchEvent {
  const sym = db.currency === 'GBP' ? '£' : db.currency === 'EUR' ? '€' : '$';
  const sgPrice = db.seatgeekPrice || db.minPrice + 15;
  const shPrice = db.stubhubPrice || db.minPrice;
  const vgPrice = db.viagogoPrice || db.minPrice + 10;

  const offers: TicketVendorOffer[] = (db.offers && db.offers.length > 0)
    ? db.offers.map((o: any) => ({
        id: o.id,
        vendorName: o.provider?.name || 'Ticket Marketplace',
        vendorSlug: o.provider?.slug || 'seatgeek',
        seatingTier: o.seatingTier,
        tierCategory: o.tierCategory as any,
        price: o.price,
        originalCurrency: o.originalCurrency || db.currency,
        rating: o.provider?.rating || 4.8,
        reviewCount: o.provider?.reviewCount || 15000,
        guaranteeBadge: o.guaranteeBadge || '100% Buyer Guarantee',
        instantDownload: o.instantDownload ?? true,
        isBestValue: o.isBestValue ?? false,
        affiliateUrl: o.affiliateUrl,
      }))
    : [
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
          affiliateUrl: db.seatgeekUrl || `https://seatgeek.com/search?search=${encodeURIComponent(db.title)}&ref=ticketfixture`,
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
          affiliateUrl: db.stubhubUrl || `https://stubhub.com/search?q=${encodeURIComponent(db.title)}&ref=ticketfixture`,
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
          affiliateUrl: db.viagogoUrl || `https://viagogo.com/search?q=${encodeURIComponent(db.title)}&ref=ticketfixture`,
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
      include: {
        offers: {
          include: {
            provider: true,
          },
        },
      },
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
      include: {
        offers: {
          include: {
            provider: true,
          },
        },
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

