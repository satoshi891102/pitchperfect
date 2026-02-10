'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const features = [
  { title: 'Smart Input Wizard', desc: 'Answer 5 simple steps about your business. We handle the rest.', icon: '1' },
  { title: 'Instant Deck Generation', desc: 'Get a 10+ slide pitch deck with financials, market sizing, and competitive positioning.', icon: '2' },
  { title: 'Charts & Projections', desc: 'TAM/SAM/SOM analysis, 5-year revenue projections, and competition matrices — auto-generated.', icon: '3' },
  { title: 'Export & Share', desc: 'Download as PDF or share a live link with investors. One click.', icon: '4' },
];

const testimonials = [
  { name: 'Sarah K.', role: 'Founder, NovaPay', quote: 'Built my Series A deck in 20 minutes. The financial projections alone saved me a week of spreadsheet work.' },
  { name: 'Marcus T.', role: 'CEO, GreenGrid', quote: 'The competitive positioning chart immediately made our differentiation clear. Investors noticed.' },
  { name: 'Priya R.', role: 'Co-founder, EduFlow', quote: 'We used to pay consultants $5K for pitch decks. PitchPerfect gave us a better one for free.' },
];

export default function LandingPage() {
  const [ctaEmail, setCtaEmail] = useState('');
  const [ctaSubmitted, setCtaSubmitted] = useState(false);

  const handleCta = () => {
    if (!ctaEmail.includes('@')) return;
    const existing = JSON.parse(localStorage.getItem('pp_waitlist') || '[]');
    existing.push({ email: ctaEmail, date: new Date().toISOString(), source: 'landing' });
    localStorage.setItem('pp_waitlist', JSON.stringify(existing));
    setCtaSubmitted(true);
  };

  return (
    <div className="pt-14">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,211,238,0.08)_0%,_transparent_70%)]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-cyan-400">For Founders</p>
          <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Turn your idea into a{' '}
            <span className="gradient-text">pitch deck</span> in minutes
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
            Answer a few questions about your business. Get a professional, investor-ready pitch deck with financial projections, market analysis, and more.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/create"
              className="rounded-xl bg-cyan-500 px-8 py-3 text-base font-semibold text-zinc-950 transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              Start for Free
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-zinc-700 px-8 py-3 text-base font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <motion.div {...fade} className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How it works</h2>
          <p className="mt-3 text-zinc-400">From idea to investor-ready deck in four steps</p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-sm font-bold text-cyan-400">
                {f.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-t border-zinc-800/50 bg-zinc-900/30 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade} className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Founders love PitchPerfect</h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
              >
                <p className="mb-4 text-sm leading-relaxed text-zinc-300">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <motion.div {...fade} className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simple pricing</h2>
          <p className="mt-3 text-zinc-400">Start free. Upgrade when you need more.</p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Free', price: '$0', period: '/forever', features: ['3 pitch decks', 'Basic templates', 'PDF export'], cta: 'Get Started', primary: false },
            { name: 'Pro', price: '$29', period: '/month', features: ['Unlimited decks', 'Custom branding', 'AI suggestions', 'PPTX export'], cta: 'Upgrade to Pro', primary: true },
            { name: 'Enterprise', price: '$99', period: '/month', features: ['Everything in Pro', 'Team collaboration', 'Analytics dashboard', 'White-label'], cta: 'Contact Sales', primary: false },
          ].map((plan) => (
            <motion.div
              key={plan.name}
              {...fade}
              className={`rounded-2xl border p-8 ${plan.primary ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-zinc-800 bg-zinc-900/50'}`}
            >
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="text-cyan-400">--</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.primary ? '/create' : '/pricing'}
                className={`mt-8 block w-full rounded-xl py-2.5 text-center text-sm font-medium transition ${
                  plan.primary
                    ? 'bg-cyan-500 text-zinc-950 hover:bg-cyan-400'
                    : 'border border-zinc-700 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-zinc-800/50 bg-zinc-900/30 px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div {...fade}>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ready to pitch with confidence?</h2>
            <p className="mt-4 text-zinc-400">Join 500+ founders already building investor-ready pitch decks.</p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {ctaSubmitted ? (
                <p className="text-cyan-400 font-semibold">You are on the list. We will be in touch.</p>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={ctaEmail}
                    onChange={(e) => setCtaEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCta()}
                    className="w-full max-w-xs rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-cyan-500 sm:w-auto"
                  />
                  <button onClick={handleCta} className="rounded-xl bg-cyan-500 px-8 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400">
                    Get Early Access
                  </button>
                </>
              )}
            </div>
            <p className="mt-4 text-xs text-zinc-600">Free forever. No credit card required.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-zinc-500">PitchPerfect. Built for founders.</p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/pricing" className="transition hover:text-zinc-300">Pricing</Link>
            <Link href="/dashboard" className="transition hover:text-zinc-300">Dashboard</Link>
            <Link href="/create" className="transition hover:text-zinc-300">Create</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
