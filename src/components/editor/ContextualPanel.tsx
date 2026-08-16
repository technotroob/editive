import React from 'react';
import {
  EditorLayer,
  ImageLayer,
  TextLayer,
  ShapeLayer,
  CanvasDocument,
  DEFAULT_IMAGE_ADJUSTMENTS,
} from '../../engine/LayerModel';
import { Slider } from '../ui/Slider';
import { ColorPicker } from '../ui/ColorPicker';
import { IconButton } from '../ui/IconButton';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  Sparkles,
  Sliders,
  Type,
  Square,
  Palette,
  Maximize,
} from 'lucide-react';
import { REFRAME_PRESETS } from '../../algorithms/reframeEngine';

export interface ContextualPanelProps {
  document: CanvasDocument;
  selectedLayers: EditorLayer[];
  onUpdateLayer: (id: string, updates: Partial<EditorLayer>) => void;
  onUpdateCanvas: (updates: Partial<CanvasDocument>) => void;
}

const GOOGLE_FONTS = [
  'Outfit, sans-serif',
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Playfair Display, serif',
  'Montserrat, sans-serif',
  'JetBrains Mono, monospace',
  'Oswald, sans-serif',
  'Poppins, sans-serif',
];

export const ContextualPanel: React.FC<ContextualPanelProps> = ({
  document: doc,
  selectedLayers,
  onUpdateLayer,
  onUpdateCanvas,
}) => {
  const selectedLayer = selectedLayers.length === 1 ? selectedLayers[0] : null;

  // 1. Render Image Inspector
  const renderImageInspector = (layer: ImageLayer) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Transform & Geometry */}
        <div>
          <div className="edv-section-label">Transform &amp; Layout</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Width</span>
              <input
                type="number"
                value={layer.width}
                onChange={(e) => onUpdateLayer(layer.id, { width: Number(e.target.value) })}
                className="edv-number"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Height</span>
              <input
                type="number"
                value={layer.height}
                onChange={(e) => onUpdateLayer(layer.id, { height: Number(e.target.value) })}
                className="edv-number"
              />
            </div>
          </div>

          {/* Flip & Corner Radius */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <IconButton
              icon={<FlipHorizontal size={16} />}
              tooltip="Flip Horizontal"
              isActive={layer.flipHorizontal}
              onClick={() => onUpdateLayer(layer.id, { flipHorizontal: !layer.flipHorizontal })}
            />
            <IconButton
              icon={<FlipVertical size={16} />}
              tooltip="Flip Vertical"
              isActive={layer.flipVertical}
              onClick={() => onUpdateLayer(layer.id, { flipVertical: !layer.flipVertical })}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <Slider
              label="Corner Radius"
              value={layer.cornerRadius || 0}
              min={0}
              max={100}
              unit="px"
              defaultValue={0}
              onChange={(v) => onUpdateLayer(layer.id, { cornerRadius: v })}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <Slider
              label="Opacity"
              value={Math.round((layer.opacity ?? 1) * 100)}
              min={0}
              max={100}
              unit="%"
              defaultValue={100}
              onChange={(v) => onUpdateLayer(layer.id, { opacity: v / 100 })}
            />
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Adjustments */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div className="edv-section-label" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>Image Adjustments</div>
            <button
              type="button"
              onClick={() => onUpdateLayer(layer.id, { adjustments: { ...DEFAULT_IMAGE_ADJUSTMENTS } })}
              style={{ fontSize: '11px', color: 'var(--accent-primary)', cursor: 'pointer' }}
            >
              Reset All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Slider
              label="Brightness"
              value={layer.adjustments.brightness}
              min={-100}
              max={100}
              defaultValue={0}
              onChange={(v) =>
                onUpdateLayer(layer.id, { adjustments: { ...layer.adjustments, brightness: v } })
              }
            />
            <Slider
              label="Contrast"
              value={layer.adjustments.contrast}
              min={-100}
              max={100}
              defaultValue={0}
              onChange={(v) =>
                onUpdateLayer(layer.id, { adjustments: { ...layer.adjustments, contrast: v } })
              }
            />
            <Slider
              label="Saturation"
              value={layer.adjustments.saturation}
              min={-100}
              max={100}
              defaultValue={0}
              onChange={(v) =>
                onUpdateLayer(layer.id, { adjustments: { ...layer.adjustments, saturation: v } })
              }
            />
            <Slider
              label="Hue Rotate"
              value={layer.adjustments.hue}
              min={-180}
              max={180}
              unit="°"
              defaultValue={0}
              onChange={(v) =>
                onUpdateLayer(layer.id, { adjustments: { ...layer.adjustments, hue: v } })
              }
            />
            <Slider
              label="Blur"
              value={layer.adjustments.blur}
              min={0}
              max={30}
              unit="px"
              defaultValue={0}
              onChange={(v) =>
                onUpdateLayer(layer.id, { adjustments: { ...layer.adjustments, blur: v } })
              }
            />
            <Slider
              label="Grayscale"
              value={layer.adjustments.grayscale}
              min={0}
              max={100}
              unit="%"
              defaultValue={0}
              onChange={(v) =>
                onUpdateLayer(layer.id, { adjustments: { ...layer.adjustments, grayscale: v } })
              }
            />
            <Slider
              label="Sepia"
              value={layer.adjustments.sepia}
              min={0}
              max={100}
              unit="%"
              defaultValue={0}
              onChange={(v) =>
                onUpdateLayer(layer.id, { adjustments: { ...layer.adjustments, sepia: v } })
              }
            />
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Effects: Drop Shadow */}
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Effects
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <input
              type="checkbox"
              id="shadow-toggle"
              checked={layer.effects.shadow.enabled}
              onChange={(e) =>
                onUpdateLayer(layer.id, {
                  effects: {
                    ...layer.effects,
                    shadow: { ...layer.effects.shadow, enabled: e.target.checked },
                  },
                })
              }
            />
            <label htmlFor="shadow-toggle" style={{ fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
              Drop Shadow
            </label>
          </div>

          {layer.effects.shadow.enabled && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <Slider
                label="Blur"
                value={layer.effects.shadow.blur}
                min={0}
                max={50}
                unit="px"
                onChange={(v) =>
                  onUpdateLayer(layer.id, {
                    effects: {
                      ...layer.effects,
                      shadow: { ...layer.effects.shadow, blur: v },
                    },
                  })
                }
              />
              <Slider
                label="Distance Y"
                value={layer.effects.shadow.offsetY}
                min={-50}
                max={50}
                unit="px"
                onChange={(v) =>
                  onUpdateLayer(layer.id, {
                    effects: {
                      ...layer.effects,
                      shadow: { ...layer.effects.shadow, offsetY: v },
                    },
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // 2. Render Text Inspector
  const renderTextInspector = (layer: TextLayer) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Content Textarea */}
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Text Content
          </span>
          <textarea
            value={layer.text}
            onChange={(e) => onUpdateLayer(layer.id, { text: e.target.value })}
            rows={3}
            style={{
              width: '100%',
              marginTop: '6px',
              backgroundColor: 'var(--bg-panel-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              padding: '8px',
              fontSize: '13px',
              color: 'var(--text-primary)',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Typography */}
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Typography
          </span>

          {/* Font Family Selector */}
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Font Family</span>
            <select
              value={layer.fontFamily}
              onChange={(e) => onUpdateLayer(layer.id, { fontFamily: e.target.value })}
              style={{
                width: '100%',
                marginTop: '4px',
                backgroundColor: 'var(--bg-panel-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '6px 8px',
                fontSize: '12px',
                color: 'var(--text-primary)',
              }}
            >
              {GOOGLE_FONTS.map((f) => (
                <option key={f} value={f}>
                  {f.split(',')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Size & Weight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Size (px)</span>
              <input
                type="number"
                value={layer.fontSize}
                onChange={(e) => onUpdateLayer(layer.id, { fontSize: Number(e.target.value) })}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  backgroundColor: 'var(--bg-panel-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '6px 8px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Weight</span>
              <select
                value={layer.fontWeight}
                onChange={(e) => onUpdateLayer(layer.id, { fontWeight: Number(e.target.value) })}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  backgroundColor: 'var(--bg-panel-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '6px 8px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
              >
                <option value={300}>Light (300)</option>
                <option value={400}>Regular (400)</option>
                <option value={600}>Semibold (600)</option>
                <option value={700}>Bold (700)</option>
                <option value={800}>Extra Bold (800)</option>
                <option value={900}>Black (900)</option>
              </select>
            </div>
          </div>

          {/* Style & Alignment Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <IconButton
                icon={<Bold size={16} />}
                tooltip="Bold"
                isActive={Number(layer.fontWeight) >= 700}
                onClick={() =>
                  onUpdateLayer(layer.id, { fontWeight: Number(layer.fontWeight) >= 700 ? 400 : 700 })
                }
              />
              <IconButton
                icon={<Italic size={16} />}
                tooltip="Italic"
                isActive={layer.fontStyle === 'italic'}
                onClick={() =>
                  onUpdateLayer(layer.id, { fontStyle: layer.fontStyle === 'italic' ? 'normal' : 'italic' })
                }
              />
              <IconButton
                icon={<Underline size={16} />}
                tooltip="Underline"
                isActive={layer.textDecoration === 'underline'}
                onClick={() =>
                  onUpdateLayer(layer.id, {
                    textDecoration: layer.textDecoration === 'underline' ? 'none' : 'underline',
                  })
                }
              />
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              <IconButton
                icon={<AlignLeft size={16} />}
                tooltip="Align Left"
                isActive={layer.textAlign === 'left'}
                onClick={() => onUpdateLayer(layer.id, { textAlign: 'left' })}
              />
              <IconButton
                icon={<AlignCenter size={16} />}
                tooltip="Align Center"
                isActive={layer.textAlign === 'center'}
                onClick={() => onUpdateLayer(layer.id, { textAlign: 'center' })}
              />
              <IconButton
                icon={<AlignRight size={16} />}
                tooltip="Align Right"
                isActive={layer.textAlign === 'right'}
                onClick={() => onUpdateLayer(layer.id, { textAlign: 'right' })}
              />
            </div>
          </div>

          {/* Color Picker */}
          <div style={{ marginTop: '12px' }}>
            <ColorPicker
              label="Text Color"
              color={layer.fill}
              onChange={(hex) => onUpdateLayer(layer.id, { fill: hex })}
            />
          </div>

          {/* Letter Spacing & Line Height */}
          <div style={{ marginTop: '12px' }}>
            <Slider
              label="Letter Spacing"
              value={layer.letterSpacing || 0}
              min={-5}
              max={20}
              unit="px"
              defaultValue={0}
              onChange={(v) => onUpdateLayer(layer.id, { letterSpacing: v })}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <Slider
              label="Line Height"
              value={Math.round((layer.lineHeight || 1.25) * 100)}
              min={80}
              max={250}
              unit="%"
              defaultValue={125}
              onChange={(v) => onUpdateLayer(layer.id, { lineHeight: v / 100 })}
            />
          </div>
        </div>
      </div>
    );
  };

  // 3. Render Shape Inspector
  const renderShapeInspector = (layer: ShapeLayer) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Shape Geometry
          </span>

          <div style={{ marginTop: '8px' }}>
            <ColorPicker
              label="Fill Color"
              color={layer.fill}
              onChange={(hex) => onUpdateLayer(layer.id, { fill: hex })}
            />
          </div>

          <div style={{ marginTop: '12px' }}>
            <ColorPicker
              label="Border / Stroke Color"
              color={layer.stroke}
              onChange={(hex) => onUpdateLayer(layer.id, { stroke: hex })}
            />
          </div>

          <div style={{ marginTop: '12px' }}>
            <Slider
              label="Border Width"
              value={layer.strokeWidth}
              min={0}
              max={30}
              unit="px"
              defaultValue={0}
              onChange={(v) => onUpdateLayer(layer.id, { strokeWidth: v })}
            />
          </div>

          {layer.shapeType === 'rounded-rect' && (
            <div style={{ marginTop: '10px' }}>
              <Slider
                label="Corner Radius"
                value={layer.cornerRadius}
                min={0}
                max={100}
                unit="px"
                defaultValue={12}
                onChange={(v) => onUpdateLayer(layer.id, { cornerRadius: v })}
              />
            </div>
          )}

          <div style={{ marginTop: '10px' }}>
            <Slider
              label="Opacity"
              value={Math.round((layer.opacity ?? 1) * 100)}
              min={0}
              max={100}
              unit="%"
              defaultValue={100}
              onChange={(v) => onUpdateLayer(layer.id, { opacity: v / 100 })}
            />
          </div>
        </div>
      </div>
    );
  };

  // 4. Render Canvas Inspector (when no layer selected)
  const renderCanvasInspector = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Canvas Dimensions
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Width (px)</span>
              <input
                type="number"
                value={doc.width}
                onChange={(e) => onUpdateCanvas({ width: Number(e.target.value) })}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  backgroundColor: 'var(--bg-panel-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '6px 8px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Height (px)</span>
              <input
                type="number"
                value={doc.height}
                onChange={(e) => onUpdateCanvas({ height: Number(e.target.value) })}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  backgroundColor: 'var(--bg-panel-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '6px 8px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Format Presets */}
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Canvas Presets
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
            {REFRAME_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onUpdateCanvas({ width: p.width, height: p.height })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor:
                    doc.width === p.width && doc.height === p.height
                      ? 'var(--bg-active)'
                      : 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span>{p.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {p.aspectRatioLabel}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Canvas Background Color */}
        <div>
          <ColorPicker
            label="Canvas Background Color"
            color={doc.backgroundColor}
            onChange={(hex) => onUpdateCanvas({ backgroundColor: hex })}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: '16px',
        overflowY: 'auto',
        flex: 1,
        color: 'var(--text-primary)',
      }}
    >
      <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          {selectedLayer
            ? `${selectedLayer.name} (${selectedLayer.type.toUpperCase()})`
            : 'Canvas Properties'}
        </h4>
      </div>

      {selectedLayer?.type === 'image' && renderImageInspector(selectedLayer as ImageLayer)}
      {selectedLayer?.type === 'text' && renderTextInspector(selectedLayer as TextLayer)}
      {selectedLayer?.type === 'shape' && renderShapeInspector(selectedLayer as ShapeLayer)}
      {!selectedLayer && renderCanvasInspector()}
    </div>
  );
};
