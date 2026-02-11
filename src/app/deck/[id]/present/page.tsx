'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DeckData, INDUSTRIES, getGrowthRate, formatCurrency } from '@/lib/types';
import { getDeck } from '@/lib/storage';

function PresentSlide({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-8 md:p-16">
      <div className="w-full max-w-4xl">{children}</div>
    </div>
  );
}

export default function PresentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [slide, setSlide] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const d = getDeck(id as string);
    if (!d) router.push('/dashboard');
    else setDeck(d);
  }, [id, router]);

  // Hide controls after inactivity
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleMove = () => {
      setShowControls(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener('mousemove', handleMove);
    timer = setTimeout(() => setShowControls(false), 3000);
    return () => { window.removeEventListener('mousemove', handleMove); clearTimeout(timer); };
  }, []);

  const totalSlides = 11;

  const goNext = useCallback(() => {
    setDirection(1);
    setSlide((s) => Math.min(totalSlides - 1, s + 1));
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setSlide((s) => Math.max(0, s - 1));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft' || e.key === 'Backspace') { e.preventDefault(); goPrev(); }
      else if (e.key === 'Escape') { router.push(`/deck/${id}`); }
      else if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, router, id]);

  if (!deck) return null;

  const tam = INDUSTRIES[deck.step1.industry] || 100000000000;
  const sam = tam * 0.1;
  const som = sam * 0.01;
  const growthRate = getGrowthRate(deck.step1.stage);
  const rawRevenue = parseFloat(deck.step5.revenue) || 0;
  const users = parseFloat(deck.step5.users) || 0;
  const baseRevenue = rawRevenue > 0 ? rawRevenue : (users > 0 ? users * 120 : 10000);
  const fundingAsk = parseFloat(deck.step5.fundingAsk) || 500000;
  const competitors = deck.step3.competitors.split('\n').filter(Boolean).slice(0, 4);

  const slideNames = ['Cover', 'Problem', 'Solution', 'Market', 'Business Model', 'Traction', 'Competition', 'Go-to-Market', 'Financials', 'Team', 'The Ask'];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
  };

  const slideContent = [
    // 0: Cover
    <PresentSlide key="cover">
      <div className="text-center">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-violet-500 text-5xl font-bold text-white shadow-2xl shadow-cyan-500/20">
          {(deck.step1.companyName || 'P')[0]}
        </motion.div>
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">{deck.step1.companyName}</h1>
        <p className="mx-auto mt-6 max-w-xl text-xl text-zinc-400 md:text-2xl">{deck.step1.oneLiner}</p>
        <div className="mt-8 flex justify-center gap-4">
          <span className="rounded-full border border-zinc-700 px-5 py-2 text-sm text-zinc-400">{deck.step1.industry}</span>
          <span className="rounded-full border border-zinc-700 px-5 py-2 text-sm text-zinc-400">{deck.step1.stage}</span>
        </div>
      </div>
    </PresentSlide>,

    // 1: Problem
    <PresentSlide key="problem">
      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-red-400">The Problem</h2>
        <p className="text-3xl font-medium leading-relaxed text-zinc-100 md:text-4xl">{deck.step2.problem || 'Problem description goes here.'}</p>
      </div>
    </PresentSlide>,

    // 2: Solution
    <PresentSlide key="solution">
      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">Our Solution</h2>
        <p className="text-3xl font-medium leading-relaxed text-zinc-100 md:text-4xl">{deck.step2.solution || 'Solution description goes here.'}</p>
        {deck.step2.uniqueAdvantage && (
          <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 md:p-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-cyan-400">Why Us</p>
            <p className="text-xl text-zinc-200">{deck.step2.uniqueAdvantage}</p>
          </div>
        )}
      </div>
    </PresentSlide>,

    // 3: Market
    <PresentSlide key="market">
      <div>
        <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-cyan-400">Market Opportunity</h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            { label: 'TAM', value: tam, desc: 'Total Addressable Market' },
            { label: 'SAM', value: sam, desc: 'Serviceable Addressable Market' },
            { label: 'SOM', value: som, desc: 'Serviceable Obtainable Market' },
          ].map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.2 }} className="text-center">
              <p className="text-5xl font-bold md:text-6xl" style={{ color: ['#22d3ee', '#8b5cf6', '#3b82f6'][i] }}>{formatCurrency(m.value)}</p>
              <p className="mt-2 text-xl font-semibold text-zinc-300">{m.label}</p>
              <p className="mt-1 text-sm text-zinc-500">{m.desc}</p>
            </motion.div>
          ))}
        </div>
        {deck.step3.targetCustomer && (
          <p className="mt-10 text-center text-lg text-zinc-400">Target: {deck.step3.targetCustomer}</p>
        )}
      </div>
    </PresentSlide>,

    // 4: Business Model
    <PresentSlide key="model">
      <div>
        <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-cyan-400">Business Model</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: 'Revenue Model', value: deck.step4.revenueModel, icon: '💰' },
            { label: 'Pricing', value: deck.step4.pricing, icon: '🏷️' },
            { label: 'Distribution', value: deck.step4.channels, icon: '📣' },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
              <p className="mb-3 text-3xl">{item.icon}</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{item.label}</p>
              <p className="mt-3 text-xl font-semibold">{item.value || 'TBD'}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </PresentSlide>,

    // 5: Traction
    <PresentSlide key="traction">
      <div>
        <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-cyan-400">Traction</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { label: 'Revenue', value: rawRevenue > 0 ? `$${rawRevenue.toLocaleString()}` : '$0', sub: 'Annual', color: '#22d3ee' },
            { label: 'Users', value: users > 0 ? users.toLocaleString() : '0', sub: 'Active', color: '#8b5cf6' },
            { label: 'Raised', value: deck.step5.fundingRaised ? `$${parseInt(deck.step5.fundingRaised).toLocaleString()}` : '$0', sub: 'To Date', color: '#3b82f6' },
          ].map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.15 }} className="text-center">
              <p className="text-5xl font-bold md:text-6xl" style={{ color: m.color }}>{m.value}</p>
              <p className="mt-2 text-lg font-semibold text-zinc-300">{m.label}</p>
              <p className="text-sm text-zinc-500">{m.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </PresentSlide>,

    // 6: Competition
    <PresentSlide key="competition">
      <div>
        <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-cyan-400">Competitive Landscape</h2>
        <div className="space-y-4">
          {competitors.map((c, i) => (
            <motion.div key={c} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-sm font-bold text-violet-400">{c.trim()[0]}</div>
              <span className="text-xl">{c.trim()}</span>
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + competitors.length * 0.1 }} className="flex items-center gap-4 rounded-xl border-2 border-cyan-500/30 bg-cyan-500/5 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-sm font-bold text-cyan-400">{(deck.step1.companyName || 'Y')[0]}</div>
            <div>
              <span className="text-xl font-bold text-cyan-400">{deck.step1.companyName || 'You'}</span>
              <span className="ml-3 text-zinc-500">← That is us</span>
            </div>
          </motion.div>
        </div>
      </div>
    </PresentSlide>,

    // 7: Go-to-Market
    <PresentSlide key="gtm">
      <div>
        <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-cyan-400">Go-to-Market</h2>
        <div className="space-y-6">
          {(deck.step4.channels || 'Direct Sales, Content Marketing, Partnerships').split(',').map((ch, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.2 }} className="flex items-center gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 md:p-8">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-2xl font-bold text-cyan-400">
                {i + 1}
              </div>
              <div>
                <p className="text-2xl font-semibold">{ch.trim()}</p>
                <p className="mt-1 text-zinc-500">Reaching {deck.step3.targetCustomer || 'customers'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PresentSlide>,

    // 8: Financials
    <PresentSlide key="financials">
      <div>
        <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-cyan-400">5-Year Revenue Projection</h2>
        <div className="flex items-end justify-center gap-6 md:gap-10">
          {Array.from({ length: 5 }, (_, i) => {
            const rev = i === 0 ? baseRevenue : Math.round(baseRevenue * Math.pow(growthRate, i));
            const maxRev = Math.round(baseRevenue * Math.pow(growthRate, 4));
            const heightPct = Math.max(10, (rev / maxRev) * 100);
            return (
              <motion.div
                key={i}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${heightPct * 2.5}px`, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <p className="mb-2 text-sm font-bold text-cyan-400">{formatCurrency(rev)}</p>
                <div
                  className="w-16 rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 md:w-20"
                  style={{ height: `${heightPct * 2.5}px` }}
                />
                <p className="mt-2 text-sm text-zinc-500">Y{i + 1}</p>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-zinc-500">{growthRate}x annual growth rate ({deck.step1.stage} stage)</p>
      </div>
    </PresentSlide>,

    // 9: Team
    <PresentSlide key="team">
      <div className="text-center">
        <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-cyan-400">The Team</h2>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-5xl font-bold text-white shadow-2xl shadow-cyan-500/20">
            {deck.step5.teamSize || '?'}
          </div>
          <p className="mt-6 text-4xl font-bold">{deck.step5.teamSize || '?'} people</p>
          <p className="mt-3 text-xl text-zinc-400">Building {deck.step1.companyName}</p>
        </motion.div>
      </div>
    </PresentSlide>,

    // 10: The Ask
    <PresentSlide key="ask">
      <div className="text-center">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">The Ask</h2>
        <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="text-6xl font-bold gradient-text md:text-8xl">
          {formatCurrency(fundingAsk)}
        </motion.p>
        <p className="mt-4 text-xl text-zinc-400">Raising to accelerate growth</p>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-4 gap-4">
          {[
            { name: 'Product', pct: 40, color: '#22d3ee' },
            { name: 'Sales', pct: 30, color: '#8b5cf6' },
            { name: 'Ops', pct: 15, color: '#3b82f6' },
            { name: 'Reserve', pct: 15, color: '#6366f1' },
          ].map((f, i) => (
            <motion.div key={f.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="text-center">
              <div className="mx-auto mb-2 h-2 w-full rounded-full" style={{ backgroundColor: f.color }} />
              <p className="text-lg font-bold" style={{ color: f.color }}>{f.pct}%</p>
              <p className="text-sm text-zinc-500">{f.name}</p>
              <p className="text-xs text-zinc-600">{formatCurrency(Math.round(fundingAsk * f.pct / 100))}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
          <p className="text-lg font-medium text-zinc-300">Let&apos;s build the future of {deck.step1.industry || 'technology'} together.</p>
          <p className="mt-2 text-zinc-500">{deck.step1.companyName} — {deck.step1.oneLiner}</p>
        </div>
      </div>
    </PresentSlide>,
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950" style={{ cursor: showControls ? 'default' : 'none' }}>
      {/* Slide Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-full w-full"
        >
          {slideContent[slide]}
        </motion.div>
      </AnimatePresence>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-0 z-[110]">
            {/* Top bar */}
            <div className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-zinc-950/80 to-transparent px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push(`/deck/${id}`)}
                  className="rounded-lg bg-zinc-800/80 px-4 py-2 text-xs font-medium text-zinc-300 backdrop-blur-sm transition hover:bg-zinc-700"
                >
                  ESC Exit
                </button>
                <span className="text-sm text-zinc-500">{deck.step1.companyName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-zinc-400">{slide + 1} / {totalSlides}</span>
                <button
                  onClick={() => {
                    if (document.fullscreenElement) document.exitFullscreen();
                    else document.documentElement.requestFullscreen();
                  }}
                  className="rounded-lg bg-zinc-800/80 px-4 py-2 text-xs font-medium text-zinc-300 backdrop-blur-sm transition hover:bg-zinc-700"
                >
                  F Fullscreen
                </button>
              </div>
            </div>

            {/* Bottom progress */}
            <div className="pointer-events-auto absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/80 to-transparent px-6 py-4">
              <div className="flex items-center gap-2">
                {slideNames.map((name, i) => (
                  <button
                    key={name}
                    onClick={() => { setDirection(i > slide ? 1 : -1); setSlide(i); }}
                    className="group relative flex-1"
                  >
                    <div className={`h-1 rounded-full transition ${i <= slide ? 'bg-cyan-500' : 'bg-zinc-800'}`} />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 opacity-0 transition group-hover:opacity-100">
                      {name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Side navigation */}
            {slide > 0 && (
              <button
                onClick={goPrev}
                className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-zinc-800/60 p-3 text-zinc-400 backdrop-blur-sm transition hover:bg-zinc-700 hover:text-zinc-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            {slide < totalSlides - 1 && (
              <button
                onClick={goNext}
                className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-zinc-800/60 p-3 text-zinc-400 backdrop-blur-sm transition hover:bg-zinc-700 hover:text-zinc-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
