'use client';
import { useState } from 'react';

const GUIDE_ITEMS = [
  {
    range: '0 ppt / 0%',
    label: 'Fresh Water',
    desc:  'Standard baseline. Healthy Koi thrive in fresh water under normal conditions.',
    color: 'text-(--color-brand-text-muted)',
  },
  {
    range: '1–3 ppt / 0.1–0.3%',
    label: 'Preventive',
    desc:  'Reduces nitrite toxicity and boosts slime coat. Safe for long-term maintenance.',
    color: 'text-(--color-brand-success)',
  },
  {
    range: '3–5 ppt / 0.3–0.5%',
    label: 'Treatment',
    desc:  'Used to treat parasites, bacterial infections, and stress. Monitor fish closely.',
    color: 'text-(--color-brand-warning)',
  },
  {
    range: '5–10 ppt / 0.5–1%',
    label: 'Short-term Therapy',
    desc:  'Brief salt baths (20–60 min) for anchor worm, flukes, or severe stress. Do NOT maintain long-term.',
    color: 'text-orange-400',
  },
  {
    range: '> 10 ppt / > 1%',
    label: '⚠ Dangerous',
    desc:  'Harmful to Koi and beneficial pond bacteria. Only for controlled expert dips.',
    color: 'text-(--color-brand-danger)',
  },
];

export function SalinityGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="col-span-full bg-(--color-brand-surface) border border-(--color-brand-border) rounded-2xl overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-(--color-brand-panel) transition-colors duration-150 cursor-pointer"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xl">📖</span>
          <span className="text-sm font-medium text-(--color-brand-text)">Koi Salinity Reference Guide</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-(--color-brand-red-dim) text-(--color-brand-red)">
            Beginner Friendly
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-(--color-brand-text-muted) transition-transform duration-200 shrink-0 ml-2 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-(--color-brand-border) grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-(--color-brand-border) animate-fade-in">
          {GUIDE_ITEMS.map((item) => (
            <div key={item.label} className="p-4 bg-(--color-brand-panel)">
              <div className={`font-mono text-sm font-medium mb-1 ${item.color}`}>{item.range}</div>
              <div className="text-sm font-semibold text-(--color-brand-text) mb-1">{item.label}</div>
              <div className="text-xs text-(--color-brand-text-muted) leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
