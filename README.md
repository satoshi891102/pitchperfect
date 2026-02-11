# PitchPerfect — AI Pitch Deck Generator

Turn your startup idea into an investor-ready pitch deck in minutes. Free for founders.

**Live:** [pitchperfect-omega.vercel.app](https://pitchperfect-omega.vercel.app)

## Features

- **Smart Input Wizard** — 5-step guided form captures everything about your business
- **11-Slide Deck Generation** — Cover, Problem, Solution, Market (TAM/SAM/SOM), Business Model, Traction, Competition, Go-to-Market, Financials, Team, The Ask
- **Auto-Generated Charts** — TAM/SAM/SOM donut chart, 5-year revenue projections, competition scatter plot, use-of-funds breakdown
- **Pitch Score** — 6-dimension analysis: Company Identity, Problem Statement, Solution & Moat, Market Opportunity, Business Model, Traction & Team. Grade A-F with improvement tips.
- **Presentation Mode** — Full-screen slideshow with keyboard navigation (arrow keys, space, ESC). Auto-hiding controls, progress bar, fullscreen toggle (F key).
- **Templates Gallery** — 6 industry-specific starter decks: B2B SaaS, Fintech Payments, AI/ML, Marketplace, Climate Tech, EdTech. Each with realistic data and compelling narratives.
- **Export** — PDF export via browser print, share links
- **Email Waitlist** — Capture leads on landing page and pricing modal
- **Dashboard** — View all decks with mini score badges, average score, quick actions
- **Local Storage** — All data stored in browser, zero server-side storage

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with features, templates preview, pitch score demo, pricing, testimonials |
| `/create` | 5-step wizard with progress bar and auto-save drafts |
| `/templates` | 6 industry templates with expandable details and category filtering |
| `/deck/[id]` | Interactive slide viewer with tab navigation |
| `/deck/[id]/present` | Full-screen presentation mode |
| `/deck/[id]/score` | Pitch scoring with 6-category breakdown, tips, and investor readiness checklist |
| `/deck/[id]/export` | All slides rendered for PDF export |
| `/pricing` | Free/Pro/Enterprise tiers with FAQ accordion |
| `/dashboard` | All decks with scores, quick actions |

## Tech Stack

- **Next.js 14** + TypeScript
- **Tailwind CSS** — Dark theme, responsive
- **Framer Motion** — Animations, transitions, presentation mode
- **Recharts** — Charts (PieChart, AreaChart, ScatterChart)
- **Local Storage** — Zero backend, fully client-side

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

```bash
npx vercel --prod
```

## License

MIT
