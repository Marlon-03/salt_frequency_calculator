'use client';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface UnitToggleProps<T extends string> {
  options:  Option<T>[];
  value:    T;
  onChange: (v: T) => void;
}

export function UnitToggle<T extends string>({ options, value, onChange }: UnitToggleProps<T>) {
  return (
    <div className="flex border-l border-(--color-brand-border)" role="group" aria-label="Unit selector">
      {options.map((opt, i) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={[
            'px-3 py-2 text-xs font-mono font-medium transition-all duration-150 whitespace-nowrap cursor-pointer',
            i > 0 ? 'border-l border-(--color-brand-border)' : '',
            value === opt.value
              ? 'bg-(--color-brand-red) text-white'
              : 'text-(--color-brand-text-muted) hover:text-(--color-brand-text) hover:bg-(--color-brand-muted)',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
