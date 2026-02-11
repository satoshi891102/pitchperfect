import { DeckData } from './types';

export interface DeckTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  stage: string;
  icon: string;
  color: string;
  data: Omit<DeckData, 'id' | 'createdAt' | 'updatedAt'>;
}

export const TEMPLATES: DeckTemplate[] = [
  {
    id: 'saas-b2b',
    name: 'B2B SaaS Startup',
    description: 'Classic SaaS pitch for enterprise or SMB customers. Subscription model with usage tiers.',
    industry: 'SaaS',
    stage: 'Seed',
    icon: '💼',
    color: 'from-cyan-500 to-blue-600',
    data: {
      step1: {
        companyName: 'CloudFlow',
        oneLiner: 'AI-powered workflow automation that saves teams 10 hours per week',
        industry: 'SaaS',
        stage: 'Seed',
      },
      step2: {
        problem: 'Knowledge workers spend 40% of their time on repetitive tasks — data entry, status updates, report generation, and cross-tool syncing. This costs US businesses over $1.8 trillion annually in lost productivity. Current automation tools require technical expertise to set up and maintain, leaving 80% of teams stuck with manual processes.',
        solution: 'CloudFlow uses AI to observe team workflows and automatically suggests and builds automations. No code, no configuration. It watches how teams use Slack, Notion, Jira, and email, then creates automated workflows that handle the repetitive parts. Average team saves 10+ hours per week within the first month.',
        uniqueAdvantage: 'Our proprietary workflow learning engine gets smarter with every interaction. Unlike Zapier or Make which require manual setup, CloudFlow learns patterns and proactively automates them. 3 patents pending on our AI observation layer.',
      },
      step3: {
        targetCustomer: 'Mid-market companies (50-500 employees) with distributed teams using 5+ SaaS tools. Primary buyer: VP of Operations or CTO. Key verticals: tech, consulting, marketing agencies.',
        marketSize: '$195B TAM, growing 18% CAGR',
        competitors: 'Zapier\nMake (Integromat)\nMicrosoft Power Automate\nWorkato',
      },
      step4: {
        revenueModel: 'Subscription',
        pricing: '$29/user/month (Team), $79/user/month (Enterprise). Average contract: $15K ARR.',
        channels: 'Product-led growth (free trial), Content marketing, Sales team for Enterprise, Partner integrations',
      },
      step5: {
        teamSize: '8',
        revenue: '45000',
        users: '320',
        fundingRaised: '500000',
        fundingAsk: '2500000',
      },
    },
  },
  {
    id: 'fintech-payments',
    name: 'Fintech Payment Platform',
    description: 'Modern payment infrastructure targeting underserved markets. Transaction-based revenue.',
    industry: 'Fintech',
    stage: 'Seed',
    icon: '💳',
    color: 'from-green-500 to-emerald-600',
    data: {
      step1: {
        companyName: 'PayBridge',
        oneLiner: 'Cross-border payments for African businesses at 1/10th the cost',
        industry: 'Fintech',
        stage: 'Seed',
      },
      step2: {
        problem: 'African businesses pay 8-15% on cross-border payments through traditional banking rails. With intra-African trade projected to reach $1 trillion by 2030 (AfCFTA), SMEs lose $50B+ annually to payment friction. Settlement takes 3-7 days, and 40% of transactions require manual reconciliation.',
        solution: 'PayBridge uses stablecoin rails to settle cross-border payments in under 60 seconds at 0.5-1.5% fees. Businesses get a simple API or dashboard — the blockchain complexity is completely abstracted. We handle compliance, FX, and local payout across 15 African countries.',
        uniqueAdvantage: 'Licensed in 8 African markets with established local banking partnerships. Our hybrid on/off-ramp network gives us settlement speed no competitor can match. First-mover in stablecoin-powered B2B payments across Africa.',
      },
      step3: {
        targetCustomer: 'African import/export businesses with $100K-$10M annual cross-border volume. Initially targeting Nigeria-Kenya-South Africa corridor (60% of intra-African trade).',
        marketSize: '$310B global fintech TAM, $15B Africa-specific opportunity',
        competitors: 'Chipper Cash\nFlutterwave\nWISE (TransferWise)\nYellowCard',
      },
      step4: {
        revenueModel: 'Transaction Fee',
        pricing: '0.5-1.5% per transaction (volume-based tiers). Average transaction: $2,500. Average revenue per merchant: $250/month.',
        channels: 'Direct sales to import/export businesses, Trade association partnerships, API integrations with ERP systems, Referral program (earn 0.1% on referred volume)',
      },
      step5: {
        teamSize: '12',
        revenue: '180000',
        users: '85',
        fundingRaised: '1200000',
        fundingAsk: '5000000',
      },
    },
  },
  {
    id: 'ai-consumer',
    name: 'AI Consumer App',
    description: 'AI-powered consumer product with freemium model. Focus on viral growth and retention.',
    industry: 'AI / ML',
    stage: 'Pre-seed',
    icon: '🤖',
    color: 'from-violet-500 to-purple-600',
    data: {
      step1: {
        companyName: 'MemoryLens',
        oneLiner: 'AI that turns your photos into searchable, organized life memories',
        industry: 'AI / ML',
        stage: 'Pre-seed',
      },
      step2: {
        problem: 'The average person has 5,000+ photos on their phone but can only find 1% of them when needed. 82% of smartphone users have never organized their photo library. Life milestones, family moments, and important documents are buried in an infinite scroll — effectively lost despite being technically saved.',
        solution: 'MemoryLens runs a private, on-device AI that automatically organizes photos into life chapters — "Summer 2024," "Baby\'s First Year," "House Renovation." It understands context, faces, locations, and events. Ask it anything: "Show me photos from mom\'s birthday 2023" or "Find the photo of that restaurant menu in Tokyo."',
        uniqueAdvantage: 'Fully on-device AI processing — photos never leave the phone. Privacy-first approach in a market where Google and Apple send data to the cloud. Our model is 10x smaller than competitors while being more accurate on personal photo understanding.',
      },
      step3: {
        targetCustomer: 'Smartphone users 25-45 with 2,000+ photos. Primary: parents (document children), travelers (organize trips), and professionals (find documents/receipts). 3.5 billion smartphone users globally.',
        marketSize: '$200B AI/ML TAM, $8B photo management segment',
        competitors: 'Google Photos\nApple Photos\nAmazon Photos\nMonument',
      },
      step4: {
        revenueModel: 'Freemium',
        pricing: 'Free: 1,000 photos organized. Pro: $4.99/mo (unlimited). Family: $9.99/mo (5 accounts + shared memories).',
        channels: 'App Store optimization, TikTok/Instagram viral loops (share memory compilations), Tech review embargoes, Reddit communities (r/photography, r/parenting)',
      },
      step5: {
        teamSize: '3',
        revenue: '0',
        users: '2500',
        fundingRaised: '0',
        fundingAsk: '750000',
      },
    },
  },
  {
    id: 'marketplace',
    name: 'Two-Sided Marketplace',
    description: 'Connect supply and demand. Commission-based revenue with network effects.',
    industry: 'E-commerce',
    stage: 'Seed',
    icon: '🏪',
    color: 'from-orange-500 to-red-600',
    data: {
      step1: {
        companyName: 'SkillSwap',
        oneLiner: 'The marketplace where professionals trade skills instead of paying cash',
        industry: 'E-commerce',
        stage: 'Seed',
      },
      step2: {
        problem: 'Freelancers and small businesses spend $50K+ annually on services they could trade for. A developer needs design work. A designer needs legal advice. A lawyer needs a website. Everyone has skills worth $100-300/hr but pays cash for skills they lack. The barter economy died — we\'re bringing it back with modern infrastructure.',
        solution: 'SkillSwap matches professionals based on complementary skills. A developer who needs design is matched with a designer who needs development. Our AI matching considers skill level, availability, timezone, and review history. Time-banked credits ensure fair exchange even when trades aren\'t simultaneous.',
        uniqueAdvantage: 'Network effects: every new user makes the platform more valuable for everyone. Our skill-matching algorithm has 92% satisfaction rate (vs. 60% on traditional freelance platforms). Time-bank system creates platform lock-in — credits earned here can only be spent here.',
      },
      step3: {
        targetCustomer: 'Independent professionals and micro-agencies (1-5 people) earning $50-200K/year. Currently 59 million freelancers in the US alone. Target: tech, creative, and professional services.',
        marketSize: '$6.3T e-commerce TAM, $1.5T freelance/gig economy',
        competitors: 'Upwork\nFiverr\nToptal\nSimbi',
      },
      step4: {
        revenueModel: 'Marketplace / Commission',
        pricing: '10% commission on skill exchanges (paid in time-credits). Premium: $29/mo for priority matching, skill verification badges, and unlimited exchanges.',
        channels: 'Community-led growth (Slack/Discord groups), LinkedIn content marketing, Partnerships with coworking spaces, Referral rewards (earn 2 hours credit per referral)',
      },
      step5: {
        teamSize: '5',
        revenue: '12000',
        users: '1800',
        fundingRaised: '200000',
        fundingAsk: '1500000',
      },
    },
  },
  {
    id: 'healthtech',
    name: 'Digital Health Platform',
    description: 'Healthcare technology with regulatory considerations. B2B2C or direct-to-consumer.',
    industry: 'Healthcare',
    stage: 'Series A',
    icon: '🏥',
    color: 'from-rose-500 to-pink-600',
    data: {
      step1: {
        companyName: 'VitalSync',
        oneLiner: 'AI-powered remote patient monitoring that predicts health crises 48 hours early',
        industry: 'Healthcare',
        stage: 'Series A',
      },
      step2: {
        problem: 'Hospital readmissions cost the US healthcare system $26 billion annually. 1 in 5 patients are readmitted within 30 days of discharge, and 75% of these readmissions are preventable with proper monitoring. Current remote monitoring solutions generate too many false alarms (>90% false positive rate), causing alert fatigue and ignored warnings.',
        solution: 'VitalSync combines wearable data (heart rate, SpO2, activity, sleep) with AI that\'s trained on 2 million patient records to predict health deterioration 48 hours before it becomes critical. Our false positive rate is under 5% — clinicians trust our alerts because they\'re almost always actionable. Patients wear a simple wristband; clinicians get a clean dashboard.',
        uniqueAdvantage: 'FDA 510(k) cleared. Trained on 2M+ patient records from 3 health systems. 48-hour prediction window (competitors offer 6-12 hours). Integration with all major EHR systems (Epic, Cerner, Meditech). Clinical study showed 40% reduction in readmissions.',
      },
      step3: {
        targetCustomer: 'Hospital systems and ACOs (Accountable Care Organizations) managing 10,000+ patients. Initial focus: cardiac and COPD patients (highest readmission rates). 6,000+ hospitals in the US alone.',
        marketSize: '$500B healthcare TAM, $29B remote patient monitoring',
        competitors: 'Biofourmis\nCurrent Health (Best Buy)\nVivify Health\nPhilips RPM',
      },
      step4: {
        revenueModel: 'Subscription',
        pricing: '$120/patient/month (hospital pays). Average hospital contract: $500K ARR. RPM billing codes (CPT 99453-99458) reimburse hospitals $120-180/patient/month — our service pays for itself.',
        channels: 'Direct enterprise sales (VP Clinical Operations), Health system conferences (HIMSS, HLTH), EHR marketplace listings, Pilot programs with 3-month free trial',
      },
      step5: {
        teamSize: '25',
        revenue: '2400000',
        users: '4200',
        fundingRaised: '8000000',
        fundingAsk: '15000000',
      },
    },
  },
  {
    id: 'edtech',
    name: 'EdTech Learning Platform',
    description: 'Education technology with engagement-first design. B2C or B2B2C model.',
    industry: 'EdTech',
    stage: 'Pre-seed',
    icon: '📚',
    color: 'from-amber-500 to-yellow-600',
    data: {
      step1: {
        companyName: 'LearnLoop',
        oneLiner: 'Personalized micro-learning that fits into your 5-minute breaks',
        industry: 'EdTech',
        stage: 'Pre-seed',
      },
      step2: {
        problem: '85% of online course enrollees never finish. The average completion rate on platforms like Coursera and Udemy is just 5-15%. People want to learn but can\'t commit to 40-hour courses. Meanwhile, they spend 2+ hours daily on TikTok and Instagram Reels — proof that bite-sized, engaging content holds attention.',
        solution: 'LearnLoop transforms any skill into 5-minute daily micro-lessons with the engagement mechanics of TikTok. Swipeable cards, streaks, social challenges, and AI-adapted difficulty. Learn Python, negotiation, Spanish, or financial modeling — all in sessions shorter than a coffee break. Our completion rate is 73% vs. industry average of 10%.',
        uniqueAdvantage: 'AI personalization engine that adapts content difficulty and format to each learner in real-time. If you learn better from examples than theory, the AI shifts. If you\'re losing engagement, it introduces a challenge or social element. Patent pending on adaptive micro-learning algorithm.',
      },
      step3: {
        targetCustomer: 'Working professionals 22-35 who want to upskill but lack time. 70% of our beta users are in tech, finance, or consulting. Secondary: college students supplementing coursework.',
        marketSize: '$400B EdTech TAM, $50B online learning segment',
        competitors: 'Duolingo\nBrilliant\nBlinkist\nMasterClass',
      },
      step4: {
        revenueModel: 'Freemium',
        pricing: 'Free: 1 skill track, 5 min/day. Pro: $9.99/mo (unlimited tracks, offline, certificates). Team: $7/user/mo (company-managed skills).',
        channels: 'App Store (viral loop via challenge invites), TikTok/YouTube Shorts (learning clips from the app), University partnerships, Corporate L&D departments, Creator program (experts build courses, earn 70% revenue share)',
      },
      step5: {
        teamSize: '4',
        revenue: '0',
        users: '8500',
        fundingRaised: '0',
        fundingAsk: '500000',
      },
    },
  },
];
