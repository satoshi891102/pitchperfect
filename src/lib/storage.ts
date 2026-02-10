'use client';

import { DeckData } from './types';

const DECKS_KEY = 'pitchperfect_decks';
const DRAFT_KEY = 'pitchperfect_draft';

export function getAllDecks(): DeckData[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(DECKS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getDeck(id: string): DeckData | null {
  const decks = getAllDecks();
  return decks.find((d) => d.id === id) || null;
}

export function saveDeck(deck: DeckData): void {
  const decks = getAllDecks();
  const idx = decks.findIndex((d) => d.id === deck.id);
  deck.updatedAt = new Date().toISOString();
  if (idx >= 0) decks[idx] = deck;
  else decks.push(deck);
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
}

export function deleteDeck(id: string): void {
  const decks = getAllDecks().filter((d) => d.id !== id);
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
}

export function saveDraft(data: Partial<DeckData>): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
}

export function getDraft(): Partial<DeckData> | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(DRAFT_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}
