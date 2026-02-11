import { DeckData } from './types';

export interface DeckTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  data: Omit<DeckData, 'id' | 'createdAt' | 'updatedAt'>;
}

export const TEMPLATES: DeckTemplate[] = [
  {
    id: 'saas-b2b',
    name: 'B2B SaaS',
    category: 'Software',
    description: 'Classic B2B SaaS startup targeting SMBs with recurring revenue.',
    icon: '☁️',
    color: '#22d3ee',
    data: {
      step1: {
        companyName: 'CloudSync',
        oneLiner: 'We help SMBs automate their operations with AI-powered workflow tools',
        industry: 'SaaS',
        stage: 'Seed',
      },
      step2: {
        problem: 'Small and medium businesses waste 15+ hours per week on repetitive manual processes — data entry, invoice processing, report generation, and cross-platform syncing. This costs the average SMB $45,000 annually in lost productivity. Existing enterprise tools like SAP and Salesforce are too expensive and complex for teams under 50 people.',
        solution: 'CloudSync is an AI-powered operations platform that connects to your existing tools (QuickBooks, Slack, Gmail, Sheets) and automates repetitive workflows with zero code. Set up in 5 minutes, not 5 months.',
        uniqueAdvantage: 'Our proprietary AI engine learns from each company\'s unique patterns, getting smarter over time. Unlike Zapier (rules-based) or enterprise RPA (complex), we combine natural language setup with adaptive automation.',
      },
      step3: {
        targetCustomer: 'SMB operations managers and founders at 10-200 person companies, primarily in professional services, e-commerce, and healthcare.',
        marketSize: '$195B',
        competitors: 'Zapier\nMake (Integromat)\nMicrosoft Power Automate\nWorkato',
      },
      step4: {
        revenueModel: 'Subscription',
        pricing: '$49/mo (Starter), $149/mo (Pro), $399/mo (Business)',
        channels: 'Content marketing, Product-led growth, Partner integrations',
      },
      step5: {
        teamSize: '4',
        revenue: '85000',
        users: '340',
        fundingRaised: '250000',
        fundingAsk: '2000000',
      },
    },
  },
  {
    id: 'fintech-payments',
    name: 'Fintech Payments',
    category: 'Finance',
    description: 'Payment infrastructure targeting underserved markets.',
    icon: '💳',
    color: '#8b5cf6',
    data: {
      step1: {
        companyName: 'PayBridge',
        oneLiner: 'Cross-border payments for African businesses at 1/10th the cost',
        industry: 'Fintech',
        stage: 'Pre-seed',
      },
      step2: {
        problem: 'African businesses pay 7-12% in cross-border transaction fees through legacy banking rails, losing $5.2 billion annually. Settlement takes 3-5 business days. Freelancers and SMB exporters are hit hardest — Western Union and SWIFT were built for consumers and corporates, not the African middle market.',
        solution: 'PayBridge uses stablecoin rails (USDC on Solana) with local on/off ramps in 12 African markets. Businesses send and receive payments in seconds at 0.5% fees. No crypto knowledge needed — they see local currency in, local currency out.',
        uniqueAdvantage: 'Licensed in 4 African markets. Direct integrations with M-Pesa, MTN Money, and Flutterwave. Our compliance engine handles KYC/AML across jurisdictions automatically — this takes competitors 12+ months to build.',
      },
      step3: {
        targetCustomer: 'African SMB exporters/importers, freelancers receiving international payments, and diaspora remittance users. Starting with Nigeria, Kenya, South Africa, Ghana.',
        marketSize: '$310B',
        competitors: 'Chipper Cash\nFlutterwave\nWise (TransferWise)\nYellow Card',
      },
      step4: {
        revenueModel: 'Transaction Fee',
        pricing: '0.5% per transaction, $0.10 minimum, $50 cap',
        channels: 'Direct sales to trade associations, Partnership with accounting platforms, Referral program',
      },
      step5: {
        teamSize: '3',
        revenue: '12000',
        users: '180',
        fundingRaised: '50000',
        fundingAsk: '1500000',
      },
    },
  },
  {
    id: 'ai-ml',
    name: 'AI / Machine Learning',
    category: 'Technology',
    description: 'AI-first company with a proprietary model or dataset.',
    icon: '🧠',
    color: '#f97316',
    data: {
      step1: {
        companyName: 'Synthia',
        oneLiner: 'AI agents that handle customer support better than humans',
        industry: 'AI / ML',
        stage: 'Seed',
      },
      step2: {
        problem: 'Customer support costs enterprises $1.3 trillion annually. The average support ticket costs $15-25 to resolve. Despite chatbot adoption, 73% of customers still prefer human agents because current AI solutions give generic, frustrating responses. Companies are stuck between expensive human agents and low-quality bots.',
        solution: 'Synthia deploys AI agents trained on your specific product documentation, past tickets, and internal knowledge base. Our agents resolve 84% of tickets autonomously with human-level quality — understanding context, accessing account data, and taking actions (refunds, upgrades, escalations). Setup takes 2 hours, not 2 months.',
        uniqueAdvantage: 'Fine-tuned on 50M+ real support conversations across 12 industries. Our proprietary feedback loop improves resolution quality 3% weekly based on customer satisfaction scores. Patent-pending "action graph" lets agents perform real account operations, not just answer questions.',
      },
      step3: {
        targetCustomer: 'VP of Customer Success at 200-5000 person SaaS, e-commerce, and fintech companies with 10+ support agents.',
        marketSize: '$200B',
        competitors: 'Intercom Fin\nAda\nZendesk AI\nForethought',
      },
      step4: {
        revenueModel: 'Usage-based',
        pricing: '$0.50 per resolved ticket + $500/mo platform fee',
        channels: 'Outbound sales to VPs of CX, Zendesk/Intercom marketplace integrations, Case study marketing',
      },
      step5: {
        teamSize: '6',
        revenue: '320000',
        users: '42',
        fundingRaised: '800000',
        fundingAsk: '5000000',
      },
    },
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    category: 'Commerce',
    description: 'Two-sided marketplace connecting supply and demand.',
    icon: '🏪',
    color: '#10b981',
    data: {
      step1: {
        companyName: 'SkillBridge',
        oneLiner: 'The marketplace where companies hire vetted AI specialists by the hour',
        industry: 'AI / ML',
        stage: 'Pre-seed',
      },
      step2: {
        problem: '92% of companies want to adopt AI but 67% cannot find qualified talent. The average AI engineer hire takes 4.7 months and costs $180K+ in salary alone. Consulting firms charge $400-800/hour. Small and mid-size companies are locked out of the AI revolution by talent scarcity and cost.',
        solution: 'SkillBridge is a vetted marketplace of 500+ AI specialists available by the hour. Companies post a project (fine-tune a model, build a pipeline, audit an ML system) and get matched with qualified specialists within 24 hours. Skills-based matching, not resume-based.',
        uniqueAdvantage: 'Every specialist passes a live technical assessment (not just interviews). Our matching algorithm uses project outcome data to improve matches over time. Built-in code review and project management means quality is guaranteed — we offer a money-back guarantee on every engagement.',
      },
      step3: {
        targetCustomer: 'CTOs and VP Engineering at 50-500 person tech companies, non-tech enterprises starting AI initiatives, and funded startups needing ML expertise.',
        marketSize: '$200B',
        competitors: 'Toptal\nUpwork\nAndela\nTuring',
      },
      step4: {
        revenueModel: 'Marketplace / Commission',
        pricing: '20% take rate on specialist hourly rates ($150-400/hr range)',
        channels: 'SEO (AI talent hiring keywords), LinkedIn outbound to CTOs, Partnership with AI bootcamps and universities',
      },
      step5: {
        teamSize: '2',
        revenue: '28000',
        users: '85',
        fundingRaised: '0',
        fundingAsk: '750000',
      },
    },
  },
  {
    id: 'climate-tech',
    name: 'Climate Tech',
    category: 'Sustainability',
    description: 'Technology addressing climate change or environmental sustainability.',
    icon: '🌍',
    color: '#22c55e',
    data: {
      step1: {
        companyName: 'CarbonLens',
        oneLiner: 'Real-time carbon footprint tracking for supply chains',
        industry: 'Climate Tech',
        stage: 'Seed',
      },
      step2: {
        problem: 'Supply chains account for 60% of global emissions, but 93% of companies cannot accurately measure their Scope 3 emissions. New EU and SEC regulations require disclosure by 2026. Current solutions (Watershed, Persefoni) cost $100K+ annually and require months of implementation. Mid-market companies face regulatory fines with no affordable compliance path.',
        solution: 'CarbonLens connects to your existing procurement and logistics systems (SAP, Oracle, Shopify) and automatically calculates real-time Scope 1-3 emissions using our proprietary emission factor database of 2M+ products and materials. Get compliant in days, not months.',
        uniqueAdvantage: 'Largest proprietary emission factor database (2M+ SKUs). Satellite-verified actuals instead of industry averages. Our API-first approach means implementation in days vs months. 10x cheaper than enterprise alternatives.',
      },
      step3: {
        targetCustomer: 'Sustainability managers and CFOs at mid-market manufacturers, retailers, and food & beverage companies (100-5000 employees) in EU and US markets.',
        marketSize: '$130B',
        competitors: 'Watershed\nPersefoni\nSweep\nPlan A',
      },
      step4: {
        revenueModel: 'Subscription',
        pricing: '$2,000/mo (Growth), $5,000/mo (Enterprise), $15,000/mo (Custom)',
        channels: 'Industry conferences (COP, Climate Week), Partnership with Big 4 accounting firms, Regulatory compliance content marketing',
      },
      step5: {
        teamSize: '5',
        revenue: '180000',
        users: '28',
        fundingRaised: '500000',
        fundingAsk: '3000000',
      },
    },
  },
  {
    id: 'edtech',
    name: 'EdTech',
    category: 'Education',
    description: 'Education technology transforming how people learn.',
    icon: '📚',
    color: '#eab308',
    data: {
      step1: {
        companyName: 'LearnLoop',
        oneLiner: 'AI tutor that adapts to how each student learns',
        industry: 'EdTech',
        stage: 'Pre-seed',
      },
      step2: {
        problem: 'One-size-fits-all education fails 65% of students. Private tutoring ($40-100/hour) is out of reach for most families. Existing EdTech platforms (Khan Academy, Coursera) deliver the same content to every student regardless of their learning style, pace, or gaps. Teachers with 30+ students cannot personalize instruction.',
        solution: 'LearnLoop is an AI tutor that builds a cognitive model of each student — identifying their learning style, knowledge gaps, and optimal challenge level. It generates custom lessons, practice problems, and explanations tailored to exactly where each student is. Like having a personal tutor who never gets tired.',
        uniqueAdvantage: 'Our adaptive learning engine is trained on 10M+ student interaction patterns. We identify learning style (visual/verbal/kinesthetic) in the first 15 minutes and adjust all content delivery. 2.3x better learning outcomes than static content in our pilot study.',
      },
      step3: {
        targetCustomer: 'Parents of K-12 students, school districts seeking supplemental AI tools, and adult learners studying for professional certifications.',
        marketSize: '$400B',
        competitors: 'Khan Academy\nDuolingo\nPhotomath\nKhanmigo',
      },
      step4: {
        revenueModel: 'Freemium',
        pricing: 'Free (2 subjects), $14.99/mo (Family), $8/student/mo (School License)',
        channels: 'Organic (parent social media communities), School district pilots, App Store optimization',
      },
      step5: {
        teamSize: '3',
        revenue: '0',
        users: '1200',
        fundingRaised: '75000',
        fundingAsk: '1000000',
      },
    },
  },
];

export function getTemplate(id: string): DeckTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
