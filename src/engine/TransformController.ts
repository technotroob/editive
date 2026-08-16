import { EditorLayer } from './LayerModel';

export type HandleType = 
  | 'nw' | 'n' | 'ne' 
  | 'e'  | 'se' | 's' 
  | 'sw' | 'w' 
  | 'rotate' 
  | 'body' 
  | 'none';

export interface HandlePoint {
  type: HandleType;
  x: number;
  y: number;
}

export class TransformController {
  public static readonly HANDLE_SIZE = 8;
  public static readonly ROTATE_OFFSET = 24;

  /**
   * Returns transformed screen/canvas coordinates of 8 resize handles + 1 rotation handle
   */
  public static getHandles(layer: EditorLayer): HandlePoint[] {
    const cx = layer.x + layer.width / 2;
    const cy = layer.y + layer.height / 2;
    const rad = (layer.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const hw = layer.width / 2;
    const hh = layer.height / 2;

    const localPoints: { type: HandleType; lx: number; ly: number }[] = [
      { type: 'nw', lx: -hw, ly: -hh },
      { type: 'n',  lx: 0,   ly: -hh },
      { type: 'ne', lx: hw,  ly: -hh },
      { type: 'e',  lx: hw,  ly: 0 },
      { type: 'se', lx: hw,  ly: hh },
      { type: 's',  lx: 0,   ly: hh },
      { type: 'sw', lx: -hw, ly: hh },
      { type: 'w',  lx: -hw, ly: 0 },
      { type: 'rotate', lx: 0, ly: -hh - this.ROTATE_OFFSET },
    ];

    return localPoints.map((p) => {
      const x = cx + p.lx * cos - p.ly * sin;
      const y = cy + p.lx * sin + p.ly * cos;
      return { type: p.type, x, y };
    });
  }

  /**
   * Hit test a point against handles and layer body
   */
  public static hitTest(
    px: number,
    py: number,
    layer: EditorLayer,
    zoom = 1
  ): HandleType {
    const handles = this.getHandles(layer);
    const threshold = (this.HANDLE_SIZE + 4) / zoom;

    // 1. Check handles first
    for (const h of handles) {
      const dist = Math.hypot(px - h.x, py - h.y);
      if (dist <= threshold) {
        return h.type;
      }
    }

    // 2. Check if inside layer body (accounting for rotation)
    const cx = layer.x + layer.width / 2;
    const cy = layer.y + layer.height / 2;
    const rad = (-layer.rotation * Math.PI) / 180; // reverse rotate point into local coords
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const dx = px - cx;
    const dy = py - cy;
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;

    const hw = layer.width / 2;
    const hh = layer.height / 2;

    if (lx >= -hw && lx <= hw && ly >= -hh && ly <= hh) {
      return 'body';
    }

    return 'none';
  }

  /**
   * Render professional bounding box, resize handles, and rotation stem onto canvas overlay
   */
  public static renderSelectionOverlay(
    ctx: CanvasRenderingContext2D,
    layer: EditorLayer,
    zoom = 1
  ): void {
    ctx.save();
    const cx = layer.x + layer.width / 2;
    const cy = layer.y + layer.height / 2;
    const rad = (layer.rotation * Math.PI) / 180;

    ctx.translate(cx, cy);
    ctx.rotate(rad);

    const w = layer.width;
    const h = layer.height;
    const hw = w / 2;
    const hh = h / 2;

    // Bounding Box Line
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 1.5 / zoom;
    ctx.strokeRect(-hw, -hh, w, h);

    // Rotation connector line
    ctx.beginPath();
    ctx.moveTo(0, -hh);
    ctx.lineTo(0, -hh - this.ROTATE_OFFSET);
    ctx.strokeStyle = '#3B82F6';
    ctx.stroke();

    // Draw Handles
    const handleSize = this.HANDLE_SIZE / zoom;
    const halfH = handleSize / 2;

    const handlePositions = [
      [-hw, -hh], [0, -hh], [hw, -hh],
      [hw, 0], [hw, hh], [0, hh],
      [-hw, hh], [-hw, 0],
    ];

    handlePositions.forEach(([hx, hy]) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 1.5 / zoom;
      ctx.fillRect(hx - halfH, hy - halfH, handleSize, handleSize);
      ctx.strokeRect(hx - halfH, hy - halfH, handleSize, handleSize);
    });

    // Draw Rotation Handle Circle
    ctx.beginPath();
    ctx.arc(0, -hh - this.ROTATE_OFFSET, handleSize * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 1.5 / zoom;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
