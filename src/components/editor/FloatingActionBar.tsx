import React from 'react';
import {
  EditorLayer,
  TextLayer,
  ImageLayer,
  ShapeLayer,
  CanvasDocument,
} from '../../engine/LayerModel';
import { IconButton } from '../ui/IconButton';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  Trash2,
  Scissors,
  Sliders,
  Sparkles,
  Plus,
  Minus,
} from 'lucide-react';

export interface FloatingActionBarProps {
  selectedLayer: EditorLayer | null;
  document: CanvasDocument;
  onUpdateLayer: (id: string, updates: Partial<EditorLayer>) => void;
  onDuplicateLayer: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onRunQuickRemoveBG: (layer: ImageLayer) => void;
}

const QUICK_FONTS = [
  'Outfit, sans-serif',
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Playfair Display, serif',
  'Montserrat, sans-serif',
  'JetBrains Mono, monospace',
];

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  selectedLayer,
  document: doc,
  onUpdateLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onRunQuickRemoveBG,
}) => {
  if (!selectedLayer) {
    return (
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 40,
          boxShadow: 'var(--shadow-md)',
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Canvas: <strong style={{ color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>{doc.width} × {doc.height} px</strong>
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'var(--bg-glass-elevated)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 40,
        boxShadow: 'var(--shadow-lg)',
      }}
      className="animate-fade-in"
    >
      {/* 1. TEXT QUICK ACTIONS */}
      {selectedLayer.type === 'text' && (
        <>
          {/* Font Family Dropdown */}
          <select
            value={(selectedLayer as TextLayer).fontFamily}
            onChange={(e) => onUpdateLayer(selectedLayer.id, { fontFamily: e.target.value })}
            style={{
              backgroundColor: 'var(--bg-panel)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              maxWidth: '130px',
              cursor: 'pointer',
            }}
          >
            {QUICK_FONTS.map((f) => (
              <option key={f} value={f}>
                {f.split(',')[0]}
              </option>
            ))}
          </select>

          {/* Font Size Increment */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: 'var(--bg-panel)', borderRadius: 'var(--radius-xs)', padding: '2px 4px', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() =>
                onUpdateLayer(selectedLayer.id, {
                  fontSize: Math.max(12, ((selectedLayer as TextLayer).fontSize || 24) - 4),
                })
              }
              style={{ color: 'var(--text-secondary)', padding: '2px', cursor: 'pointer' }}
            >
              <Minus size={12} />
            </button>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', minWidth: '24px', textAlign: 'center', fontWeight: 600 }}>
              {(selectedLayer as TextLayer).fontSize}
            </span>
            <button
              type="button"
              onClick={() =>
                onUpdateLayer(selectedLayer.id, {
                  fontSize: Math.min(200, ((selectedLayer as TextLayer).fontSize || 24) + 4),
                })
              }
              style={{ color: 'var(--text-secondary)', padding: '2px', cursor: 'pointer' }}
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Text Color Swatch */}
          <input
            type="color"
            value={(selectedLayer as TextLayer).fill?.startsWith('#') ? (selectedLayer as TextLayer).fill : '#FFFFFF'}
            onChange={(e) => onUpdateLayer(selectedLayer.id, { fill: e.target.value })}
            style={{
              width: '24px',
              height: '24px',
              padding: 0,
              border: '1px solid var(--border-medium)',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: 'transparent',
            }}
            title="Text Color"
          />

          {/* Bold, Italic Buttons */}
          <div style={{ display: 'flex', gap: '2px' }}>
            <IconButton
              size="sm"
              icon={<Bold size={13} />}
              tooltip="Bold"
              isActive={Number((selectedLayer as TextLayer).fontWeight) >= 700}
              onClick={() =>
                onUpdateLayer(selectedLayer.id, {
                  fontWeight: Number((selectedLayer as TextLayer).fontWeight) >= 700 ? 400 : 700,
                })
              }
            />
            <IconButton
              size="sm"
              icon={<Italic size={13} />}
              tooltip="Italic"
              isActive={(selectedLayer as TextLayer).fontStyle === 'italic'}
              onClick={() =>
                onUpdateLayer(selectedLayer.id, {
                  fontStyle: (selectedLayer as TextLayer).fontStyle === 'italic' ? 'normal' : 'italic',
                })
              }
            />
          </div>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)' }} />
        </>
      )}

      {/* 2. IMAGE QUICK ACTIONS */}
      {selectedLayer.type === 'image' && (
        <>
          <button
            type="button"
            onClick={() => onRunQuickRemoveBG(selectedLayer as ImageLayer)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: 'var(--radius-xs)',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#60A5FA',
              cursor: 'pointer',
            }}
          >
            <Scissors size={13} />
            <span>Remove BG</span>
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)' }} />
        </>
      )}

      {/* 3. SHAPE QUICK ACTIONS */}
      {selectedLayer.type === 'shape' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Fill</span>
            <input
              type="color"
              value={(selectedLayer as ShapeLayer).fill?.startsWith('#') ? (selectedLayer as ShapeLayer).fill : '#3B82F6'}
              onChange={(e) => onUpdateLayer(selectedLayer.id, { fill: e.target.value })}
              style={{
                width: '24px',
                height: '24px',
                padding: 0,
                border: '1px solid var(--border-medium)',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: 'transparent',
              }}
              title="Fill Color"
            />
          </div>
          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)' }} />
        </>
      )}

      {/* GLOBAL ACTIONS: DUPLICATE & DELETE */}
      <IconButton
        size="sm"
        icon={<Copy size={13} />}
        tooltip="Duplicate"
        onClick={() => onDuplicateLayer(selectedLayer.id)}
      />
      <IconButton
        size="sm"
        icon={<Trash2 size={13} color="var(--status-error)" />}
        tooltip="Delete"
        onClick={() => onDeleteLayer(selectedLayer.id)}
      />
    </div>
  );
};
