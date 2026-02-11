'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DeckData } from '@/lib/types';
import { getDeck } from '@/lib/storage';
import { scoreDeck, ScoreBreakdown } from '@/lib/scoring';

function CircularScore({ score, size = 160, label }: { score: number; size?: number; label: string }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#22d3ee' : score >= 60 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#27272a" strokeWidth={8} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-3xl font-bold"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <span className="text-xs font-medium text-zinc-500">{label}</span>
    </div>
  );
}

function BarScore({ name, score, maxScore, feedback, icon, delay }: { name: string; score: number; maxScore: number; feedback: string; icon: string; delay: number }) {
  const pct = Math.round((score / maxScore) * 100);
  const color = pct >= 80 ? 'bg-cyan-500' : pct >= 60 ? 'bg-yellow-500' : pct >= 40 ? 'bg-orange-500' : 'bg-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-semibold">{name}</span>
        </div>
        <span className="text-sm font-bold text-zinc-300">{score}/{maxScore}</span>
      </div>
      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
        />
      </div>
      <p className="text-xs text-zinc-400">{feedback}</p>
    </motion.div>
  );
}

export default function ScorePage() {
  const { id } = useParams();
  const router = useRouter();
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [scores, setScores] = useState<ScoreBreakdown | null>(null);

  useEffect(() => {
    const d = getDeck(id as string);
    if (!d) { router.push('/dashboard'); return; }
    setDeck(d);
    setScores(scoreDeck(d));
  }, [id, router]);

  if (!deck || !scores) return <div className="flex min-h-screen items-center justify-center pt-14 text-zinc-500">Analyzing...</div>;

  const gradeColors: Record<string, string> = {
    A: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5',
    B: 'text-green-400 border-green-500/30 bg-green-500/5',
    C: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5',
    D: 'text-orange-400 border-orange-500/30 bg-orange-500/5',
    F: 'text-red-400 border-red-500/30 bg-red-500/5',
  };

  return (
    <div className="min-h-screen px-6 pt-20 pb-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pitch Score</h1>
            <p className="text-sm text-zinc-500">{deck.step1.companyName}</p>
          </div>
          <div className="flex gap-3">
            <Link href={`/deck/${id}`} className="rounded-xl border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500">
              View Deck
            </Link>
            <Link href="/create" className="rounded-xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400">
              Improve Deck
            </Link>
          </div>
        </div>

        {/* Grade + Overall */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8"
        >
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
            <div className="flex items-center gap-6">
              <div className={`flex h-24 w-24 items-center justify-center rounded-2xl border-2 text-5xl font-black ${gradeColors[scores.grade]}`}>
                {scores.grade}
              </div>
              <CircularScore score={scores.overall} label="Overall Score" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold">{scores.summary}</p>
              <div className="mt-4 grid grid-cols-5 gap-3">
                {[
                  { label: 'Complete', value: scores.completeness },
                  { label: 'Clarity', value: scores.clarity },
                  { label: 'Market', value: scores.marketFit },
                  { label: 'Finance', value: scores.financials },
                  { label: 'Story', value: scores.storytelling },
                ].map((m) => (
                  <div key={m.label} className="text-center">
                    <p className="text-lg font-bold text-zinc-200">{m.value}%</p>
                    <p className="text-[10px] text-zinc-500">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold">Category Breakdown</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {scores.categories.map((cat, i) => (
              <BarScore key={cat.name} {...cat} delay={i * 0.1} />
            ))}
          </div>
        </div>

        {/* Improvement Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8"
        >
          <h2 className="mb-4 text-lg font-bold">How to Improve</h2>
          <div className="space-y-3">
            {scores.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-400">
                  {i + 1}
                </div>
                <p className="text-sm text-zinc-300">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Investor Readiness Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8"
        >
          <h2 className="mb-4 text-lg font-bold">Investor Readiness Checklist</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {[
              { label: 'Company name & tagline', check: !!deck.step1.companyName && !!deck.step1.oneLiner },
              { label: 'Clear problem statement', check: deck.step2.problem.split(/\s+/).length >= 15 },
              { label: 'Differentiated solution', check: !!deck.step2.uniqueAdvantage.trim() },
              { label: 'Target market defined', check: !!deck.step3.targetCustomer.trim() },
              { label: 'Competitors identified', check: deck.step3.competitors.split('\n').filter(Boolean).length >= 2 },
              { label: 'Revenue model specified', check: !!deck.step4.revenueModel },
              { label: 'Pricing strategy', check: !!deck.step4.pricing.trim() },
              { label: 'Team information', check: !!deck.step5.teamSize },
              { label: 'Traction metrics', check: (parseFloat(deck.step5.revenue) || 0) > 0 || (parseFloat(deck.step5.users) || 0) > 0 },
              { label: 'Clear funding ask', check: !!deck.step5.fundingAsk.trim() },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-lg p-2">
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${item.check ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-800 text-zinc-600'}`}>
                  {item.check ? (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-[10px]">—</span>
                  )}
                </div>
                <span className={`text-sm ${item.check ? 'text-zinc-200' : 'text-zinc-500'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
