'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DeckData, INDUSTRIES, getGrowthRate, formatCurrency } from '@/lib/types';
import { getDeck } from '@/lib/storage';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ScatterChart, Scatter, ZAxis,
} from 'recharts';

const COLORS = ['#22d3ee', '#8b5cf6', '#3b82f6', '#6366f1'];

export default function PresentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [slide, setSlide] = useState(0);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const d = getDeck(id as string);
    if (!d) router.push('/dashboard');
    else setDeck(d);
  }, [id, router]);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (!showControls) return;
    const t = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(t);
  }, [showControls]);

  const totalSlides = 11;

  const next = useCallback(() => setSlide(s => Math.min(totalSlides - 1, s + 1)), []);
  const prev = useCallback(() => setSlide(s => Math.max(0, s - 1)), []);
  const exit = useCallback(() => router.push(`/deck/${id}`), [router, id]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      setShowControls(true);
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft' || e.key === 'Backspace') { e.preventDefault(); prev(); }
      else if (e.key === 'Escape') exit();
      else if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, exit]);

  if (!deck) return null;

  const tam = INDUSTRIES[deck.step1.industry] || 100e9;
  const sam = tam * 0.1;
  const som = sam * 0.01;
  const marketData = [
    { name: 'TAM', value: tam },
    { name: 'SAM', value: sam },
    { name: 'SOM', value: som },
  ];

  const growthRate = getGrowthRate(deck.step1.stage);
  const rawRevenue = parseFloat(deck.step5.revenue) || 0;
  const users = parseFloat(deck.step5.users) || 0;
  const baseRevenue = rawRevenue > 0 ? rawRevenue : (users > 0 ? users * 120 : 10000);
  const projections = Array.from({ length: 5 }, (_, i) => ({
    year: `Year ${i + 1}`,
    revenue: i === 0 ? baseRevenue : Math.round(baseRevenue * Math.pow(growthRate, i)),
  }));

  const competitors = (deck.step3.competitors || '').split('\n').filter(Boolean).slice(0, 4);
  const competitorData = competitors.map((c) => ({
    name: c.trim(),
    innovation: 30 + Math.random() * 50,
    marketShare: 20 + Math.random() * 60,
    z: 100,
  }));
  competitorData.push({ name: deck.step1.companyName || 'You', innovation: 80, marketShare: 20, z: 150 });

  const fundingAsk = parseFloat(deck.step5.fundingAsk) || 500000;
  const useOfFunds = [
    { name: 'Product', value: Math.round(fundingAsk * 0.4) },
    { name: 'Sales & Marketing', value: Math.round(fundingAsk * 0.3) },
    { name: 'Operations', value: Math.round(fundingAsk * 0.15) },
    { name: 'Reserve', value: Math.round(fundingAsk * 0.15) },
  ];

  const slideContent = [
    // 0: Cover
    <div key="cover" className="flex flex-col items-center justify-center text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-violet-500 text-4xl font-bold text-white shadow-2xl shadow-cyan-500/20">
        {(deck.step1.companyName || 'P')[0]}
      </div>
      <h1 className="text-6xl font-bold tracking-tight md:text-8xl">{deck.step1.companyName}</h1>
      <p className="mt-6 max-w-2xl text-2xl text-zinc-400">{deck.step1.oneLiner}</p>
      <div className="mt-8 flex gap-4">
        <span className="rounded-full bg-zinc-800/80 px-5 py-2 text-sm text-zinc-300">{deck.step1.industry}</span>
        <span className="rounded-full bg-zinc-800/80 px-5 py-2 text-sm text-zinc-300">{deck.step1.stage}</span>
      </div>
    </div>,

    // 1: Problem
    <div key="problem" className="flex flex-col justify-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-red-400">The Problem</p>
      <p className="max-w-3xl text-3xl leading-relaxed font-light text-zinc-100 md:text-4xl">{deck.step2.problem}</p>
    </div>,

    // 2: Solution
    <div key="solution" className="flex flex-col justify-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-400">Our Solution</p>
      <p className="max-w-3xl text-3xl leading-relaxed font-light text-zinc-100 md:text-4xl">{deck.step2.solution}</p>
      {deck.step2.uniqueAdvantage && (
        <div className="mt-10 max-w-2xl rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Unique Advantage</p>
          <p className="mt-3 text-xl text-zinc-200">{deck.step2.uniqueAdvantage}</p>
        </div>
      )}
    </div>,

    // 3: Market
    <div key="market" className="flex flex-col items-center justify-center">
      <p className="mb-8 text-sm font-semibold uppercase tracking-widest text-cyan-400">Market Opportunity</p>
      <div className="flex flex-col items-center gap-12 md:flex-row">
        <div className="h-72 w-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={marketData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} dataKey="value" paddingAngle={3}>
                {marketData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-6">
          {marketData.map((m, i) => (
            <div key={m.name} className="flex items-center gap-4">
              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              <div>
                <p className="text-sm font-medium text-zinc-400">{m.name}</p>
                <p className="text-3xl font-bold">{formatCurrency(m.value)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,

    // 4: Target Customer
    <div key="customer" className="flex flex-col justify-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-400">Target Customer</p>
      <p className="max-w-3xl text-3xl leading-relaxed font-light text-zinc-100 md:text-4xl">
        {deck.step3.targetCustomer || 'Target customer not specified'}
      </p>
    </div>,

    // 5: Business Model
    <div key="model" className="flex flex-col justify-center">
      <p className="mb-8 text-sm font-semibold uppercase tracking-widest text-cyan-400">Business Model</p>
      <div className="grid max-w-4xl gap-8 md:grid-cols-3">
        {[
          { label: 'Revenue Model', value: deck.step4.revenueModel || 'TBD' },
          { label: 'Pricing', value: deck.step4.pricing || 'TBD' },
          { label: 'Channels', value: deck.step4.channels || 'TBD' },
        ].map(item => (
          <div key={item.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{item.label}</p>
            <p className="mt-4 text-xl font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </div>,

    // 6: Traction
    <div key="traction" className="flex flex-col items-center justify-center">
      <p className="mb-8 text-sm font-semibold uppercase tracking-widest text-emerald-400">Traction</p>
      <div className="grid gap-8 md:grid-cols-3">
        {[
          { label: 'Revenue', value: deck.step5.revenue ? `$${parseInt(deck.step5.revenue).toLocaleString()}` : '$0', color: 'text-cyan-400' },
          { label: 'Users', value: deck.step5.users ? parseInt(deck.step5.users).toLocaleString() : '0', color: 'text-violet-400' },
          { label: 'Raised', value: deck.step5.fundingRaised ? `$${parseInt(deck.step5.fundingRaised).toLocaleString()}` : '$0', color: 'text-blue-400' },
        ].map(m => (
          <div key={m.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
            <p className={`text-5xl font-bold ${m.color}`}>{m.value}</p>
            <p className="mt-3 text-sm font-medium uppercase tracking-widest text-zinc-500">{m.label}</p>
          </div>
        ))}
      </div>
    </div>,

    // 7: Competition
    <div key="competition" className="flex flex-col items-center justify-center">
      <p className="mb-8 text-sm font-semibold uppercase tracking-widest text-violet-400">Competitive Landscape</p>
      {competitorData.length > 1 ? (
        <div className="h-80 w-full max-w-3xl">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis type="number" dataKey="marketShare" name="Market Reach" domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 14 }} label={{ value: 'Market Reach', fill: '#52525b', position: 'bottom' }} />
              <YAxis type="number" dataKey="innovation" name="Innovation" domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 14 }} label={{ value: 'Innovation', fill: '#52525b', angle: -90, position: 'insideLeft' }} />
              <ZAxis type="number" dataKey="z" range={[100, 250]} />
              <Scatter data={competitorData}>
                {competitorData.map((_, i) => <Cell key={i} fill={i === competitorData.length - 1 ? '#22d3ee' : '#8b5cf6'} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      ) : <p className="text-zinc-400">No competitors listed</p>}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {competitorData.map((c, i) => (
          <span key={c.name} className={`rounded-full px-4 py-1.5 text-sm ${i === competitorData.length - 1 ? 'bg-cyan-500/20 text-cyan-400 font-semibold' : 'bg-violet-500/10 text-violet-400'}`}>
            {c.name}
          </span>
        ))}
      </div>
    </div>,

    // 8: Financials
    <div key="financials" className="flex flex-col items-center justify-center">
      <p className="mb-8 text-sm font-semibold uppercase tracking-widest text-cyan-400">Financial Projections</p>
      <div className="h-80 w-full max-w-3xl">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projections}>
            <defs>
              <linearGradient id="presRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="year" tick={{ fill: '#a1a1aa', fontSize: 14 }} />
            <YAxis tick={{ fill: '#a1a1aa', fontSize: 14 }} tickFormatter={v => formatCurrency(v)} />
            <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fill="url(#presRevGrad)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-sm text-zinc-500">{growthRate}x annual growth ({deck.step1.stage} stage)</p>
    </div>,

    // 9: Team
    <div key="team" className="flex flex-col items-center justify-center">
      <p className="mb-8 text-sm font-semibold uppercase tracking-widest text-cyan-400">The Team</p>
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-5xl font-bold shadow-2xl shadow-cyan-500/20">
        {deck.step5.teamSize || '?'}
      </div>
      <p className="mt-6 text-3xl font-bold">{deck.step5.teamSize || '?'} team members</p>
      <p className="mt-2 text-lg text-zinc-400">Building {deck.step1.companyName || 'the future'}</p>
    </div>,

    // 10: The Ask
    <div key="ask" className="flex flex-col items-center justify-center">
      <p className="mb-8 text-sm font-semibold uppercase tracking-widest text-emerald-400">The Ask</p>
      <p className="text-7xl font-bold gradient-text md:text-8xl">{formatCurrency(fundingAsk)}</p>
      <p className="mt-4 text-xl text-zinc-400">Raising to accelerate growth</p>
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        {useOfFunds.map((f, i) => (
          <div key={f.name} className="text-center">
            <div className="mx-auto mb-2 h-3 w-16 rounded-full" style={{ backgroundColor: COLORS[i] }} />
            <p className="text-sm text-zinc-400">{f.name}</p>
            <p className="text-lg font-semibold">{formatCurrency(f.value)}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-10 py-6 text-center">
        <p className="text-lg text-zinc-200">Thank you.</p>
        <p className="mt-1 text-sm text-zinc-400">{deck.step1.companyName} — {deck.step1.oneLiner}</p>
      </div>
    </div>,
  ];

  const slideNames = ['Cover', 'Problem', 'Solution', 'Market', 'Customer', 'Business Model', 'Traction', 'Competition', 'Financials', 'Team', 'The Ask'];

  return (
    <div
      className="fixed inset-0 z-[100] bg-zinc-950"
      onMouseMove={() => setShowControls(true)}
      onClick={(e) => {
        const w = window.innerWidth;
        if ((e.target as HTMLElement).closest('button')) return;
        if (e.clientX > w * 0.6) next();
        else if (e.clientX < w * 0.4) prev();
      }}
    >
      {/* Slide Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="flex h-full w-full items-center justify-center px-12 py-16"
        >
          {slideContent[slide]}
        </motion.div>
      </AnimatePresence>

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Top bar */}
            <div className="fixed top-0 left-0 right-0 flex items-center justify-between bg-gradient-to-b from-zinc-950/80 to-transparent px-6 py-4">
              <button onClick={exit} className="rounded-lg bg-zinc-800/80 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700">
                ✕ Exit
              </button>
              <p className="text-sm text-zinc-500">
                {slideNames[slide]} — {slide + 1}/{totalSlides}
              </p>
              <button
                onClick={() => {
                  if (document.fullscreenElement) document.exitFullscreen();
                  else document.documentElement.requestFullscreen();
                }}
                className="rounded-lg bg-zinc-800/80 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700"
              >
                ⛶ Fullscreen
              </button>
            </div>

            {/* Bottom progress bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950/80 to-transparent px-6 py-4">
              <div className="mx-auto flex max-w-4xl items-center gap-4">
                <button onClick={prev} disabled={slide === 0} className="rounded-lg bg-zinc-800/80 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700 disabled:opacity-30">
                  ← Prev
                </button>
                <div className="flex flex-1 gap-1">
                  {Array.from({ length: totalSlides }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlide(i)}
                      className={`h-1.5 flex-1 rounded-full transition ${i === slide ? 'bg-cyan-400' : i < slide ? 'bg-cyan-400/30' : 'bg-zinc-700'}`}
                    />
                  ))}
                </div>
                <button onClick={next} disabled={slide === totalSlides - 1} className="rounded-lg bg-zinc-800/80 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700 disabled:opacity-30">
                  Next →
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-zinc-600">
                Arrow keys / Space to navigate · F for fullscreen · Esc to exit
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
