'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DeckData, INDUSTRIES, getGrowthRate, formatCurrency } from '@/lib/types';
import { getDeck } from '@/lib/storage';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

const COLORS = ['#22d3ee', '#8b5cf6', '#3b82f6', '#6366f1'];

export default function ExportPage() {
  const { id } = useParams();
  const router = useRouter();
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
  const baseRevenue = parseFloat(deck.step5.revenue) || 0;
  const projections = Array.from({ length: 5 }, (_, i) => ({
    year: `Y${i + 1}`,
    revenue: i === 0 ? baseRevenue : Math.round(baseRevenue * Math.pow(growthRate, i)),
  }));

  const fundingAsk = parseFloat(deck.step5.fundingAsk) || 500000;
  const useOfFunds = [
    { name: 'Product', value: Math.round(fundingAsk * 0.4) },
    { name: 'Sales & Marketing', value: Math.round(fundingAsk * 0.3) },
    { name: 'Operations', value: Math.round(fundingAsk * 0.15) },
    { name: 'Reserve', value: Math.round(fundingAsk * 0.15) },
  ];

  function handlePrint() {
    window.print();
  }

  function handleShare() {
    const url = window.location.href.replace('/export', '');
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen px-6 pt-20 pb-20">
      <div className="mx-auto max-w-4xl">
        {/* Controls - hidden in print */}
        <div className="mb-8 flex items-center justify-between print:hidden">
          <div>
            <h1 className="text-2xl font-bold">Export Deck</h1>
            <p className="text-sm text-zinc-500">{deck.step1.companyName}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="rounded-xl border border-zinc-700 px-6 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
            >
              {copied ? 'Link Copied' : 'Share Link'}
            </button>
            <button
              onClick={handlePrint}
              className="rounded-xl bg-cyan-500 px-6 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
            >
              Download as PDF
            </button>
          </div>
        </div>

        {/* All slides preview */}
        <div className="space-y-6 print:space-y-0">
          {/* Cover */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center print:break-after-page print:rounded-none print:border-0">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-2xl font-bold text-white">
              {(deck.step1.companyName || 'P')[0]}
            </div>
            <h2 className="text-4xl font-bold">{deck.step1.companyName}</h2>
            <p className="mt-3 text-lg text-zinc-400">{deck.step1.oneLiner}</p>
            <div className="mt-4 flex justify-center gap-3">
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">{deck.step1.industry}</span>
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">{deck.step1.stage}</span>
            </div>
          </div>

          {/* Problem */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 print:break-after-page print:rounded-none print:border-0">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cyan-400">The Problem</h3>
            <p className="text-lg text-zinc-200">{deck.step2.problem}</p>
          </div>

          {/* Solution */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 print:break-after-page print:rounded-none print:border-0">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cyan-400">Our Solution</h3>
            <p className="text-lg text-zinc-200">{deck.step2.solution}</p>
            {deck.step2.uniqueAdvantage && (
              <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                <p className="text-xs uppercase tracking-widest text-cyan-400">Unique Advantage</p>
                <p className="mt-1 text-zinc-200">{deck.step2.uniqueAdvantage}</p>
              </div>
            )}
          </div>

          {/* Market */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 print:break-after-page print:rounded-none print:border-0">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cyan-400">Market Opportunity</h3>
            <div className="grid grid-cols-3 gap-4">
              {marketData.map((m, i) => (
                <div key={m.name} className="text-center">
                  <p className="text-2xl font-bold" style={{ color: COLORS[i] }}>{formatCurrency(m.value)}</p>
                  <p className="text-sm text-zinc-500">{m.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Business Model */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 print:break-after-page print:rounded-none print:border-0">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cyan-400">Business Model</h3>
            <div className="grid grid-cols-3 gap-4">
              <div><p className="text-xs text-zinc-500">Model</p><p className="font-semibold">{deck.step4.revenueModel}</p></div>
              <div><p className="text-xs text-zinc-500">Pricing</p><p className="font-semibold">{deck.step4.pricing}</p></div>
              <div><p className="text-xs text-zinc-500">Channels</p><p className="font-semibold">{deck.step4.channels}</p></div>
            </div>
          </div>

          {/* Traction */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 print:break-after-page print:rounded-none print:border-0">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cyan-400">Traction</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-cyan-400">{deck.step5.revenue ? `$${parseInt(deck.step5.revenue).toLocaleString()}` : '$0'}</p>
                <p className="text-xs text-zinc-500">Revenue</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-400">{deck.step5.users || '0'}</p>
                <p className="text-xs text-zinc-500">Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">{deck.step5.fundingRaised ? `$${parseInt(deck.step5.fundingRaised).toLocaleString()}` : '$0'}</p>
                <p className="text-xs text-zinc-500">Raised</p>
              </div>
            </div>
          </div>

          {/* Financials */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 print:break-after-page print:rounded-none print:border-0">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cyan-400">Financial Projections</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projections}>
                  <defs>
                    <linearGradient id="exportRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="year" tick={{ fill: '#71717a', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 12 }} tickFormatter={(v) => formatCurrency(v)} />
                  <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fill="url(#exportRevGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* The Ask */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 print:break-after-page print:rounded-none print:border-0">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cyan-400">The Ask</h3>
            <p className="text-3xl font-bold gradient-text">{formatCurrency(fundingAsk)}</p>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {useOfFunds.map((f, i) => (
                <div key={f.name}>
                  <div className="h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <p className="mt-1 text-xs text-zinc-400">{f.name}</p>
                  <p className="text-sm font-semibold">{formatCurrency(f.value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center print:hidden">
          <Link href={`/deck/${id}`} className="text-sm text-zinc-500 transition hover:text-zinc-300">
            Back to deck view
          </Link>
        </div>
      </div>
    </div>
  );
}
