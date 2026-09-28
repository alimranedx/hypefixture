import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { HYPE_MATCH_POOL } from '@/lib/gemini';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hypefixture.com';

  // Static sport routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${baseUrl}/football`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/nba`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/nfl`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/ufc`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  // Programmatic match pages
  const matchRoutes: MetadataRoute.Sitemap = HYPE_MATCH_POOL.map((m) => ({
    url: `${baseUrl}/match/${m.teams.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Dynamic published posts from MySQL
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      take: 1000,
    });
    postRoutes = posts.map((p) => ({
      url: `${baseUrl}/post/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Error fetching posts for sitemap:', err);
  }

  return [...staticRoutes, ...matchRoutes, ...postRoutes];
}
