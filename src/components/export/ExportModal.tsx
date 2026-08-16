import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { CanvasEngine } from '../../engine/CanvasEngine';
import { Download, CheckCircle2 } from 'lucide-react';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  engineRef: React.MutableRefObject<CanvasEngine | null>;
  projectTitle: string;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  engineRef,
  projectTitle,
  onShowToast,
}) => {
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [quality, setQuality] = useState(95);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    const engine = engineRef.current;
    if (!engine) return;

    setIsExporting(true);
    try {
      const dataUrl = engine.exportCanvas(format, quality / 100);
      if (dataUrl) {
        const link = document.createElement('a');
        const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
        const cleanTitle = (projectTitle || 'editive_design')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_');
        link.download = `${cleanTitle}.${ext}`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        onShowToast('Design exported successfully!', 'success');
        onClose();
      }
    } catch {
      onShowToast('Failed to export canvas', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const formatsList: { id: 'image/png' | 'image/jpeg' | 'image/webp'; name: string; desc: string }[] = [
    { id: 'image/png', name: 'PNG (Lossless & Alpha)', desc: 'Best for graphics, text, and transparent backgrounds' },
    { id: 'image/jpeg', name: 'JPEG (Standard)', desc: 'Compact file size, best for photography' },
    { id: 'image/webp', name: 'WebP (Modern Web)', desc: 'Ultra-efficient compression for modern web browsers' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Design"
      subtitle="Download high-resolution image asset ready for publication"
      maxWidth="520px"
      footer={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={<Download size={15} />}
            isLoading={isExporting}
            onClick={handleExport}
          >
            Download {format === 'image/jpeg' ? 'JPG' : format === 'image/webp' ? 'WebP' : 'PNG'}
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Format Selector */}
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            File Format
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
            {formatsList.map((f) => {
              const isSelected = format === f.id;

              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  style={{
                    backgroundColor: isSelected ? 'var(--bg-active)' : 'var(--bg-panel-elevated)',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                      {f.name}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {f.desc}
                    </span>
                  </div>
                  {isSelected && <CheckCircle2 size={16} color="var(--accent-primary)" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quality Slider (for lossy formats) */}
        {format !== 'image/png' && (
          <div>
            <Slider
              label="Export Quality"
              value={quality}
              min={50}
              max={100}
              unit="%"
              defaultValue={95}
              onChange={(v) => setQuality(v)}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
