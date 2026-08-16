import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CanvasDocument } from '../../engine/LayerModel';
import { ReframeEngine, REFRAME_PRESETS, ReframePreset } from '../../algorithms/reframeEngine';
import { LayoutTemplate, Sparkles, Check, ArrowRight } from 'lucide-react';

export interface SmartReframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: CanvasDocument;
  onApplyReframe: (reframedDoc: CanvasDocument) => void;
}

export const SmartReframeModal: React.FC<SmartReframeModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  onApplyReframe,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<ReframePreset>(REFRAME_PRESETS[1]); // Default Story 9:16
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApply = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 200));

    const reframed = ReframeEngine.reframeDocument(doc, selectedPreset.width, selectedPreset.height);
    onApplyReframe(reframed);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Smart Reframe"
      subtitle="Intelligently adapt composition to a new format while preserving subjects and typography hierarchy"
      maxWidth="720px"
      footer={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="special"
            icon={<Sparkles size={15} />}
            isLoading={isProcessing}
            onClick={handleApply}
          >
            Apply {selectedPreset.aspectRatioLabel} Layout
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Preset Selector Grid */}
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Choose Target Format
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginTop: '8px' }}>
            {REFRAME_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPreset(preset)}
                  style={{
                    backgroundColor: isSelected ? 'var(--bg-active)' : 'var(--bg-panel-elevated)',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 700, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                    {preset.aspectRatioLabel}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    {preset.name}
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {preset.width} × {preset.height}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side by Side Visual Comparison */}
        <div
          style={{
            backgroundColor: 'var(--bg-panel-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: '16px',
          }}
        >
          {/* Current Canvas */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Current ({doc.width} × {doc.height})
            </span>
            <div
              style={{
                width: '120px',
                height: `${Math.round(120 * (doc.height / doc.width))}px`,
                maxHeight: '160px',
                backgroundColor: doc.backgroundColor || '#0F172A',
                border: '1px solid var(--border-medium)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                {doc.layers.length} Layers
              </span>
            </div>
          </div>

          <ArrowRight size={20} color="var(--accent-primary)" />

          {/* Reframed Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 600 }}>
              Reframed ({selectedPreset.width} × {selectedPreset.height})
            </span>
            <div
              style={{
                width: '120px',
                height: `${Math.round(120 * (selectedPreset.height / selectedPreset.width))}px`,
                maxHeight: '160px',
                backgroundColor: doc.backgroundColor || '#0F172A',
                border: '2px solid var(--accent-primary)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
              }}
            >
              <span style={{ fontSize: '10px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                {selectedPreset.aspectRatioLabel} Reflow
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
