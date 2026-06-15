'use client';
import { useState } from 'react';
import { ForwardCalculator } from '../components/ForwardCalculator';
import { ReverseCalculator } from '../components/ReverseCalculator';
import { SalinityGuide }     from '../components/SalinityGuide';

type Mode = 'forward' | 'reverse';

export default function Home() {
  const [mode, setMode] = useState<Mode>('forward');

  return (
    <div className="min-h-screen bg-(--color-brand-black) font-sans text-(--color-brand-text) flex flex-col">

      {/* ── Hero ── */}
      <header className="relative overflow-hidden text-center px-6 pt-12 pb-8">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(237,30,38,0.12) 0%, transparent 70%)' }}
        />
        <div className="relative flex flex-col items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="text-(--color-brand-red)">Demi Koi</span>{' '}
              <span className="text-(--color-brand-text)">Salt Calculator</span>
            </h1>
            <p className="mt-2 text-(--color-brand-text-muted) text-sm max-w-md mx-auto">
              Calculate exactly how much salt your pond needs — keep your Koi healthy with precise dosing, every time.
            </p>
          </div>
        </div>
      </header>

      {/* ── Mode Toggle ── */}
      <nav className="flex justify-center px-6 pb-2" aria-label="Calculator mode">
        <div className="inline-flex bg-(--color-brand-surface) border border-(--color-brand-border) rounded-2xl p-1 gap-1">
          <ModeBtn active={mode === 'forward'} onClick={() => setMode('forward')}>
            🧂 How much salt to add?
          </ModeBtn>
          <ModeBtn active={mode === 'reverse'} onClick={() => setMode('reverse')}>
            📐 What&apos;s my pond size?
          </ModeBtn>
        </div>
      </nav>

      {/* ── Main Grid ── */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full px-4 py-4 items-start">
        {mode === 'forward' ? <ForwardCalculator /> : <ReverseCalculator />}
        <SalinityGuide />
      </main>

      {/* ── Footer ── */}
      <footer className="text-center px-6 py-6 border-t border-(--color-brand-border) text-xs text-(--color-brand-text-muted) space-y-1">
        <p>Results are for guidance only. Consult a Koi specialist before treatment.</p>
        <p className="opacity-50">
          Salt (kg) = Volume (L) × Δppt ÷ 1000 &nbsp;·&nbsp; 1 gal = 3.78541 L &nbsp;·&nbsp; 1 gal H₂O ≈ 8.34 lbs
        </p>
      </footer>
    </div>
  );
}

function ModeBtn({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer',
        active
          ? 'bg-(--color-brand-red) text-white shadow-sm'
          : 'text-(--color-brand-text-muted) hover:text-(--color-brand-text) hover:bg-(--color-brand-panel)',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
