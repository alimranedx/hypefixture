import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { getAllTicketEvents } from '@/lib/tickets';
import { getActiveSports } from '@/lib/sports';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ticketfixture.com';

  // 1. Core Hub Routes
  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${baseUrl}/tickets`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.95 },
    { url: `${baseUrl}/live`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
  ];

  // 2. Dynamic Active Sports
  let sportRoutes: MetadataRoute.Sitemap = [];
  try {
    const activeSports = await getActiveSports();
    sportRoutes = activeSports.map((s) => ({
      url: `${baseUrl}/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    }));
  } catch {
    sportRoutes = [
      { url: `${baseUrl}/football`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
      { url: `${baseUrl}/cricket`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    ];
  }

  // 3. Programmatic Match & Event Ticket Pages
  const ticketEvents = getAllTicketEvents();
  const matchRoutes: MetadataRoute.Sitemap = ticketEvents.map((event) => ({
    url: `${baseUrl}/match/${event.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 4. Dynamic published SEO posts from MySQL
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

  return [...coreRoutes, ...sportRoutes, ...matchRoutes, ...postRoutes];
}
