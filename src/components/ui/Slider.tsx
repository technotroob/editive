import React from 'react';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  defaultValue?: number;
  onChange: (val: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  defaultValue,
  onChange,
}) => {
  // Calculate fill percentage for the track color
  const pct = Math.round(((value - min) / (max - min)) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
      {/* Row: label + value */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              minWidth: '34px',
              textAlign: 'right',
              fontWeight: 500,
            }}
          >
            {value}{unit}
          </span>
          {defaultValue !== undefined && value !== defaultValue && (
            <button
              type="button"
              onClick={() => onChange(defaultValue)}
              style={{
                fontSize: '10px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                lineHeight: 1,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              title="Reset to default"
            >
              ↺
            </button>
          )}
        </div>
      </div>

      {/* Slider with accent fill */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="edv-slider"
        style={{
          background: `linear-gradient(to right, var(--accent) ${pct}%, var(--border-strong) ${pct}%)`,
        }}
      />
    </div>
  );
};
