import { prisma } from './prisma';

export interface ActiveSport {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  isActive: boolean;
  order: number;
}

export async function getActiveSports(): Promise<ActiveSport[]> {
  try {
    const list = await prisma.sportCategory.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });

    if (list.length > 0) {
      return list;
    }

    // Default fallback if table is empty
    return [
      {
        id: 'default-football',
        name: 'European Football',
        slug: 'football',
        icon: '⚽',
        description: 'Premier League, UEFA Champions League, La Liga, Serie A, Bundesliga',
        isActive: true,
        order: 1,
      },
      {
        id: 'default-cricket',
        name: 'European & UK Cricket',
        slug: 'cricket',
        icon: '🏏',
        description: "The Ashes, England Test Summer, The Hundred, Vitality Blast, European Cricket Championship",
        isActive: true,
        order: 2,
      },
    ];
  } catch (err) {
    console.error('Error fetching active sports from DB:', err);
    return [
      {
        id: 'fallback-football',
        name: 'European Football',
        slug: 'football',
        icon: '⚽',
        description: 'Premier League, Champions League, La Liga',
        isActive: true,
        order: 1,
      },
      {
        id: 'fallback-cricket',
        name: 'European & UK Cricket',
        slug: 'cricket',
        icon: '🏏',
        description: "The Ashes, England Test Series, The Hundred",
        isActive: true,
        order: 2,
      },
    ];
  }
}

export async function getSportBySlug(slug: string): Promise<ActiveSport | null> {
  try {
    const sport = await prisma.sportCategory.findFirst({
      where: {
        slug: slug.toLowerCase(),
        isActive: true,
      },
    });
    return sport;
  } catch (err) {
    console.error('Error fetching sport by slug:', err);
    return null;
  }
}
