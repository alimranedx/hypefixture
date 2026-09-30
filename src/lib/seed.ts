import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { generateDailyHypePosts, saveGeneratedPostsToDatabase } from './gemini';

export async function seedDatabase() {
  console.log('Seeding HypeFixture database...');

  // 1. Ensure system settings exist
  await prisma.systemSetting.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      postsPerDay: 5,
      autoPublish: true,
      activeSports: 'football,cricket',
      affforceUrl: 'https://seatgeek.com/?ref=hypefixture',
      vpnUrl: 'https://nordvpn.com',
      fuboUrl: 'https://www.fubo.tv',
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
    where: { email: 'admin@hypefixture.com' },
    update: {
      role: 'ADMIN',
      isApproved: true,
      password: hashedPassword,
    },
    create: {
      email: 'admin@hypefixture.com',
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
      targetUrl: 'https://seatgeek.com/?ref=hypefixture',
      category: 'Verified Event Tickets',
      payout: '5% - 10% Commission',
      clicks: 210,
      conversions: 14,
    },
    {
      name: 'StubHub FanProtect Marketplace',
      slug: 'stubhub',
      targetUrl: 'https://stubhub.com/?ref=hypefixture',
      category: 'Secondary Resale',
      payout: '4% - 9% Commission',
      clicks: 184,
      conversions: 11,
    },
    {
      name: 'Viagogo Global Tickets',
      slug: 'viagogo',
      targetUrl: 'https://viagogo.com/?ref=hypefixture',
      category: 'International Sports',
      payout: '7% - 10% Commission',
      clicks: 125,
      conversions: 8,
    },
    {
      name: 'TickPick No-Fee Marketplace',
      slug: 'tickpick',
      targetUrl: 'https://tickpick.com/?ref=hypefixture',
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
