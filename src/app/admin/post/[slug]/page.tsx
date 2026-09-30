'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function LegacyPostRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  useEffect(() => {
    if (slug) {
      router.replace(`/admin/posts/${encodeURIComponent(slug)}`);
    }
  }, [slug, router]);

  return (
    <div className="py-20 flex flex-col items-center justify-center space-y-3">
      <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      <span className="text-xs text-slate-400">Forwarding to article...</span>
    </div>
  );
}
