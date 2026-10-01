import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { generateDailyHypePosts, saveGeneratedPostsToDatabase } from './gemini';

export async function seedDatabase() {
  console.log('Seeding TicketFixture database...');

  // 1. Ensure system settings exist
  await prisma.systemSetting.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      postsPerDay: 5,
      autoPublish: true,
      activeSports: 'football,cricket',
      affforceUrl: 'https://seatgeek.com/?ref=ticketfixture',
      vpnUrl: 'https://nordvpn.com',
      fuboUrl: 'https://www.fubo.tv',
      heroOpacity: 80,
      heroKenBurns: true,
      heroCycleSeconds: 7,
      heroBeamsEnabled: true,
      heroRadarEnabled: true,
      heroScoreTicker: true,
    },
  });

  // 2. Ensure Super Admin account exists
  const hashedPassword = await bcrypt.hash('password', 10);
  await prisma.user.upsert({
    where: { email: 'super@gmail.com' },
    update: {
      role: 'SUPER_ADMIN',
      isApproved: true,
      password: hashedPassword,
    },
    create: {
      email: 'super@gmail.com',
      name: 'Super Administrator',
      role: 'SUPER_ADMIN',
      isApproved: true,
      password: hashedPassword,
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=superadmin',
    },
  });

  // 3. Ensure Admin account exists
  await prisma.user.upsert({
    where: { email: 'admin@ticketfixture.com' },
    update: {
      role: 'ADMIN',
      isApproved: true,
      password: hashedPassword,
    },
    create: {
      email: 'admin@ticketfixture.com',
      name: 'Site Administrator',
      role: 'ADMIN',
      isApproved: true,
      password: hashedPassword,
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=siteadmin',
    },
  });

  // 4. Seed Core Ticket Affiliate Partners
  const defaultPartners = [
    {
      name: 'SeatGeek Official Partner',
      slug: 'seatgeek',
      targetUrl: 'https://seatgeek.com/?ref=ticketfixture',
      category: 'Verified Event Tickets',
      payout: '5% - 10% Commission',
      clicks: 210,
      conversions: 14,
    },
    {
      name: 'StubHub FanProtect Marketplace',
      slug: 'stubhub',
      targetUrl: 'https://stubhub.com/?ref=ticketfixture',
      category: 'Secondary Resale',
      payout: '5% - 8% Commission',
      clicks: 184,
      conversions: 11,
    },
    {
      name: 'Viagogo Global Tickets',
      slug: 'viagogo',
      targetUrl: 'https://viagogo.com/?ref=ticketfixture',
      category: 'International Sports',
      payout: '5% - 8% Commission',
      clicks: 125,
      conversions: 8,
    },
    {
      name: 'TickPick No-Fee Marketplace',
      slug: 'tickpick',
      targetUrl: 'https://tickpick.com/?ref=ticketfixture',
      category: 'No-Fee Tickets',
      payout: '4% - 8% Commission',
      clicks: 98,
      conversions: 6,
    },
  ];

  for (const partner of defaultPartners) {
    await prisma.affiliatePartner.upsert({
      where: { slug: partner.slug },
      update: {},
      create: partner,
    });
  }

  // 4b. Seed Normalized Ticket Providers (New Relational Architecture)
  const ticketProviders = [
    {
      name: 'SeatGeek',
      slug: 'seatgeek',
      websiteUrl: 'https://seatgeek.com',
      rating: 4.9,
      reviewCount: 14200,
      isActive: true,
      logo: 'https://seatgeek.com/favicon.ico',
    },
    {
      name: 'StubHub',
      slug: 'stubhub',
      websiteUrl: 'https://stubhub.com',
      rating: 4.8,
      reviewCount: 31000,
      isActive: true,
      logo: 'https://stubhub.com/favicon.ico',
    },
    {
      name: 'Viagogo',
      slug: 'viagogo',
      websiteUrl: 'https://viagogo.com',
      rating: 4.7,
      reviewCount: 19800,
      isActive: true,
      logo: 'https://viagogo.com/favicon.ico',
    },
    {
      name: 'TickPick',
      slug: 'tickpick',
      websiteUrl: 'https://tickpick.com',
      rating: 4.8,
      reviewCount: 9400,
      isActive: true,
      logo: 'https://tickpick.com/favicon.ico',
    },
  ];

  const providerMap: Record<string, string> = {};
  for (const prov of ticketProviders) {
    const record = await prisma.ticketProvider.upsert({
      where: { slug: prov.slug },
      update: { rating: prov.rating, reviewCount: prov.reviewCount, isActive: true },
      create: prov,
    });
    providerMap[prov.slug] = record.id;
  }

  // 4c. Seed Sports Categories (Europe-Friendly Focus)
  const sportCategories = [
    { name: 'European Football', slug: 'football', icon: '⚽', description: 'Premier League, UEFA Champions League, La Liga, Serie A, Bundesliga', isActive: true, order: 1 },
    { name: 'European & UK Cricket', slug: 'cricket', icon: '🏏', description: "The Ashes, England Test Summer, The Hundred, Vitality Blast, European Cricket Championship", isActive: true, order: 2 },
    { name: 'Basketball', slug: 'basketball', icon: '🏀', description: 'EuroLeague Basketball & International Championships', isActive: false, order: 3 },
    { name: 'Tennis', slug: 'tennis', icon: '🎾', description: 'Wimbledon Championships & Roland Garros', isActive: false, order: 4 },
    { name: 'Formula 1', slug: 'f1', icon: '🏎️', description: 'European Grand Prix: Monaco, Silverstone, Monza, Spa', isActive: false, order: 5 },
    { name: 'Boxing & MMA', slug: 'boxing', icon: '🥊', description: 'European World Title Fights & O2 London Championship Bouts', isActive: false, order: 6 },
  ];

  for (const cat of sportCategories) {
    await prisma.sportCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, description: cat.description, isActive: cat.isActive, order: cat.order },
      create: cat,
    });
  }

  // 4d. Seed Fixtures and Normalized Ticket Offers
  const sampleFixtures = [
    {
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
      offers: [
        {
          providerSlug: 'seatgeek',
          seatingTier: 'Category 1 Longside Lower',
          tierCategory: 'CAT_1',
          price: 135,
          originalCurrency: 'GBP',
          affiliateUrl: 'https://seatgeek.com/search?search=Arsenal+vs+Chelsea&ref=ticketfixture',
          availability: 'AVAILABLE',
          isBestValue: true,
          guaranteeBadge: '100% Buyer Guarantee',
        },
        {
          providerSlug: 'stubhub',
          seatingTier: 'Behind Goal Clock End',
          tierCategory: 'CAT_3',
          price: 89,
          originalCurrency: 'GBP',
          affiliateUrl: 'https://stubhub.com/search?q=Arsenal+vs+Chelsea&ref=ticketfixture',
          availability: 'AVAILABLE',
          isBestValue: false,
          guaranteeBadge: 'StubHub FanProtect™ Guarantee',
        },
        {
          providerSlug: 'viagogo',
          seatingTier: 'Upper Tier Central Longside',
          tierCategory: 'CAT_2',
          price: 110,
          originalCurrency: 'GBP',
          affiliateUrl: 'https://viagogo.com/search?q=Arsenal+Chelsea&ref=ticketfixture',
          availability: 'AVAILABLE',
          isBestValue: false,
          guaranteeBadge: 'Verified Resale Ticket',
        },
        {
          providerSlug: 'tickpick',
          seatingTier: 'Lower Tier Corner Flag',
          tierCategory: 'CAT_2',
          price: 120,
          originalCurrency: 'GBP',
          affiliateUrl: 'https://tickpick.com/search?q=Arsenal+Chelsea&ref=ticketfixture',
          availability: 'AVAILABLE',
          isBestValue: false,
          guaranteeBadge: 'Zero Buyer Fees',
        },
      ],
    },
    {
      slug: 'real-madrid-vs-barcelona',
      title: 'Real Madrid vs Barcelona Tickets (El Clásico)',
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      sport: 'football',
      tournament: 'La Liga & El Clásico',
      matchDate: 'Sunday, November 8, 2026',
      kickoffUtc: '2026-11-08T20:00:00Z',
      venueName: 'Santiago Bernabéu',
      city: 'Madrid',
      country: 'Spain',
      venueCapacity: 84744,
      stadiumAddress: 'Av. de Concha Espina, 1, Chamartín, 28036 Madrid, Spain',
      minPrice: 145,
      maxPrice: 850,
      currency: 'EUR',
      availableTickets: 312,
      demandStatus: 'ALMOST_SOLD_OUT',
      featuredImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      offers: [
        {
          providerSlug: 'stubhub',
          seatingTier: 'Lateral Este Lower',
          tierCategory: 'CAT_1',
          price: 260,
          originalCurrency: 'EUR',
          affiliateUrl: 'https://stubhub.com/search?q=Real+Madrid+vs+Barcelona&ref=ticketfixture',
          availability: 'LOW_STOCK',
          isBestValue: false,
          guaranteeBadge: 'FanProtect™ Guarantee',
        },
        {
          providerSlug: 'seatgeek',
          seatingTier: 'Grada Alta Fondo Norte',
          tierCategory: 'CAT_3',
          price: 145,
          originalCurrency: 'EUR',
          affiliateUrl: 'https://seatgeek.com/search?search=Real+Madrid+Barcelona&ref=ticketfixture',
          availability: 'AVAILABLE',
          isBestValue: true,
          guaranteeBadge: '100% Buyer Guarantee',
        },
        {
          providerSlug: 'viagogo',
          seatingTier: 'Tribuna Central Lateral',
          tierCategory: 'CAT_2',
          price: 210,
          originalCurrency: 'EUR',
          affiliateUrl: 'https://viagogo.com/search?q=El+Clasico+Real+Madrid+Barcelona&ref=ticketfixture',
          availability: 'LOW_STOCK',
          isBestValue: false,
          guaranteeBadge: 'Verified Resale Ticket',
        },
      ],
    },
    {
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
      offers: [
        {
          providerSlug: 'seatgeek',
          seatingTier: 'Grandstand Upper Tier (Behind Bowler Arm)',
          tierCategory: 'CAT_1',
          price: 185,
          originalCurrency: 'GBP',
          affiliateUrl: 'https://seatgeek.com/search?search=The+Ashes+Lords+England+Australia&ref=ticketfixture',
          availability: 'AVAILABLE',
          isBestValue: true,
          guaranteeBadge: '100% Verified Buyer Protection',
        },
        {
          providerSlug: 'stubhub',
          seatingTier: 'Edrich Stand Lower Tier',
          tierCategory: 'CAT_2',
          price: 120,
          originalCurrency: 'GBP',
          affiliateUrl: 'https://stubhub.com/search?q=The+Ashes+Lords&ref=ticketfixture',
          availability: 'AVAILABLE',
          isBestValue: false,
          guaranteeBadge: 'StubHub FanProtect™ Guarantee',
        },
        {
          providerSlug: 'viagogo',
          seatingTier: 'Compton Stand Upper',
          tierCategory: 'CAT_3',
          price: 75,
          originalCurrency: 'GBP',
          affiliateUrl: 'https://viagogo.com/search?q=England+Australia+Lords&ref=ticketfixture',
          availability: 'AVAILABLE',
          isBestValue: false,
          guaranteeBadge: 'European Resale Guarantee',
        },
      ],
    },
    {
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
      offers: [
        {
          providerSlug: 'seatgeek',
          seatingTier: 'Lower Grandstand Central',
          tierCategory: 'CAT_1',
          price: 85,
          originalCurrency: 'GBP',
          affiliateUrl: 'https://seatgeek.com/search?search=The+Hundred+Final+Lords&ref=ticketfixture',
          availability: 'AVAILABLE',
          isBestValue: true,
          guaranteeBadge: '100% Verified Ticket Delivery',
        },
        {
          providerSlug: 'stubhub',
          seatingTier: 'Compton Stand Upper Level',
          tierCategory: 'CAT_3',
          price: 42,
          originalCurrency: 'GBP',
          affiliateUrl: 'https://stubhub.com/search?q=The+Hundred+Finals+Day&ref=ticketfixture',
          availability: 'AVAILABLE',
          isBestValue: false,
          guaranteeBadge: 'FanProtect™ Guarantee',
        },
        {
          providerSlug: 'viagogo',
          seatingTier: 'Edrich Mid Tier',
          tierCategory: 'CAT_2',
          price: 68,
          originalCurrency: 'GBP',
          affiliateUrl: 'https://viagogo.com/search?q=The+Hundred+Final&ref=ticketfixture',
          availability: 'AVAILABLE',
          isBestValue: false,
          guaranteeBadge: 'European Reseller Guarantee',
        },
      ],
    },
    {
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
      offers: [
        {
          providerSlug: 'seatgeek',
          seatingTier: 'Colin Bell Stand Lower Tier',
          tierCategory: 'CAT_1',
          price: 125,
          originalCurrency: 'GBP',
          affiliateUrl: 'https://seatgeek.com/search?search=Man+City+vs+Liverpool&ref=ticketfixture',
          availability: 'AVAILABLE',
          isBestValue: true,
          guaranteeBadge: '100% Buyer Guarantee',
        },
        {
          providerSlug: 'stubhub',
          seatingTier: 'South Stand Singing Section',
          tierCategory: 'CAT_3',
          price: 85,
          originalCurrency: 'GBP',
          affiliateUrl: 'https://stubhub.com/search?q=Man+City+vs+Liverpool&ref=ticketfixture',
          availability: 'AVAILABLE',
          isBestValue: false,
          guaranteeBadge: 'FanProtect™ Ticket Guarantee',
        },
        {
          providerSlug: 'viagogo',
          seatingTier: 'East Stand Level 2',
          tierCategory: 'CAT_2',
          price: 105,
          originalCurrency: 'GBP',
          affiliateUrl: 'https://viagogo.com/search?q=Man+City+Liverpool&ref=ticketfixture',
          availability: 'AVAILABLE',
          isBestValue: false,
          guaranteeBadge: 'Verified Reseller',
        },
      ],
    },
  ];

  for (const item of sampleFixtures) {
    const { offers, ...fixtureData } = item;
    const fixture = await prisma.ticketFixture.upsert({
      where: { slug: fixtureData.slug },
      update: fixtureData,
      create: fixtureData,
    });

    // Seed/update offers
    for (const offer of offers) {
      const providerId = providerMap[offer.providerSlug];
      if (providerId) {
        // Delete existing matching offer or create
        const existing = await prisma.ticketOffer.findFirst({
          where: { eventId: fixture.id, providerId, seatingTier: offer.seatingTier },
        });

        if (existing) {
          await prisma.ticketOffer.update({
            where: { id: existing.id },
            data: {
              price: offer.price,
              originalCurrency: offer.originalCurrency,
              affiliateUrl: offer.affiliateUrl,
              availability: offer.availability,
              isBestValue: offer.isBestValue,
            },
          });
        } else {
          await prisma.ticketOffer.create({
            data: {
              eventId: fixture.id,
              providerId,
              seatingTier: offer.seatingTier,
              tierCategory: offer.tierCategory,
              price: offer.price,
              originalCurrency: offer.originalCurrency,
              affiliateUrl: offer.affiliateUrl,
              availability: offer.availability,
              isBestValue: offer.isBestValue,
              guaranteeBadge: offer.guaranteeBadge,
            },
          });
        }
      }
    }
  }


  // 4e. Seed Superstar Hero Scenes (European Football & European Cricket)
  const defaultScenes = [
    {
      name: 'Erling Haaland',
      nickname: 'The Nordic Striking Force',
      team: 'Manchester City',
      tournament: 'Premier League & UEFA Champions League',
      sport: 'football',
      poseTitle: 'Iconic Zen Meditation Pose',
      poseDescription: 'Cross-legged zen focus pose silencing 60,000 stadium fans under European floodlights',
      statBadge: 'EPL Golden Boot Record 🎯',
      accentColor: 'from-cyan-400 via-sky-500 to-blue-600',
      borderGlow: 'shadow-cyan-500/30 border-cyan-500/40',
      image: '/players/haaland-pose.jpg',
      ticketSlug: 'arsenal-vs-chelsea',
      order: 1,
      isActive: true,
      matchCompetition: 'Premier League Super Derby',
      matchMinuteOrOver: "58' IN-PLAY",
      matchHomeTeam: 'MCI',
      matchAwayTeam: 'ARS',
      matchScore: '2 - 0',
      matchLiveAction: '⚡ Haaland bursts past backline with 34 km/h sprint',
    },
    {
      name: 'Jude Bellingham',
      nickname: 'Golden Boy of Madrid & England',
      team: 'Real Madrid / England',
      tournament: 'La Liga & UEFA Champions League',
      sport: 'football',
      poseTitle: 'Outstretched Arms Bernabéu Stance',
      poseDescription: 'Chest puffed out with wide-open arms embracing 84,000 roaring Madridistas',
      statBadge: 'Champions League Winner 🏆',
      accentColor: 'from-amber-400 via-yellow-500 to-emerald-500',
      borderGlow: 'shadow-amber-500/30 border-amber-500/40',
      image: '/players/ronaldo-pose.jpg',
      ticketSlug: 'real-madrid-vs-barcelona',
      order: 2,
      isActive: true,
      matchCompetition: 'El Clásico Super Derby',
      matchMinuteOrOver: "91' IN-PLAY",
      matchHomeTeam: 'RMA',
      matchAwayTeam: 'FCB',
      matchScore: '3 - 2',
      matchLiveAction: '🚀 Jude stoppage-time winner into roof of the net',
    },
    {
      name: 'Kylian Mbappé',
      nickname: 'The French Speed Phenomenon',
      team: 'Real Madrid / France',
      tournament: 'UEFA Champions League Night',
      sport: 'football',
      poseTitle: 'Folded Arms Under Armpits Pose',
      poseDescription: 'Signature slide and calm folded arms celebration under cathedral floodlights',
      statBadge: 'European Superstar ⚡',
      accentColor: 'from-indigo-500 via-purple-500 to-pink-500',
      borderGlow: 'shadow-indigo-500/30 border-indigo-500/40',
      image: '/players/messi-pose.jpg',
      ticketSlug: 'real-madrid-vs-barcelona',
      order: 3,
      isActive: true,
      matchCompetition: 'UEFA Champions Derby',
      matchMinuteOrOver: "76' IN-PLAY",
      matchHomeTeam: 'RMA',
      matchAwayTeam: 'BAY',
      matchScore: '2 - 1',
      matchLiveAction: '⚡ Mbappé blistering counter-attack curler',
    },
    {
      name: 'Ben Stokes',
      nickname: 'Captain Marvel • Ashes Miracle Hero',
      team: 'England Cricket',
      tournament: "The Ashes Test Series (Lord's)",
      sport: 'cricket',
      poseTitle: 'Roaring Lord’s Balcony Fist-Pump',
      poseDescription: 'Passion roar under historic Lord’s pavilion clock after heroic boundary',
      statBadge: 'Ashes Legend 👑',
      accentColor: 'from-blue-600 via-indigo-600 to-amber-500',
      borderGlow: 'shadow-blue-500/30 border-blue-500/40',
      image: '/players/cricket-action.jpg',
      ticketSlug: 'the-ashes-england-vs-australia-lords',
      order: 4,
      isActive: true,
      matchCompetition: "The Ashes 2nd Test (Lord's)",
      matchMinuteOrOver: 'Day 4 • Final Session',
      matchHomeTeam: 'ENG',
      matchAwayTeam: 'AUS',
      matchScore: '371/8',
      matchLiveAction: '🏏 Stokes smashes six into the Grandstand upper deck',
    },
    {
      name: 'Joe Root',
      nickname: 'England’s All-Time Greatest',
      team: 'England Cricket / Yorkshire',
      tournament: 'ECB Summer International Test Series',
      sport: 'cricket',
      poseTitle: 'Bat-Raise Century Salute at The Oval',
      poseDescription: 'Helmet raised with calm mastery acknowledged by 27,000 standing London fans',
      statBadge: '35x Test Centuries 🏏',
      accentColor: 'from-teal-400 via-emerald-500 to-sky-500',
      borderGlow: 'shadow-teal-500/30 border-teal-500/40',
      image: '/players/kohli-pose.jpg',
      ticketSlug: 'the-hundred-finals-day-lords',
      order: 5,
      isActive: true,
      matchCompetition: 'ECB Summer Test Series',
      matchMinuteOrOver: '78.2 OV (IN-PLAY)',
      matchHomeTeam: 'ENG',
      matchAwayTeam: 'IND',
      matchScore: '286/3',
      matchLiveAction: '💥 Root drives through extra cover for four',
    },
  ];

  for (const scene of defaultScenes) {
    const existing = await prisma.heroScene.findFirst({
      where: { name: scene.name, sport: scene.sport },
    });
    if (!existing) {
      await prisma.heroScene.create({
        data: scene,
      });
    }
  }

  // 5. Seed High-Intent Sports Keywords for SERP Tracking
  const initialKeywords = [
    {
      keyword: 'where to watch arsenal vs chelsea live stream',
      sport: 'football',
      intent: 'COMMERCIAL',
      volume: 135000,
      difficulty: 'MEDIUM',
      currentRank: 3,
      bestRank: 2,
      targetSlug: 'where-to-watch-arsenal-vs-chelsea-live-stream',
    },
    {
      keyword: 'arsenal vs chelsea predicted lineups team news',
      sport: 'football',
      intent: 'INFORMATIONAL',
      volume: 48000,
      difficulty: 'LOW',
      currentRank: 4,
      bestRank: 3,
      targetSlug: 'arsenal-vs-chelsea-predicted-lineups-team-news',
    },
    {
      keyword: 'el clasico live stream tv channels usa uk',
      sport: 'football',
      intent: 'COMMERCIAL',
      volume: 220000,
      difficulty: 'HIGH',
      currentRank: 8,
      bestRank: 5,
      targetSlug: 'where-to-watch-real-madrid-vs-barcelona-live-stream',
    },
    {
      keyword: 'kansas city chiefs vs 49ers stream free nfl',
      sport: 'nfl',
      intent: 'COMMERCIAL',
      volume: 180000,
      difficulty: 'MEDIUM',
      currentRank: 5,
      bestRank: 4,
      targetSlug: 'how-to-watch-kansas-city-chiefs-vs-san-francisco-49ers-live',
    },
    {
      keyword: 'lakers vs celtics live stream reddit channels',
      sport: 'nba',
      intent: 'COMMERCIAL',
      volume: 95000,
      difficulty: 'MEDIUM',
      currentRank: 6,
      bestRank: 5,
      targetSlug: 'how-to-watch-los-angeles-lakers-vs-boston-celtics-live',
    },
    {
      keyword: 'ufc 315 main card start time ppv streaming',
      sport: 'ufc',
      intent: 'COMMERCIAL',
      volume: 160000,
      difficulty: 'HIGH',
      currentRank: 4,
      bestRank: 3,
      targetSlug: 'where-to-watch-makhachev-vs-volkanovski-3-live-stream',
    },
    {
      keyword: 'how to watch premier league abroad vpn',
      sport: 'football',
      intent: 'COMMERCIAL',
      volume: 42000,
      difficulty: 'LOW',
      currentRank: 2,
      bestRank: 2,
      targetSlug: 'how-to-stream-sports-from-anywhere-vpn-guide',
    },
  ];

  for (const kw of initialKeywords) {
    await prisma.keyword.upsert({
      where: { keyword: kw.keyword },
      update: {},
      create: kw,
    });
  }

  // 6. Ensure initial articles exist
  const count = await prisma.post.count();
  if (count === 0) {
    const { posts } = await generateDailyHypePosts(5, true);
    await saveGeneratedPostsToDatabase(posts);
  }

  console.log('Database seeding complete: Super Admin, Partners, and SERP Keywords loaded.');
}
