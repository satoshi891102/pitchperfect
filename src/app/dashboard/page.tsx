'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DeckData } from '@/lib/types';
import { getAllDecks, deleteDeck } from '@/lib/storage';
import { scoreDeck } from '@/lib/scoring';

function MiniScore({ score, grade }: { score: number; grade: string }) {
  const color = score >= 80 ? '#22d3ee' : score >= 60 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8">
        <svg width={32} height={32} className="-rotate-90">
          <circle cx={16} cy={16} r={12} fill="none" stroke="#27272a" strokeWidth={3} />
          <circle
            cx={16} cy={16} r={12} fill="none" stroke={color} strokeWidth={3}
            strokeDasharray={75.4} strokeDashoffset={75.4 - (score / 100) * 75.4}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold" style={{ color }}>{grade}</span>
      </div>
      <span className="text-xs text-zinc-500">{score}/100</span>
    </div>
  );
}

export default function DashboardPage() {
  const [decks, setDecks] = useState<DeckData[]>([]);
  const [deckScores, setDeckScores] = useState<Record<string, { overall: number; grade: string }>>({});

  useEffect(() => {
    const all = getAllDecks();
    setDecks(all);
    const scores: Record<string, { overall: number; grade: string }> = {};
    all.forEach((d) => {
      const s = scoreDeck(d);
      scores[d.id] = { overall: s.overall, grade: s.grade };
    });
    setDeckScores(scores);
  }, []);

  function handleDelete(id: string) {
    deleteDeck(id);
    const all = getAllDecks();
    setDecks(all);
  }

  return (
    <div className="min-h-screen px-6 pt-28 pb-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Decks</h1>
            <p className="mt-1 text-sm text-zinc-500">{decks.length} deck{decks.length !== 1 ? 's' : ''} created</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/templates"
              className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
            >
              Browse Templates
            </Link>
            <Link
              href="/create"
              className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
            >
              Create New
            </Link>
          </div>
        </div>

        {decks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 py-20"
          >
            <div className="mb-4 text-5xl opacity-30">📊</div>
            <p className="text-lg font-medium text-zinc-400">No decks yet</p>
            <p className="mt-2 text-sm text-zinc-600">Create your first pitch deck or start from a template</p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/templates"
                className="rounded-xl border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
              >
                Browse Templates
              </Link>
              <Link
                href="/create"
                className="rounded-xl bg-cyan-500 px-8 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
              >
                Create Deck
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {decks.map((deck, i) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700"
              >
                <div className="flex items-center justify-between">
                  <Link href={`/deck/${deck.id}`} className="flex flex-1 items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-lg font-bold text-cyan-400">
                      {(deck.step1.companyName || 'D')[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{deck.step1.companyName || 'Untitled Deck'}</p>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span>{deck.step1.industry}</span>
                        <span>{deck.step1.stage}</span>
                        <span>Edited {new Date(deck.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {deckScores[deck.id] && (
                      <MiniScore score={deckScores[deck.id].overall} grade={deckScores[deck.id].grade} />
                    )}
                  </Link>
                  <div className="ml-4 flex items-center gap-2">
                    <Link
                      href={`/create?edit=${deck.id}`}
                      className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 opacity-0 transition hover:border-zinc-600 group-hover:opacity-100"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/deck/${deck.id}/score`}
                      className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-amber-400 opacity-0 transition hover:border-amber-500/50 group-hover:opacity-100"
                    >
                      Score
                    </Link>
                    <Link
                      href={`/deck/${deck.id}/present`}
                      className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-violet-400 opacity-0 transition hover:border-violet-500/50 group-hover:opacity-100"
                    >
                      Present
                    </Link>
                    <Link
                      href={`/deck/${deck.id}/export`}
                      className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 opacity-0 transition hover:border-zinc-600 group-hover:opacity-100"
                    >
                      Export
                    </Link>
                    <button
                      onClick={() => handleDelete(deck.id)}
                      className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-red-400 opacity-0 transition hover:border-red-500/50 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {decks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            {[
              { label: 'Total Decks', value: decks.length.toString() },
              { label: 'Avg Score', value: Object.values(deckScores).length > 0 ? Math.round(Object.values(deckScores).reduce((s, d) => s + d.overall, 0) / Object.values(deckScores).length).toString() : '—' },
              { label: 'Best Grade', value: Object.values(deckScores).length > 0 ? Object.values(deckScores).sort((a, b) => b.overall - a.overall)[0]?.grade || '—' : '—' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 text-center">
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
