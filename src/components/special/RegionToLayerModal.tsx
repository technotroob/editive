import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ImageLayer } from '../../engine/LayerModel';
import { UnlockEngine } from '../../algorithms/unlockEngine';
import { Scan, Sparkles } from 'lucide-react';

export interface RegionToLayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImageLayer: ImageLayer | null;
  onConvertRegionToLayer: (newLayer: ImageLayer) => void;
}

export const RegionToLayerModal: React.FC<RegionToLayerModalProps> = ({
  isOpen,
  onClose,
  selectedImageLayer,
  onConvertRegionToLayer,
}) => {
  const [layerName, setLayerName] = useState('Extracted Region Element');
  const [cropX, setCropX] = useState(50);
  const [cropY, setCropY] = useState(50);
  const [cropW, setCropW] = useState(250);
  const [cropH, setCropH] = useState(250);

  const handleConvert = () => {
    if (!selectedImageLayer) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedImageLayer.src;

    img.onload = () => {
      const extracted = UnlockEngine.sliceRegionToLayer(
        img,
        { x: cropX, y: cropY, width: cropW, height: cropH },
        layerName
      );
      onConvertRegionToLayer(extracted);
      onClose();
    };
  };

  if (!selectedImageLayer) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Manual Region to Layer"
        subtitle="Select a region on an image to convert it into an independent layer"
        maxWidth="480px"
      >
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
          Please select an image layer on the canvas first to extract a region.
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manual Region to Layer"
      subtitle="Recover missed visual elements even when automatic detection does not"
      maxWidth="540px"
      footer={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={<Sparkles size={15} />} onClick={handleConvert}>
            Convert to Layer
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>New Layer Name</span>
          <input
            type="text"
            value={layerName}
            onChange={(e) => setLayerName(e.target.value)}
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Region X (px)</span>
            <input
              type="number"
              value={cropX}
              onChange={(e) => setCropX(Number(e.target.value))}
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
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Region Y (px)</span>
            <input
              type="number"
              value={cropY}
              onChange={(e) => setCropY(Number(e.target.value))}
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
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Region Width (px)</span>
            <input
              type="number"
              value={cropW}
              onChange={(e) => setCropW(Number(e.target.value))}
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
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Region Height (px)</span>
            <input
              type="number"
              value={cropH}
              onChange={(e) => setCropH(Number(e.target.value))}
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
    </Modal>
  );
};
