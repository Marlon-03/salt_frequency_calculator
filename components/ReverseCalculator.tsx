'use client';
import { useState, useEffect, useCallback } from 'react';
import { UnitToggle } from './UnitToggle';
import {
  calcPondVolume,
  validateReverseInputs,
  formatNumber,
  type ReverseResult,
  type ValidationError,
} from '../lib/formulas';

const SALT_OPTS     = [{ value: 'lbs' as const, label: 'lbs' }, { value: 'kg' as const, label: 'kg' }];
const SALINITY_OPTS = [{ value: '%' as const, label: '%' }, { value: 'ppt' as const, label: 'ppt' }];
const VOL_OPTS      = [{ value: 'gallons' as const, label: 'gal' }, { value: 'liters' as const, label: 'L' }];

interface Fields { saltAdded: string; salinityChange: string; }

export function ReverseCalculator() {
  const [fields, setFields]             = useState<Fields>({ saltAdded: '', salinityChange: '' });
  const [saltUnit, setSaltUnit]         = useState<'lbs' | 'kg'>('lbs');
  const [salinityUnit, setSalinityUnit] = useState<'%' | 'ppt'>('%');
  const [volUnit, setVolUnit]           = useState<'gallons' | 'liters'>('gallons');
  const [result, setResult]             = useState<ReverseResult | null>(null);
  const [errors, setErrors]             = useState<ValidationError[]>([]);
  const [copied, setCopied]             = useState(false);
  const [animKey, setAnimKey]           = useState(0);

  const compute = useCallback(() => {
    const saltAdded      = parseFloat(fields.saltAdded);
    const salinityChange = parseFloat(fields.salinityChange);

    const errs = validateReverseInputs({
      saltAdded:      isNaN(saltAdded)      ? undefined : saltAdded,
      salinityChange: isNaN(salinityChange) ? undefined : salinityChange,
      saltUnit,
      salinityUnit,
    });
    setErrors(errs);

    const hasError  = errs.some((e) => e.severity === 'error');
    const allFilled = !isNaN(saltAdded) && !isNaN(salinityChange);

    if (!allFilled || hasError) { setResult(null); return; }

    const r = calcPondVolume({ saltAdded, saltUnit, salinityChange, salinityUnit });
    setResult(r);
    setAnimKey((k) => k + 1);
  }, [fields, saltUnit, salinityUnit]);

  useEffect(() => { compute(); }, [compute]);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  const fieldErr    = (f: string) => errors.find((e) => e.field === f);
  const inputBorder = (f: string) => {
    const e = fieldErr(f);
    if (!e) return 'border-(--color-brand-border) focus-within:border-(--color-brand-red)';
    return e.severity === 'error'
      ? 'border-(--color-brand-danger)'
      : 'border-(--color-brand-warning)';
  };

  const handleCopy = async () => {
    if (!result) return;
    const val = volUnit === 'gallons' ? result.volumeGallons : result.volumeLiters;
    await navigator.clipboard.writeText(
      `Pond volume: ${formatNumber(val)} ${volUnit}\n= ${formatNumber(result.volumeGallons)} gal / ${formatNumber(result.volumeLiters)} L`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const primaryVal = result ? (volUnit === 'gallons' ? result.volumeGallons : result.volumeLiters) : null;

  return (
    <div className="contents">
      {/* ── Input Card ── */}
      <div className="bg-(--color-brand-surface) border border-(--color-brand-border) rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-(--color-brand-text-muted) mb-1">Inputs</p>
          <p className="text-xs text-(--color-brand-text-muted) leading-relaxed">
            Don&apos;t know your pond size? Add a known amount of salt, measure the resulting salinity, then enter both below.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="rev-salt" className="text-sm font-medium text-(--color-brand-text-muted)">Salt Added</label>
          <div className={`flex rounded-xl border overflow-hidden bg-(--color-brand-panel) transition-colors ${inputBorder('saltAdded')}`}>
            <input
              id="rev-salt"
              type="number" min="0" step="any"
              placeholder="e.g. 5"
              value={fields.saltAdded}
              onChange={set('saltAdded')}
              className="flex-1 min-w-0 bg-transparent px-4 py-3 text-(--color-brand-text) font-mono text-sm outline-none placeholder:text-(--color-brand-muted)"
            />
            <UnitToggle options={SALT_OPTS} value={saltUnit} onChange={setSaltUnit} />
          </div>
          <FieldMsg err={fieldErr('saltAdded')} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="rev-sal" className="text-sm font-medium text-(--color-brand-text-muted)">Resulting Salinity Level</label>
          <div className={`flex rounded-xl border overflow-hidden bg-(--color-brand-panel) transition-colors ${inputBorder('salinityChange')}`}>
            <input
              id="rev-sal"
              type="number" min="0" step="any"
              placeholder="e.g. 0.3"
              value={fields.salinityChange}
              onChange={set('salinityChange')}
              className="flex-1 min-w-0 bg-transparent px-4 py-3 text-(--color-brand-text) font-mono text-sm outline-none placeholder:text-(--color-brand-muted)"
            />
            <UnitToggle options={SALINITY_OPTS} value={salinityUnit} onChange={setSalinityUnit} />
          </div>
          <FieldMsg err={fieldErr('salinityChange')} />
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-(--color-brand-text-muted)">Show result in</p>
          <div className="flex gap-2">
            {VOL_OPTS.map((opt) => (
              <button
                key={opt.value} type="button"
                onClick={() => setVolUnit(opt.value)}
                className={[
                  'flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 cursor-pointer',
                  volUnit === opt.value
                    ? 'bg-(--color-brand-red) border-(--color-brand-red) text-white'
                    : 'border-(--color-brand-border) text-(--color-brand-text-muted) hover:border-(--color-brand-red) hover:text-(--color-brand-text)',
                ].join(' ')}
              >
                {opt.value === 'gallons' ? 'Gallons' : 'Liters'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Result Card ── */}
      <div className="bg-linear-to-br from-(--color-brand-surface) to-(--color-brand-black) border border-(--color-brand-border) rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-(--color-brand-red)/5 blur-2xl pointer-events-none" />
        <p className="text-xs font-semibold uppercase tracking-widest text-(--color-brand-text-muted)">Estimated Pond Volume</p>

        {primaryVal !== null ? (
          <div key={animKey} className="flex flex-col gap-4 animate-ripple-in">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-5xl font-medium text-(--color-brand-red) leading-none">
                {formatNumber(primaryVal)}
              </span>
              <span className="text-lg text-(--color-brand-text-muted)">{volUnit}</span>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-(--color-brand-border)">
              <Row
                label="Also in"
                value={volUnit === 'gallons'
                  ? `${formatNumber(result!.volumeLiters)} L`
                  : `${formatNumber(result!.volumeGallons)} gal`}
              />
            </div>

            <p className="text-xs text-(--color-brand-text-muted) leading-relaxed bg-(--color-brand-panel) rounded-xl p-3 border border-(--color-brand-border)">
              💡 For a more accurate estimate, repeat with a different salt amount and average the two results.
            </p>

            <button
              type="button" onClick={handleCopy}
              className={[
                'self-start px-4 py-2 rounded-lg text-xs border transition-all duration-200 cursor-pointer',
                copied
                  ? 'border-(--color-brand-success) text-(--color-brand-success)'
                  : 'border-(--color-brand-border) text-(--color-brand-text-muted) hover:border-(--color-brand-red) hover:text-(--color-brand-red)',
              ].join(' ')}
            >
              {copied ? '✓ Copied!' : '⧉ Copy result'}
            </button>
          </div>

        ) : (
          <div className="flex flex-col items-center justify-center flex-1 py-10 gap-3 text-(--color-brand-text-muted) text-center">
            <svg className="opacity-30" width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="20" stroke="currentColor" strokeWidth="1.5" />
              <path d="M22 13v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="22" cy="30" r="1.75" fill="currentColor" />
            </svg>
            <p className="text-sm">Enter salt added and resulting salinity to estimate</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-(--color-brand-text-muted) opacity-60">{label}</span>
      <span className="text-sm text-(--color-brand-text) font-mono">{value}</span>
    </div>
  );
}

function FieldMsg({ err }: { err?: ValidationError }) {
  if (!err) return null;
  const isError = err.severity === 'error';
  return (
    <p className={`text-xs flex items-start gap-1.5 leading-relaxed ${isError ? 'text-(--color-brand-danger)' : 'text-(--color-brand-warning)'}`}>
      <span className="mt-0.5">{isError ? '✖' : '⚠'}</span>
      {err.message}
    </p>
  );
}
