'use client';

import React, { useState } from 'react';
import { AIToolResult } from '../../algorithms/aiProcessors';
import { CheckCircle2, X, Sparkles, Image as ImageIcon, Copy, Check } from 'lucide-react';

export interface AIResultPreviewPanelProps {
  result: AIToolResult;
  onApply: () => void;
  onCancel: () => void;
}

/**
 * Preview / Apply / Cancel workflow for every AI operation.
 * The AI result is shown BEFORE it touches the canvas.
 */
export const AIResultPreviewPanel: React.FC<AIResultPreviewPanelProps> = ({
  result,
  onApply,
  onCancel,
}) => {
  const [copied, setCopied] = useState(false);

  const previewSrc = result.previewUrl || (result.modifiedLayer && 'src' in result.modifiedLayer
    ? (result.modifiedLayer as any).src
    : result.newLayers && result.newLayers.length > 0
      ? (result.newLayers[0] as any).src
      : undefined);

  const hasTextLayers = result.newLayers?.some((l) => l.type === 'text');
  const extractedText = hasTextLayers
    ? result.newLayers!
        .filter((l) => l.type === 'text')
        .map((l) => ('text' in l ? l.text : ''))
        .join('\n')
    : '';

  const handleCopyText = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: '16px',
        bottom: '16px',
        zIndex: 120,
        width: '280px',
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 12px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(79, 142, 247, 0.08)',
        }}
      >
        <Sparkles size={14} color="var(--accent-primary)" />
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
          AI Result Preview
        </span>
        <span style={{ fontSize: '11px', color: 'var(--status-warning)' }}>Review before applying</span>
      </div>

      <div style={{ padding: '12px' }}>
        {previewSrc && (
          <div
            style={{
              width: '100%',
              height: '140px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              backgroundColor: 'var(--studio-grid-bg, #111418)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={previewSrc}
              alt="AI result preview"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>
        )}

        {hasTextLayers && (
          <div
            style={{
              marginTop: '8px',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-panel-elevated)',
              border: '1px solid var(--border-subtle)',
              maxHeight: '120px',
              overflowY: 'auto',
            }}
          >
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Extracted text
            </span>
            <button
              type="button"
              onClick={handleCopyText}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginLeft: '8px',
                fontSize: '10px',
                fontWeight: 600,
                color: copied ? 'var(--status-success)' : 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '1px 6px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-panel)',
                transition: 'color var(--t-fast), border-color var(--t-fast)',
              }}
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {result.newLayers!
                .filter((l) => l.type === 'text')
                .map((l, i) => (
                  <span key={i} style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                    {('text' in l ? l.text : '') || '...'}
                  </span>
                ))}
            </div>
          </div>
        )}

        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: 1.4 }}>
          {result.message}
        </p>

        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button
            type="button"
            onClick={onApply}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 0',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-primary)',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <CheckCircle2 size={14} />
            Apply
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 0',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-panel-elevated)',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              border: '1px solid var(--border-medium)',
              cursor: 'pointer',
            }}
          >
            <X size={14} />
            Cancel
          </button>
        </div>

        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ImageIcon size={12} color="var(--text-muted)" />
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            {result.newLayers ? `${result.newLayers.length} new layer${result.newLayers.length > 1 ? 's' : ''}` : 'Updated existing layer'}
            {' · '}Undo available after applying
          </span>
        </div>
      </div>
    </div>
  );
};