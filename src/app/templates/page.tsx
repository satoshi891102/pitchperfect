'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TEMPLATES, DeckTemplate } from '@/lib/templates';
import { DeckData } from '@/lib/types';
import { saveDeck } from '@/lib/storage';

const categories = ['All', ...Array.from(new Set(TEMPLATES.map((t) => t.category)))];

function TemplateCard({ template, onUse }: { template: DeckTemplate; onUse: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 transition hover:border-zinc-700"
    >
      {/* Header */}
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ backgroundColor: `${template.color}15` }}>
            {template.icon}
          </div>
          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">{template.category}</span>
        </div>
        <h3 className="text-lg font-bold">{template.name}</h3>
        <p className="mt-1 text-sm text-zinc-400">{template.description}</p>

        {/* Preview */}
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Preview</p>
          <p className="mt-2 text-sm font-semibold" style={{ color: template.color }}>{template.data.step1.companyName}</p>
          <p className="mt-1 text-xs text-zinc-400">{template.data.step1.oneLiner}</p>
          <div className="mt-3 flex gap-2">
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">{template.data.step1.industry}</span>
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">{template.data.step1.stage}</span>
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">{template.data.step4.revenueModel}</span>
          </div>
        </div>

        {/* Expandable details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs font-medium text-zinc-500 transition hover:text-zinc-300"
        >
          {expanded ? 'Show less' : 'Show details'} {expanded ? '↑' : '↓'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3 text-xs text-zinc-400">
                <div>
                  <p className="mb-1 font-semibold text-zinc-300">Problem</p>
                  <p className="line-clamp-3">{template.data.step2.problem}</p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-zinc-300">Solution</p>
                  <p className="line-clamp-3">{template.data.step2.solution}</p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-zinc-300">Unique Advantage</p>
                  <p className="line-clamp-2">{template.data.step2.uniqueAdvantage}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 rounded-lg bg-zinc-800/30 p-3">
                  <div>
                    <p className="text-zinc-500">Revenue</p>
                    <p className="font-semibold text-zinc-200">${parseInt(template.data.step5.revenue || '0').toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Users</p>
                    <p className="font-semibold text-zinc-200">{template.data.step5.users || '0'}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Ask</p>
                    <p className="font-semibold text-zinc-200">${parseInt(template.data.step5.fundingAsk || '0').toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="border-t border-zinc-800 p-4">
        <button
          onClick={onUse}
          className="w-full rounded-xl py-2.5 text-sm font-semibold transition"
          style={{ backgroundColor: `${template.color}15`, color: template.color }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${template.color}25`; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${template.color}15`; }}
        >
          Use This Template
        </button>
      </div>
    </motion.div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter);

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Templates</h1>
          <p className="mt-3 text-zinc-400">Start with a proven structure. Customize everything to match your company.</p>
        </motion.div>

        {/* Category Filter */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition ${
                filter === cat
                  ? 'bg-cyan-500 text-zinc-950'
                  : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
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
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center"
        >
          <h3 className="text-xl font-bold">Have your own idea?</h3>
          <p className="mt-2 text-sm text-zinc-400">Start from scratch and build a completely custom pitch deck.</p>
          <button
            onClick={() => router.push('/create')}
            className="mt-6 rounded-xl bg-cyan-500 px-8 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
          >
            Create From Scratch
          </button>
        </motion.div>
      </div>
    </div>
  );
}
