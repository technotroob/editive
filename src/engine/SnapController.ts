import { EditorLayer } from './LayerModel';

export interface SnapGuide {
  type: 'horizontal' | 'vertical';
  position: number; // coordinate
  start: number;
  end: number;
}

export interface SnapResult {
  snappedX: number;
  snappedY: number;
  guides: SnapGuide[];
}

export class SnapController {
  private static readonly SNAP_THRESHOLD = 6;

  public static calculateSnap(
    targetLayer: EditorLayer,
    allLayers: EditorLayer[],
    canvasWidth: number,
    canvasHeight: number,
    snapEnabled = true
  ): SnapResult {
    if (!snapEnabled) {
      return { snappedX: targetLayer.x, snappedY: targetLayer.y, guides: [] };
    }

    let snappedX = targetLayer.x;
    let snappedY = targetLayer.y;
    const guides: SnapGuide[] = [];

    const targetCenterX = targetLayer.x + targetLayer.width / 2;
    const targetCenterY = targetLayer.y + targetLayer.height / 2;
    const targetRight = targetLayer.x + targetLayer.width;
    const targetBottom = targetLayer.y + targetLayer.height;

    // 1. Snap to Canvas Center & Edges
    // Horizontal Center
    const canvasCenterX = canvasWidth / 2;
    if (Math.abs(targetCenterX - canvasCenterX) < this.SNAP_THRESHOLD) {
      snappedX = canvasCenterX - targetLayer.width / 2;
      guides.push({
        type: 'vertical',
        position: canvasCenterX,
        start: 0,
        end: canvasHeight,
      });
    }

    // Vertical Center
    const canvasCenterY = canvasHeight / 2;
    if (Math.abs(targetCenterY - canvasCenterY) < this.SNAP_THRESHOLD) {
      snappedY = canvasCenterY - targetLayer.height / 2;
      guides.push({
        type: 'horizontal',
        position: canvasCenterY,
        start: 0,
        end: canvasWidth,
      });
    }

    // Canvas Left / Right
    if (Math.abs(targetLayer.x) < this.SNAP_THRESHOLD) {
      snappedX = 0;
      guides.push({ type: 'vertical', position: 0, start: 0, end: canvasHeight });
    }
    if (Math.abs(targetRight - canvasWidth) < this.SNAP_THRESHOLD) {
      snappedX = canvasWidth - targetLayer.width;
      guides.push({ type: 'vertical', position: canvasWidth, start: 0, end: canvasHeight });
    }

    // Canvas Top / Bottom
    if (Math.abs(targetLayer.y) < this.SNAP_THRESHOLD) {
      snappedY = 0;
      guides.push({ type: 'horizontal', position: 0, start: 0, end: canvasWidth });
    }
    if (Math.abs(targetBottom - canvasHeight) < this.SNAP_THRESHOLD) {
      snappedY = canvasHeight - targetLayer.height;
      guides.push({ type: 'horizontal', position: canvasHeight, start: 0, end: canvasWidth });
    }

    // 2. Snap to other Layers
    const otherLayers = allLayers.filter((l) => l.id !== targetLayer.id && l.visible);
    for (const other of otherLayers) {
      const otherCenterX = other.x + other.width / 2;
      const otherCenterY = other.y + other.height / 2;
      const otherRight = other.x + other.width;
      const otherBottom = other.y + other.height;

      // X Center to X Center
      if (Math.abs(targetCenterX - otherCenterX) < this.SNAP_THRESHOLD) {
        snappedX = otherCenterX - targetLayer.width / 2;
        guides.push({
          type: 'vertical',
          position: otherCenterX,
          start: Math.min(targetLayer.y, other.y),
          end: Math.max(targetBottom, otherBottom),
        });
      }

      // Y Center to Y Center
      if (Math.abs(targetCenterY - otherCenterY) < this.SNAP_THRESHOLD) {
        snappedY = otherCenterY - targetLayer.height / 2;
        guides.push({
          type: 'horizontal',
          position: otherCenterY,
          start: Math.min(targetLayer.x, other.x),
          end: Math.max(targetRight, otherRight),
        });
      }

      // Edge Alignments (Left to Left, Right to Right, Top to Top, Bottom to Bottom)
      if (Math.abs(targetLayer.x - other.x) < this.SNAP_THRESHOLD) {
        snappedX = other.x;
        guides.push({
          type: 'vertical',
          position: other.x,
          start: Math.min(targetLayer.y, other.y),
          end: Math.max(targetBottom, otherBottom),
        });
      }
      if (Math.abs(targetRight - otherRight) < this.SNAP_THRESHOLD) {
        snappedX = otherRight - targetLayer.width;
        guides.push({
          type: 'vertical',
          position: otherRight,
          start: Math.min(targetLayer.y, other.y),
          end: Math.max(targetBottom, otherBottom),
        });
      }
      if (Math.abs(targetLayer.y - other.y) < this.SNAP_THRESHOLD) {
        snappedY = other.y;
        guides.push({
          type: 'horizontal',
          position: other.y,
          start: Math.min(targetLayer.x, other.x),
          end: Math.max(targetRight, otherRight),
        });
      }
      if (Math.abs(targetBottom - otherBottom) < this.SNAP_THRESHOLD) {
        snappedY = otherBottom - targetLayer.height;
        guides.push({
          type: 'horizontal',
          position: otherBottom,
          start: Math.min(targetLayer.x, other.x),
          end: Math.max(targetRight, otherRight),
        });
      }
    }

    return { snappedX, snappedY, guides };
  }
}
