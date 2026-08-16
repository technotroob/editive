import React from 'react';
import {
  EditorLayer,
} from '../../engine/LayerModel';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Type,
  Square,
  PenTool,
  Folder,
  Sparkles,
} from 'lucide-react';
import { IconButton } from '../ui/IconButton';

export interface LayersPanelProps {
  layers: EditorLayer[];
  selectedLayerIds: string[];
  onSelectLayer: (id: string, multi?: boolean) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onDeleteLayer: (id: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  selectedLayerIds,
  onSelectLayer,
  onToggleVisibility,
  onToggleLock,
  onBringForward,
  onSendBackward,
  onDuplicateLayer,
  onDeleteLayer,
}) => {
  const getLayerIcon = (layer: EditorLayer) => {
    switch (layer.type) {
      case 'image':
        return <ImageIcon size={14} color="#60A5FA" />;
      case 'text':
        return <Type size={14} color="#34D399" />;
      case 'shape':
        return <Square size={14} color="#FBBF24" />;
      case 'draw':
        return <PenTool size={14} color="#F472B6" />;
      case 'group':
        return <Folder size={14} color="#A78BFA" />;
    }
  };

  // Render layers in reverse order so topmost layer on canvas appears at the top of the list
  const displayLayers = [...layers].reverse();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--bg-panel)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          Layers ({layers.length})
        </span>
      </div>

      {/* Layer List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {displayLayers.length === 0 ? (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '12px',
            }}
          >
            No layers on canvas. Add text, shapes, or images to begin.
          </div>
        ) : (
          displayLayers.map((layer) => {
            const isSelected = selectedLayerIds.includes(layer.id);

            return (
              <div
                key={layer.id}
                onClick={(e) => onSelectLayer(layer.id, e.shiftKey)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: isSelected ? 'var(--bg-active)' : 'transparent',
                  border: isSelected ? '1px solid var(--border-medium)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-panel-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {/* Visibility Eye */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(layer.id);
                  }}
                  style={{ color: layer.visible ? 'var(--text-secondary)' : 'var(--text-muted)', cursor: 'pointer' }}
                  title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                >
                  {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>

                {/* Layer Type Icon */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {getLayerIcon(layer)}
                </div>

                {/* Layer Name & Reconstructed Badge */}
                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: isSelected ? 500 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {layer.name}
                  </span>

                  {layer.reconstructed?.isReconstructed && (
                    <span
                      style={{
                        fontSize: '9px',
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        color: '#A78BFA',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        flexShrink: 0,
                      }}
                      title={`Reconstructed element (${layer.reconstructed.confidence}% confidence)`}
                    >
                      <Sparkles size={8} />
                      {layer.reconstructed.confidence}%
                    </span>
                  )}
                </div>

                {/* Layer Actions (Lock, Up, Down, Duplicate, Delete) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLock(layer.id);
                    }}
                    style={{ color: layer.locked ? 'var(--status-warning)' : 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                  >
                    {layer.locked ? <Lock size={13} /> : <Unlock size={13} />}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBringForward(layer.id);
                    }}
                    style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    title="Bring Forward"
                  >
                    <ChevronUp size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSendBackward(layer.id);
                    }}
                    style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    title="Send Backward"
                  >
                    <ChevronDown size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateLayer(layer.id);
                    }}
                    style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    title="Duplicate Layer"
                  >
                    <Copy size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLayer(layer.id);
                    }}
                    style={{ color: 'var(--status-error)', cursor: 'pointer', padding: '2px' }}
                    title="Delete Layer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
