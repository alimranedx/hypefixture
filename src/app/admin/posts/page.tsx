import React from 'react';
import PostsSection from '@/components/admin/sections/PostsSection';

export const metadata = {
  title: 'Post Management & Article CMS | HypeFixture Admin',
  description: 'Manage live match guides, SEO articles, drafts, and schedule directory',
};

export default function PostsPage() {
  return <PostsSection />;
}
