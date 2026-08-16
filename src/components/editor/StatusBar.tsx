import React from 'react';
import { EditorLayer } from '../../engine/LayerModel';
import { ToolType } from '../../engine/CanvasEngine';

export interface StatusBarProps {
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  activeTool: ToolType;
  selectedLayers: EditorLayer[];
}

export const StatusBar: React.FC<StatusBarProps> = ({
  canvasWidth,
  canvasHeight,
  zoom,
  activeTool,
  selectedLayers,
}) => {
  const selected = selectedLayers.length === 1 ? selectedLayers[0] : null;

  return (
    <footer
      style={{
        height: '28px',
        backgroundColor: 'var(--bg-panel)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        fontSize: '11px',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
        zIndex: 50,
      }}
    >
      {/* Left: Canvas Dimensions & Tool */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>
          Canvas: {canvasWidth} × {canvasHeight} px
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>
          Tool: {activeTool.toUpperCase()}
        </span>
      </div>

      {/* Center: Selected Element Coordinates */}
      <div>
        {selected ? (
          <span style={{ color: 'var(--text-secondary)' }}>
            {selected.name} — X: {selected.x}, Y: {selected.y} | W: {selected.width}, H: {selected.height} | {selected.rotation}°
          </span>
        ) : selectedLayers.length > 1 ? (
          <span style={{ color: 'var(--text-secondary)' }}>
            {selectedLayers.length} elements selected
          </span>
        ) : (
          <span>No selection</span>
        )}
      </div>

      {/* Right: Zoom Level */}
      <div>
        <span>Zoom: {Math.round(zoom * 100)}%</span>
      </div>
    </footer>
  );
};
