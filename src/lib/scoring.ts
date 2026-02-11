import { DeckData, INDUSTRIES } from './types';

export interface ScoreDimension {
  name: string;
  score: number;
  maxScore: number;
  tips: string[];
  status: 'excellent' | 'good' | 'needs-work' | 'missing';
}

export interface DeckScore {
  total: number;
  maxTotal: number;
  grade: string;
  summary: string;
  dimensions: ScoreDimension[];
}

function getStatus(score: number, max: number): ScoreDimension['status'] {
  const pct = score / max;
  if (pct >= 0.8) return 'excellent';
  if (pct >= 0.6) return 'good';
  if (pct >= 0.3) return 'needs-work';
  return 'missing';
}

function getGrade(pct: number): string {
  if (pct >= 0.9) return 'A+';
  if (pct >= 0.85) return 'A';
  if (pct >= 0.8) return 'A-';
  if (pct >= 0.75) return 'B+';
  if (pct >= 0.7) return 'B';
  if (pct >= 0.65) return 'B-';
  if (pct >= 0.6) return 'C+';
  if (pct >= 0.55) return 'C';
  if (pct >= 0.5) return 'C-';
  if (pct >= 0.4) return 'D';
  return 'F';
}

export function scoreDeck(deck: DeckData): DeckScore {
  const dimensions: ScoreDimension[] = [];

  // 1. Company Identity (15 pts)
  {
    let score = 0;
    const tips: string[] = [];
    if (deck.step1.companyName && deck.step1.companyName.length >= 2) score += 5;
    else tips.push('Add a clear company name');
    
    if (deck.step1.oneLiner && deck.step1.oneLiner.length >= 10) {
      score += 5;
      if (deck.step1.oneLiner.length > 80) tips.push('Keep your one-liner under 80 characters for maximum impact');
    } else tips.push('Write a compelling one-liner that explains your value proposition in one sentence');
    
    if (deck.step1.industry) score += 3;
    else tips.push('Select your industry to get accurate market sizing');
    
    if (deck.step1.stage) score += 2;
    else tips.push('Indicate your current stage');
    
    dimensions.push({ name: 'Company Identity', score, maxScore: 15, tips, status: getStatus(score, 15) });
  }

  // 2. Problem Definition (15 pts)
  {
    let score = 0;
    const tips: string[] = [];
    const problem = deck.step2.problem || '';
    
    if (problem.length >= 50) {
      score += 8;
      if (problem.length >= 150) score += 2;
    } else if (problem.length >= 20) {
      score += 4;
      tips.push('Expand your problem description — investors need to feel the pain. Add specific examples, data, or affected user counts');
    } else {
      tips.push('Describe the problem you\'re solving. Be specific: who has this problem? How much does it cost them?');
    }
    
    if (problem.toLowerCase().includes('million') || problem.toLowerCase().includes('billion') || problem.match(/\d+%/) || problem.match(/\$[\d,]+/)) {
      score += 5;
    } else {
      tips.push('Add quantitative data — "X million people" or "costs $Y billion annually" makes problems feel real');
    }
    
    dimensions.push({ name: 'Problem Definition', score, maxScore: 15, tips, status: getStatus(score, 15) });
  }

  // 3. Solution Clarity (15 pts)
  {
    let score = 0;
    const tips: string[] = [];
    const solution = deck.step2.solution || '';
    const advantage = deck.step2.uniqueAdvantage || '';
    
    if (solution.length >= 50) {
      score += 6;
      if (solution.length >= 150) score += 2;
    } else if (solution.length >= 20) {
      score += 3;
      tips.push('Elaborate on your solution — explain HOW it works, not just WHAT it does');
    } else {
      tips.push('Describe your solution clearly. Focus on the "how" — what makes your approach work?');
    }
    
    if (advantage.length >= 20) {
      score += 5;
    } else if (advantage.length > 0) {
      score += 2;
      tips.push('Expand your unique advantage — what makes this 10x better than alternatives?');
    } else {
      tips.push('Add a unique advantage. What moat do you have? IP? Network effects? Data? First-mover?');
    }
    
    if (solution.toLowerCase().includes('ai') || solution.toLowerCase().includes('automat') || solution.toLowerCase().includes('platform')) {
      score += 2;
    }
    
    dimensions.push({ name: 'Solution Clarity', score, maxScore: 15, tips, status: getStatus(score, 15) });
  }

  // 4. Market Opportunity (10 pts)
  {
    let score = 0;
    const tips: string[] = [];
    
    if (deck.step1.industry && INDUSTRIES[deck.step1.industry]) {
      score += 4;
      const tam = INDUSTRIES[deck.step1.industry];
      if (tam >= 100e9) score += 2;
    } else {
      tips.push('Select an industry to auto-generate TAM/SAM/SOM analysis');
    }
    
    if (deck.step3.targetCustomer && deck.step3.targetCustomer.length >= 10) {
      score += 4;
    } else {
      tips.push('Define your target customer precisely — "SMBs with 10-50 employees in healthcare" beats "businesses"');
    }
    
    dimensions.push({ name: 'Market Opportunity', score, maxScore: 10, tips, status: getStatus(score, 10) });
  }

  // 5. Business Model (10 pts)
  {
    let score = 0;
    const tips: string[] = [];
    
    if (deck.step4.revenueModel) score += 4;
    else tips.push('Select a revenue model — investors need to know how you make money');
    
    if (deck.step4.pricing && deck.step4.pricing.length >= 5) {
      score += 3;
    } else {
      tips.push('Add specific pricing — "$49/mo per seat" is better than "subscription"');
    }
    
    if (deck.step4.channels && deck.step4.channels.length >= 5) {
      score += 3;
    } else {
      tips.push('List your distribution channels — how do customers find you?');
    }
    
    dimensions.push({ name: 'Business Model', score, maxScore: 10, tips, status: getStatus(score, 10) });
  }

  // 6. Competitive Positioning (10 pts)
  {
    let score = 0;
    const tips: string[] = [];
    const competitors = (deck.step3.competitors || '').split('\n').filter(Boolean);
    
    if (competitors.length >= 3) {
      score += 6;
    } else if (competitors.length >= 1) {
      score += 3;
      tips.push('List at least 3 competitors. "No competition" is a red flag for investors');
    } else {
      tips.push('Add competitors — every market has them. Showing awareness builds credibility');
    }
    
    if (deck.step2.uniqueAdvantage && deck.step2.uniqueAdvantage.length >= 20) {
      score += 4;
    } else {
      tips.push('Clearly articulate why you win against competitors');
    }
    
    dimensions.push({ name: 'Competitive Positioning', score, maxScore: 10, tips, status: getStatus(score, 10) });
  }

  // 7. Traction & Team (15 pts)
  {
    let score = 0;
    const tips: string[] = [];
    const revenue = parseFloat(deck.step5.revenue) || 0;
    const users = parseFloat(deck.step5.users) || 0;
    const teamSize = parseFloat(deck.step5.teamSize) || 0;
    
    if (revenue > 0) {
      score += 5;
      if (revenue >= 10000) score += 2;
    } else if (users > 0) {
      score += 3;
    } else {
      tips.push('Any traction matters — even 10 beta users or $100 in revenue shows validation');
    }
    
    if (users > 0) score += 2;
    
    if (teamSize >= 2) {
      score += 3;
    } else if (teamSize >= 1) {
      score += 1;
      tips.push('Solo founders can succeed, but investors prefer teams. Highlight advisors or planned hires');
    } else {
      tips.push('Add your team size — even 1 is fine, just show commitment');
    }
    
    if (parseFloat(deck.step5.fundingRaised) > 0) score += 3;
    
    dimensions.push({ name: 'Traction & Team', score, maxScore: 15, tips, status: getStatus(score, 15) });
  }

  // 8. The Ask (10 pts)
  {
    let score = 0;
    const tips: string[] = [];
    const ask = parseFloat(deck.step5.fundingAsk) || 0;
    
    if (ask > 0) {
      score += 5;
      if (ask >= 100000 && ask <= 10000000) score += 3;
      else tips.push('Most seed rounds are $500K-$3M. Make sure your ask matches your stage');
      
      if (deck.step5.revenue && ask > 0) {
        score += 2;
      }
    } else {
      tips.push('Specify your funding ask — be specific about how much and what it\'s for');
    }
    
    dimensions.push({ name: 'The Ask', score, maxScore: 10, tips, status: getStatus(score, 10) });
  }

  const total = dimensions.reduce((s, d) => s + d.score, 0);
  const maxTotal = dimensions.reduce((s, d) => s + d.maxScore, 0);
  const pct = total / maxTotal;
  const grade = getGrade(pct);

  let summary = '';
  if (pct >= 0.8) summary = 'Your deck is investor-ready. Strong across all dimensions with compelling content.';
  else if (pct >= 0.6) summary = 'Good foundation. A few areas need strengthening before sharing with investors.';
  else if (pct >= 0.4) summary = 'Decent start. Several key areas need more detail and supporting data.';
  else summary = 'Early stage deck. Focus on filling in the gaps — especially problem, solution, and traction.';

  return { total, maxTotal, grade, summary, dimensions };
}
