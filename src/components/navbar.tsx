'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          <span className="gradient-text">PitchPerfect</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <Link href="/pricing" className="transition hover:text-zinc-100">
            Pricing
          </Link>
          <Link href="/dashboard" className="transition hover:text-zinc-100">
            Dashboard
          </Link>
          <Link
            href="/create"
            className="rounded-lg bg-cyan-500 px-4 py-1.5 text-sm font-medium text-zinc-950 transition hover:bg-cyan-400"
          >
            Create Deck
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
