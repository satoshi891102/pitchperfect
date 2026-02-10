import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PitchPerfect — AI Pitch Deck Generator',
  description: 'Turn your idea into a professional pitch deck in minutes. Free for founders.',
  openGraph: {
    title: 'PitchPerfect — AI Pitch Deck Generator',
    description: 'Turn your idea into a professional pitch deck in minutes.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PitchPerfect — AI Pitch Deck Generator',
    description: 'Turn your idea into a professional pitch deck in minutes.',
  },
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
