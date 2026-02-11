'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TEMPLATES, DeckTemplate } from '@/lib/templates';
import { DeckData } from '@/lib/types';
import { saveDeck } from '@/lib/storage';

function TemplateCard({ template, onUse }: { template: DeckTemplate; onUse: () => void }) {
  const [preview, setPreview] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition hover:border-zinc-700"
    >
      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${template.color} p-6`}>
        <div className="flex items-center justify-between">
          <span className="text-3xl">{template.icon}</span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {template.stage}
          </span>
        </div>
        <h3 className="mt-4 text-xl font-bold text-white">{template.name}</h3>
        <p className="mt-1 text-sm text-white/70">{template.industry}</p>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-sm text-zinc-400">{template.description}</p>

        {/* Preview section */}
        {preview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 space-y-3 border-t border-zinc-800 pt-4"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Company</p>
              <p className="mt-1 text-sm text-zinc-300">{template.data.step1.companyName} — {template.data.step1.oneLiner}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Problem</p>
              <p className="mt-1 text-sm text-zinc-400 line-clamp-3">{template.data.step2.problem}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Solution</p>
              <p className="mt-1 text-sm text-zinc-400 line-clamp-3">{template.data.step2.solution}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-zinc-800/50 p-2">
                <p className="text-xs text-zinc-500">Revenue</p>
                <p className="text-sm font-semibold text-cyan-400">
                  {template.data.step5.revenue ? `$${parseInt(template.data.step5.revenue).toLocaleString()}` : '$0'}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-2">
                <p className="text-xs text-zinc-500">Users</p>
                <p className="text-sm font-semibold text-violet-400">
                  {template.data.step5.users ? parseInt(template.data.step5.users).toLocaleString() : '0'}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-2">
                <p className="text-xs text-zinc-500">Ask</p>
                <p className="text-sm font-semibold text-blue-400">
                  ${parseInt(template.data.step5.fundingAsk || '0').toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={onUse}
            className="flex-1 rounded-xl bg-cyan-500 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
          >
            Use Template
          </button>
          <button
            onClick={() => setPreview(!preview)}
            className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200"
          >
            {preview ? 'Less' : 'Preview'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('all');

  const industries = ['all', ...new Set(TEMPLATES.map(t => t.industry))];
  const filtered = filter === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.industry === filter);

  function useTemplate(template: DeckTemplate) {
    const id = crypto.randomUUID();
    const deck: DeckData = {
      ...template.data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveDeck(deck);
    router.push(`/deck/${id}`);
  }

  return (
    <div className="min-h-screen px-6 pt-28 pb-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight md:text-5xl"
          >
            Pitch Deck{' '}
            <span className="gradient-text">Templates</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-lg text-zinc-400"
          >
            Start with a proven structure. Each template includes real-world data, financial projections, and competitive positioning.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {industries.map(ind => (
            <button
              key={ind}
              onClick={() => setFilter(ind)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === ind
                  ? 'bg-cyan-500 text-zinc-950'
                  : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {ind === 'all' ? 'All Industries' : ind}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onUse={() => useTemplate(template)}
            />
          ))}
        </div>

        {/* Custom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
            <p className="text-lg font-semibold">Don&apos;t see your industry?</p>
            <p className="mt-2 text-sm text-zinc-400">
              Start from scratch with our guided wizard. Answer 5 questions and get a complete deck.
            </p>
            <Link
              href="/create"
              className="mt-6 inline-block rounded-xl bg-cyan-500 px-8 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
            >
              Build Custom Deck
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
