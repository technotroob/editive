import React, { useRef, useEffect } from 'react';
import { CanvasEngine, ToolType } from '../../engine/CanvasEngine';
import { HandleType } from '../../engine/TransformController';

export interface CanvasViewportProps {
  engineRef: React.MutableRefObject<CanvasEngine | null>;
  canvasWidth: number;
  canvasHeight: number;
  activeTool: ToolType;
  hoverHandle: HandleType;
  onDropImage: (file: File) => void;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  engineRef,
  canvasWidth,
  canvasHeight,
  activeTool,
  hoverHandle,
  onDropImage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set cursor according to active tool or hovered handle
  const getCursorStyle = (): string => {
    if (activeTool === 'move') return 'grab';
    if (activeTool === 'draw') return 'crosshair';

    switch (hoverHandle) {
      case 'nw':
      case 'se':
        return 'nwse-resize';
      case 'ne':
      case 'sw':
        return 'nesw-resize';
      case 'n':
      case 's':
        return 'ns-resize';
      case 'e':
      case 'w':
        return 'ew-resize';
      case 'rotate':
        return 'grab';
      case 'body':
        return 'move';
      default:
        return 'default';
    }
  };

  // Handle Drag & Drop Upload onto Canvas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onDropImage(file);
      }
    }
  };

  // Wheel Zoom & Pan handling
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const engine = engineRef.current;
    if (!engine) return;

    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const currentZoom = engine.getZoom();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      engine.setZoom(currentZoom * delta);
    } else {
      // Pan
      const pan = engine.getPan();
      engine.setPan(pan.x - e.deltaX, pan.y - e.deltaY);
    }
  };

  return (
    <main
      ref={containerRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onWheel={handleWheel}
      style={{
        flex: 1,
        backgroundColor: 'var(--bg-workspace)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: getCursorStyle(),
      }}
    >
      {/* Canvas Element with Professional Studio Shadow */}
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onPointerDown={(e) => engineRef.current?.handlePointerDown(e)}
        onPointerMove={(e) => engineRef.current?.handlePointerMove(e)}
        onPointerUp={() => engineRef.current?.handlePointerUp()}
        style={{
          boxShadow: 'var(--shadow-canvas)',
          borderRadius: '2px',
          backgroundColor: '#FFFFFF',
          touchAction: 'none',
        }}
      />
    </main>
  );
};
