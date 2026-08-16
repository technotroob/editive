'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ImageLayer } from '../../engine/LayerModel';
import { loadImage } from '../../engine/ImageTools';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { X, Eraser, Paintbrush, RotateCcw, Sparkles, Info } from 'lucide-react';

export interface RemoveObjectModalProps {
  isOpen: boolean;
  layer: ImageLayer | null;
  onClose: () => void;
  onRun: (layer: ImageLayer, maskSrc: string) => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

/**
 * Mask painter for Remove Object / Cleanup.
 * The user paints over the object to remove; the white mask is sent to
 * Clipdrop Cleanup via the server route.
 */
export const RemoveObjectModal: React.FC<RemoveObjectModalProps> = ({
  isOpen,
  layer,
  onClose,
  onRun,
  onShowToast,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseSnapshot = useRef<ImageData | null>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [brushSize, setBrushSize] = useState(22);
  const [isErasing, setIsErasing] = useState(false);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });

  const drawImageIntoCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !layer) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = await loadImage(layer.src);
    const MAX = 520;
    const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    canvas.width = w;
    canvas.height = h;
    setDisplaySize({ width: w, height: h });

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    baseSnapshot.current = ctx.getImageData(0, 0, w, h);
  }, [layer]);

  useEffect(() => {
    if (isOpen && layer) {
      drawImageIntoCanvas();
      setIsErasing(false);
      setBrushSize(22);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, layer]);

  if (!isOpen) return null;

  const getPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(((e.clientX - rect.left) / rect.width) * canvas.width),
      y: Math.round(((e.clientY - rect.top) / rect.height) * canvas.height),
    };
  };

  const paint = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    lastPoint.current = getPos(e);
    paint(lastPoint.current, lastPoint.current);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const pos = getPos(e);
    if (lastPoint.current) paint(lastPoint.current, pos);
    lastPoint.current = pos;
  };

  const onPointerUp = () => {
    drawing.current = false;
    lastPoint.current = null;
  };

  const clearMask = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx || !baseSnapshot.current) return;
    ctx.putImageData(baseSnapshot.current, 0, 0);
  };

  const runRemove = () => {
    const canvas = canvasRef.current;
    if (!canvas || !layer) return;
    const maskSrc = canvas.toDataURL('image/png');
    onRun(layer, maskSrc);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(8, 11, 18, 0.78)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
      className="animate-fade-in"
    >
      <div
        style={{
          width: '560px',
          maxWidth: '92vw',
          backgroundColor: 'var(--bg-panel)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--accent-ai)" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              Remove Object / Cleanup
            </span>
          </div>
          <IconButton icon={<X size={16} />} tooltip="Close" onClick={onClose} />
        </div>

        {/* Instructions */}
        <div
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            backgroundColor: 'rgba(72, 79, 88, 0.18)',
          }}
        >
          <Info size={14} color="var(--accent-primary)" style={{ marginTop: '1px', flexShrink: 0 }} />
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            Paint over the object you want to remove. Use the eraser to fix mistakes.
            The painted region is sent to Clipdrop Cleanup to be inpainted away.
          </span>
        </div>

        {/* Canvas */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              position: 'relative',
              maxWidth: '100%',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--studio-grid-bg, #111418)',
              cursor: 'crosshair',
              touchAction: 'none',
            }}
          >
            <canvas
              ref={canvasRef}
              style={{ display: 'block', maxWidth: '100%', maxHeight: '360px', objectFit: 'contain' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            />
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            <button
              type="button"
              onClick={() => setIsErasing(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                border: `1px solid ${!isErasing ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                backgroundColor: !isErasing ? 'rgba(79,142,247,0.12)' : 'var(--bg-panel-elevated)',
                color: 'var(--text-primary)',
              }}
            >
              <Paintbrush size={13} />
              Brush
            </button>
            <button
              type="button"
              onClick={() => setIsErasing(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                border: `1px solid ${isErasing ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                backgroundColor: isErasing ? 'rgba(79,142,247,0.12)' : 'var(--bg-panel-elevated)',
                color: 'var(--text-primary)',
              }}
            >
              <Eraser size={13} />
              Eraser
            </button>
            <input
              type="range"
              min={6}
              max={60}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              style={{ flex: 1, margin: '0 4px' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', width: '34px', textAlign: 'right' }}>
              {brushSize}px
            </span>
            <button
              type="button"
              onClick={clearMask}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-panel-elevated)',
                color: 'var(--text-secondary)',
              }}
            >
              <RotateCcw size={13} />
              Clear
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <button
              type="button"
              onClick={runRemove}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Remove Object & Cleanup
            </button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};