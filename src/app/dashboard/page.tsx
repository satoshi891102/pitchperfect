'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DeckData } from '@/lib/types';
import { getAllDecks, deleteDeck } from '@/lib/storage';

export default function DashboardPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<DeckData[]>([]);

  useEffect(() => {
    setDecks(getAllDecks());
  }, []);

  function handleDelete(id: string) {
    deleteDeck(id);
    setDecks(getAllDecks());
  }

  return (
    <div className="min-h-screen px-6 pt-28 pb-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Decks</h1>
            <p className="mt-1 text-sm text-zinc-500">{decks.length} deck{decks.length !== 1 ? 's' : ''} created</p>
          </div>
          <Link
            href="/create"
            className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
          >
            Create New
          </Link>
        </div>

        {decks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 py-20"
          >
            <p className="text-lg font-medium text-zinc-400">No decks yet</p>
            <p className="mt-2 text-sm text-zinc-600">Create your first pitch deck to get started</p>
            <Link
              href="/create"
              className="mt-6 rounded-xl bg-cyan-500 px-8 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
            >
              Create Deck
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {decks.map((deck, i) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700"
              >
                <Link href={`/deck/${deck.id}`} className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-sm font-bold text-cyan-400">
                      {(deck.step1.companyName || 'D')[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{deck.step1.companyName || 'Untitled Deck'}</p>
                      <div className="flex gap-3 text-xs text-zinc-500">
                        <span>{deck.step1.industry}</span>
                        <span>{deck.step1.stage}</span>
                        <span>Edited {new Date(deck.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
