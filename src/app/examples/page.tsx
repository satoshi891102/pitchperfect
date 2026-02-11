'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { TEMPLATES } from '@/lib/templates';
import { INDUSTRIES, formatCurrency, getGrowthRate } from '@/lib/types';
import { DeckData } from '@/lib/types';
import { saveDeck } from '@/lib/storage';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const COLORS = ['#22d3ee', '#8b5cf6', '#3b82f6', '#6366f1'];

function ExampleDeck({ template }: { template: typeof TEMPLATES[0] }) {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const d = template.data;

  const tam = INDUSTRIES[d.step1.industry] || 100e9;
  const sam = tam * 0.1;
  const som = sam * 0.01;
  const marketData = [
    { name: 'TAM', value: tam },
    { name: 'SAM', value: sam },
    { name: 'SOM', value: som },
  ];

  const growthRate = getGrowthRate(d.step1.stage);
  const baseRevenue = parseFloat(d.step5.revenue) || (parseFloat(d.step5.users) || 0) * 120 || 10000;
  const projections = Array.from({ length: 5 }, (_, i) => ({
    year: `Y${i + 1}`,
    revenue: i === 0 ? baseRevenue : Math.round(baseRevenue * Math.pow(growthRate, i)),
  }));

  const fundingAsk = parseFloat(d.step5.fundingAsk) || 500000;

  const slides = [
    // Cover
    <div key="cover" className="flex flex-col items-center justify-center text-center py-8">
      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${template.color} text-2xl font-bold text-white`}>
        {d.step1.companyName[0]}
      </div>
      <h3 className="text-2xl font-bold">{d.step1.companyName}</h3>
      <p className="mt-2 text-sm text-zinc-400 max-w-sm">{d.step1.oneLiner}</p>
      <div className="mt-3 flex gap-2">
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">{d.step1.industry}</span>
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">{d.step1.stage}</span>
      </div>
    </div>,
    // Problem
    <div key="problem" className="py-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">Problem</p>
      <p className="text-sm text-zinc-300 leading-relaxed line-clamp-6">{d.step2.problem}</p>
    </div>,
    // Solution
    <div key="solution" className="py-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Solution</p>
      <p className="text-sm text-zinc-300 leading-relaxed line-clamp-4">{d.step2.solution}</p>
      {d.step2.uniqueAdvantage && (
        <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
          <p className="text-xs text-cyan-400 font-medium">Unique Advantage</p>
          <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{d.step2.uniqueAdvantage}</p>
        </div>
      )}
    </div>,
    // Market
    <div key="market" className="py-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">Market</p>
      <div className="flex items-center gap-4">
        <div className="h-32 w-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={marketData} cx="50%" cy="50%" innerRadius={25} outerRadius={50} dataKey="value" paddingAngle={3}>
                {marketData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {marketData.map((m, i) => (
            <div key={m.name} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              <span className="text-xs text-zinc-400">{m.name}: <span className="font-semibold text-zinc-200">{formatCurrency(m.value)}</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    // Financials
    <div key="financials" className="py-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">Projections</p>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projections}>
            <defs>
              <linearGradient id={`grad-${template.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="year" tick={{ fill: '#71717a', fontSize: 10 }} />
            <YAxis tick={{ fill: '#71717a', fontSize: 10 }} tickFormatter={v => formatCurrency(v)} />
            <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fill={`url(#grad-${template.id})`} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>,
    // The Ask
    <div key="ask" className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">The Ask</p>
      <p className="text-3xl font-bold gradient-text">{formatCurrency(fundingAsk)}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg bg-zinc-800/50 p-2">
          <p className="text-xs text-zinc-500">Revenue</p>
          <p className="text-sm font-semibold text-cyan-400">{d.step5.revenue ? `$${parseInt(d.step5.revenue).toLocaleString()}` : '$0'}</p>
        </div>
        <div className="rounded-lg bg-zinc-800/50 p-2">
          <p className="text-xs text-zinc-500">Users</p>
          <p className="text-sm font-semibold text-violet-400">{d.step5.users ? parseInt(d.step5.users).toLocaleString() : '0'}</p>
        </div>
      </div>
    </div>,
  ];

  const slideNames = ['Cover', 'Problem', 'Solution', 'Market', 'Projections', 'The Ask'];

  function cloneAsNew() {
    const id = crypto.randomUUID();
    const deck: DeckData = { ...d, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    saveDeck(deck);
    router.push(`/deck/${id}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden"
    >
      {/* Template header */}
      <div className={`bg-gradient-to-br ${template.color} px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{template.icon}</span>
          <div>
            <h3 className="font-semibold text-white">{template.name}</h3>
            <p className="text-xs text-white/60">{d.step1.companyName} — {d.step1.industry}</p>
          </div>
        </div>
        <button
          onClick={cloneAsNew}
          className="rounded-lg bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/30"
        >
          Use This
        </button>
      </div>

      {/* Slide mini nav */}
      <div className="flex gap-1 px-4 pt-3">
        {slideNames.map((name, i) => (
          <button
            key={name}
            onClick={() => setActiveSlide(i)}
            className={`rounded px-2 py-1 text-xs font-medium transition ${
              i === activeSlide ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Slide content */}
      <div className="px-6 min-h-[280px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="w-full"
          >
            {slides[activeSlide]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="px-6 pb-4 flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: slides.length }, (_, i) => (
            <div
              key={i}
              className={`h-1 w-6 rounded-full transition cursor-pointer ${i === activeSlide ? 'bg-cyan-400' : 'bg-zinc-700 hover:bg-zinc-600'}`}
              onClick={() => setActiveSlide(i)}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSlide(s => Math.max(0, s - 1))}
            disabled={activeSlide === 0}
            className="rounded px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
          >
            ←
          </button>
          <button
            onClick={() => setActiveSlide(s => Math.min(slides.length - 1, s + 1))}
            disabled={activeSlide === slides.length - 1}
            className="rounded px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExamplesPage() {
  return (
    <div className="min-h-screen px-6 pt-28 pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight md:text-5xl"
          >
            Example{' '}
            <span className="gradient-text">Pitch Decks</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-lg text-zinc-400"
          >
            Browse complete, investor-ready pitch decks across different industries. Click through slides to see how great decks tell a story.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {TEMPLATES.map(template => (
            <ExampleDeck key={template.id} template={template} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-zinc-400">Ready to build your own?</p>
          <div className="mt-4 flex justify-center gap-4">
            <Link
              href="/create"
              className="rounded-xl bg-cyan-500 px-8 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
            >
              Start from Scratch
            </Link>
            <Link
              href="/templates"
              className="rounded-xl border border-zinc-700 px-8 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
            >
              Use a Template
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
