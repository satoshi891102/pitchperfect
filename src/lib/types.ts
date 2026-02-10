export interface DeckData {
  id: string;
  createdAt: string;
  updatedAt: string;
  step1: {
    companyName: string;
    oneLiner: string;
    industry: string;
    stage: string;
  };
  step2: {
    problem: string;
    solution: string;
    uniqueAdvantage: string;
  };
  step3: {
    targetCustomer: string;
    marketSize: string;
    competitors: string;
  };
  step4: {
    revenueModel: string;
    pricing: string;
    channels: string;
  };
  step5: {
    teamSize: string;
    revenue: string;
    users: string;
    fundingRaised: string;
    fundingAsk: string;
  };
}

export const INDUSTRIES: Record<string, number> = {
  'SaaS': 195000000000,
  'Fintech': 310000000000,
  'Healthcare': 500000000000,
  'E-commerce': 6300000000000,
  'EdTech': 400000000000,
  'AI / ML': 200000000000,
  'Cybersecurity': 180000000000,
  'Climate Tech': 130000000000,
  'Real Estate Tech': 90000000000,
  'Gaming': 220000000000,
  'Social Media': 150000000000,
  'Logistics': 120000000000,
  'Food & Beverage': 300000000000,
  'Other': 100000000000,
};

export const STAGES = ['Pre-seed', 'Seed', 'Series A', 'Growth'];

export const REVENUE_MODELS = [
  'Subscription',
  'Marketplace / Commission',
  'Freemium',
  'Transaction Fee',
  'Advertising',
  'Licensing',
  'Usage-based',
  'One-time Purchase',
];

export function getGrowthRate(stage: string): number {
  switch (stage) {
    case 'Pre-seed': return 3;
    case 'Seed': return 2.5;
    case 'Series A': return 2;
    case 'Growth': return 1.5;
    default: return 2;
  }
}

export function formatCurrency(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}
