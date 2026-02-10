'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/forever',
    desc: 'Perfect for trying out PitchPerfect',
    features: ['3 pitch decks', 'Basic templates', 'PDF export', 'Share links'],
    cta: 'Get Started',
    primary: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    desc: 'For serious founders raising capital',
    features: ['Unlimited decks', 'Custom branding', 'AI-powered suggestions', 'PPTX export', 'Priority support', 'Analytics'],
    cta: 'Upgrade to Pro',
    primary: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    desc: 'For accelerators and VC firms',
    features: ['Everything in Pro', 'Team collaboration', 'Analytics dashboard', 'White-label option', 'Custom integrations', 'Dedicated support'],
    cta: 'Contact Sales',
    primary: false,
  },
];

const faqs = [
  { q: 'Can I really create a pitch deck for free?', a: 'Yes. The free plan gives you 3 complete pitch decks with all 10+ slides, charts, and PDF export. No credit card required.' },
  { q: 'How does the AI generate my deck?', a: 'You answer 5 simple steps about your business. Our engine calculates financial projections, market sizing (TAM/SAM/SOM), and competitive positioning automatically based on your inputs and industry data.' },
  { q: 'Can I edit the generated deck?', a: 'You can re-run the wizard with updated inputs at any time. Pro users will get inline editing capabilities soon.' },
  { q: 'What format can I export in?', a: 'Free users can export as PDF and share via link. Pro users will also get PPTX (PowerPoint) export.' },
  { q: 'Do you store my data?', a: 'All data is stored locally in your browser. We do not send your business information to any server.' },
  { q: 'Can I cancel anytime?', a: 'Yes. No contracts, no lock-in. Cancel your subscription at any time.' },
];

export default function PricingPage() {
  const [showModal, setShowModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = () => {
    if (!email.includes('@')) return;
    const existing = JSON.parse(localStorage.getItem('pp_waitlist') || '[]');
    existing.push({ email, date: new Date().toISOString() });
    localStorage.setItem('pp_waitlist', JSON.stringify(existing));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen px-6 pt-28 pb-20">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-zinc-400">Start free. Upgrade when you need more.</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-8 ${
                plan.primary ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-zinc-800 bg-zinc-900/50'
              }`}
            >
              {plan.primary && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan-500 px-4 py-0.5 text-xs font-semibold text-zinc-950">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-zinc-500">{plan.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                    <svg className="h-4 w-4 shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => plan.name === 'Free' ? window.location.href = '/create' : setShowModal(true)}
                className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition ${
                  plan.primary
                    ? 'bg-cyan-500 text-zinc-950 hover:bg-cyan-400'
                    : 'border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24">
          <h2 className="mb-10 text-center text-3xl font-bold">Frequently asked questions</h2>
          <div className="mx-auto max-w-2xl space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/50">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-medium"
                >
                  {faq.q}
                  <span className="ml-4 text-zinc-500">{openFaq === i ? '-' : '+'}</span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="mx-4 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {submitted ? (
                <>
                  <div className="mb-4 text-4xl">✓</div>
                  <h3 className="text-xl font-bold">You are on the list</h3>
                  <p className="mt-3 text-sm text-zinc-400">
                    We will notify you as soon as Pro launches. Meanwhile, start building decks for free.
                  </p>
                  <div className="mt-6">
                    <Link href="/create" className="inline-block rounded-xl bg-cyan-500 px-8 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400">
                      Start Free
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold">Get Early Access to Pro</h3>
                  <p className="mt-3 text-sm text-zinc-400">
                    Join the waitlist and be the first to unlock unlimited decks, custom branding, and AI-powered suggestions.
                  </p>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleWaitlist()}
                    className="mt-6 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-cyan-500"
                  />
                  <div className="mt-4 flex gap-3">
                    <button onClick={handleWaitlist} className="flex-1 rounded-xl bg-cyan-500 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400">
                      Join Waitlist
                    </button>
                    <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-zinc-700 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-500">
                      Maybe Later
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
