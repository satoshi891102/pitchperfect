'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { DeckData, INDUSTRIES, getGrowthRate, formatCurrency } from '@/lib/types';
import { getDeck } from '@/lib/storage';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ScatterChart, Scatter, ZAxis,
} from 'recharts';

const COLORS = ['#22d3ee', '#8b5cf6', '#3b82f6'];

function SlideWrapper({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-12">
      <h3 className="mb-6 text-xs font-semibold uppercase tracking-widest text-cyan-400">{title}</h3>
      {children}
    </div>
  );
}

export default function DeckPage() {
  const { id } = useParams();
  const router = useRouter();
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const d = getDeck(id as string);
    if (!d) router.push('/dashboard');
    else setDeck(d);
  }, [id, router]);

  if (!deck) return <div className="flex min-h-screen items-center justify-center pt-14 text-zinc-500">Loading...</div>;

  const tam = INDUSTRIES[deck.step1.industry] || 100000000000;
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
  // If no revenue but has users, estimate from users * $10/mo
  const baseRevenue = rawRevenue > 0 ? rawRevenue : (users > 0 ? users * 120 : 10000);
  const projections = Array.from({ length: 5 }, (_, i) => ({
    year: `Year ${i + 1}`,
    revenue: i === 0 ? baseRevenue : Math.round(baseRevenue * Math.pow(growthRate, i)),
  }));

  const competitors = deck.step3.competitors.split('\n').filter(Boolean).slice(0, 4);
  const competitorData = competitors.map((c, i) => ({
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

  const slides = [
    // 0: Cover
    <SlideWrapper key="cover" title="Cover">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-3xl font-bold text-white">
          {(deck.step1.companyName || 'PP')[0]}
        </div>
        <h1 className="text-4xl font-bold md:text-5xl">{deck.step1.companyName || 'Company Name'}</h1>
        <p className="mt-4 max-w-lg text-lg text-zinc-400">{deck.step1.oneLiner}</p>
        <div className="mt-6 flex gap-3">
          <span className="rounded-full bg-zinc-800 px-4 py-1 text-xs text-zinc-400">{deck.step1.industry}</span>
          <span className="rounded-full bg-zinc-800 px-4 py-1 text-xs text-zinc-400">{deck.step1.stage}</span>
        </div>
      </div>
    </SlideWrapper>,

    // 1: Problem
    <SlideWrapper key="problem" title="The Problem">
      <p className="max-w-2xl text-xl leading-relaxed text-zinc-200">{deck.step2.problem || 'No problem description provided.'}</p>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {['Painful', 'Frequent', 'Growing'].map((tag) => (
          <div key={tag} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 text-center">
            <p className="text-sm font-medium text-red-400">{tag}</p>
          </div>
        ))}
      </div>
    </SlideWrapper>,

    // 2: Solution
    <SlideWrapper key="solution" title="Our Solution">
      <p className="max-w-2xl text-xl leading-relaxed text-zinc-200">{deck.step2.solution || 'No solution description provided.'}</p>
      {deck.step2.uniqueAdvantage && (
        <div className="mt-8 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Unique Advantage</p>
          <p className="mt-2 text-zinc-200">{deck.step2.uniqueAdvantage}</p>
        </div>
      )}
    </SlideWrapper>,

    // 3: Market Opportunity
    <SlideWrapper key="market" title="Market Opportunity">
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="h-64 w-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={marketData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={3}>
                {marketData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => formatCurrency(v)} contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          {marketData.map((m, i) => (
            <div key={m.name} className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              <div>
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="text-lg font-bold text-zinc-100">{formatCurrency(m.value)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {deck.step3.targetCustomer && (
        <p className="mt-6 text-sm text-zinc-400">Target customer: {deck.step3.targetCustomer}</p>
      )}
    </SlideWrapper>,

    // 4: Business Model
    <SlideWrapper key="model" title="Business Model">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Revenue Model</p>
          <p className="mt-2 text-lg font-semibold">{deck.step4.revenueModel || 'TBD'}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Pricing</p>
          <p className="mt-2 text-lg font-semibold">{deck.step4.pricing || 'TBD'}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Channels</p>
          <p className="mt-2 text-lg font-semibold">{deck.step4.channels || 'TBD'}</p>
        </div>
      </div>
    </SlideWrapper>,

    // 5: Traction
    <SlideWrapper key="traction" title="Traction">
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Revenue', value: deck.step5.revenue ? `$${parseInt(deck.step5.revenue).toLocaleString()}` : '$0' },
          { label: 'Users', value: deck.step5.users || '0' },
          { label: 'Funding Raised', value: deck.step5.fundingRaised ? `$${parseInt(deck.step5.fundingRaised).toLocaleString()}` : '$0' },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 text-center">
            <p className="text-3xl font-bold gradient-text">{m.value}</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-widest text-zinc-500">{m.label}</p>
          </div>
        ))}
      </div>
    </SlideWrapper>,

    // 6: Competition
    <SlideWrapper key="competition" title="Competitive Landscape">
      {competitorData.length > 1 ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis type="number" dataKey="marketShare" name="Market Reach" domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 12 }} />
              <YAxis type="number" dataKey="innovation" name="Innovation" domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 12 }} />
              <ZAxis type="number" dataKey="z" range={[80, 200]} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                formatter={(v: any, name: any) => [v.toFixed(0), name]}
              />
              <Scatter data={competitorData} fill="#8b5cf6">
                {competitorData.map((entry, i) => (
                  <Cell key={i} fill={i === competitorData.length - 1 ? '#22d3ee' : '#8b5cf6'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-zinc-400">No competitors listed</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {competitorData.map((c, i) => (
          <span key={c.name} className={`rounded-full px-3 py-1 text-xs ${i === competitorData.length - 1 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-violet-500/20 text-violet-400'}`}>
            {c.name}
          </span>
        ))}
      </div>
    </SlideWrapper>,

    // 7: Go-to-Market
    <SlideWrapper key="gtm" title="Go-to-Market Strategy">
      <div className="space-y-4">
        {(deck.step4.channels || 'Direct Sales, Content Marketing, Partnerships').split(',').map((ch, i) => (
          <div key={i} className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-sm font-bold text-cyan-400">
              {i + 1}
            </div>
            <div>
              <p className="font-semibold">{ch.trim()}</p>
              <p className="mt-1 text-sm text-zinc-400">Targeted approach to reach {deck.step3.targetCustomer || 'customers'}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideWrapper>,

    // 8: Financial Projections
    <SlideWrapper key="financials" title="Financial Projections">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projections} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="year" tick={{ fill: '#71717a', fontSize: 12 }} />
            <YAxis tick={{ fill: '#71717a', fontSize: 12 }} tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
              formatter={(v: any) => [`$${v.toLocaleString()}`, 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fill="url(#revGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-xs text-zinc-500">
        Assuming {growthRate}x annual growth ({deck.step1.stage} stage)
      </p>
    </SlideWrapper>,

    // 9: Team
    <SlideWrapper key="team" title="The Team">
      <div className="flex flex-col items-center py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-2xl font-bold">
          {deck.step5.teamSize || '?'}
        </div>
        <p className="mt-4 text-2xl font-bold">{deck.step5.teamSize || '?'} team members</p>
        <p className="mt-2 text-sm text-zinc-400">Building {deck.step1.companyName || 'the future'}</p>
      </div>
    </SlideWrapper>,

    // 10: The Ask
    <SlideWrapper key="ask" title="The Ask">
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-4xl font-bold gradient-text">{formatCurrency(fundingAsk)}</p>
          <p className="mt-2 text-sm text-zinc-400">Raising to accelerate growth</p>
        </div>
        <div className="h-56 w-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={useOfFunds} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={2}>
                {useOfFunds.map((_, i) => (
                  <Cell key={i} fill={['#22d3ee', '#8b5cf6', '#3b82f6', '#6366f1'][i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => formatCurrency(v)} contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {useOfFunds.map((f, i) => (
          <div key={f.name} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ['#22d3ee', '#8b5cf6', '#3b82f6', '#6366f1'][i] }} />
            <span className="text-xs text-zinc-400">{f.name}: {formatCurrency(f.value)}</span>
          </div>
        ))}
      </div>
    </SlideWrapper>,
  ];

  const slideNames = ['Cover', 'Problem', 'Solution', 'Market', 'Business Model', 'Traction', 'Competition', 'Go-to-Market', 'Financials', 'Team', 'The Ask'];

  return (
    <div className="min-h-screen px-6 pt-20 pb-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{deck.step1.companyName || 'Pitch Deck'}</h1>
            <p className="text-sm text-zinc-500">Slide {slide + 1} of {slides.length}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/deck/${id}/score`}
              className="rounded-xl border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
            >
              Pitch Score
            </Link>
            <Link
              href={`/deck/${id}/present`}
              className="rounded-xl border border-violet-500/50 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
            >
              Present
            </Link>
            <Link
              href={`/deck/${id}/export`}
              className="rounded-xl bg-cyan-500 px-6 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
            >
              Export
            </Link>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="mb-6 flex gap-1 overflow-x-auto pb-2">
          {slideNames.map((name, i) => (
            <button
              key={name}
              onClick={() => setSlide(i)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                i === slide ? 'bg-cyan-500 text-zinc-950' : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Current Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {slides[slide]}
          </motion.div>
        </AnimatePresence>

        {/* Prev/Next */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setSlide(Math.max(0, slide - 1))}
            disabled={slide === 0}
            className="rounded-xl border border-zinc-800 px-6 py-2 text-sm text-zinc-400 transition hover:border-zinc-600 disabled:opacity-30"
          >
            Previous
          </button>
          <button
            onClick={() => setSlide(Math.min(slides.length - 1, slide + 1))}
            disabled={slide === slides.length - 1}
            className="rounded-xl border border-zinc-800 px-6 py-2 text-sm text-zinc-400 transition hover:border-zinc-600 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
