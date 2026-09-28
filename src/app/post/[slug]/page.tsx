import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import StreamCtaCard from '@/components/StreamCtaCard';
import JsonLd from '@/components/JsonLd';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, ArrowRight } from 'lucide-react';
import { sanitizeArticleHtml } from '@/lib/sanitize';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.summary,
    keywords: post.seoKeywords ? post.seoKeywords.split(',') : undefined,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  // Increment view counter asynchronously
  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  }).catch(() => null);

  // Fetch related articles from same sport
  const relatedPosts = await prisma.post.findMany({
    where: {
      sport: post.sport,
      slug: { not: post.slug },
      status: 'PUBLISHED',
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'HypeFixture',
      url: 'https://hypefixture.com',
    },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <JsonLd data={articleSchema} />

      {/* Breadcrumb / Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Fixtures & Guides
      </Link>

      {/* Header */}
      <div className="space-y-4 border-b border-slate-800 pb-8">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            {post.sport}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight bg-transparent">
          {post.title}
        </h1>

        <p className="text-base text-slate-300 font-medium leading-relaxed">
          {post.summary}
        </p>
      </div>

      {/* Embedded Stream CTA */}
      <StreamCtaCard matchTitle={post.title} sport={post.sport} />

      {/* Article Content Rendered */}
      <div
        className="prose prose-invert prose-emerald max-w-none text-slate-300 leading-relaxed text-base [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-100 [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4"
        dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(post.content) }}
      />

      {/* Bottom CTA for VPN */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        <div>
          <h4 className="text-base font-bold text-white mb-1">Streaming from abroad?</h4>
          <p className="text-xs text-slate-400">Avoid regional blackouts and protect your connection with a verified sports VPN.</p>
        </div>
        <Link
          href="/go/vpn"
          target="_blank"
          rel="sponsored nofollow"
          className="shrink-0 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
        >
          Check VPN Access &rarr;
        </Link>
      </div>

      {/* Related Posts Cluster */}
      {relatedPosts.length > 0 && (
        <section className="pt-12 border-t border-slate-800 space-y-6">
          <h3 className="text-xl font-bold text-white">Related {post.sport.toUpperCase()} Match Guides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.id}
                href={`/post/${rel.slug}`}
                className="block bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 transition group"
              >
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 line-clamp-2 mb-2">
                  {rel.title}
                </h4>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  Read Guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
