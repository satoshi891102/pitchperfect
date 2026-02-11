'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DeckData } from '@/lib/types';
import { getDeck } from '@/lib/storage';
import { scoreDeck, DeckScore, ScoreDimension } from '@/lib/scoring';

const statusColors: Record<string, { bg: string; text: string; ring: string }> = {
  excellent: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-emerald-500/30' },
  good: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', ring: 'ring-cyan-500/30' },
  'needs-work': { bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/30' },
  missing: { bg: 'bg-red-500/10', text: 'text-red-400', ring: 'ring-red-500/30' },
};

const statusLabels: Record<string, string> = {
  excellent: 'Excellent',
  good: 'Good',
  'needs-work': 'Needs Work',
  missing: 'Missing',
};

function GradeCircle({ grade, pct }: { grade: string; pct: number }) {
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (pct * circumference);

  let gradeColor = '#22d3ee';
  if (pct >= 0.8) gradeColor = '#10b981';
  else if (pct >= 0.6) gradeColor = '#22d3ee';
  else if (pct >= 0.4) gradeColor = '#f59e0b';
  else gradeColor = '#ef4444';

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg className="absolute -rotate-90" width="128" height="128" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#27272a" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r="54" fill="none"
          stroke={gradeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="text-center">
        <motion.p
          className="text-4xl font-bold"
          style={{ color: gradeColor }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          {grade}
        </motion.p>
        <p className="text-xs text-zinc-500">{Math.round(pct * 100)}%</p>
      </div>
    </div>
  );
}

function DimensionCard({ dim, index }: { dim: ScoreDimension; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const colors = statusColors[dim.status];
  const pct = dim.score / dim.maxScore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 ring-1 ${colors.ring} cursor-pointer transition hover:border-zinc-700`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">{dim.name}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
              {statusLabels[dim.status]}
            </span>
          </div>
          {/* Score bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-zinc-800">
              <motion.div
                className="h-2 rounded-full"
                style={{ backgroundColor: colors.text.replace('text-', '').includes('emerald') ? '#10b981' : colors.text.includes('cyan') ? '#22d3ee' : colors.text.includes('amber') ? '#f59e0b' : '#ef4444' }}
                initial={{ width: 0 }}
                animate={{ width: `${pct * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              />
            </div>
            <span className="text-sm font-medium text-zinc-400">{dim.score}/{dim.maxScore}</span>
          </div>
        </div>
        <button className="ml-4 text-zinc-500 transition hover:text-zinc-300">
          <svg className={`h-5 w-5 transition ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {expanded && dim.tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 space-y-2 border-t border-zinc-800 pt-4"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Improvement Tips</p>
          {dim.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">→</span>
              <p className="text-sm text-zinc-400">{tip}</p>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ScorePage() {
  const { id } = useParams();
  const router = useRouter();
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [score, setScore] = useState<DeckScore | null>(null);

  useEffect(() => {
    const d = getDeck(id as string);
    if (!d) { router.push('/dashboard'); return; }
    setDeck(d);
    setScore(scoreDeck(d));
  }, [id, router]);

  if (!deck || !score) return <div className="flex min-h-screen items-center justify-center pt-14 text-zinc-500">Analyzing...</div>;

  const pct = score.total / score.maxTotal;
  const excellent = score.dimensions.filter(d => d.status === 'excellent').length;
  const needsWork = score.dimensions.filter(d => d.status === 'needs-work' || d.status === 'missing').length;
  const totalTips = score.dimensions.reduce((s, d) => s + d.tips.length, 0);

  return (
    <div className="min-h-screen px-6 pt-20 pb-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Deck Analysis</h1>
            <p className="text-sm text-zinc-500">{deck.step1.companyName}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/deck/${id}`}
              className="rounded-xl border border-zinc-700 px-6 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
            >
              Back to Deck
            </Link>
            <Link
              href="/create"
              className="rounded-xl bg-cyan-500 px-6 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
            >
              Improve Deck
            </Link>
          </div>
        </div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-center gap-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 md:flex-row md:items-start"
        >
          <GradeCircle grade={score.grade} pct={pct} />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold">
              Overall Score: {score.total}/{score.maxTotal}
            </h2>
            <p className="mt-2 text-zinc-400">{score.summary}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
              <div className="rounded-lg bg-emerald-500/10 px-3 py-1.5">
                <span className="text-sm font-medium text-emerald-400">{excellent} excellent</span>
              </div>
              <div className="rounded-lg bg-amber-500/10 px-3 py-1.5">
                <span className="text-sm font-medium text-amber-400">{needsWork} need work</span>
              </div>
              <div className="rounded-lg bg-zinc-800 px-3 py-1.5">
                <span className="text-sm font-medium text-zinc-400">{totalTips} tips</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dimension Cards */}
        <div className="space-y-3">
          <h2 className="mb-4 text-lg font-semibold">Detailed Breakdown</h2>
          {score.dimensions.map((dim, i) => (
            <DimensionCard key={dim.name} dim={dim} index={i} />
          ))}
        </div>

        {/* Investor Readiness Checklist */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8"
        >
          <h2 className="mb-4 text-lg font-semibold">Investor Readiness Checklist</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { check: !!deck.step1.companyName && deck.step1.oneLiner.length > 10, label: 'Clear company identity & value prop' },
              { check: deck.step2.problem.length >= 50, label: 'Well-defined problem with data' },
              { check: deck.step2.solution.length >= 50 && !!deck.step2.uniqueAdvantage, label: 'Compelling solution with unique advantage' },
              { check: !!deck.step1.industry && !!deck.step3.targetCustomer, label: 'Market sizing & target customer defined' },
              { check: !!deck.step4.revenueModel && !!deck.step4.pricing, label: 'Business model & pricing strategy' },
              { check: (deck.step3.competitors || '').split('\n').filter(Boolean).length >= 2, label: 'Competitive landscape mapped' },
              { check: parseFloat(deck.step5.revenue) > 0 || parseFloat(deck.step5.users) > 0, label: 'Traction evidence (revenue or users)' },
              { check: parseFloat(deck.step5.fundingAsk) > 0, label: 'Clear funding ask with use of funds' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg p-2">
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${item.check ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-600'}`}>
                  {item.check ? '✓' : '○'}
                </div>
                <span className={`text-sm ${item.check ? 'text-zinc-200' : 'text-zinc-500'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-zinc-500">
            Want a higher score? Go back to the wizard and strengthen the weak areas.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link
              href="/create"
              className="rounded-xl bg-cyan-500 px-8 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
            >
              Edit & Improve
            </Link>
            <Link
              href={`/deck/${id}/present`}
              className="rounded-xl border border-zinc-700 px-8 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
            >
              Present Deck
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
