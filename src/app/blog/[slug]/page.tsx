'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getPost, BlogPost, BLOG_POSTS } from '@/lib/blog';

const categoryColors: Record<string, string> = {
  Guide: 'bg-cyan-500/10 text-cyan-400',
  Insights: 'bg-violet-500/10 text-violet-400',
  Template: 'bg-emerald-500/10 text-emerald-400',
};

function renderMarkdown(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3 class="mt-8 mb-3 text-lg font-semibold text-zinc-100">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="mt-10 mb-4 text-2xl font-bold text-zinc-100">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="mt-6 mb-6 text-3xl font-bold text-zinc-100">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-zinc-200">$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 flex items-start gap-2 text-zinc-300"><span class="text-cyan-500 mt-1.5 shrink-0">•</span><span>$1</span></li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 flex items-start gap-2 text-zinc-300"><span class="text-cyan-500 font-semibold shrink-0">$1.</span><span>$2</span></li>')
    .replace(/\n\n/g, '</p><p class="mt-4 text-zinc-400 leading-relaxed">')
    .replace(/^(?!<[hla]|<li|<p)(.+)$/gm, '<p class="mt-4 text-zinc-400 leading-relaxed">$1</p>');
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const p = getPost(slug as string);
    if (!p) router.push('/blog');
    else setPost(p);
  }, [slug, router]);

  if (!post) return <div className="flex min-h-screen items-center justify-center pt-14 text-zinc-500">Loading...</div>;

  const currentIndex = BLOG_POSTS.findIndex(p => p.slug === post.slug);
  const nextPost = BLOG_POSTS[currentIndex + 1];
  const prevPost = BLOG_POSTS[currentIndex - 1];

  return (
    <div className="min-h-screen px-6 pt-24 pb-20">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-300">
          ← Back to Resources
        </Link>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${categoryColors[post.category] || 'bg-zinc-800 text-zinc-400'}`}>
              {post.category}
            </span>
            <span className="text-xs text-zinc-600">{post.readTime} read</span>
            <span className="text-xs text-zinc-600">
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>
          <p className="mt-4 text-lg text-zinc-400">{post.excerpt}</p>
        </motion.header>

        {/* Content */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-8 text-center">
          <h3 className="text-xl font-semibold">Put this into practice</h3>
          <p className="mt-2 text-sm text-zinc-400">Create your investor-ready pitch deck in minutes. Free forever.</p>
          <Link
            href="/create"
            className="mt-6 inline-block rounded-xl bg-cyan-500 px-8 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
          >
            Create Your Deck
          </Link>
        </div>

        {/* Navigation */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {prevPost && (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700"
            >
              <p className="text-xs text-zinc-500">← Previous</p>
              <p className="mt-1 text-sm font-semibold line-clamp-1">{prevPost.title}</p>
            </Link>
          )}
          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-right transition hover:border-zinc-700 md:col-start-2"
            >
              <p className="text-xs text-zinc-500">Next →</p>
              <p className="mt-1 text-sm font-semibold line-clamp-1">{nextPost.title}</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
