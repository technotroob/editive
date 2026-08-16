import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
  Check,
  Loader2,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';

export type SaveState = 'saved' | 'saving' | 'unsaved' | 'error';

export interface TopBarProps {
  projectTitle: string;
  saveState: SaveState;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onProjectTitleChange: (newTitle: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onOpenExportModal: () => void;
  onGoToDashboard: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  projectTitle,
  saveState,
  canUndo,
  canRedo,
  zoom,
  onProjectTitleChange,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onOpenExportModal,
  onGoToDashboard,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(projectTitle);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim()) {
      onProjectTitleChange(tempTitle.trim());
    } else {
      setTempTitle(projectTitle);
    }
  };

  const SaveIndicator = () => {
    switch (saveState) {
      case 'saving':
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <Loader2 size={10} className="animate-pulse" />
            Saving
          </span>
        );
      case 'saved':
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-success)', fontSize: '11px', fontWeight: 500 }}>
            <Check size={10} />
            Saved
          </span>
        );
      case 'unsaved':
        return (
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
            Unsaved
          </span>
        );
      case 'error':
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-error)', fontSize: '11px' }}>
            <AlertCircle size={10} />
            Save failed
          </span>
        );
    }
  };

  return (
    <header
      style={{
        height: '52px',
        backgroundColor: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 100,
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* ── LEFT: Brand + Project Title ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
        {/* EDITIVE Logo */}
        <button
          type="button"
          onClick={onGoToDashboard}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
            padding: '4px 8px 4px 4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid transparent',
            transition: 'background var(--t-fast)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-panel-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          title="Back to dashboard"
        >
          {/* E mark */}
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '14px',
              color: '#FFFFFF',
              flexShrink: 0,
            }}
          >
            E
          </div>
          {/* Wordmark */}
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '1.5px',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
            }}
          >
            EDITIVE
          </span>
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', flexShrink: 0 }} />

        {/* Project Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {isEditingTitle ? (
            <input
              type="text"
              value={tempTitle}
              autoFocus
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') { setTempTitle(projectTitle); setIsEditingTitle(false); }
              }}
              className="edv-input"
              style={{ fontSize: '13px', fontWeight: 500, maxWidth: '220px', padding: '4px 8px' }}
            />
          ) : (
            <button
              type="button"
              onClick={() => { setTempTitle(projectTitle); setIsEditingTitle(true); }}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                padding: '4px 6px',
                borderRadius: 'var(--radius-xs)',
                background: 'transparent',
                border: '1px solid transparent',
                cursor: 'pointer',
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all var(--t-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.background = 'var(--bg-panel-elevated)';
                e.currentTarget.style.borderColor = 'var(--border-medium)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              title="Click to rename"
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{projectTitle}</span>
              <ChevronDown size={11} style={{ opacity: 0.5, flexShrink: 0 }} />
            </button>
          )}

          <SaveIndicator />
        </div>
      </div>

      {/* ── CENTER: History & Zoom ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          background: 'var(--bg-workspace)',
          padding: '3px 6px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}
      >
        <IconButton
          size="sm"
          icon={<Undo2 size={14} />}
          tooltip="Undo (Ctrl+Z)"
          shortcut="Ctrl+Z"
          disabled={!canUndo}
          onClick={onUndo}
        />
        <IconButton
          size="sm"
          icon={<Redo2 size={14} />}
          tooltip="Redo (Ctrl+Y)"
          shortcut="Ctrl+Y"
          disabled={!canRedo}
          onClick={onRedo}
        />

        <div style={{ width: '1px', height: '14px', background: 'var(--border-subtle)', margin: '0 4px' }} />

        <IconButton
          size="sm"
          icon={<ZoomOut size={14} />}
          tooltip="Zoom Out"
          onClick={onZoomOut}
        />
        <button
          type="button"
          onClick={onResetZoom}
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            padding: '3px 8px',
            minWidth: '42px',
            textAlign: 'center',
            background: 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-xs)',
            cursor: 'pointer',
            transition: 'color var(--t-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          title="Reset zoom to 100%"
        >
          {Math.round(zoom * 100)}%
        </button>
        <IconButton
          size="sm"
          icon={<ZoomIn size={14} />}
          tooltip="Zoom In"
          onClick={onZoomIn}
        />
      </div>

      {/* ── RIGHT: Export ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
        <Button
          variant="primary"
          size="sm"
          icon={<Download size={13} />}
          onClick={onOpenExportModal}
        >
          Export
        </Button>
      </div>
    </header>
  );
};
