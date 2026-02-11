'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BLOG_POSTS } from '@/lib/blog';

const categoryColors: Record<string, string> = {
  Guide: 'bg-cyan-500/10 text-cyan-400',
  Insights: 'bg-violet-500/10 text-violet-400',
  Template: 'bg-emerald-500/10 text-emerald-400',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen px-6 pt-28 pb-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight md:text-5xl"
          >
            Pitch Deck{' '}
            <span className="gradient-text">Resources</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-lg text-zinc-400"
          >
            Guides, templates, and insights to help you create pitch decks that get funded.
          </motion.p>
        </div>

        <div className="space-y-6">
          {BLOG_POSTS.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-zinc-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[post.category] || 'bg-zinc-800 text-zinc-400'}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-zinc-600">{post.readTime} read</span>
                    </div>
                    <h2 className="text-xl font-semibold transition group-hover:text-cyan-400">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400 line-clamp-2">{post.excerpt}</p>
                  </div>
                  <span className="mt-2 shrink-0 text-zinc-600 transition group-hover:text-cyan-400">→</span>
                </div>
                <p className="mt-4 text-xs text-zinc-600">
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <h3 className="text-lg font-semibold">Ready to put this knowledge to work?</h3>
          <p className="mt-2 text-sm text-zinc-400">Create your pitch deck in minutes with our guided wizard.</p>
          <Link
            href="/create"
            className="mt-6 inline-block rounded-xl bg-cyan-500 px-8 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
          >
            Create Your Deck
          </Link>
        </div>
      </div>
    </div>
  );
}
