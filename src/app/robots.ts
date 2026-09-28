import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/go/', '/dashboard/'],
      },
    ],
    sitemap: 'https://hypefixture.com/sitemap.xml',
  };
}
