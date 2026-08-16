import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { UnlockEngine, DecomposedDesign } from '../../algorithms/unlockEngine';
import { EditorLayer } from '../../engine/LayerModel';
import {
  Wand2,
  Upload,
  Sparkles,
  Type,
  Image as ImageIcon,
  Square,
  ArrowRight,
} from 'lucide-react';

export interface UnlockDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyUnlockedDesign: (layers: EditorLayer[], width: number, height: number) => void;
}

export const UnlockDesignModal: React.FC<UnlockDesignModalProps> = ({
  isOpen,
  onClose,
  onApplyUnlockedDesign,
}) => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'review'>('upload');
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [decomposedResult, setDecomposedResult] = useState<DecomposedDesign | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        startDecomposition(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const startDecomposition = async (imgSrc: string) => {
    setStep('analyzing');
    setProgressPercent(0);

    try {
      const result = await UnlockEngine.decomposeImage(imgSrc, (p, status) => {
        setProgressPercent(p);
        setProgressStatus(status);
      });

      setDecomposedResult(result);
      setStep('review');
    } catch (err) {
      console.error('Unlock Design analysis failed', err);
      setStep('upload');
    }
  };

  const handleCommit = () => {
    if (decomposedResult) {
      onApplyUnlockedDesign(
        decomposedResult.reconstructedLayers,
        decomposedResult.width,
        decomposedResult.height
      );
      onClose();
    }
  };

  const resetModal = () => {
    setStep('upload');
    setDecomposedResult(null);
    setProgressPercent(0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetModal();
        onClose();
      }}
      title="Unlock Design"
      subtitle="Turn a finished JPG/PNG into editable layers, text, and vector elements"
      maxWidth="720px"
      footer={
        step === 'review' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Button variant="ghost" onClick={resetModal}>
              Upload Another Image
            </Button>
            <Button variant="special" icon={<Sparkles size={16} />} onClick={handleCommit}>
              Reconstruct to Canvas
            </Button>
          </div>
        ) : undefined
      }
    >
      {/* STEP 1: Upload User Image */}
      {step === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Drag & Drop Upload Zone */}
          <label
            style={{
              border: '2px dashed var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-medium)';
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
            }}
          >
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <Upload size={26} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Click to choose an image or drag it here
              </span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Upload any poster, advertisement, menu, screenshot, or social media creative (JPG, PNG, WebP)
              </p>
            </div>
          </label>

          {/* Supported Types Info */}
          <div
            style={{
              backgroundColor: 'var(--bg-panel-elevated)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
              What EDITIVE will recover:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <Type size={14} color="#34D399" />
                <span>Headlines & Text</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <ImageIcon size={14} color="#60A5FA" />
                <span>Subject & Products</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <Square size={14} color="#FBBF24" />
                <span>CTA & Badges</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <Sparkles size={14} color="#A78BFA" />
                <span>Clean Background</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Analyzing Progress */}
      {step === 'analyzing' && (
        <div
          style={{
            padding: '44px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
            }}
            className="animate-pulse"
          >
            <Wand2 size={28} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Unlocking your design...
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {progressStatus}
            </p>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '6px',
              backgroundColor: 'var(--bg-active)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)',
                transition: 'width 200ms ease-out',
              }}
            />
          </div>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {progressPercent}%
          </span>
        </div>
      )}

      {/* STEP 3: Review Detected Regions & Split Comparison */}
      {step === 'review' && decomposedResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Before ↔ After Split View */}
          <div
            style={{
              position: 'relative',
              height: '240px',
              backgroundColor: '#090B10',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Left side: Flat Original */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: `${sliderPosition}%`,
                overflow: 'hidden',
                borderRight: '2px solid #3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#111420',
              }}
            >
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>
                  BEFORE: Flattened Image
                </span>
                <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                  1 dead flat pixel layer (locked & uneditable)
                </p>
              </div>
            </div>

            {/* Right side: Unlocked Editable Layers */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                left: `${sliderPosition}%`,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1E1B4B',
              }}
            >
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#A78BFA' }}>
                  AFTER: Recovered Elements
                </span>
                <p style={{ fontSize: '11px', color: '#C084FC', marginTop: '4px' }}>
                  {decomposedResult.reconstructedLayers.length} independent editable layers
                </p>
              </div>
            </div>

            {/* Comparison Slider Handle */}
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '20px',
                right: '20px',
                width: 'calc(100% - 40px)',
                zIndex: 10,
              }}
            />
          </div>

          {/* Detected Elements Grid */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Detected Visual Elements ({decomposedResult.detectedRegions.length})
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
              {decomposedResult.detectedRegions.map((region) => (
                <div
                  key={region.id}
                  style={{
                    backgroundColor: 'var(--bg-panel-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {region.type === 'text' && <Type size={14} color="#34D399" />}
                    {region.type === 'image' && <ImageIcon size={14} color="#60A5FA" />}
                    {region.type === 'shape' && <Square size={14} color="#FBBF24" />}
                    {region.type === 'background' && <Square size={14} color="#64748B" />}

                    <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {region.label}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--status-success)',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      padding: '2px 6px',
                      borderRadius: '3px',
                    }}
                  >
                    {region.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
