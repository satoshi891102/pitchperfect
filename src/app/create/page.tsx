'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DeckData, INDUSTRIES, STAGES, REVENUE_MODELS } from '@/lib/types';
import { saveDeck, saveDraft, getDraft, clearDraft, getDeck } from '@/lib/storage';

const emptyDeck: Omit<DeckData, 'id' | 'createdAt' | 'updatedAt'> = {
  step1: { companyName: '', oneLiner: '', industry: '', stage: '' },
  step2: { problem: '', solution: '', uniqueAdvantage: '' },
  step3: { targetCustomer: '', marketSize: '', competitors: '' },
  step4: { revenueModel: '', pricing: '', channels: '' },
  step5: { teamSize: '', revenue: '', users: '', fundingRaised: '', fundingAsk: '' },
};

const steps = ['Business Basics', 'Problem & Solution', 'Market', 'Business Model', 'Team & Traction'];

export default function CreatePageWrapper() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center pt-14 text-zinc-500">Loading...</div>}>
      <CreatePage />
    </Suspense>
  );
}

function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const [step, setStep] = useState(0);
  const [data, setData] = useState(emptyDeck);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // If editing an existing deck, load it
    if (editId) {
      const existing = getDeck(editId);
      if (existing) {
        const { id, createdAt, updatedAt, ...rest } = existing;
        setData(rest as typeof emptyDeck);
        setIsEditing(true);
        return;
      }
    }
    // Otherwise check for draft
    const draft = getDraft();
    if (draft && draft.step1) setData(draft as typeof emptyDeck);
  }, [editId]);

  useEffect(() => {
    saveDraft(data as Partial<DeckData>);
  }, [data]);

  function update(stepKey: string, field: string, value: string) {
    setData((prev) => ({ ...prev, [stepKey]: { ...(prev as any)[stepKey], [field]: value } }));
  }

  function next() {
    if (step < 4) setStep(step + 1);
    else generate();
  }

  function generate() {
    const id = isEditing && editId ? editId : crypto.randomUUID();
    const now = new Date().toISOString();
    const deck: DeckData = {
      ...data,
      id,
      createdAt: isEditing ? (getDeck(id)?.createdAt || now) : now,
      updatedAt: now,
    };
    saveDeck(deck);
    clearDraft();
    router.push(`/deck/${id}`);
  }

  const inputClass =
    'w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30';
  const selectClass = inputClass + ' appearance-none';
  const labelClass = 'mb-1.5 block text-sm font-medium text-zinc-300';

  return (
    <div className="flex min-h-screen items-start justify-center px-6 pt-28 pb-20">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-10">
          <div className="mb-3 flex justify-between text-xs text-zinc-500">
            {steps.map((s, i) => (
              <span key={s} className={i <= step ? 'text-cyan-400' : ''}>{s}</span>
            ))}
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
              animate={{ width: `${((step + 1) / 5) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">Business Basics</h2>
                <p className="text-sm text-zinc-400">Tell us about your company</p>
                <div>
                  <label className={labelClass}>Company Name</label>
                  <input className={inputClass} placeholder="Acme Inc." value={data.step1.companyName} onChange={(e) => update('step1', 'companyName', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>One-liner</label>
                  <input className={inputClass} placeholder="We help X do Y with Z" value={data.step1.oneLiner} onChange={(e) => update('step1', 'oneLiner', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Industry</label>
                  <select className={selectClass} value={data.step1.industry} onChange={(e) => update('step1', 'industry', e.target.value)}>
                    <option value="">Select industry</option>
                    {Object.keys(INDUSTRIES).map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Stage</label>
                  <select className={selectClass} value={data.step1.stage} onChange={(e) => update('step1', 'stage', e.target.value)}>
                    <option value="">Select stage</option>
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">Problem & Solution</h2>
                <p className="text-sm text-zinc-400">What problem are you solving and how?</p>
                <div>
                  <label className={labelClass}>The Problem</label>
                  <textarea className={inputClass + ' min-h-[100px] resize-none'} placeholder="Describe the problem your customers face..." value={data.step2.problem} onChange={(e) => update('step2', 'problem', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Your Solution</label>
                  <textarea className={inputClass + ' min-h-[100px] resize-none'} placeholder="How do you solve this problem?" value={data.step2.solution} onChange={(e) => update('step2', 'solution', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Unique Advantage</label>
                  <input className={inputClass} placeholder="What makes you different?" value={data.step2.uniqueAdvantage} onChange={(e) => update('step2', 'uniqueAdvantage', e.target.value)} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">Market</h2>
                <p className="text-sm text-zinc-400">Who is your customer and how big is the opportunity?</p>
                <div>
                  <label className={labelClass}>Target Customer</label>
                  <input className={inputClass} placeholder="e.g. SMB SaaS founders" value={data.step3.targetCustomer} onChange={(e) => update('step3', 'targetCustomer', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Estimated Market Size (optional)</label>
                  <input className={inputClass} placeholder="e.g. $5B or leave blank for auto-estimate" value={data.step3.marketSize} onChange={(e) => update('step3', 'marketSize', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Key Competitors</label>
                  <textarea className={inputClass + ' min-h-[80px] resize-none'} placeholder="List 2-4 competitors, one per line" value={data.step3.competitors} onChange={(e) => update('step3', 'competitors', e.target.value)} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">Business Model</h2>
                <p className="text-sm text-zinc-400">How do you make money?</p>
                <div>
                  <label className={labelClass}>Revenue Model</label>
                  <select className={selectClass} value={data.step4.revenueModel} onChange={(e) => update('step4', 'revenueModel', e.target.value)}>
                    <option value="">Select model</option>
                    {REVENUE_MODELS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Pricing</label>
                  <input className={inputClass} placeholder="e.g. $29/mo per user" value={data.step4.pricing} onChange={(e) => update('step4', 'pricing', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Distribution Channels</label>
                  <input className={inputClass} placeholder="e.g. Direct sales, Content marketing, Partnerships" value={data.step4.channels} onChange={(e) => update('step4', 'channels', e.target.value)} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">Team & Traction</h2>
                <p className="text-sm text-zinc-400">Show us where you are</p>
                <div>
                  <label className={labelClass}>Team Size</label>
                  <input className={inputClass} placeholder="e.g. 3" value={data.step5.teamSize} onChange={(e) => update('step5', 'teamSize', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Current Annual Revenue</label>
                  <input className={inputClass} placeholder="e.g. 50000 (or 0)" value={data.step5.revenue} onChange={(e) => update('step5', 'revenue', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Number of Users</label>
                  <input className={inputClass} placeholder="e.g. 500" value={data.step5.users} onChange={(e) => update('step5', 'users', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Funding Raised to Date</label>
                  <input className={inputClass} placeholder="e.g. 250000" value={data.step5.fundingRaised} onChange={(e) => update('step5', 'fundingRaised', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Funding Ask</label>
                  <input className={inputClass} placeholder="e.g. 1000000" value={data.step5.fundingAsk} onChange={(e) => update('step5', 'fundingAsk', e.target.value)} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="rounded-xl border border-zinc-800 px-6 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-30"
          >
            Back
          </button>
          <button
            onClick={next}
            className="rounded-xl bg-cyan-500 px-8 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
          >
            {step === 4 ? 'Generate Deck' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
