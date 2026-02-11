import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PitchPerfect — AI Pitch Deck Generator',
  description: 'Turn your startup idea into an investor-ready pitch deck in minutes. Financial projections, market sizing, competitive analysis — auto-generated. Free for founders.',
  keywords: 'pitch deck generator, AI pitch deck, startup pitch deck, investor deck, fundraising, YC application, Series A deck, seed round pitch',
  openGraph: {
    title: 'PitchPerfect — AI Pitch Deck Generator',
    description: 'Create investor-ready pitch decks in minutes. TAM/SAM/SOM analysis, 5-year projections, competitive positioning — all auto-generated.',
    type: 'website',
    url: 'https://pitchperfect-omega.vercel.app',
    siteName: 'PitchPerfect',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PitchPerfect — AI Pitch Deck Generator',
    description: 'Create investor-ready pitch decks in minutes. Free for founders.',
    creator: '@memecat671',
  },
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
