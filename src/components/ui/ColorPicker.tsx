import React, { useState } from 'react';
import { PaletteExtractor, ExtractedColor } from '../../engine/PaletteExtractor';

export interface ColorPickerProps {
  label?: string;
  color: string;
  onChange: (hex: string) => void;
  recentColors?: string[];
  extractedPalette?: ExtractedColor[];
}

const DEFAULT_PRESET_PALETTE = [
  '#FFFFFF', '#F3F4F6', '#9CA3AF', '#4B5563', '#1F2937', '#000000',
  '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6',
  '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E',
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  color,
  onChange,
  recentColors = [],
  extractedPalette = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Color Preview Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-medium)',
            backgroundColor: color === 'transparent' ? 'transparent' : color,
            backgroundImage:
              color === 'transparent'
                ? 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)'
                : 'none',
            backgroundSize: '8px 8px',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: 'var(--shadow-sm)',
          }}
        />

        {/* Hex Input */}
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            backgroundColor: 'var(--bg-panel-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-primary)',
          }}
        />

        {/* Native Color Input Trigger */}
        <input
          type="color"
          value={color.startsWith('#') && color.length === 7 ? color : '#3B82F6'}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '32px',
            height: '32px',
            padding: 0,
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            backgroundColor: 'transparent',
          }}
        />
      </div>

      {/* Preset Swatches Dropdown */}
      {isOpen && (
        <div
          style={{
            marginTop: '8px',
            padding: '12px',
            backgroundColor: 'var(--bg-panel-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
          className="animate-fade-in"
        >
          {/* Extracted Image Palette */}
          {extractedPalette.length > 0 && (
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                Extracted from Image
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {extractedPalette.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    title={`${c.type} (${c.hex})`}
                    onClick={() => {
                      onChange(c.hex);
                      setIsOpen(false);
                    }}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '4px',
                      backgroundColor: c.hex,
                      border: color.toUpperCase() === c.hex ? '2px solid #FFFFFF' : '1px solid var(--border-subtle)',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Default Swatches */}
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Standard Palette
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {DEFAULT_PRESET_PALETTE.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => {
                    onChange(hex);
                    setIsOpen(false);
                  }}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: hex,
                    border: color.toUpperCase() === hex ? '2px solid #3B82F6' : '1px solid var(--border-subtle)',
                  }}
                />
              ))}
              <button
                type="button"
                title="Transparent"
                onClick={() => {
                  onChange('transparent');
                  setIsOpen(false);
                }}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle)',
                  background: 'linear-gradient(45deg, #EF4444 45%, transparent 50%, #EF4444 55%)',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
